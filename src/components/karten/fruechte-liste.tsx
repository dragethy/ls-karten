import Image from "next/image";
import { Wheat } from "lucide-react";

// Alle Standard-FS25-Früchte (interne englische + deutsche Namen)
const STANDARD_FRUECHTE = new Set([
  // Englische interne Namen (Base Game)
  "wheat", "barley", "oat", "canola", "maize", "sunflower", "soybean",
  "potato", "sugarbeet", "sugar beet", "sugarcane", "sugar cane",
  "cotton", "sorghum", "rice", "ricelonggrain", "rice long grain",
  "grape", "olive", "olives", "poplar", "beetroot", "beet root",
  "carrot", "parsnip", "greenbean", "green bean", "pea", "spinach",
  "grass", "oilseedradish", "oilseed radish", "meadow", "meadowus",
  "strawberry", "straw berry",
  "meadow a s", "meadowas", "meadow us", "meadowus",
  "meadow e u", "meadoweu",
  // Deutsche Namen
  "weizen", "gerste", "hafer", "raps", "mais", "sonnenblumen", "sojabohnen",
  "kartoffeln", "zuckerrüben", "zuckerrueben", "zuckerrohr", "baumwolle",
  "reis", "langkornreis", "trauben", "oliven", "pappel",
  "rote beete", "karotten", "pastinaken", "grüne bohnen", "erbsen",
  "spinat", "gras", "ölrettich", "wiese", "erdbeeren",
]);

// Übersetzung: englischer interner Name → deutscher Anzeigename (FS-Standard + Mod-Früchte)
const NAME_DE: Record<string, string> = {
  // Getreide (FS-Standard)
  "rye": "Roggen", "centeno": "Roggen",
  "spelt": "Dinkel",
  "triticale": "Triticale",
  "millet": "Hirse",
  "winter wheat": "Winterweizen", "winterwheat": "Winterweizen",
  "winter barley": "Wintergerste", "winterbarley": "Wintergerste",
  "summer wheat": "Sommerweizen", "summerwheat": "Sommerweizen",
  "summer barley": "Sommergerste", "summerbarley": "Sommergerste",
  "buckwheat": "Buchweizen",
  // Futterpflanzen
  "alfalfa": "Luzerne",
  "clover": "Klee",
  "teff grass": "Teffgras", "teffgrass": "Teffgras",
  "alamo forrajero": "Futterpappel", "alamoforrajero": "Futterpappel",
  "field grass": "Feldgras", "fieldgrass": "Feldgras",
  "vetch rye": "Wickroggen", "vetchrye": "Wickroggen",
  "green rye": "Grünroggen", "greenrye": "Grünroggen",
  "humusactive": "Humusaktiv",
  "silage maize": "Silage Mais", "silagemaize": "Silage Mais",
  "flowering catch crop": "Blühende Zwischenfrucht", "floweringcatchcrop": "Blühende Zwischenfrucht",
  "incarase grass": "Vermehrungsgras", "incarasegrass": "Vermehrungsgras",
  // Ölpflanzen / Gewürze
  "mustard": "Senf",
  "linseed": "Leinsamen",
  "flax": "Flachs",
  "sesame": "Sesam",
  "poppy": "Mohn",
  // Gemüse (FS-Standard)
  "garlic": "Knoblauch",
  "parsley": "Petersilie",
  "onion": "Zwiebeln",
  "redcabbage": "Rotkohl", "red cabbage": "Rotkohl",
  "whitecabbage": "Weißkohl", "white cabbage": "Weißkohl",
  "cauliflower": "Blumenkohl", "cauli flower": "Blumenkohl",
  "lettuce": "Salat",
  "tomato": "Tomaten",
  "cucumber": "Gurken",
  "paprika": "Paprika",
  "pepperoni": "Peperoni",
  "pumpkin": "Kürbis",
  "mushrooms": "Pilze",
  "cocoa": "Kakao",
  "cinnamon": "Zimt",
  // Hülsenfrüchte
  "lentils": "Linsen",
  "chickpeas": "Kichererbsen",
  "peanut": "Erdnüsse",
  // Industriell
  "hemp": "Hanf",
  "tobacco": "Tabak",
  "hops": "Hopfen",
  // Kräuter
  "lavender": "Lavendel", "lavanda": "Lavendel",
  "mint": "Minze", "menta": "Minze",
  "tomilloromero": "Thymian & Rosmarin", "thyme rosemary": "Thymian & Rosmarin",
  // Obst (FS-Standard)
  "apple": "Äpfel", "manzano": "Äpfel", "manzana": "Äpfel",
  "orange": "Orangen", "naranjo": "Orangen", "naranja": "Orangen",
  "cherry": "Kirschen", "cerezo": "Kirschen", "cereza": "Kirschen",
  "plum": "Pflaumen", "ciruelo": "Pflaumen", "ciruela": "Pflaumen",
  "pear": "Birnen", "peral": "Birnen", "pera": "Birnen",
  "lemon": "Zitronen", "limonero": "Zitronen", "limon": "Zitronen",
  "granado": "Granatapfel", "granada": "Granatapfel",
  "peach": "Pfirsich", "melocotonero": "Pfirsich", "melocoton": "Pfirsich",
  "membrillero": "Quitte", "membrillo": "Quitte",
  "apricot": "Aprikose",
  "banana": "Bananen",
  "raspberry": "Himbeeren", "raspBerry": "Himbeeren",
  "kiwifruit": "Kiwi", "kiwi fruit": "Kiwi",
  "watermelon": "Wassermelone", "water melon": "Wassermelone",
  "cranberry": "Preiselbeeren", "cran berry": "Preiselbeeren",
  "coco": "Kokos",
  // Nüsse
  "encina": "Eichel", "bellota": "Eichel",
  "castano": "Kastanie", "castana": "Kastanie",
  "almendro": "Mandel", "almendruco": "Mandel",
  "nogal": "Walnuss", "nuez": "Walnuss",
};

