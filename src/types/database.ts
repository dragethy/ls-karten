export interface Database {
  public: {
    Tables: {
      karten: {
        Row: {
          id: string;
          slug: string;
          name: string;
          beschreibung: string;
          autor: string;
          version: string;
          groesse: string;
          preview_url: string | null;
          minimap_url: string | null;
          screenshots: string[];
          fruechte: string[];
          produktionen: Record<string, unknown>[];
          pois: Record<string, unknown>[];
          download_url: string | null;
          quell_url: string | null;
          precision_farming: boolean;
          fakten: Record<string, unknown>;
          erstellt_am: string;
          aktualisiert_am: string;
        };
        Insert: Omit<Database["public"]["Tables"]["karten"]["Row"], "id" | "erstellt_am" | "aktualisiert_am">;
        Update: Partial<Database["public"]["Tables"]["karten"]["Insert"]>;
      };
      bewertungen: {
        Row: {
          id: string;
          karte_id: string;
          user_id: string;
          sterne: number;
          kommentar: string;
          erstellt_am: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bewertungen"]["Row"], "id" | "erstellt_am">;
        Update: Partial<Database["public"]["Tables"]["bewertungen"]["Insert"]>;
      };
      profile: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          rolle: "user" | "moderator" | "admin";
        };
        Insert: Database["public"]["Tables"]["profile"]["Row"];
        Update: Partial<Database["public"]["Tables"]["profile"]["Row"]>;
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          aktion: string;
          ziel_typ: string;
          ziel_id: string | null;
          details: Record<string, unknown>;
          erstellt_am: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_log"]["Row"], "id" | "erstellt_am">;
        Update: Partial<Database["public"]["Tables"]["audit_log"]["Insert"]>;
      };
    };
  };
}
