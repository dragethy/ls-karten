import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

const PYTHON_SCRIPT = path.join(__dirname, "convert_dds.py");

export function convertDDS(inputPath: string, outputPath: string, format: "PNG" | "JPEG", minimap?: boolean): boolean {
  if (!existsSync(inputPath)) {
    console.warn(`  ⚠ DDS nicht gefunden: ${inputPath}`);
    return false;
  }

  try {
    const minimapArg = minimap ? " minimap" : "";
    execSync(`python "${PYTHON_SCRIPT}" "${inputPath}" "${outputPath}" ${format}${minimapArg}`, {
      stdio: "pipe",
    });
    return true;
  } catch (error) {
    console.warn(`  ⚠ Konvertierung fehlgeschlagen: ${inputPath}`);
    return false;
  }
}
