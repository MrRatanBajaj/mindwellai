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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ai_counseling_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          message_type: string | null
          metadata: Json | null
          sender: string
          session_id: string
          timestamp: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          message_type?: string | null
          metadata?: Json | null
          sender: string
          session_id: string
          timestamp?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          message_type?: string | null
          metadata?: Json | null
          sender?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_ai_counseling_messages_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_counseling_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      ai_counseling_sessions: {
        Row: {
          counselor_id: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          session_id: string
          session_type: string
          started_at: string
          status: string
          updated_at: string
          urgency_level: string | null
          user_id: string | null
        }
        Insert: {
          counselor_id: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_id: string
          session_type: string
          started_at?: string
          status?: string
          updated_at?: string
          urgency_level?: string | null
          user_id?: string | null
        }
        Update: {
          counselor_id?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          session_id?: string
          session_type?: string
          started_at?: string
          status?: string
          updated_at?: string
          urgency_level?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          ip_address: unknown
          page_url: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string | null
          table_name: string
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id?: string | null
          table_name: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string | null
          table_name?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          concerns: string | null
          created_at: string
          duration_minutes: number | null
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          scheduled_date: string
          scheduled_time: string
          session_type: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          concerns?: string | null
          created_at?: string
          duration_minutes?: number | null
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          scheduled_date: string
          scheduled_time: string
          session_type?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          concerns?: string | null
          created_at?: string
          duration_minutes?: number | null
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          scheduled_date?: string
          scheduled_time?: string
          session_type?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          email: string | null
          feedback: string
          id: string
          name: string | null
          rating: number | null
          suggestions: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          email?: string | null
          feedback: string
          id?: string
          name?: string | null
          rating?: number | null
          suggestions?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          email?: string | null
          feedback?: string
          id?: string
          name?: string | null
          rating?: number | null
          suggestions?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          availability: string | null
          cover_letter: string | null
          created_at: string
          current_company: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          linkedin_url: string | null
          location: string
          phone: string
          portfolio_url: string | null
          position: string
          referral_source: string | null
          resume_url: string | null
          salary_expectation: string | null
          skills: string[] | null
          status: string | null
          updated_at: string
          why_join: string | null
        }
        Insert: {
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          current_company?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          linkedin_url?: string | null
          location: string
          phone: string
          portfolio_url?: string | null
          position: string
          referral_source?: string | null
          resume_url?: string | null
          salary_expectation?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
          why_join?: string | null
        }
        Update: {
          availability?: string | null
          cover_letter?: string | null
          created_at?: string
          current_company?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          linkedin_url?: string | null
          location?: string
          phone?: string
          portfolio_url?: string | null
          position?: string
          referral_source?: string | null
          resume_url?: string | null
          salary_expectation?: string | null
          skills?: string[] | null
          status?: string | null
          updated_at?: string
          why_join?: string | null
        }
        Relationships: []
      }
      medication_orders: {
        Row: {
          created_at: string
          delivery_address: string | null
          id: string
          medication_id: string
          prescription_id: string | null
          quantity: number
          status: string
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          medication_id: string
          prescription_id?: string | null
          quantity: number
          status?: string
          total_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_address?: string | null
          id?: string
          medication_id?: string
          prescription_id?: string | null
          quantity?: number
          status?: string
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medication_orders_medication_id_fkey"
            columns: ["medication_id"]
            isOneToOne: false
            referencedRelation: "medications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "medication_orders_prescription_id_fkey"
            columns: ["prescription_id"]
            isOneToOne: false
            referencedRelation: "prescriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          dosage: string | null
          id: string
          image_url: string | null
          manufacturer: string | null
          name: string
          price: number
          requires_prescription: boolean
          stock_quantity: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          dosage?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name: string
          price: number
          requires_prescription?: boolean
          stock_quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          dosage?: string | null
          id?: string
          image_url?: string | null
          manufacturer?: string | null
          name?: string
          price?: number
          requires_prescription?: boolean
          stock_quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      memorial_chat_messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          sender_type: string
          session_id: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          sender_type: string
          session_id: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "memorial_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_chat_sessions: {
        Row: {
          created_at: string
          id: string
          memorial_id: string
          session_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          memorial_id: string
          session_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          memorial_id?: string
          session_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memorial_chat_sessions_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorial_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_memories: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          memorial_id: string
          memory_type: string
          title: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          memorial_id: string
          memory_type: string
          title?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          memorial_id?: string
          memory_type?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memorial_memories_memorial_id_fkey"
            columns: ["memorial_id"]
            isOneToOne: false
            referencedRelation: "memorial_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      memorial_profiles: {
        Row: {
          biography: string | null
          created_at: string
          id: string
          name: string
          personality_traits: string[] | null
          profile_image_url: string | null
          relationship: string
          updated_at: string
          user_id: string
          voice_id: string | null
        }
        Insert: {
          biography?: string | null
          created_at?: string
          id?: string
          name: string
          personality_traits?: string[] | null
          profile_image_url?: string | null
          relationship: string
          updated_at?: string
          user_id: string
          voice_id?: string | null
        }
        Update: {
          biography?: string | null
          created_at?: string
          id?: string
          name?: string
          personality_traits?: string[] | null
          profile_image_url?: string | null
          relationship?: string
          updated_at?: string
          user_id?: string
          voice_id?: string | null
        }
        Relationships: []
      }
      mindwellai: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      prescriptions: {
        Row: {
          ai_verification_result: Json | null
          created_at: string
          doctor_license: string | null
          doctor_name: string | null
          expires_at: string | null
          id: string
          prescription_image_url: string
          updated_at: string
          user_id: string
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          ai_verification_result?: Json | null
          created_at?: string
          doctor_license?: string | null
          doctor_name?: string | null
          expires_at?: string | null
          id?: string
          prescription_image_url: string
          updated_at?: string
          user_id: string
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          ai_verification_result?: Json | null
          created_at?: string
          doctor_license?: string | null
          doctor_name?: string | null
          expires_at?: string | null
          id?: string
          prescription_image_url?: string
          updated_at?: string
          user_id?: string
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          device_info: string | null
          endpoint: string
          id: string
          p256dh_key: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          auth_key: string
          created_at?: string
          device_info?: string | null
          endpoint: string
          id?: string
          p256dh_key: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          auth_key?: string
          created_at?: string
          device_info?: string | null
          endpoint?: string
          id?: string
          p256dh_key?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      session_messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          id: string
          role: string
          session_id: string
          timestamp: string
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          session_id: string
          timestamp?: string
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          session_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "therapy_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      therapy_sessions: {
        Row: {
          counselor_name: string
          created_at: string
          duration_seconds: number | null
          ended_at: string | null
          id: string
          session_type: string
          specialty: string | null
          started_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          counselor_name: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          session_type: string
          specialty?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          counselor_name?: string
          created_at?: string
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          session_type?: string
          specialty?: string | null
          started_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity: string
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_chat_sessions: {
        Row: {
          duration_seconds: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          participants_count: number | null
          session_id: string
          started_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          participants_count?: number | null
          session_id: string
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          participants_count?: number | null
          session_id?: string
          started_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sessions: { Args: never; Returns: number }
      log_security_event: {
        Args: {
          p_event_type: string
          p_ip_address?: unknown
          p_metadata?: Json
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: string
      }
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
