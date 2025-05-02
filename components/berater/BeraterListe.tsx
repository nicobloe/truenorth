"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Calendar, Video, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Berater } from "@/lib/berater-types"
import { cn } from "@/lib/utils"

interface BeraterListeProps {
  berater: Berater[]
  userLocation?: { lat: number; lng: number } | null
  selectedBerater?: Berater | null
  onBeraterClick?: (berater: Berater) => void
}

export function BeraterListe({ berater, userLocation, selectedBerater, onBeraterClick }: BeraterListeProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleImageError = (beraterId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [beraterId]: true,
    }))
  }

  const calculateDistance = (beraterLat: number, beraterLng: number): number | null => {
    if (!userLocation) return null

    const R = 6371 // Radius der Erde in km
    const dLat = deg2rad(userLocation.lat - beraterLat)
    const dLng = deg2rad(userLocation.lng - beraterLng)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(beraterLat)) * Math.cos(deg2rad(userLocation.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Entfernung in km
    return d
  }

  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180)
  }

  const formatDate = (date?: Date | null): string => {
    if (!date) return "Flexibel"
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  if (berater.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Keine Berater gefunden, die den Filterkriterien entsprechen.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {berater.map((b) => {
        const distance = calculateDistance(b.standort.lat, b.standort.lng)
        const isExpanded = expandedId === b.id
        const isSelected = selectedBerater?.id === b.id

        // Bestimme die zu verwendende Bildquelle mit Fallback
        const imageSrc = imageErrors[b.id]
          ? `/placeholder.svg?height=64&width=64&query=profile%20${b.name.split(" ")[0]}`
          : b.profilBild || "/abstract-profile.png"

        return (
          <Card
            key={b.id}
            className={`overflow-hidden transition-all ${isSelected ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => onBeraterClick && onBeraterClick(b)}
          >
            <CardContent className="p-0">
              <div className="flex p-4">
                <div className="mr-4 flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <Image
                      src={imageSrc || "/placeholder.svg"}
                      alt={b.name}
                      width={64}
                      height={64}
                      className={cn(
                        "object-cover w-full h-full",
                        b.name.includes("Gianni Clavadetscher") ? "object-position-[center_30%]" : "object-center",
                      )}
                      onError={() => handleImageError(b.id)}
                    />
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{b.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mr-1" />
                    <span>
                      {b.standort.ort}, {b.standort.land}
                    </span>
                    {distance && (
                      <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        {distance.toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < Math.floor(b.bewertung) ? "text-yellow-400" : "text-gray-300"}
                        fill={i < Math.floor(b.bewertung) ? "currentColor" : "none"}
                      />
                    ))}
                    <span className="ml-1 text-xs text-gray-600">
                      {b.bewertung} ({b.anzahlBewertungen})
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {b.spezialisierung.slice(0, isExpanded ? undefined : 2).map((spez) => (
                      <Badge key={spez} variant="outline" className="text-xs bg-blue-50">
                        {spez}
                      </Badge>
                    ))}
                    {!isExpanded && b.spezialisierung.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{b.spezialisierung.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-3 pt-0">
                  <p className="text-sm text-gray-700 mb-3">{b.beschreibung}</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2 text-gray-500" />
                      <span>
                        Nächster Termin: <br />
                        {formatDate(b.verfügbarkeit?.nächsterTermin)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {b.verfügbarkeit?.onlineBeratung && (
                        <div className="flex items-center">
                          <Video size={14} className="text-blue-500 mr-1" />
                          <span className="text-xs">Online</span>
                        </div>
                      )}
                      {b.verfügbarkeit?.onlineBeratung && b.verfügbarkeit?.vorOrt && (
                        <span className="text-gray-300 mx-1">|</span>
                      )}
                      {b.verfügbarkeit?.vorOrt && (
                        <div className="flex items-center">
                          <Users size={14} className="text-green-500 mr-1" />
                          <span className="text-xs">Vor Ort</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between p-2 bg-gray-50">
              <Button variant="ghost" size="sm" onClick={() => toggleExpand(b.id)}>
                {isExpanded ? "Weniger anzeigen" : "Mehr anzeigen"}
              </Button>
              <Link href={`/berater/${b.id}`} passHref>
                <Button size="sm">Profil ansehen</Button>
              </Link>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
