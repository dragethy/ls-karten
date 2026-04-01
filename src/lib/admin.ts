import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Rolle } from "@/types/admin";

export async function getCurrentUserRolle(): Promise<Rolle | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profile")
    .select("rolle")
    .eq("id", user.id)
    .single();

  return ((data as unknown as { rolle?: string })?.rolle as Rolle) || null;
}

export async function requireAdmin() {
  const rolle = await getCurrentUserRolle();
  if (rolle !== "admin") {
    redirect("/");
  }
}

export async function requireModeratorOrAdmin() {
  const rolle = await getCurrentUserRolle();
  if (rolle !== "admin" && rolle !== "moderator") {
    redirect("/");
  }
}
