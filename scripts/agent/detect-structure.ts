import { existsSync, readdirSync, statSync } from "fs";
import { execSync } from "child_process";
import path from "path";
import { parseModDesc } from "./parsers/mod-desc.js";
import type { ModStructure } from "./types.js";

function getImageSize(ddsPath: string): number {
  try {
    const result = execSync(`python -c "from PIL import Image; print(Image.open(r'${ddsPath}').size[0])"`, { stdio: "pipe" });
    return parseInt(result.toString().trim()) || 4096;
  } catch {
    return 4096;
  }
}

function findFile(dir: string, patterns: string[]): string | null {
  try {
    const entries = readdirSync(dir);
    for (const pattern of patterns) {
      const lower = pattern.toLowerCase();
      const match = entries.find((e) => e.toLowerCase() === lower || e.toLowerCase().endsWith(lower));
      if (match) return path.join(dir, match);
    }
  } catch { /* */ }
  return null;
}

function findFileRecursive(dir: string, name: string, maxDepth = 2): string | null {
  if (maxDepth < 0) return null;
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const full = path.join(dir, entry);
      if (entry.toLowerCase() === name.toLowerCase()) return full;
      if (maxDepth > 0 && statSync(full).isDirectory()) {
        const found = findFileRecursive(full, name, maxDepth - 1);
        if (found) return found;
      }
    }
  } catch { /* */ }
  return null;
}

function findDdsFile(dir: string, pattern: string): string | null {
  try {
    const entries = readdirSync(dir);
    const match = entries.find((e) => e.toLowerCase().includes(pattern) && e.endsWith(".dds"));
    return match ? path.join(dir, match) : null;
  } catch { /* */ }
  return null;
}

function findHudsDir(root: string): string | null {
  for (const name of ["Huds", "huds", "multifruit/huds"]) {
    const p = path.join(root, name);
    if (existsSync(p)) return p;
  }
  return null;
}

export function detectStructure(modRoot: string): ModStructure {
  console.log(`  Mod-Root: ${modRoot}`);

  // 1. modDesc.xml finden
  const modDescPath = findFileRecursive(modRoot, "modDesc.xml");
  if (!modDescPath) {
    throw new Error("modDesc.xml nicht gefunden!");
  }
  console.log(`  modDesc.xml: ${modDescPath}`);

  // 2. Mod-Root ist das Verzeichnis der modDesc.xml
  const root = path.dirname(modDescPath);

  // 3. Map-Config aus modDesc lesen
  const modDesc = parseModDesc(modDescPath);
  let mapConfigPath: string | null = null;
  if (modDesc.mapConfigFile) {
    mapConfigPath = path.resolve(root, modDesc.mapConfigFile);
    if (!existsSync(mapConfigPath)) mapConfigPath = null;
  }
  // Fallback: map/map.xml suchen
  if (!mapConfigPath) {
    mapConfigPath = findFile(path.join(root, "map"), ["map.xml"]) ||
      findFileRecursive(root, "map.xml", 2);
  }
  console.log(`  Map-Config: ${mapConfigPath || "nicht gefunden"}`);

  // 4. Farmlands, FruitTypes, Placeables direkt suchen als Fallback
  const farmlandsPath = findFileRecursive(root, "farmlands.xml", 3) ||
    findDdsFile(root, "farmlands");
  const fruitTypesPath = findFileRecursive(root, "fruitTypes.xml", 3);
  const placeablesPath = modDesc.defaultPlaceablesFile
    ? path.resolve(root, modDesc.defaultPlaceablesFile)
    : findFileRecursive(root, "placeables.xml", 3);

  // 5. Bilder - auch in Unterverzeichnissen suchen
  let overviewDds = findDdsFile(root, "overview");
  if (!overviewDds) {
    for (const sub of ["map", "maps", "data"]) {
      const p = path.join(root, sub);
      if (existsSync(p)) {
        overviewDds = findDdsFile(p, "overview");
        if (overviewDds) break;
      }
    }
  }
  const previewDds = findDdsFile(root, "preview");
  const hudsDir = findHudsDir(root);

  console.log(`  Overview: ${overviewDds || "nicht gefunden"}`);
  console.log(`  Preview: ${previewDds || "nicht gefunden"}`);
  console.log(`  HUDs: ${hudsDir || "nicht gefunden"}`);

  return {
    root,
    modDescPath,
    mapConfigPath,
    farmlandsPath: farmlandsPath && existsSync(farmlandsPath) ? farmlandsPath : null,
    fruitTypesPath: fruitTypesPath && existsSync(fruitTypesPath) ? fruitTypesPath : null,
    placeablesPath: placeablesPath && existsSync(placeablesPath) ? placeablesPath : null,
    overviewDds,
    previewDds,
    hudsDir,
    mapSize: 2048,
    overviewSize: overviewDds ? getImageSize(overviewDds) : 4096,
  };
}
