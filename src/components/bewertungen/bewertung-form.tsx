"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SternRating } from "./stern-rating";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

interface BewertungFormProps {
  karteId: string;
  onSubmit: (sterne: number, kommentar: string) => void;
}

export function BewertungForm({ karteId: _karteId, onSubmit }: BewertungFormProps) {
  const { user } = useAuth();
  const [sterne, setSterne] = useState(0);
  const [kommentar, setKommentar] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="text-gray-600 mb-3">
          Melde dich an, um eine Bewertung abzugeben.
        </p>
        <Link href="/auth/login">
          <Button variant="outline" size="sm">
            Anmelden
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sterne === 0) return;
    setSubmitting(true);
    onSubmit(sterne, kommentar);
    setSterne(0);
    setKommentar("");
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-green-200 bg-green-50/50 p-6 space-y-4">
      <h4 className="font-medium text-green-900">Deine Bewertung</h4>

      <div>
        <label className="text-sm text-gray-600 block mb-2">Sterne</label>
        <SternRating wert={sterne} groesse="lg" interaktiv onChange={setSterne} />
      </div>

      <div>
        <label className="text-sm text-gray-600 block mb-2">Kommentar (optional)</label>
        <textarea
          value={kommentar}
          onChange={(e) => setKommentar(e.target.value)}
          placeholder="Schreibe einen Kommentar..."
          rows={3}
          className="w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm text-green-900 placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
        />
      </div>

      <Button type="submit" disabled={sterne === 0 || submitting}>
        {submitting ? "Wird gesendet..." : "Bewertung abgeben"}
      </Button>
    </form>
  );
}
