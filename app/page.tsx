import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-white border-2 border-dashed border-gray-200">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* Logo und Header */}
        <div className="flex flex-col items-center mb-16 mt-8">
          <div className="flex items-center gap-2">
            <Image src="/true-north-logo.png" alt="True North Logo" width={180} height={60} priority unoptimized />
          </div>
        </div>

        {/* Hauptinhalt */}
        <div className="w-full text-center mb-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">FIND YOUR PASSION</h1>
          <p className="text-gray-600 mb-12 px-4">
            Finde deinen beruflichen Sweet Spot – mit deinem persönlichen Karriere-Kompass, powered by KI und
            Psychologie.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4 w-full px-4">
            <Link href="/login" className="w-full py-3 bg-stone-500 text-white rounded text-center font-medium">
              Anmelden
            </Link>
            <Link
              href="/test"
              className="w-full py-3 bg-white border border-gray-300 text-gray-600 rounded text-center font-medium"
            >
              Karrieretest ausfüllen
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
