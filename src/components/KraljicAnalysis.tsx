import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Database } from '../lib/database.types'
import { KraljicMatrix } from './KraljicMatrix'

type Row = Database['public']['Tables']['kraljic_analysis']['Row']

export const KraljicAnalysis = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => {
    const load = async () => setRows(await api.getKraljic(selectedPlant || undefined))
    void load()
  }, [selectedPlant, refreshKey])
  return <KraljicMatrix rows={rows} />
}
