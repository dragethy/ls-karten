export const SITE_NAME = "LS-Karten.de";
export const SITE_DESCRIPTION =
  "Die beste Sammlung von Karten für den Landwirtschafts Simulator 25. Entdecke detaillierte Karteninfos, interaktive Minimaps und Bewertungen.";

export const MAP_SIZES = ["2x", "4x", "16x", "64x"] as const;

export const FRUECHTE = [
  "Weizen",
  "Gerste",
  "Hafer",
  "Raps",
  "Sonnenblumen",
  "Mais",
  "Kartoffeln",
  "Zuckerrüben",
  "Sojabohnen",
  "Baumwolle",
  "Sorghum",
  "Reis",
  "Oliven",
  "Trauben",
  "Spinat",
  "Erdbeeren",
  "Karotten",
  "Petersilie",
  "Gras",
  "Luzerne",
  "Klee",
] as const;

export const POI_ICONS: Record<string, { label: string; color: string }> = {
  hof: { label: "Hof", color: "#22c55e" },
  verkaufsstelle: { label: "Verkaufsstelle", color: "#3b82f6" },
  produktion: { label: "Produktion", color: "#f59e0b" },
  tankstelle: { label: "Tankstelle", color: "#ef4444" },
  werkstatt: { label: "Werkstatt", color: "#8b5cf6" },
  haendler: { label: "Händler", color: "#06b6d4" },
  sonstiges: { label: "Sonstiges", color: "#6b7280" },
};

export const NAV_LINKS = [
  { href: "/", label: "Startseite" },
  { href: "/karten", label: "Karten" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/changelog", label: "Changelog" },
] as const;
