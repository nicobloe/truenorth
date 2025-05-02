import type { TestQuestion } from "./questions"

export const questionDimensions: { [key: number]: "O" | "C" | "E" | "A" | "N" } = {
  1: "O",
  2: "O",
  3: "O",
  4: "O",
  5: "O",
  6: "O",
  7: "C",
  8: "C",
  9: "C",
  10: "C",
  11: "C",
  12: "C",
  13: "E",
  14: "E",
  15: "E",
  16: "E",
  17: "E",
  18: "E",
  19: "A",
  20: "A",
  21: "A",
  22: "A",
  23: "A",
  24: "A",
  25: "N",
  26: "N",
  27: "N",
  28: "N",
  29: "N",
  30: "N",
}

import {
  Briefcase,
  Code,
  Lightbulb,
  Users,
  BarChart,
  Rocket,
  Heart,
  CastleIcon as ChessKnight,
  Calendar,
  ArrowUp,
  BracketsIcon as Bridge,
  Paintbrush,
  MessageSquare,
  Search,
  TrendingUp,
} from "lucide-react"

// Persönlichkeitstypen mit Titeln, Beschreibungen und Icons
export const personalityTypes = {
  // Kreative Typen
  VISIONARY: {
    title: "Der Visionär",
    description:
      "Du denkst in großen Bildern, liebst es, neue Wege zu finden und andere mit deinen Ideen zu begeistern. Du fühlst dich in kreativen, dynamischen Arbeitsfeldern wohl – am besten, wenn du gestaltest statt verwaltest.",
    icon: Lightbulb,
    careers: ["Unternehmer", "Designer", "Marketingexperte", "Kreativdirektor"],
    color: "bg-amber-500",
    swissContext:
      "Innovative Unternehmen und die wachsende Startup-Szene bieten ideale Umgebungen für Visionäre. Deine Fähigkeit, neue Ideen zu entwickeln, wird besonders in der Innovations- und Technologiebranche geschätzt.",
  },
  INNOVATOR: {
    title: "Der Innovator",
    description:
      "Du bist ständig auf der Suche nach neuen Lösungen und Verbesserungen. Routine langweilt dich, während komplexe Probleme dich motivieren. Du bist zukunftsorientiert und siehst Möglichkeiten, wo andere Hindernisse sehen.",
    icon: Rocket,
    careers: ["Produktentwickler", "Forscher", "Startup-Gründer", "Zukunftsforscher"],
    color: "bg-blue-500",
    swissContext:
      "Die Schweiz mit ihren Forschungszentren wie ETH, EPFL und zahlreichen R&D-Abteilungen internationaler Unternehmen bietet ein ideales Umfeld für Innovatoren. Besonders in den Bereichen Medtech, Pharma und Präzisionstechnologie werden deine innovativen Ansätze geschätzt.",
  },

  // Soziale Typen
  TEAM_PLAYER: {
    title: "Der Teamplayer",
    description:
      "Du arbeitest gerne mit anderen zusammen und bist ein ausgezeichneter Kommunikator. Du schätzt Harmonie und kannst gut vermitteln. In kooperativen Umgebungen, wo Menschen im Mittelpunkt stehen, entfaltest du dein volles Potenzial.",
    icon: Users,
    careers: ["HR-Manager", "Lehrer", "Teamleiter", "Event-Manager"],
    color: "bg-green-500",
    swissContext:
      "In Organisationen mit konsensorientierter Kultur werden Teamplayer besonders geschätzt. Internationale Organisationen, Bildungseinrichtungen und multinationale Unternehmen bieten ideale Arbeitsumgebungen für deine kooperative Art.",
  },
  SUPPORTER: {
    title: "Der Unterstützer",
    description:
      "Du findest Erfüllung darin, anderen zu helfen und sie zu unterstützen. Empathie ist deine Stärke, und du kannst dich gut in die Bedürfnisse anderer einfühlen. Du schaffst eine positive Atmosphäre um dich herum.",
    icon: Heart,
    careers: ["Berater", "Therapeut", "Sozialarbeiter", "Pflegekraft"],
    color: "bg-rose-500",
    swissContext:
      "Das hochentwickelte Schweizer Gesundheits- und Sozialsystem bietet vielfältige Möglichkeiten für Unterstützer. Besonders in den Bereichen Gesundheitswesen, Beratung und im Non-Profit-Sektor kannst du deine empathischen Fähigkeiten optimal einsetzen.",
  },

  // Analytische Typen
  ANALYST: {
    title: "Der Analytiker",
    description:
      "Du hast ein Auge fürs Detail und liebst es, Probleme systematisch zu lösen. Daten und Fakten sind deine Welt. Du fühlst dich in strukturierten Umgebungen wohl, wo präzises Arbeiten und logisches Denken gefragt sind.",
    icon: BarChart,
    careers: ["Datenanalyst", "Wissenschaftler", "Finanzexperte", "Ingenieur"],
    color: "bg-indigo-500",
    swissContext:
      "Der starke Finanzsektor, die Pharmaindustrie und Präzisionstechnik bieten ideale Karrieremöglichkeiten für Analytiker. Deine Fähigkeit zur detaillierten Analyse wird besonders im Fintech-Sektor geschätzt.",
  },
  STRATEGIST: {
    title: "Der Stratege",
    description:
      "Du denkst mehrere Schritte voraus und erkennst Muster und Zusammenhänge. Du kannst komplexe Situationen durchschauen und entwickelst gerne langfristige Pläne. Strategisches Denken ist deine Stärke.",
    icon: ChessKnight,
    careers: ["Unternehmensberater", "Projektmanager", "Strategieentwickler", "Spieleentwickler"],
    color: "bg-purple-500",
    swissContext:
      "In der Schweiz mit ihren vielen internationalen Hauptsitzen, Beratungsunternehmen und der langfristig orientierten Geschäftskultur sind strategische Denker sehr gefragt. Besonders in Genf, Zürich und Basel findest du Unternehmen, die deine vorausschauende Denkweise schätzen.",
  },

  // Praktische Typen
  PRACTITIONER: {
    title: "Der Praktiker",
    description:
      "Du bist bodenständig und lösungsorientiert. Du bevorzugst konkrete Aufgaben und greifbare Ergebnisse. In Berufen mit klaren Zielen und praktischen Herausforderungen kommst du am besten zur Geltung.",
    icon: Briefcase,
    careers: ["Handwerker", "Techniker", "Landwirt", "Koch"],
    color: "bg-stone-500",
    swissContext:
      "Die Schweiz mit ihrer starken Tradition im Handwerk, der Präzisionstechnik und dem dualen Bildungssystem bietet hervorragende Möglichkeiten für Praktiker. Besonders in der Uhrenindustrie, im Maschinenbau und in der Lebensmittelproduktion werden deine praktischen Fähigkeiten geschätzt.",
  },
  ORGANIZER: {
    title: "Der Organisator",
    description:
      "Du liebst Ordnung und Struktur. Du bist zuverlässig, planst gerne im Voraus und behältst den Überblick. Du kannst gut priorisieren und sorgst dafür, dass alles reibungslos läuft.",
    icon: Calendar,
    careers: ["Projektkoordinator", "Office-Manager", "Logistiker", "Veranstaltungsplaner"],
    color: "bg-teal-500",
    swissContext:
      "Die Schweiz mit ihrer Wertschätzung für Präzision, Pünktlichkeit und Zuverlässigkeit ist ein ideales Umfeld für Organisatoren. In der Logistikbranche, im Event-Management und in administrativen Positionen in multinationalen Unternehmen kannst du deine organisatorischen Talente voll entfalten.",
  },

  // Führungstypen
  DECISION_MAKER: {
    title: "Der Entscheider",
    description:
      "Du übernimmst gerne Verantwortung und scheust dich nicht, Entscheidungen zu treffen. Du bist zielorientiert und kannst andere motivieren. In Führungspositionen fühlst du dich wohl und kannst deine Stärken voll entfalten.",
    icon: ArrowUp,
    careers: ["Geschäftsführer", "Abteilungsleiter", "Politiker", "Sporttrainer"],
    color: "bg-red-500",
    swissContext:
      "In der Schweiz mit ihrer konsensorientierten Führungskultur sind Entscheider gefragt, die sowohl durchsetzungsfähig als auch diplomatisch sind. In Führungspositionen in Schweizer KMUs, internationalen Organisationen und im öffentlichen Sektor kannst du deine Entscheidungsstärke einbringen.",
  },
  MEDIATOR: {
    title: "Der Vermittler",
    description:
      "Du bist ein ausgezeichneter Kommunikator und kannst zwischen verschiedenen Interessen vermitteln. Du findest Kompromisse und baust Brücken zwischen Menschen. In Verhandlungssituationen bist du in deinem Element.",
    icon: Bridge,
    careers: ["Diplomat", "Mediator", "Account Manager", "PR-Berater"],
    color: "bg-sky-500",
    swissContext:
      "Die mehrsprachige und multikulturelle Schweiz mit ihren vielen internationalen Organisationen, diplomatischen Vertretungen und Verhandlungsforen bietet ideale Bedingungen für Vermittler. Besonders in Genf, aber auch in anderen Schweizer Städten, werden deine Fähigkeiten zur Konfliktlösung und interkulturellen Kommunikation geschätzt.",
  },

  // Kreative Spezialisten
  DESIGNER: {
    title: "Der Gestalter",
    description:
      "Du hast ein ausgeprägtes ästhetisches Empfinden und liebst es, Dinge zu erschaffen. Du drückst dich gerne kreativ aus und hast ein gutes Gespür für Design und Ästhetik.",
    icon: Paintbrush,
    careers: ["Künstler", "Designer", "Architekt", "Modedesigner"],
    color: "bg-fuchsia-500",
    swissContext:
      "Die Schweiz mit ihrer starken Design-Tradition, von der Uhrmacherei bis zur Architektur, bietet vielfältige Möglichkeiten für Gestalter. In Zürich, Basel und Lausanne findest du kreative Agenturen, Designstudios und Kunsthochschulen, die deine gestalterischen Fähigkeiten fördern.",
  },
  COMMUNICATOR: {
    title: "Der Kommunikator",
    description:
      "Du hast eine Gabe für Sprache und Kommunikation. Du kannst komplexe Sachverhalte verständlich erklären und überzeugend argumentieren. Du liebst den Austausch mit anderen Menschen.",
    icon: MessageSquare,
    careers: ["Journalist", "Autor", "Sprecher", "Social Media Manager"],
    color: "bg-orange-500",
    swissContext:
      "In der mehrsprachigen Schweiz sind gute Kommunikatoren besonders gefragt. Im Medienbereich, in der Unternehmenskommunikation und im Marketing internationaler Unternehmen kannst du deine kommunikativen Fähigkeiten optimal einsetzen, besonders wenn du mehrere Sprachen beherrschst.",
  },

  // Technische Spezialisten
  DEVELOPER: {
    title: "Der Entwickler",
    description:
      "Du liebst es, Systeme zu verstehen und zu verbessern. Du denkst logisch und kannst komplexe Probleme in kleinere Teile zerlegen. Technische Herausforderungen motivieren dich.",
    icon: Code,
    careers: ["Softwareentwickler", "Systemarchitekt", "IT-Spezialist", "Ingenieur"],
    color: "bg-slate-500",
    swissContext:
      "Die Schweiz mit ihren Tech-Clustern, Forschungsinstituten und innovativen Unternehmen bietet ein hervorragendes Umfeld für Entwickler. Besonders in Zürich, Lausanne (mit der EPFL) und im 'Crypto Valley' Zug findest du spannende Herausforderungen im Tech-Bereich.",
  },
  RESEARCHER: {
    title: "Der Forscher",
    description:
      "Du bist neugierig und willst den Dingen auf den Grund gehen. Du sammelst gerne Informationen und analysierst sie gründlich. Du arbeitest methodisch und präzise.",
    icon: Search,
    careers: ["Wissenschaftler", "Marktforscher", "Journalist", "Detektiv"],
    color: "bg-emerald-500",
    swissContext:
      "Mit Weltklasse-Forschungseinrichtungen wie ETH, EPFL, CERN und zahlreichen Forschungsabteilungen in der Pharma- und Technologiebranche bietet die Schweiz ein ideales Umfeld für Forscher. Deine analytischen Fähigkeiten und dein methodisches Vorgehen werden hier besonders geschätzt.",
  },
  ENTREPRENEUR: {
    title: "Der Unternehmer",
    description:
      "Du bist risikofreudig und siehst überall Chancen. Du hast einen ausgeprägten Geschäftssinn und kannst andere für deine Ideen begeistern. Selbstständigkeit und Eigenverantwortung sind dir wichtig.",
    icon: TrendingUp,
    careers: ["Gründer", "Selbstständiger", "Investor", "Vertriebsexperte"],
    color: "bg-yellow-500",
    swissContext:
      "Die Schweiz mit ihrer stabilen Wirtschaft, dem starken Innovationsökosystem und günstigen Rahmenbedingungen für Unternehmen bietet ein ausgezeichnetes Umfeld für Entrepreneure. Von Zürich bis Genf findest du Startup-Hubs, Investoren und Netzwerke, die deine unternehmerischen Ambitionen unterstützen.",
  },
}

