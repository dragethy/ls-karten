"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Map, Star, Users, Wheat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KartenGrid } from "@/components/karten/karten-grid";
import type { Karte } from "@/types/karte";

interface HomeClientProps {
  karten: Karte[];
}

export function HomeClient({ karten }: HomeClientProps) {
  return (
    <div>
      {/* Hero Section with Landscape Background */}
      <section className="relative overflow-hidden min-h-[600px] lg:min-h-[700px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-landscape.png"
            alt="Landwirtschaftliche Landschaft"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/90" />
        <div className="absolute inset-0 bg-white/30" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-400/40 bg-white/80 backdrop-blur-sm text-green-700 text-sm mb-6 shadow-sm">
              <Map className="h-4 w-4" />
              Landwirtschafts Simulator 25
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-green-950 leading-tight drop-shadow-sm">
              Entdecke die besten{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-green-500">
                LS25 Karten
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-2xl mx-auto drop-shadow-sm">
              Finde deine perfekte Karte mit detaillierten Infos zu Früchten,
              Produktionen, interaktiven Minimaps und Community-Bewertungen.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/karten">
                <Button size="lg" className="text-base shadow-lg shadow-green-600/25">
                  Karten entdecken
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="outline" size="lg" className="text-base bg-white/80 backdrop-blur-sm shadow-md">
                  Kostenlos registrieren
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Map, label: "Karten", value: "4+" },
              { icon: Wheat, label: "Früchte", value: "20+" },
              { icon: Star, label: "Bewertungen", value: "50+" },
              { icon: Users, label: "Community", value: "Wachsend" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-green-200/60 bg-white/85 backdrop-blur-sm shadow-sm"
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

        <KartenGrid karten={karten} />
      </section>
    </div>
  );
}
