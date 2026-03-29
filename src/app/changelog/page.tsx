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
    version: "0.1.0",
    datum: "29.03.2026",
    typ: "feature",
    aenderungen: [
      "Initiales Projekt-Setup mit Next.js 15 und TypeScript",
      "Helles, gruenes Design passend zum LS25-Theme",
      "Homepage mit Hero-Section und Statistiken",
      "Kartenuebersicht mit Such- und Filterfunktion",
      "Karten-Detailseiten mit Beschreibung, Fruechten und Produktionen",
      "Interaktive Minimap mit Leaflet.js und POI-Markern",
      "Layer-Toggle fuer verschiedene POI-Typen (Hoefe, Verkaufsstellen, etc.)",
      "Bewertungssystem mit 5-Sterne-Rating und Kommentaren",
      "Benutzer-Authentifizierung (Login/Registrierung) via Supabase",
      "Responsive Design fuer Mobile und Desktop",
      "4 Demo-Karten mit vollstaendigen Daten",
      "Supabase Datenbank-Schema mit RLS-Policies",
      "Footer mit Navigation und Rechtliches",
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
