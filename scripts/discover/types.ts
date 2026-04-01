export interface ModHubEntry {
  mod_id: string;
  name: string;
  autor: string;
  bewertung: number;
  detail_url: string;
  bild_url: string | null;
}

export interface DiscoverResult {
  neue: ModHubEntry[];
  bekannte: string[];
  gesamt: number;
}
