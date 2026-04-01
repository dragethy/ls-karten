import { createWriteStream, mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

export async function downloadZip(url: string, slug: string): Promise<string> {
  const tempDir = mkdtempSync(path.join(tmpdir(), `ls-karten-dl-${slug}-`));
  const zipPath = path.join(tempDir, `${slug}.zip`);

  console.log(`  Lade herunter: ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "LS-Karten.de Agent/1.0",
      "Accept": "application/zip,application/octet-stream,*/*",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Download fehlgeschlagen: HTTP ${response.status}`);
  }

  const body = response.body;
  if (!body) throw new Error("Kein Response-Body");

  const nodeStream = Readable.fromWeb(body as import("stream/web").ReadableStream);
  await pipeline(nodeStream, createWriteStream(zipPath));

  const sizeBytes = (await import("fs")).statSync(zipPath).size;
  console.log(`  Heruntergeladen: ${(sizeBytes / 1024 / 1024).toFixed(1)} MB`);

  return zipPath;
}
