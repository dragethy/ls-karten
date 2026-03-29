import type { Karte } from "@/types/karte";

export const DEMO_KARTEN: Karte[] = [
  {
    id: "1",
    slug: "hof-bergmann",
    name: "Hof Bergmann",
    beschreibung:
      "Eine detailreiche deutsche Karte mit vielen Produktionen und abwechslungsreichem Gelaende. Perfekt fuer Spieler die eine realistische Landwirtschaftserfahrung suchen.",
    autor: "BergmannModding",
    groesse: "4x",
    minimap_url: null,
    screenshots: [],
    fruechte: [
      "Weizen", "Gerste", "Raps", "Mais", "Kartoffeln",
      "Zuckerrueben", "Hafer", "Sonnenblumen", "Gras", "Luzerne",
    ],
    produktionen: [
      { name: "Muehle", eingabe: ["Weizen", "Gerste"], ausgabe: ["Mehl"], beschreibung: "Getreide zu Mehl verarbeiten" },
      { name: "Baeckerei", eingabe: ["Mehl", "Zucker"], ausgabe: ["Brot", "Kuchen"], beschreibung: "Backwaren herstellen" },
      { name: "Molkerei", eingabe: ["Milch"], ausgabe: ["Butter", "Kaese"], beschreibung: "Milchprodukte herstellen" },
    ],
    pois: [
      { id: "hof1", name: "Haupthof", typ: "hof", x: 50, y: 50 },
      { id: "vs1", name: "BGA", typ: "verkaufsstelle", x: 30, y: 70 },
      { id: "prod1", name: "Muehle", typ: "produktion", x: 65, y: 40 },
    ],
    download_url: null,
    erstellt_am: "2025-01-15T10:00:00Z",
    aktualisiert_am: "2025-01-15T10:00:00Z",
    durchschnitt_bewertung: 4.5,
    anzahl_bewertungen: 12,
  },
  {
    id: "2",
    slug: "elmcreek-reloaded",
    name: "Elmcreek Reloaded",
    beschreibung:
      "Eine erweiterte Version der beliebten Elmcreek Karte mit zusaetzlichen Feldern, Produktionen und verbesserten Details.",
    autor: "MapModders",
    groesse: "2x",
    minimap_url: null,
    screenshots: [],
    fruechte: [
      "Weizen", "Gerste", "Mais", "Sojabohnen", "Baumwolle", "Sonnenblumen", "Gras",
    ],
    produktionen: [
      { name: "Oelmuehle", eingabe: ["Sonnenblumen", "Raps"], ausgabe: ["Oel"], beschreibung: "Pflanzenoel pressen" },
      { name: "Futtermischanlage", eingabe: ["Weizen", "Gerste", "Mais"], ausgabe: ["Mischfutter"], beschreibung: "Tierfutter mischen" },
    ],
    pois: [
      { id: "hof1", name: "Farm", typ: "hof", x: 45, y: 55 },
      { id: "ts1", name: "Tankstelle", typ: "tankstelle", x: 60, y: 30 },
    ],
    download_url: null,
    erstellt_am: "2025-02-20T14:00:00Z",
    aktualisiert_am: "2025-02-20T14:00:00Z",
    durchschnitt_bewertung: 4.2,
    anzahl_bewertungen: 8,
  },
  {
    id: "3",
    slug: "norddeutschland",
    name: "Norddeutschland",
    beschreibung:
      "Eine riesige norddeutsche Marschlandschaft mit weitlaeufigen Feldern und authentischem Flair. Ideal fuer Grossbetriebe.",
    autor: "NordModding",
    groesse: "8x",
    minimap_url: null,
    screenshots: [],
    fruechte: [
      "Weizen", "Gerste", "Raps", "Kartoffeln", "Zuckerrueben", "Mais", "Gras", "Klee", "Hafer",
    ],
    produktionen: [
      { name: "Zuckerfabrik", eingabe: ["Zuckerrueben"], ausgabe: ["Zucker"], beschreibung: "Zucker aus Zuckerrueben gewinnen" },
      { name: "Staerkefabrik", eingabe: ["Kartoffeln"], ausgabe: ["Staerke"], beschreibung: "Kartoffelstaerke produzieren" },
    ],
    pois: [
      { id: "hof1", name: "Gutshof", typ: "hof", x: 35, y: 45 },
      { id: "ws1", name: "Werkstatt", typ: "werkstatt", x: 50, y: 60 },
      { id: "hd1", name: "Landhandel", typ: "haendler", x: 70, y: 35 },
    ],
    download_url: null,
    erstellt_am: "2025-03-10T09:00:00Z",
    aktualisiert_am: "2025-03-10T09:00:00Z",
    durchschnitt_bewertung: 4.8,
    anzahl_bewertungen: 24,
  },
  {
    id: "4",
    slug: "suedliches-bayern",
    name: "Suedliches Bayern",
    beschreibung:
      "Malerische bayerische Alpenlandschaft mit Bergbauernhoefen, Almwirtschaft und regionalen Produktionen.",
    autor: "AlpenMods",
    groesse: "4x",
    minimap_url: null,
    screenshots: [],
    fruechte: [
      "Weizen", "Gerste", "Mais", "Gras", "Luzerne", "Kartoffeln", "Karotten",
    ],
    produktionen: [
      { name: "Kaeserei", eingabe: ["Milch"], ausgabe: ["Bergkaese", "Molke"], beschreibung: "Traditioneller Bergkaese" },
      { name: "Brauerei", eingabe: ["Gerste", "Weizen"], ausgabe: ["Bier"], beschreibung: "Bayerisches Bier brauen" },
    ],
    pois: [
      { id: "hof1", name: "Bergbauernhof", typ: "hof", x: 40, y: 60 },
      { id: "prod1", name: "Kaeserei", typ: "produktion", x: 55, y: 40 },
      { id: "ts1", name: "Tankstelle", typ: "tankstelle", x: 25, y: 30 },
    ],
    download_url: null,
    erstellt_am: "2025-03-25T16:00:00Z",
    aktualisiert_am: "2025-03-25T16:00:00Z",
    durchschnitt_bewertung: 4.6,
    anzahl_bewertungen: 15,
  },
];
