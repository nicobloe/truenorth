"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.")
      setIsLoading(false)
      return
    }

    try {
      // Hier würde normalerweise ein API-Aufruf zur Registrierung erfolgen
      // Für die Demo simulieren wir eine erfolgreiche Registrierung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dummy-Benutzerdaten erstellen
      const dummyUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        name: name,
        email: email,
        isAuthenticated: true,
      }

      // Benutzerdaten im localStorage speichern
      localStorage.setItem("user", JSON.stringify(dummyUser))

      // Zum Test weiterleiten
      router.push("/test")
    } catch (err) {
      setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = async (provider: string) => {
    setIsLoading(true)
    setError("")

    try {
      // Hier würde normalerweise ein OAuth-Aufruf erfolgen
      // Für die Demo simulieren wir eine erfolgreiche Registrierung
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dummy-Benutzerdaten erstellen
      const dummyUser = {
        id: `${provider}-user-${Math.random().toString(36).substring(2, 9)}`,
        name: `${provider} Benutzer`,
        email: `${provider.toLowerCase()}@beispiel.de`,
        isAuthenticated: true,
        provider: provider,
      }

      // Benutzerdaten im localStorage speichern
      localStorage.setItem("user", JSON.stringify(dummyUser))

      // Zum Test weiterleiten
      router.push("/test")
    } catch (err) {
      setError(`${provider}-Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative p-6">
          {/* Zurück-Button */}
          <Link href="/" className="absolute top-6 left-6 flex items-center text-gray-500">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Zurück</span>
          </Link>

          {/* Logo und Header */}
          <div className="flex flex-col items-center mt-12 mb-8">
            <div className="mb-6">
              <Image src="/true-north-logo.png" alt="True North" width={60} height={60} />
            </div>
            <h1 className="text-2xl font-semibold text-center">Konto erstellen</h1>
            <p className="text-gray-500 text-center text-sm mt-1">
              Erstelle ein Konto, um deine berufliche Reise zu beginnen
            </p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleSocialRegister("Google")}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              <div className="w-5 h-5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <span>Mit Google fortfahren</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialRegister("Apple")}
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 border border-gray-300 rounded-md bg-black text-white hover:bg-gray-800 disabled:opacity-50"
            >
              <div className="w-5 h-5 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.68 1.32-1.53 2.6-2.53 4.08zm-3.08-17.4c-2.29.21-4.03 2.75-3.8 4.72 2.1.17 4.01-2.57 3.8-4.72z" />
                </svg>
              </div>
              <span>Mit Apple fortfahren</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">oder</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dein Name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-stone-500"
                  required
                />
              </div>

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

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-stone-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Passwort bestätigen
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-1 focus:ring-stone-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-stone-500 text-white rounded-md hover:bg-stone-600 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? "Wird registriert..." : "Registrieren"}
              </button>

              <div className="text-center mt-4">
                <span className="text-sm text-gray-500">
                  Bereits ein Konto?{" "}
                  <Link href="/login" className="text-stone-600 hover:text-stone-700 font-medium">
                    Anmelden
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
