"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Star, Trash2 } from "lucide-react";
import { deleteBewertung } from "@/lib/admin-actions";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import type { BewertungMitDetails } from "@/types/admin";

export function BewertungenAdminTabelle({ bewertungen }: { bewertungen: BewertungMitDetails[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bewertung wirklich löschen?")) return;
    setDeleting(id);
    try {
      await deleteBewertung(id);
      toast.success("Bewertung gelöscht");
    } catch (error) {
      toast.error("Fehler: " + (error instanceof Error ? error.message : "Unbekannt"));
    }
    setDeleting(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{bewertungen.length} Bewertungen</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Karte</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Sterne</TableHead>
              <TableHead>Kommentar</TableHead>
              <TableHead>Datum</TableHead>
              <TableHead className="text-right">Aktion</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bewertungen.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Noch keine Bewertungen vorhanden.
                </TableCell>
              </TableRow>
            ) : bewertungen.map((b) => (
              <TableRow key={b.id}>
                <TableCell>
                  <Link href={`/karten/${b.karte_slug}`} className="text-green-600 hover:underline text-sm">
                    {b.karte_name}
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{b.username}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-sm">{b.sterne}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600 max-w-xs truncate">{b.kommentar || "—"}</TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(b.erstellt_am)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700"
                    disabled={deleting === b.id}
                    onClick={() => handleDelete(b.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
