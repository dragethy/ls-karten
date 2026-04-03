-- Changelog pro Karte speichern
ALTER TABLE public.karten ADD COLUMN IF NOT EXISTS changelog jsonb DEFAULT '[]';
