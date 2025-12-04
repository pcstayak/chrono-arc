/**
 * Database schema types
 * This file defines the shape of data in Supabase
 *
 * TODO: Generate this file automatically from Supabase schema using:
 * npx supabase gen types typescript --project-id <project-id> > types/database.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          room_code: string;
          created_at: string;
          updated_at: string;
          is_active: boolean;
          max_players: number;
        };
        Insert: {
          id?: string;
          room_code: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          max_players?: number;
        };
        Update: {
          id?: string;
          room_code?: string;
          created_at?: string;
          updated_at?: string;
          is_active?: boolean;
          max_players?: number;
        };
      };
      players: {
        Row: {
          id: string;
          session_id: string;
          display_name: string;
          color: string;
          joined_at: string;
          last_active_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          display_name: string;
          color: string;
          joined_at?: string;
          last_active_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          display_name?: string;
          color?: string;
          joined_at?: string;
          last_active_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string;
          year: number;
          era: string;
          tags: string[];
          image_url: string | null;
          difficulty: number;
          content: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          year: number;
          era: string;
          tags?: string[];
          image_url?: string | null;
          difficulty?: number;
          content?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          year?: number;
          era?: string;
          tags?: string[];
          image_url?: string | null;
          difficulty?: number;
          content?: Json;
          created_at?: string;
        };
      };
      session_events: {
        Row: {
          id: string;
          session_id: string;
          event_id: string;
          state: string;
          position: number;
          placed_by_player_id: string | null;
          placed_at: string | null;
          attack_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          event_id: string;
          state?: string;
          position: number;
          placed_by_player_id?: string | null;
          placed_at?: string | null;
          attack_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          event_id?: string;
          state?: string;
          position?: number;
          placed_by_player_id?: string | null;
          placed_at?: string | null;
          attack_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
