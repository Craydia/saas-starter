export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string | null
          password: string | null
          email_verified: string | null
          image: string | null
          created_at: string
          updated_at: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          stripe_current_period_end: string | null
          stripe_payment_id: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          password?: string | null
          email_verified?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          stripe_current_period_end?: string | null
          stripe_payment_id?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          password?: string | null
          email_verified?: string | null
          image?: string | null
          created_at?: string
          updated_at?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          stripe_current_period_end?: string | null
          stripe_payment_id?: string | null
        }
      }
      accounts: {
        Row: {
          id: string
          user_id: string
          type: string
          provider: string
          provider_account_id: string
          refresh_token: string | null
          access_token: string | null
          expires_at: number | null
          token_type: string | null
          scope: string | null
          id_token: string | null
          session_state: string | null
          created_at: string
          updated_at: string
          business_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          created_at?: string
          updated_at?: string
          business_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          access_token?: string | null
          expires_at?: number | null
          token_type?: string | null
          scope?: string | null
          id_token?: string | null
          session_state?: string | null
          created_at?: string
          updated_at?: string
          business_id?: string | null
        }
      }
      sessions: {
        Row: {
          id: string
          session_token: string
          user_id: string
          expires: string
        }
        Insert: {
          id?: string
          session_token: string
          user_id: string
          expires: string
        }
        Update: {
          id?: string
          session_token?: string
          user_id?: string
          expires?: string
        }
      }
      verification_tokens: {
        Row: {
          identifier: string
          token: string
          expires: string
        }
        Insert: {
          identifier: string
          token: string
          expires: string
        }
        Update: {
          identifier?: string
          token?: string
          expires?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          created_at?: string
          updated_at?: string
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