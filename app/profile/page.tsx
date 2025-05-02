"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Linkedin, User, Mail, Briefcase, Award, X } from "lucide-react"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BackButton } from "@/components/BackButton"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [linkedInData, setLinkedInData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Prüfen, ob Benutzer angemeldet ist
    const userData = localStorage.getItem("user")
    const linkedInStorage = localStorage.getItem("linkedInProfile")

    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Zur Anmeldeseite weiterleiten, wenn keine Benutzerdaten vorhanden sind
      router.push("/login")
      return
    }

    // LinkedIn-Daten laden, falls vorhanden
    if (linkedInStorage) {
      setLinkedInData(JSON.parse(linkedInStorage))
    }

    setIsLoading(false)
  }, [router])

  const connectLinkedIn = async () => {
    setIsConnecting(true)

    try {
      // In einer echten Implementierung würde hier die OAuth-Authentifizierung mit LinkedIn stattfinden
      // Für die Demo simulieren wir eine erfolgreiche Verbindung mit Beispieldaten
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const mockLinkedInData = {
        id: "linkedin123456",
        name: user?.name || "Max Mustermann",
        headline: "Senior Product Manager bei TechCorp",
        profileUrl: "https://www.linkedin.com/in/maxmustermann/",
        connections: 500,
        currentPosition: {
          title: "Senior Product Manager",
          company: "TechCorp",
          startDate: "2020-01",
        },
        pastPositions: [
          {
            title: "Product Manager",
            company: "InnoSoft",
            startDate: "2017-03",
            endDate: "2019-12",
          },
          {
            title: "Junior Product Manager",
            company: "StartupXYZ",
            startDate: "2015-06",
            endDate: "2017-02",
          },
        ],
        skills: ["Produktmanagement", "Agile Methoden", "Teamführung", "Strategieentwicklung", "UX/UI", "Datenanalyse"],
        education: [
          {
            school: "Technische Universität Berlin",
            degree: "Master of Science",
            field: "Wirtschaftsinformatik",
            endDate: "2015",
          },
        ],
      }

      // LinkedIn-Daten im localStorage speichern
      localStorage.setItem("linkedInProfile", JSON.stringify(mockLinkedInData))
      setLinkedInData(mockLinkedInData)
    } catch (error) {
      console.error("Fehler beim Verbinden mit LinkedIn:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectLinkedIn = () => {
    localStorage.removeItem("linkedInProfile")
    setLinkedInData(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Wird geladen...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/true-north-logo.png" alt="True North Logo" width={120} height={40} priority />
          </Link>
          <BackButton href="/dashboard" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Dein Profil</h1>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Linke Spalte: Benutzerprofil */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col items-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <User size={40} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-gray-500" />
                <span>{user?.email}</span>
              </div>
              {linkedInData && (
                <div className="flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-600" />
                  <span>Verbunden mit LinkedIn</span>
                </div>
              )}
            </div>
          </div>

          {/* Mittlere Spalte: LinkedIn-Integration */}
          <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">LinkedIn-Integration</h2>

            {!linkedInData ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Verbinde dein LinkedIn-Profil, um personalisierte Karriereempfehlungen zu erhalten, die auf deiner
                  Berufserfahrung und deinen Fähigkeiten basieren.
                </p>
                <button
                  onClick={connectLinkedIn}
                  disabled={isConnecting}
                  className="flex items-center gap-2 bg-[#0077B5] text-white px-4 py-2 rounded hover:bg-[#006699] disabled:opacity-50"
                >
                  <Linkedin size={18} />
                  {isConnecting ? "Wird verbunden..." : "Mit LinkedIn verbinden"}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{linkedInData.headline}</h3>
                    <p className="text-sm text-gray-500">{linkedInData.connections}+ Kontakte</p>
                  </div>
                  <button
                    onClick={disconnectLinkedIn}
                    className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm"
                  >
                    <X size={14} />
                    Trennen
                  </button>
                </div>

                <div className="space-y-4 mt-6">
                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Briefcase size={16} className="text-gray-500" />
                      Berufserfahrung
                    </h3>
                    <div className="space-y-3">
                      <div className="border-l-2 border-gray-200 pl-3">
                        <p className="font-medium">{linkedInData.currentPosition.title}</p>
                        <p className="text-sm text-gray-600">{linkedInData.currentPosition.company}</p>
                        <p className="text-xs text-gray-500">Seit {linkedInData.currentPosition.startDate}</p>
                      </div>
                      {linkedInData.pastPositions.map((position: any, index: number) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-3">
                          <p className="font-medium">{position.title}</p>
                          <p className="text-sm text-gray-600">{position.company}</p>
                          <p className="text-xs text-gray-500">
                            {position.startDate} - {position.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Award size={16} className="text-gray-500" />
                      Fähigkeiten
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {linkedInData.skills.map((skill: string, index: number) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    Deine LinkedIn-Daten werden verwendet, um deine Karriereempfehlungen zu verbessern. Gehe zum
                    Dashboard, um deine aktualisierten Empfehlungen zu sehen.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Bottom Navigation Spacer */}
      <BottomNavigationSpacer />
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
