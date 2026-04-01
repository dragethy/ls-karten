import { getAuditLog } from "@/lib/admin-queries";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

const AKTION_FARBEN: Record<string, string> = {
  "karte.erstellt": "bg-green-100 text-green-700",
  "karte.bearbeitet": "bg-blue-100 text-blue-700",
  "karte.gelöscht": "bg-red-100 text-red-700",
  "benutzer.rolle_geändert": "bg-purple-100 text-purple-700",
  "bewertung.gelöscht": "bg-amber-100 text-amber-700",
};

export default async function AdminAuditLogPage() {
  const log = await getAuditLog(100);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{log.length} Einträge</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zeitpunkt</TableHead>
              <TableHead>Benutzer</TableHead>
              <TableHead>Aktion</TableHead>
              <TableHead>Ziel</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {log.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Noch keine Audit-Einträge.
                </TableCell>
              </TableRow>
            ) : log.map((eintrag) => (
              <TableRow key={eintrag.id}>
                <TableCell className="text-sm text-gray-500 whitespace-nowrap">{formatDate(eintrag.erstellt_am)}</TableCell>
                <TableCell className="text-sm font-medium text-gray-700">{eintrag.username}</TableCell>
                <TableCell>
                  <Badge className={`text-xs ${AKTION_FARBEN[eintrag.aktion] || "bg-gray-100 text-gray-600"}`}>
                    {eintrag.aktion}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {eintrag.ziel_typ}{eintrag.ziel_id ? ` #${eintrag.ziel_id.slice(0, 8)}` : ""}
                </TableCell>
                <TableCell className="text-xs text-gray-400 max-w-xs truncate">
                  {Object.keys(eintrag.details).length > 0 ? JSON.stringify(eintrag.details) : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
