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
  changelog?: KartenChangelog[];
  durchschnitt_bewertung?: number;
  anzahl_bewertungen?: number;
}

export interface KartenChangelog {
  version: string;
  datum: string;
  downloads?: number;
  aenderungen: string[];
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

export type MapGroesse = "2x" | "4x" | "16x" | "64x";

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