function getDisplayName(name: string): string {
  const lower = name.toLowerCase().trim();
  if (NAME_DE[lower]) return NAME_DE[lower];
  // CamelCase aufteilen und erste Buchstaben groß
  return name
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function isStandard(name: string): boolean {
  const lower = name.toLowerCase().trim();
  return STANDARD_FRUECHTE.has(lower);
}

// Explizites Icon-Mapping: Fruchtname (lower) → Dateiname im universal-Ordner
const ICON_MAP: Record<string, string> = {
  // Getreide
  "roggen": "roggen", "rye": "rye", "centeno": "centeno",
  "dinkel": "dinkel", "spelt": "spelt",
  "triticale": "triticale",
  "hirse": "millet", "millet": "millet",
  "winterweizen": "winterwheat", "winter wheat": "winterwheat",
  "wintergerste": "winterbarley", "winter barley": "winterbarley",
  "sommerweizen": "summerwheat", "summer wheat": "summerwheat",
  "sommergerste": "summerbarley", "summer barley": "summerbarley",
  "buchweizen": "buckwheat", "buckwheat": "buckwheat",
  // Futter
  "luzerne": "luzerne", "alfalfa": "alfalfa",
  "klee": "klee", "clover": "clover",
  "teffgras": "teffgras", "teff grass": "teff-grass",
  "futterpappel": "futterpappel", "alamo forrajero": "alamo-forrajero",
  "feldgras": "fieldgrass", "field grass": "fieldgrass", "fieldgrass": "fieldgrass",
  "wickroggen": "vetchrye", "vetch rye": "vetchrye", "vetchrye": "vetchrye",
  "grünroggen": "greenrye", "green rye": "greenrye", "greenrye": "greenrye",
  "humusaktiv": "humusactive", "humusactive": "humusactive",
  "silage mais": "silagemaize", "silage maize": "silagemaize", "silagemaize": "silagemaize",
  "blühende zwischenfrucht": "floweringcatchcrop", "flowering catch crop": "floweringcatchcrop", "floweringcatchcrop": "floweringcatchcrop",
  "wiese": "meadow", "meadow": "meadow",
  // Ölpflanzen
  "senf": "senf", "mustard": "mustard",
  "leinsamen": "leinsamen", "linseed": "linseed",
  "flachs": "flachs", "flax": "flax",
  "sesam": "sesam", "sesame": "sesame",
  "mohn": "mohn", "poppy": "poppy",
  // Hülsenfrüchte
  "linsen": "linsen", "lentils": "lentils",
  "kichererbsen": "kichererbsen", "chickpeas": "chickpeas",
  "erdnüsse": "erdnuesse", "erdnuesse": "erdnuesse", "peanut": "peanut",
  // Industriell
  "hanf": "hanf", "hemp": "hemp",
  "tabak": "tabak", "tobacco": "tobacco",
  "hopfen": "hopfen", "hops": "hops",
  // Kräuter
  "lavendel": "lavendel", "lavender": "lavender", "lavanda": "lavanda",
  "minze": "minze", "mint": "mint", "menta": "menta",
  "thymian & rosmarin": "thymian-rosmarin", "tomilloromero": "tomilloromero",
  // Obst
  "äpfel": "apfel", "apfel": "apfel", "apple": "apfel", "manzano": "manzano", "manzana": "manzana",
  "orangen": "orange", "orange": "orange", "naranjo": "naranjo", "naranja": "naranja",
  "kirschen": "kirsche", "kirsche": "kirsche", "cherry": "cereza", "cerezo": "cerezo", "cereza": "cereza",
  "pflaumen": "pflaume", "pflaume": "pflaume", "plum": "ciruela", "ciruelo": "ciruelo", "ciruela": "ciruela",
  "birnen": "birne", "birne": "birne", "pear": "pera", "peral": "peral", "pera": "pera",
  "zitronen": "zitrone", "zitrone": "zitrone", "lemon": "limon", "limonero": "limonero", "limon": "limon",
  "granatapfel": "granatapfel", "granada": "granada", "granado": "granado",
  "pfirsich": "pfirsich", "peach": "melocoton", "melocotonero": "melocotonero", "melocoton": "melocoton",
  "quitte": "quitte", "membrillero": "membrillero", "membrillo": "membrillo",
  // Nüsse
  "eichel": "eichel", "bellota": "bellota", "encina": "encina",
  "kastanie": "kastanie", "castana": "castana", "castano": "castano",
  "mandel": "mandel", "almendruco": "almendruco", "almendro": "almendro",
  "walnuss": "walnuss", "nuez": "nuez", "nogal": "nogal",
};

function getIconPath(name: string): string | null {
  const lower = name.toLowerCase().trim();
  const iconFile = ICON_MAP[lower];
  if (iconFile) {
    // Echte HUD-Icons zuerst (aus Mod-Dateien extrahiert), dann universelle
    return `/images/fruechte/${iconFile}.png`;
  }
  // Fallback: direkt den Namen als Dateinamen probieren
  const direct = lower.replace(/\s+/g, "").replace(/[äÄ]/g, "ae").replace(/[öÖ]/g, "oe").replace(/[üÜ]/g, "ue");
  return `/images/fruechte/${direct}.png`;
}

interface FruechteListeProps {
  fruechte: string[];
}

export function FruechteListe({ fruechte }: FruechteListeProps) {
  const zusatzFruechte = fruechte.filter((f) => !isStandard(f));

  if (zusatzFruechte.length === 0) {
    return (
      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
          <Wheat className="h-5 w-5 text-green-600" />
          Zusätzliche Früchte
        </h3>
        <p className="text-sm text-gray-500">Nur Standard-Früchte</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-green-900">
        <Wheat className="h-5 w-5 text-green-600" />
        Zusätzliche Früchte ({zusatzFruechte.length})
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {zusatzFruechte.map((frucht) => {
          const displayName = getDisplayName(frucht);
          const iconPath = getIconPath(frucht);
          return (
            <div
              key={frucht}
              className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-white p-2.5 shadow-sm hover:border-green-400 hover:shadow-md transition-all duration-200"
            >
              {iconPath ? (
                <Image
                  src={iconPath}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="rounded-full shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Wheat className="h-4 w-4 text-green-500" />
                </div>
              )}
              <span className="text-sm font-medium text-green-900">{displayName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
