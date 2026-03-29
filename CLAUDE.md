# LS-Karten.de

## Projekt
Webplattform zum Sammeln und Vorstellen von Karten fuer den Landwirtschafts Simulator 25.
Domain: ls-karten.de

## Tech Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Supabase (PostgreSQL + Auth + Storage)
- Leaflet.js (react-leaflet) fuer interaktive Minimaps
- Zustand fuer Client-State
- Framer Motion fuer Animationen

## Konventionen
- Deutsche UI-Texte, englischer Code
- Komponenten: PascalCase, Dateien: kebab-case
- Server Components als Default, 'use client' nur wenn noetig
- Tailwind fuer Styling, keine CSS-Module
- Supabase Server Client in Server Components, Browser Client in Client Components
- Import Alias: @/* fuer src/*

## Architektur
- src/app/ - Next.js App Router (Pages, API Routes, Layouts)
- src/components/ - React Komponenten (ui/, layout/, karten/, map/, bewertungen/)
- src/lib/ - Utilities, Supabase Clients, Konstanten
- src/types/ - TypeScript Type Definitions
- src/hooks/ - Custom React Hooks
- supabase/ - Migrationen

## Befehle
- `npm run dev` - Entwicklungsserver
- `npm run build` - Production Build
- `npm run lint` - ESLint
