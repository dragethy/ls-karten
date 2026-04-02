import path from "path";
import { parseModDesc } from "./mod-desc.js";
import { parseMapConfig } from "./map-config.js";
import { parseFruitTypes } from "./fruit-types.js";
import { parseFarmlands } from "./farmlands.js";
import { parsePlaceables } from "./placeables.js";
import { detectPrecisionFarming } from "./precision-farming.js";
import type { ModStructure, AgentResult } from "../types.js";

export function parseAll(structure: ModStructure, slug: string): AgentResult {
  console.log("  Parsing modDesc.xml...");
  const modDesc = parseModDesc(structure.modDescPath);

  console.log("  Parsing Map-Config...");
  const mapConfig = structure.mapConfigPath
    ? parseMapConfig(structure.mapConfigPath)
    : { mapSize: 2048, groesse: "2x", farmlandsFile: null, fruitTypesFile: null, fillTypesFile: null, hasPrecisionFarming: false };

  // Pfade relativ zum Mod-Root auflösen
  const farmlandsPath = mapConfig.farmlandsFile
    ? path.resolve(structure.root, mapConfig.farmlandsFile)
    : structure.farmlandsPath;

  const fruitTypesPath = mapConfig.fruitTypesFile
    ? path.resolve(structure.root, mapConfig.fruitTypesFile)
    : structure.fruitTypesPath;

  console.log("  Parsing Früchte...");
  const fruits = fruitTypesPath
    ? parseFruitTypes(fruitTypesPath, structure.root)
    : [];
  const customFruits = fruits.filter((f) => f.isCustom);

  console.log("  Parsing Farmlands...");
  const felderCount = farmlandsPath ? parseFarmlands(farmlandsPath) : 0;

  console.log("  Parsing Placeables...");
  const placeablesPath = structure.placeablesPath || (modDesc.defaultPlaceablesFile
    ? path.resolve(structure.root, modDesc.defaultPlaceablesFile)
    : null);
  const effectiveMapSize = structure.mapSize || mapConfig.mapSize;
  const overviewSize = structure.overviewSize || effectiveMapSize * 2;
  const { produktionen, verkaufsstellen, pois } = placeablesPath
    ? parsePlaceables(placeablesPath, structure.root, effectiveMapSize, overviewSize)
    : { produktionen: [], verkaufsstellen: [], pois: [] };

  console.log("  Prüfe Precision Farming...");
  const precisionFarming = mapConfig.hasPrecisionFarming
    || detectPrecisionFarming(structure.mapConfigPath, structure.modDescPath);

  return {
    slug,
    name: modDesc.name,
    autor: modDesc.autor,
    version: modDesc.version,
    beschreibung: modDesc.beschreibung,
    groesse: mapConfig.groesse,
    precision_farming: precisionFarming,
    fruechte: customFruits.map((f) => f.displayName),
    produktionen,
    pois,
    fakten: {
      felder: felderCount || undefined,
      produktionen: produktionen.length || undefined,
      verkaufsstellen: verkaufsstellen.length || undefined,
    },
    preview_url: null,
    minimap_url: null,
  };
}
