"use client";

import { Badge } from "@/components/ui/badge";
import { POI_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Home, Store, Factory, Fuel, Wrench, ShoppingCart, MapPin } from "lucide-react";

const LEGEND_ICONS: Record<string, React.ElementType> = {
  hof: Home,
  verkaufsstelle: Store,
  produktion: Factory,
  tankstelle: Fuel,
  werkstatt: Wrench,
  haendler: ShoppingCart,
  sonstiges: MapPin,
};

interface MapControlsProps {
  activeLayers: string[];
  onToggleLayer: (layer: string) => void;
}

export function MapControls({ activeLayers, onToggleLayer }: MapControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(POI_ICONS).map(([key, config]) => {
        const Icon = LEGEND_ICONS[key] || MapPin;
        const active = activeLayers.includes(key);
        return (
          <Badge
            key={key}
            className={cn(
              "cursor-pointer transition-all duration-200 border gap-1.5 px-2.5 py-1",
              active
                ? "shadow-sm"
                : "bg-gray-100 text-gray-400 opacity-50 border-gray-200"
            )}
            style={
              active
                ? { backgroundColor: `${config.color}12`, color: config.color, borderColor: `${config.color}35` }
                : undefined
            }
            onClick={() => onToggleLayer(key)}
          >
            <Icon className="h-3.5 w-3.5" style={active ? { color: config.color } : undefined} />
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}
