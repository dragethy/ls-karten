import AdmZip from "adm-zip";
import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

export function extractZip(zipPath: string, slug: string): string {
  const tempDir = mkdtempSync(path.join(tmpdir(), `ls-karten-${slug}-`));
  console.log(`  Entpacke nach: ${tempDir}`);

  const zip = new AdmZip(zipPath);
  zip.extractAllTo(tempDir, true);

  return tempDir;
}
