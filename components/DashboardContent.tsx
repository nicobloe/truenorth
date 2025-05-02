"use client"

interface DashboardContentProps {
  results: number[]
}

import { useState, useEffect } from "react"
import { calculateDimensionScores, translateDimension, determinePersonalityType } from "@/lib/personality-types"
import { generateEnhancedCareerRecommendations, type LinkedInProfile } from "@/lib/career-recommendations"
import { Linkedin, AlertCircle, Users } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "./ProgressBar"
import { questions } from "@/lib/questions"
import { DownloadPDFButton } from "./DownloadPDFButton"
import { Button } from "@/components/ui/button"

export function DashboardContent({ results }: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "careers">("profile")
  const [linkedInProfile, setLinkedInProfile] = useState<LinkedInProfile | null>(null)

  // Persönlichkeitsdimensionen basierend auf Ergebnissen berechnen
  // Wichtig: Wir übergeben die questions, um konsistente Ergebnisse zu erhalten
  const dimensionScores = calculateDimensionScores(results, questions)

  // Persönlichkeitstyp bestimmen
  // Wichtig: Wir übergeben die questions, um konsistente Ergebnisse zu erhalten
  const personalityType = determinePersonalityType(results, questions)

  // LinkedIn-Profil laden, falls vorhanden
  useEffect(() => {
    const linkedInData = localStorage.getItem("linkedInProfile")
    if (linkedInData) {
      setLinkedInProfile(JSON.parse(linkedInData))
    }
  }, [])

  // Karriereempfehlungen generieren
  const { careers: careerRecommendations, explanation } = generateEnhancedCareerRecommendations(
    dimensionScores,
    linkedInProfile || undefined,
  )

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "profile" ? "border-b-2 border-stone-500 text-stone-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Persönlichkeitsprofil
        </button>
        <button
          className={`py-2 px-4 font-medium ${
            activeTab === "careers" ? "border-b-2 border-stone-500 text-stone-600" : "text-gray-500"
          }`}
          onClick={() => setActiveTab("careers")}
        >
          Karriereempfehlungen
        </button>
      </div>

      {/* Persönlichkeitsprofil Tab */}
      {activeTab === "profile" && (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-full ${personalityType.color || "bg-stone-500"} flex items-center justify-center`}
              >
                {personalityType.icon && <personalityType.icon size={20} color="white" />}
              </div>
              <h2 className="text-xl font-bold">{personalityType.title}</h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">{personalityType.description}</p>
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium mb-2">Deine Dimensionswerte</h3>
              {Object.entries(dimensionScores).map(([dimension, score]) => {
                // Berechne den Prozentsatz (score ist zwischen 1-5, daher umrechnen auf 0-100%)
                const percentage = Math.round((score / 5) * 100)

                return (
                  <div key={dimension} className="mb-3">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{translateDimension(dimension as any)}</span>
                      <span>{percentage}%</span>
                    </div>
                    <ProgressBar percentage={percentage} color={personalityType.color || "bg-stone-500"} />
                  </div>
                )
              })}
            </div>
            <div className="mt-6">
              <DownloadPDFButton
                results={results}
                userData={{
                  name: localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user") || "{}").name
                    : "Benutzer",
                  email: localStorage.getItem("user")
                    ? JSON.parse(localStorage.getItem("user") || "{}").email
                    : "benutzer@example.com",
                }}
                linkedInProfile={linkedInProfile}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="space-y-6">
              {/* Stärken */}
              <div>
                <h2 className="text-xl font-bold mb-4">Deine Stärken</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Primäre Dimension</h3>
                    <p className="text-gray-600 mb-2">{translateDimension(personalityType.primaryDimension)}</p>
                    <div className="text-sm text-gray-500">
                      {personalityType.primaryDimension === "O" && "Kreativität, Offenheit für neue Ideen, Neugier"}
                      {personalityType.primaryDimension === "C" && "Zuverlässigkeit, Organisiertheit, Zielorientierung"}
                      {personalityType.primaryDimension === "E" &&
                        "Kommunikationsfähigkeit, Durchsetzungsvermögen, Energie"}
                      {personalityType.primaryDimension === "A" && "Teamfähigkeit, Empathie, Kooperationsbereitschaft"}
                      {personalityType.primaryDimension === "N" && "Selbstreflexion, Vorsicht, Detailorientierung"}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Sekundäre Dimension</h3>
                    <p className="text-gray-600 mb-2">{translateDimension(personalityType.secondaryDimension)}</p>
                    <div className="text-sm text-gray-500">
                      {personalityType.secondaryDimension === "O" && "Kreativität, Offenheit für neue Ideen, Neugier"}
                      {personalityType.secondaryDimension === "C" &&
                        "Zuverlässigkeit, Organisiertheit, Zielorientierung"}
                      {personalityType.secondaryDimension === "E" &&
                        "Kommunikationsfähigkeit, Durchsetzungsvermögen, Energie"}
                      {personalityType.secondaryDimension === "A" &&
                        "Teamfähigkeit, Empathie, Kooperationsbereitschaft"}
                      {personalityType.secondaryDimension === "N" && "Selbstreflexion, Vorsicht, Detailorientierung"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Schwächen */}
              <div>
                <h2 className="text-xl font-bold mb-4">Deine Schwächen</h2>
                <div className="space-y-4">
                  {/* Schwächste Dimensionen identifizieren */}
                  {Object.entries(dimensionScores)
                    .sort(([, a], [, b]) => a - b)
                    .slice(0, 2)
                    .map(([dimension, score], index) => (
                      <div key={dimension}>
                        <h3 className="font-medium mb-1">
                          {index === 0 ? "Schwächste Dimension" : "Zweit-schwächste Dimension"}
                        </h3>
                        <p className="text-gray-600 mb-2">{translateDimension(dimension as any)}</p>
                        <div className="text-sm text-gray-500">
                          {dimension === "O" &&
                            "Könnte Schwierigkeiten haben, von gewohnten Routinen abzuweichen oder neue Ideen zu akzeptieren"}
                          {dimension === "C" && "Könnte Probleme mit Zeitmanagement oder Organisationsaufgaben haben"}
                          {dimension === "E" &&
                            "Könnte in sozialen Situationen zurückhaltend sein oder Schwierigkeiten haben, sich durchzusetzen"}
                          {dimension === "A" &&
                            "Könnte manchmal zu direkt oder weniger einfühlsam in der Kommunikation sein"}
                          {dimension === "N" && "Könnte unter Stress oder Druck leicht überfordert sein"}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Karriereempfehlungen Tab */}
      {activeTab === "careers" && (
        <div className="space-y-6">
          {/* LinkedIn-Integration Banner */}
          {!linkedInProfile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle size={20} className="text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">Verbessere deine Karriereempfehlungen</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Verbinde dein LinkedIn-Profil, um personalisierte Karriereempfehlungen zu erhalten, die auf deiner
                  Berufserfahrung und deinen Fähigkeiten basieren.
                </p>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  <Linkedin size={16} />
                  LinkedIn verbinden
                </Link>
              </div>
            </div>
          )}

          {/* Berater finden Banner */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex items-start gap-3">
            <Users size={20} className="text-stone-500 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-stone-800">Persönliche Karriereberatung</h3>
              <p className="text-stone-700 text-sm mt-1">
                Finde Karriereberater in deiner Nähe, die auf deinen Persönlichkeitstyp spezialisiert sind und dir bei
                deiner beruflichen Entwicklung helfen können.
              </p>
              <Link href="/berater" passHref>
                <Button className="mt-3" size="sm">
                  Berater finden
                </Button>
              </Link>
            </div>
          </div>

          {/* Karriereempfehlungen */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h2 className="text-xl font-bold">Karriereempfehlungen</h2>
              {linkedInProfile && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Linkedin size={16} />
                  <span>LinkedIn verbunden</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-6">
              {explanation} haben wir folgende Berufsfelder für dich identifiziert, die gut zu dir passen könnten:
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {careerRecommendations.map((career: string, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-stone-500"></span>
                    <span className="font-medium">{career}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Dieses Berufsfeld passt gut zu deinen Stärken und Persönlichkeitsmerkmalen.
                  </p>
                </div>
              ))}
            </div>
          </div>
          {/* Berater-Abschnitt */}
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-3">Persönliche Beratung</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Users className="text-blue-600" size={24} />
                </div>
                <div>
                  <h3 className="font-medium text-blue-800">Finde passende Karriereberater</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Entdecke Berater, die zu deinem Persönlichkeitstyp passen und dir bei deiner Karriereentwicklung
                    helfen können.
                  </p>
                  <Link href="/berater">
                    <Button className="mt-3" size="sm">
                      Berater finden
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
