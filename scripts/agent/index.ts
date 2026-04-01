import { existsSync, mkdirSync, rmSync } from "fs";
import path from "path";
import { detectStructure } from "./detect-structure.js";
import { parseAll } from "./parsers/index.js";
import { convertDDS } from "./convert-dds.js";
import { downloadZip } from "./download.js";
import { extractZip } from "./extract.js";

const args = process.argv.slice(2);

function getArg(name: string): string | undefined {
  const idx = args.indexOf(`--${name}`);
  return idx >= 0 ? args[idx + 1] : args.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
}

const url = getArg("url");
const slug = getArg("slug");
const localPath = getArg("local");
const dryRun = args.includes("--dry-run");

if (!slug) {
  console.error("Fehler: --slug ist erforderlich");
  console.error("Usage: npm run agent -- --slug map-name [--url https://...] [--local /pfad/] [--dry-run]");
  process.exit(1);
}

if (!url && !localPath) {
  console.error("Fehler: --url oder --local ist erforderlich");
  process.exit(1);
}

async function main() {
  console.log(`\n🌾 LS-Karten Agent — ${slug}\n`);

  let modRoot: string;
  let tempDir: string | null = null;

  // 1. Download oder lokaler Pfad
  if (localPath) {
    modRoot = path.resolve(localPath);
    if (!existsSync(modRoot)) {
      console.error(`Pfad nicht gefunden: ${modRoot}`);
      process.exit(1);
    }
    console.log(`📂 Nutze lokalen Pfad: ${modRoot}`);
  } else {
    console.log("📥 Download...");
    const zipPath = await downloadZip(url!, slug!);
    console.log("📦 Entpacke...");
    modRoot = extractZip(zipPath, slug!);
    tempDir = modRoot;
  }

  // 2. Struktur erkennen
  console.log("\n🔍 Erkenne Mod-Struktur...");
  const structure = detectStructure(modRoot);

  // 3. Daten extrahieren
  console.log("\n📊 Extrahiere Daten...");
  const result = parseAll(structure, slug!);

  // 4. Bilder konvertieren
  console.log("\n🖼️  Konvertiere Bilder...");
  const outputDir = path.join(process.cwd(), "public", "images", "agent-output", slug!);
  mkdirSync(outputDir, { recursive: true });

  let minimapPath: string | null = null;
  let previewPath: string | null = null;

  if (structure.overviewDds) {
    const out = path.join(outputDir, "minimap.png");
    if (convertDDS(structure.overviewDds, out, "PNG")) minimapPath = out;
  }

  if (structure.previewDds) {
    const out = path.join(outputDir, "preview.jpg");
    if (convertDDS(structure.previewDds, out, "JPEG")) previewPath = out;
  }

  // HUD-Icons für Zusatzfrüchte
  const hudPaths: Array<{ name: string; path: string }> = [];
  if (structure.hudsDir) {
    const fruits = result.fruechte;
    // Versuche Icons für jede Zusatzfrucht zu finden
    const { readdirSync } = await import("fs");
    try {
      const hudFiles = readdirSync(structure.hudsDir)
        .filter((f) => f.startsWith("hud_fill_") && f.endsWith(".dds"));

      for (const hudFile of hudFiles) {
        const fruitKey = hudFile.replace("hud_fill_", "").replace(".dds", "");
        const outPath = path.join(outputDir, "huds", `${fruitKey}.png`);
        mkdirSync(path.dirname(outPath), { recursive: true });
        const inputPath = path.join(structure.hudsDir!, hudFile);
        if (convertDDS(inputPath, outPath, "PNG")) {
          hudPaths.push({ name: fruitKey, path: outPath });
        }
      }
    } catch { /* */ }
  }

  // 5. Zusammenfassung
  console.log("\n📋 Ergebnis:");
  console.log(`  Name:              ${result.name}`);
  console.log(`  Autor:             ${result.autor}`);
  console.log(`  Version:           ${result.version}`);
  console.log(`  Größe:             ${result.groesse}`);
  console.log(`  Precision Farming: ${result.precision_farming ? "Ja" : "Nein"}`);
  console.log(`  Zusatzfrüchte:     ${result.fruechte.length} (${result.fruechte.slice(0, 5).join(", ")}${result.fruechte.length > 5 ? "..." : ""})`);
  console.log(`  Produktionen:      ${result.produktionen.length}`);
  console.log(`  POIs:              ${result.pois.length}`);
  console.log(`  Felder:            ${(result.fakten as Record<string, unknown>).felder || "unbekannt"}`);
  console.log(`  Minimap:           ${minimapPath ? "✓" : "✗"}`);
  console.log(`  Preview:           ${previewPath ? "✓" : "✗"}`);
  console.log(`  HUD-Icons:         ${hudPaths.length}`);

  if (dryRun) {
    console.log("\n🏁 Dry-Run — Keine Änderungen vorgenommen.");
    console.log(JSON.stringify(result, null, 2));
  } else {
    // 6. Upload + DB (dynamischer Import um Supabase-Key nur bei Bedarf zu laden)
    console.log("\n☁️  Upload & Datenbank...");
    const { uploadImages } = await import("./upload.js");
    const { upsertKarte } = await import("./db.js");
    const urls = await uploadImages(slug!, minimapPath, previewPath, hudPaths);
    result.minimap_url = urls.minimap_url;
    result.preview_url = urls.preview_url;
    await upsertKarte(result, url || null, url || null);
    console.log("\n✅ Fertig!");
  }

  // 7. Aufräumen
  if (tempDir) {
    rmSync(tempDir, { recursive: true, force: true });
    console.log("  Temp-Verzeichnis aufgeräumt");
  }
}

main().catch((error) => {
  console.error("\n❌ Fehler:", error.message || error);
  process.exit(1);
});
