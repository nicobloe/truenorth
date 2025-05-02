"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import { BottomNavigation } from "@/components/BottomNavigation"
import { CareerAdvisorChat } from "@/components/CareerAdvisorChat"
import { calculateDimensionScores, determinePersonalityType } from "@/lib/personality-types"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [results, setResults] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [personalityType, setPersonalityType] = useState<any>(null)
  const [dimensionScores, setDimensionScores] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Prüfen, ob Benutzer angemeldet ist
    const userData = localStorage.getItem("user")
    const testResults = localStorage.getItem("testResults")

    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Zur Anmeldeseite weiterleiten, wenn keine Benutzerdaten vorhanden sind
      router.push("/login")
      return
    }

    if (testResults) {
      try {
        const parsedResults = JSON.parse(testResults)
        setResults(parsedResults)

        // Persönlichkeitsdimensionen und -typ berechnen
        const scores = calculateDimensionScores(parsedResults)
        const type = determinePersonalityType(parsedResults)

        console.log("Berechneter Persönlichkeitstyp:", type?.title)
        console.log("Berechnete Dimensionswerte:", scores)

        setDimensionScores(scores)
        setPersonalityType(type)
      } catch (error) {
        console.error("Fehler bei der Berechnung der Persönlichkeitsdimensionen:", error)
        setError("Es gab ein Problem beim Laden deines Persönlichkeitsprofils.")

        // Fallback-Werte setzen
        setDimensionScores({
          O: 3,
          C: 3,
          E: 3,
          A: 3,
          N: 3,
        })
        setPersonalityType({
          title: "Praktiker",
          description: "Du bist bodenständig und lösungsorientiert.",
          icon: null,
          primaryDimension: "C",
          secondaryDimension: "A",
        })
      }
    } else {
      // Zum Test weiterleiten, wenn keine Testergebnisse vorhanden sind
      router.push("/test")
      return
    }

    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Lade KI-Coach...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
          </Link>
          <BackButton href="/dashboard" />
        </div>
      </header>

      {/* Main Content - Verwende flex-1 damit dieser Bereich den verfügbaren Platz einnimmt */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="container mx-auto px-4 py-3 shrink-0">
          <h1 className="text-xl font-bold">KI-Coach</h1>
          <p className="text-gray-600 text-sm">
            Sprich mit unserem KI-Karriereberater über deine Ergebnisse und erhalte personalisierte Empfehlungen.
          </p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mx-4 mb-3">{error}</div>}

        {/* Chat-Container - nimmt den gesamten verfügbaren Platz ein */}
        <div className="flex-1 mx-4 mb-4 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          {personalityType && dimensionScores && (
            <CareerAdvisorChat personalityType={personalityType} dimensionScores={dimensionScores} />
          )}
        </div>
      </div>

      {/* Bottom Navigation Spacer - fügt Platz für die Navigation hinzu */}
      <div className="md:hidden h-16 shrink-0"></div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
