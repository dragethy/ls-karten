import { XMLParser } from "fast-xml-parser";
import { readFileSync, existsSync } from "fs";
import path from "path";
import type { ParsedProduction, ParsedSellingStation, ParsedPOI } from "../types.js";

interface PlaceablesResult {
  produktionen: ParsedProduction[];
  verkaufsstellen: ParsedSellingStation[];
  pois: ParsedPOI[];
}

export function parsePlaceables(filePath: string, modRoot: string, mapSize: number, overviewSize?: number): PlaceablesResult {
  if (!existsSync(filePath)) return { produktionen: [], verkaufsstellen: [], pois: [] };

  const xml = readFileSync(filePath, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);

  const placeables = doc?.placeables?.placeable || [];
  const entries = Array.isArray(placeables) ? placeables : [placeables];

  const produktionen: ParsedProduction[] = [];
  const verkaufsstellen: ParsedSellingStation[] = [];
  const pois: ParsedPOI[] = [];
  // POIs normalisieren: mapSize bestimmt den Koordinatenbereich
  // Die Minimap zeigt overviewSize/2 Pixel von der Mitte
  // Bei ratio=1 (overview=mapSize): POIs am Rand können außerhalb des Crops liegen
  // Bei ratio=2 (overview=2*mapSize): Crop = mapSize, alles passt
  const halfSize = mapSize / 2;

  let prodCount = 0;
  let vsCount = 0;

  for (const entry of entries) {
    const filename = (entry?.["@_filename"] || "").replace("$mapdir$", modRoot).replace(/\\/g, "/");
    const position = entry?.["@_position"] || "0 0 0";
    const [wx, , wz] = position.split(" ").map(Number);
    let normX = Math.round(((wx + halfSize) / mapSize) * 100);
    let normY = Math.round(((wz + halfSize) / mapSize) * 100);
    // POIs außerhalb des Kartenbereichs auf den Rand clampen
    normX = Math.max(2, Math.min(98, normX));
    normY = Math.max(2, Math.min(98, normY));

    // Versuche die Placeable-XML zu lesen
    const resolvedPath = path.resolve(filename);
    if (!existsSync(resolvedPath)) continue;

    try {
      const pXml = readFileSync(resolvedPath, "utf-8");
      const pDoc = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" }).parse(pXml);
      const placeable = pDoc?.placeable;
      if (!placeable) continue;

      const pName = placeable?.["@_name"] || placeable?.storeData?.name?.de || placeable?.storeData?.name?.en || path.basename(filename, ".xml");

      // Produktion?
      const prodPoint = placeable?.productionPoint;
      if (prodPoint) {
        const productions = prodPoint?.productions?.production;
        const prodEntries = Array.isArray(productions) ? productions : productions ? [productions] : [];

        for (const prod of prodEntries) {
          const inputs = extractFillTypes(prod?.inputs?.input);
          const outputs = extractFillTypes(prod?.outputs?.output);
          if (inputs.length > 0 || outputs.length > 0) {
            produktionen.push({
              name: prod?.["@_name"] || pName,
              eingabe: inputs,
              ausgabe: outputs,
            });
          }
        }

        prodCount++;
        pois.push({
          id: `prod-${prodCount}`,
          name: String(pName),
          typ: "produktion",
          x: normX,
          y: normY,
        });
        continue;
      }

      // Verkaufsstelle?
      const selling = placeable?.sellingStation;
      if (selling) {
        const fillTypes = extractAcceptedTypes(selling);
        verkaufsstellen.push({ name: String(pName), fillTypes });
        vsCount++;
        pois.push({
          id: `vs-${vsCount}`,
          name: String(pName),
          typ: "verkaufsstelle",
          x: normX,
          y: normY,
        });
      }
    } catch {
      // XML-Parse-Fehler ignorieren
    }
  }

  return { produktionen, verkaufsstellen, pois };
}

function extractFillTypes(nodes: unknown): string[] {
  if (!nodes) return [];
  const entries = Array.isArray(nodes) ? nodes : [nodes];
  return entries
    .map((n: Record<string, unknown>) => String(n?.["@_fillType"] || ""))
    .filter(Boolean);
}

function extractAcceptedTypes(selling: Record<string, unknown>): string[] {
  const types: string[] = [];

  // Unload trigger
  const unload = selling?.unloadTrigger;
  if (unload) {
    const ft = (unload as Record<string, unknown>)?.acceptedFillTypes;
    if (ft) types.push(...extractFillTypes(ft));
  }

  // Direkte fillType Einträge
  const directTypes = (selling as Record<string, unknown>)?.fillType;
  if (directTypes) {
    const entries = Array.isArray(directTypes) ? directTypes : [directTypes];
    for (const e of entries) {
      const name = (e as Record<string, unknown>)?.["@_name"];
      if (name) types.push(String(name));
    }
  }

  return types;
}
