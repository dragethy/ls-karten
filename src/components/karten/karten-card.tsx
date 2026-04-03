"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Wheat, Factory, User, Star } from "lucide-react";
import type { Karte } from "@/types/karte";

interface KartenCardProps {
  karte: Karte;
  index?: number;
}

export function KartenCard({ karte, index = 0 }: KartenCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/karten/${karte.slug}`}>
        <div className="group rounded-2xl border border-green-200/40 bg-white/80 backdrop-blur-sm overflow-hidden shadow-[0_4px_12px_rgba(16,24,40,0.04)] hover:shadow-[0_10px_30px_rgba(16,24,40,0.08)] hover:border-green-400/60 transition-all duration-300 cursor-pointer">
          {/* Preview */}
          <div className="relative h-44 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
            {karte.preview_url ? (
              <Image
                src={karte.preview_url}
                alt={karte.name}
                fill
                className="object-cover object-bottom group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="h-14 w-14 text-green-300 group-hover:text-green-400 transition-colors" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

            {/* Badges */}
            <div className="absolute top-2.5 left-2.5">
              <span className="rounded-full bg-green-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow">
                v{karte.version}
              </span>
            </div>
            <div className="absolute top-2.5 right-2.5 flex gap-1.5">
              <span className="rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/25">
                {karte.groesse}
              </span>
              {karte.precision_farming && (
                <span className="rounded-full bg-blue-500/80 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                  PF
                </span>
              )}
            </div>

            {/* Bottom overlay: Title */}
            <div className="absolute bottom-2.5 left-3 right-3">
              <h3 className="text-lg font-black text-white drop-shadow-lg truncate">{karte.name}</h3>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-2.5">
            {/* Author + Rating */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <User className="h-3.5 w-3.5" />
                <span className="truncate max-w-[140px]">{karte.autor}</span>
              </div>
              {karte.durchschnitt_bewertung !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-green-950">{karte.durchschnitt_bewertung.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {karte.fakten?.felder && (
                <span className="flex items-center gap-1">
                  <span className="font-bold text-green-700">{(karte.fakten as Record<string, unknown>).felder as number}</span> Felder
                </span>
              )}
              {karte.fruechte.length > 0 && (
                <span className="flex items-center gap-1">
                  <Wheat className="h-3 w-3 text-green-600" />
                  {karte.fruechte.length} Früchte
                </span>
              )}
              {karte.fakten?.produktionen && (
                <span className="flex items-center gap-1">
                  <Factory className="h-3 w-3 text-amber-600" />
                  {(karte.fakten as Record<string, unknown>).produktionen as number}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
