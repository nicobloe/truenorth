"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { BackButton } from "@/components/BackButton"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell, Moon, Globe, Lock, Trash2 } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Einstellungen mit Standardwerten
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    language: "Deutsch",
    privacyMode: false,
  })

  useEffect(() => {
    // Prüfen, ob Benutzer angemeldet ist
    const userData = localStorage.getItem("user")

    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Zur Anmeldeseite weiterleiten, wenn keine Benutzerdaten vorhanden sind
      router.push("/login")
      return
    }

    // Gespeicherte Einstellungen laden, falls vorhanden
    const savedSettings = localStorage.getItem("userSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    setIsLoading(false)
  }, [router])

  // Einstellungen speichern
  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem("userSettings", JSON.stringify(newSettings))
  }

  // Konto löschen (Demo-Funktion)
  const handleDeleteAccount = () => {
    if (confirm("Möchtest du dein Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      // In einer echten App würde hier ein API-Aufruf erfolgen
      localStorage.removeItem("user")
      localStorage.removeItem("testResults")
      localStorage.removeItem("userSettings")
      localStorage.removeItem("careerAdvisorChat")
      router.push("/")
    }
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
          <BackButton href="/dashboard" />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold mb-6">Einstellungen</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Benachrichtigungen */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-500" size={20} />
                <div>
                  <h3 className="font-medium">Benachrichtigungen</h3>
                  <p className="text-sm text-gray-500">Erhalte Updates zu deinem Profil</p>
                </div>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSetting("notifications", checked)}
              />
            </div>
          </div>

          {/* Dark Mode */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="text-gray-500" size={20} />
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500">Dunkles Erscheinungsbild</p>
                </div>
              </div>
              <Switch checked={settings.darkMode} onCheckedChange={(checked) => updateSetting("darkMode", checked)} />
            </div>
          </div>

          {/* Sprache */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="text-gray-500" size={20} />
                <div>
                  <h3 className="font-medium">Sprache</h3>
                  <p className="text-sm text-gray-500">Wähle deine bevorzugte Sprache</p>
                </div>
              </div>
              <select
                className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={settings.language}
                onChange={(e) => updateSetting("language", e.target.value)}
              >
                <option value="Deutsch">Deutsch</option>
                <option value="Englisch">Englisch</option>
                <option value="Französisch">Französisch</option>
                <option value="Italienisch">Italienisch</option>
              </select>
            </div>
          </div>

          {/* Datenschutz */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="text-gray-500" size={20} />
                <div>
                  <h3 className="font-medium">Erhöhter Datenschutz</h3>
                  <p className="text-sm text-gray-500">Anonymisierte Datenverarbeitung</p>
                </div>
              </div>
              <Switch
                checked={settings.privacyMode}
                onCheckedChange={(checked) => updateSetting("privacyMode", checked)}
              />
            </div>
          </div>
        </div>

        {/* Konto-Bereich */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Konto</h2>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-4">
                Wenn du dein Konto löschst, werden alle deine Daten und Ergebnisse unwiderruflich entfernt.
              </p>
              <Button variant="destructive" className="flex items-center gap-2" onClick={handleDeleteAccount}>
                <Trash2 size={16} />
                Konto löschen
              </Button>
            </div>
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
