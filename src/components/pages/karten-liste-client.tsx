"use client";

import { useMemo } from "react";
import { KartenGrid } from "@/components/karten/karten-grid";
import { KartenFilter } from "@/components/karten/karten-filter";
import { useKartenStore } from "@/hooks/use-karten";
import { Map } from "lucide-react";
import type { Karte, KartenFilter as KartenFilterType } from "@/types/karte";

function filterAndSort(karten: Karte[], filter: KartenFilterType): Karte[] {
  let result = [...karten];

  if (filter.suche) {
    const term = filter.suche.toLowerCase();
    result = result.filter(
      (k) =>
        k.name.toLowerCase().includes(term) ||
        k.autor.toLowerCase().includes(term) ||
        k.beschreibung.toLowerCase().includes(term)
    );
  }

  if (filter.groesse !== "alle") {
    result = result.filter((k) => k.groesse === filter.groesse);
  }

  if (filter.frucht !== "alle") {
    result = result.filter((k) => k.fruechte.includes(filter.frucht));
  }

  switch (filter.sortierung) {
    case "neueste":
      result.sort((a, b) => new Date(b.erstellt_am).getTime() - new Date(a.erstellt_am).getTime());
      break;
    case "beliebteste":
      result.sort((a, b) => (b.durchschnitt_bewertung ?? 0) - (a.durchschnitt_bewertung ?? 0));
      break;
    case "name":
      result.sort((a, b) => a.name.localeCompare(b.name, "de"));
      break;
  }

  return result;
}

interface KartenListeClientProps {
  karten: Karte[];
}

export function KartenListeClient({ karten }: KartenListeClientProps) {
  const filter = useKartenStore((s) => s.filter);
  const filtered = useMemo(() => filterAndSort(karten, filter), [karten, filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/20">
            <Map className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-green-950">Alle Karten</h1>
            <p className="text-gray-500 text-sm">
              {karten.length} Karten für den LS25
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <KartenFilter />
        <KartenGrid karten={filtered} />
      </div>
    </div>
  );
}
