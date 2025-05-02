"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  href?: string
  onBack?: () => void
  label?: string
  className?: string
}

export function BackButton({ href, onBack, label = "Zurück", className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onBack) {
      onBack()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-1 text-gray-600 hover:text-gray-800 ${className}`}
      aria-label={label}
    >
      <ChevronLeft size={18} />
      <span>{label}</span>
    </button>
  )
}
