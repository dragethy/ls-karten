import type { ExtrahierteDaten } from "../types.js";
import { parseFarmingSimulator } from "./farming-simulator.js";
import { parseForbiddenMods } from "./forbidden-mods.js";

type Parser = (html: string) => ExtrahierteDaten;

const PARSERS: Record<string, Parser> = {
  "www.farming-simulator.com": parseFarmingSimulator,
  "farming-simulator.com": parseFarmingSimulator,
  "forbidden-mods.de": parseForbiddenMods,
  "www.forbidden-mods.de": parseForbiddenMods,
};

export function getParser(url: string): { parser: Parser; hostname: string } {
  const hostname = new URL(url).hostname;
  const parser = PARSERS[hostname];

  if (!parser) {
    throw new Error(`Kein Parser für ${hostname} verfügbar. Unterstützt: ${Object.keys(PARSERS).join(", ")}`);
  }

  return { parser, hostname };
}
