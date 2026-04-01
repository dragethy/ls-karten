import { readFileSync, existsSync } from "fs";
import path from "path";
import { getParser } from "./parsers/index.js";
import { vergleiche } from "./vergleich.js";
import { formatBericht, formatJSON } from "./bericht.js";
import type { ÄnderungsBericht } from "./types.js";

// .env.local laden
const envPath = path.resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
  }
}

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const slugFilter = args.find((a) => a.startsWith("--slug="))?.split("=")[1]
  || (args.includes("--slug") ? args[args.indexOf("--slug") + 1] : undefined);

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "LS-Karten.de Crawler/1.0 (Karten-Update-Check)",
      "Accept": "text/html",
      "Accept-Language": "de-DE,de;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.text();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loadKarten() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Fallback auf Demo-Daten
    const { DEMO_KARTEN } = await import("../../src/lib/demo-data.js");
    return DEMO_KARTEN.filter((k) => k.quell_url !== null);
  }
  const sb = createClient(url, key, { auth: { persistSession: false } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from("karten") as any)
    .select("slug, name, version, beschreibung, quell_url, aktualisiert_am")
    .not("quell_url", "is", null)
    .order("name");
  return data || [];
}

async function main() {
  let karten = await loadKarten();

  if (slugFilter) {
    karten = karten.filter((k: any) => k.slug === slugFilter);
    if (karten.length === 0) {
      console.error(`Keine Karte mit slug "${slugFilter}" und quell_url gefunden.`);
      process.exit(1);
    }
  }

  if (karten.length === 0) {
    console.log("Keine Karten mit quell_url vorhanden.");
    process.exit(0);
  }

  if (!jsonMode) {
    console.log(`\nCrawle ${karten.length} Karte(n)...\n`);
  }

  const berichte: ÄnderungsBericht[] = [];

  for (let i = 0; i < karten.length; i++) {
    const karte = karten[i];
    const quellUrl = karte.quell_url!;

    try {
      const { parser, hostname } = getParser(quellUrl);

      if (!jsonMode) {
        process.stdout.write(`  → ${karte.name} (${hostname})...`);
      }

      const html = await fetchHTML(quellUrl);
      const daten = parser(html);
      const änderungen = vergleiche(
        {
          version: karte.version,
          beschreibung: karte.beschreibung,
          aktualisiert_am: karte.aktualisiert_am,
        },
        daten
      );

      const info: Record<string, string> = {};
      if (daten.downloads) info["Downloads"] = daten.downloads.toLocaleString("de-DE");
      if (daten.dateigroesse) info["Dateigröße"] = daten.dateigroesse;
      if (daten.version) info["Version (Quelle)"] = daten.version;

      berichte.push({
        slug: karte.slug,
        name: karte.name,
        quelle: hostname,
        änderungen,
        info,
      });

      if (!jsonMode) {
        console.log(änderungen.length > 0 ? " Änderungen gefunden!" : " ✓");
      }
    } catch (error) {
      const fehlerMsg = error instanceof Error ? error.message : String(error);

      berichte.push({
        slug: karte.slug,
        name: karte.name,
        quelle: quellUrl,
        änderungen: [],
        info: {},
        fehler: fehlerMsg,
      });

      if (!jsonMode) {
        console.log(` Fehler: ${fehlerMsg}`);
      }
    }

    // Pause zwischen Requests
    if (i < karten.length - 1) {
      await sleep(1000);
    }
  }

  // Ausgabe
  if (jsonMode) {
    console.log(formatJSON(berichte));
  } else {
    console.log(formatBericht(berichte));
  }

  // Exit code: 1 wenn Änderungen, 0 wenn alles aktuell
  const hatÄnderungen = berichte.some((b) => b.änderungen.length > 0);
  process.exit(hatÄnderungen ? 1 : 0);
}

main().catch((error) => {
  console.error("Kritischer Fehler:", error);
  process.exit(2);
});