// Typen für die Persönlichkeitsdimensionen (Big Five / OCEAN)
export type Dimension = "O" | "C" | "E" | "A" | "N"
export type DimensionScores = Record<Dimension, number>

// Berechnet die Dimensionswerte basierend auf den Testergebnissen und den Fragen
export function calculateDimensionScores(results: number[], testQuestions?: TestQuestion[]): DimensionScores {
  const dimensions: Record<Dimension, number[]> = {
    O: [],
    C: [],
    E: [],
    A: [],
    N: [],
  }

  // Lade die Testfragen aus dem localStorage, wenn keine übergeben wurden
  let questionsToUse = testQuestions
  if (!questionsToUse || questionsToUse.length === 0) {
    try {
      const savedQuestions = localStorage.getItem("testQuestions")
      if (savedQuestions) {
        questionsToUse = JSON.parse(savedQuestions)
        console.log("Testfragen aus localStorage geladen:", questionsToUse.length)
      }
    } catch (e) {
      console.error("Fehler beim Laden der Testfragen aus localStorage:", e)
    }
  }

  // Wenn wir Testfragen haben (entweder übergeben oder aus localStorage), verwende diese
  if (questionsToUse && questionsToUse.length > 0) {
    console.log("Berechne Dimensionswerte mit Testfragen")
    results.forEach((answer, index) => {
      const question = questionsToUse![index]
      if (!question) return

      const dimension = question.dimension

      // Umgekehrte Fragen umrechnen (6 - Antwort, da Skala von 1-5)
      const score = question.reversed ? 6 - answer : answer

      dimensions[dimension].push(score)
    })
  } else {
    // Fallback: Verwende die Frage-Dimensionen-Zuordnung
    console.log("Berechne Dimensionswerte ohne Testfragen (Fallback)")
    results.forEach((answer, index) => {
      // Frage-ID ist index + 1
      const questionId = index + 1
      const dimension = questionDimensions[questionId]

      if (dimension) {
        // Wir können nicht wissen, ob die Frage umgekehrt ist, daher nehmen wir an, dass sie es nicht ist
        dimensions[dimension].push(answer)
      }
    })
  }

  // Berechne den Durchschnitt für jede Dimension
  const scores: DimensionScores = {
    O: calculateAverage(dimensions.O),
    C: calculateAverage(dimensions.C),
    E: calculateAverage(dimensions.E),
    A: calculateAverage(dimensions.A),
    N: calculateAverage(dimensions.N),
  }

  return scores
}

