"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { beraterData } from "@/lib/berater-data"
import { BackButton } from "@/components/BackButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/BottomNavigation"
import { BottomNavigationSpacer } from "@/components/BottomNavigationSpacer"
import { Calendar, MapPin, Phone, Mail, Globe, Star, Languages, Clock } from "lucide-react"

export default function BeraterDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [berater, setBerater] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (params?.id) {
      const foundBerater = beraterData.find((b) => b.id === params.id)
      setBerater(foundBerater || null)
      setLoading(false)
    }
  }, [params])

  const handleImageError = () => {
    setImageError(true)
  }

  // Funktion zum Vereinbaren eines Termins
  const handleTerminVereinbaren = () => {
    // Hier könnte eine echte Terminvereinbarungsfunktion implementiert werden
    // z.B. Öffnen eines Modals, Weiterleitung zu einem Kalender oder API-Aufruf
    alert(`Terminanfrage für ${berater.name} wird gesendet...`)
    // Alternativ: router.push(`/termin-vereinbaren/${berater.id}`);
  }

  // Funktion zum Kontaktieren des Beraters
  const handleKontaktAufnehmen = () => {
    // Hier könnte eine Kontaktfunktion implementiert werden
    // z.B. Öffnen eines Kontaktformulars oder E-Mail-Client
    alert(`Kontaktaufnahme mit ${berater.name} wird initiiert...`)
    // Alternativ: window.location.href = `mailto:${berater.kontakt.email}`;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>Lade Beraterprofil...</p>
        </div>
      </div>
    )
  }

  if (!berater) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Berater nicht gefunden</h1>
          <p className="mb-6">Der gesuchte Berater konnte nicht gefunden werden.</p>
          <Button onClick={() => router.push("/berater")}>Zurück zur Übersicht</Button>
        </div>
      </div>
    )
  }

  // Bestimme die zu verwendende Bildquelle mit Fallback
  const imageSrc = imageError
    ? `/placeholder.svg?height=128&width=128&query=profile%20${berater.name.split(" ")[0]}`
    : berater.profilBild || "/abstract-profile.png"

  const formatDate = (date) => {
    if (!date) return "Flexibel"
    return new Intl.DateTimeFormat("de-CH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between relative">
          <div className="flex items-center">
            <BackButton href="/berater" className="text-stone-600 hover:text-stone-800" />
          </div>
          <h1 className="text-xl font-semibold text-stone-800 absolute left-1/2 transform -translate-x-1/2">
            Beraterprofil
          </h1>
          <Link href="/" className="flex items-center">
            <Image
              src="/true-north-logo.png"
              alt="True North Logo"
              width={100}
              height={32}
              priority
              className="h-8 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-32 bg-gradient-to-r from-stone-300 to-stone-500">
            <div className="absolute -bottom-16 left-4 md:left-8 w-32 h-32 rounded-full border-4 border-white overflow-hidden">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={berater.name}
                width={128}
                height={128}
                className="object-cover w-full h-full"
                onError={handleImageError}
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-4 md:px-8 pb-6">
            <h1 className="text-2xl font-bold">{berater.name}</h1>
            <div className="flex items-center mt-1 text-gray-600">
              <MapPin size={16} className="mr-1" />
              <span>
                {berater.standort.ort}, {berater.standort.land}
              </span>
            </div>

            <div className="flex items-center mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`${i < Math.floor(berater.bewertung) ? "text-yellow-400" : "text-gray-300"} ${
                    i === Math.floor(berater.bewertung) && berater.bewertung % 1 > 0
                      ? "text-yellow-400 fill-yellow-400"
                      : ""
                  }`}
                  fill={i < Math.floor(berater.bewertung) ? "currentColor" : "none"}
                />
              ))}
              <span className="ml-2 text-sm">
                {berater.bewertung} ({berater.anzahlBewertungen} Bewertungen)
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {berater.spezialisierung.map((spez) => (
                <Badge key={spez} variant="outline" className="bg-blue-50">
                  {spez}
                </Badge>
              ))}
            </div>

            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Über mich</h2>
              <p className="text-gray-700">{berater.beschreibung}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Kontakt</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Phone size={16} className="mr-3 text-blue-600" />
                      <span>{berater.kontakt.telefon}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-3 text-blue-600" />
                      <span>{berater.kontakt.email}</span>
                    </div>
                    {berater.kontakt.website && (
                      <div className="flex items-center">
                        <Globe size={16} className="mr-3 text-blue-600" />
                        <a
                          href={berater.kontakt.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {berater.kontakt.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Verfügbarkeit</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Clock size={16} className="mr-3 text-blue-600 mt-1" />
                      <div>
                        <p>
                          {berater.verfügbarkeit.onlineBeratung && "Online-Beratung verfügbar"}
                          {berater.verfügbarkeit.onlineBeratung && berater.verfügbarkeit.vorOrt && ", "}
                          {berater.verfügbarkeit.vorOrt && "Beratung vor Ort möglich"}
                        </p>
                        {berater.verfügbarkeit.nächsterTermin && (
                          <p className="text-sm text-gray-600 mt-1">
                            Nächster freier Termin: {formatDate(berater.verfügbarkeit.nächsterTermin)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Languages size={16} className="mr-3 text-blue-600" />
                      <span>{berater.sprachen.join(", ")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 mb-20">
              <Button className="flex-1 py-5" size="lg" onClick={handleTerminVereinbaren}>
                <Calendar className="mr-2 h-4 w-4" /> Termin vereinbaren
              </Button>
              <Button variant="outline" className="flex-1 py-5" size="lg" onClick={handleKontaktAufnehmen}>
                <Phone className="mr-2 h-4 w-4" /> Kontakt aufnehmen
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
