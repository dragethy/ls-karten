"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireModeratorOrAdmin } from "@/lib/admin";

async function logAudit(aktion: string, zielTyp: string, zielId: string | null, details: Record<string, unknown> = {}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("audit_log") as any).insert({
    user_id: user.id,
    aktion,
    ziel_typ: zielTyp,
    ziel_id: zielId,
    details,
  });
}

export async function updateKarte(id: string, data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("karten") as any).update(data).eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit("karte.bearbeitet", "karte", id, { geändert: Object.keys(data) });
  revalidatePath("/admin/karten");
  revalidatePath("/karten");
}

export async function deleteKarte(id: string) {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: karte } = await (supabase.from("karten") as any).select("name, slug").eq("id", id).single();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("karten") as any).delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit("karte.gelöscht", "karte", id, { name: karte?.name, slug: karte?.slug });
  revalidatePath("/admin/karten");
  revalidatePath("/karten");
}

export async function createKarte(data: Record<string, unknown>) {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: karte, error } = await (supabase.from("karten") as any).insert(data).select("id").single();
  if (error) throw new Error(error.message);

  await logAudit("karte.erstellt", "karte", karte?.id, { slug: data.slug });
  revalidatePath("/admin/karten");
  revalidatePath("/karten");
  return karte?.id;
}

export async function updateBenutzerRolle(userId: string, rolle: string) {
  await requireAdmin();
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("profile") as any).update({ rolle }).eq("id", userId);
  if (error) throw new Error(error.message);

  await logAudit("benutzer.rolle_geändert", "benutzer", userId, { rolle });
  revalidatePath("/admin/benutzer");
}

export async function deleteBewertung(id: string) {
  await requireModeratorOrAdmin();
  const supabase = await createClient();

  const { data: bewertung } = await supabase.from("bewertungen").select("karte_id, user_id, sterne").eq("id", id).single();
  const { error } = await supabase.from("bewertungen").delete().eq("id", id);
  if (error) throw new Error(error.message);

  await logAudit("bewertung.gelöscht", "bewertung", id, bewertung || {});
  revalidatePath("/admin/bewertungen");
}
