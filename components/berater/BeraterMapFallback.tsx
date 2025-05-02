"use client"

import { useState, useMemo, memo } from "react"
import Image from "next/image"
import type { Berater } from "@/lib/berater-types"
import { MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface BeraterMapFallbackProps {
  berater: Berater[]
  selectedBerater: Berater | null
  onBeraterClick: (berater: Berater) => void
  userLocation?: { lat: number; lng: number } | null
}

// Berechne die Entfernung zwischen zwei Koordinaten (Haversine-Formel)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): { distance: number; unit: string } {
  const R = 6371 // Erdradius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  // Formatiere die Entfernung
  if (distance < 1) {
    return { distance: Math.round(distance * 1000), unit: "m" }
  } else {
    return { distance: Math.round(distance * 10) / 10, unit: "km" }
  }
}

// Verwende memo, um unnötige Neuberechnungen zu vermeiden
export const BeraterMapFallback = memo(function BeraterMapFallback({
  berater,
  selectedBerater,
  onBeraterClick,
  userLocation,
}: BeraterMapFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Sortiere Berater nach Entfernung, wenn Nutzerstandort verfügbar ist
  // Verwende useMemo, um die Berechnung nur bei Änderungen von berater oder userLocation durchzuführen
  const sortedBerater = useMemo(() => {
    if (!userLocation) return berater

    return [...berater].sort((a, b) => {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.standort.lat, a.standort.lng).distance
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.standort.lat, b.standort.lng).distance

      return distA - distB
    })
  }, [berater, userLocation])

  // Berechne die Entfernungen für alle Berater einmal
  const beraterMitEntfernung = useMemo(() => {
    return sortedBerater.map((berater) => {
      const distanceInfo = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, berater.standort.lat, berater.standort.lng)
        : null

      return {
        berater,
        distanceInfo,
      }
    })
  }, [sortedBerater, userLocation])

  return (
    <div className="h-full w-full rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex flex-col">
      <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-medium">Berater in deiner Nähe</h3>
        <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Weniger Details" : "Mehr Details"}
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beraterMitEntfernung.map(({ berater, distanceInfo }) => (
            <Card
              key={berater.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedBerater?.id === berater.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onBeraterClick(berater)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={
                        berater.profilBild ||
                        `/placeholder.svg?height=64&width=64&query=profile%20${berater.name.split(" ")[0]}`
                      }
                      alt={berater.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-base truncate">{berater.name}</h4>
                    <p className="text-sm text-gray-600 truncate">{berater.spezialisierung.join(", ")}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600 truncate">
                        {berater.standort.ort}, {berater.standort.land}
                      </span>
                    </div>
                    {distanceInfo && (
                      <div className="flex items-center gap-1 mt-1 text-sm text-blue-600">
                        <Navigation size={14} />
                        <span>
                          {distanceInfo.distance} {distanceInfo.unit} entfernt
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {showDetails && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm">{berater.beschreibung.substring(0, 120)}...</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {berater.verfügbarkeit.onlineBeratung && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Online-Beratung
                        </span>
                      )}
                      {berater.verfügbarkeit.vorOrt && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Vor-Ort-Beratung
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
})
