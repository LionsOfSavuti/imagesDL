export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      plants: {
        Row: { id: string; name: string; location: string; created_at: string }
        Insert: { id?: string; name: string; location: string; created_at?: string }
        Update: { id?: string; name?: string; location?: string; created_at?: string }
      }
      spare_parts: {
        Row: {
          id: string
          part_number: string
          name: string
          description: string | null
          category: string
          unit_price: number
          reorder_point: number
          quantity_on_hand: number
          plant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          part_number: string
          name: string
          description?: string | null
          category: string
          unit_price: number
          reorder_point: number
          quantity_on_hand?: number
          plant_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['spare_parts']['Insert']>
      }
      inventory_transactions: {
        Row: {
          id: string
          part_id: string
          transaction_type: string
          quantity: number
          notes: string | null
          plant_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          part_id: string
          transaction_type: string
          quantity: number
          notes?: string | null
          plant_id?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['inventory_transactions']['Insert']>
      }
      analytics_events: {
        Row: { id: string; event_type: string; event_data: Json | null; user_id: string | null; session_id: string | null; created_at: string }
        Insert: { id?: string; event_type: string; event_data?: Json | null; user_id?: string | null; session_id?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['analytics_events']['Insert']>
      }
      ai_recommendations: {
        Row: { id: string; part_id: string; recommendation_type: string; priority: 'high' | 'medium' | 'low'; suggested_action: string; reasoning: string | null; plant_id: string | null; created_at: string }
        Insert: { id?: string; part_id: string; recommendation_type: string; priority?: 'high' | 'medium' | 'low'; suggested_action: string; reasoning?: string | null; plant_id?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['ai_recommendations']['Insert']>
      }
      eoq_analysis: {
        Row: { id: string; part_id: string; annual_demand: number; ordering_cost: number; holding_cost_per_unit: number; economic_order_quantity: number; total_annual_cost: number; number_of_orders_per_year: number; plant_id: string | null; updated_at: string }
        Insert: { id?: string; part_id: string; annual_demand?: number; ordering_cost?: number; holding_cost_per_unit?: number; economic_order_quantity?: number; total_annual_cost?: number; number_of_orders_per_year?: number; plant_id?: string | null; updated_at?: string }
        Update: Partial<Database['public']['Tables']['eoq_analysis']['Insert']>
      }
      kraljic_analysis: {
        Row: { id: string; part_id: string; supply_risk: number; profit_impact: number; category: 'strategic' | 'leverage' | 'bottleneck' | 'noncritical'; plant_id: string | null; updated_at: string }
        Insert: { id?: string; part_id: string; supply_risk: number; profit_impact: number; category: 'strategic' | 'leverage' | 'bottleneck' | 'noncritical'; plant_id?: string | null; updated_at?: string }
        Update: Partial<Database['public']['Tables']['kraljic_analysis']['Insert']>
      }
      demand_forecasts: {
        Row: { id: string; part_id: string; forecast_date: string; predicted_demand: number; confidence_interval: number; plant_id: string | null; created_at: string }
        Insert: { id?: string; part_id: string; forecast_date: string; predicted_demand?: number; confidence_interval?: number; plant_id?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['demand_forecasts']['Insert']>
      }
      maintenance_predictions: {
        Row: { id: string; part_id: string; predicted_failure_date: string | null; failure_probability: number; recommended_action: string | null; plant_id: string | null; created_at: string }
        Insert: { id?: string; part_id: string; predicted_failure_date?: string | null; failure_probability?: number; recommended_action?: string | null; plant_id?: string | null; created_at?: string }
        Update: Partial<Database['public']['Tables']['maintenance_predictions']['Insert']>
      }
    }
  }
}
