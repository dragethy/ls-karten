"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useKartenStore } from "@/hooks/use-karten";
import { MAP_SIZES, FRUECHTE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function KartenFilter() {
  const { filter, setFilter, resetFilter } = useKartenStore();
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters =
    filter.groesse !== "alle" || filter.frucht !== "alle";

  return (
    <div className="space-y-4">
      {/* Search + Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Karte suchen..."
            value={filter.suche}
            onChange={(e) => setFilter({ suche: e.target.value })}
            className="pl-10"
          />
        </div>
        <Button
          variant={showFilters ? "secondary" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="relative"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Filter</span>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500" />
          )}
        </Button>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilter}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Expandable Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 space-y-4">
              {/* Map Size */}
              <div>
                <label className="text-sm font-medium text-green-900 mb-2 block">
                  Kartengroesse
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "cursor-pointer transition-colors",
                      filter.groesse === "alle"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-600 border-green-200 hover:bg-green-50"
                    )}
                    onClick={() => setFilter({ groesse: "alle" })}
                  >
                    Alle
                  </Badge>
                  {MAP_SIZES.map((size) => (
                    <Badge
                      key={size}
                      className={cn(
                        "cursor-pointer transition-colors",
                        filter.groesse === size
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-green-200 hover:bg-green-50"
                      )}
                      onClick={() => setFilter({ groesse: size })}
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Fruits */}
              <div>
                <label className="text-sm font-medium text-green-900 mb-2 block">
                  Frucht
                </label>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={cn(
                      "cursor-pointer transition-colors",
                      filter.frucht === "alle"
                        ? "bg-green-600 text-white border-green-600"
                        : "bg-white text-gray-600 border-green-200 hover:bg-green-50"
                    )}
                    onClick={() => setFilter({ frucht: "alle" })}
                  >
                    Alle
                  </Badge>
                  {FRUECHTE.map((frucht) => (
                    <Badge
                      key={frucht}
                      className={cn(
                        "cursor-pointer transition-colors",
                        filter.frucht === frucht
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-green-200 hover:bg-green-50"
                      )}
                      onClick={() => setFilter({ frucht })}
                    >
                      {frucht}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="text-sm font-medium text-green-900 mb-2 block">
                  Sortierung
                </label>
                <div className="flex flex-wrap gap-2">
                  {([
                    { value: "neueste", label: "Neueste" },
                    { value: "beliebteste", label: "Beliebteste" },
                    { value: "name", label: "Name A-Z" },
                  ] as const).map((option) => (
                    <Badge
                      key={option.value}
                      className={cn(
                        "cursor-pointer transition-colors",
                        filter.sortierung === option.value
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white text-gray-600 border-green-200 hover:bg-green-50"
                      )}
                      onClick={() => setFilter({ sortierung: option.value })}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
