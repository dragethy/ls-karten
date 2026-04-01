"""Generiert universelle Frucht-Icons als farbige Kreise mit Buchstaben."""
from PIL import Image, ImageDraw, ImageFont
import os

dst = r"G:\Claude Code Projekte\LS-Karten\public\images\fruechte\universal"
os.makedirs(dst, exist_ok=True)

COLORS = {
    "getreide": "#D4A843",
    "oelpflanze": "#C4A02E",
    "gemuese": "#4CAF50",
    "obst": "#E65100",
    "kraeuter": "#7B1FA2",
    "futter": "#2E7D32",
    "nuss": "#795548",
    "spezial": "#0277BD",
    "industriell": "#455A64",
}

FRUECHTE = {
    "roggen": ("getreide", "Ro"), "rye": ("getreide", "Ro"),
    "dinkel": ("getreide", "Di"), "spelt": ("getreide", "Di"),
    "triticale": ("getreide", "Tr"),
    "winter-wheat": ("getreide", "WW"), "winterweizen": ("getreide", "WW"),
    "winter-barley": ("getreide", "WG"), "wintergerste": ("getreide", "WG"),
    "summer-wheat": ("getreide", "SW"), "sommerweizen": ("getreide", "SW"),
    "summer-barley": ("getreide", "SG"), "sommergerste": ("getreide", "SG"),
    "buckwheat": ("getreide", "Bu"),
    "millet": ("getreide", "Hi"),
    "centeno": ("getreide", "Ro"),

    "luzerne": ("futter", "Lu"), "alfalfa": ("futter", "Lu"),
    "klee": ("futter", "Kl"), "clover": ("futter", "Kl"),
    "teffgras": ("futter", "Te"), "teff-grass": ("futter", "Te"),
    "futterpappel": ("futter", "FP"), "alamo-forrajero": ("futter", "FP"),
    "feldgras": ("futter", "FG"), "field-grass": ("futter", "FG"),
    "wickroggen": ("futter", "WR"), "vetch-rye": ("futter", "WR"),
    "gruenroggen": ("futter", "GR"), "green-rye": ("futter", "GR"),
    "humusaktiv": ("futter", "Hu"), "humusactive": ("futter", "Hu"),
    "silage-maize": ("futter", "SM"), "silagemais": ("futter", "SM"),
    "flowering-catch-crop": ("futter", "BZ"),
    "meadow": ("futter", "Wi"),

    "senf": ("oelpflanze", "Se"), "mustard": ("oelpflanze", "Se"),
    "leinsamen": ("oelpflanze", "Le"), "linseed": ("oelpflanze", "Le"),
    "flachs": ("oelpflanze", "Fl"), "flax": ("oelpflanze", "Fl"),
    "sesam": ("oelpflanze", "Se"), "sesame": ("oelpflanze", "Se"),
    "mohn": ("oelpflanze", "Mo"), "poppy": ("oelpflanze", "Mo"),

    "linsen": ("gemuese", "Li"), "lentils": ("gemuese", "Li"),
    "kichererbsen": ("gemuese", "Ki"), "chickpeas": ("gemuese", "Ki"),
    "erdnuesse": ("gemuese", "Er"), "peanut": ("gemuese", "Er"),

    "hanf": ("industriell", "Ha"), "hemp": ("industriell", "Ha"),
    "tabak": ("industriell", "Ta"), "tobacco": ("industriell", "Ta"),
    "hopfen": ("industriell", "Ho"), "hops": ("industriell", "Ho"),

    "lavendel": ("kraeuter", "La"), "lavender": ("kraeuter", "La"), "lavanda": ("kraeuter", "La"),
    "minze": ("kraeuter", "Mi"), "mint": ("kraeuter", "Mi"), "menta": ("kraeuter", "Mi"),
    "thymian-rosmarin": ("kraeuter", "TR"), "tomilloromero": ("kraeuter", "TR"),

    "apfel": ("obst", "Ap"), "manzana": ("obst", "Ap"), "manzano": ("obst", "Ap"),
    "orange": ("obst", "Or"), "naranja": ("obst", "Or"), "naranjo": ("obst", "Or"),
    "kirsche": ("obst", "Ki"), "cereza": ("obst", "Ki"), "cerezo": ("obst", "Ki"),
    "pflaume": ("obst", "Pf"), "ciruela": ("obst", "Pf"), "ciruelo": ("obst", "Pf"),
    "birne": ("obst", "Bi"), "pera": ("obst", "Bi"), "peral": ("obst", "Bi"),
    "zitrone": ("obst", "Zi"), "limon": ("obst", "Zi"), "limonero": ("obst", "Zi"),
    "granatapfel": ("obst", "Gr"), "granada": ("obst", "Gr"), "granado": ("obst", "Gr"),
    "pfirsich": ("obst", "Pf"), "melocoton": ("obst", "Pf"), "melocotonero": ("obst", "Pf"),
    "quitte": ("obst", "Qu"), "membrillo": ("obst", "Qu"), "membrillero": ("obst", "Qu"),

    "eichel": ("nuss", "Ei"), "bellota": ("nuss", "Ei"), "encina": ("nuss", "Ei"),
    "kastanie": ("nuss", "Ka"), "castana": ("nuss", "Ka"), "castano": ("nuss", "Ka"),
    "mandel": ("nuss", "Ma"), "almendruco": ("nuss", "Ma"), "almendro": ("nuss", "Ma"),
    "walnuss": ("nuss", "Wa"), "nuez": ("nuss", "Wa"), "nogal": ("nuss", "Wa"),
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

generated = set()
for key, (category, letters) in FRUECHTE.items():
    filename = key + ".png"
    if filename in generated:
        continue
    generated.add(filename)

    color = hex_to_rgb(COLORS.get(category, "#607D8B"))

    img = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse([2, 2, 62, 62], fill=color)

    try:
        font = ImageFont.truetype("arial.ttf", 22)
    except:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), letters, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((64 - tw) / 2, (64 - th) / 2 - 2), letters, fill="white", font=font)

    img.save(os.path.join(dst, filename))

print(f"{len(generated)} Icons generiert")
