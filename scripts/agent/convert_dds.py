"""DDS to PNG/JPEG converter using Pillow."""
import sys
from PIL import Image

if len(sys.argv) < 4:
    print("Usage: python convert_dds.py <input.dds> <output.png|jpg> <format: PNG|JPEG> [minimap]")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]
fmt = sys.argv[3].upper()
is_minimap = len(sys.argv) > 4 and sys.argv[4] == "minimap"

img = Image.open(input_path)
if fmt == "JPEG":
    img = img.convert("RGB")
else:
    img = img.convert("RGBA")

# Minimap: Immer die Hälfte der Pixel von der Mitte, dann auf 2048x2048 skalieren
if is_minimap:
    w, h = img.size
    crop_size = w // 2
    cx, cy = w // 2, h // 2
    half = crop_size // 2
    img = img.crop((cx - half, cy - half, cx + half, cy + half))
    if img.size[0] != 2048:
        img = img.resize((2048, 2048), Image.LANCZOS)

# Für HUD-Icons: auf 64x64 skalieren
elif "hud" in input_path.lower() or img.size[0] <= 256:
    img = img.resize((64, 64), Image.LANCZOS)

img.save(output_path, fmt, quality=85)
print(f"OK: {output_path} ({img.size[0]}x{img.size[1]})")
