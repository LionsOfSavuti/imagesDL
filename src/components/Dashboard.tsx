import { useEffect, useState } from 'react'
import { AlertTriangle, DollarSign, Package, TrendingDown } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface Props { selectedPlant: string; refreshKey: number }

export const Dashboard = ({ selectedPlant, refreshKey }: Props) => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalParts: 0, lowStock: 0, value: 0, recentTx: 0 })

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      let partsQuery = supabase.from('spare_parts').select('*')
      let txQuery = supabase.from('inventory_transactions').select('*').gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString())
      if (selectedPlant) {
        partsQuery = partsQuery.eq('plant_id', selectedPlant)
        txQuery = txQuery.eq('plant_id', selectedPlant)
      }
      const [{ data: parts }, { data: txs }] = await Promise.all([partsQuery, txQuery])
      const totalParts = parts?.length ?? 0
      const lowStock = (parts ?? []).filter((p) => p.quantity_on_hand <= p.reorder_point).length
      const value = (parts ?? []).reduce((sum, p) => sum + p.quantity_on_hand * p.unit_price, 0)
      setStats({ totalParts, lowStock, value, recentTx: txs?.length ?? 0 })
      setLoading(false)
    }
    void load()
  }, [selectedPlant, refreshKey])

  if (loading) return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-200" />)}</div>

  const cards = [
    { label: 'Total Parts', value: stats.totalParts, icon: Package, color: 'text-primary' },
    { label: 'Low Stock Items', value: stats.lowStock, icon: AlertTriangle, color: 'text-alert' },
    { label: 'Total Inventory Value', value: `$${stats.value.toFixed(2)}`, icon: DollarSign, color: 'text-success' },
    { label: 'Recent Transactions', value: stats.recentTx, icon: TrendingDown, color: 'text-slate-600' }
  ]

  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{cards.map((c) => <div key={c.label} className="rounded-xl bg-white p-5 shadow"><div className="mb-3 flex items-center justify-between"><p className="text-sm text-slate-500">{c.label}</p><c.icon className={`h-5 w-5 ${c.color}`} /></div><p className="text-2xl font-bold">{c.value}</p></div>)}</div>
}
