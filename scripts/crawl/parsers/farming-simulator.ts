import * as cheerio from "cheerio";
import type { ExtrahierteDaten } from "../types.js";

export function parseFarmingSimulator(html: string): ExtrahierteDaten {
  const $ = cheerio.load(html);
  const result: ExtrahierteDaten = {};

  // Version - meist im Info-Bereich
  $(".table-striped td, .mod-detail td, dd").each((_, el) => {
    const text = $(el).text().trim();
    if (/^\d+\.\d+\.\d+/.test(text) && !result.version) {
      result.version = text;
    }
  });

  // Alternativ: Version aus dem Seitentitel oder Beschreibung
  if (!result.version) {
    const title = $("h1, .mod-title, title").first().text();
    const vMatch = title.match(/(\d+\.\d+\.\d+[\.\d]*)/);
    if (vMatch) result.version = vMatch[1];
  }

  // Beschreibung
  const descEl = $(".mod-description, .content-description, .mod-detail-description");
  if (descEl.length) {
    result.beschreibung = descEl.first().text().trim().slice(0, 500);
  }

  // Downloads und andere Metadaten aus Tabellen/Listen
  $("dt, th, .label, td").each((_, el) => {
    const label = $(el).text().trim().toLowerCase();
    const valueEl = $(el).next();
    const value = valueEl.text().trim();

    if (label.includes("version") && !result.version && /\d+\.\d+/.test(value)) {
      result.version = value;
    }
    if (label.includes("download") && !result.downloads) {
      const num = value.replace(/[^\d]/g, "");
      if (num) result.downloads = parseInt(num);
    }
    if ((label.includes("update") || label.includes("änder") || label.includes("aktualisier")) && !result.aktualisiert_am) {
      result.aktualisiert_am = value;
    }
    if ((label.includes("größe") || label.includes("size") || label.includes("groesse")) && !result.dateigroesse) {
      result.dateigroesse = value;
    }
  });

  // Dateigröße aus dem gesamten Text suchen
  if (!result.dateigroesse) {
    const sizeMatch = html.match(/(\d[\d.,]+)\s*(MB|GB|KB)/i);
    if (sizeMatch) result.dateigroesse = `${sizeMatch[1]} ${sizeMatch[2]}`;
  }

  return result;
}
