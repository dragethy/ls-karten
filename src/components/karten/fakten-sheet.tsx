import {
  LayoutGrid,
  Trees,
  TreePine,
  Home,
  HardHat,
  Factory,
  Store,
  Zap,
  Gauge,
  Sparkles,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { MapFakten } from "@/types/karte";

interface FaktenSheetProps {
  fakten: MapFakten;
  version: string;
  groesse: string;
  precision_farming: boolean;
}

interface FaktItem {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}

export function FaktenSheet({ fakten, version, groesse, precision_farming }: FaktenSheetProps) {
  const items: FaktItem[] = [];

  if (fakten.felder) items.push({ icon: LayoutGrid, label: fakten.felder === 1 ? "Feld" : "Felder", value: fakten.felder, color: "text-amber-600" });
  if (fakten.wiesen) items.push({ icon: Trees, label: fakten.wiesen === 1 ? "Wiese" : "Wiesen", value: fakten.wiesen, color: "text-green-600" });
  if (fakten.waelder) items.push({ icon: TreePine, label: fakten.waelder === 1 ? "Wald" : "Wälder", value: fakten.waelder, color: "text-emerald-700" });
  if (fakten.höfe) items.push({ icon: Home, label: fakten.höfe === 1 ? "Hof" : "Höfe", value: fakten.höfe, color: "text-orange-600" });
  if (fakten.bauplätze) items.push({ icon: HardHat, label: fakten.bauplätze === 1 ? "Bauplatz" : "Bauplätze", value: fakten.bauplätze, color: "text-yellow-600" });
  if (fakten.produktionen) items.push({ icon: Factory, label: fakten.produktionen === 1 ? "Produktion" : "Produktionen", value: fakten.produktionen, color: "text-blue-600" });
  if (fakten.verkaufsstellen) items.push({ icon: Store, label: fakten.verkaufsstellen === 1 ? "Verkaufsstelle" : "Verkaufsstellen", value: fakten.verkaufsstellen, color: "text-purple-600" });
  if (fakten.bga) items.push({ icon: Zap, label: "BGA", value: fakten.bga, color: "text-yellow-500" });

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
        <Gauge className="h-5 w-5 text-green-600" />
        Fakten
      </h3>

      {/* Version + Tags */}
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-green-600 text-white border-green-600">
          <Tag className="h-3 w-3 mr-1" />
          v{version}
        </Badge>
        <Badge variant="secondary">{groesse} Karte</Badge>
        <Badge
          className={
            precision_farming
              ? "bg-blue-100 text-blue-700 border-blue-300"
              : "bg-gray-100 text-gray-500 border-gray-300"
          }
        >
          PF {precision_farming ? "Ready" : "Nein"}
        </Badge>
      </div>

      {/* Stats Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {items.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-green-200 bg-white p-3 shadow-sm"
            >
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <span className="text-xl font-bold text-green-900">{item.value}</span>
              <span className="text-xs text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Besonderheiten */}
      {fakten.besonderheiten && fakten.besonderheiten.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-gray-600">Besonderheiten:</span>
          <ul className="space-y-1">
            {fakten.besonderheiten.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Sparkles className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
