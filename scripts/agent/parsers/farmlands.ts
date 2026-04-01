import { readFileSync, existsSync } from "fs";

export function parseFarmlands(filePath: string): number {
  if (!existsSync(filePath)) return 0;

  const xml = readFileSync(filePath, "utf-8");
  const matches = xml.match(/<farmland\s/gi);
  return matches?.length || 0;
}
