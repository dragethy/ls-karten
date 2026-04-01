"""DDS to PNG/JPEG converter using Pillow."""
import sys
from PIL import Image

if len(sys.argv) < 4:
    print("Usage: python convert_dds.py <input.dds> <output.png|jpg> <format: PNG|JPEG>")
    sys.exit(1)

input_path = sys.argv[1]
output_path = sys.argv[2]
fmt = sys.argv[3].upper()

img = Image.open(input_path)
if fmt == "JPEG":
    img = img.convert("RGB")
else:
    img = img.convert("RGBA")

# Für HUD-Icons: auf 64x64 skalieren
if "hud" in input_path.lower() or img.size[0] <= 256:
    img = img.resize((64, 64), Image.LANCZOS)

img.save(output_path, fmt, quality=85)
print(f"OK: {output_path}")