// Hilfsfunktion zur Berechnung des Durchschnitts
function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0
  const sum = values.reduce((total, value) => total + value, 0)
  return sum / values.length
}

// Bestimmt den Persönlichkeitstyp basierend auf den Dimensionswerten
export function determinePersonalityType(results: number[], testQuestions?: TestQuestion[]) {
  // Lade die Testfragen aus dem localStorage, wenn keine übergeben wurden
  let questionsToUse = testQuestions
  if (!questionsToUse || questionsToUse.length === 0) {
    try {
      const savedQuestions = localStorage.getItem("testQuestions")
      if (savedQuestions) {
        questionsToUse = JSON.parse(savedQuestions)
        console.log("Testfragen für Persönlichkeitstyp aus localStorage geladen")
      }
    } catch (e) {
      console.error("Fehler beim Laden der Testfragen aus localStorage:", e)
    }
  }

  // Berechne die Dimensionswerte mit den gleichen Testfragen
  const dimensionScores = calculateDimensionScores(results, questionsToUse)

  // Sortiere die Dimensionen nach ihren Werten (absteigend)
  const sortedDimensions = Object.entries(dimensionScores).sort(([, a], [, b]) => b - a) as [Dimension, number][]

  // Primäre und sekundäre Dimension
  const primaryDimension = sortedDimensions[0][0]
  const secondaryDimension = sortedDimensions[1][0]
  const primaryScore = sortedDimensions[0][1]
  const secondaryScore = sortedDimensions[1][1]

  // Bestimme den Persönlichkeitstyp basierend auf den dominanten Dimensionen
  const personalityType = getPersonalityTypeByDimensions(
    primaryDimension,
    secondaryDimension,
    primaryScore,
    secondaryScore,
  )

  // Füge die Dimensionswerte zum Ergebnis hinzu
  return {
    ...personalityType,
    dimensionScores,
    primaryDimension,
    secondaryDimension,
  }
}

