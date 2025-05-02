import { type NextRequest, NextResponse } from "next/server"
import { generatePersonalityProfilePDF } from "@/lib/pdf-generator"

export async function POST(req: NextRequest) {
  try {
    const { results, userData, linkedInProfile } = await req.json()

    if (!results || !userData) {
      return NextResponse.json({ error: "Fehlende Daten: results und userData sind erforderlich" }, { status: 400 })
    }

    try {
      const pdfBlob = await generatePersonalityProfilePDF(results, userData, linkedInProfile)

      // Prüfen, ob der Blob gültig ist
      if (!pdfBlob || pdfBlob.size < 1000) {
        throw new Error("PDF-Generierung fehlgeschlagen: Leere oder ungültige PDF")
      }

      // Konvertiere Blob zu ArrayBuffer für die Antwort
      const arrayBuffer = await pdfBlob.arrayBuffer()

      return new NextResponse(arrayBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${userData.name.replace(/\s+/g, "_")}_True_North_Profil.pdf"`,
        },
      })
    } catch (pdfError) {
      console.error("Fehler bei der PDF-Generierung:", pdfError)
      return NextResponse.json({ error: `PDF-Generierung fehlgeschlagen: ${pdfError.message}` }, { status: 500 })
    }
  } catch (error) {
    console.error("Allgemeiner Fehler:", error)
    return NextResponse.json({ error: `Allgemeiner Fehler: ${error.message}` }, { status: 500 })
  }
}
