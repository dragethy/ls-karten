"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Download, ExternalLink, MapPin, Star, User, BookOpen, ScrollText, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FruechteListe } from "@/components/karten/fruechte-liste";
import { FaktenSheet } from "@/components/karten/fakten-sheet";
import { MapControls } from "@/components/map/map-controls";
import { SternRating } from "@/components/bewertungen/stern-rating";
import { BewertungForm } from "@/components/bewertungen/bewertung-form";
import { BewertungListe } from "@/components/bewertungen/bewertung-liste";
import { formatDate } from "@/lib/utils";
import { POI_ICONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Karte, MapFakten } from "@/types/karte";
import type { Bewertung } from "@/types/bewertung";

const InteractiveMap = dynamic(
  () => import("@/components/map/interactive-map").then((m) => m.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[500px] bg-green-50 rounded-2xl animate-pulse" /> }
);

const STANDARD_SET = new Set([
  "wheat","barley","oat","canola","maize","sunflower","soybean","potato",
  "sugarbeet","sugarcane","cotton","sorghum","rice","ricelonggrain",
  "grape","olive","poplar","beetroot","carrot","parsnip","greenbean",
  "pea","spinach","grass","oilseedradish","meadow","meadowus","meadowas","meadoweu","strawberry",
]);

function countExtra(f: string[]): number {
  return f.filter((x) => !STANDARD_SET.has(x.toLowerCase().replace(/\s+/g, ""))).length;
}

function shortDesc(t: string): string {
  if (!t) return "";
  const s = t.split(/[.!]\s/)[0];
  return s.length > 200 ? s.slice(0, 200) + "…" : s + ".";
}

interface Props { karte: Karte }

export function KartenDetailClient({ karte }: Props) {
  const [activeLayers, setActiveLayers] = useState<string[]>(Object.keys(POI_ICONS));
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);
  const [activeTab, setActiveTab] = useState<"uebersicht" | "changelog" | "galerie">("uebersicht");

  const toggleLayer = (l: string) => setActiveLayers((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const addBewertung = (s: number, k: string) => setBewertungen((p) => [{
    id: Date.now().toString(), karte_id: karte.id, user_id: "demo", sterne: s, kommentar: k,
    erstellt_am: new Date().toISOString(), profile: { username: "Du", avatar_url: null },
  }, ...p]);

  const pois = karte.pois.filter((p) => activeLayers.includes(p.typ));
  const extraCount = countExtra(karte.fruechte);

  return (
    <div>
      {/* ═══ HEADER: Großer Preview-Banner ═══ */}
      <header className="relative h-[30vh] min-h-[250px] max-h-[400px] bg-green-900 overflow-hidden">
        {karte.preview_url ? (
          <Image src={karte.preview_url} alt={karte.name} fill className="object-cover object-bottom" priority />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8faf5] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

        {/* Nav overlay */}
        <div className="absolute top-4 left-4 sm:left-8">
          <Link href="/karten" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 transition">
            <ArrowLeft className="h-4 w-4" /> Alle Karten
          </Link>
        </div>

        {/* Badges top-right */}
        <div className="absolute top-4 right-4 sm:right-8 flex gap-2">
          <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow">v{karte.version}</span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">{karte.groesse} Karte</span>
          {karte.precision_farming && <span className="rounded-full bg-blue-500/90 px-3 py-1 text-xs font-semibold text-white">PF Ready</span>}
        </div>
      </header>

      {/* ═══ TITLE BAR (überlappt Header) ═══ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

          <div className="bg-white/80 backdrop-blur-xl rounded-[28px] border border-green-200/40 shadow-[0_10px_30px_rgba(16,24,40,0.08)] p-6 lg:p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-2">
                  <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {karte.autor}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(karte.erstellt_am)}</span>
                  {karte.durchschnitt_bewertung !== undefined && (
                    <><span>·</span><span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {karte.durchschnitt_bewertung.toFixed(1)} ({karte.anzahl_bewertungen})</span></>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-green-950">{karte.name}</h1>
                <p className="mt-2 text-gray-600 max-w-2xl">{shortDesc(karte.beschreibung)}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                {karte.download_url && (
                  <a href={karte.download_url} target="_blank" rel="noopener noreferrer">
                    <Button className="rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-[0_0_0_1px_rgba(46,174,93,.12),0_18px_50px_rgba(46,174,93,.10)]">
                      <Download className="h-4 w-4" /> Download
                    </Button>
                  </a>
                )}
                {karte.quell_url && (
                  <a href={karte.quell_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="rounded-2xl"><ExternalLink className="h-4 w-4" /> Quelle</Button>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* ═══ ROW 1: Beschreibung (Tabs) + Schnellüberblick ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-8">
            {/* Beschreibung mit Tabs */}
            <div className="rounded-[28px] border border-green-200/40 bg-white/80 backdrop-blur-sm shadow-[0_10px_30px_rgba(16,24,40,0.08)] overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-green-100/60 px-6 pt-5 flex gap-1 overflow-x-auto bg-green-50/30">
                {([
                  { key: "uebersicht", label: "Übersicht", icon: BookOpen },
                  { key: "changelog", label: "Changelog", icon: ScrollText },
                  { key: "galerie", label: "Galerie", icon: ImageIcon },
                ] as const).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "px-5 py-2.5 rounded-t-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0",
                      activeTab === tab.key
                        ? "text-green-700 bg-green-50 border border-green-200 border-b-white -mb-px"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <tab.icon className="h-4 w-4" /> {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6 lg:p-8">
                {activeTab === "uebersicht" && (
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-green-950 mb-4">Über diese Karte</h2>
                    <FormattedDescription text={karte.beschreibung} />
                  </div>
                )}
                {activeTab === "changelog" && (
                  <div className="text-gray-500 text-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-green-950 mb-4">Changelog</h2>
                    <p>Changelog wird automatisch bei Versions-Updates erfasst. Aktuell: v{karte.version}</p>
                  </div>
                )}
                {activeTab === "galerie" && (
                  <div className="text-gray-500 text-sm">
                    <h2 className="text-2xl font-bold tracking-tight text-green-950 mb-4">Galerie</h2>
                    <p>Noch keine Screenshots vorhanden.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schnellüberblick + Key Features */}
            <div className="space-y-5">
              <div className="rounded-[28px] border border-green-200/40 bg-white/80 backdrop-blur-sm p-6 shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Schnellüberblick</p>
                    <h2 className="mt-1 text-lg font-bold text-green-950">Download-Info</h2>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-bold">Aktuell</Badge>
                </div>
                <div className="space-y-2.5 text-sm">
                  {[
                    ["Version", `v${karte.version}`],
                    ["Kartengröße", karte.groesse],
                    ["Precision Farming", karte.precision_farming ? "Kompatibel" : "Nein"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-xl bg-green-50/40 px-4 py-2.5">
                      <span className="text-gray-500">{label}</span>
                      <span className={`font-bold ${value === "Kompatibel" ? "text-green-600" : value === "Nein" ? "text-gray-400" : "text-green-950"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-green-200/40 bg-white/80 backdrop-blur-sm p-6 shadow-[0_4px_12px_rgba(16,24,40,0.04)]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-green-950">Key Features</h3>
                  <span className="text-xs font-semibold text-gray-400">Highlights</span>
                </div>
                <KeyFeaturesGrid fakten={karte.fakten} zusatzCount={extraCount} />
              </div>
            </div>
          </div>

          {/* ═══ ROW 2: Fakten + Zusätzliche Früchte ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 mb-8">
            <div className="rounded-[28px] border border-green-200/60 bg-white p-6 lg:p-8 shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
              <SectionBadge color="emerald">Fakten</SectionBadge>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-green-950">Kennzahlen im Überblick</h2>
              <div className="mt-5">
                <FaktenSheet fakten={karte.fakten} />
              </div>
            </div>

            <div className="rounded-[28px] border border-green-200/60 bg-white p-6 shadow-[0_10px_30px_rgba(16,24,40,0.08)]">
              <FruechteListe fruechte={karte.fruechte} />
            </div>
          </div>

          {/* ═══ ROW 3: Interaktive Karte (volle Breite) ═══ */}
          <div className="rounded-[28px] border-2 border-green-500/70 bg-white/90 backdrop-blur-sm overflow-hidden shadow-[0_10px_30px_rgba(46,174,93,0.12),0_0_0_1px_rgba(46,174,93,0.06)] mb-8">
            <div className="bg-green-50/60 backdrop-blur-sm border-b border-green-200/60 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-bold text-green-950 flex items-center text-lg">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Interaktive Übersichtskarte
              </h2>
              <MapControls activeLayers={activeLayers} onToggleLayer={toggleLayer} />
            </div>
            <div className="p-4 sm:p-5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">
                <InteractiveMap minimapUrl={karte.minimap_url} pois={pois} className="h-[500px] lg:h-[600px]" />
                <div className="rounded-2xl border border-green-200/60 bg-green-50/30 p-4">
                  <h3 className="font-bold text-green-950 mb-3">Orte im Fokus</h3>
                  <div className="space-y-2 max-h-[550px] overflow-y-auto">
                    {pois.length === 0 ? (
                      <p className="text-sm text-gray-500">Keine POIs vorhanden.</p>
                    ) : pois.map((poi) => (
                      <div key={poi.id} className="flex items-center gap-3 rounded-xl bg-white border border-green-100 p-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: `${POI_ICONS[poi.typ]?.color || "#6b7280"}18` }}>
                          <MapPin className="h-4 w-4" style={{ color: POI_ICONS[poi.typ]?.color || "#6b7280" }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-green-950 truncate">{poi.name}</div>
                          <div className="text-xs text-gray-500">{POI_ICONS[poi.typ]?.label || "Sonstiges"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-green-50/50 border-t border-green-200 px-5 py-2.5 text-center text-xs text-gray-500">
              Nutze Mausrad zum Zoomen und Drag & Drop zum Bewegen. Klicke auf Icons für Details.
            </div>
          </div>

          {/* ═══ ROW 4: Bewertungen ═══ */}
          <div className="rounded-[28px] border border-green-200/60 bg-white p-6 lg:p-8 shadow-[0_10px_30px_rgba(16,24,40,0.08)] mb-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <SectionBadge color="rose">Bewertungen</SectionBadge>
                <h2 className="mt-3 text-2xl font-bold tracking-tight text-green-950">Nutzerfeedback</h2>
              </div>
              {karte.durchschnitt_bewertung !== undefined && (
                <div className="rounded-2xl bg-green-50/50 px-5 py-3 text-center">
                  <div className="text-3xl font-black text-green-950">{karte.durchschnitt_bewertung.toFixed(1)} <Star className="inline h-6 w-6 fill-amber-400 text-amber-400 -mt-1" /></div>
                  <div className="text-sm text-gray-500">{karte.anzahl_bewertungen} Bewertungen</div>
                </div>
              )}
            </div>
            <BewertungForm karteId={karte.id} onSubmit={addBewertung} />
            <div className="mt-6"><BewertungListe bewertungen={bewertungen} /></div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}

/* ═══ Helpers ═══ */

function KeyFeaturesGrid({ fakten, zusatzCount }: { fakten: MapFakten; zusatzCount: number }) {
  const items: Array<{ value: number; label: string; color: string; bg: string }> = [];
  if (fakten.felder) items.push({ value: fakten.felder, label: "Felder", color: "text-green-700", bg: "bg-green-50" });
  if (zusatzCount > 0) items.push({ value: zusatzCount, label: "Zusatzfrüchte", color: "text-amber-600", bg: "bg-amber-50" });
  if (fakten.verkaufsstellen) items.push({ value: fakten.verkaufsstellen, label: "Verkaufsstellen", color: "text-sky-600", bg: "bg-sky-50" });
  if (fakten.produktionen) items.push({ value: fakten.produktionen, label: "Produktionen", color: "text-violet-600", bg: "bg-violet-50" });
  if (items.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      {items.map((i) => (
        <div key={i.label} className={`rounded-2xl ${i.bg} p-3.5`}>
          <div className={`text-2xl font-black ${i.color}`}>{i.value}</div>
          <div className="mt-0.5 text-gray-600">{i.label}</div>
        </div>
      ))}
    </div>
  );
}

const BADGE_COLORS: Record<string, string> = {
  green: "bg-green-100 text-green-700", emerald: "bg-emerald-100 text-emerald-700",
  orange: "bg-orange-100 text-orange-700", rose: "bg-rose-100 text-rose-700",
};

function SectionBadge({ children, color = "green" }: { children: React.ReactNode; color?: string }) {
  return <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${BADGE_COLORS[color] || BADGE_COLORS.green}`}>{children}</span>;
}

function FormattedDescription({ text }: { text: string }) {
  if (!text) return null;
  const hasBullets = text.includes("•") || text.includes(" - ") || text.includes(" · ");
  if (hasBullets) {
    const parts = text.split(/\s*[•·]\s*/);
    const altParts = parts.length <= 2 ? text.split(/\s+-\s+/) : parts;
    const items = (altParts.length > 2 ? altParts : parts).filter((p) => p.trim().length > 3);
    if (items.length > 2) {
      return (
        <div className="space-y-3">
          {items[0] && <p className="text-[15px] leading-7 text-gray-600">{items[0].trim()}</p>}
          <ul className="space-y-1.5">
            {items.slice(1).map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />
                {item.trim()}
              </li>
            ))}
          </ul>
        </div>
      );
    }
  }
  return <p className="text-[15px] leading-7 text-gray-600">{text}</p>;
}
