-- =============================================
-- Admin-System: Rollen, Audit-Log, RLS-Policies
-- =============================================

-- 1. Rolle zu Profil hinzufügen
ALTER TABLE public.profile
  ADD COLUMN IF NOT EXISTS rolle text NOT NULL DEFAULT 'user'
  CHECK (rolle IN ('user', 'moderator', 'admin'));

CREATE INDEX IF NOT EXISTS idx_profile_rolle ON public.profile (rolle);

-- 2. Audit-Log Tabelle
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  aktion text NOT NULL,
  ziel_typ text NOT NULL,
  ziel_id text,
  details jsonb DEFAULT '{}',
  erstellt_am timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user ON public.audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_aktion ON public.audit_log (aktion);
CREATE INDEX IF NOT EXISTS idx_audit_log_zeit ON public.audit_log (erstellt_am DESC);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- 3. Admin-Einstellungen Tabelle (für Phase 2)
CREATE TABLE IF NOT EXISTS public.admin_einstellungen (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  schluessel text UNIQUE NOT NULL,
  wert jsonb NOT NULL DEFAULT '{}',
  aktualisiert_am timestamptz DEFAULT now(),
  aktualisiert_von uuid REFERENCES auth.users
);

ALTER TABLE public.admin_einstellungen ENABLE ROW LEVEL SECURITY;

-- 4. Helper-Funktionen für RLS
CREATE OR REPLACE FUNCTION public.ist_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profile
    WHERE id = auth.uid() AND rolle = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION public.ist_moderator_oder_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profile
    WHERE id = auth.uid() AND rolle IN ('admin', 'moderator')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 5. RLS-Policies für Karten (Admin CRUD)
CREATE POLICY "Admin kann Karten erstellen" ON public.karten
  FOR INSERT WITH CHECK (public.ist_admin());

CREATE POLICY "Admin kann Karten bearbeiten" ON public.karten
  FOR UPDATE USING (public.ist_admin());

CREATE POLICY "Admin kann Karten löschen" ON public.karten
  FOR DELETE USING (public.ist_admin());

-- 6. RLS-Policies für Bewertungen (Moderator kann löschen)
CREATE POLICY "Moderator kann Bewertungen löschen" ON public.bewertungen
  FOR DELETE USING (public.ist_moderator_oder_admin());

-- 7. RLS-Policies für Profile (Admin kann Rollen ändern)
CREATE POLICY "Admin kann Profile bearbeiten" ON public.profile
  FOR UPDATE USING (public.ist_admin());

-- 8. RLS-Policies für Audit-Log
CREATE POLICY "Admin kann Audit-Log lesen" ON public.audit_log
  FOR SELECT USING (public.ist_admin());

CREATE POLICY "Moderator kann Audit-Log schreiben" ON public.audit_log
  FOR INSERT WITH CHECK (public.ist_moderator_oder_admin());

-- 9. RLS-Policies für Admin-Einstellungen
CREATE POLICY "Admin hat vollen Zugriff auf Einstellungen" ON public.admin_einstellungen
  FOR ALL USING (public.ist_admin());
