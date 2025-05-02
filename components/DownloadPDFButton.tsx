"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { usePathname } from "next/navigation"

interface DownloadPDFButtonProps {
  results: number[]
  userData: {
    name: string
    email: string
  }
  linkedInProfile?: any
}

export function DownloadPDFButton({ results, userData, linkedInProfile }: DownloadPDFButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  // Nur im Dashboard anzeigen
  if (!pathname.includes("/dashboard")) {
    return null
  }

  const handleDownload = async () => {
    try {
      setIsLoading(true)

      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          results,
          userData,
          linkedInProfile,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Fehler beim Generieren des PDFs: ${errorText}`)
      }

      // PDF-Blob aus der Antwort extrahieren
      const blob = await response.blob()

      // Prüfen, ob der Blob gültig ist
      if (blob.size < 1000) {
        throw new Error("Die generierte PDF-Datei scheint leer oder beschädigt zu sein.")
      }

      // Download-Link erstellen und klicken
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${userData.name.replace(/\s+/g, "_")}_True_North_Profil.pdf`
      document.body.appendChild(a)
      a.click()

      // Aufräumen
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Fehler beim PDF-Download:", error)
      alert(`Es gab ein Problem beim Herunterladen des PDFs: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isLoading} className="flex items-center gap-2">
      <Download size={16} />
      {isLoading ? "Wird generiert..." : "Profil als PDF herunterladen"}
    </Button>
  )
}
