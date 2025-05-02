import { calculateDimensionScores, determinePersonalityType } from "./personality-types"
import { questions } from "./questions"

// Diese Funktion wurde deaktiviert, um den Debug-Button zu entfernen
export function addDebugButton() {
  // Tut nichts mehr
  return
}

// Debug-Funktion zur Überprüfung der Konsistenz der Persönlichkeitstypen
export function debugPersonalityType() {
  // Lade die Testergebnisse aus dem localStorage
  const testResults = localStorage.getItem("testResults")
  if (!testResults) {
    console.error("Keine Testergebnisse gefunden")
    return
  }

  const results = JSON.parse(testResults)

  // Berechne die Dimensionswerte und den Persönlichkeitstyp mit und ohne Testfragen
  const dimensionScoresWithQuestions = calculateDimensionScores(results, questions)
  const personalityTypeWithQuestions = determinePersonalityType(results, questions)

  const dimensionScoresWithoutQuestions = calculateDimensionScores(results)
  const personalityTypeWithoutQuestions = determinePersonalityType(results)

  // Vergleiche die Ergebnisse
  const dimensionsMatch =
    JSON.stringify(dimensionScoresWithQuestions) === JSON.stringify(dimensionScoresWithoutQuestions)
  const typesMatch = personalityTypeWithQuestions.title === personalityTypeWithoutQuestions.title

  // Logge die Ergebnisse
  console.log("Dimensionswerte (mit Testfragen):", JSON.stringify(dimensionScoresWithQuestions))
  console.log("Persönlichkeitstyp (mit Testfragen):", personalityTypeWithQuestions.title)
  console.log("Dimensionswerte (ohne Testfragen):", JSON.stringify(dimensionScoresWithoutQuestions))
  console.log("Persönlichkeitstyp (ohne Testfragen):", personalityTypeWithoutQuestions.title)
  console.log("Dimensionswerte stimmen überein:", dimensionsMatch)
  console.log("Persönlichkeitstypen stimmen überein:", typesMatch)

  // Lade den gespeicherten Persönlichkeitstyp aus dem localStorage
  const savedPersonalityType = localStorage.getItem("personalityType")
  if (savedPersonalityType) {
    const parsedType = JSON.parse(savedPersonalityType)
    console.log("Berechneter Persönlichkeitstyp:", parsedType.title)
    console.log("Berechnete Dimensionswerte:", JSON.stringify(parsedType.dimensionScores))
  }
}
