import { readFileSync, existsSync } from "fs";
import { supabaseAdmin } from "../lib/supabase-admin.js";

const BUCKET = "karten-bilder";

async function uploadFile(filePath: string, storagePath: string): Promise<string | null> {
  if (!existsSync(filePath)) return null;

  const fileData = readFileSync(filePath);
  const contentType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(storagePath, fileData, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.warn(`  ⚠ Upload fehlgeschlagen (${storagePath}): ${error.message}`);
    return null;
  }

  const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function uploadImages(
  slug: string,
  minimapPath: string | null,
  previewPath: string | null,
  hudPaths: Array<{ name: string; path: string }>
): Promise<{
  minimap_url: string | null;
  preview_url: string | null;
  hud_urls: Record<string, string>;
}> {
  console.log("  Lade Bilder hoch...");

  const minimap_url = minimapPath
    ? await uploadFile(minimapPath, `${slug}/minimap.png`)
    : null;

  const preview_url = previewPath
    ? await uploadFile(previewPath, `${slug}/preview.jpg`)
    : null;

  const hud_urls: Record<string, string> = {};
  for (const hud of hudPaths) {
    const url = await uploadFile(hud.path, `${slug}/huds/${hud.name}.png`);
    if (url) hud_urls[hud.name] = url;
  }

  const count = (minimap_url ? 1 : 0) + (preview_url ? 1 : 0) + Object.keys(hud_urls).length;
  console.log(`  ${count} Bilder hochgeladen`);

  return { minimap_url, preview_url, hud_urls };
}
