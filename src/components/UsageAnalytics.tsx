import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { Charts } from './Charts'

export const UsageAnalytics = ({ refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [data, setData] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    const load = async () => {
      const events = await api.getAnalyticsEvents('part_transaction')
      const grouped = new Map<string, number>()
      events.forEach((evt) => {
        const day = new Date(evt.created_at).toLocaleDateString()
        grouped.set(day, (grouped.get(day) ?? 0) + 1)
      })
      setData(Array.from(grouped.entries()).map(([label, value]) => ({ label, value })))
    }
    void load()
  }, [refreshKey])

  return <Charts data={data} type="line" title="Consumption Trends" />
}
