export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          clerk_user_id: string
          stripe_customer_id: string | null
          email: string
          name: string | null
          phone: string | null
          avatar_url: string | null
          plan: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          customer_id: string
          stripe_sub_id: string
          stripe_price_id: string | null
          plan_name: string | null
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      domains: {
        Row: {
          id: string
          customer_id: string
          domain: string
          registrar: string | null
          status: string
          expires_at: string | null
          auto_renew: boolean
          nameservers: string[] | null
          namecom_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['domains']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['domains']['Insert']>
      }
      mailboxes: {
        Row: {
          id: string
          customer_id: string
          domain_id: string | null
          address: string
          quota_mb: number
          status: string
          titan_account_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['mailboxes']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['mailboxes']['Insert']>
      }
      sites: {
        Row: {
          id: string
          customer_id: string
          domain_id: string | null
          name: string
          type: 'static' | 'wordpress' | 'nextjs' | 'ai_generated'
          platform: string | null
          deploy_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sites']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sites']['Insert']>
      }
      tickets: {
        Row: {
          id: string
          customer_id: string
          ticket_num: string
          subject: string
          message: string
          status: 'open' | 'in_progress' | 'waiting_admin' | 'waiting_client' | 'resolved' | 'closed'
          priority: 'low' | 'normal' | 'high' | 'urgent'
          category: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tickets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tickets']['Insert']>
      }
      ticket_replies: {
        Row: {
          id: string
          ticket_id: string
          author_clerk_id: string
          is_admin: boolean
          message: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['ticket_replies']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['ticket_replies']['Insert']>
      }
      billing_details: {
        Row: {
          id: string
          customer_id: string
          name: string | null
          vat: string | null
          address: string | null
          billing_email: string | null
          phone: string | null
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['billing_details']['Row'], 'id' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['billing_details']['Insert']>
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

// ── Convenience types ──
export type Customer     = Database['public']['Tables']['customers']['Row']
export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type Domain       = Database['public']['Tables']['domains']['Row']
export type Mailbox      = Database['public']['Tables']['mailboxes']['Row']
export type Site         = Database['public']['Tables']['sites']['Row']
export type Ticket       = Database['public']['Tables']['tickets']['Row']
export type TicketReply  = Database['public']['Tables']['ticket_replies']['Row']
