import type { Database } from './database.types'

type Plant = Database['public']['Tables']['plants']['Row']
type Part = Database['public']['Tables']['spare_parts']['Row']
type Tx = Database['public']['Tables']['inventory_transactions']['Row']
type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row']
type Recommendation = Database['public']['Tables']['ai_recommendations']['Row']
type Kraljic = Database['public']['Tables']['kraljic_analysis']['Row']
type EOQ = Database['public']['Tables']['eoq_analysis']['Row']

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    ...init
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}

export const api = {
  getPlants: (plantId?: string) => request<Plant[]>(`/plants${plantId ? `?id=${plantId}` : ''}`),
  getParts: (plantId?: string) => request<Part[]>(`/parts${plantId ? `?plant_id=${plantId}` : ''}`),
  createPart: (payload: Partial<Part>) => request<{ success: boolean }>('/parts', { method: 'POST', body: JSON.stringify(payload) }),
  updatePart: (id: string, payload: Partial<Part>) => request<{ success: boolean }>(`/parts/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deletePart: (id: string) => request<{ success: boolean }>(`/parts/${id}`, { method: 'DELETE' }),
  getTransactions: (plantId?: string, days?: number) => request<Tx[]>(`/transactions?${new URLSearchParams({ ...(plantId ? { plant_id: plantId } : {}), ...(days ? { days: String(days) } : {}) })}`),
  createTransaction: (payload: Record<string, unknown>) => request<{ success: boolean }>('/transactions', { method: 'POST', body: JSON.stringify(payload) }),
  getAnalyticsEvents: (eventType?: string) => request<AnalyticsEvent[]>(`/analytics${eventType ? `?event_type=${eventType}` : ''}`),
  createAnalyticsEvent: (payload: Partial<AnalyticsEvent>) => request<{ success: boolean }>('/analytics', { method: 'POST', body: JSON.stringify(payload) }),
  getRecommendations: (plantId?: string) => request<Recommendation[]>(`/recommendations${plantId ? `?plant_id=${plantId}` : ''}`),
  getKraljic: (plantId?: string) => request<Kraljic[]>(`/kraljic${plantId ? `?plant_id=${plantId}` : ''}`),
  getEoq: (plantId?: string) => request<EOQ[]>(`/eoq${plantId ? `?plant_id=${plantId}` : ''}`)
}
