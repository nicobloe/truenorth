"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { questions } from "@/lib/questions"
import { translateDimension, questionDimensions } from "@/lib/personality-types"
import { ArrowLeft, ArrowRight, Save, HelpCircle } from "lucide-react"
import { BackButton } from "@/components/BackButton"
import { calculateDimensionScores, determinePersonalityType } from "@/lib/personality-calculator"

export default function EnhancedTestPage() {
  const [sliderValue, setSliderValue] = useState(3) // Default to middle value
  const [answers, setAnswers] = useState<number[]>([])
  const [savedProgress, setSavedProgress] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [currentInfoDimension, setCurrentInfoDimension] = useState<string>("")
  const router = useRouter()
  const totalQuestions = questions.length
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const thumbRef = useRef<HTMLDivElement>(null)

  // Lade gespeicherte Antworten beim ersten Laden
  useEffect(() => {
    const savedAnswers = localStorage.getItem("savedTestProgress")
    if (savedAnswers) {
      try {
        const parsedAnswers = JSON.parse(savedAnswers)
        setAnswers(parsedAnswers)
        setSavedProgress(true)
      } catch (e) {
        console.error("Fehler beim Laden der gespeicherten Antworten:", e)
      }
    } else {
      // Initialisiere mit Standardwerten
      setAnswers(Array(questions.length).fill(3))
    }
  }, [])

  useEffect(() => {
    // Wenn wir zur nächsten Frage wechseln, setzen wir den Slider auf den gespeicherten Wert
    setSliderValue(answers[currentQuestionIndex] || 3)
  }, [currentQuestionIndex, answers])

  // Aktualisiere die Position des Thumbs, wenn sich der Slider-Wert ändert
  useEffect(() => {
    if (thumbRef.current) {
      // Berechne die Position des Thumbs basierend auf dem Slider-Wert (1-5)
      const percentage = ((sliderValue - 1) / 4) * 100
      thumbRef.current.style.left = `${percentage}%`
    }
  }, [sliderValue])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number.parseFloat(e.target.value))
  }

  const handleNext = () => {
    // Aktuelle Antwort speichern
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = Math.round(sliderValue)
    setAnswers(newAnswers)

    // Speichere Fortschritt im localStorage
    localStorage.setItem("savedTestProgress", JSON.stringify(newAnswers))

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Ergebnisse speichern
      localStorage.setItem("testResults", JSON.stringify(newAnswers))

      // Wichtig: Speichere auch die Testfragen im localStorage
      localStorage.setItem("testQuestions", JSON.stringify(questions))

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
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      // Aktuelle Antwort speichern
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = Math.round(sliderValue)
      setAnswers(newAnswers)

      // Speichere Fortschritt im localStorage
      localStorage.setItem("savedTestProgress", JSON.stringify(newAnswers))

      // Zur vorherigen Frage wechseln
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleCancel = () => {
    // Zurück zur Startseite
    router.push("/")
  }

  const handleSaveProgress = () => {
    // Aktuelle Antwort speichern
    const newAnswers = [...answers]
    newAnswers[currentQuestionIndex] = Math.round(sliderValue)
    setAnswers(newAnswers)

    // Speichere Fortschritt im localStorage
    localStorage.setItem("savedTestProgress", JSON.stringify(newAnswers))
    setSavedProgress(true)

    // Zeige Bestätigung
    alert("Dein Fortschritt wurde gespeichert. Du kannst den Test später fortsetzen.")
  }

  const handleContinueProgress = () => {
    // Finde die erste unbeantwortete Frage
    const firstUnansweredIndex = answers.findIndex((answer) => answer === 3)
    if (firstUnansweredIndex !== -1) {
      setCurrentQuestionIndex(firstUnansweredIndex)
    } else {
      // Wenn alle Fragen beantwortet wurden, gehe zur letzten Frage
      setCurrentQuestionIndex(totalQuestions - 1)
    }
  }

  const handleShowInfo = () => {
    // Zeige Informationen zur aktuellen Dimension
    const currentQuestion = currentQuestionIndex + 1
    const dimension = questionDimensions[currentQuestion]
    if (dimension) {
      setCurrentInfoDimension(dimension)
      setShowInfo(true)
    }
  }

  const handleOptionClick = (value: number) => {
    setSliderValue(value)
  }

  // Verbessern Sie die skipTest-Funktion, um sicherzustellen, dass alle erforderlichen Daten gesetzt werden
  const skipTest = () => {
    // Dummy-Ergebnisse generieren
    const dummyResults = Array(questions.length)
      .fill(0)
      .map(() => Math.floor(Math.random() * 5) + 1)

    // Dummy-Ergebnisse speichern
    localStorage.setItem("testResults", JSON.stringify(dummyResults))

    // Wichtig: Speichere auch die Testfragen im localStorage
    localStorage.setItem("testQuestions", JSON.stringify(questions))

    // Lösche temporäre Testdaten
    localStorage.removeItem("testAnswers")
    localStorage.removeItem("currentQuestionIndex")
    localStorage.removeItem("savedTestProgress")

    // Dummy-Benutzerdaten erstellen
    const dummyUser = {
      id: "dev-user-123",
      name: "Entwickler Benutzer",
      email: "dev@truenorth.app",
      isAuthenticated: true,
    }

    // Dummy-Benutzerdaten speichern
    localStorage.setItem("user", JSON.stringify(dummyUser))

    // Berechne und speichere den Persönlichkeitstyp
    try {
      const scores = calculateDimensionScores(dummyResults, questions)
      const type = determinePersonalityType(dummyResults, questions)
      localStorage.setItem("personalityType", JSON.stringify(type))
    } catch (error) {
      console.error("Fehler bei der Berechnung des Persönlichkeitstyps:", error)
    }

    // Zur Ergebnisseite navigieren
    router.push("/results")
  }

  // Berechne den Fortschritt
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          {/* Header mit Logo und Abbrechen-Button */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSaveProgress} className="text-stone-500 hover:text-stone-700 flex items-center">
                <Save size={16} className="mr-1" />
                <span className="text-sm">Speichern</span>
              </button>
              <BackButton
                onBack={handleCancel}
                label="Abbrechen"
                className="text-gray-500 hover:text-gray-700 text-sm"
              />
            </div>
          </div>

          {/* Fortschrittsbalken */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-stone-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>

          {/* Frage-Zähler */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
            <span>
              Frage {currentQuestionIndex + 1} von {totalQuestions}
            </span>
            <button onClick={handleShowInfo} className="flex items-center text-stone-500 hover:text-stone-700">
              <HelpCircle size={16} className="mr-1" />
              <span>Info</span>
            </button>
          </div>

          {/* Trennlinie */}
          <div className="border-t border-gray-200 mb-6"></div>

          {/* Frage */}
          <h2 className="text-xl font-bold text-center mb-8">{questions[currentQuestionIndex].text}</h2>

          {/* Komplett neu gestalteter Slider mit perfekter Zentrierung */}
          <div className="mb-12">
            <div className="slider-container improved">
              <div className="slider-track"></div>
              <div className="slider-click-area">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="slider-option-button"
                    onClick={() => setSliderValue(value)}
                    aria-label={`Option ${value}`}
                  />
                ))}
              </div>
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
              <div className="slider-markers">
                {[0, 25, 50, 75, 100].map((percent) => (
                  <div key={percent} className="slider-marker"></div>
                ))}
              </div>
              <div className="slider-labels">
                <span className="slider-label">Trifft gar nicht zu</span>
                <span className="slider-label">Trifft voll zu</span>
              </div>
            </div>

            {/* Numerische Optionen für einfacheres Klicken */}
            <div className="flex justify-between mt-6">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSliderValue(value)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    Math.round(sliderValue) === value
                      ? "bg-stone-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`py-2 px-4 rounded flex items-center ${
                currentQuestionIndex === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ArrowLeft size={16} className="mr-1" />
              Zurück
            </button>
            <button
              onClick={handleNext}
              className="py-2 px-6 bg-stone-500 text-white rounded hover:bg-stone-600 flex items-center"
            >
              {currentQuestionIndex < totalQuestions - 1 ? (
                <>
                  Weiter
                  <ArrowRight size={16} className="ml-1" />
                </>
              ) : (
                "Abschließen"
              )}
            </button>
          </div>

          {/* Gespeicherter Fortschritt */}
          {savedProgress && (
            <div className="mt-6 p-3 bg-stone-50 border border-stone-200 rounded-lg">
              <p className="text-sm text-stone-700 mb-2">Du hast bereits Fortschritte in diesem Test gespeichert.</p>
              <button
                onClick={handleContinueProgress}
                className="text-sm text-stone-600 hover:text-stone-800 underline"
              >
                Fortsetzen wo du aufgehört hast
              </button>
            </div>
          )}

          {/* Dev-Mode Skip Button */}
          <div className="mt-8 text-center">
            <button className="text-xs text-gray-400 hover:text-gray-600" onClick={skipTest}>
              Test überspringen (nur Entwicklung)
            </button>
          </div>
        </div>
      </div>

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Information zur Dimension</h3>
              <button onClick={() => setShowInfo(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <h4 className="font-medium mb-2">{translateDimension(currentInfoDimension as any)}</h4>
              <p className="text-sm text-gray-600">{getDimensionExplanation(currentInfoDimension)}</p>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setShowInfo(false)}
                className="w-full py-2 bg-stone-500 text-white rounded hover:bg-stone-600"
              >
                Verstanden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Hilfsfunktion für detaillierte Dimensionserklärungen
function getDimensionExplanation(dimension: string): string {
  switch (dimension) {
    case "O":
      return "Diese Dimension misst deine Offenheit für neue Erfahrungen, Ideen und kreative Ansätze. Menschen mit hohen Werten sind neugierig, experimentierfreudig und haben vielfältige Interessen. Menschen mit niedrigen Werten bevorzugen Vertrautes, Bewährtes und konventionelle Ansätze."
    case "C":
      return "Diese Dimension misst deine Gewissenhaftigkeit, Organisiertheit und Zuverlässigkeit. Menschen mit hohen Werten sind diszipliniert, pflichtbewusst und planen vorausschauend. Menschen mit niedrigen Werten sind spontaner, flexibler und weniger strukturiert in ihrer Arbeitsweise."
    case "E":
      return "Diese Dimension misst deine Extraversion und soziale Energie. Menschen mit hohen Werten sind gesellig, gesprächig und fühlen sich in sozialen Situationen wohl. Menschen mit niedrigen Werten (Introvertierte) bevorzugen ruhigere Umgebungen und tiefere Einzelgespräche."
    case "A":
      return "Diese Dimension misst deine Verträglichkeit und zwischenmenschliche Orientierung. Menschen mit hohen Werten sind kooperativ, einfühlsam und harmoniebedürftig. Menschen mit niedrigen Werten sind direkter, durchsetzungsstärker und stellen eigene Interessen stärker in den Vordergrund."
    case "N":
      return "Diese Dimension misst deine emotionale Stabilität und Reaktion auf Stress. Menschen mit hohen Werten erleben häufiger negative Emotionen und reagieren sensibler auf Stressoren. Menschen mit niedrigen Werten sind emotional stabiler und weniger leicht aus der Ruhe zu bringen."
    default:
      return "Diese Dimension ist Teil des wissenschaftlich fundierten Big Five Persönlichkeitsmodells, das deine Persönlichkeitsmerkmale erfasst."
  }
}

// Hilfsfunktion für die X-Komponente, da sie im Import fehlt
function X(props: { size: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  )
}
