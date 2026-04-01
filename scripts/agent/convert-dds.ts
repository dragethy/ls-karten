import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

const PYTHON_SCRIPT = path.join(__dirname, "convert_dds.py");

export function convertDDS(inputPath: string, outputPath: string, format: "PNG" | "JPEG"): boolean {
  if (!existsSync(inputPath)) {
    console.warn(`  ⚠ DDS nicht gefunden: ${inputPath}`);
    return false;
  }

  try {
    execSync(`python "${PYTHON_SCRIPT}" "${inputPath}" "${outputPath}" ${format}`, {
      stdio: "pipe",
    });
    return true;
  } catch (error) {
    console.warn(`  ⚠ Konvertierung fehlgeschlagen: ${inputPath}`);
    return false;
  }
}
