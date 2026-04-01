import { createClient } from "@/lib/supabase/server";
import { DEMO_KARTEN } from "@/lib/demo-data";
import type { Karte } from "@/types/karte";

function mapDbRowToKarte(row: Record<string, unknown>): Karte {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    beschreibung: String(row.beschreibung || ""),
    autor: String(row.autor || ""),
    version: String(row.version || "1.0.0"),
    groesse: (row.groesse as Karte["groesse"]) || "2x",
    preview_url: (row.preview_url as string) || null,
    minimap_url: (row.minimap_url as string) || null,
    screenshots: (row.screenshots as string[]) || [],
    fruechte: (row.fruechte as string[]) || [],
    produktionen: (row.produktionen as Karte["produktionen"]) || [],
    pois: (row.pois as Karte["pois"]) || [],
    download_url: (row.download_url as string) || null,
    quell_url: (row.quell_url as string) || null,
    erstellt_am: String(row.erstellt_am),
    aktualisiert_am: String(row.aktualisiert_am),
    precision_farming: Boolean(row.precision_farming),
    fakten: (row.fakten as Karte["fakten"]) || {},
    durchschnitt_bewertung: row.durchschnitt_bewertung as number | undefined,
    anzahl_bewertungen: row.anzahl_bewertungen as number | undefined,
  };
}

export async function getAlleKarten(): Promise<Karte[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("karten")
      .select("*")
      .order("aktualisiert_am", { ascending: false });

    if (error || !data || data.length === 0) {
      return DEMO_KARTEN;
    }

    return data.map(mapDbRowToKarte);
  } catch {
    return DEMO_KARTEN;
  }
}

export async function getKarteBySlug(slug: string): Promise<Karte | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("karten")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return DEMO_KARTEN.find((k) => k.slug === slug) || null;
    }

    return mapDbRowToKarte(data);
  } catch {
    return DEMO_KARTEN.find((k) => k.slug === slug) || null;
  }
}

export async function getTopKarten(limit = 3): Promise<Karte[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("karten")
      .select("*")
      .order("aktualisiert_am", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return DEMO_KARTEN.slice(0, limit);
    }

    return data.map(mapDbRowToKarte);
  } catch {
    return DEMO_KARTEN.slice(0, limit);
  }
}
