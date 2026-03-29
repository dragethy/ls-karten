import { Factory, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Produktion } from "@/types/karte";

interface ProduktionenListeProps {
  produktionen: Produktion[];
}

export function ProduktionenListe({ produktionen }: ProduktionenListeProps) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
        <Factory className="h-5 w-5 text-amber-600" />
        Produktionen ({produktionen.length})
      </h3>
      <div className="grid gap-3">
        {produktionen.map((prod) => (
          <Card key={prod.name} className="border-green-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-green-900 mb-2">{prod.name}</h4>
              {prod.beschreibung && (
                <p className="text-sm text-gray-500 mb-3">{prod.beschreibung}</p>
              )}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex flex-wrap gap-1.5">
                  {prod.eingabe.map((e) => (
                    <Badge key={e} variant="outline" className="text-xs">
                      {e}
                    </Badge>
                  ))}
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {prod.ausgabe.map((a) => (
                    <Badge key={a} variant="default" className="text-xs">
                      {a}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
