"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Send, Sparkles, AlertCircle, RefreshCw, Info } from "lucide-react"
import { BeraterChatEmpfehlung } from "./berater/BeraterChatEmpfehlung"
import { findMatchingAdvisors } from "@/lib/berater-data"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: number
  showAdvisorRecommendation?: boolean
  isError?: boolean
  retryId?: string // ID der Nachricht, die wiederholt werden soll
  isLocalFallback?: boolean // Kennzeichnet, ob die Antwort vom lokalen Fallback-System stammt
}

interface CareerAdvisorChatProps {
  personalityType: any
  dimensionScores: any
}

export function CareerAdvisorChat({ personalityType, dimensionScores }: CareerAdvisorChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [recommendedAdvisors, setRecommendedAdvisors] = useState<any[]>([])
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)
  const [useLocalMode, setUseLocalMode] = useState(false) // Lokaler Modus ist dauerhaft deaktiviert
  const [debugMode, setDebugMode] = useState(false)
  const [networkInfo, setNetworkInfo] = useState<string | null>(null)
  const [apiTestResult, setApiTestResult] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0) // Zähler für Wiederholungsversuche
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Debug-Logging für die übergebenen Props
  useEffect(() => {
    console.log("Persönlichkeitstyp in Chat:", personalityType?.title)
    console.log("Dimensionswerte in Chat:", dimensionScores)
  }, [personalityType, dimensionScores])

  // Standortbestimmung
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Fallback auf Zürich
          setUserLocation({ lat: 47.3769, lng: 8.5417 })
        },
      )
    } else {
      // Fallback auf Zürich
      setUserLocation({ lat: 47.3769, lng: 8.5417 })
    }
  }, [])

  // Generiere personalisierte Fragen basierend auf Persönlichkeitstyp und Dimensionswerten
  useEffect(() => {
    if (personalityType && dimensionScores) {
      try {
        const personalizedQuestions = generatePersonalizedQuestions(personalityType, dimensionScores)
        setSuggestedQuestions(personalizedQuestions)

        // Speichern der generierten Fragen im localStorage, um Wiederholungen zu vermeiden
        localStorage.setItem("lastSuggestedQuestions", JSON.stringify(personalizedQuestions))
      } catch (error) {
        console.error("Fehler beim Generieren der personalisierten Fragen:", error)
      }
    }
  }, [personalityType, dimensionScores])

  // Aktualisiere die vorgeschlagenen Fragen nach jeder KI-Antwort
  useEffect(() => {
    if (messages.length > 1 && messages[messages.length - 1].sender === "ai" && personalityType && dimensionScores) {
      try {
        // Generiere neue kontextbezogene Fragen basierend auf dem letzten Nachrichtenaustausch
        const lastMessage = messages[messages.length - 1].content
        const contextualQuestions = generateContextualQuestions(lastMessage, personalityType, dimensionScores)

        // Stelle sicher, dass die neuen Fragen sich von den vorherigen unterscheiden
        const lastQuestionsStr = localStorage.getItem("lastSuggestedQuestions") || "[]"
        const lastQuestions = JSON.parse(lastQuestionsStr)
        const uniqueQuestions = contextualQuestions.filter((q) => !lastQuestions.includes(q))

        // Wenn genügend neue Fragen vorhanden sind, verwende diese
        if (uniqueQuestions.length >= 3) {
          const newQuestions = uniqueQuestions.slice(0, 5)
          setSuggestedQuestions(newQuestions)
          localStorage.setItem("lastSuggestedQuestions", JSON.stringify(newQuestions))
        } else {
          // Andernfalls generiere komplett neue Fragen
          const freshQuestions = generateFreshQuestions(personalityType, dimensionScores, lastQuestions)
          setSuggestedQuestions(freshQuestions)
          localStorage.setItem("lastSuggestedQuestions", JSON.stringify(freshQuestions))
        }
      } catch (error) {
        console.error("Fehler beim Aktualisieren der Fragen:", error)
      }
    }
  }, [messages, personalityType, dimensionScores])

  useEffect(() => {
    // Bei jeder Session eine neue Begrüßungsnachricht senden, wenn personalityType vorhanden ist
    if (personalityType && dimensionScores) {
      try {
        // Immer mit einer neuen Begrüßungsnachricht beginnen
        const welcomeMessage: Message = {
          id: `ai-${Date.now()}`,
          content: `Hallo! Ich bin dein persönlicher KI-Coach. Ich kann dir helfen, deine Ergebnisse als "${personalityType.title}" besser zu verstehen und konkrete nächste Schritte für deine Karriere zu planen. Was möchtest du wissen?`,
          sender: "ai",
          timestamp: Date.now(),
        }
        setMessages([welcomeMessage])

        // Lösche alten Chat-Verlauf
        localStorage.removeItem("careerAdvisorChat")
      } catch (error) {
        console.error("Fehler beim Initialisieren des Chats:", error)
      }
    }
  }, [personalityType, dimensionScores])

  useEffect(() => {
    // Chat-Verlauf im localStorage speichern
    if (messages.length > 0) {
      try {
        localStorage.setItem("careerAdvisorChat", JSON.stringify(messages))
      } catch (error) {
        console.error("Fehler beim Speichern des Chat-Verlaufs:", error)
      }
    }
  }, [messages])

  useEffect(() => {
    // Automatisches Scrollen zum Ende des Chats
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Funktion zum Wiederholen einer Nachricht
  const handleRetry = async (retryId: string) => {
    // Finde die Nachricht, die wiederholt werden soll
    const messageToRetry = messages.find((msg) => msg.id === retryId)
    if (!messageToRetry || messageToRetry.sender !== "user") return

    // Finde den Index der Nachricht
    const msgIndex = messages.findIndex((msg) => msg.id === retryId)
    if (msgIndex === -1) return

    // Entferne alle Nachrichten nach der zu wiederholenden Nachricht
    const updatedMessages = messages.slice(0, msgIndex + 1)
    setMessages(updatedMessages)

    // Setze isRetrying, um zu verhindern, dass der Benutzer während des Wiederholens weitere Nachrichten sendet
    setIsRetrying(true)
    setDebugInfo(null)

    // Erhöhe den Retry-Zähler
    setRetryCount((prev) => prev + 1)

    // Wenn wir bereits mehrmals versucht haben und es immer noch nicht funktioniert,
    // zeige eine Fehlermeldung
    if (retryCount >= 2) {
      const infoMessage: Message = {
        id: `ai-info-${Date.now()}`,
        content:
          "Nach mehreren erfolglosen Versuchen konnte keine Verbindung hergestellt werden. Bitte versuche es später erneut.",
        sender: "ai",
        timestamp: Date.now(),
        isError: true,
      }
      setMessages((prev) => [...updatedMessages, infoMessage])
    }

    // Sende die Nachricht erneut
    await sendMessageToAPI(messageToRetry.content, updatedMessages)

    // Setze isRetrying zurück
    setIsRetrying(false)
  }

  // Funktion zum Umschalten des lokalen Modus
  const toggleLocalMode = () => {
    // Lokaler Modus ist deaktiviert, diese Funktion tut nichts mehr
    console.log("Lokaler Modus ist deaktiviert")
  }

  const toggleDebugMode = () => {
    setDebugMode((prev) => !prev)
    if (!debugMode) {
      // Sammle Netzwerkinformationen, wenn der Debug-Modus aktiviert wird
      const connectionInfo = navigator.connection
        ? `Typ: ${navigator.connection.effectiveType}, RTT: ${navigator.connection.rtt}ms`
        : "Nicht verfügbar"

      setNetworkInfo(`
Browser: ${navigator.userAgent}
Plattform: ${navigator.platform}
Online: ${navigator.onLine ? "Ja" : "Nein"}
Verbindung: ${connectionInfo}
    `)
    }
  }

  const testApiConnection = async () => {
    try {
      setApiTestResult("Test wird ausgeführt...")

      // Einfache Anfrage an die API senden
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "Du bist ein hilfreicher Assistent." },
            { role: "user", content: "Sende eine kurze Testantwort." },
          ],
        }),
      })

      // Status und Header prüfen
      const headers = {}
      response.headers.forEach((value, key) => {
        headers[key] = value
      })

      // Antwort lesen
      const text = await response.text()
      let json
      try {
        json = JSON.parse(text)
      } catch (e) {
        json = { error: "Keine gültige JSON-Antwort" }
      }

      setApiTestResult(`
Status: ${response.status} ${response.statusText}
Headers: ${JSON.stringify(headers, null, 2)}
Body: ${JSON.stringify(json, null, 2)}
    `)
    } catch (error) {
      setApiTestResult(`Fehler beim API-Test: ${error.message}`)
    }
  }

  // Füge diese neue Funktion zur CareerAdvisorChat-Komponente hinzu:

  const testApiKey = async () => {
    try {
      setApiTestResult("API-Schlüssel wird getestet...")

      // Direkte Anfrage an den API-Schlüssel-Test-Endpunkt
      const response = await fetch("/api/test-key", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.status === "success") {
        setApiTestResult(`
API-Schlüssel-Test: ERFOLGREICH
Format: ${data.keyFormat.prefix}...${data.keyFormat.suffix}
Länge: ${data.keyFormat.length} Zeichen
      `)
      } else {
        setApiTestResult(`
API-Schlüssel-Test: FEHLGESCHLAGEN
Status: ${response.status}
Nachricht: ${data.message || "Unbekannter Fehler"}
Details: ${JSON.stringify(data.error || {}, null, 2)}
Format: ${data?.keyFormat?.prefix || "N/A"}...${data?.keyFormat?.suffix || "N/A"}
Länge: ${data?.keyFormat?.length || "Unbekannt"} Zeichen
      `)
      }
    } catch (error) {
      setApiTestResult(`Fehler beim API-Schlüssel-Test: ${error.message}`)
    }
  }

  // Verbesserte lokale Antwortgenerierung mit mehr Kontext und besseren Antworten
  const generateLocalResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Erweiterte Fallback-Antworten basierend auf Schlüsselwörtern
    if (input.includes("stärke") || input.includes("stärken")) {
      return `Als ${personalityType.title} liegt deine Stärke besonders in deiner ${translateDimension(personalityType.primaryDimension)}. 

Du kannst diese Stärke nutzen, indem du Rollen suchst, die diese Eigenschaft schätzen und fördern. Zum Beispiel könnten folgende Bereiche gut zu dir passen:

1. ${getStrengthRecommendation(personalityType.primaryDimension)}
2. ${getStrengthRecommendation(personalityType.secondaryDimension)}

Denke daran, dass deine Persönlichkeit nur ein Aspekt deiner Karriereentscheidung ist. Deine Fähigkeiten, Interessen und Werte sind ebenso wichtig.`
    }

    if (input.includes("schwäche") || input.includes("schwächen") || input.includes("herausforderung")) {
      // Finde die schwächste Dimension
      const weakestDimension = Object.entries(dimensionScores).sort(([, a], [, b]) => a - b)[0][0]

      return `Deine Herausforderung könnte in der Dimension ${translateDimension(weakestDimension as any)} liegen. 

Es ist wichtig zu verstehen, dass dies keine Schwäche im eigentlichen Sinne ist, sondern ein Bereich, in dem du dich weiterentwickeln kannst. Hier sind einige Tipps:

1. ${getWeaknessAdvice(weakestDimension as any)}
2. Suche nach Umgebungen, die deine Stärken wertschätzen und dir gleichzeitig Raum geben, an deinen Herausforderungen zu arbeiten.
3. Betrachte diese Dimension als Wachstumschance, nicht als Hindernis.`
    }

    if (input.includes("beruf") || input.includes("karriere") || input.includes("job") || input.includes("arbeit")) {
      return `Basierend auf deinem Persönlichkeitstyp (${personalityType.title}) könnten folgende Berufsfelder interessant sein:

1. ${getCareerRecommendation(personalityType.primaryDimension)}
2. ${getCareerRecommendation(personalityType.secondaryDimension)}
3. Berufe, die eine Kombination aus ${translateDimension(personalityType.primaryDimension)} und ${translateDimension(personalityType.secondaryDimension)} erfordern.

Für eine tiefergehende Beratung empfehle ich dir, mit einem unserer Karriereberater zu sprechen, die dir personalisierte Empfehlungen geben können.`
    }

    if (
      input.includes("weiterbildung") ||
      input.includes("lernen") ||
      input.includes("kurs") ||
      input.includes("studium")
    ) {
      return `Für deinen Persönlichkeitstyp (${personalityType.title}) könnten folgende Weiterbildungen wertvoll sein:

1. ${getEducationRecommendation(personalityType.primaryDimension)}
2. ${getEducationRecommendation(personalityType.secondaryDimension)}

Diese Weiterbildungen können dir helfen, deine natürlichen Stärken weiter auszubauen und gleichzeitig neue Fähigkeiten zu entwickeln, die in deiner Karriere wertvoll sein könnten.`
    }

    if (
      input.includes("interview") ||
      input.includes("bewerbung") ||
      input.includes("vorstellungsgespräch") ||
      input.includes("gespräch")
    ) {
      return `Als ${personalityType.title} kannst du in Bewerbungsgesprächen folgende Stärken hervorheben:

1. ${getInterviewTip(personalityType.primaryDimension)}
2. ${getInterviewTip(personalityType.secondaryDimension)}

Bereite dich darauf vor, konkrete Beispiele zu nennen, wie du diese Stärken in der Vergangenheit eingesetzt hast. Authentizität ist wichtig - präsentiere dich so, wie du wirklich bist, damit du einen Job findest, der wirklich zu dir passt.`
    }

    if (input.includes("team") || input.includes("zusammenarbeit") || input.includes("kollegen")) {
      return `Als ${personalityType.title} mit Stärken in ${translateDimension(personalityType.primaryDimension)} und ${translateDimension(personalityType.secondaryDimension)} hast du folgende Teamqualitäten:

1. ${getTeamworkTip(personalityType.primaryDimension)}
2. ${getTeamworkTip(personalityType.secondaryDimension)}

In Teams funktionierst du am besten, wenn du diese Stärken einbringen kannst und gleichzeitig die Möglichkeit hast, an deinen Herausforderungen zu arbeiten.`
    }

    if (input.includes("stress") || input.includes("druck") || input.includes("belastung")) {
      return `Als ${personalityType.title} reagierst du auf Stress typischerweise so:

1. ${getStressResponse(personalityType.primaryDimension)}
2. ${getStressResponse(personalityType.secondaryDimension)}

Hier sind einige Strategien, die dir helfen können, mit Stress umzugehen:

1. ${getStressCopingStrategy(personalityType.primaryDimension)}
2. ${getStressCopingStrategy(personalityType.secondaryDimension)}

Denke daran, dass jeder Mensch individuell ist und diese Strategien an deine persönlichen Bedürfnisse angepasst werden sollten.`
    }

    // Versuche, eine kontextbezogene Antwort zu generieren, indem wir den Verlauf berücksichtigen
    if (messages.length > 0) {
      const lastAIMessage = messages.filter((msg) => msg.sender === "ai").pop()
      if (lastAIMessage) {
        // Wenn die letzte KI-Nachricht bestimmte Schlüsselwörter enthält, generiere eine passende Antwort
        const lastContent = lastAIMessage.content.toLowerCase()

        if (lastContent.includes("stärke") && input.includes("beispiel")) {
          return `Hier sind konkrete Beispiele, wie du deine Stärke in ${translateDimension(personalityType.primaryDimension)} nutzen kannst:

1. ${getStrengthExample(personalityType.primaryDimension)}
2. ${getStrengthExample(personalityType.secondaryDimension)}

Diese Beispiele zeigen, wie du deine natürlichen Stärken in verschiedenen beruflichen Situationen einsetzen kannst.`
        }

        if (lastContent.includes("beruf") && (input.includes("mehr") || input.includes("detail"))) {
          return `Hier sind detailliertere Informationen zu Berufen, die zu deinem Persönlichkeitstyp passen:

Für deine Stärke in ${translateDimension(personalityType.primaryDimension)}:
${getDetailedCareerInfo(personalityType.primaryDimension)}

Für deine Stärke in ${translateDimension(personalityType.secondaryDimension)}:
${getDetailedCareerInfo(personalityType.secondaryDimension)}

Diese Berufe bieten dir die Möglichkeit, deine natürlichen Stärken einzusetzen und dich beruflich zu entfalten.`
        }
      }
    }

    // Standard-Antwort
    return `Als ${personalityType.title} hast du besondere Stärken in den Bereichen ${translateDimension(personalityType.primaryDimension)} und ${translateDimension(personalityType.secondaryDimension)}. 

Ich empfehle dir, diese Stärken in deiner beruflichen Laufbahn zu nutzen. Hier sind einige allgemeine Tipps:

1. Suche nach Rollen, die deine natürlichen Stärken nutzen
2. Arbeite in Umgebungen, die deine Persönlichkeit wertschätzen
3. Entwickle Strategien, um mit Herausforderungen umzugehen, die aus deinen weniger ausgeprägten Dimensionen entstehen können

Wenn du spezifischere Fragen hast, z.B. zu Stärken, Schwächen, Berufsempfehlungen oder Bewerbungsgesprächen, stehe ich gerne zur Verfügung.`
  }

  // Extrahiere die API-Anfrage in eine separate Funktion für bessere Wiederverwendbarkeit
  // Diese Funktion sendet Nachrichten an unsere eigene API-Route, nicht direkt an OpenAI
  const sendMessageToAPI = async (userInput: string, currentMessages: Message[]) => {
    setIsTyping(true)

    try {
      // Lokaler Modus ist deaktiviert, wir verwenden immer die API

      // Vorbereitung des Kontexts für die API-Anfrage
      const chatHistory = currentMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      }))

      // Persönlichkeitsinformationen für den Kontext
      const personalityContext = `
    Persönlichkeitstyp: ${personalityType.title}
    Primäre Dimension: ${personalityType.primaryDimension} (${translateDimension(personalityType.primaryDimension)})
    Sekundäre Dimension: ${personalityType.secondaryDimension} (${translateDimension(personalityType.secondaryDimension)})
    Dimensionswerte: ${JSON.stringify(dimensionScores)}
  `

      // System-Nachricht für den KI-Coach
      const systemMessage = {
        role: "system",
        content: `Du bist ein KI-Karrierecoach für die True North App. Du hilfst Nutzern, ihre Persönlichkeitstestergebnisse zu verstehen und berufliche Entscheidungen zu treffen.
    
    Hier sind die Persönlichkeitsinformationen des aktuellen Nutzers:
    ${personalityContext}
    
    Wichtige Regeln:
    1. Antworte immer auf Deutsch
    2. Beziehe dich auf die Persönlichkeitsdimensionen des Nutzers
    3. Gib konkrete, praktische Ratschläge
    4. Wenn der Nutzer nach einem persönlichen Berater fragt oder komplexe Fragen hat, empfiehl ein Gespräch mit einem echten Karriereberater
    5. Halte deine Antworten prägnant und fokussiert (max. 150 Wörter)
    6. Verwende einen freundlichen, ermutigenden Ton`,
      }

      // Aktuelle Nutzerfrage
      const userQuery = {
        role: "user",
        content: userInput,
      }

      if (debugMode) {
        console.log("Sende Anfrage an API:", {
          systemMessage: systemMessage.content.substring(0, 50) + "...",
          userQuery: userQuery.content,
          chatHistoryLength: chatHistory.length,
        })
      }

      // API-Anfrage an den Server mit Timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 Sekunden Timeout

      try {
        // API-Anfrage an UNSERE EIGENE SERVER-ROUTE, nicht direkt an OpenAI
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [systemMessage, ...chatHistory, userQuery],
          }),
          signal: controller.signal,
        })

        // Timeout löschen
        clearTimeout(timeoutId)

        if (debugMode) {
          console.log("API-Antwort Status:", response.status)
        }

        // Zuerst den Text der Antwort lesen
        const responseText = await response.text()
        if (debugMode) {
          console.log("Rohe API-Antwort:", responseText.substring(0, 100) + "...")
        }

        // Versuchen, den Text als JSON zu parsen
        let responseData
        try {
          responseData = JSON.parse(responseText)
        } catch (jsonError) {
          console.error("Fehler beim Parsen der JSON-Antwort:", jsonError)
          setDebugInfo(`Nicht-JSON-Antwort: ${responseText}`)
          throw new Error(`Server antwortete mit nicht-JSON-Inhalt: ${responseText.substring(0, 100)}...`)
        }

        // Prüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
          console.error("API-Fehler:", response.status, responseData)
          setDebugInfo(JSON.stringify(responseData, null, 2))

          // Bei API-Fehlern zeigen wir eine Fehlermeldung an
          if (
            responseData.useLocalFallback ||
            responseData.code === "insufficient_quota" ||
            responseData.code === "invalid_api_key"
          ) {
            console.log("API-Fehler:", responseData.code || response.status)

            // Füge eine Fehlermeldung hinzu
            let errorMessageContent = "Es gab ein Problem mit der KI-Verbindung. Bitte versuche es später erneut."

            if (responseData.code === "insufficient_quota") {
              errorMessageContent = "Das API-Kontingent wurde überschritten. Bitte versuche es später erneut."
            } else if (responseData.code === "invalid_api_key") {
              errorMessageContent = "Es gibt ein Problem mit dem API-Schlüssel. Bitte versuche es später erneut."
            }

            const infoMessage: Message = {
              id: `ai-info-${Date.now()}`,
              content: errorMessageContent,
              sender: "ai",
              timestamp: Date.now(),
              isError: true,
            }

            setMessages((prev) => [...prev, infoMessage])
            return false // Fehlerhafte Antwort
          }

          throw new Error(`API-Fehler: ${response.status} ${responseData.error || response.statusText}`)
        }

        // Prüfen, ob die Antwort den erwarteten Inhalt hat
        if (!responseData.content) {
          console.error("Ungültiges Antwortformat:", responseData)
          setDebugInfo(JSON.stringify(responseData, null, 2))
          throw new Error("Ungültiges Antwortformat: content fehlt")
        }

        // Prüfen, ob ein Berater empfohlen werden sollte
        const shouldRecommendAdvisor = checkForAdvisorRecommendation(userInput, responseData.content)

        // KI-Antwort hinzufügen
        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          content: responseData.content,
          sender: "ai",
          timestamp: Date.now(),
          showAdvisorRecommendation: shouldRecommendAdvisor,
        }

        setMessages((prev) => [...prev, aiMessage])

        // Wenn ein Berater empfohlen werden soll, lade passende Berater
        if (shouldRecommendAdvisor && personalityType.primaryDimension) {
          const advisors = findMatchingAdvisors(personalityType.primaryDimension, userLocation)
          setRecommendedAdvisors(advisors)
        }

        return true // Erfolgreiche Antwort
      } catch (fetchError) {
        // Timeout löschen, falls noch nicht geschehen
        clearTimeout(timeoutId)

        // Prüfen, ob es sich um einen Timeout handelt
        if (fetchError.name === "AbortError") {
          console.error("API-Anfrage Timeout")
          setDebugInfo("API-Anfrage Timeout nach 30 Sekunden")
          throw new Error("Die API-Anfrage hat das Zeitlimit überschritten.")
        }

        throw fetchError
      }
    } catch (error: any) {
      console.error("Fehler bei der Kommunikation mit der KI:", error)

      const errorMessage: Message = {
        id: `ai-${Date.now()}`,
        content:
          "Es gab ein technisches Problem bei der Verbindung mit der KI. Bitte versuche es später erneut oder klicke auf 'Wiederholen'.",
        sender: "ai",
        timestamp: Date.now(),
        isError: true,
        retryId: currentMessages[currentMessages.length - 1]?.id, // ID der letzten Benutzernachricht für Wiederholungsversuche
      }

      setMessages((prev) => [...prev, errorMessage])
      return false // Fehlerhafte Antwort
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = async () => {
    if (input.trim() === "" || !personalityType || !dimensionScores || isRetrying) return

    // Debug-Info zurücksetzen
    setDebugInfo(null)

    // Nutzernachricht hinzufügen
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: "user",
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Sende die Nachricht an die API
    await sendMessageToAPI(userMessage.content, [...messages, userMessage])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
    // Kurze Verzögerung, um die Frage anzuzeigen, bevor sie gesendet wird
    setTimeout(() => {
      handleSend()
    }, 100)
  }

  // Bestimme, ob Fragevorschläge angezeigt werden sollen
  const shouldShowSuggestions = () => {
    // Zeige Vorschläge immer, außer wenn der Nutzer gerade tippt
    return !isTyping && input.trim() === ""
  }

  // Fokus auf das Eingabefeld setzen, wenn auf den Chat-Container geklickt wird
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Wenn personalityType oder dimensionScores nicht vorhanden sind, zeige eine Fehlermeldung
  if (!personalityType || !dimensionScores) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-red-500 mb-2">Persönlichkeitsdaten konnten nicht geladen werden.</p>
          <p className="text-gray-600">Bitte kehre zum Dashboard zurück und versuche es erneut.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Lokaler Modus Banner */}
      {useLocalMode && (
        <div className="bg-amber-50 p-2 text-sm text-amber-800 flex items-center justify-between">
          <div className="flex items-center">
            <Info size={16} className="mr-2" />
            <span>Lokaler Modus aktiv: Antworten werden ohne API-Anfragen generiert</span>
          </div>
          <button onClick={toggleLocalMode} className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded">
            Deaktivieren
          </button>
        </div>
      )}

      {debugMode && (
        <div className="bg-amber-50 p-2 text-xs border-t border-amber-200">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold">Debug-Modus</span>
            <div className="flex gap-2">
              <button onClick={testApiConnection} className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded">
                API testen
              </button>
              <button onClick={testApiKey} className="text-xs bg-amber-100 hover:bg-amber-200 px-2 py-1 rounded">
                API-Schlüssel testen
              </button>
            </div>
          </div>

          {networkInfo && (
            <div className="mb-2">
              <div className="font-bold">Netzwerk-Info:</div>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-20 bg-white p-1 rounded">
                {networkInfo}
              </pre>
            </div>
          )}

          {apiTestResult && (
            <div className="mb-2">
              <div className="font-bold">API-Test:</div>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40 bg-white p-1 rounded">
                {apiTestResult}
              </pre>
            </div>
          )}

          {debugInfo && (
            <div className="mb-2">
              <div className="font-bold">Letzte Fehler-Info:</div>
              <pre className="whitespace-pre-wrap text-xs overflow-auto max-h-40 bg-white p-1 rounded">{debugInfo}</pre>
            </div>
          )}
        </div>
      )}

      {/* Chat-Nachrichten - flex-1 sorgt dafür, dass dieser Bereich den verfügbaren Platz einnimmt */}
      <div
        className="flex-1 overflow-y-auto p-3 pb-2"
        ref={chatContainerRef}
        style={{ WebkitOverflowScrolling: "touch" }} // Für besseres Scrolling auf iOS
      >
        {messages.map((message, index) => (
          <div key={message.id}>
            <div className={`mb-2 ${message.sender === "user" ? "flex justify-end" : "flex justify-start"}`}>
              <div
                className={`max-w-[85%] p-2.5 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : message.isError
                      ? "bg-amber-50 text-gray-800 border border-amber-200"
                      : message.isLocalFallback
                        ? "bg-gray-50 text-gray-800 border border-gray-200"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                    {message.isError ? (
                      <>
                        <AlertCircle size={12} className="text-amber-500" />
                        <span className="text-amber-500">KI-Coach (Fehler)</span>
                      </>
                    ) : message.isLocalFallback ? (
                      <>
                        <Info size={12} className="text-gray-500" />
                        <span className="text-gray-500">KI-Coach (Lokal)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} />
                        <span>KI-Coach</span>
                      </>
                    )}
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1 text-right">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>

            {message.sender === "ai" && message.isError && message.retryId && (
              <div className="flex justify-start mb-4 gap-2">
                <button
                  onClick={() => handleRetry(message.retryId!)}
                  disabled={isRetrying || isTyping}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  <RefreshCw size={12} className={isRetrying ? "animate-spin" : ""} />
                  <span>{isRetrying ? "Wird wiederholt..." : "Wiederholen"}</span>
                </button>
              </div>
            )}

            {/* Beraterempfehlung nach bestimmten KI-Antworten anzeigen */}
            {message.sender === "ai" && message.showAdvisorRecommendation && recommendedAdvisors.length > 0 && (
              <BeraterChatEmpfehlung berater={recommendedAdvisors} />
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-2">
            <div className="bg-gray-100 text-gray-800 p-2.5 rounded-lg">
              <div className="flex items-center gap-2 mb-1 text-xs text-gray-500">
                <Sparkles size={12} />
                <span>KI-Coach</span>
              </div>
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "600ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Debug-Informationen anzeigen */}
        {debugInfo && (
          <div className="my-2 p-2 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-40">
            <div className="font-bold mb-1">Debug-Info:</div>
            <pre>{debugInfo}</pre>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Eingabefeld - fixiert am unteren Rand */}
      <div className="border-t border-gray-200 p-2 bg-white shrink-0">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nachricht an KI-Coach..."
            className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-gray-800"
            rows={1}
            disabled={isRetrying}
          />
          <button
            onClick={handleSend}
            disabled={input.trim() === "" || isTyping || isRetrying}
            className={`ml-2 p-2 rounded-full ${
              input.trim() === "" || isTyping || isRetrying ? "text-gray-400" : "text-blue-500 hover:bg-blue-50"
            }`}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Lokaler Modus Toggle */}
        <div className="flex justify-end mt-1 gap-2">
          <button
            onClick={toggleDebugMode}
            className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <span>{debugMode ? "Debug-Modus ausschalten" : "Debug-Modus einschalten"}</span>
            <AlertCircle size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// Hilfsfunktionen für die KI-Antworten
function translateDimension(dimension: string): string {
  const translations: Record<string, string> = {
    O: "Offenheit für Erfahrungen",
    C: "Gewissenhaftigkeit",
    E: "Extraversion",
    A: "Verträglichkeit",
    N: "Neurotizismus",
  }
  return translations[dimension] || dimension
}

// Neue Funktion zur Prüfung, ob ein Berater empfohlen werden sollte
function checkForAdvisorRecommendation(input: string, aiResponse: string): boolean {
  const inputLower = input.toLowerCase()
  const responseLower = aiResponse.toLowerCase()

  // Prüfe Schlüsselwörter in der Nutzereingabe
  const userKeywords = ["berater", "persönlich", "treffen", "gespräch", "coach", "beratung", "hilfe", "konkret"]

  // Prüfe Schlüsselwörter in der KI-Antwort
  const aiKeywords = ["berater", "persönlich", "empfehlen", "empfehlung", "gespräch", "beratung", "kontakt"]

  // Wenn die KI explizit einen Berater empfiehlt
  if (aiKeywords.some((keyword) => responseLower.includes(keyword))) {
    return true
  }

  // Wenn der Nutzer explizit nach einem Berater fragt
  if (userKeywords.some((keyword) => inputLower.includes(keyword))) {
    return true
  }

  return false
}

// Neue Hilfsfunktionen für den lokalen Modus
function getStrengthRecommendation(dimension: string): string {
  const recommendations: Record<string, string> = {
    O: "Kreative Berufe, Forschung, Innovation und Entwicklung",
    C: "Projektmanagement, Qualitätssicherung, Finanzwesen",
    E: "Vertrieb, Marketing, Führungspositionen, Kundenbetreuung",
    A: "Teamarbeit, Beratung, Personalwesen, Sozialberufe",
    N: "Detailarbeit, Qualitätskontrolle, Risikomanagement",
  }
  return recommendations[dimension] || "Berufe, die deine persönlichen Stärken nutzen"
}

function getWeaknessAdvice(dimension: string): string {
  const advice: Record<string, string> = {
    O: "Versuche, regelmäßig neue Erfahrungen zu sammeln und deine Komfortzone zu erweitern",
    C: "Entwickle Systeme und Routinen, die dir helfen, organisierter zu werden",
    E: "Setze dir kleine Ziele für soziale Interaktionen und baue deine sozialen Fähigkeiten schrittweise auf",
    A: "Übe aktives Zuhören und versuche, die Perspektiven anderer besser zu verstehen",
    N: "Lerne Stressmanagement-Techniken wie Meditation oder Achtsamkeit",
  }
  return advice[dimension] || "Arbeite an deinen Herausforderungen mit kleinen, regelmäßigen Übungen"
}

function getCareerRecommendation(dimension: string): string {
  const careers: Record<string, string> = {
    O: "Kreative Berufe (Design, Kunst), Forschung, Beratung, Entrepreneurship",
    C: "Finanzen, Projektmanagement, Qualitätssicherung, Ingenieurwesen, Medizin",
    E: "Vertrieb, Marketing, PR, Management, Eventplanung, Unterricht",
    A: "Beratung, Personalwesen, Gesundheitswesen, Sozialarbeit, Kundenservice",
    N: "Qualitätskontrolle, Forschung, Analyse, Planung, Risikomanagement",
  }
  return careers[dimension] || "Berufe, die zu deinen persönlichen Stärken passen"
}

function getEducationRecommendation(dimension: string): string {
  const education: Record<string, string> = {
    O: "Kreativitätskurse, Innovationsworkshops, interdisziplinäre Studiengänge",
    C: "Projektmanagement-Zertifizierungen, Organisationskurse, Zeitmanagement-Seminare",
    E: "Kommunikationstraining, Führungskräfteentwicklung, Präsentationskurse",
    A: "Teambuilding-Workshops, Konfliktmanagement, Coaching-Ausbildungen",
    N: "Stressmanagement, Resilienztraining, Work-Life-Balance-Kurse",
  }
  return education[dimension] || "Weiterbildungen, die deine beruflichen Ziele unterstützen"
}

function getInterviewTip(dimension: string): string {
  const tips: Record<string, string> = {
    O: "Betone deine Kreativität, Anpassungsfähigkeit und Offenheit für neue Ideen",
    C: "Hebe deine Zuverlässigkeit, Organisationsfähigkeit und Detailorientierung hervor",
    E: "Zeige deine kommunikativen Fähigkeiten, Begeisterungsfähigkeit und soziale Kompetenz",
    A: "Betone deine Teamfähigkeit, Empathie und kooperative Arbeitsweise",
    N: "Präsentiere deine Fähigkeit zur Selbstreflexion und dein Bewusstsein für potenzielle Risiken",
  }
  return tips[dimension] || "Präsentiere authentisch deine persönlichen Stärken"
}

// Neue Hilfsfunktionen für erweiterte lokale Antworten
function getTeamworkTip(dimension: string): string {
  const tips: Record<string, string> = {
    O: "Du bringst kreative Ideen und neue Perspektiven in Teams ein und hilfst, innovative Lösungen zu finden",
    C: "Du bist zuverlässig, organisiert und sorgst dafür, dass Projekte strukturiert und termingerecht abgeschlossen werden",
    E: "Du förderst die Kommunikation im Team, baust Beziehungen auf und sorgst für eine positive Arbeitsatmosphäre",
    A: "Du bist ein guter Vermittler, förderst Zusammenarbeit und hilfst, Konflikte konstruktiv zu lösen",
    N: "Du erkennst potenzielle Probleme frühzeitig und hilfst dem Team, Risiken zu minimieren und Qualität zu sichern",
  }
  return tips[dimension] || "Du bringst wertvolle Perspektiven und Fähigkeiten in Teams ein"
}

function getStressResponse(dimension: string): string {
  const responses: Record<string, string> = {
    O: "Unter Stress könntest du dich in Tagträumen verlieren oder zu viele Ideen gleichzeitig verfolgen",
    C: "Unter Stress könntest du zu perfektionistisch werden oder dich in Details verlieren",
    E: "Unter Stress könntest du überreagieren oder zu viel Bestätigung von anderen suchen",
    A: "Unter Stress könntest du Konflikte vermeiden oder deine eigenen Bedürfnisse vernachlässigen",
    N: "Unter Stress könntest du zu selbstkritisch werden oder dich zu sehr auf negative Aspekte konzentrieren",
  }
  return (
    responses[dimension] ||
    "Unter Stress reagierst du auf eine Weise, die mit deinen Persönlichkeitsmerkmalen zusammenhängt"
  )
}

function getStressCopingStrategy(dimension: string): string {
  const strategies: Record<string, string> = {
    O: "Plane regelmäßige kreative Auszeiten ein, um deine Gedanken zu ordnen und neue Perspektiven zu gewinnen",
    C: "Setze klare Prioritäten und akzeptiere, dass nicht alles perfekt sein muss",
    E: "Finde eine Balance zwischen sozialer Interaktion und Zeit für dich selbst",
    A: "Übe dich darin, deine eigenen Bedürfnisse zu kommunizieren und gesunde Grenzen zu setzen",
    N: "Praktiziere Achtsamkeit und positive Selbstgespräche, um negative Gedankenspiralen zu durchbrechen",
  }
  return (
    strategies[dimension] ||
    "Entwickle Strategien, die zu deiner Persönlichkeit passen und dir helfen, mit Stress umzugehen"
  )
}

function getStrengthExample(dimension: string): string {
  const examples: Record<string, string> = {
    O: "In einem Marketingteam kannst du kreative Kampagnenideen entwickeln, die sich von der Konkurrenz abheben",
    C: "Als Projektmanager kannst du komplexe Aufgaben strukturieren und sicherstellen, dass alle Deadlines eingehalten werden",
    E: "Im Vertrieb kannst du deine kommunikativen Fähigkeiten nutzen, um Kundenbeziehungen aufzubauen und zu pflegen",
    A: "Als Teamleiter kannst du ein harmonisches Arbeitsumfeld schaffen und Konflikte konstruktiv lösen",
    N: "In der Qualitätssicherung kannst du potenzielle Probleme frühzeitig erkennen und Lösungen entwickeln",
  }
  return examples[dimension] || "Du kannst deine Stärken in verschiedenen beruflichen Situationen einsetzen"
}

function getDetailedCareerInfo(dimension: string): string {
  const info: Record<string, string> = {
    O: "- Kreativdirektor: Leitung von kreativen Teams und Entwicklung innovativer Konzepte\n- Forschungswissenschaftler: Erforschung neuer Ideen und Entwicklung von Innovationen\n- Unternehmensberater: Entwicklung kreativer Lösungen für komplexe Geschäftsprobleme",
    C: "- Finanzanalyst: Detaillierte Analyse von Finanzdaten und Erstellung von Berichten\n- Projektmanager: Planung, Organisation und Überwachung von Projekten\n- Qualitätsmanager: Sicherstellung der Einhaltung von Standards und kontinuierliche Verbesserung",
    E: "- Vertriebsleiter: Führung von Vertriebsteams und Entwicklung von Kundenbeziehungen\n- PR-Manager: Kommunikation mit der Öffentlichkeit und Aufbau des Unternehmensimages\n- Event-Manager: Organisation und Durchführung von Veranstaltungen",
    A: "- HR-Manager: Betreuung von Mitarbeitern und Förderung einer positiven Arbeitskultur\n- Mediator: Vermittlung bei Konflikten und Förderung von Kompromissen\n- Sozialarbeiter: Unterstützung von Menschen in schwierigen Lebenssituationen",
    N: "- Risikomanager: Identifizierung und Bewertung potenzieller Risiken\n- Qualitätsprüfer: Sicherstellung der Einhaltung von Standards\n- Finanzcontroller: Überwachung von Finanzen und Identifizierung von Abweichungen",
  }
  return info[dimension] || "Es gibt verschiedene Berufe, die zu deinen Stärken passen"
}

// Die folgenden Funktionen werden nur als Fallback verwendet, wenn die API nicht verfügbar ist
function generatePersonalizedQuestions(personalityType: any, dimensionScores: any): string[] {
  // Einfache Implementierung, die einige grundlegende Fragen zurückgibt
  return [
    `Wie kann ich als ${personalityType.title} meine Karriere am besten voranbringen?`,
    `Welche Unternehmen passen am besten zu meinem Persönlichkeitstyp?`,
    `Wie kann ich meine Stärke in ${translateDimension(personalityType.primaryDimension)} im Arbeitsmarkt nutzen?`,
    "Welche Weiterbildungen passen zu meinem Profil?",
    "Wie kann ich meine Stärken in Bewerbungsgesprächen am besten präsentieren?",
  ]
}

function generateContextualQuestions(lastAIMessage: string, personalityType: any, dimensionScores: any): string[] {
  // Einfache Implementierung, die einige kontextbezogene Fragen zurückgibt
  return [
    "Wie kann ich diese Informationen praktisch in meiner Karriere umsetzen?",
    "Welche weiteren Aspekte sollte ich zu diesem Thema beachten?",
    "Welche Branchen bieten die besten Möglichkeiten für meinen Persönlichkeitstyp?",
    "Welche Ressourcen kannst du mir zu diesem Thema empfehlen?",
    "Kannst du mir Berater in meiner Nähe empfehlen?",
  ]
}

function generateFreshQuestions(personalityType: any, dimensionScores: any, previousQuestions: string[]): string[] {
  // Einfache Implementierung, die einige neue Fragen zurückgibt
  return [
    `Wie kann ich meine Karriere im Jahr ${new Date().getFullYear()} am besten voranbringen?`,
    `Welche spezifischen Stärken meines Persönlichkeitstyps sind in der aktuellen Wirtschaftslage gefragt?`,
    `Welche neuen Trends gibt es im Arbeitsmarkt für Menschen mit meinem Profil?`,
    `Wie kann ich meine Schwächen am besten ausgleichen?`,
    `Welche Weiterbildungsmöglichkeiten passen aktuell am besten zu meinem Karriereprofil?`,
  ]
}
