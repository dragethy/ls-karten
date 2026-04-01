import { XMLParser } from "fast-xml-parser";
import { readFileSync } from "fs";
import type { ParsedModDesc } from "../types.js";

export function parseModDesc(filePath: string): ParsedModDesc {
  const xml = readFileSync(filePath, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  const mod = doc.modDesc;

  const title = mod?.title?.de || mod?.title?.en || mod?.title || "Unbekannt";
  const desc = mod?.description?.de || mod?.description?.en || mod?.description || "";
  const autor = mod?.author || "Unbekannt";
  const version = mod?.version || "1.0.0";

  let mapConfigFile: string | null = null;
  const maps = mod?.maps?.map;
  if (maps) {
    const mapEntry = Array.isArray(maps) ? maps[0] : maps;
    mapConfigFile = mapEntry?.["@_configFilename"] || null;
  }

  let defaultPlaceablesFile: string | null = null;
  if (mod?.maps?.map) {
    const mapEntry = Array.isArray(mod.maps.map) ? mod.maps.map[0] : mod.maps.map;
    defaultPlaceablesFile = mapEntry?.["@_defaultPlaceablesXMLFilename"] || null;
  }

  // Beschreibung bereinigen (CDATA, Whitespace)
  const cleanDesc = String(desc)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);

  return {
    name: String(title).trim(),
    autor: String(autor).trim(),
    version: String(version).trim(),
    beschreibung: cleanDesc,
    mapConfigFile,
    defaultPlaceablesFile,
  };
}
