import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'

type Row = Database['public']['Tables']['ai_recommendations']['Row']

const priorityClass = { high: 'border-red-500', medium: 'border-yellow-500', low: 'border-green-500' }

export const RecommendationsPanel = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => {
    const load = async () => {
      let query = supabase.from('ai_recommendations').select('*').order('created_at', { ascending: false })
      if (selectedPlant) query = query.eq('plant_id', selectedPlant)
      const { data } = await query
      setRows(data ?? [])
    }
    void load()
  }, [selectedPlant, refreshKey])

  return <div className="space-y-3">{rows.map((r) => <div key={r.id} className={`rounded-xl border-l-4 bg-white p-4 shadow ${priorityClass[r.priority]}`}><div className="mb-1 flex items-center justify-between"><p className="font-semibold">{r.recommendation_type}</p><span className="text-xs uppercase">{r.priority}</span></div><p>{r.suggested_action}</p><p className="text-sm text-slate-500">{r.reasoning}</p></div>)}</div>
}
