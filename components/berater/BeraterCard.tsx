"use client"

import type { Berater } from "@/lib/berater-types"
import { MapPin, Phone, Mail, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"

interface BeraterKarteProps {
  berater: Berater
  onClick?: () => void
  isSelected?: boolean
}

export function BeraterCard({ berater, onClick, isSelected = false }: BeraterKarteProps) {
  const [imageError, setImageError] = useState(false)

  // Fallback-Bild verwenden, wenn das eigentliche Bild nicht geladen werden kann
  const handleImageError = () => {
    setImageError(true)
  }

  // Bestimme die zu verwendende Bildquelle
  const imageSrc = imageError
    ? `/placeholder.svg?height=64&width=64&query=profile%20${berater.name.split(" ")[0]}`
    : berater.profilBild || "/abstract-profile.png"

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-4 border transition-all ${
        isSelected ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={berater.name}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            onError={handleImageError}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{berater.name}</h3>
          <p className="text-sm text-gray-600 truncate">{berater.spezialisierung.join(", ")}</p>

          <div className="flex items-center gap-1 text-sm mt-1">
            <MapPin size={14} className="text-gray-400" />
            <span className="text-gray-600 truncate">
              {berater.standort.ort}, {berater.standort.land}
            </span>
          </div>

          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={i < Math.floor(berater.bewertung) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({berater.anzahlBewertungen})</span>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-700 line-clamp-2">{berater.beschreibung}</div>

      <div className="mt-3 flex flex-wrap gap-1">
        {berater.sprachen.map((sprache) => (
          <span key={sprache} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
            {sprache}
          </span>
        ))}
        {berater.verfügbarkeit.onlineBeratung && (
          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Online-Beratung</span>
        )}
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Phone size={14} className="mr-1" /> Anrufen
        </Button>
        <Button size="sm" className="flex-1">
          <Mail size={14} className="mr-1" /> Kontakt
        </Button>
      </div>
    </div>
  )
}
