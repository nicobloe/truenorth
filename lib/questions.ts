export interface TestQuestion {
  id: number
  text: string
  dimension: "O" | "C" | "E" | "A" | "N"
  reversed: boolean
  category: "beruflich" | "sozial" | "persönlich"
  options: string[]
}

// Erweiterte Fragenliste mit 30 Fragen (6 pro Dimension)
// Jede Frage ist einer Dimension zugeordnet und gibt an, ob die Bewertung umgekehrt werden muss
export const questions: TestQuestion[] = [
  // Offenheit für Erfahrungen (O)
  {
    id: 1,
    text: "Ich bin neugierig auf neue Ideen und Konzepte.",
    dimension: "O",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 2,
    text: "Ich bevorzuge Routine und vertraute Abläufe gegenüber Veränderungen.",
    dimension: "O",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 3,
    text: "Ich interessiere mich für Kunst, Musik oder Literatur.",
    dimension: "O",
    reversed: false,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 4,
    text: "Ich bin offen für neue berufliche Herausforderungen und ungewohnte Aufgaben.",
    dimension: "O",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 5,
    text: "Ich bevorzuge praktische Lösungen gegenüber theoretischen Konzepten.",
    dimension: "O",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 6,
    text: "Ich probiere gerne neue Aktivitäten und Erfahrungen aus.",
    dimension: "O",
    reversed: false,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },

  // Gewissenhaftigkeit (C)
  {
    id: 7,
    text: "Ich plane sorgfältig und halte mich an meine Pläne.",
    dimension: "C",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 8,
    text: "Ich erledige Aufgaben manchmal nicht so gründlich, wie ich sollte.",
    dimension: "C",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 9,
    text: "Ich achte auf Details und arbeite präzise.",
    dimension: "C",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 10,
    text: "Ich setze mir klare Ziele und arbeite systematisch darauf hin.",
    dimension: "C",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 11,
    text: "Ich lasse mich leicht ablenken und habe Schwierigkeiten, fokussiert zu bleiben.",
    dimension: "C",
    reversed: true,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 12,
    text: "Ich halte meinen Arbeitsplatz und meine Unterlagen ordentlich und organisiert.",
    dimension: "C",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },

  // Extraversion (E)
  {
    id: 13,
    text: "Ich fühle mich wohl in Gruppen und lerne gerne neue Menschen kennen.",
    dimension: "E",
    reversed: false,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 14,
    text: "Ich ziehe es vor, alleine zu arbeiten statt im Team.",
    dimension: "E",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 15,
    text: "Ich übernehme gerne die Führung in Gruppensituationen.",
    dimension: "E",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 16,
    text: "Nach sozialen Veranstaltungen fühle ich mich oft erschöpft und brauche Zeit für mich.",
    dimension: "E",
    reversed: true,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 17,
    text: "Ich kommuniziere gerne und halte Präsentationen vor anderen.",
    dimension: "E",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 18,
    text: "Ich bin eher zurückhaltend und spreche nicht viel in größeren Gruppen.",
    dimension: "E",
    reversed: true,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },

  // Verträglichkeit (A)
  {
    id: 19,
    text: "Ich arbeite gerne mit anderen zusammen und unterstütze meine Kollegen.",
    dimension: "A",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 20,
    text: "Ich sage direkt, was ich denke, auch wenn es andere vor den Kopf stößt.",
    dimension: "A",
    reversed: true,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 21,
    text: "Ich versuche, Konflikte durch Kompromisse zu lösen.",
    dimension: "A",
    reversed: false,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 22,
    text: "Ich setze meine eigenen Interessen durch, auch wenn andere dadurch benachteiligt werden könnten.",
    dimension: "A",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 23,
    text: "Ich kann mich gut in andere hineinversetzen und ihre Perspektive verstehen.",
    dimension: "A",
    reversed: false,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 24,
    text: "Ich bin skeptisch gegenüber den Absichten anderer Menschen.",
    dimension: "A",
    reversed: true,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },

  // Neurotizismus (N)
  {
    id: 25,
    text: "Ich bleibe auch in stressigen Situationen ruhig und gelassen.",
    dimension: "N",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 26,
    text: "Ich mache mir oft Sorgen über die Zukunft.",
    dimension: "N",
    reversed: false,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 27,
    text: "Ich kann gut mit Kritik umgehen, ohne mich persönlich angegriffen zu fühlen.",
    dimension: "N",
    reversed: true,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 28,
    text: "Ich fühle mich manchmal überfordert von meinen Aufgaben und Verpflichtungen.",
    dimension: "N",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 29,
    text: "Ich kann meine Emotionen gut kontrollieren, auch in schwierigen Situationen.",
    dimension: "N",
    reversed: true,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 30,
    text: "Ich reagiere empfindlich auf Stress und Druck.",
    dimension: "N",
    reversed: false,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
]

// Schweizer Kontext-Fragen (optional, können in den Test integriert werden)
export const swissContextQuestions: TestQuestion[] = [
  {
    id: 101,
    text: "Ich kann mir vorstellen, in einem mehrsprachigen Arbeitsumfeld zu arbeiten.",
    dimension: "O",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 102,
    text: "Präzision und Qualität sind mir bei meiner Arbeit besonders wichtig.",
    dimension: "C",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 103,
    text: "Ich kann gut mit Menschen aus verschiedenen kulturellen Hintergründen zusammenarbeiten.",
    dimension: "A",
    reversed: false,
    category: "sozial",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 104,
    text: "Ich lege Wert auf eine gute Work-Life-Balance.",
    dimension: "N",
    reversed: true,
    category: "persönlich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
  {
    id: 105,
    text: "Ich bin bereit, für meine Karriere in eine andere Region zu ziehen.",
    dimension: "O",
    reversed: false,
    category: "beruflich",
    options: ["Stimme überhaupt nicht zu", "Stimme nicht zu", "Neutral", "Stimme zu", "Stimme voll zu"],
  },
]

// Beschreibungen der Dimensionen für Tooltips und Erklärungen
export const dimensionDescriptions = {
  O: {
    title: "Offenheit für Erfahrungen",
    short: "Kreativität, Neugier und Offenheit für neue Ideen",
    long: "Diese Dimension beschreibt deine Bereitschaft, neue Erfahrungen zu machen, kreativ zu denken und offen für unkonventionelle Ideen zu sein. Menschen mit hohen Werten sind oft neugierig, experimentierfreudig und haben vielfältige Interessen. Menschen mit niedrigen Werten bevorzugen Routine, Bewährtes und praktische Lösungen.",
    career:
      "Hohe Werte begünstigen kreative Berufe, Forschung und Innovation. Niedrige Werte passen gut zu strukturierten, praktischen Tätigkeiten.",
  },
  C: {
    title: "Gewissenhaftigkeit",
    short: "Organisation, Zuverlässigkeit und Zielorientierung",
    long: "Diese Dimension beschreibt, wie organisiert, zuverlässig und zielorientiert du bist. Menschen mit hohen Werten sind oft gut organisiert, planen voraus und arbeiten systematisch. Menschen mit niedrigen Werten sind flexibler, spontaner und weniger strukturiert in ihrer Arbeitsweise.",
    career:
      "Hohe Werte sind vorteilhaft für Management, Finanzen und Positionen mit hoher Verantwortung. Niedrige Werte können in kreativen oder flexiblen Arbeitsumgebungen von Vorteil sein.",
  },
  E: {
    title: "Extraversion",
    short: "Geselligkeit, Durchsetzungsfähigkeit und Energie",
    long: "Diese Dimension beschreibt, wie du mit anderen Menschen interagierst und Energie gewinnst. Menschen mit hohen Werten sind oft gesellig, gesprächig und fühlen sich in Gruppen wohl. Menschen mit niedrigen Werten (Introvertierte) bevorzugen ruhigere Umgebungen, tiefere Gespräche und Zeit für sich selbst.",
    career:
      "Hohe Werte begünstigen Berufe mit viel sozialer Interaktion wie Vertrieb oder Management. Niedrige Werte können in konzentrierten, selbstständigen Tätigkeiten von Vorteil sein.",
  },
  A: {
    title: "Verträglichkeit",
    short: "Kooperationsbereitschaft, Empathie und Harmonie",
    long: "Diese Dimension beschreibt, wie du mit anderen zusammenarbeitest und auf ihre Bedürfnisse eingehst. Menschen mit hohen Werten sind oft kooperativ, einfühlsam und kompromissbereit. Menschen mit niedrigen Werten sind direkter, durchsetzungsfähiger und stellen eigene Interessen stärker in den Vordergrund.",
    career:
      "Hohe Werte sind vorteilhaft für Teamarbeit, Kundenservice und soziale Berufe. Niedrige Werte können in Verhandlungspositionen oder Führungsrollen von Vorteil sein.",
  },
  N: {
    title: "Neurotizismus",
    short: "Emotionale Reaktivität und Umgang mit Stress",
    long: "Diese Dimension beschreibt deine emotionale Stabilität und deinen Umgang mit Stress. Menschen mit hohen Werten reagieren sensibler auf Stress und erleben häufiger negative Emotionen. Menschen mit niedrigen Werten sind emotional stabiler und bleiben auch unter Druck gelassen.",
    career:
      "Niedrige Werte sind vorteilhaft für stressige Berufe und Führungspositionen. Hohe Werte können in kreativen Berufen oder Tätigkeiten, die Empathie erfordern, von Vorteil sein.",
  },
}

// Kategorien für die Filterung von Fragen
export const questionCategories = {
  beruflich: "Berufliches Umfeld",
  sozial: "Soziale Interaktion",
  persönlich: "Persönliche Eigenschaften",
}

// Funktion zum Filtern von Fragen nach Kategorie
export function getQuestionsByCategory(category: keyof typeof questionCategories): TestQuestion[] {
  return questions.filter((q) => q.category === category)
}

// Funktion zum Erstellen eines ausgewogenen Fragensets
export function createBalancedQuestionSet(totalQuestions = 15): TestQuestion[] {
  // Stelle sicher, dass wir mindestens eine Frage pro Dimension haben
  const minQuestionsPerDimension = 3
  const dimensions: ("O" | "C" | "E" | "A" | "N")[] = ["O", "C", "E", "A", "N"]

  let selectedQuestions: TestQuestion[] = []

  // Wähle zuerst die Mindestanzahl an Fragen pro Dimension
  dimensions.forEach((dim) => {
    const dimensionQuestions = questions.filter((q) => q.dimension === dim)
    const randomQuestions = shuffleArray(dimensionQuestions).slice(0, minQuestionsPerDimension)
    selectedQuestions = [...selectedQuestions, ...randomQuestions]
  })

  // Wenn wir mehr Fragen benötigen, füge zufällige Fragen hinzu
  if (selectedQuestions.length < totalQuestions) {
    const remainingQuestions = questions.filter((q) => !selectedQuestions.includes(q))
    const additionalQuestions = shuffleArray(remainingQuestions).slice(0, totalQuestions - selectedQuestions.length)
    selectedQuestions = [...selectedQuestions, ...additionalQuestions]
  }

  // Sortiere die Fragen nach ID für eine konsistente Reihenfolge
  return selectedQuestions.sort((a, b) => a.id - b.id)
}

// Hilfsfunktion zum Mischen eines Arrays
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}
