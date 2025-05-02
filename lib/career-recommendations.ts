import type { DimensionScores } from "./personality-types"

// Typen für LinkedIn-Daten
export interface LinkedInProfile {
  id: string
  name: string
  headline: string
  profileUrl: string
  connections: number
  currentPosition: Position
  pastPositions: Position[]
  skills: string[]
  education: Education[]
}

interface Position {
  title: string
  company: string
  startDate: string
  endDate?: string
}

interface Education {
  school: string
  degree: string
  field: string
  endDate: string
}

// Karrierekategorien
export const careerCategories = {
  TECH: "Technologie",
  CREATIVE: "Kreativ",
  BUSINESS: "Business",
  SCIENCE: "Wissenschaft",
  SOCIAL: "Sozial",
  EDUCATION: "Bildung",
  HEALTH: "Gesundheit",
}

// Skill-Kategorien für die Analyse
const skillCategories: Record<string, string[]> = {
  TECH: [
    "programmierung",
    "entwicklung",
    "software",
    "it",
    "daten",
    "cloud",
    "devops",
    "frontend",
    "backend",
    "fullstack",
    "mobile",
    "web",
    "app",
    "security",
    "netzwerk",
    "system",
    "database",
    "sql",
    "nosql",
    "api",
    "javascript",
    "python",
    "java",
    "c#",
    "php",
    "ruby",
    "typescript",
    "react",
    "angular",
    "vue",
    "node",
    "aws",
    "azure",
    "google cloud",
    "docker",
    "kubernetes",
    "ci/cd",
    "git",
    "agile",
    "scrum",
    "kanban",
    "jira",
    "confluence",
    "bitbucket",
    "github",
    "gitlab",
  ],
  CREATIVE: [
    "design",
    "kreativ",
    "ux",
    "ui",
    "user experience",
    "user interface",
    "grafik",
    "illustration",
    "animation",
    "video",
    "audio",
    "musik",
    "fotografie",
    "film",
    "content",
    "storytelling",
    "copywriting",
    "branding",
    "marketing",
    "social media",
    "adobe",
    "photoshop",
    "illustrator",
    "indesign",
    "after effects",
    "premiere",
    "figma",
    "sketch",
    "invision",
    "zeplin",
    "webflow",
    "wordpress",
    "shopify",
    "wix",
    "squarespace",
  ],
  BUSINESS: [
    "management",
    "führung",
    "strategie",
    "business",
    "finanzen",
    "controlling",
    "accounting",
    "vertrieb",
    "sales",
    "marketing",
    "pr",
    "kommunikation",
    "hr",
    "personal",
    "recruiting",
    "operations",
    "logistik",
    "supply chain",
    "einkauf",
    "beschaffung",
    "projekt",
    "produkt",
    "service",
    "customer",
    "client",
    "b2b",
    "b2c",
    "e-commerce",
    "retail",
    "handel",
    "consulting",
    "beratung",
    "entrepreneurship",
    "startup",
    "innovation",
    "digital",
    "transformation",
    "change",
    "agile",
    "lean",
    "six sigma",
    "process",
    "excel",
    "powerpoint",
    "word",
    "office",
    "sap",
    "crm",
    "erp",
  ],
  SCIENCE: [
    "forschung",
    "wissenschaft",
    "labor",
    "analyse",
    "statistik",
    "mathematik",
    "physik",
    "chemie",
    "biologie",
    "medizin",
    "pharma",
    "biotech",
    "life science",
    "r&d",
    "entwicklung",
    "innovation",
    "patent",
    "publikation",
    "studie",
    "experiment",
    "methodik",
    "datenanalyse",
    "big data",
    "machine learning",
    "ai",
    "künstliche intelligenz",
    "deep learning",
    "neuronale netze",
    "algorithmen",
    "modellierung",
    "simulation",
    "matlab",
    "r",
    "python",
    "spss",
    "stata",
    "sas",
    "tableau",
    "power bi",
    "qlik",
    "looker",
  ],
  SOCIAL: [
    "sozial",
    "gesellschaft",
    "gemeinschaft",
    "beratung",
    "coaching",
    "therapie",
    "psychologie",
    "pädagogik",
    "erziehung",
    "bildung",
    "integration",
    "inklusion",
    "diversity",
    "gleichstellung",
    "nachhaltigkeit",
    "umwelt",
    "klima",
    "ressourcen",
    "energie",
    "gesundheit",
    "pflege",
    "betreuung",
    "unterstützung",
    "hilfe",
    "sozialarbeit",
    "sozialpädagogik",
    "community",
    "ngo",
    "non-profit",
    "ehrenamt",
    "freiwillig",
    "engagement",
    "politik",
    "verwaltung",
    "öffentlicher dienst",
    "behörde",
    "recht",
    "gesetz",
    "regulierung",
    "compliance",
  ],
  EDUCATION: [
    "bildung",
    "lehre",
    "unterricht",
    "schule",
    "hochschule",
    "universität",
    "akademie",
    "training",
    "weiterbildung",
    "fortbildung",
    "qualifizierung",
    "coaching",
    "mentoring",
    "tutoring",
    "curriculum",
    "lehrplan",
    "didaktik",
    "methodik",
    "pädagogik",
    "erziehung",
    "entwicklung",
    "lernmaterial",
    "e-learning",
    "blended learning",
    "präsenzunterricht",
    "fernunterricht",
    "online-kurs",
    "workshop",
    "seminar",
    "vorlesung",
    "prüfung",
    "zertifizierung",
    "abschluss",
    "lms",
    "moodle",
    "canvas",
    "blackboard",
    "google classroom",
    "microsoft teams",
    "zoom",
  ],
  HEALTH: [
    "gesundheit",
    "medizin",
    "pflege",
    "therapie",
    "rehabilitation",
    "prävention",
    "diagnose",
    "behandlung",
    "patient",
    "arzt",
    "ärztin",
    "krankenschwester",
    "pfleger",
    "physiotherapie",
    "ergotherapie",
    "logopädie",
    "psychotherapie",
    "ernährung",
    "fitness",
    "sport",
    "wellness",
    "entspannung",
    "meditation",
    "yoga",
    "pilates",
    "massage",
    "alternativmedizin",
    "naturheilkunde",
    "homöopathie",
    "akupunktur",
    "tcm",
    "ayurveda",
    "pharmazie",
    "apotheke",
    "medikament",
    "impfung",
    "hygiene",
    "sterilisation",
    "desinfektion",
    "krankenhaus",
    "klinik",
    "praxis",
    "ambulanz",
    "notfall",
    "rettung",
  ],
}

