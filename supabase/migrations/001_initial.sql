-- Karten Tabelle
create table public.karten (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  name text not null,
  beschreibung text not null default '',
  autor text not null default 'Unbekannt',
  groesse text not null default '1x',
  minimap_url text,
  screenshots text[] default '{}',
  fruechte text[] default '{}',
  produktionen jsonb default '[]',
  pois jsonb default '[]',
  download_url text,
  erstellt_am timestamptz default now(),
  aktualisiert_am timestamptz default now()
);

-- Profil Tabelle
create table public.profile (
  id uuid references auth.users on delete cascade primary key,
  username text not null,
  avatar_url text
);

-- Bewertungen Tabelle
create table public.bewertungen (
  id uuid default gen_random_uuid() primary key,
  karte_id uuid references public.karten on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  sterne integer not null check (sterne >= 1 and sterne <= 5),
  kommentar text not null default '',
  erstellt_am timestamptz default now(),
  unique(karte_id, user_id)
);

-- Indices
create index idx_karten_slug on public.karten (slug);
create index idx_bewertungen_karte on public.bewertungen (karte_id);
create index idx_bewertungen_user on public.bewertungen (user_id);

-- RLS aktivieren
alter table public.karten enable row level security;
alter table public.profile enable row level security;
alter table public.bewertungen enable row level security;

-- Karten: Jeder kann lesen
create policy "Karten sind oeffentlich lesbar" on public.karten
  for select using (true);

-- Profile: Jeder kann lesen, Nutzer kann eigenes Profil bearbeiten
create policy "Profile sind oeffentlich lesbar" on public.profile
  for select using (true);

create policy "Nutzer kann eigenes Profil bearbeiten" on public.profile
  for update using (auth.uid() = id);

create policy "Nutzer kann eigenes Profil erstellen" on public.profile
  for insert with check (auth.uid() = id);

-- Bewertungen: Jeder kann lesen, Authentifizierte koennen erstellen/bearbeiten
create policy "Bewertungen sind oeffentlich lesbar" on public.bewertungen
  for select using (true);

create policy "Authentifizierte koennen bewerten" on public.bewertungen
  for insert with check (auth.uid() = user_id);

create policy "Nutzer kann eigene Bewertung bearbeiten" on public.bewertungen
  for update using (auth.uid() = user_id);

create policy "Nutzer kann eigene Bewertung loeschen" on public.bewertungen
  for delete using (auth.uid() = user_id);

-- Trigger: aktualisiert_am automatisch setzen
create or replace function update_aktualisiert_am()
returns trigger as $$
begin
  new.aktualisiert_am = now();
  return new;
end;
$$ language plpgsql;

create trigger karten_aktualisiert_am
  before update on public.karten
  for each row execute function update_aktualisiert_am();

-- Trigger: Profil automatisch bei Registrierung erstellen
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profile (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Demo-Daten
insert into public.karten (slug, name, beschreibung, autor, groesse, fruechte, produktionen, pois) values
(
  'hof-bergmann',
  'Hof Bergmann',
  'Eine detailreiche deutsche Karte mit vielen Produktionen und abwechslungsreichem Gelaende. Perfekt fuer Spieler die eine realistische Landwirtschaftserfahrung suchen.',
  'BergmannModding',
  '4x',
  '{"Weizen", "Gerste", "Raps", "Mais", "Kartoffeln", "Zuckerrueben", "Hafer", "Sonnenblumen", "Gras", "Luzerne"}',
  '[{"name": "Muehle", "eingabe": ["Weizen", "Gerste"], "ausgabe": ["Mehl"], "beschreibung": "Getreide zu Mehl verarbeiten"}, {"name": "Baeckerei", "eingabe": ["Mehl", "Zucker"], "ausgabe": ["Brot", "Kuchen"], "beschreibung": "Backwaren herstellen"}, {"name": "Molkerei", "eingabe": ["Milch"], "ausgabe": ["Butter", "Kaese"], "beschreibung": "Milchprodukte herstellen"}]',
  '[{"id": "hof1", "name": "Haupthof", "typ": "hof", "x": 50, "y": 50}, {"id": "vs1", "name": "BGA", "typ": "verkaufsstelle", "x": 30, "y": 70}, {"id": "prod1", "name": "Muehle", "typ": "produktion", "x": 65, "y": 40}]'
),
(
  'elmcreek-reloaded',
  'Elmcreek Reloaded',
  'Eine erweiterte Version der beliebten Elmcreek Karte mit zusaetzlichen Feldern, Produktionen und verbesserten Details.',
  'MapModders',
  '2x',
  '{"Weizen", "Gerste", "Mais", "Sojabohnen", "Baumwolle", "Sonnenblumen", "Gras"}',
  '[{"name": "Oelmuehle", "eingabe": ["Sonnenblumen", "Raps"], "ausgabe": ["Oel"], "beschreibung": "Pflanzenoel pressen"}, {"name": "Futtermischanlage", "eingabe": ["Weizen", "Gerste", "Mais"], "ausgabe": ["Mischfutter"], "beschreibung": "Tierfutter mischen"}]',
  '[{"id": "hof1", "name": "Farm", "typ": "hof", "x": 45, "y": 55}, {"id": "ts1", "name": "Tankstelle", "typ": "tankstelle", "x": 60, "y": 30}]'
),
(
  'norddeutschland',
  'Norddeutschland',
  'Eine riesige norddeutsche Marschlandschaft mit weitlaeufigen Feldern und authentischem Flair. Ideal fuer Grossbetriebe.',
  'NordModding',
  '8x',
  '{"Weizen", "Gerste", "Raps", "Kartoffeln", "Zuckerrueben", "Mais", "Gras", "Klee", "Hafer"}',
  '[{"name": "Zuckerfabrik", "eingabe": ["Zuckerrueben"], "ausgabe": ["Zucker"], "beschreibung": "Zucker aus Zuckerrueben gewinnen"}, {"name": "Staerkefabrik", "eingabe": ["Kartoffeln"], "ausgabe": ["Staerke"], "beschreibung": "Kartoffelstaerke produzieren"}]',
  '[{"id": "hof1", "name": "Gutshof", "typ": "hof", "x": 35, "y": 45}, {"id": "ws1", "name": "Werkstatt", "typ": "werkstatt", "x": 50, "y": 60}, {"id": "hd1", "name": "Landhandel", "typ": "haendler", "x": 70, "y": 35}]'
),
(
  'suedliches-bayern',
  'Suedliches Bayern',
  'Malerische bayerische Alpenlandschaft mit Bergbauernhofen, Almwirtschaft und regionalen Produktionen.',
  'AlpenMods',
  '4x',
  '{"Weizen", "Gerste", "Mais", "Gras", "Luzerne", "Kartoffeln", "Karotten"}',
  '[{"name": "Kaeserei", "eingabe": ["Milch"], "ausgabe": ["Bergkaese", "Molke"], "beschreibung": "Traditioneller Bergkaese"}, {"name": "Brauerei", "eingabe": ["Gerste", "Weizen"], "ausgabe": ["Bier"], "beschreibung": "Bayerisches Bier brauen"}]',
  '[{"id": "hof1", "name": "Bergbauernhof", "typ": "hof", "x": 40, "y": 60}, {"id": "prod1", "name": "Kaeserei", "typ": "produktion", "x": 55, "y": 40}, {"id": "ts1", "name": "Tankstelle", "typ": "tankstelle", "x": 25, "y": 30}]'
);
