export interface Standort {
  lat: number
  lng: number
  ort: string
  land: string
}

export interface Verfügbarkeit {
  onlineBeratung: boolean
  vorOrt: boolean
  nächsterTermin?: Date
}

export interface Berater {
  id: string
  name: string
  profilBild?: string
  spezialisierung: string[]
  beschreibung: string
  standort: Standort
  kontakt: {
    telefon: string
    email: string
    website?: string
  }
  sprachen: string[]
  verfügbarkeit: Verfügbarkeit
  bewertung: number
  anzahlBewertungen: number
  persönlichkeitsTypen: string[]
}

export interface FilterOptions {
  spezialisierung?: string
  sprache?: string
  land?: string
  nurOnlineBeratung: boolean
  nurVorOrt: boolean
  minBewertung: number
}
