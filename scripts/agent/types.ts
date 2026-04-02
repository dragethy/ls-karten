export interface ModStructure {
  root: string;
  modDescPath: string;
  mapConfigPath: string | null;
  farmlandsPath: string | null;
  fruitTypesPath: string | null;
  placeablesPath: string | null;
  overviewDds: string | null;
  previewDds: string | null;
  hudsDir: string | null;
  mapSize: number; // 1024, 2048, 4096, etc.
  overviewSize: number; // Pixel-Größe der overview.dds (4096, 8192, etc.)
}

export interface ParsedModDesc {
  name: string;
  autor: string;
  version: string;
  beschreibung: string;
  mapConfigFile: string | null;
  defaultPlaceablesFile: string | null;
}

export interface ParsedFruit {
  internalName: string;
  displayName: string;
  isCustom: boolean;
  hudIcon: string | null;
}

export interface ParsedProduction {
  name: string;
  eingabe: string[];
  ausgabe: string[];
}

export interface ParsedSellingStation {
  name: string;
  fillTypes: string[];
}

export interface ParsedPOI {
  id: string;
  name: string;
  typ: "hof" | "verkaufsstelle" | "produktion" | "tankstelle" | "werkstatt" | "haendler" | "sonstiges";
  x: number;
  y: number;
  beschreibung?: string;
}

export interface AgentResult {
  slug: string;
  name: string;
  autor: string;
  version: string;
  beschreibung: string;
  groesse: string;
  precision_farming: boolean;
  fruechte: string[];
  produktionen: ParsedProduction[];
  pois: ParsedPOI[];
  fakten: Record<string, unknown>;
  preview_url: string | null;
  minimap_url: string | null;
}
