/**
 * Crawlt Changelogs von forbidden-mods.de und farming-simulator.com
 * und speichert sie in der Supabase DB.
 *
 * Usage: npm run crawl-changelog [--slug map-name]
 */
import * as cheerio from "cheerio";
import { readFileSync, existsSync } from "fs";
import path from "path";

// .env.local laden
const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
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

interface ChangelogEntry {
  version: string;
  datum: string;
  downloads?: number;
  aenderungen: string[];
}

async function fetchPage(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "LS-Karten.de Changelog-Crawler/1.0",
      "Accept-Language": "de-DE,de;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function parseForbiddenModsChangelog(html: string): ChangelogEntry[] {
  const $ = cheerio.load(html);
  const entries: ChangelogEntry[] = [];

  // Versionen sind in separaten Sektionen/Cards
  $(".filebaseVersionEntry, .contentSection, article").each((_, section) => {
    const el = $(section);
    const versionText = el.find("h2, h3, .filebaseVersionTitle, .contentTitle").first().text().trim();
    const versionMatch = versionText.match(/(\d+\.\d+[\.\d]*)/);
    if (!versionMatch) return;

    const version = versionMatch[1];

    // Datum
    let datum = "";
    el.find("time, .datetime, .filebaseVersionDate").each((_, timeEl) => {
      const d = $(timeEl).attr("datetime") || $(timeEl).text().trim();
      if (d && !datum) datum = d;
    });

    // Downloads
    let downloads: number | undefined;
    el.find("dd, .counter, span").each((_, dd) => {
      const text = $(dd).text().trim();
      const dlMatch = text.match(/(\d[\d.]*)\s*(Downloads?|Herunterlad)/i);
      if (dlMatch && !downloads) {
        downloads = parseInt(dlMatch[1].replace(/\./g, ""));
      }
    });

    // Änderungen
    const aenderungen: string[] = [];
    el.find(".filebaseVersionChangelog li, .messageBody li, ul li").each((_, li) => {
      const text = $(li).text().trim();
      if (text.length > 3) aenderungen.push(text);
    });

    // Fallback: Beschreibungstext
    if (aenderungen.length === 0) {
      const desc = el.find(".filebaseVersionChangelog, .messageBody, p").first().text().trim();
      if (desc.length > 10) {
        desc.split(/[•\n]/).forEach((line) => {
          const trimmed = line.trim();
          if (trimmed.length > 5) aenderungen.push(trimmed);
        });
      }
    }

    if (aenderungen.length === 0) {
      aenderungen.push(version === "1.0.0.0" || version === "1.0.0" ? "Erstveröffentlichung" : "Update");
    }

    entries.push({ version, datum, downloads, aenderungen });
  });

  // Fallback: Wenn keine Versionen gefunden, suche im gesamten Text
  if (entries.length === 0) {
    const text = $("body").text();
    const versionMatches = text.matchAll(/Version\s*(\d+\.\d+[\.\d]*)/gi);
    for (const match of versionMatches) {
      const v = match[1];
      if (!entries.some((e) => e.version === v)) {
        entries.push({
          version: v,
          datum: "",
          aenderungen: [v === "1.0.0.0" || v === "1.0.0" ? "Erstveröffentlichung" : "Update"],
        });
      }
    }
  }

  return entries.sort((a, b) => b.version.localeCompare(a.version));
}

function parseFarmingSimulatorChangelog(html: string): ChangelogEntry[] {
  const $ = cheerio.load(html);
  const entries: ChangelogEntry[] = [];

  // Version aus den Metadaten
  let currentVersion = "";
  $("dt, th, td, .label, span").each((_, el) => {
    const label = $(el).text().trim().toLowerCase();
    const value = $(el).next().text().trim();
    if (label.includes("version") && /\d+\.\d+/.test(value) && !currentVersion) {
      currentVersion = value;
    }
  });

  if (currentVersion) {
    // ModHub zeigt nur die aktuelle Version, kein History
    entries.push({
      version: currentVersion,
      datum: "",
      aenderungen: ["Aktuelle Version auf ModHub"],
    });
  }

  return entries;
}

async function main() {
  console.log("\n📋 LS-Karten Changelog-Crawler\n");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase.from("karten").select("id, slug, name, quell_url, version, changelog") as any;
  if (slugFilter) query = query.eq("slug", slugFilter);
  query = query.not("quell_url", "is", null).order("name");

  const { data: karten } = await query;
  if (!karten || karten.length === 0) {
    console.log("Keine Karten mit Quell-URL gefunden.");
    return;
  }

  console.log(`${karten.length} Karten zu prüfen.\n`);
  let updated = 0;

  for (const karte of karten) {
    const url = karte.quell_url;
    const hostname = new URL(url).hostname;

    console.log(`🔎 ${karte.name} (${hostname})...`);

    try {
      const html = await fetchPage(url);
      let changelog: ChangelogEntry[];

      if (hostname.includes("forbidden-mods")) {
        changelog = parseForbiddenModsChangelog(html);
      } else if (hostname.includes("farming-simulator")) {
        changelog = parseFarmingSimulatorChangelog(html);
      } else {
        console.log("  ⚠ Unbekannte Quelle, überspringe");
        continue;
      }

      if (changelog.length > 0) {
        const existing = karte.changelog || [];
        const isNew = JSON.stringify(changelog) !== JSON.stringify(existing);

        if (isNew) {
          await supabase.from("karten").update({ changelog }).eq("id", karte.id);
          console.log(`  ✓ ${changelog.length} Version(en) gespeichert`);
          changelog.forEach((e) => console.log(`    v${e.version}: ${e.aenderungen[0]}`));
          updated++;
        } else {
          console.log(`  — Keine Änderungen`);
        }
      } else {
        console.log("  — Kein Changelog gefunden");
      }

      await new Promise((r) => setTimeout(r, 1000));
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
