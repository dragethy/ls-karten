-- Fehlende Spalten für Agent-Import ergänzen
ALTER TABLE public.karten ADD COLUMN IF NOT EXISTS version text DEFAULT '1.0.0';
ALTER TABLE public.karten ADD COLUMN IF NOT EXISTS preview_url text;
ALTER TABLE public.karten ADD COLUMN IF NOT EXISTS precision_farming boolean DEFAULT false;
ALTER TABLE public.karten ADD COLUMN IF NOT EXISTS fakten jsonb DEFAULT '{}';