// Analysiert LinkedIn-Daten und gibt Karrierekategorien mit Gewichtung zurück
function analyzeLinkedInProfile(profile: LinkedInProfile): Record<string, number> {
  const categoryScores: Record<string, number> = {
    TECH: 0,
    CREATIVE: 0,
    BUSINESS: 0,
    SCIENCE: 0,
    SOCIAL: 0,
    EDUCATION: 0,
    HEALTH: 0,
  }

  // Analyse der Skills
  profile.skills.forEach((skill) => {
    const skillLower = skill.toLowerCase()

    Object.entries(skillCategories).forEach(([category, keywords]) => {
      if (keywords.some((keyword) => skillLower.includes(keyword))) {
        categoryScores[category] += 1
      }
    })
  })

  // Analyse der aktuellen Position
  const currentPositionTitle = profile.currentPosition.title.toLowerCase()
  Object.entries(skillCategories).forEach(([category, keywords]) => {
    if (keywords.some((keyword) => currentPositionTitle.includes(keyword))) {
      categoryScores[category] += 2 // Höhere Gewichtung für aktuelle Position
    }
  })

  // Analyse der vergangenen Positionen
  profile.pastPositions.forEach((position) => {
    const positionTitle = position.title.toLowerCase()
    Object.entries(skillCategories).forEach(([category, keywords]) => {
      if (keywords.some((keyword) => positionTitle.includes(keyword))) {
        categoryScores[category] += 1
      }
    })
  })

  // Normalisierung der Scores
  const totalScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0)
  if (totalScore > 0) {
    Object.keys(categoryScores).forEach((category) => {
      categoryScores[category] = categoryScores[category] / totalScore
    })
  }

  return categoryScores
}

