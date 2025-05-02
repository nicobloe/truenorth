"use client"

import { useState, useEffect } from "react"
import { MessageCircle, X } from "lucide-react"
import { CareerAdvisorChat } from "./CareerAdvisorChat"

interface ChatBubbleProps {
  personalityType: any
  dimensionScores: any
}

export function ChatBubble({ personalityType, dimensionScores }: ChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenResults, setHasSeenResults] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Prüfen, ob die Ergebnisse bereits angesehen wurden
    const resultsViewed = localStorage.getItem("resultsViewed")

    if (resultsViewed) {
      setHasSeenResults(true)
      setIsVisible(true)
    } else {
      // Wenn die Komponente geladen wird und die Ergebnisse noch nicht angesehen wurden,
      // markieren wir sie als angesehen und zeigen die Bubble nach einer kurzen Verzögerung an
      localStorage.setItem("resultsViewed", "true")
      setHasSeenResults(true)

      // Bubble nach 2 Sekunden anzeigen
      setTimeout(() => {
        setIsVisible(true)
      }, 2000)
    }
  }, [])

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md h-[80vh] overflow-hidden border border-gray-200 transition-all duration-300 ease-in-out flex flex-col">
          <div className="bg-stone-500 text-white p-3 flex justify-between items-center shrink-0">
            <h3 className="font-medium">Karriere-Berater</h3>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <X size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <CareerAdvisorChat personalityType={personalityType} dimensionScores={dimensionScores} />
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-stone-500 text-white p-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-stone-600 transition-all duration-300 ease-in-out"
        >
          <MessageCircle size={20} />
          <span className="whitespace-nowrap">KI-Coach</span>
        </button>
      )}
    </div>
  )
}
