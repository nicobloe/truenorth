"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { determinePersonalityType, calculateDimensionScores } from "@/lib/personality-types"
import { Share2, ArrowRight } from "lucide-react"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BackButton } from "@/components/BackButton"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"

export default function ResultsPage() {
  const [results, setResults] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [personalityResult, setPersonalityResult] = useState<any>(null)
  const [dimensionScores, setDimensionScores] = useState<any>(null)
  const [userData, setUserData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Lade Testergebnisse und Testfragen aus dem localStorage
    const testResults = localStorage.getItem("testResults")
    const savedQuestions = localStorage.getItem("testQuestions")
    const userDataFromStorage = localStorage.getItem("user")

    // Lade Benutzerdaten
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage))
    } else {
      // Erstelle Dummy-Benutzerdaten, wenn keine vorhanden sind
      const dummyUser = {
        id: "guest-user",
        name: "Gast",
        email: "gast@truenorth.app",
        isAuthenticated: true,
      }
      localStorage.setItem("user", JSON.stringify(dummyUser))
      setUserData(dummyUser)
    }

    if (testResults) {
      const parsedResults = JSON.parse(testResults)
      setResults(parsedResults)

      try {
        // Lade die gespeicherten Testfragen
        let questionsToUse = null
        if (savedQuestions) {
          questionsToUse = JSON.parse(savedQuestions)
          console.log("Testfragen aus localStorage geladen:", questionsToUse.length)
        }

        // Berechne Persönlichkeitsdimensionen und -typ mit den gespeicherten Testfragen
        const scores = calculateDimensionScores(parsedResults, questionsToUse)
        const type = determinePersonalityType(parsedResults, questionsToUse)

        setDimensionScores(scores)
        setPersonalityResult(type)

        // Speichere den berechneten Persönlichkeitstyp im localStorage
        localStorage.setItem("personalityType", JSON.stringify(type))
      } catch (error) {
        console.error("Fehler bei der Berechnung der Persönlichkeitsdimensionen:", error)
      }
    } else {
      // Zum Test weiterleiten, wenn keine Testergebnisse vorhanden sind
      router.push("/test")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleDashboardClick = () => {
    try {
      // Überprüfen, ob Benutzerdaten vorhanden sind
      const userData = localStorage.getItem("user")
      if (!userData) {
        // Wenn keine Benutzerdaten vorhanden sind, erstelle einen Gastbenutzer
        const guestUser = {
          id: "guest-user",
          name: "Gast",
          email: "gast@truenorth.app",
          isAuthenticated: true,
        }
        localStorage.setItem("user", JSON.stringify(guestUser))
      }

      // Stelle sicher, dass die Testergebnisse im localStorage sind
      if (results) {
        localStorage.setItem("testResults", JSON.stringify(results))
      }

      // Zur Dashboard-Seite navigieren
      router.push("/dashboard")
    } catch (error) {
      console.error("Navigation error:", error)
      alert("Es gab ein Problem beim Navigieren zum Dashboard. Bitte versuche es später erneut.")
    }
  }

  const handleShareResults = () => {
    // In einer echten Implementierung würde hier ein Teilen-Dialog geöffnet werden
    alert(
      "Diese Funktion würde deine Ergebnisse teilen. In dieser Demo-Version ist sie noch nicht vollständig implementiert.",
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-stone-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Deine Ergebnisse werden analysiert...</p>
        </div>
      </div>
    )
  }

  if (!personalityResult || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Es ist ein Fehler aufgetreten. Bitte versuche es erneut.</p>
          <Link href="/test" className="py-2 px-4 bg-stone-500 text-white rounded hover:bg-stone-600">
            Zurück zum Test
          </Link>
        </div>
      </div>
    )
  }

  const IconComponent = personalityResult?.icon || (() => null)

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
          </Link>
          <BackButton href="/dashboard" label="Zum Dashboard" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          {/* Ergebnis-Header */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div
                className={`w-16 h-16 rounded-full ${
                  personalityResult.color || "bg-stone-500"
                } flex items-center justify-center`}
              >
                <IconComponent size={32} color="white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Dein Persönlichkeitstyp: {personalityResult.title}</h1>
            <p className="text-gray-600 mb-6">{personalityResult.description}</p>

            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={handleShareResults}
                className="flex items-center gap-2 py-2 px-4 border border-gray-300 rounded hover:bg-gray-50"
              >
                <Share2 size={16} />
                <span>Teilen</span>
              </button>
            </div>
          </div>

          {/* Karriereempfehlungen */}
          <div className="hidden bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-bold mb-4">Passende Karrierewege</h2>
            <p className="text-gray-600 mb-4">
              Basierend auf deinem Persönlichkeitstyp könnten folgende Karrierewege gut zu dir passen:
            </p>
            <div className="grid gap-3 md:grid-cols-2 mb-4">
              {personalityResult.careers.map((career: string, index: number) => (
                <div key={index} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-stone-500"></span>
                    <span className="font-medium">{career}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {personalityResult.swissContext ||
                "Diese Karrierewege passen besonders gut zu deinem Persönlichkeitstyp."}
            </p>
          </div>

          {/* Weiter zum Dashboard */}
          <div className="text-center">
            <button
              onClick={handleDashboardClick}
              className="py-3 px-6 bg-stone-500 text-white rounded-lg hover:bg-stone-600 flex items-center gap-2 mx-auto"
            >
              <span>Zum detaillierten Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Bottom Navigation Spacer */}
          <BottomNavigationSpacer />
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} True North. Alle Rechte vorbehalten.
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
