import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { Charts } from './Charts'

export const UsageAnalytics = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [trendData, setTrendData] = useState<{ label: string; value: number }[]>([])
  const [typeData, setTypeData] = useState<{ label: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [events, txs] = await Promise.all([
        api.getAnalyticsEvents('part_transaction'),
        api.getTransactions(selectedPlant || undefined, 30)
      ])

      const daily = new Map<string, number>()
      txs.forEach((tx) => {
        const day = new Date(tx.created_at).toLocaleDateString()
        daily.set(day, (daily.get(day) ?? 0) + Number(tx.quantity))
      })

      const txType = new Map<string, number>()
      txs.forEach((tx) => {
        txType.set(tx.transaction_type, (txType.get(tx.transaction_type) ?? 0) + 1)
      })

      if (daily.size === 0 && events.length > 0) {
        events.forEach((evt) => {
          const day = new Date(evt.created_at).toLocaleDateString()
          daily.set(day, (daily.get(day) ?? 0) + 1)
        })
      }

      setTrendData(Array.from(daily.entries()).map(([label, value]) => ({ label, value })))
      setTypeData(Array.from(txType.entries()).map(([label, value]) => ({ label, value })))
      setLoading(false)
    }
    void load()
  }, [selectedPlant, refreshKey])

  const totals = useMemo(() => {
    const total = trendData.reduce((sum: number, d: { label: string; value: number }) => sum + d.value, 0)
    const peak = trendData.reduce(
      (m: { label: string; value: number }, d: { label: string; value: number }) => (d.value > m.value ? d : m),
      { label: '-', value: 0 }
    )
    return { total, peak }
  }, [trendData])

  if (loading) return <div className="h-44 animate-pulse rounded-xl bg-slate-200" />

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 p-4 text-white shadow">
          <p className="text-sm opacity-90">30-Day Movement</p>
          <p className="text-2xl font-bold">{totals.total}</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 p-4 text-white shadow">
          <p className="text-sm opacity-90">Peak Day</p>
          <p className="text-lg font-bold">{totals.peak.label}</p>
          <p>{totals.peak.value} units</p>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 p-4 text-white shadow">
          <p className="text-sm opacity-90">Insights</p>
          <p className="text-sm">Track demand spikes and balance reorder points by plant.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Charts data={trendData} type="line" title="Consumption Trend (Last 30 Days)" />
        <Charts data={typeData} type="bar" title="Transaction Type Distribution" />
      </div>
    </div>
  )
}
