import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Charts } from './Charts'

export const UsageAnalytics = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [data, setData] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    const load = async () => {
      let query = supabase.from('analytics_events').select('*').eq('event_type', 'part_transaction')
      if (selectedPlant) query = query.contains('event_data', { plant_id: selectedPlant })
      const { data } = await query
      const grouped = new Map<string, number>()
      ;(data ?? []).forEach((evt) => {
        const day = new Date(evt.created_at).toLocaleDateString()
        grouped.set(day, (grouped.get(day) ?? 0) + 1)
      })
      setData(Array.from(grouped.entries()).map(([label, value]) => ({ label, value })))
    }
    void load()
  }, [selectedPlant, refreshKey])

  return <Charts data={data} type="line" title="Consumption Trends" />
}
