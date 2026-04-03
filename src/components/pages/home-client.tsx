"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Map, Star, Users, Wheat, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KartenGrid } from "@/components/karten/karten-grid";
import type { Karte } from "@/types/karte";

interface HomeClientProps {
  karten: Karte[];
}

export function HomeClient({ karten }: HomeClientProps) {
  return (
    <div>
      {/* Hero Section — Gaming UI */}
      <section className="relative overflow-hidden min-h-[550px] lg:min-h-[650px]">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-landscape.png"
            alt="Landwirtschaftliche Landschaft"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-[#f8faf5]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 text-white text-sm mb-6 shadow-lg">
              <Gamepad2 className="h-4 w-4" />
              Landwirtschafts Simulator 25
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-lg">
              Entdecke die besten{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-green-100">
                LS25 Karten
              </span>
            </h1>

            <p className="mt-6 text-lg text-white/85 max-w-2xl mx-auto drop-shadow">
              Finde deine perfekte Karte mit detaillierten Infos zu Früchten,
              Produktionen, interaktiven Minimaps und Community-Bewertungen.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/karten">
                <Button size="lg" className="rounded-2xl text-base font-bold bg-green-500 hover:bg-green-600 shadow-[0_0_0_1px_rgba(46,174,93,.12),0_18px_50px_rgba(46,174,93,.2)] px-6">
                  Karten entdecken
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="ghost" size="lg" className="rounded-2xl text-base font-semibold text-white border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6">
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
              { icon: Map, label: "Karten", value: "11" },
              { icon: Wheat, label: "Zusatzfrüchte", value: "30+" },
              { icon: Star, label: "Bewertungen", value: "50+" },
              { icon: Users, label: "Community", value: "Wachsend" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/15 shadow-lg"
              >
                <stat.icon className="h-5 w-5 text-green-300" />
                <span className="text-2xl font-black text-white">{stat.value}</span>
                <span className="text-xs text-white/70">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Maps */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-green-950">Beliebte Karten</h2>
            <p className="text-gray-500 mt-1">
              Die neuesten Karten der Community
            </p>
          </div>
          <Link href="/karten">
            <Button variant="ghost" className="font-semibold">
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
