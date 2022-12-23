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

