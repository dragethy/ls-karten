import { supabaseAdmin } from "../lib/supabase-admin.js";
import type { AgentResult } from "./types.js";

export async function upsertKarte(result: AgentResult, downloadUrl: string | null, quellUrl: string | null) {
  console.log("  Schreibe in Datenbank...");

  const row = {
    slug: result.slug,
    name: result.name,
    beschreibung: result.beschreibung,
    autor: result.autor,
    version: result.version,
    groesse: result.groesse,
    preview_url: result.preview_url,
    minimap_url: result.minimap_url,
    screenshots: [],
    fruechte: result.fruechte,
    produktionen: result.produktionen,
    pois: result.pois,
    download_url: downloadUrl,
    quell_url: quellUrl,
    precision_farming: result.precision_farming,
    fakten: result.fakten,
  };

  const { error } = await supabaseAdmin
    .from("karten")
    .upsert(row, { onConflict: "slug" });

  if (error) {
    throw new Error(`DB-Fehler: ${error.message}`);
  }

  console.log(`  ✓ Karte "${result.name}" in DB geschrieben (slug: ${result.slug})`);
}
