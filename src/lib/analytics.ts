import { supabase } from './supabase'

const getSessionId = (): string => {
  const key = 'inventory_session_id'
  const existing = localStorage.getItem(key)
  if (existing) return existing
  const generated = crypto.randomUUID()
  localStorage.setItem(key, generated)
  return generated
}

export const trackEvent = async (eventType: string, eventData?: Record<string, unknown>) => {
  await supabase.from('analytics_events').insert({
    event_type: eventType,
    event_data: eventData ?? null,
    session_id: getSessionId()
  })
}

export const trackPageView = async (pageName: string) => trackEvent('page_view', { pageName })
export const trackPartView = async (partId: string, partNumber: string) => trackEvent('part_view', { partId, partNumber })
export const trackPartTransaction = async (partId: string, transactionType: string, quantity: number) =>
  trackEvent('part_transaction', { partId, transactionType, quantity })
export const trackSearch = async (query: string, resultsCount: number) => trackEvent('search', { query, resultsCount })
export const trackFormSubmit = async (formName: string, success: boolean, errorMessage?: string) =>
  trackEvent('form_submit', { formName, success, errorMessage })
