"use client";

import { motion } from "framer-motion";
import {
  Rocket,
  CheckCircle2,
  Clock,
  Circle,
  Search,
  Map,
  Star,
  Users,
  Upload,
  Shield,
  BarChart3,
  Globe,
  MessageSquare,
  Bell,
  Palette,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FeatureStatus = "fertig" | "in-arbeit" | "geplant";

interface Feature {
  name: string;
  beschreibung: string;
  status: FeatureStatus;
  icon: React.ElementType;
}

interface RoadmapPhase {
  phase: string;
  titel: string;
  zeitraum: string;
  features: Feature[];
}

const ROADMAP: RoadmapPhase[] = [
  {
    phase: "Phase 1",
    titel: "Grundlagen",
    zeitraum: "Q1 2026",
    features: [
      {
        name: "Kartenuebersicht",
        beschreibung: "Grid-Ansicht aller Karten mit Vorschau-Cards",
        status: "fertig",
        icon: Map,
      },
      {
        name: "Such- und Filtersystem",
        beschreibung: "Karten nach Groesse, Fruechten und Name durchsuchen",
        status: "fertig",
        icon: Search,
      },
      {
        name: "Karten-Detailseiten",
        beschreibung: "Vollstaendige Infos zu Fruechten, Produktionen und POIs",
        status: "fertig",
        icon: BarChart3,
      },
      {
        name: "Interaktive Minimap",
        beschreibung: "Leaflet-basierte Karte mit POI-Markern und Layer-Toggle",
        status: "fertig",
        icon: Globe,
      },
      {
        name: "Bewertungssystem",
        beschreibung: "5-Sterne-Rating mit Kommentaren fuer jede Karte",
        status: "fertig",
        icon: Star,
      },
      {
        name: "Benutzer-Authentifizierung",
        beschreibung: "Login und Registrierung via Supabase Auth",
        status: "fertig",
        icon: Shield,
      },
    ],
  },
  {
    phase: "Phase 2",
    titel: "Community & Inhalte",
    zeitraum: "Q2 2026",
    features: [
      {
        name: "Karten einreichen",
        beschreibung: "Formular zum Vorschlagen neuer Karten durch die Community",
        status: "in-arbeit",
        icon: Upload,
      },
      {
        name: "Benutzerprofile",
        beschreibung: "Oeffentliche Profile mit Bewertungshistorie und Favoriten",
        status: "in-arbeit",
        icon: Users,
      },
      {
        name: "Kommentar-System",
        beschreibung: "Diskussionen und Tipps unter jeder Karte",
        status: "geplant",
        icon: MessageSquare,
      },
      {
        name: "Benachrichtigungen",
        beschreibung: "E-Mail-Benachrichtigungen bei neuen Karten und Antworten",
        status: "geplant",
        icon: Bell,
      },
    ],
  },
  {
    phase: "Phase 3",
    titel: "Erweiterte Features",
    zeitraum: "Q3 2026",
    features: [
      {
        name: "Kartenvergleich",
        beschreibung: "Zwei Karten nebeneinander vergleichen (Fruechte, Groesse, etc.)",
        status: "geplant",
        icon: BarChart3,
      },
      {
        name: "Dark Mode",
        beschreibung: "Optionaler dunkler Modus fuer Nacht-Sessions",
        status: "geplant",
        icon: Palette,
      },
      {
        name: "Performance-Optimierung",
        beschreibung: "ISR, Bildoptimierung und Lazy Loading fuer schnellere Ladezeiten",
        status: "geplant",
        icon: Zap,
      },
      {
        name: "API fuer Modder",
        beschreibung: "Oeffentliche API zum Abrufen von Kartendaten",
        status: "geplant",
        icon: Rocket,
      },
    ],
  },
];

const statusConfig = {
  fertig: {
    label: "Fertig",
    icon: CheckCircle2,
    badgeClass: "bg-green-100 text-green-700",
    dotClass: "bg-green-500",
  },
  "in-arbeit": {
    label: "In Arbeit",
    icon: Clock,
    badgeClass: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-500",
  },
  geplant: {
    label: "Geplant",
    icon: Circle,
    badgeClass: "bg-gray-100 text-gray-500",
    dotClass: "bg-gray-300",
  },
};

export default function RoadmapPage() {
  const totalFeatures = ROADMAP.reduce((sum, p) => sum + p.features.length, 0);
  const fertigCount = ROADMAP.reduce(
    (sum, p) => sum + p.features.filter((f) => f.status === "fertig").length,
    0
  );
  const progressPercent = Math.round((fertigCount / totalFeatures) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Rocket className="h-7 w-7 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">Features & Roadmap</h1>
          </div>
          <p className="text-gray-500 mb-6">
            Aktuelle Features und geplante Erweiterungen fuer LS-Karten.de
          </p>

          {/* Progress Bar */}
          <div className="rounded-xl border border-green-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">Gesamtfortschritt</span>
              <span className="text-sm text-gray-500">
                {fertigCount} von {totalFeatures} Features ({progressPercent}%)
              </span>
            </div>
            <div className="h-3 rounded-full bg-green-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="space-y-10">
          {ROADMAP.map((phase, phaseIndex) => {
            const phaseFertig = phase.features.filter((f) => f.status === "fertig").length;
            const phaseTotal = phase.features.length;

            return (
              <motion.div
                key={phase.phase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: phaseIndex * 0.15 }}
              >
                {/* Phase Header */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge className="bg-green-600 text-white">{phase.phase}</Badge>
                  <h2 className="text-xl font-bold text-green-900">{phase.titel}</h2>
                  <span className="text-sm text-gray-400">{phase.zeitraum}</span>
                  <span className="text-sm text-gray-400 ml-auto">
                    {phaseFertig}/{phaseTotal}
                  </span>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {phase.features.map((feature) => {
                    const config = statusConfig[feature.status];
                    const StatusIcon = config.icon;
                    const FeatureIcon = feature.icon;

                    return (
                      <Card
                        key={feature.name}
                        className={cn(
                          "transition-all duration-200",
                          feature.status === "fertig" && "border-green-300 bg-green-50/30",
                          feature.status === "in-arbeit" && "border-amber-200",
                          feature.status === "geplant" && "border-gray-200 opacity-75"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg shrink-0",
                                feature.status === "fertig"
                                  ? "bg-green-100 text-green-600"
                                  : feature.status === "in-arbeit"
                                  ? "bg-amber-100 text-amber-600"
                                  : "bg-gray-100 text-gray-400"
                              )}
                            >
                              <FeatureIcon className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-green-900 text-sm">
                                  {feature.name}
                                </h3>
                                <StatusIcon
                                  className={cn(
                                    "h-4 w-4 shrink-0",
                                    feature.status === "fertig" && "text-green-500",
                                    feature.status === "in-arbeit" && "text-amber-500",
                                    feature.status === "geplant" && "text-gray-300"
                                  )}
                                />
                              </div>
                              <p className="text-xs text-gray-500 leading-relaxed">
                                {feature.beschreibung}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