// Weist basierend auf den dominanten Dimensionen einen Persönlichkeitstyp zu
function getPersonalityTypeByDimensions(
  primary: Dimension,
  secondary: Dimension,
  primaryScore: number,
  secondaryScore: number,
) {
  // Kombinationen von Dimensionen und entsprechende Persönlichkeitstypen

  // Offenheit (O) als primäre Dimension
  if (primary === "O") {
    if (secondary === "E" && primaryScore > 3.5) return personalityTypes.VISIONARY
    if (secondary === "C" && primaryScore > 3.5) return personalityTypes.INNOVATOR
    if (secondary === "A" && primaryScore > 3.5) return personalityTypes.DESIGNER
    return personalityTypes.RESEARCHER
  }

  // Gewissenhaftigkeit (C) als primäre Dimension
  if (primary === "C") {
    if (secondary === "O" && primaryScore > 3.5) return personalityTypes.DEVELOPER
    if (secondary === "E" && primaryScore > 3.5) return personalityTypes.DECISION_MAKER
    if (secondary === "A" && primaryScore > 3.5) return personalityTypes.ORGANIZER
    return personalityTypes.PRACTITIONER
  }

  // Extraversion (E) als primäre Dimension
  if (primary === "E") {
    if (secondary === "O" && primaryScore > 3.5) return personalityTypes.ENTREPRENEUR
    if (secondary === "A" && primaryScore > 3.5) return personalityTypes.TEAM_PLAYER
    if (secondary === "C" && primaryScore > 3.5) return personalityTypes.COMMUNICATOR
    return personalityTypes.MEDIATOR
  }

  // Verträglichkeit (A) als primäre Dimension
  if (primary === "A") {
    if (secondary === "E" && primaryScore > 3.5) return personalityTypes.SUPPORTER
    if (secondary === "C" && primaryScore > 3.5) return personalityTypes.MEDIATOR
    if (secondary === "O" && primaryScore > 3.5) return personalityTypes.COMMUNICATOR
    return personalityTypes.TEAM_PLAYER
  }

  // Neurotizismus (N) als primäre Dimension
  if (primary === "N") {
    if (secondary === "O" && primaryScore > 3.5) return personalityTypes.RESEARCHER
    if (secondary === "C" && primaryScore > 3.5) return personalityTypes.ANALYST
    if (secondary === "A" && primaryScore > 3.5) return personalityTypes.SUPPORTER
    return personalityTypes.STRATEGIST
  }

  // Fallback, falls keine spezifische Kombination zutrifft
  return personalityTypes.PRACTITIONER
}

