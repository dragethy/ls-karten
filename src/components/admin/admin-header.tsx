"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut, Shield, User } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/karten": "Karten",
  "/admin/benutzer": "Benutzer",
  "/admin/bewertungen": "Bewertungen",
  "/admin/audit-log": "Audit Log",
  "/admin/einstellungen": "Einstellungen",
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.includes("/karten/") && pathname.includes("/edit")) return "Karte bearbeiten";
  if (pathname.includes("/karten/neu")) return "Neue Karte";
  if (pathname.includes("/benutzer/")) return "Benutzer-Details";
  return "Admin";
}

export function AdminHeader() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { rolle } = useAdmin();

  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <h1 className="text-lg font-semibold text-gray-900">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-sm">
            <span className="font-medium text-gray-700">{user?.email?.split("@")[0]}</span>
            <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">
              <Shield className="h-3 w-3 mr-1" />
              {rolle}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
