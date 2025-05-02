"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Berater } from "@/lib/berater-types"
import { Button } from "@/components/ui/button"
import { MapPin, Star, ExternalLink } from "lucide-react"

interface BeraterChatEmpfehlungProps {
  berater: Berater[]
}

export function BeraterChatEmpfehlung({ berater }: BeraterChatEmpfehlungProps) {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const handleImageError = (beraterId: string) => {
    setImageErrors((prev) => ({
      ...prev,
      [beraterId]: true,
    }))
  }

  if (berater.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 my-4">
        <p className="text-sm text-gray-500">Leider konnten keine passenden Berater gefunden werden.</p>
        <Link href="/berater">
          <Button variant="link" size="sm" className="p-0 h-auto mt-2">
            Alle Berater anzeigen <ExternalLink size={14} className="ml-1" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 my-4">
      <h3 className="font-semibold mb-3">Passende Berater für dich:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {berater.map((b) => {
          // Bestimme die zu verwendende Bildquelle mit Fallback
          const imageSrc = imageErrors[b.id]
            ? `/placeholder.svg?height=64&width=64&query=profile%20${b.name.split(" ")[0]}`
            : b.profilBild || "/abstract-profile.png"

          return (
            <div key={b.id} className="flex flex-col items-center text-center p-2 rounded-lg hover:bg-gray-50">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2 bg-gray-100">
                <Image
                  src={imageSrc || "/placeholder.svg"}
                  alt={b.name}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  onError={() => handleImageError(b.id)}
                />
              </div>
              <h4 className="font-medium text-sm">{b.name}</h4>
              <p className="text-xs text-gray-600 mb-1">{b.spezialisierung[0]}</p>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <MapPin size={10} className="mr-1" />
                {b.standort.ort}
              </div>
              <div className="flex items-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={10}
                    className={i < Math.floor(b.bewertung) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                  />
                ))}
                <span className="text-xs text-gray-500 ml-1">({b.anzahlBewertungen})</span>
              </div>
              <Link href={`/berater/${b.id}`}>
                <Button variant="outline" size="sm" className="text-xs h-7 px-2">
                  Profil ansehen
                </Button>
              </Link>
            </div>
          )
        })}
      </div>
      <div className="mt-3 text-center">
        <Link href="/berater">
          <Button variant="link" size="sm" className="text-xs">
            Alle Berater anzeigen <ExternalLink size={12} className="ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
