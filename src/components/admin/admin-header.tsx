"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
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
    <header className="flex items-center justify-between px-6 py-3 border-b border-green-200/40 bg-white/80 backdrop-blur-xl">
      <h1 className="text-lg font-black text-green-950">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <User className="h-4 w-4 text-green-600" />
          </div>
          <div className="text-sm">
            <span className="font-medium text-green-950">{user?.email?.split("@")[0]}</span>
            <span className="ml-2 inline-flex items-center rounded-full bg-green-600 text-white px-2 py-0.5 text-[10px] font-bold">
              <Shield className="h-2.5 w-2.5 mr-1" />
              {rolle}
            </span>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-400 hover:text-red-500">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
