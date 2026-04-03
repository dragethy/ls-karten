import {
  LayoutGrid,
  Trees,
  TreePine,
  Home,
  HardHat,
  Factory,
  Store,
  Zap,
  Sparkles,
} from "lucide-react";
import type { MapFakten } from "@/types/karte";

interface FaktenSheetProps {
  fakten: MapFakten;
}

interface FaktItem {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  bg: string;
}

export function FaktenSheet({ fakten }: FaktenSheetProps) {
  const items: FaktItem[] = [];

  if (fakten.felder) items.push({ icon: LayoutGrid, label: fakten.felder === 1 ? "Feld" : "Felder", value: fakten.felder, color: "text-green-700", bg: "bg-green-50" });
  if (fakten.wiesen) items.push({ icon: Trees, label: fakten.wiesen === 1 ? "Wiese" : "Wiesen", value: fakten.wiesen, color: "text-emerald-700", bg: "bg-emerald-50" });
  if (fakten.waelder) items.push({ icon: TreePine, label: fakten.waelder === 1 ? "Wald" : "Wälder", value: fakten.waelder, color: "text-teal-700", bg: "bg-teal-50" });
  if (fakten.höfe) items.push({ icon: Home, label: fakten.höfe === 1 ? "Hof" : "Höfe", value: fakten.höfe, color: "text-orange-700", bg: "bg-orange-50" });
  if (fakten.bauplätze) items.push({ icon: HardHat, label: fakten.bauplätze === 1 ? "Bauplatz" : "Bauplätze", value: fakten.bauplätze, color: "text-amber-700", bg: "bg-amber-50" });
  if (fakten.produktionen) items.push({ icon: Factory, label: fakten.produktionen === 1 ? "Produktion" : "Produktionen", value: fakten.produktionen, color: "text-blue-700", bg: "bg-blue-50" });
  if (fakten.verkaufsstellen) items.push({ icon: Store, label: fakten.verkaufsstellen === 1 ? "Verkaufsstelle" : "Verkaufsstellen", value: fakten.verkaufsstellen, color: "text-purple-700", bg: "bg-purple-50" });
  if (fakten.bga) items.push({ icon: Zap, label: "BGA", value: fakten.bga, color: "text-yellow-700", bg: "bg-yellow-50" });

  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((item) => (
            <div key={item.label} className={`rounded-2xl ${item.bg} p-4`}>
              <div className={`text-3xl sm:text-4xl font-black ${item.color}`}>{item.value}</div>
              <div className="text-sm text-gray-600 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Besonderheiten als Chips */}
      {fakten.besonderheiten && fakten.besonderheiten.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fakten.besonderheiten.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full bg-green-50 border border-green-200/60 px-3 py-1.5 text-xs font-medium text-green-800"
            >
              <Sparkles className="h-3 w-3 text-green-500" />
              {b}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
