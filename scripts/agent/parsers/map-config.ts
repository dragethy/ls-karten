import { XMLParser } from "fast-xml-parser";
import { readFileSync, existsSync } from "fs";

interface MapConfigResult {
  mapSize: number;
  groesse: string;
  farmlandsFile: string | null;
  fruitTypesFile: string | null;
  fillTypesFile: string | null;
  hasPrecisionFarming: boolean;
}

const SIZE_MAP: Record<number, string> = {
  1024: "1x",
  2048: "2x",
  4096: "4x",
  8192: "8x",
  16384: "16x",
};

export function parseMapConfig(filePath: string): MapConfigResult {
  if (!existsSync(filePath)) {
    return { mapSize: 2048, groesse: "2x", farmlandsFile: null, fruitTypesFile: null, fillTypesFile: null, hasPrecisionFarming: false };
  }

  const xml = readFileSync(filePath, "utf-8");
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
  const doc = parser.parse(xml);
  const map = doc.map;

  const width = parseInt(map?.["@_width"] || "2048");
  const groesse = SIZE_MAP[width] || "2x";

  const farmlandsFile = map?.farmlands?.["@_filename"] || null;
  const fruitTypesFile = map?.fruitTypes?.["@_filename"] || null;
  const fillTypesFile = map?.fillTypes?.["@_filename"] || null;

  // Precision Farming: prüfe ob der Block existiert und nicht leer ist
  const pf = map?.precisionFarming;
  const hasPrecisionFarming = pf !== undefined && pf !== null && pf !== "" && Object.keys(pf).length > 0;

  return {
    mapSize: width,
    groesse,
    farmlandsFile,
    fruitTypesFile,
    fillTypesFile,
    hasPrecisionFarming,
  };
}
