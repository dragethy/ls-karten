import type { Änderung, ExtrahierteDaten } from "./types.js";

interface KarteMinimal {
  version: string;
  beschreibung: string;
  aktualisiert_am: string;
}

export function vergleiche(karte: KarteMinimal, extrahiert: ExtrahierteDaten): Änderung[] {
  const änderungen: Änderung[] = [];

  if (extrahiert.version && extrahiert.version !== karte.version) {
    änderungen.push({
      feld: "Version",
      alt: karte.version,
      neu: extrahiert.version,
    });
  }

  if (extrahiert.aktualisiert_am) {
    const aktuellesDatum = new Date(karte.aktualisiert_am).toLocaleDateString("de-DE");
    if (extrahiert.aktualisiert_am !== aktuellesDatum && !extrahiert.aktualisiert_am.includes(aktuellesDatum)) {
      änderungen.push({
        feld: "Aktualisiert am",
        alt: aktuellesDatum,
        neu: extrahiert.aktualisiert_am,
      });
    }
  }

  if (extrahiert.beschreibung) {
    const altKurz = karte.beschreibung.slice(0, 100);
    const neuKurz = extrahiert.beschreibung.slice(0, 100);
    if (altKurz !== neuKurz) {
      änderungen.push({
        feld: "Beschreibung",
        alt: altKurz + "...",
        neu: neuKurz + "...",
      });
    }
  }

  return änderungen;
}
