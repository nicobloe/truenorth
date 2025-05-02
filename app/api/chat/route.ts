import { NextResponse } from "next/server"

// Timeout für die OpenAI-Anfrage (erhöht auf 60 Sekunden für mobile Verbindungen)
const TIMEOUT_MS = 60000

// Gültige OpenAI-Modelle
const VALID_MODELS = ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo", "gpt-4o"]

// CORS-Header für alle Antworten
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// OPTIONS-Handler für CORS-Preflight-Anfragen
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders, status: 200 })
}

export async function POST(req: Request) {
  try {
    console.log("Chat API aufgerufen")

    // API-Schlüssel prüfen - NUR SERVERSEITIG
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim()
    if (!OPENAI_API_KEY) {
      console.error("OpenAI API key fehlt")
      return NextResponse.json(
        {
          error: "OpenAI API key not configured",
          useLocalFallback: true,
        },
        { status: 500, headers: corsHeaders },
      )
    }

    // Request-Body parsen
    let body
    try {
      body = await req.json()
    } catch (error) {
      console.error("Fehler beim Parsen des Request-Body:", error)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400, headers: corsHeaders })
    }

    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      console.error("Ungültiges Anfrage-Format:", body)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400, headers: corsHeaders })
    }

    // Modell bestimmen und validieren
    let model = process.env.OPENAI_MODEL || "gpt-3.5-turbo"

    // Modellnamen normalisieren (Kleinbuchstaben und Bindestrich-Format)
    model = model.toLowerCase().trim()

    // Prüfen, ob das Modell gültig ist, sonst Fallback auf gpt-3.5-turbo
    if (!VALID_MODELS.includes(model)) {
      console.warn(`Ungültiges Modell: ${model}, verwende stattdessen gpt-3.5-turbo`)
      model = "gpt-3.5-turbo"
    }

    console.log("Direkte Anfrage an OpenAI API senden:", {
      model,
      messagesCount: messages.length,
    })

    // AbortController für Timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

    try {
      // Direkte Anfrage an die OpenAI API - NUR SERVERSEITIG
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`, // API-Key wird NUR hier verwendet
          "User-Agent": "True-North-App/1.0",
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          max_tokens: 300,
        }),
        signal: controller.signal,
        cache: "no-store",
      })

      // Timeout löschen, da die Anfrage abgeschlossen ist
      clearTimeout(timeoutId)

      // Prüfen, ob die Antwort erfolgreich war
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text()
        console.error("OpenAI API Error:", openaiResponse.status, errorText)

        // Versuche, den Fehlertext als JSON zu parsen
        let errorJson
        try {
          errorJson = JSON.parse(errorText)
        } catch (e) {
          errorJson = { error: { message: errorText, type: "unknown" } }
        }

        // Fehlerbehandlung...
        return NextResponse.json(
          {
            error: "OpenAI API error",
            status: openaiResponse.status,
            details: errorText,
            useLocalFallback: true,
          },
          { status: openaiResponse.status, headers: corsHeaders },
        )
      }

      // Erfolgreiche Antwort verarbeiten
      const data = await openaiResponse.json()
      const content = data.choices[0]?.message?.content || "Entschuldigung, ich konnte keine Antwort generieren."

      console.log("Antwort von OpenAI erhalten:", {
        contentLength: content.length,
        model,
      })

      // Erfolgreiche Antwort zurückgeben
      return NextResponse.json({ content }, { headers: corsHeaders })
    } catch (fetchError: any) {
      // Fehlerbehandlung...
      clearTimeout(timeoutId)
      console.error("Fetch-Fehler bei OpenAI API-Anfrage:", fetchError)
      return NextResponse.json(
        {
          error: "OpenAI API request failed",
          details: fetchError.message || "Unknown fetch error",
          useLocalFallback: true,
        },
        { status: 500, headers: corsHeaders },
      )
    }
  } catch (error: any) {
    // Allgemeine Fehlerbehandlung...
    console.error("Allgemeiner Fehler in der Chat API-Route:", error)
    return NextResponse.json(
      {
        error: "Server error",
        details: error.message || "Unknown error",
        useLocalFallback: true,
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
