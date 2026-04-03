"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Users, Star, FileText, Settings, Tractor, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/karten", label: "Karten", icon: Map },
  { href: "/admin/benutzer", label: "Benutzer", icon: Users },
  { href: "/admin/bewertungen", label: "Bewertungen", icon: Star },
  { href: "/admin/audit-log", label: "Audit Log", icon: FileText },
  { href: "/admin/einstellungen", label: "Einstellungen", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-green-200/40 bg-white/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-green-200/40">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green-600 shadow-lg shadow-green-600/20">
          <Tractor className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-black text-green-950 text-sm tracking-tight">LS-Karten.de</span>
          <span className="block text-xs text-gray-400 font-medium">Admin Panel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-green-600 text-white shadow-md shadow-green-600/20"
                  : "text-gray-600 hover:bg-green-50 hover:text-green-700"
              )}
            >
              <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-white" : "text-gray-400")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-green-200/40">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-green-50 hover:text-green-700 transition-all font-medium"
        >
          <ExternalLink className="h-4 w-4" />
          Zur Webseite
        </Link>
      </div>
    </aside>
  );
}
