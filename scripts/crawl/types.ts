export interface ExtrahierteDaten {
  version?: string;
  beschreibung?: string;
  downloads?: number;
  aktualisiert_am?: string;
  dateigroesse?: string;
}

export interface CrawlResult {
  slug: string;
  name: string;
  quell_url: string;
  quelle: string; // hostname
  daten?: ExtrahierteDaten;
  fehler?: string;
}

export interface Änderung {
  feld: string;
  alt: string;
  neu: string;
}

export interface ÄnderungsBericht {
  slug: string;
  name: string;
  quelle: string;
  änderungen: Änderung[];
  info: Record<string, string>; // informational fields (downloads, size)
  fehler?: string;
}
