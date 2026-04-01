import * as cheerio from "cheerio";
import type { ModHubEntry } from "./types.js";

const BASE_URL = "https://www.farming-simulator.com";

export async function scrapeModHubPage(filter: string, page: number): Promise<ModHubEntry[]> {
  const url = `${BASE_URL}/mods.php?title=fs2025&filter=${filter}&page=${page}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "LS-Karten.de Discover/1.0",
      "Accept": "text/html",
      "Accept-Language": "de-DE,de;q=0.9",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} für ${url}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const entries: ModHubEntry[] = [];

  // Mod-Links mit mod_id extrahieren
  $('a[href*="mod.php?mod_id="]').each((_, el) => {
    const href = $(el).attr("href") || "";
    const modIdMatch = href.match(/mod_id=(\d+)/);
    if (!modIdMatch) return;

    const mod_id = modIdMatch[1];

    // Duplikate vermeiden
    if (entries.some((e) => e.mod_id === mod_id)) return;

    const name = $(el).find("h4, h3, .title, strong").first().text().trim()
      || $(el).text().trim().split("\n")[0].trim();

    if (!name || name.length < 3) return;

    const img = $(el).find("img").first();
    const bild_url = img.attr("src") || null;

    // Autor und Bewertung aus dem Eltern-Container
    const container = $(el).closest(".mod-item, .list-item, div");
    const autorText = container.text();
    const autorMatch = autorText.match(/By:\s*(.+?)(?:\n|$)/i);
    const autor = autorMatch ? autorMatch[1].trim() : "";

    const bewertungMatch = autorText.match(/(\d+\.?\d*)\s*\(/);
    const bewertung = bewertungMatch ? parseFloat(bewertungMatch[1]) : 0;

    entries.push({
      mod_id,
      name,
      autor,
      bewertung,
      detail_url: `${BASE_URL}/${href}`,
      bild_url,
    });
  });

  return entries;
}

export async function scrapeAllPages(filter: string, maxPages = 6): Promise<ModHubEntry[]> {
  const allEntries: ModHubEntry[] = [];
  const seenIds = new Set<string>();

  for (let page = 0; page < maxPages; page++) {
    try {
      const entries = await scrapeModHubPage(filter, page);
      if (entries.length === 0) break;

      for (const entry of entries) {
        if (!seenIds.has(entry.mod_id)) {
          seenIds.add(entry.mod_id);
          allEntries.push(entry);
        }
      }

      console.log(`  Seite ${page + 1}: ${entries.length} Karten gefunden`);

      // Pause
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.warn(`  Seite ${page + 1}: Fehler - ${error}`);
      break;
    }
  }

  return allEntries;
}
