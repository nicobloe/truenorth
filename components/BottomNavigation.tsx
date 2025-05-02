"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
// Füge den Import für das Users-Icon hinzu
import { Home, MessageSquare, User, Users } from "lucide-react"

// Füge den Berater-Tab zur Navigation hinzu
export function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 flex justify-around z-10">
      <Link
        href="/dashboard"
        className={`flex flex-col items-center ${pathname === "/dashboard" ? "text-blue-600" : "text-gray-500"}`}
      >
        <Home size={24} />
        <span className="text-xs mt-1">Dashboard</span>
      </Link>
      <Link
        href="/berater"
        className={`flex flex-col items-center ${pathname === "/berater" ? "text-blue-600" : "text-gray-500"}`}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Berater</span>
      </Link>
      <Link
        href="/chat"
        className={`flex flex-col items-center ${pathname === "/chat" ? "text-blue-600" : "text-gray-500"}`}
      >
        <MessageSquare size={24} />
        <span className="text-xs mt-1">Chat</span>
      </Link>
      <Link
        href="/profile"
        className={`flex flex-col items-center ${pathname === "/profile" ? "text-blue-600" : "text-gray-500"}`}
      >
        <User size={24} />
        <span className="text-xs mt-1">Profil</span>
      </Link>
    </div>
  )
}