// Generiert Karriereempfehlungen basierend auf Persönlichkeitsdimensionen und LinkedIn-Profil
export function generateEnhancedCareerRecommendations(
  dimensionScores: DimensionScores,
  linkedInProfile?: LinkedInProfile,
): { careers: string[]; explanation: string } {
  // Basis-Empfehlungen basierend auf Persönlichkeitsdimensionen
  const baseRecommendations: Record<string, number> = {
    TECH: dimensionScores.O * 0.3 + dimensionScores.C * 0.4 + (5 - dimensionScores.E) * 0.2,
    CREATIVE: dimensionScores.O * 0.5 + dimensionScores.E * 0.3,
    BUSINESS: dimensionScores.E * 0.4 + dimensionScores.C * 0.3 + (5 - dimensionScores.N) * 0.2,
    SCIENCE: dimensionScores.O * 0.3 + dimensionScores.C * 0.5 + (5 - dimensionScores.E) * 0.1,
    SOCIAL: dimensionScores.E * 0.4 + dimensionScores.A * 0.5,
    EDUCATION: dimensionScores.A * 0.4 + dimensionScores.O * 0.3 + dimensionScores.C * 0.2,
    HEALTH: dimensionScores.A * 0.5 + dimensionScores.C * 0.3 + (5 - dimensionScores.N) * 0.1,
  }

  // Normalisierung der Basis-Empfehlungen
  const totalBaseScore = Object.values(baseRecommendations).reduce((sum, score) => sum + score, 0)
  Object.keys(baseRecommendations).forEach((category) => {
    baseRecommendations[category] = baseRecommendations[category] / totalBaseScore
  })

  const finalRecommendations = { ...baseRecommendations }
  let explanation = "Basierend auf deinem Persönlichkeitsprofil"

  // Integration der LinkedIn-Daten, falls vorhanden
  if (linkedInProfile) {
    const linkedInCategoryScores = analyzeLinkedInProfile(linkedInProfile)

    // Gewichtete Kombination von Persönlichkeitsprofil und LinkedIn-Daten
    Object.keys(finalRecommendations).forEach((category) => {
      finalRecommendations[category] =
        baseRecommendations[category] * 0.6 + (linkedInCategoryScores[category] || 0) * 0.4
    })

    explanation = "Basierend auf deinem Persönlichkeitsprofil und deiner LinkedIn-Berufserfahrung"
  }

  // Sortieren der Kategorien nach Score und Auswahl der Top-Kategorien
  const topCategories = Object.entries(finalRecommendations)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category)

  // Spezifische Karriereempfehlungen basierend auf den Top-Kategorien
  const specificCareers: Record<string, string[]> = {
    TECH: [
      "Software-Entwickler/in",
      "Data Scientist",
      "IT-Projektmanager/in",
      "UX/UI-Designer/in",
      "Systemarchitekt/in",
      "DevOps-Ingenieur/in",
      "Cybersecurity-Spezialist/in",
    ],
    CREATIVE: [
      "Art Director",
      "Content Creator",
      "Marketing-Manager/in",
      "Produktdesigner/in",
      "Brand-Stratege/in",
      "Social-Media-Manager/in",
      "Kreativdirektor/in",
    ],
    BUSINESS: [
      "Unternehmensberater/in",
      "Produktmanager/in",
      "Business Development Manager/in",
      "Finanzanalyst/in",
      "Vertriebsleiter/in",
      "Strategieberater/in",
      "Projektmanager/in",
    ],
    SCIENCE: [
      "Forschungswissenschaftler/in",
      "R&D-Spezialist/in",
      "Laborleiter/in",
      "Biostatistiker/in",
      "Umweltwissenschaftler/in",
      "Pharmakologe/in",
      "Materialwissenschaftler/in",
    ],
    SOCIAL: [
      "Sozialarbeiter/in",
      "Personalentwickler/in",
      "Diversity Manager/in",
      "Nachhaltigkeitsberater/in",
      "Community Manager/in",
      "NGO-Projektleiter/in",
      "Mediator/in",
    ],
    EDUCATION: [
      "Trainer/in",
      "Bildungsberater/in",
      "E-Learning-Entwickler/in",
      "Hochschuldozent/in",
      "Schulleiter/in",
      "Bildungsreferent/in",
      "Lerncoach",
    ],
    HEALTH: [
      "Gesundheitsberater/in",
      "Therapiemanager/in",
      "Präventionsexperte/in",
      "Gesundheitscoach",
      "Pflegedienstleiter/in",
      "Rehabilitationsexperte/in",
      "Ernährungsberater/in",
    ],
  }

  // Sammeln der spezifischen Karriereempfehlungen
  const careers: string[] = []
  topCategories.forEach((category) => {
    careers.push(...specificCareers[category].slice(0, 3))
  })

  return { careers, explanation }
}
