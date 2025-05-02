"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Hier würde normalerweise ein API-Aufruf zum Zurücksetzen des Passworts erfolgen
      // Für die Demo simulieren wir einen erfolgreichen Aufruf
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsSubmitted(true)
    } catch (err) {
      setError("Anfrage fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo und Header */}
        <div className="flex flex-col items-center mb-12 mt-8">
          <Link href="/">
            <Image src="/true-north-logo.png" alt="True North Logo" width={180} height={60} priority />
          </Link>
        </div>

        {/* Hauptinhalt */}
        <div className="w-full mb-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Passwort zurücksetzen</h1>

          {!isSubmitted ? (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurücksetzen deines Passworts.
              </p>

              {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="deine@email.de"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-stone-500 text-white rounded text-center font-medium mt-2"
                >
                  {isLoading ? "Wird gesendet..." : "Link senden"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 text-green-600 p-4 rounded mb-6">
                Wir haben dir einen Link zum Zurücksetzen deines Passworts an {email} gesendet.
              </div>
              <p className="text-gray-600 mb-6">
                Bitte überprüfe deine E-Mails und folge den Anweisungen, um dein Passwort zurückzusetzen.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-stone-600 hover:underline">
              Zurück zur Anmeldung
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-sm text-gray-500 mt-12 mb-4">
        © {new Date().getFullYear()} True North. Alle Rechte vorbehalten.
      </div>
    </div>
  )
}
