import type { ÄnderungsBericht } from "./types.js";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const GRAY = "\x1b[90m";
const CYAN = "\x1b[36m";

export function formatBericht(berichte: ÄnderungsBericht[]): string {
  const lines: string[] = [];

  lines.push("");
  lines.push(`${BOLD}${CYAN}═══ LS-Karten Crawl-Bericht ═══${RESET}`);
  lines.push(`${GRAY}${new Date().toLocaleString("de-DE")}${RESET}`);
  lines.push("");

  let hatÄnderungen = false;

  for (const bericht of berichte) {
    const prefix = bericht.fehler
      ? `${RED}✗${RESET}`
      : bericht.änderungen.length > 0
      ? `${YELLOW}●${RESET}`
      : `${GREEN}✓${RESET}`;

    lines.push(`${prefix} ${BOLD}${bericht.name}${RESET} ${GRAY}(${bericht.quelle})${RESET}`);

    if (bericht.fehler) {
      lines.push(`  ${RED}Fehler: ${bericht.fehler}${RESET}`);
      lines.push("");
      continue;
    }

    if (bericht.änderungen.length > 0) {
      hatÄnderungen = true;
      for (const ä of bericht.änderungen) {
        lines.push(`  ${YELLOW}↻ ${ä.feld}:${RESET} ${RED}${ä.alt}${RESET} → ${GREEN}${ä.neu}${RESET}`);
      }
    } else {
      lines.push(`  ${GREEN}Keine Änderungen${RESET}`);
    }

    // Info-Felder (Downloads, Dateigröße)
    const infoEntries = Object.entries(bericht.info);
    if (infoEntries.length > 0) {
      const infoStr = infoEntries.map(([k, v]) => `${k}: ${v}`).join(" | ");
      lines.push(`  ${GRAY}ℹ ${infoStr}${RESET}`);
    }

    lines.push("");
  }

  // Zusammenfassung
  const total = berichte.length;
  const fehler = berichte.filter((b) => b.fehler).length;
  const geändert = berichte.filter((b) => b.änderungen.length > 0).length;
  const aktuell = total - fehler - geändert;

  lines.push(`${BOLD}Zusammenfassung:${RESET} ${total} Karten geprüft`);
  if (aktuell > 0) lines.push(`  ${GREEN}✓ ${aktuell} aktuell${RESET}`);
  if (geändert > 0) lines.push(`  ${YELLOW}● ${geändert} mit Änderungen${RESET}`);
  if (fehler > 0) lines.push(`  ${RED}✗ ${fehler} Fehler${RESET}`);
  lines.push("");

  return lines.join("\n");
}

export function formatJSON(berichte: ÄnderungsBericht[]): string {
  return JSON.stringify(berichte, null, 2);
}
