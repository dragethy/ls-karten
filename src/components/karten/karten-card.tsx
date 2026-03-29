"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Wheat, Factory, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SternRating } from "@/components/bewertungen/stern-rating";
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
        <Card className="group hover:border-green-400 hover:shadow-lg hover:shadow-green-100 cursor-pointer overflow-hidden">
          {/* Map Preview */}
          <div className="relative h-48 bg-gradient-to-br from-green-100 to-green-50 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <MapPin className="h-16 w-16 text-green-300 group-hover:text-green-400 transition-colors" />
            </div>
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">
                {karte.groesse}
              </Badge>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-white/60 to-transparent" />
          </div>

          <CardContent className="p-5 space-y-3">
            {/* Title & Author */}
            <div>
              <h3 className="text-lg font-semibold text-green-900 group-hover:text-green-600 transition-colors">
                {karte.name}
              </h3>
              <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                <User className="h-3.5 w-3.5" />
                <span>{karte.autor}</span>
              </div>
            </div>

            {/* Rating */}
            {karte.durchschnitt_bewertung !== undefined && (
              <div className="flex items-center gap-2">
                <SternRating wert={karte.durchschnitt_bewertung} groesse="sm" />
                <span className="text-sm text-gray-500">
                  ({karte.anzahl_bewertungen})
                </span>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Wheat className="h-3.5 w-3.5 text-green-600" />
                <span>{karte.fruechte.length} Fruechte</span>
              </div>
              <div className="flex items-center gap-1">
                <Factory className="h-3.5 w-3.5 text-amber-600" />
                <span>{karte.produktionen.length} Produktionen</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {karte.fruechte.slice(0, 4).map((frucht) => (
                <Badge key={frucht} variant="outline" className="text-xs">
                  {frucht}
                </Badge>
              ))}
              {karte.fruechte.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{karte.fruechte.length - 4}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
