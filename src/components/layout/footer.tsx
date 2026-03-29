import Link from "next/link";
import { Tractor } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-green-200 bg-green-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600">
                <Tractor className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-green-900">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-green-700/60">
              Die beste Sammlung von Karten fuer den Landwirtschafts Simulator 25.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-3">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-green-700/60 hover:text-green-700 transition-colors">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/karten" className="text-sm text-green-700/60 hover:text-green-700 transition-colors">
                  Alle Karten
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-3">Rechtliches</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/impressum" className="text-sm text-green-700/60 hover:text-green-700 transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="text-sm text-green-700/60 hover:text-green-700 transition-colors">
                  Datenschutz
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-green-200">
          <p className="text-center text-xs text-green-700/40">
            &copy; {new Date().getFullYear()} {SITE_NAME}. Nicht offiziell mit GIANTS Software verbunden.
          </p>
        </div>
      </div>
    </footer>
  );
}
