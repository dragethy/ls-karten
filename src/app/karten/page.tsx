"use client";

import { useMemo } from "react";
import { KartenGrid } from "@/components/karten/karten-grid";
import { KartenFilter } from "@/components/karten/karten-filter";
import { useKartenStore } from "@/hooks/use-karten";
import { DEMO_KARTEN } from "@/lib/demo-data";
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

export default function KartenPage() {
  const filter = useKartenStore((s) => s.filter);
  const filtered = useMemo(() => filterAndSort(DEMO_KARTEN, filter), [filter]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-900">Alle Karten</h1>
        <p className="text-gray-500 mt-1">
          Durchsuche {DEMO_KARTEN.length} Karten fuer den LS25
        </p>
      </div>

      <div className="space-y-6">
        <KartenFilter />
        <KartenGrid karten={filtered} />
      </div>
    </div>
  );
}
