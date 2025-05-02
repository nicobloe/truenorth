import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Mail, Phone } from "lucide-react"

export default function BeraterProfil() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src="/gianni-clavadetscher.png"
              alt="Berater Porträt"
              width={400}
              height={400}
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Gianni Clavadetscher</CardTitle>
              <CardDescription>Finanzberater & Vermögensexperte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Mit über 15 Jahren Erfahrung in der Finanzberatung bietet Gianni Clavadetscher maßgeschneiderte
                  Lösungen für Ihre finanziellen Bedürfnisse. Spezialisiert auf Vermögensverwaltung, Altersvorsorge und
                  Investmentstrategien.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>gianni.clavadetscher@example.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>+41 123 456 789</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button className="flex-1">
                  <Mail className="mr-2 h-4 w-4" /> Kontakt aufnehmen
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" /> Termin vereinbaren
                </Button>
              </div>
            </CardFooter>
          </div>
        </div>
      </Card>
    </div>
  )
}
