export interface Bewertung {
  id: string;
  karte_id: string;
  user_id: string;
  sterne: number;
  kommentar: string;
  erstellt_am: string;
  profile?: {
    username: string;
    avatar_url: string | null;
  };
}

export interface BewertungFormData {
  sterne: number;
  kommentar: string;
}
