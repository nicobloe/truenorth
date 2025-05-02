import type { Berater } from "./berater-types"

export const beraterData: Berater[] = [
  {
    id: "1",
    name: "Gianni Clavadetscher",
    profilBild: "/gianni-clavadetscher.png", // Lokales Bild
    spezialisierung: ["Führungskräfteentwicklung", "Karriereberatung", "Konfliktmanagement"],
    beschreibung:
      "Als erfahrener Impulsgeber, Sparringpartner und Konfliktlöser unterstützt Gianni Clavadetscher Führungskräfte und Fachpersonen bei ihrer beruflichen Entwicklung. Mit seinem umfassenden Erfahrungsschatz hilft er Klienten, Herausforderungen zu meistern und neue Perspektiven zu gewinnen. Seine pragmatische und lösungsorientierte Herangehensweise ermöglicht nachhaltige Veränderungen im beruflichen Kontext.",
    standort: {
      lat: 46.9724,
      lng: 8.3932,
      ort: "Ennetbürgen",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 79 819 24 36",
      email: "info@gianni-clavadetscher.ch",
      website: "https://gianni-clavadetscher.ch",
    },
    sprachen: ["Deutsch", "Englisch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: true,
      nächsterTermin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // In 2 Tagen
    },
    bewertung: 4.9,
    anzahlBewertungen: 47,
    persönlichkeitsTypen: ["ENTJ", "INTJ", "ENFJ", "INFJ"],
  },
  {
    id: "2",
    name: "Dr. Sarah Meier",
    profilBild: "/professional-woman-glasses.png",
    spezialisierung: ["Karriereberatung", "Führungskräfteentwicklung", "Work-Life-Balance"],
    beschreibung:
      "Erfahrene Karriereberaterin mit Schwerpunkt auf Führungskräfteentwicklung und Work-Life-Balance. Spezialisiert auf die Beratung von Fachkräften in der Finanz- und Pharmabranche.",
    standort: {
      lat: 47.3769,
      lng: 8.5417,
      ort: "Zürich",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 44 123 45 67",
      email: "sarah.meier@example.ch",
      website: "www.meier-karriereberatung.ch",
    },
    sprachen: ["Deutsch", "Englisch", "Französisch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: true,
      nächsterTermin: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    bewertung: 4.9,
    anzahlBewertungen: 87,
    persönlichkeitsTypen: ["INTJ", "ENTJ", "INFJ"],
  },
  {
    id: "3",
    name: "Marc Brunner",
    profilBild: "/professional-man-smiling.png",
    spezialisierung: ["Bewerbungscoaching", "Karrierewechsel", "Digitale Transformation"],
    beschreibung:
      "Spezialist für berufliche Neuorientierung und Karrierewechsel mit Fokus auf die digitale Transformation. Unterstützt bei der Positionierung in einem sich wandelnden Arbeitsmarkt.",
    standort: {
      lat: 46.948,
      lng: 7.4474,
      ort: "Bern",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 31 987 65 43",
      email: "marc.brunner@example.ch",
      website: "www.brunner-coaching.ch",
    },
    sprachen: ["Deutsch", "Englisch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: true,
    },
    bewertung: 4.7,
    anzahlBewertungen: 62,
    persönlichkeitsTypen: ["ESTJ", "ENTJ", "ISTJ"],
  },
  {
    id: "4",
    name: "Céline Dubois",
    profilBild: "/young-professional-woman.png",
    spezialisierung: ["Berufseinstieg", "Studienwahl", "Persönlichkeitsentwicklung"],
    beschreibung:
      "Karriereberaterin mit Fokus auf junge Erwachsene und Studienabsolventen. Unterstützt bei der Studienwahl und beim erfolgreichen Berufseinstieg.",
    standort: {
      lat: 46.2044,
      lng: 6.1432,
      ort: "Genf",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 22 345 67 89",
      email: "celine.dubois@example.ch",
      website: "www.dubois-orientation.ch",
    },
    sprachen: ["Französisch", "Englisch", "Deutsch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: true,
      nächsterTermin: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    },
    bewertung: 4.8,
    anzahlBewertungen: 45,
    persönlichkeitsTypen: ["ENFP", "INFP", "ENFJ"],
  },
  {
    id: "5",
    name: "Thomas Keller",
    profilBild: "/mature-professional-man.png",
    spezialisierung: ["Strategische Karriereplanung", "Gehaltsverhandlung", "Führungskräfteentwicklung"],
    beschreibung:
      "Ehemaliger HR-Direktor mit über 20 Jahren Erfahrung in der Personalentwicklung. Berät Fach- und Führungskräfte bei strategischen Karriereentscheidungen und Gehaltsverhandlungen.",
    standort: {
      lat: 47.4979,
      lng: 8.7273,
      ort: "Winterthur",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 52 234 56 78",
      email: "thomas.keller@example.ch",
    },
    sprachen: ["Deutsch", "Englisch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: false,
    },
    bewertung: 4.6,
    anzahlBewertungen: 73,
    persönlichkeitsTypen: ["ENTJ", "INTJ", "ESTJ"],
  },
  {
    id: "6",
    name: "Alessia Rossi",
    profilBild: "/young-woman-career-advisor.png",
    spezialisierung: ["Work-Life-Balance", "Stressmanagement", "Karriereplanung"],
    beschreibung:
      "Psychologin und Karriereberaterin mit Schwerpunkt auf Work-Life-Balance und Stressbewältigung. Hilft bei der Entwicklung nachhaltiger Karrierestrategien unter Berücksichtigung persönlicher Bedürfnisse.",
    standort: {
      lat: 46.0037,
      lng: 8.9511,
      ort: "Lugano",
      land: "Schweiz",
    },
    kontakt: {
      telefon: "+41 91 876 54 32",
      email: "alessia.rossi@example.ch",
      website: "www.rossi-carriera.ch",
    },
    sprachen: ["Italienisch", "Deutsch", "Englisch"],
    verfügbarkeit: {
      onlineBeratung: true,
      vorOrt: true,
    },
    bewertung: 4.9,
    anzahlBewertungen: 38,
    persönlichkeitsTypen: ["INFJ", "ENFJ", "ISFJ"],
  },
]

export function findMatchingAdvisors(
  personalityType: string,
  userLocation: { lat: number; lng: number } | null,
): Berater[] {
  // Simuliere das Filtern der Berater basierend auf dem Persönlichkeitstyp und Standort des Nutzers
  // In einer echten Anwendung würden wir hier eine komplexere Logik verwenden, um die passenden Berater zu finden
  const filteredAdvisors = beraterData.filter((berater) => berater.persönlichkeitsTypen.includes(personalityType))

  // Simuliere die Sortierung der Berater basierend auf der Entfernung zum Nutzer
  if (userLocation) {
    filteredAdvisors.sort((a, b) => {
      const distanceA = calculateDistance(userLocation.lat, userLocation.lng, a.standort.lat, a.standort.lng)
      const distanceB = calculateDistance(userLocation.lat, userLocation.lng, b.standort.lat, b.standort.lng)
      return distanceA - distanceB
    })
  }

  return filteredAdvisors.slice(0, 3) // Gib maximal 3 Berater zurück
}

// Hilfsfunktion zur Berechnung der Entfernung zwischen zwei geografischen Punkten
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius der Erde in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Entfernung in km
  return d
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}
