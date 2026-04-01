"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { Rolle } from "@/types/admin";

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [rolle, setRolle] = useState<Rolle | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRolle(null);
      setLoading(false);
      return;
    }

    const fetchRolle = async () => {
      const { data } = await supabase
        .from("profile")
        .select("rolle")
        .eq("id", user.id)
        .single();

      const rolle = (data as unknown as { rolle?: string })?.rolle;
      setRolle((rolle as Rolle) || "user");
      setLoading(false);
    };

    fetchRolle();
  }, [user, authLoading, supabase]);

  return {
    rolle,
    loading: authLoading || loading,
    istAdmin: rolle === "admin",
    istModerator: rolle === "moderator" || rolle === "admin",
  };
}
