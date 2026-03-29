"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Download, MapPin, Ruler, User } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FruechteListe } from "@/components/karten/fruechte-liste";
import { ProduktionenListe } from "@/components/karten/produktionen-liste";
import { MapControls } from "@/components/map/map-controls";
import { SternRating } from "@/components/bewertungen/stern-rating";
import { BewertungForm } from "@/components/bewertungen/bewertung-form";
import { BewertungListe } from "@/components/bewertungen/bewertung-liste";
import { DEMO_KARTEN } from "@/lib/demo-data";
import { formatDate } from "@/lib/utils";
import { POI_ICONS } from "@/lib/constants";
import type { Bewertung } from "@/types/bewertung";

const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((m) => m.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[400px] bg-green-50 rounded-xl animate-pulse" /> }
);

const DEMO_BEWERTUNGEN: Bewertung[] = [
  {
    id: "1",
    karte_id: "1",
    user_id: "u1",
    sterne: 5,
    kommentar: "Fantastische Karte! Die Produktionsketten sind super durchdacht.",
    erstellt_am: "2025-02-10T10:00:00Z",
    profile: { username: "FarmerMax", avatar_url: null },
  },
  {
    id: "2",
    karte_id: "1",
    user_id: "u2",
    sterne: 4,
    kommentar: "Sehr gut, nur die Performance koennte etwas besser sein.",
    erstellt_am: "2025-02-15T14:30:00Z",
    profile: { username: "LandwirtPro", avatar_url: null },
  },
];

export default function KartenDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const karte = DEMO_KARTEN.find((k) => k.slug === slug);

  const [activeLayers, setActiveLayers] = useState<string[]>(
    Object.keys(POI_ICONS)
  );
  const [bewertungen, setBewertungen] = useState<Bewertung[]>(DEMO_BEWERTUNGEN);

  const handleToggleLayer = (layer: string) => {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  const handleBewertung = (sterne: number, kommentar: string) => {
    const newBewertung: Bewertung = {
      id: Date.now().toString(),
      karte_id: karte?.id || "",
      user_id: "demo",
      sterne,
      kommentar,
      erstellt_am: new Date().toISOString(),
      profile: { username: "Du", avatar_url: null },
    };
    setBewertungen((prev) => [newBewertung, ...prev]);
  };

  if (!karte) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-green-900 mb-4">Karte nicht gefunden</h1>
        <Link href="/karten">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4" />
            Zurueck zur Uebersicht
          </Button>
        </Link>
      </div>
    );
  }

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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">{karte.name}</h1>
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

          {karte.download_url && (
            <a href={karte.download_url} target="_blank" rel="noopener noreferrer">
              <Button>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </a>
          )}
        </div>

        {/* Description */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-gray-700 leading-relaxed">{karte.beschreibung}</p>
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <FruechteListe fruechte={karte.fruechte} />
          <ProduktionenListe produktionen={karte.produktionen} />
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
