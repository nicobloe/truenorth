import type React from "react"
import type { Metadata, Viewport } from "next"

// Entfernen Sie viewport aus dem metadata-Objekt
export const metadata: Metadata = {
  title: "True North - Persönlichkeitstest",
  description: "Finde deinen beruflichen Sweet Spot mit KI und Psychologie",
}

// Fügen Sie einen separaten viewport-Export hinzu
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
