import * as cheerio from "cheerio";
import type { ExtrahierteDaten } from "../types.js";

export function parseForbiddenMods(html: string): ExtrahierteDaten {
  const $ = cheerio.load(html);
  const result: ExtrahierteDaten = {};

  // Version - im Sidebar-Info-Bereich oder Dateidetails
  $("dt, .filebaseFileProperty dt, th").each((_, el) => {
    const label = $(el).text().trim().toLowerCase();
    const valueEl = $(el).next("dd, td");
    const value = valueEl.text().trim();

    if (label.includes("version") && !result.version) {
      result.version = value;
    }
    if (label.includes("download") && !result.downloads) {
      const num = value.replace(/[^\d]/g, "");
      if (num) result.downloads = parseInt(num);
    }
    if ((label.includes("aktualisier") || label.includes("update") || label.includes("änder")) && !result.aktualisiert_am) {
      result.aktualisiert_am = value;
    }
    if ((label.includes("größe") || label.includes("dateigröße") || label.includes("groesse")) && !result.dateigroesse) {
      result.dateigroesse = value;
    }
  });

  // Beschreibung aus dem Hauptinhalt
  const descEl = $(".filebaseFileContent, .messageBody, .filebaseFileDescription, article");
  if (descEl.length) {
    result.beschreibung = descEl.first().text().trim().slice(0, 500);
  }

  // Fallback: Version aus dem Titel
  if (!result.version) {
    const title = $("h1, .contentTitle, title").first().text();
    const vMatch = title.match(/(\d+\.\d+[\.\d]*)/);
    if (vMatch) result.version = vMatch[1];
  }

  // Fallback: Downloads aus Statistik-Bereich
  if (!result.downloads) {
    $("li, span, .counter").each((_, el) => {
      const text = $(el).text().trim();
      const match = text.match(/([\d.]+)\s*(Downloads?|Herunterlad)/i);
      if (match && !result.downloads) {
        result.downloads = parseInt(match[1].replace(/\./g, ""));
      }
    });
  }

  return result;
}
