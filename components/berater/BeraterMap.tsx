"use client"

import { useState, useEffect, useMemo } from "react"
import type { Berater } from "@/lib/berater-types"
import { BeraterMapFallback } from "./BeraterMapFallback"

// Mapbox-Token als Umgebungsvariable
// Wir verwenden keine direkte Referenz auf den Token mehr
const MAPBOX_TOKEN = ""

interface BeraterMapProps {
  berater: Berater[]
  selectedBerater: Berater | null
  onMarkerClick: (berater: Berater) => void
  userLocation?: { lat: number; lng: number } | null
}

// Diese Komponente wird nur in einer vollständigen Next.js-Umgebung verwendet
// In der v0-Vorschauumgebung wird die BeraterMapFallback-Komponente verwendet
export function BeraterMap(props: BeraterMapProps) {
  const [isMapboxSupported, setIsMapboxSupported] = useState(false)
  const [hasCheckedSupport, setHasCheckedSupport] = useState(false)

  // Prüfe nur einmal, ob Mapbox unterstützt wird
  useEffect(() => {
    if (hasCheckedSupport) return

    // Prüfe, ob wir in einer Umgebung sind, die Mapbox unterstützt
    try {
      // Versuche, mapbox-gl zu importieren
      import("mapbox-gl")
        .then(() => {
          setIsMapboxSupported(true)
          setHasCheckedSupport(true)
        })
        .catch(() => {
          setIsMapboxSupported(false)
          setHasCheckedSupport(true)
        })
    } catch (error) {
      setIsMapboxSupported(false)
      setHasCheckedSupport(true)
    }
  }, [hasCheckedSupport])

  // Verwende useMemo, um zu entscheiden, ob die Fallback-Komponente verwendet werden soll
  const shouldUseFallback = useMemo(() => {
    // Wir verwenden immer die Fallback-Komponente in der v0-Vorschauumgebung
    return true
  }, [])

  if (shouldUseFallback) {
    // Fallback für Umgebungen, die Mapbox nicht unterstützen
    return <BeraterMapFallback {...props} onBeraterClick={props.onMarkerClick} />
  }

  // In einer echten Anwendung würden wir hier die Mapbox-Komponente rendern
  // Da wir in der v0-Vorschauumgebung sind, verwenden wir die Fallback-Komponente
  return <BeraterMapFallback {...props} onBeraterClick={props.onMarkerClick} />
}
