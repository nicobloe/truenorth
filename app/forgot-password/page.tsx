"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft } from "lucide-react"

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative p-6">
          {/* Zurück-Button */}
          <Link href="/login" className="absolute top-6 left-6 flex items-center text-gray-500">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Zurück</span>
          </Link>

          {/* Logo und Header */}
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="mb-6">
              <Image src="/true-north-logo.png" alt="True North" width={60} height={60} />
            </div>
            <h1 className="text-2xl font-semibold text-center">Passwort zurücksetzen</h1>
            <p className="text-gray-500 text-center text-sm mt-1">
              Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurücksetzen deines Passworts.
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-Mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? "Wird gesendet..." : "Link senden"}
                </button>

                <div className="text-center mt-4">
                  <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
                    Zurück zur Anmeldung
                  </Link>
                </div>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <div className="bg-green-50 text-green-600 p-4 rounded mb-6">
                Wir haben dir einen Link zum Zurücksetzen deines Passworts an {email} gesendet.
              </div>
              <p className="text-gray-600 mb-6">
                Bitte überprüfe deine E-Mails und folge den Anweisungen, um dein Passwort zurückzusetzen.
              </p>
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm text-stone-600 hover:text-stone-700 font-medium">
                  Zurück zur Anmeldung
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
