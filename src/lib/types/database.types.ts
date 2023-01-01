export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      fantasy_teams: {
        Row: {
          captain_id: number
          created_at: string | null
          id: number
          name: string | null
          player_ids: number[]
        }
        Insert: {
          captain_id: number
          created_at?: string | null
          id?: number
          name?: string | null
          player_ids: number[]
        }
        Update: {
          captain_id?: number
          created_at?: string | null
          id?: number
          name?: string | null
          player_ids?: number[]
        }
      }
      players: {
        Row: {
          created_at: string
          id: number
          player_name: string
          price: number
        }
        Insert: {
          created_at?: string
          id?: number
          player_name: string
          price: number
        }
        Update: {
          created_at?: string
          id?: number
          player_name?: string
          price?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

