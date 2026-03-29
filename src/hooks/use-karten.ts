"use client";

import { create } from "zustand";
import type { KartenFilter } from "@/types/karte";

interface KartenStore {
  filter: KartenFilter;
  setFilter: (filter: Partial<KartenFilter>) => void;
  resetFilter: () => void;
}

const defaultFilter: KartenFilter = {
  suche: "",
  groesse: "alle",
  frucht: "alle",
  sortierung: "neueste",
};

export const useKartenStore = create<KartenStore>((set) => ({
  filter: defaultFilter,
  setFilter: (newFilter) =>
    set((state) => ({ filter: { ...state.filter, ...newFilter } })),
  resetFilter: () => set({ filter: defaultFilter }),
}));
