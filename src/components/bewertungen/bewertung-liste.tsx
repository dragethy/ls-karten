"use client";

import { SternRating } from "./stern-rating";
import { formatDate } from "@/lib/utils";
import { User } from "lucide-react";
import type { Bewertung } from "@/types/bewertung";

interface BewertungListeProps {
  bewertungen: Bewertung[];
}

export function BewertungListe({ bewertungen }: BewertungListeProps) {
  if (bewertungen.length === 0) {
    return (
      <p className="text-gray-500 text-sm py-4">
        Noch keine Bewertungen vorhanden. Sei der Erste!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bewertungen.map((bewertung) => (
        <div
          key={bewertung.id}
          className="rounded-xl border border-green-200 bg-white p-4 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <User className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">
                  {bewertung.profile?.username || "Anonym"}
                </p>
                <p className="text-xs text-gray-400">
                  {formatDate(bewertung.erstellt_am)}
                </p>
              </div>
            </div>
            <SternRating wert={bewertung.sterne} groesse="sm" />
          </div>

          {bewertung.kommentar && (
            <p className="text-sm text-gray-600 pl-10">{bewertung.kommentar}</p>
          )}
        </div>
      ))}
    </div>
  );
}
