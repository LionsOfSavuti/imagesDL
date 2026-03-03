import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import { KraljicMatrix } from './KraljicMatrix'

type Row = Database['public']['Tables']['kraljic_analysis']['Row']

export const KraljicAnalysis = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => {
    const load = async () => {
      let query = supabase.from('kraljic_analysis').select('*')
      if (selectedPlant) query = query.eq('plant_id', selectedPlant)
      const { data } = await query
      setRows(data ?? [])
    }
    void load()
  }, [selectedPlant, refreshKey])
  return <KraljicMatrix rows={rows} />
}
