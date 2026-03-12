export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          client_id: string | null
          created_at: string
          id: string
          timestamp: string
          type: string
        }
        Insert: {
          action: string
          client_id?: string | null
          created_at?: string
          id?: string
          timestamp?: string
          type: string
        }
        Update: {
          action?: string
          client_id?: string | null
          created_at?: string
          id?: string
          timestamp?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_agents: {
        Row: {
          created_at: string
          description: string | null
          id: string
          last_run: string | null
          model: string
          name: string
          progress: number | null
          status: string
          task: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          last_run?: string | null
          model: string
          name: string
          progress?: number | null
          status: string
          task: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          last_run?: string | null
          model?: string
          name?: string
          progress?: number | null
          status?: string
          task?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_kpis: {
        Row: {
          client_id: string
          created_at: string
          goal: string
          id: string
          progress: number | null
          status: string
        }
        Insert: {
          client_id: string
          created_at?: string
          goal: string
          id?: string
          progress?: number | null
          status: string
        }
        Update: {
          client_id?: string
          created_at?: string
          goal?: string
          id?: string
          progress?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_kpis_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          contact_name: string | null
          contact_role: string | null
          created_at: string
          description: string | null
          health_score: number | null
          id: string
          industry: string
          location: string | null
          logo: string | null
          name: string
          revenue: string | null
          updated_at: string
        }
        Insert: {
          contact_name?: string | null
          contact_role?: string | null
          created_at?: string
          description?: string | null
          health_score?: number | null
          id?: string
          industry: string
          location?: string | null
          logo?: string | null
          name: string
          revenue?: string | null
          updated_at?: string
        }
        Update: {
          contact_name?: string | null
          contact_role?: string | null
          created_at?: string
          description?: string | null
          health_score?: number | null
          id?: string
          industry?: string
          location?: string | null
          logo?: string | null
          name?: string
          revenue?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      deliverables: {
        Row: {
          audience: string | null
          client_id: string
          client_name: string
          created_at: string
          download_url: string | null
          format: string | null
          id: string
          status: string
          type: string
        }
        Insert: {
          audience?: string | null
          client_id: string
          client_name: string
          created_at?: string
          download_url?: string | null
          format?: string | null
          id?: string
          status: string
          type: string
        }
        Update: {
          audience?: string | null
          client_id?: string
          client_name?: string
          created_at?: string
          download_url?: string | null
          format?: string | null
          id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          client_id: string
          created_at: string
          extraction_status: string
          id: string
          name: string
          size: string | null
          type: string
          updated_at: string
          upload_date: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          extraction_status: string
          id?: string
          name: string
          size?: string | null
          type: string
          updated_at?: string
          upload_date?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          extraction_status?: string
          id?: string
          name?: string
          size?: string | null
          type?: string
          updated_at?: string
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          client_id: string
          client_name: string
          created_at: string
          due_date: string | null
          id: string
          phase: string
          progress: number | null
          start_date: string | null
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          client_id: string
          client_name: string
          created_at?: string
          due_date?: string | null
          id?: string
          phase: string
          progress?: number | null
          start_date?: string | null
          status: string
          type: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          client_name?: string
          created_at?: string
          due_date?: string | null
          id?: string
          phase?: string
          progress?: number | null
          start_date?: string | null
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      insights: {
        Row: {
          client_id: string
          client_name: string
          created_at: string
          description: string | null
          id: string
          is_read: boolean | null
          severity: string
          source: string | null
          timestamp: string
          title: string
        }
        Insert: {
          client_id: string
          client_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          severity: string
          source?: string | null
          timestamp?: string
          title: string
        }
        Update: {
          client_id?: string
          client_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_read?: boolean | null
          severity?: string
          source?: string | null
          timestamp?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "insights_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      playbooks: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          success_rate: number | null
          times_used: number | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          success_rate?: number | null
          times_used?: number | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          success_rate?: number | null
          times_used?: number | null
          title?: string
        }
        Relationships: []
      }
      strategies: {
        Row: {
          client_id: string
          cost_change: string | null
          created_at: string
          description: string | null
          id: string
          impact_score: number | null
          investment_level: string | null
          label: string
          revenue_change: string | null
          risk_score: number | null
          roi_breakeven: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          cost_change?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number | null
          investment_level?: string | null
          label: string
          revenue_change?: string | null
          risk_score?: number | null
          roi_breakeven?: string | null
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          cost_change?: string | null
          created_at?: string
          description?: string | null
          id?: string
          impact_score?: number | null
          investment_level?: string | null
          label?: string
          revenue_change?: string | null
          risk_score?: number | null
          roi_breakeven?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "strategies_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
