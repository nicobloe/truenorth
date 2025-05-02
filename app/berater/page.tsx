"use client"

import { useState, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { MapPin } from "lucide-react"

import { beraterData } from "@/lib/berater-data"
import { BeraterFilter, type BeraterFilter as BeraterFilterType } from "@/components/berater/BeraterFilter"
import { BeraterListe } from "@/components/berater/BeraterListe"
import { BeraterMap } from "@/components/berater/BeraterMap"
import { BeraterMapFallback } from "@/components/berater/BeraterMapFallback"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"

export default function BeraterPage() {
  const router = useRouter()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isMapView, setIsMapView] = useState(false)
  const [filter, setFilter] = useState<BeraterFilterType>({
    spezialisierung: [],
    sprachen: [],
    onlineBeratung: false,
    vorOrt: false,
    land: "Schweiz", // Standardmäßig auf Schweiz gesetzt, da wir nur Schweizer Berater haben
  })

  // Memoize the filtered beraters to avoid unnecessary recalculations
  const filteredBerater = useMemo(() => {
    return beraterData.filter((berater) => {
      // Filter by specialization if any are selected
      if (
        filter.spezialisierung.length > 0 &&
        !filter.spezialisierung.some((spec) => berater.spezialisierung.includes(spec))
      ) {
        return false
      }

      // Filter by languages if any are selected
      if (filter.sprachen.length > 0 && !filter.sprachen.some((lang) => berater.sprachen.includes(lang))) {
        return false
      }

      // Filter by availability
      if (filter.onlineBeratung && !berater.verfügbarkeit.onlineBeratung) {
        return false
      }

      if (filter.vorOrt && !berater.verfügbarkeit.vorOrt) {
        return false
      }

      // Filter by country - now always true since we only have Swiss advisors
      return true
    })
  }, [filter])

  // Sort beraters by distance to user if location is available
  const sortedBerater = useMemo(() => {
    if (!userLocation) return filteredBerater

    return [...filteredBerater].sort((a, b) => {
      const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.standort.lat, a.standort.lng)
      const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.standort.lat, b.standort.lng)
      return distanceA - distanceB
    })
  }, [filteredBerater, userLocation])

  const handleFilterChange = useCallback((newFilter: BeraterFilterType) => {
    setFilter(newFilter)
  }, [])

  const handleBackClick = useCallback(() => {
    router.push("/dashboard")
  }, [router])

  const handleGetLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }, [])

  // Calculate distance between two points
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Karriereberater finden</h1>
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          Zurück
        </Button>
      </div>

      <div className="mb-6">
        <BeraterFilter onFilterChange={handleFilterChange} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{filteredBerater.length} Berater gefunden</p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleGetLocation} className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>Standort verwenden</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="liste" onValueChange={(value) => setIsMapView(value === "karte")}>
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="liste">Liste</TabsTrigger>
          <TabsTrigger value="karte">Karte</TabsTrigger>
        </TabsList>
        <TabsContent value="liste">
          <BeraterListe berater={sortedBerater} userLocation={userLocation} />
        </TabsContent>
        <TabsContent value="karte">
          {typeof window !== "undefined" ? (
            <BeraterMap berater={sortedBerater} userLocation={userLocation} />
          ) : (
            <BeraterMapFallback berater={sortedBerater} userLocation={userLocation} />
          )}
        </TabsContent>
      </Tabs>

      <BottomNavigationSpacer />
      <BottomNavigation />
    </div>
  )
}
