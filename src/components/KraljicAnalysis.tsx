import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { Database } from '../lib/database.types'
import { KraljicMatrix } from './KraljicMatrix'

type Row = Database['public']['Tables']['kraljic_analysis']['Row']
type Part = Database['public']['Tables']['spare_parts']['Row']

const classify = (part: Part): Row['category'] => {
  const riskScore = Number(part.reorder_point) > Number(part.quantity_on_hand) ? 0.8 : 0.3
  const impactScore = Number(part.unit_price) > 500 ? 0.8 : 0.4
  if (riskScore > 0.5 && impactScore > 0.5) return 'strategic'
  if (riskScore <= 0.5 && impactScore > 0.5) return 'leverage'
  if (riskScore > 0.5 && impactScore <= 0.5) return 'bottleneck'
  return 'noncritical'
}

export const KraljicAnalysis = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [rows, setRows] = useState<Row[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await api.getKraljic(selectedPlant || undefined)
      if (data.length > 0) {
        setRows(data)
        return
      }

      const parts = await api.getParts(selectedPlant || undefined)
      const generated: Row[] = parts.map((part) => ({
        id: `generated-${part.id}`,
        part_id: part.id,
        supply_risk: Number(part.reorder_point) > Number(part.quantity_on_hand) ? 0.8 : 0.3,
        profit_impact: Number(part.unit_price) > 500 ? 0.8 : 0.4,
        category: classify(part),
        plant_id: part.plant_id,
        updated_at: new Date().toISOString()
      }))
      setRows(generated)
    }
    void load()
  }, [selectedPlant, refreshKey])

  const summary = useMemo(() => {
    const counters: Record<Row['category'], number> = { strategic: 0, leverage: 0, bottleneck: 0, noncritical: 0 }
    rows.forEach((r) => { counters[r.category] += 1 })
    return counters
  }, [rows])

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-red-100 p-3 text-red-800">Strategic: <strong>{summary.strategic}</strong></div>
        <div className="rounded-xl bg-green-100 p-3 text-green-800">Leverage: <strong>{summary.leverage}</strong></div>
        <div className="rounded-xl bg-yellow-100 p-3 text-yellow-800">Bottleneck: <strong>{summary.bottleneck}</strong></div>
        <div className="rounded-xl bg-blue-100 p-3 text-blue-800">Non-Critical: <strong>{summary.noncritical}</strong></div>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-2 text-lg font-semibold text-indigo-700">Procurement Strategy (Kraljic Matrix)</h3>
        <p className="mb-4 text-sm text-slate-600">Use this matrix to prioritize supplier strategy by supply risk and profit impact.</p>
        <KraljicMatrix rows={rows} />
      </div>
    </div>
  )
}
