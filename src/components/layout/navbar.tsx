"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Tractor, LogIn, LogOut, User, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAdmin } from "@/hooks/use-admin";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { istAdmin } = useAdmin();

  return (
    <nav className="sticky top-0 z-50 border-b border-green-200 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 group-hover:bg-green-700 transition-colors">
              <Tractor className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-green-900">
              {SITE_NAME}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === link.href
                    ? "bg-green-100 text-green-700"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    {istAdmin && (
                      <Link href="/admin">
                        <Button variant="outline" size="sm" className="border-green-300 text-green-700">
                          <Shield className="h-4 w-4" />
                          Admin
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-50 text-sm text-green-700 border border-green-200">
                      <User className="h-4 w-4" />
                      <span>{user.email?.split("@")[0]}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={signOut}>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="hidden md:block">
                    <Button variant="outline" size="sm">
                      <LogIn className="h-4 w-4" />
                      Anmelden
                    </Button>
                  </Link>
                )}
              </>
            )}

            <button
              className="md:hidden p-2 text-gray-500 hover:text-green-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-green-100 bg-white"
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-green-100">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-green-700 w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Abmelden
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:text-green-700"
                  >
                    <LogIn className="h-4 w-4" />
                    Anmelden
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
