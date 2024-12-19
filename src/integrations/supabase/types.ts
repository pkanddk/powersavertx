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
      plans: {
        Row: {
          base_charge: number | null
          company_id: string
          company_logo: string | null
          company_name: string
          company_tdu_name: string | null
          contract_length: number | null
          created_at: string | null
          detail_kwh1000: string | null
          detail_kwh2000: string | null
          detail_kwh500: string | null
          enroll_phone: string | null
          fact_sheet: string | null
          go_to_plan: string | null
          id: string
          jdp_rating: number | null
          jdp_rating_year: string | null
          minimum_usage: boolean | null
          new_customer: boolean | null
          plan_details: string | null
          plan_name: string
          plan_type_name: string
          prepaid: boolean | null
          price_kwh: number
          price_kwh1000: number
          price_kwh2000: number
          price_kwh500: number
          pricing_details: string | null
          promotions: string | null
          renewable_percentage: number | null
          terms_of_service: string | null
          timeofuse: boolean | null
          updated_at: string | null
          website: string | null
          yrac_url: string | null
          zip_code: string
        }
        Insert: {
          base_charge?: number | null
          company_id: string
          company_logo?: string | null
          company_name: string
          company_tdu_name?: string | null
          contract_length?: number | null
          created_at?: string | null
          detail_kwh1000?: string | null
          detail_kwh2000?: string | null
          detail_kwh500?: string | null
          enroll_phone?: string | null
          fact_sheet?: string | null
          go_to_plan?: string | null
          id?: string
          jdp_rating?: number | null
          jdp_rating_year?: string | null
          minimum_usage?: boolean | null
          new_customer?: boolean | null
          plan_details?: string | null
          plan_name: string
          plan_type_name: string
          prepaid?: boolean | null
          price_kwh: number
          price_kwh1000: number
          price_kwh2000: number
          price_kwh500: number
          pricing_details?: string | null
          promotions?: string | null
          renewable_percentage?: number | null
          terms_of_service?: string | null
          timeofuse?: boolean | null
          updated_at?: string | null
          website?: string | null
          yrac_url?: string | null
          zip_code: string
        }
        Update: {
          base_charge?: number | null
          company_id?: string
          company_logo?: string | null
          company_name?: string
          company_tdu_name?: string | null
          contract_length?: number | null
          created_at?: string | null
          detail_kwh1000?: string | null
          detail_kwh2000?: string | null
          detail_kwh500?: string | null
          enroll_phone?: string | null
          fact_sheet?: string | null
          go_to_plan?: string | null
          id?: string
          jdp_rating?: number | null
          jdp_rating_year?: string | null
          minimum_usage?: boolean | null
          new_customer?: boolean | null
          plan_details?: string | null
          plan_name?: string
          plan_type_name?: string
          prepaid?: boolean | null
          price_kwh?: number
          price_kwh1000?: number
          price_kwh2000?: number
          price_kwh500?: number
          pricing_details?: string | null
          promotions?: string | null
          renewable_percentage?: number | null
          terms_of_service?: string | null
          timeofuse?: boolean | null
          updated_at?: string | null
          website?: string | null
          yrac_url?: string | null
          zip_code?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          current_kwh_usage: string | null
          id: string
          renewable_preference: boolean | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          created_at?: string
          current_kwh_usage?: string | null
          id?: string
          renewable_preference?: boolean | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          created_at?: string
          current_kwh_usage?: string | null
          id?: string
          renewable_preference?: boolean | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
