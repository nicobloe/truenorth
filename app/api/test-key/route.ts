import { NextResponse } from "next/server"

// CORS-Header für alle Antworten
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// OPTIONS-Handler für CORS-Preflight-Anfragen
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders, status: 200 })
}

// Hilfsfunktion zum Testen des API-Schlüssels
async function testApiKey(apiKey: string): Promise<{ valid: boolean; error?: any }> {
  try {
    // Einfache Anfrage an die OpenAI API, um den Schlüssel zu testen
    const response = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (response.ok) {
      return { valid: true }
    }

    const errorData = await response.json()
    return {
      valid: false,
      error: errorData.error || { message: "Unbekannter Fehler", status: response.status },
    }
  } catch (error) {
    return { valid: false, error }
  }
}

export async function GET() {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY?.trim()

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "API-Schlüssel nicht konfiguriert",
          envVars: Object.keys(process.env)
            .filter((key) => !key.includes("SECRET"))
            .join(", "),
        },
        { status: 500, headers: corsHeaders },
      )
    }

    // API-Schlüssel testen
    const testResult = await testApiKey(OPENAI_API_KEY)

    // Bestimme den Präfix basierend auf dem Schlüsselformat
    const keyPrefix = OPENAI_API_KEY.startsWith("sk-proj-")
      ? OPENAI_API_KEY.substring(0, 8)
      : OPENAI_API_KEY.substring(0, 5)

    if (testResult.valid) {
      return NextResponse.json(
        {
          status: "success",
          message: "API-Schlüssel ist gültig",
          keyFormat: {
            prefix: keyPrefix,
            suffix: OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4),
            length: OPENAI_API_KEY.length,
          },
        },
        { headers: corsHeaders },
      )
    } else {
      return NextResponse.json(
        {
          status: "error",
          message: "API-Schlüssel ist ungültig",
          error: testResult.error,
          keyFormat: {
            prefix: keyPrefix,
            suffix: OPENAI_API_KEY.substring(OPENAI_API_KEY.length - 4),
            length: OPENAI_API_KEY.length,
          },
        },
        { status: 401, headers: corsHeaders },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: "Fehler beim Testen des API-Schlüssels",
        error: error.message,
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
