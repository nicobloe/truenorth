"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { DashboardContent } from "@/components/DashboardContent"
import { User, Settings, LogOut } from "lucide-react"
import { calculateDimensionScores, determinePersonalityType } from "@/lib/personality-types"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [results, setResults] = useState<number[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [personalityType, setPersonalityType] = useState<any>(null)
  const [dimensionScores, setDimensionScores] = useState<any>(null)

  useEffect(() => {
    // Prüfen, ob Benutzer angemeldet ist
    const userData = localStorage.getItem("user")
    const testResults = localStorage.getItem("testResults")
    const savedQuestions = localStorage.getItem("testQuestions")

    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Zur Anmeldeseite weiterleiten, wenn keine Benutzerdaten vorhanden sind
      router.push("/login")
      return
    }

    if (testResults) {
      const parsedResults = JSON.parse(testResults)
      setResults(parsedResults)

      try {
        // Persönlichkeitsdimensionen und -typ berechnen
        // Wichtig: Wir laden die gespeicherten Testfragen aus dem localStorage
        let questionsToUse = null
        if (savedQuestions) {
          questionsToUse = JSON.parse(savedQuestions)
          console.log("Testfragen aus localStorage geladen:", questionsToUse.length)
        }

        const scores = calculateDimensionScores(parsedResults, questionsToUse)
        const type = determinePersonalityType(parsedResults, questionsToUse)

        setDimensionScores(scores)
        setPersonalityType(type)

        // Speichere den berechneten Persönlichkeitstyp im localStorage
        // Dies stellt sicher, dass alle Seiten den gleichen Typ verwenden
        localStorage.setItem("personalityType", JSON.stringify(type))
      } catch (error) {
        console.error("Fehler bei der Berechnung der Persönlichkeitsdimensionen:", error)
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

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("testResults")
    localStorage.removeItem("personalityType") // Auch den gespeicherten Persönlichkeitstyp entfernen
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Wird geladen...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
          </Link>

          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2 text-gray-600">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User size={16} className="text-gray-500" />
              </div>
              <span className="hidden md:inline">{user.name}</span>
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg py-1 z-20 border border-gray-200">
                <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">{user.email}</div>
                <Link
                  href="/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User size={14} />
                  Profil
                </Link>
                <Link
                  href="/settings"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings size={14} />
                  Einstellungen
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Abmelden
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-2xl font-bold mb-6">Deine Ergebnisse</h1>

        {results ? (
          <DashboardContent results={results} />
        ) : (
          <div className="bg-white p-6 rounded border border-gray-200 text-center">
            <p className="text-lg mb-4">Keine Testergebnisse gefunden. Bitte nimm zuerst am Test teil.</p>
            <Link href="/test" className="inline-block py-2 px-4 bg-stone-500 text-white rounded font-medium">
              Test starten
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Navigation Spacer */}
      <BottomNavigationSpacer />

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-4 text-sm text-gray-500 text-center">
          © {new Date().getFullYear()} True North. Alle Rechte vorbehalten.
        </div>
      </footer>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
