import { XMLParser } from "fast-xml-parser";
import { readFileSync, existsSync } from "fs";
import path from "path";
import type { ParsedFruit } from "../types.js";

// Interne Namen → deutsche Anzeigenamen für Basis-Früchte
const BASE_FRUIT_NAMES: Record<string, string> = {
  WHEAT: "Weizen", BARLEY: "Gerste", OAT: "Hafer", CANOLA: "Raps",
  MAIZE: "Mais", SUNFLOWER: "Sonnenblumen", SOYBEAN: "Sojabohnen",
  POTATO: "Kartoffeln", SUGARBEET: "Zuckerrüben", SUGARCANE: "Zuckerrohr",
  COTTON: "Baumwolle", SORGHUM: "Sorghum", RICE: "Reis",
  RICELONGGRAIN: "Langkornreis", GRAPE: "Trauben", OLIVE: "Oliven",
  POPLAR: "Pappel", BEETROOT: "Rote Beete", CARROT: "Karotten",
  PARSNIP: "Pastinaken", GREENBEAN: "Grüne Bohnen", PEA: "Erbsen",
  SPINACH: "Spinat", GRASS: "Gras", OILSEEDRADISH: "Ölrettich",
  MEADOW: "Wiese", ALFALFA: "Luzerne", CLOVER: "Klee",
};

export function parseFruitTypes(filePath: string, modRoot: string): ParsedFruit[] {
  if (!existsSync(filePath)) return [];

  const xml = readFileSync(filePath, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);

  const fruitTypes = doc?.map?.fruitTypes?.fruitType || [];
  const entries = Array.isArray(fruitTypes) ? fruitTypes : [fruitTypes];

  const fruits: ParsedFruit[] = [];

  for (const entry of entries) {
    const filename = entry?.["@_filename"] || "";
    const isCustom = !filename.startsWith("$data/");

    // Versuche den deutschen Namen aus der Frucht-XML zu lesen
    let displayName = "";
    let internalName = "";

    if (isCustom && filename) {
      const fruitXmlPath = path.resolve(modRoot, filename);
      if (existsSync(fruitXmlPath)) {
        try {
          const fruitXml = readFileSync(fruitXmlPath, "utf-8");
          const fruitDoc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" }).parse(fruitXml);
          const ft = fruitDoc?.fruitType || fruitDoc?.map?.fruitType;
          internalName = ft?.["@_name"] || "";
          displayName = ft?.title?.de || ft?.title?.en || internalName;
        } catch {
          // Fallback: Name aus Dateiname ableiten
        }
      }

      if (!displayName) {
        displayName = path.basename(filename, ".xml")
          .replace(/^(foliage_?|fruit_?)/i, "")
          .replace(/([A-Z])/g, " $1")
          .trim();
      }
    } else {
      // Basis-Frucht: Name aus Mapping
      internalName = path.basename(filename, ".xml").toUpperCase();
      displayName = BASE_FRUIT_NAMES[internalName] || internalName;
    }

    // HUD-Icon suchen
    let hudIcon: string | null = null;
    if (isCustom && internalName) {
      const possibleNames = [
        `hud_fill_${internalName.toLowerCase()}.dds`,
        `hud_fill_${displayName.toLowerCase().replace(/\s+/g, "")}.dds`,
      ];
      // Suche in gängigen HUD-Verzeichnissen
      for (const dir of ["Huds", "huds", "multifruit/huds"]) {
        for (const name of possibleNames) {
          const p = path.join(modRoot, dir, name);
          if (existsSync(p)) { hudIcon = p; break; }
        }
        if (hudIcon) break;
      }
    }

    fruits.push({ internalName, displayName, isCustom, hudIcon });
  }

  return fruits;
}
