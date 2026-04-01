import { getAlleKartenAdmin } from "@/lib/admin-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AdminKartenPage() {
  const karten = await getAlleKartenAdmin();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{karten.length} Karten in der Datenbank</p>
        <Link href="/admin/karten/neu">
          <Button size="sm"><Plus className="h-4 w-4" /> Neue Karte</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Größe</TableHead>
              <TableHead>PF</TableHead>
              <TableHead>Aktualisiert</TableHead>
              <TableHead className="text-right">Aktionen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {karten.map((karte) => (
              <TableRow key={karte.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {karte.preview_url && (
                      <img src={karte.preview_url} alt="" className="h-8 w-12 rounded object-cover object-bottom" />
                    )}
                    <div>
                      <Link href={`/karten/${karte.slug}`} className="font-medium text-gray-900 hover:text-green-600">
                        {karte.name}
                      </Link>
                      <p className="text-xs text-gray-400">{karte.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">{karte.autor}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-xs">v{karte.version}</Badge>
                </TableCell>
                <TableCell className="text-sm">{karte.groesse}</TableCell>
                <TableCell>
                  {karte.precision_farming
                    ? <Badge className="bg-blue-100 text-blue-700 text-xs">✓</Badge>
                    : <Badge className="bg-gray-100 text-gray-400 text-xs">✗</Badge>
                  }
                </TableCell>
                <TableCell className="text-sm text-gray-500">{formatDate(karte.aktualisiert_am)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/karten/${karte.slug}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href={`/admin/karten/${karte.slug}/edit`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
