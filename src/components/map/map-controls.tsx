"use client";

import { Badge } from "@/components/ui/badge";
import { POI_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface MapControlsProps {
  activeLayers: string[];
  onToggleLayer: (layer: string) => void;
}

export function MapControls({ activeLayers, onToggleLayer }: MapControlsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(POI_ICONS).map(([key, config]) => (
        <Badge
          key={key}
          className={cn(
            "cursor-pointer transition-all duration-200 border",
            activeLayers.includes(key)
              ? "shadow-sm"
              : "bg-gray-100 text-gray-400 opacity-50 border-gray-200"
          )}
          style={
            activeLayers.includes(key)
              ? { backgroundColor: `${config.color}15`, color: config.color, borderColor: `${config.color}40` }
              : undefined
          }
          onClick={() => onToggleLayer(key)}
        >
          <span
            className="inline-block w-2 h-2 rounded-full mr-1.5"
            style={{ backgroundColor: config.color }}
          />
          {config.label}
        </Badge>
      ))}
    </div>
  );
}
