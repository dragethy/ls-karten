"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface SternRatingProps {
  wert: number;
  maxSterne?: number;
  groesse?: "sm" | "md" | "lg";
  interaktiv?: boolean;
  onChange?: (wert: number) => void;
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function SternRating({
  wert,
  maxSterne = 5,
  groesse = "md",
  interaktiv = false,
  onChange,
}: SternRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxSterne }, (_, i) => {
        const filled = i < Math.floor(wert);
        const halfFilled = !filled && i < wert;

        return (
          <button
            key={i}
            type="button"
            disabled={!interaktiv}
            onClick={() => onChange?.(i + 1)}
            className={cn(
              "transition-colors",
              interaktiv && "cursor-pointer hover:scale-110 transition-transform",
              !interaktiv && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeMap[groesse],
                filled
                  ? "fill-amber-500 text-amber-500"
                  : halfFilled
                  ? "fill-amber-500/50 text-amber-500"
                  : "fill-gray-200 text-gray-200"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
