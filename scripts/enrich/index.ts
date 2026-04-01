/**
 * Enrichment-Script: Ergänzt Quell-URLs und fehlende Daten für Karten.
 * Sucht auf farming-simulator.com nach jeder Karte per Name.
 * Usage: npm run enrich [--slug map-name]
 */
import * as cheerio from "cheerio";
import { readFileSync, existsSync } from "fs";
import path from "path";

// .env.local laden
const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const args = process.argv.slice(2);
const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1]
  || (args.includes("--slug") ? args[args.indexOf("--slug") + 1] : undefined);

const MODHUB_BASE = "https://www.farming-simulator.com";

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "LS-Karten.de Enricher/1.0",
      "Accept-Language": "de-DE,de;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

interface ExtractedDetails {
  name: string;
  version: string;
  autor: string;
  beschreibung: string;
  dateigroesse: string;
}

function extractDetails(html: string): ExtractedDetails {
  const $ = cheerio.load(html);

  const name = $("h1").first().text().trim() ||
    $("title").text().replace(/\s*\|.*$/, "").trim();

  let version = "";
  let autor = "";
  let dateigroesse = "";

  // Tabellen-basierte Info-Felder
  $("dt, th, td, .label, span").each((_, el) => {
    const label = $(el).text().trim().toLowerCase();
    const value = $(el).next().text().trim();

    if (label.includes("version") && !version && /\d+\.\d+/.test(value)) version = value;
    if ((label.includes("author") || label.includes("autor") || label.includes("by")) && !autor) autor = value;
    if ((label.includes("size") || label.includes("größe") || label.includes("groesse")) && !dateigroesse) dateigroesse = value;
  });

  // Fallback: Version aus dem gesamten Text
  if (!version) {
    const vMatch = html.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (vMatch) version = vMatch[1];
  }

  // Fallback: Dateigröße
  if (!dateigroesse) {
    const sizeMatch = html.match(/(\d[\d.,]+)\s*(MB|GB)/i);
    if (sizeMatch) dateigroesse = `${sizeMatch[1]} ${sizeMatch[2]}`;
  }

  // Beschreibung aus dem Hauptinhalt
  const descEl = $(".mod-description, .content-description, article, .mod-detail");
  const beschreibung = descEl.first().text().trim().slice(0, 800)
    .replace(/\s+/g, " ");

  return { name, version, autor, beschreibung, dateigroesse };
}

// Bekannte ModHub mod_ids für unsere Maps
const KNOWN_MODHUB_IDS: Record<string, string> = {
  "kastilien-und-leon": "336009",
  "alpine": "329599",
  "klattenhof": "343628",
  "nordkirchen": "353431",
  "multimap": "338199",
  "vast-country": "351559",
  "elmcreek-25": "320829",
  "fday-map-4x": "339442",
  "arkansas-4x": "352202",
  "kansas-16x": "314500",
};

async function main() {
  console.log("\n🔍 LS-Karten Enricher\n");

  // 1. Karten aus DB laden
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase.from("karten").select("id, slug, name, quell_url, download_url, beschreibung, version") as any;
  if (slugFilter) query = query.eq("slug", slugFilter);
  const { data: karten } = await query.order("name");

  if (!karten || karten.length === 0) {
    console.log("Keine Karten gefunden.");
    return;
  }

  console.log(`${karten.length} Karten geladen.\n`);

  let updated = 0;

  for (const karte of karten) {
    const slug = karte.slug;
    const modId = KNOWN_MODHUB_IDS[slug];
    const hatUrl = !!karte.quell_url;

    if (hatUrl && !slugFilter) {
      console.log(`✓ ${karte.name} — hat bereits Quell-URL`);
      continue;
    }

    if (!modId && !karte.quell_url) {
      console.log(`⚠ ${karte.name} — keine ModHub-ID bekannt, überspringe`);
      continue;
    }

    const detailUrl = karte.quell_url || `${MODHUB_BASE}/mod.php?mod_id=${modId}&title=fs2025`;
    console.log(`🔎 ${karte.name} → ${detailUrl}`);

    try {
      const html = await fetchPage(detailUrl);
      const details = extractDetails(html);

      const updateData: Record<string, unknown> = {};

      if (!karte.quell_url) {
        updateData.quell_url = detailUrl;
        updateData.download_url = detailUrl;
      }

      // Beschreibung ergänzen/aktualisieren wenn ModHub bessere hat
      if (details.beschreibung && details.beschreibung.length > 100 &&
          (!karte.beschreibung || karte.beschreibung.length < 100)) {
        updateData.beschreibung = details.beschreibung;
      }

      if (Object.keys(updateData).length > 0) {
        await supabase.from("karten").update(updateData).eq("id", karte.id);
        console.log(`  ✓ Aktualisiert: ${Object.keys(updateData).join(", ")}`);
        updated++;
      } else {
        console.log(`  — Keine Änderungen nötig`);
      }

      // Info anzeigen
      if (details.dateigroesse) console.log(`  ℹ Dateigröße: ${details.dateigroesse}`);
      if (details.version) console.log(`  ℹ Version (ModHub): ${details.version}`);

      await sleep(1000);
    } catch (error) {
      console.log(`  ✗ Fehler: ${error instanceof Error ? error.message : error}`);
    }
  }

  console.log(`\n✅ ${updated} Karten aktualisiert.`);
}

main().catch((e) => {
  console.error("Fehler:", e.message);
  process.exit(1);
});
