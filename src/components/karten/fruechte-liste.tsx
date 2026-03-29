import { Wheat } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FruechteListe {
  fruechte: string[];
}

export function FruechteListe({ fruechte }: FruechteListe) {
  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
        <Wheat className="h-5 w-5 text-green-600" />
        Anbaubare Fruechte ({fruechte.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {fruechte.map((frucht) => (
          <Badge key={frucht} variant="default" className="text-sm">
            {frucht}
          </Badge>
        ))}
      </div>
    </div>
  );
}
