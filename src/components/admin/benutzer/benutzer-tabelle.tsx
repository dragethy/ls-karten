"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Shield, ShieldCheck } from "lucide-react";
import { updateBenutzerRolle } from "@/lib/admin-actions";
import type { BenutzerMitEmail } from "@/types/admin";

const ROLLE_CONFIG = {
  admin: { label: "Admin", icon: ShieldCheck, color: "bg-green-100 text-green-700" },
  moderator: { label: "Moderator", icon: Shield, color: "bg-blue-100 text-blue-700" },
  user: { label: "User", icon: User, color: "bg-gray-100 text-gray-600" },
};

export function BenutzerTabelle({ benutzer }: { benutzer: BenutzerMitEmail[] }) {
  const [updating, setUpdating] = useState<string | null>(null);

  const handleRolleChange = async (userId: string, rolle: string) => {
    setUpdating(userId);
    try {
      await updateBenutzerRolle(userId, rolle);
      toast.success("Rolle geändert");
    } catch (error) {
      toast.error("Fehler: " + (error instanceof Error ? error.message : "Unbekannt"));
    }
    setUpdating(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">{benutzer.length} Benutzer</p>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Benutzer</TableHead>
              <TableHead>Rolle</TableHead>
              <TableHead>Rolle ändern</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {benutzer.map((b) => {
              const config = ROLLE_CONFIG[b.rolle];
              const Icon = config.icon;
              return (
                <TableRow key={b.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                        <User className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-900">{b.username}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${config.color} text-xs`}>
                      <Icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <select
                      className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-white"
                      value={b.rolle}
                      disabled={updating === b.id}
                      onChange={(e) => handleRolleChange(b.id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
