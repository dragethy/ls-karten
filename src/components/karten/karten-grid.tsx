"use client";

import { KartenCard } from "./karten-card";
import type { Karte } from "@/types/karte";

interface KartenGridProps {
  karten: Karte[];
}

export function KartenGrid({ karten }: KartenGridProps) {
  if (karten.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-lg text-gray-500">Keine Karten gefunden</p>
        <p className="text-sm text-gray-400 mt-1">
          Versuche andere Filtereinstellungen
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {karten.map((karte, index) => (
        <KartenCard key={karte.id} karte={karte} index={index} />
      ))}
    </div>
  );
}
