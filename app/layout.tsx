import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"

export const metadata: Metadata = {
  title: "True North - Karriere-Kompass",
  description: "Finde deinen beruflichen Sweet Spot mit KI und Psychologie",
    generator: 'v0.dev'
}

// Fügen Sie einen separaten viewport-Export hinzu
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  )
}
