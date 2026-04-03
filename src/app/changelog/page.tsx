"use client";

import { motion } from "framer-motion";
import { Calendar, Plus, Wrench, Sparkles, Bug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface ChangelogEntry {
  version: string;
  datum: string;
  typ: "feature" | "verbesserung" | "bugfix";
  aenderungen: string[];
}

const CHANGELOG: ChangelogEntry[] = [
  {
    version: "0.7.0",
    datum: "03.04.2026",
    typ: "verbesserung",
    aenderungen: [
      "Komplett neues Gaming-UI Design mit dezenter Glassmorphism-Ästhetik",
      "Detailseite: Großer Preview-Header (30vh), Titel-Bar mit Backdrop-Blur",
      "Detailseite: Tabs (Übersicht/Changelog/Galerie) + Schnellüberblick-Sidebar",
      "Detailseite: Fakten + Zusatzfrüchte nebeneinander, Interaktive Karte volle Breite",
      "Startseite: Dunkler Hero mit Glassmorphism-Stats und grünem Gradient-Text",
      "Karten-Cards: Titel im Bild-Overlay, kompaktere Badges, Rating inline",
      "Kartenübersicht: Neuer Header mit Icon-Badge",
      "Durchgängig: bg-white/80 backdrop-blur-sm auf allen Cards",
    ],
  },
  {
    version: "0.6.0",
    datum: "02.04.2026",
    typ: "verbesserung",
    aenderungen: [
      "Interaktive Karte: Lucide SVG-Icons statt farbiger Punkte (Haus, Store, Fabrik, etc.)",
      "Minimap-Cropping: mapSize-basierter Crop für korrekte Darstellung aller Kartengrößen",
      "POI-Normalisierung: Korrekte Positionierung basierend auf Overview/Map-Ratio",
      "Legende der Interaktiven Karte mit passenden Lucide-Icons",
      "Beschreibungen: Automatische Formatierung mit Aufzählungen statt Fließtext",
      "199 echte HUD-Icons aus 6 Mod-Dateien extrahiert",
      "Alle 11 Minimaps korrekt gecroppt und in Supabase hochgeladen",
      "4 Demo-Maps entfernt, nur noch echte Karten in der DB",
    ],
  },
  {
    version: "0.5.0",
    datum: "01.04.2026",
    typ: "feature",
    aenderungen: [
      "Admin-CMS mit Dashboard, Statistiken und Aktivitäts-Feed",
      "Karten-Editor: Name, Beschreibung, Version, Größe, PF, URLs bearbeiten",
      "Benutzer-Verwaltung mit Rollen-System (Admin/Moderator/User)",
      "Bewertungs-Moderation: Unangemessene Bewertungen löschen",
      "Audit-Log: Alle Admin-Aktionen werden protokolliert",
      "RLS-basierte Sicherheit: ist_admin() und ist_moderator_oder_admin() SQL-Funktionen",
      "Admin-Link in der Navbar für eingeloggte Admins",
      "Erster registrierter Benutzer wird automatisch Admin",
    ],
  },
  {
    version: "0.4.0",
    datum: "01.04.2026",
    typ: "feature",
    aenderungen: [
      "Map Data Agent: Automatischer Import von Karten aus Mod-Dateien (npm run agent)",
      "ModHub Discovery: Neue Karten auf farming-simulator.com finden (npm run discover)",
      "Quell-URL Tracking: Original-Links für automatische Update-Checks",
      "Batch-Crawl: 11 Karten automatisch gegen ihre Quellen prüfen (npm run crawl)",
      "Enricher: Fehlende ModHub-URLs automatisch ergänzen (npm run enrich)",
      "11 echte Karten in Supabase DB importiert mit Preview-Bildern",
      "Webseite auf Supabase umgestellt (Server Components + Fallback auf Demo-Daten)",
      "GitHub Actions: Wöchentlicher Crawl-Check, manueller Agent-Run, Auto-Deploy",
      "199 echte HUD-Icons aus Mod-Dateien extrahiert",
      "Einzahl/Mehrzahl bei Fakten-Labels (1 Hof vs. 4 Höfe)",
      "Standard-Früchte korrekt gefiltert nach FS-Standard",
      "Alle Fruchtnamen auf Deutsch übersetzt",
    ],
  },
  {
    version: "0.3.0",
    datum: "29.03.2026",
    typ: "feature",
    aenderungen: [
      "Map-Versionierung auf Karten-Cards und Detailseiten",
      "Fakten-Sheet mit Feldern, Höfen, Wäldern, Produktionen, Verkaufsstellen, BGA",
      "Besonderheiten-Liste im Fakten-Sheet",
      "Download-Button mit Link zur Mod-Quelle",
      "Frucht-Icons aus den LS25-Mod-Dateien",
      "Precision Farming Ready Badge",
      "Preview-Bilder aus Mod-Dateien als Karten-Header",
      "Originale Minimap aus der Mod-Datei (overview.dds konvertiert)",
    ],
  },
  {
    version: "0.2.0",
    datum: "29.03.2026",
    typ: "verbesserung",
    aenderungen: [
      "Helles, grünes Design (LS25-Theme) statt dunklem Theme",
      "LS-typischer Landschafts-Hintergrund im Hero (Weizenfeld mit Mähdrescher)",
      "Changelog-Seite mit Timeline-Design",
      "Roadmap-Seite mit Fortschrittsbalken und Feature-Status",
      "GitHub Repository erstellt und veröffentlicht",
      "Navigation um Roadmap und Changelog erweitert",
    ],
  },
  {
    version: "0.1.0",
    datum: "29.03.2026",
    typ: "feature",
    aenderungen: [
      "Initiales Projekt-Setup mit Next.js 15 und TypeScript",
      "Homepage mit Hero-Section und Statistiken",
      "Kartenübersicht mit Such- und Filterfunktion",
      "Karten-Detailseiten mit Beschreibung, Früchten und Produktionen",
      "Interaktive Minimap mit Leaflet.js und POI-Markern",
      "Layer-Toggle für verschiedene POI-Typen (Höfe, Verkaufsstellen, etc.)",
      "Bewertungssystem mit 5-Sterne-Rating und Kommentaren",
      "Benutzer-Authentifizierung (Login/Registrierung) via Supabase",
      "Responsive Design für Mobile und Desktop",
      "Supabase Datenbank-Schema mit RLS-Policies",
    ],
  },
];

const typConfig = {
  feature: { label: "Neues Feature", icon: Plus, color: "bg-green-100 text-green-700" },
  verbesserung: { label: "Verbesserung", icon: Wrench, color: "bg-blue-100 text-blue-700" },
  bugfix: { label: "Bugfix", icon: Bug, color: "bg-amber-100 text-amber-700" },
};

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-7 w-7 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">Changelog</h1>
          </div>
          <p className="text-gray-500">
            Alle Aenderungen und Updates an LS-Karten.de
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-green-200" />

          <div className="space-y-8">
            {CHANGELOG.map((entry, index) => {
              const config = typConfig[entry.typ];
              const Icon = config.icon;

              return (
                <motion.div
                  key={entry.version}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="relative pl-16"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-2 h-5 w-5 rounded-full bg-green-500 border-4 border-[#f8faf5] z-10" />

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-green-900">
                          v{entry.version}
                        </h2>
                        <Badge className={config.color}>
                          <Icon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-sm text-gray-400">
                          <Calendar className="h-3.5 w-3.5" />
                          {entry.datum}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {entry.aenderungen.map((aenderung, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                            {aenderung}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
