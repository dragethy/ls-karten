"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Map, Star, Users, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KartenGrid } from "@/components/karten/karten-grid";
import { DEMO_KARTEN } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-100/60 via-[#f8faf5] to-[#f8faf5]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-200/30 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-300 bg-green-50 text-green-700 text-sm mb-6">
              <Map className="h-4 w-4" />
              Landwirtschafts Simulator 25
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-950 leading-tight">
              Entdecke die besten{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-500">
                LS25 Karten
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              Finde deine perfekte Karte mit detaillierten Infos zu Fruechten,
              Produktionen, interaktiven Minimaps und Community-Bewertungen.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/karten">
                <Button size="lg" className="text-base">
                  Karten entdecken
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="text-base">
                  Kostenlos registrieren
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Map, label: "Karten", value: "4+" },
              { icon: Wheat, label: "Fruechte", value: "20+" },
              { icon: Star, label: "Bewertungen", value: "50+" },
              { icon: Users, label: "Community", value: "Wachsend" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-green-200 bg-white shadow-sm"
              >
                <stat.icon className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-900">{stat.value}</span>
                <span className="text-xs text-gray-500">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Maps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-green-900">Beliebte Karten</h2>
            <p className="text-gray-500 mt-1">
              Die am besten bewerteten Karten der Community
            </p>
          </div>
          <Link href="/karten">
            <Button variant="ghost">
              Alle ansehen
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <KartenGrid karten={DEMO_KARTEN.slice(0, 3)} />
      </section>
    </div>
  );
}
