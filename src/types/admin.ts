export type Rolle = "user" | "moderator" | "admin";

export interface Profil {
  id: string;
  username: string;
  avatar_url: string | null;
  rolle: Rolle;
}

export interface AdminStats {
  kartenGesamt: number;
  benutzerGesamt: number;
  bewertungenGesamt: number;
  kartenNeueWoche: number;
  bewertungenNeueWoche: number;
}

export interface BewertungMitDetails {
  id: string;
  karte_id: string;
  karte_name: string;
  karte_slug: string;
  user_id: string;
  username: string;
  sterne: number;
  kommentar: string;
  erstellt_am: string;
}

export type AuditAktion =
  | "karte.erstellt"
  | "karte.bearbeitet"
  | "karte.gelöscht"
  | "benutzer.rolle_geändert"
  | "bewertung.gelöscht";

export interface AuditEintrag {
  id: string;
  user_id: string | null;
  username: string;
  aktion: AuditAktion;
  ziel_typ: string;
  ziel_id: string | null;
  details: Record<string, unknown>;
  erstellt_am: string;
}

export interface BenutzerMitEmail {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  rolle: Rolle;
  erstellt_am: string;
}
