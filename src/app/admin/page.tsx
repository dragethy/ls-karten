import { getAdminStats, getAuditLog } from "@/lib/admin-queries";
import { Map, Users, Star, TrendingUp, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, auditLog] = await Promise.all([
    getAdminStats(),
    getAuditLog(10),
  ]);

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Map} label="Karten" value={stats.kartenGesamt} sub={`+${stats.kartenNeueWoche} diese Woche`} color="text-green-600 bg-green-100" />
        <StatCard icon={Users} label="Benutzer" value={stats.benutzerGesamt} color="text-blue-600 bg-blue-100" />
        <StatCard icon={Star} label="Bewertungen" value={stats.bewertungenGesamt} sub={`+${stats.bewertungenNeueWoche} diese Woche`} color="text-amber-600 bg-amber-100" />
        <StatCard icon={TrendingUp} label="Aktiv" value={stats.kartenNeueWoche + stats.bewertungenNeueWoche} sub="Änderungen diese Woche" color="text-purple-600 bg-purple-100" />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Schnellaktionen</h2>
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/karten/neu">
              <Button size="sm"><Plus className="h-4 w-4" /> Neue Karte</Button>
            </Link>
            <Link href="/admin/karten">
              <Button variant="outline" size="sm"><Map className="h-4 w-4" /> Karten verwalten</Button>
            </Link>
            <Link href="/admin/benutzer">
              <Button variant="outline" size="sm"><Users className="h-4 w-4" /> Benutzer verwalten</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Letzte Aktivitäten</h2>
            <Link href="/admin/audit-log">
              <Button variant="ghost" size="sm">Alle ansehen</Button>
            </Link>
          </div>
          {auditLog.length === 0 ? (
            <p className="text-sm text-gray-500">Noch keine Aktivitäten.</p>
          ) : (
            <div className="space-y-2">
              {auditLog.map((eintrag) => (
                <div key={eintrag.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <RefreshCw className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-gray-700 flex-1">
                    <strong>{eintrag.username}</strong> — {eintrag.aktion} ({eintrag.ziel_typ})
                  </span>
                  <span className="text-gray-400 text-xs shrink-0">{formatDate(eintrag.erstellt_am)}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: number; sub?: string; color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color} shrink-0 shadow-sm`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-2xl font-black text-green-950">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
