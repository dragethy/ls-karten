import { createClient } from "@/lib/supabase/server";
import type { AdminStats, AuditEintrag, BewertungMitDetails, BenutzerMitEmail } from "@/types/admin";

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient();
  const eineWocheHer = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [karten, benutzer, bewertungen, kartenNeu, bewertungenNeu] = await Promise.all([
    supabase.from("karten").select("id", { count: "exact", head: true }),
    supabase.from("profile").select("id", { count: "exact", head: true }),
    supabase.from("bewertungen").select("id", { count: "exact", head: true }),
    supabase.from("karten").select("id", { count: "exact", head: true }).gte("erstellt_am", eineWocheHer),
    supabase.from("bewertungen").select("id", { count: "exact", head: true }).gte("erstellt_am", eineWocheHer),
  ]);

  return {
    kartenGesamt: karten.count || 0,
    benutzerGesamt: benutzer.count || 0,
    bewertungenGesamt: bewertungen.count || 0,
    kartenNeueWoche: kartenNeu.count || 0,
    bewertungenNeueWoche: bewertungenNeu.count || 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getAlleKartenAdmin(): Promise<any[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("karten")
    .select("id, slug, name, autor, version, groesse, precision_farming, preview_url, erstellt_am, aktualisiert_am")
    .order("aktualisiert_am", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAlleBenutzer(): Promise<BenutzerMitEmail[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile")
    .select("id, username, avatar_url, rolle")
    .order("username");

  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((p: any) => ({
    id: p.id,
    username: p.username,
    avatar_url: p.avatar_url,
    rolle: (p.rolle || "user") as BenutzerMitEmail["rolle"],
    email: "",
    erstellt_am: "",
  }));
}

export async function getAlleBewertungenAdmin(): Promise<BewertungMitDetails[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bewertungen")
    .select("id, karte_id, user_id, sterne, kommentar, erstellt_am")
    .order("erstellt_am", { ascending: false });

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((b: any) => ({
    id: b.id,
    karte_id: b.karte_id,
    karte_name: "",
    karte_slug: "",
    user_id: b.user_id,
    username: "",
    sterne: b.sterne,
    kommentar: b.kommentar,
    erstellt_am: b.erstellt_am,
  }));
}

export async function getAuditLog(limit = 50): Promise<AuditEintrag[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from("audit_log") as any)
    .select("id, user_id, aktion, ziel_typ, ziel_id, details, erstellt_am")
    .order("erstellt_am", { ascending: false })
    .limit(limit);

  if (error) throw error;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((e: any) => ({
    id: e.id,
    user_id: e.user_id,
    username: "System",
    aktion: e.aktion as AuditEintrag["aktion"],
    ziel_typ: e.ziel_typ,
    ziel_id: e.ziel_id,
    details: (e.details || {}) as Record<string, unknown>,
    erstellt_am: e.erstellt_am,
  }));
}
