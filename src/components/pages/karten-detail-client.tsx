"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Download, ExternalLink, MapPin, Ruler, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FruechteListe } from "@/components/karten/fruechte-liste";
import { FaktenSheet } from "@/components/karten/fakten-sheet";
import { MapControls } from "@/components/map/map-controls";
import { SternRating } from "@/components/bewertungen/stern-rating";
import { BewertungForm } from "@/components/bewertungen/bewertung-form";
import { BewertungListe } from "@/components/bewertungen/bewertung-liste";
import { formatDate } from "@/lib/utils";
import { POI_ICONS } from "@/lib/constants";
import type { Karte } from "@/types/karte";
import type { Bewertung } from "@/types/bewertung";

const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((m) => m.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[400px] bg-green-50 rounded-xl animate-pulse" /> }
);

interface KartenDetailClientProps {
  karte: Karte;
}

export function KartenDetailClient({ karte }: KartenDetailClientProps) {
  const [activeLayers, setActiveLayers] = useState<string[]>(
    Object.keys(POI_ICONS)
  );
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);

  const handleToggleLayer = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleBewertung = (sterne: number, kommentar: string) => {
    const newBewertung: Bewertung = {
      id: Date.now().toString(),
      karte_id: karte.id,
      user_id: "demo",
      sterne,
      kommentar,
      erstellt_am: new Date().toISOString(),
      profile: { username: "Du", avatar_url: null },
    };
    setBewertungen((prev) => [newBewertung, ...prev]);
  };

  const filteredPois = karte.pois.filter((p) => activeLayers.includes(p.typ));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <Link href="/karten" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-700 transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" />
        Alle Karten
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Preview Banner */}
        {karte.preview_url && (
          <div className="relative h-48 sm:h-64 lg:h-80 rounded-xl overflow-hidden mb-8">
            <Image
              src={karte.preview_url}
              alt={karte.name}
              fill
              className="object-cover object-bottom"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-5">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
                {karte.name}
              </h1>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            {!karte.preview_url && (
              <h1 className="text-3xl font-bold text-green-900">{karte.name}</h1>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {karte.autor}
              </div>
              <div className="flex items-center gap-1.5">
                <Ruler className="h-4 w-4" />
                {karte.groesse} Karte
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatDate(karte.erstellt_am)}
              </div>
              <Badge
                className={
                  karte.precision_farming
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-gray-100 text-gray-500 border-gray-300"
                }
              >
                Precision Farming {karte.precision_farming ? "Ready" : "Nicht unterstützt"}
              </Badge>
            </div>
            {karte.durchschnitt_bewertung !== undefined && (
              <div className="flex items-center gap-2 mt-3">
                <SternRating wert={karte.durchschnitt_bewertung} />
                <span className="text-sm text-gray-500">
                  {karte.durchschnitt_bewertung.toFixed(1)} ({karte.anzahl_bewertungen} Bewertungen)
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {karte.download_url && (
              <a href={karte.download_url} target="_blank" rel="noopener noreferrer">
                <Button>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </a>
            )}
            {karte.quell_url && (
              <a href={karte.quell_url} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="default">
                  <ExternalLink className="h-4 w-4" />
                  Quelle
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">{karte.beschreibung}</p>
          </CardContent>
        </Card>

        {/* Fakten Sheet */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <FaktenSheet
              fakten={karte.fakten}
              version={karte.version}
              groesse={karte.groesse}
              precision_farming={karte.precision_farming}
            />
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Interaktive Karte
            </h2>
          </div>
          <MapControls activeLayers={activeLayers} onToggleLayer={handleToggleLayer} />
          <InteractiveMap
            minimapUrl={karte.minimap_url}
            pois={filteredPois}
            className="h-[500px]"
          />
        </div>

        {/* Zusätzliche Früchte */}
        <div className="mb-8">
          <FruechteListe fruechte={karte.fruechte} />
        </div>

        {/* Bewertungen */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-green-900">Bewertungen</h2>
          <BewertungForm karteId={karte.id} onSubmit={handleBewertung} />
          <BewertungListe bewertungen={bewertungen} />
        </div>
      </motion.div>
    </div>
  );
}
