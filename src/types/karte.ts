export interface Karte {
  id: string;
  slug: string;
  name: string;
  beschreibung: string;
  autor: string;
  version: string;
  groesse: MapGroesse;
  preview_url: string | null;
  minimap_url: string | null;
  screenshots: string[];
  fruechte: string[];
  produktionen: Produktion[];
  pois: PointOfInterest[];
  download_url: string | null;
  quell_url: string | null;
  erstellt_am: string;
  aktualisiert_am: string;
  precision_farming: boolean;
  fakten: MapFakten;
  durchschnitt_bewertung?: number;
  anzahl_bewertungen?: number;
}

export interface MapFakten {
  felder?: number;
  wiesen?: number;
  waelder?: number;
  höfe?: number;
  bauplätze?: number;
  produktionen?: number;
  verkaufsstellen?: number;
  bga?: number;
  besonderheiten?: string[];
}

export type MapGroesse = "1x" | "2x" | "4x" | "8x" | "16x";

export interface Produktion {
  name: string;
  eingabe: string[];
  ausgabe: string[];
  beschreibung?: string;
}

export interface PointOfInterest {
  id: string;
  name: string;
  typ: POITyp;
  x: number;
  y: number;
  beschreibung?: string;
}

export type POITyp =
  | "hof"
  | "verkaufsstelle"
  | "produktion"
  | "tankstelle"
  | "werkstatt"
  | "haendler"
  | "sonstiges";

export interface KartenFilter {
  suche: string;
  groesse: MapGroesse | "alle";
  frucht: string | "alle";
  sortierung: "neueste" | "beliebteste" | "name";
}
