import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { calculateDimensionScores, determinePersonalityType, translateDimension } from "./personality-types"
import { generateEnhancedCareerRecommendations } from "./career-recommendations"
import type { LinkedInProfile } from "./career-recommendations"

// Hilfsfunktion zum Formatieren des Datums
function formatDate(date: Date): string {
  return date.toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Ändern Sie die Hauptfunktion, um konsistente Seitenränder zu verwenden
export async function generatePersonalityProfilePDF(
  results: number[],
  userData: {
    name: string
    email: string
  },
  linkedInProfile?: LinkedInProfile,
): Promise<Blob> {
  try {
    // PDF erstellen (A4 Format)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Definiere konsistente Seitenränder
    const margin = {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20,
    }

    // Berechne die verfügbare Textbreite
    const pageWidth = doc.internal.pageSize.width
    const textWidth = pageWidth - margin.left - margin.right

    // Dimensionswerte berechnen
    const dimensionScores = calculateDimensionScores(results)

    // Persönlichkeitstyp bestimmen
    const personalityType = determinePersonalityType(results)

    // Karriereempfehlungen generieren
    const { careers, explanation } = generateEnhancedCareerRecommendations(dimensionScores, linkedInProfile)

    // Aktuelles Datum
    const currentDate = new Date()
    const formattedDate = formatDate(currentDate)

    // Titelseite
    doc.setFillColor(141, 129, 120) // Stone-500 Farbe
    doc.rect(0, 0, pageWidth, 40, "F")

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.text("True North", pageWidth / 2, 25, { align: "center" })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(20)
    doc.text("Persönlichkeitsprofil", pageWidth / 2, 60, { align: "center" })

    doc.setFontSize(16)
    doc.text(userData.name, pageWidth / 2, 80, { align: "center" })

    doc.setFontSize(12)
    doc.text(`Erstellt am: ${formattedDate}`, pageWidth / 2, 95, { align: "center" })

    // Persönlichkeitstyp auf der Titelseite
    doc.setFontSize(14)
    doc.text(`Persönlichkeitstyp: ${personalityType.title}`, pageWidth / 2, 120, { align: "center" })

    doc.setFontSize(10)
    doc.text("© True North Karriere-Kompass", pageWidth / 2, 285, { align: "center" })

    // Neue Seite: Einleitung
    doc.addPage()

    doc.setFontSize(18)
    doc.text("Einleitung", margin.left, margin.top)

    doc.setFontSize(12)
    const introText = [
      "Das vorliegende Persönlichkeitsprofil basiert auf dem wissenschaftlich fundierten Big Five Persönlichkeitsmodell (auch bekannt als OCEAN-Modell), das als einer der zuverlässigsten Ansätze zur Erfassung von Persönlichkeitsmerkmalen gilt. Dieses Modell identifiziert fünf grundlegende Dimensionen der Persönlichkeit: Offenheit für Erfahrungen (O), Gewissenhaftigkeit (C), Extraversion (E), Verträglichkeit (A) und Neurotizismus (N).",

      "Die Erstellung Ihres Profils erfolgte durch die Analyse Ihrer Antworten auf einen standardisierten Fragebogen. Jede Frage wurde entwickelt, um bestimmte Aspekte einer oder mehrerer Dimensionen zu erfassen. Ihre Antworten wurden algorithmisch ausgewertet, um Ihre individuellen Ausprägungen in den fünf Dimensionen zu bestimmen.",

      "Basierend auf Ihren dominanten Dimensionen wurde Ihr spezifischer Persönlichkeitstyp ermittelt. Dieser Typ fasst Ihre charakteristischen Merkmale zusammen und bietet einen Rahmen für das Verständnis Ihrer natürlichen Neigungen, Stärken und potenziellen Herausforderungen.",

      "Es ist wichtig zu betonen, dass dieses Profil als Orientierungshilfe und Reflexionsinstrument dient, nicht als unveränderliche Festlegung Ihrer Persönlichkeit. Menschen sind komplex und entwickeln sich kontinuierlich weiter.",
    ]

    let introY = margin.top + 20
    introText.forEach((paragraph) => {
      const lines = doc.splitTextToSize(paragraph, textWidth)
      doc.text(lines, margin.left, introY)
      introY += lines.length * 6 + 4 // Abstand zwischen Absätzen
    })

    doc.setFontSize(10)
    doc.text("© True North Karriere-Kompass", pageWidth / 2, 285, { align: "center" })
    doc.text("Seite 2", pageWidth - margin.right, 285, { align: "right" })

    // Neue Seite: Persönliche Daten
    doc.addPage()

    doc.setFontSize(18)
    doc.text("Persönliche Daten", margin.left, margin.top)

    doc.setFontSize(12)
    doc.text(`Name: ${userData.name}`, margin.left, margin.top + 20)
    doc.text(`E-Mail: ${userData.email}`, margin.left, margin.top + 30)
    doc.text(`Datum der Erstellung: ${formattedDate}`, margin.left, margin.top + 40)
    doc.text(`Persönlichkeitstyp: ${personalityType.title}`, margin.left, margin.top + 50)

    if (linkedInProfile) {
      doc.text("LinkedIn-Profil verbunden: Ja", margin.left, margin.top + 60)
      doc.text(`Aktuelle Position: ${linkedInProfile.currentPosition.title}`, margin.left, margin.top + 70)
      doc.text(`Unternehmen: ${linkedInProfile.currentPosition.company}`, margin.left, margin.top + 80)
    } else {
      doc.text("LinkedIn-Profil verbunden: Nein", margin.left, margin.top + 60)
    }

    doc.setFontSize(10)
    doc.text("© True North Karriere-Kompass", pageWidth / 2, 285, { align: "center" })
    doc.text("Seite 3", pageWidth - margin.right, 285, { align: "right" })

    // Neue Seite: Überblick
    doc.addPage()

    doc.setFontSize(18)
    doc.text("Überblick", margin.left, margin.top)

    doc.setFontSize(14)
    doc.text("Persönlicher Stil", margin.left, margin.top + 15)

    doc.setFontSize(12)
    const descriptionLines = doc.splitTextToSize(personalityType.description, textWidth)
    doc.text(descriptionLines, margin.left, margin.top + 25)

    doc.setFontSize(14)
    doc.text("Dimensionswerte", margin.left, margin.top + 60)

    // Dimensionswerte als Tabelle
    let tableY = margin.top + 70
    const dimensions = ["O", "C", "E", "A", "N"]

    dimensions.forEach((dim, index) => {
      const score = dimensionScores[dim as keyof typeof dimensionScores]
      const percentage = Math.round((score / 5) * 100)

      doc.setFontSize(12)
      doc.text(`${translateDimension(dim as any)}: ${percentage}%`, margin.left, tableY)
      tableY += 10
    })

    doc.setFontSize(10)
    doc.text("© True North Karriere-Kompass", pageWidth / 2, 285, { align: "center" })
    doc.text("Seite 4", pageWidth - margin.right, 285, { align: "right" })

    // Neue Seite: Karriereempfehlungen
    doc.addPage()

    doc.setFontSize(18)
    doc.text("Karriereempfehlungen", margin.left, margin.top)

    doc.setFontSize(12)
    const careerText = `Basierend auf Ihrem Persönlichkeitsprofil haben wir folgende Berufsfelder für Sie identifiziert, die gut zu Ihnen passen könnten:`
    const careerTextLines = doc.splitTextToSize(careerText, textWidth)
    doc.text(careerTextLines, margin.left, margin.top + 20)

    let careerY = margin.top + 40
    careers.forEach((career, index) => {
      const careerLine = `• ${career}`
      const wrappedCareerLine = doc.splitTextToSize(careerLine, textWidth)
      doc.text(wrappedCareerLine, margin.left, careerY)
      careerY += wrappedCareerLine.length * 6 + 4
    })

    doc.setFontSize(10)
    doc.text("© True North Karriere-Kompass", pageWidth / 2, 285, { align: "center" })
    doc.text("Seite 5", pageWidth - margin.right, 285, { align: "right" })

    // PDF als Blob zurückgeben
    return doc.output("blob")
  } catch (error) {
    console.error("Fehler bei der PDF-Generierung:", error)

    // Erstelle ein einfaches Fehler-PDF
    const errorDoc = new jsPDF()
    errorDoc.text("Bei der Generierung des Persönlichkeitsprofils ist ein Fehler aufgetreten.", 20, 20)
    errorDoc.text("Bitte versuchen Sie es später erneut oder kontaktieren Sie den Support.", 20, 30)

    return errorDoc.output("blob")
  }
}