// Gibt passende Berufsempfehlungen basierend auf den Dimensionswerten
export function getCareerRecommendations(dimensionScores: DimensionScores) {
  const recommendations: string[] = []

  // Beispiele für Berufsempfehlungen basierend auf hohen Werten in bestimmten Dimensionen
  if (dimensionScores.O > 4 && dimensionScores.E > 3.5) {
    recommendations.push("Marketing", "Unternehmertum", "Kreativberufe")
  }

  if (dimensionScores.C > 4 && dimensionScores.A > 3.5) {
    recommendations.push("Projektmanagement", "Personalwesen", "Bildungswesen")
  }

  if (dimensionScores.O > 4 && dimensionScores.C > 4) {
    recommendations.push("Forschung & Entwicklung", "Produktdesign", "Architektur")
  }

  if (dimensionScores.E > 4 && dimensionScores.A > 4) {
    recommendations.push("Vertrieb", "Kundenbetreuung", "Event-Management")
  }

  if (dimensionScores.C > 4 && dimensionScores.N < 2) {
    recommendations.push("Führungspositionen", "Krisenmanagement", "Finanzwesen")
  }

  // Fallback, falls keine spezifischen Empfehlungen zutreffen
  if (recommendations.length === 0) {
    recommendations.push("Beratung", "Selbstständigkeit", "Projektarbeit")
  }

  return recommendations
}

// Übersetzt die Dimensionsnamen ins Deutsche
export function translateDimension(dimension: Dimension): string {
  const translations: Record<Dimension, string> = {
    O: "Offenheit für Erfahrungen",
    C: "Gewissenhaftigkeit",
    E: "Extraversion",
    A: "Verträglichkeit",
    N: "Neurotizismus",
  }

  return translations[dimension]
}

// Gibt eine Beschreibung für jede Dimension
export function getDimensionDescription(dimension: Dimension): string {
  const descriptions: Record<Dimension, string> = {
    O: "Offenheit für neue Erfahrungen, Kreativität, Neugier und Interesse an neuen Ideen",
    C: "Zuverlässigkeit, Organisiertheit, Disziplin und Zielorientierung",
    E: "Geselligkeit, Aktivität, Gesprächigkeit und Durchsetzungsfähigkeit",
    A: "Kooperationsbereitschaft, Empathie, Vertrauen und Hilfsbereitschaft",
    N: "Emotionale Stabilität, Umgang mit Stress und negativen Emotionen",
  }

  return descriptions[dimension]
}
