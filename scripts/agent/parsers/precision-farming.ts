import { readFileSync, existsSync } from "fs";

export function detectPrecisionFarming(mapConfigPath: string | null, modDescPath: string): boolean {
  // 1. Prüfe Map-Config XML auf precisionFarming Block
  if (mapConfigPath && existsSync(mapConfigPath)) {
    const xml = readFileSync(mapConfigPath, "utf-8");
    const pfMatch = xml.match(/<precisionFarming>([\s\S]*?)<\/precisionFarming>/);
    if (pfMatch && pfMatch[1].trim().length > 0) {
      return true;
    }
  }

  // 2. Prüfe modDesc Beschreibung
  if (existsSync(modDescPath)) {
    const xml = readFileSync(modDescPath, "utf-8").toLowerCase();
    if (xml.includes("precision farming") || xml.includes("agricultura de precisi")) {
      return true;
    }
  }

  return false;
}
