import { scrapeAllPages } from "./scraper.js";
import type { ModHubEntry } from "./types.js";

const args = process.argv.slice(2);
const jsonMode = args.includes("--json");
const filterArg = args.find((a) => a.startsWith("--filter="))?.split("=")[1]
  || (args.includes("--filter") ? args[args.indexOf("--filter") + 1] : undefined);

const FILTERS = filterArg
  ? [filterArg]
  : ["mapEurope", "mapNorthAmerica", "mapSouthAmerica", "mapOthers"];

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";
const GRAY = "\x1b[90m";
const YELLOW = "\x1b[33m";

async function main() {
  if (!jsonMode) {
    console.log(`\n${BOLD}${CYAN}═══ LS-Karten ModHub Discovery ═══${RESET}`);
    console.log(`${GRAY}Filter: ${FILTERS.join(", ")}${RESET}\n`);
  }

  const allMaps: ModHubEntry[] = [];
  const seenIds = new Set<string>();

  for (const filter of FILTERS) {
    if (!jsonMode) console.log(`${BOLD}📂 ${filter}${RESET}`);

    const entries = await scrapeAllPages(filter);

    for (const entry of entries) {
      if (!seenIds.has(entry.mod_id)) {
        seenIds.add(entry.mod_id);
        allMaps.push(entry);
      }
    }

    if (!jsonMode) console.log(`  → ${entries.length} Karten\n`);

    await new Promise((r) => setTimeout(r, 1500));
  }

  // Ausgabe
  if (jsonMode) {
    console.log(JSON.stringify(allMaps, null, 2));
  } else {
    console.log(`${BOLD}Gefundene Karten: ${allMaps.length}${RESET}\n`);

    // Top 10 nach Bewertung
    const sorted = [...allMaps].sort((a, b) => b.bewertung - a.bewertung);

    console.log(`${BOLD}Top 20 nach Bewertung:${RESET}`);
    for (const map of sorted.slice(0, 20)) {
      const rating = map.bewertung > 0 ? `${YELLOW}★ ${map.bewertung}${RESET}` : `${GRAY}keine Bewertung${RESET}`;
      console.log(`  ${GREEN}•${RESET} ${map.name} ${GRAY}von${RESET} ${map.autor} ${rating}`);
      console.log(`    ${GRAY}${map.detail_url}${RESET}`);
    }

    console.log(`\n${BOLD}Zusammenfassung:${RESET} ${allMaps.length} Karten auf dem ModHub gefunden`);
    console.log(`${GRAY}Nutze 'npm run agent -- --url <detail_url> --slug <name>' um eine Karte zu importieren${RESET}\n`);
  }
}

main().catch((error) => {
  console.error("Fehler:", error);
  process.exit(1);
});
