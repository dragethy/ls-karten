"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { updateKarte, deleteKarte } from "@/lib/admin-actions";
import { Save, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Karte } from "@/types/karte";

interface KarteEditFormProps {
  karte: Karte;
}

export function KarteEditForm({ karte }: KarteEditFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    name: karte.name,
    beschreibung: karte.beschreibung,
    autor: karte.autor,
    version: karte.version,
    groesse: karte.groesse,
    precision_farming: karte.precision_farming,
    download_url: karte.download_url || "",
    quell_url: karte.quell_url || "",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateKarte(karte.id, {
        ...form,
        download_url: form.download_url || null,
        quell_url: form.quell_url || null,
      });
      toast.success("Karte gespeichert");
      router.refresh();
    } catch (error) {
      toast.error("Fehler: " + (error instanceof Error ? error.message : "Unbekannt"));
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteKarte(karte.id);
      toast.success("Karte gelöscht");
      router.push("/admin/karten");
    } catch (error) {
      toast.error("Fehler: " + (error instanceof Error ? error.message : "Unbekannt"));
    }
    setDeleting(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/admin/karten" className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-700">
          <ArrowLeft className="h-4 w-4" /> Zurück
        </Link>
        <Badge variant="secondary">slug: {karte.slug}</Badge>
      </div>

      {/* Allgemein */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Allgemein</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Autor</label>
              <Input value={form.autor} onChange={(e) => setForm({ ...form, autor: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">Beschreibung</label>
            <Textarea rows={4} value={form.beschreibung} onChange={(e) => setForm({ ...form, beschreibung: e.target.value })} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Version</label>
              <Input value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Größe</label>
              <select
                className="flex h-10 w-full rounded-lg border border-green-200 bg-white px-3 py-2 text-sm"
                value={form.groesse}
                onChange={(e) => setForm({ ...form, groesse: e.target.value as Karte["groesse"] })}
              >
                {["1x", "2x", "4x", "8x", "16x"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-3 pb-2">
              <Switch
                checked={form.precision_farming}
                onCheckedChange={(checked) => setForm({ ...form, precision_farming: checked })}
              />
              <label className="text-sm text-gray-600">Precision Farming</label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Download-URL</label>
              <Input value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} placeholder="https://..." />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Quell-URL</label>
              <Input value={form.quell_url} onChange={(e) => setForm({ ...form, quell_url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4" />
          {saving ? "Speichern..." : "Speichern"}
        </Button>

        <div>
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-red-600">Wirklich löschen?</span>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Löschen..." : "Ja, löschen"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Abbrechen
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="text-red-500 hover:text-red-700" onClick={() => setShowDeleteConfirm(true)}>
              <Trash2 className="h-4 w-4" /> Löschen
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
