export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          likes: string[]
          parent_comment_id: string | null
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          likes?: string[]
          parent_comment_id?: string | null
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          likes?: string[]
          parent_comment_id?: string | null
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_creations: {
        Row: {
          content_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      group_creations: {
        Row: {
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      groups: {
        Row: {
          admin_id: string
          avatar: string | null
          created_date: string
          description: string
          id: string
          last_activity: string | null
          last_successful_meetup: string | null
          location_city: string | null
          location_lat: number | null
          location_lng: number | null
          location_region: string | null
          meetup_deadline: string | null
          member_ids: string[]
          member_limit: number
          name: string
          next_meetup_deadline: string | null
          pinned_post_id: string | null
          privacy: string
          status: string | null
          tags: string[]
          type: string
          warning_level: string | null
        }
        Insert: {
          admin_id: string
          avatar?: string | null
          created_date?: string
          description: string
          id?: string
          last_activity?: string | null
          last_successful_meetup?: string | null
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_region?: string | null
          meetup_deadline?: string | null
          member_ids?: string[]
          member_limit?: number
          name: string
          next_meetup_deadline?: string | null
          pinned_post_id?: string | null
          privacy?: string
          status?: string | null
          tags?: string[]
          type: string
          warning_level?: string | null
        }
        Update: {
          admin_id?: string
          avatar?: string | null
          created_date?: string
          description?: string
          id?: string
          last_activity?: string | null
          last_successful_meetup?: string | null
          location_city?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_region?: string | null
          meetup_deadline?: string | null
          member_ids?: string[]
          member_limit?: number
          name?: string
          next_meetup_deadline?: string | null
          pinned_post_id?: string | null
          privacy?: string
          status?: string | null
          tags?: string[]
          type?: string
          warning_level?: string | null
        }
        Relationships: []
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          expires_at: string
          id: string
          invitation_token: string
          invitee_email: string
          inviter_id: string
          status: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invitee_email: string
          inviter_id: string
          status?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          invitee_email?: string
          inviter_id?: string
          status?: string
        }
        Relationships: []
      }
      meetup_recaps: {
        Row: {
          content: string
          created_at: string
          id: string
          meetup_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          meetup_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          meetup_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_recaps_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
        ]
      }
      meetup_rsvps: {
        Row: {
          checked_in: boolean | null
          created_at: string
          id: string
          meetup_id: string
          status: string
          user_id: string
        }
        Insert: {
          checked_in?: boolean | null
          created_at?: string
          id?: string
          meetup_id: string
          status?: string
          user_id: string
        }
        Update: {
          checked_in?: boolean | null
          created_at?: string
          id?: string
          meetup_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetup_rsvps_meetup_id_fkey"
            columns: ["meetup_id"]
            isOneToOne: false
            referencedRelation: "meetups"
            referencedColumns: ["id"]
          },
        ]
      }
      meetups: {
        Row: {
          checkin_count: number
          created_at: string
          created_by: string
          date_time: string
          description: string | null
          group_id: string
          id: string
          location: string
          purpose: string
          rsvp_count: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          checkin_count?: number
          created_at?: string
          created_by: string
          date_time: string
          description?: string | null
          group_id: string
          id?: string
          location: string
          purpose?: string
          rsvp_count?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          checkin_count?: number
          created_at?: string
          created_by?: string
          date_time?: string
          description?: string | null
          group_id?: string
          id?: string
          location?: string
          purpose?: string
          rsvp_count?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meetups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      message_sends: {
        Row: {
          id: string
          sent_at: string
          user_id: string
        }
        Insert: {
          id?: string
          sent_at?: string
          user_id: string
        }
        Update: {
          id?: string
          sent_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          group_context_id: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          group_context_id: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          group_context_id?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_group_context_id_fkey"
            columns: ["group_context_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          created_at: string
          id: string
          meetup_notifications: string
          recap_notifications: string
          rsvp_notifications: string
          updated_at: string
          user_id: string
          warning_notifications: string
        }
        Insert: {
          created_at?: string
          id?: string
          meetup_notifications?: string
          recap_notifications?: string
          rsvp_notifications?: string
          updated_at?: string
          user_id: string
          warning_notifications?: string
        }
        Update: {
          created_at?: string
          id?: string
          meetup_notifications?: string
          recap_notifications?: string
          rsvp_notifications?: string
          updated_at?: string
          user_id?: string
          warning_notifications?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          channel: string
          created_at: string
          id: string
          message: string
          payload: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          message: string
          payload?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          message?: string
          payload?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          edited_at: string | null
          group_id: string
          id: string
          likes: string[]
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          edited_at?: string | null
          group_id: string
          id?: string
          likes?: string[]
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          edited_at?: string | null
          group_id?: string
          id?: string
          likes?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_groups: {
        Row: {
          anonymous_name: string
          group_id: string
          id: string
          join_date: string
          role: string
          user_id: string
        }
        Insert: {
          anonymous_name: string
          group_id: string
          id?: string
          join_date?: string
          role?: string
          user_id: string
        }
        Update: {
          anonymous_name?: string
          group_id?: string
          id?: string
          join_date?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_groups_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_interactions: {
        Row: {
          created_at: string
          group_id: string
          id: string
          interaction_type: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          group_id: string
          id?: string
          interaction_type: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          group_id?: string
          id?: string
          interaction_type?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interactions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          location_city: string | null
          location_coordinates: Json | null
          location_region: string | null
          selected_tags: string[] | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_city?: string | null
          location_coordinates?: Json | null
          location_region?: string | null
          selected_tags?: string[] | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          location_city?: string | null
          location_coordinates?: Json | null
          location_region?: string | null
          selected_tags?: string[] | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_send_invitation: {
        Args: { user_id: string; email: string }
        Returns: boolean
      }
      get_remaining_invites_for_user: {
        Args: { user_id: string }
        Returns: number
      }
      update_group_warning_levels: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
