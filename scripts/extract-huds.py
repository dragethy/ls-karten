"""Extrahiert HUD-Icons aus allen lokalen Map-Ordnern und lädt sie nach public/images/fruechte/."""
import os
import sys
from PIL import Image

MAPS_DIR = r"G:\Claude Code Projekte\LS-Karten\maps"
LAUSITZ_DIR = r"C:\Users\Ralf Riebe\Documents\My Games\FarmingSimulator2025\mods\FS25_LausitzerLandschaften4x"
OUTPUT_DIR = r"G:\Claude Code Projekte\LS-Karten\public\images\fruechte"

# Slug -> HUDs Pfad
HUDS_DIRS = {}

# Lokale Maps durchsuchen
for entry in os.listdir(MAPS_DIR):
    map_path = os.path.join(MAPS_DIR, entry)
    if not os.path.isdir(map_path):
        continue
    # HUDs-Ordner finden
    for root, dirs, files in os.walk(map_path):
        for d in dirs:
            if d.lower() == "huds":
                hud_path = os.path.join(root, d)
                dds_count = len([f for f in os.listdir(hud_path) if f.startswith("hud_fill_") and f.endswith(".dds")])
                if dds_count > 0:
                    HUDS_DIRS[entry] = hud_path
                    break

# Lausitzer Landschaften separat
lausitz_huds = os.path.join(LAUSITZ_DIR, "multifruit", "huds")
if os.path.exists(lausitz_huds):
    HUDS_DIRS["FS25_LausitzerLandschaften4x"] = lausitz_huds

print(f"Maps mit HUD-Icons: {len(HUDS_DIRS)}")
for name, path in HUDS_DIRS.items():
    count = len([f for f in os.listdir(path) if f.startswith("hud_fill_") and f.endswith(".dds")])
    print(f"  {name}: {count} Icons")

# Alle Icons extrahieren
total = 0
seen = set()

for map_name, hud_dir in HUDS_DIRS.items():
    for filename in os.listdir(hud_dir):
        if not filename.startswith("hud_fill_") or not filename.endswith(".dds"):
            continue

        # Frucht-Key extrahieren (hud_fill_roggen.dds -> roggen)
        key = filename.replace("hud_fill_", "").replace(".dds", "").lower()

        # Überspringen wenn schon konvertiert (erste Map gewinnt)
        if key in seen:
            continue

        # Überspringen: Windrow, Cut, Fermented, etc. (nur Basis-Frucht-Icons)
        skip_suffixes = ["_windrow", "_cut", "_fermented", "_fiber", "_straw",
                        "bags", "bag", "oil", "flour", "sauce", "soup", "rolls",
                        "butter", "puffs", "juice", "dry"]
        if any(key.endswith(s) for s in skip_suffixes):
            continue

        input_path = os.path.join(hud_dir, filename)
        output_path = os.path.join(OUTPUT_DIR, f"{key}.png")

        try:
            img = Image.open(input_path).convert("RGBA")
            img = img.resize((64, 64), Image.LANCZOS)
            img.save(output_path)
            seen.add(key)
            total += 1
        except Exception as e:
            print(f"  Fehler bei {filename}: {e}")

print(f"\n{total} Icons extrahiert nach {OUTPUT_DIR}")
