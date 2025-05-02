"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { createBalancedQuestionSet, dimensionDescriptions, type TestQuestion } from "@/lib/questions"
import { ChevronLeft, ChevronRight, Save, HelpCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TestPage() {
  const [sliderValue, setSliderValue] = useState(3) // Default to middle value
  const [answers, setAnswers] = useState<number[]>([])
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const router = useRouter()
  const isDevelopment = true
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [testProgress, setTestProgress] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const thumbRef = useRef<HTMLDivElement>(null)

  // Lade gespeicherte Antworten und generiere Testfragen
  useEffect(() => {
    // Versuche, gespeicherte Antworten zu laden
    const savedAnswers = localStorage.getItem("testAnswers")
    const savedQuestions = localStorage.getItem("testQuestions")
    const savedIndex = localStorage.getItem("currentQuestionIndex")

    if (savedAnswers && savedQuestions) {
      // Wenn gespeicherte Daten vorhanden sind, lade diese
      setAnswers(JSON.parse(savedAnswers))
      setTestQuestions(JSON.parse(savedQuestions))

      if (savedIndex) {
        setCurrentQuestionIndex(Number.parseInt(savedIndex))
      }
    } else {
      // Andernfalls generiere einen neuen Test
      const newQuestions = createBalancedQuestionSet(15) // 15 Fragen für den Test
      setTestQuestions(newQuestions)
      setAnswers(Array(newQuestions.length).fill(3)) // Default-Antworten
    }

    setIsLoading(false)
  }, [])

  // Aktualisiere den Testfortschritt
  useEffect(() => {
    if (testQuestions.length > 0) {
      setTestProgress(Math.round(((currentQuestionIndex + 1) / testQuestions.length) * 100))
    }
  }, [currentQuestionIndex, testQuestions.length])

  // Wenn wir zur nächsten Frage wechseln, setzen wir den Slider auf den gespeicherten Wert
  useEffect(() => {
    if (answers.length > currentQuestionIndex) {
      setSliderValue(answers[currentQuestionIndex] || 3)
    }
  }, [currentQuestionIndex, answers])

  // Aktualisiere die Position des Thumbs, wenn sich der Slider-Wert ändert
  useEffect(() => {
    if (thumbRef.current) {
      // Berechne die Position des Thumbs basierend auf dem Slider-Wert (1-5)
      const percentage = ((sliderValue - 1) / 4) * 100
      thumbRef.current.style.left = `${percentage}%`
    }
  }, [sliderValue])

  // Speichere den Testfortschritt
  useEffect(() => {
    if (!isLoading && testQuestions.length > 0) {
      localStorage.setItem("testAnswers", JSON.stringify(answers))
      localStorage.setItem("testQuestions", JSON.stringify(testQuestions))
      localStorage.setItem("currentQuestionIndex", currentQuestionIndex.toString())
    }
  }, [answers, currentQuestionIndex, testQuestions, isLoading])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number.parseFloat(e.target.value))
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Aktuelle Antwort speichern
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = Math.round(sliderValue)
      setAnswers(newAnswers)

      // Zur vorherigen Frage wechseln
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    // Aktuelle Antwort speichern
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = Math.round(sliderValue)
    setAnswers(newAnswers)

    if (currentQuestionIndex < testQuestions.length - 1) {
      // Zur nächsten Frage wechseln
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Test abschließen
      finishTest(newAnswers)
    }
  }

  const finishTest = (finalAnswers: number[]) => {
    // Speichere die Testergebnisse
    localStorage.setItem("testResults", JSON.stringify(finalAnswers))
    localStorage.setItem("testQuestions", JSON.stringify(testQuestions))

    // Lösche temporäre Testdaten
    localStorage.removeItem("testAnswers")
    localStorage.removeItem("currentQuestionIndex")

    // Dummy-Benutzerdaten erstellen für nicht angemeldete Benutzer
    if (!localStorage.getItem("user")) {
      const dummyUser = {
        id: "guest-user",
        name: "Gast",
        email: "gast@truenorth.app",
        isAuthenticated: true,
      }
      localStorage.setItem("user", JSON.stringify(dummyUser))
    }

    // Zur Ergebnisseite navigieren
    router.push("/results")
  }

  const handleCancel = () => {
    // Zeige Bestätigungsdialog
    if (confirm("Möchtest du den Test wirklich abbrechen? Dein Fortschritt wird gespeichert.")) {
      // Zurück zur Startseite
      router.push("/")
    }
  }

  const skipTest = () => {
    // Dummy-Ergebnisse generieren
    const dummyResults = Array(testQuestions.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 5) + 1)

    // Dummy-Ergebnisse speichern
    localStorage.setItem("testResults", JSON.stringify(dummyResults))
    localStorage.setItem("testQuestions", JSON.stringify(testQuestions))

    // Lösche temporäre Testdaten
    localStorage.removeItem("testAnswers")
    localStorage.removeItem("currentQuestionIndex")

    // Dummy-Benutzerdaten erstellen
    const dummyUser = {
      id: "dev-user-123",
      name: "Entwickler Benutzer",
      email: "dev@truenorth.app",
      isAuthenticated: true,
    }

    // Dummy-Benutzerdaten speichern
    localStorage.setItem("user", JSON.stringify(dummyUser))

    // Zur Ergebnisseite navigieren
    router.push("/results")
  }

  // Zeige Ladeindikator während der Initialisierung
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Test wird geladen...</p>
        </div>
      </div>
    )
  }

  // Aktuelle Frage
  const currentQuestion = testQuestions[currentQuestionIndex]
  if (!currentQuestion) return null

  // Bestimme die Dimension der aktuellen Frage
  const currentDimension = currentQuestion.dimension
  const dimensionInfo = dimensionDescriptions[currentDimension]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Header mit Logo und Abbrechen-Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
            </div>
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
              <span className="text-sm">Abbrechen</span>
            </button>
          </div>

          {/* Fortschrittsbalken */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Fortschritt</span>
              <span>
                {currentQuestionIndex + 1} von {testQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-stone-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${testProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Kategorie-Badge */}
          <div className="mb-4">
            <span className="inline-block bg-stone-100 text-stone-800 text-xs px-2 py-1 rounded-full">
              {currentQuestion.category === "beruflich"
                ? "Berufliches Umfeld"
                : currentQuestion.category === "sozial"
                  ? "Soziale Interaktion"
                  : "Persönliche Eigenschaften"}
            </span>
          </div>

          {/* Frage mit Info-Button */}
          <div className="mb-8">
            <div className="flex items-start gap-2">
              <h2 className="text-xl font-bold">{currentQuestion.text}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      className="text-gray-400 hover:text-gray-600 mt-1"
                      onClick={() => setShowExplanation(!showExplanation)}
                    >
                      <HelpCircle size={16} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Klicken für mehr Informationen zu dieser Dimension</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Erklärung zur Dimension (einblendbar) */}
            {showExplanation && (
              <div className="mt-4 p-4 bg-stone-50 rounded-lg border border-stone-100 text-sm">
                <h3 className="font-medium mb-1">{dimensionInfo.title}</h3>
                <p className="text-gray-600 mb-2">{dimensionInfo.short}</p>
                <p className="text-gray-500">{dimensionInfo.long}</p>
              </div>
            )}
          </div>

          {/* Komplett neu gestalteter Slider mit perfekter Zentrierung */}
          <div className="mb-12">
            <div className="slider-container">
              <div className="slider-track"></div>
              <input
                type="range"
                min="1"
                max="5"
                step="0.01"
                value={sliderValue}
                onChange={handleSliderChange}
                className="slider-input"
                aria-label="Bewertung"
              />
              <div ref={thumbRef} className="slider-thumb"></div>
              <div className="slider-labels">
                <span className="slider-label">Trifft gar nicht zu</span>
                <span className="slider-label">Trifft voll zu</span>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="py-2 px-4 flex items-center gap-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              <ChevronLeft size={16} />
              Zurück
            </button>

            <button
              onClick={handleNext}
              className="py-2 px-6 bg-stone-500 text-white rounded hover:bg-stone-600 flex items-center gap-1"
            >
              {currentQuestionIndex < testQuestions.length - 1 ? (
                <>
                  Weiter
                  <ChevronRight size={16} />
                </>
              ) : (
                <>
                  Abschließen
                  <Save size={16} />
                </>
              )}
            </button>
          </div>

          {/* Dev-Mode Skip Button */}
          <div className="mt-8 text-center">
            <button className="text-xs text-gray-400 hover:text-gray-600" onClick={skipTest}>
              Test überspringen (nur Entwicklung)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
