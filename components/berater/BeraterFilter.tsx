"use client"

import { useState, useEffect } from "react"
import { ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export type BeraterFilter = {
  spezialisierung: string[]
  sprachen: string[]
  onlineBeratung: boolean
  vorOrt: boolean
  land: string
}

const defaultFilter: BeraterFilter = {
  spezialisierung: [],
  sprachen: [],
  onlineBeratung: false,
  vorOrt: false,
  land: "Schweiz", // Standardmäßig auf Schweiz gesetzt, da wir nur Schweizer Berater haben
}

type BeraterFilterProps = {
  onFilterChange: (filter: BeraterFilter) => void
  className?: string
}

export function BeraterFilter({ onFilterChange, className }: BeraterFilterProps) {
  const [filter, setFilter] = useState<BeraterFilter>(defaultFilter)
  const [spezialisierungOpen, setSpezialisierungOpen] = useState(false)
  const [sprachenOpen, setSprachenOpen] = useState(false)

  // Verfügbare Spezialisierungen
  const spezialisierungen = [
    "Karriereberatung",
    "Persönlichkeitsentwicklung",
    "Bewerbungscoaching",
    "Gehaltsverhandlung",
    "Work-Life-Balance",
    "Stressmanagement",
    "Führungskräfteentwicklung",
    "Strategische Karriereplanung",
    "Berufseinstieg",
    "Studienwahl",
    "Karrierewechsel",
    "Digitale Transformation",
    "Kreative Berufe",
    "Portfolio-Entwicklung",
  ]

  // Verfügbare Sprachen
  const sprachen = ["Deutsch", "Englisch", "Französisch", "Italienisch"]

  // Verfügbare Länder - jetzt nur noch Schweiz
  const länder = ["Schweiz"]

  useEffect(() => {
    onFilterChange(filter)
  }, [filter, onFilterChange])

  const handleSpezialisierungChange = (value: string) => {
    setFilter((prev) => {
      const newSpezialisierung = prev.spezialisierung.includes(value)
        ? prev.spezialisierung.filter((item) => item !== value)
        : [...prev.spezialisierung, value]
      return { ...prev, spezialisierung: newSpezialisierung }
    })
  }

  const handleSprachenChange = (value: string) => {
    setFilter((prev) => {
      const newSprachen = prev.sprachen.includes(value)
        ? prev.sprachen.filter((item) => item !== value)
        : [...prev.sprachen, value]
      return { ...prev, sprachen: newSprachen }
    })
  }

  const handleOnlineBeratungChange = (checked: boolean) => {
    setFilter((prev) => ({ ...prev, onlineBeratung: checked }))
  }

  const handleVorOrtChange = (checked: boolean) => {
    setFilter((prev) => ({ ...prev, vorOrt: checked }))
  }

  return (
    <div className={cn("flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0", className)}>
      {/* Spezialisierung Filter */}
      <Popover open={spezialisierungOpen} onOpenChange={setSpezialisierungOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={spezialisierungOpen}
            className="w-full justify-between md:w-[200px]"
          >
            {filter.spezialisierung.length > 0 ? `${filter.spezialisierung.length} ausgewählt` : "Spezialisierung"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 md:w-[200px]">
          <Command>
            <CommandInput placeholder="Suche..." />
            <CommandList>
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {spezialisierungen.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => handleSpezialisierungChange(item)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={filter.spezialisierung.includes(item)}
                        onCheckedChange={() => handleSpezialisierungChange(item)}
                      />
                      <span>{item}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Sprachen Filter */}
      <Popover open={sprachenOpen} onOpenChange={setSprachenOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={sprachenOpen}
            className="w-full justify-between md:w-[200px]"
          >
            {filter.sprachen.length > 0 ? `${filter.sprachen.length} ausgewählt` : "Sprachen"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 md:w-[200px]">
          <Command>
            <CommandInput placeholder="Suche..." />
            <CommandList>
              <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-auto">
                {sprachen.map((item) => (
                  <CommandItem key={item} value={item} onSelect={() => handleSprachenChange(item)}>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={filter.sprachen.includes(item)}
                        onCheckedChange={() => handleSprachenChange(item)}
                      />
                      <span>{item}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Verfügbarkeit Filter */}
      <div className="flex space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="onlineBeratung"
            checked={filter.onlineBeratung}
            onCheckedChange={(checked) => handleOnlineBeratungChange(checked as boolean)}
          />
          <Label htmlFor="onlineBeratung">Online</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="vorOrt"
            checked={filter.vorOrt}
            onCheckedChange={(checked) => handleVorOrtChange(checked as boolean)}
          />
          <Label htmlFor="vorOrt">Vor Ort</Label>
        </div>
      </div>
    </div>
  )
}
