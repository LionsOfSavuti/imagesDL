import { useEffect, useState } from 'react'
import { api } from '../lib/api'

type Row = { id: string; annual_demand: number; ordering_cost: number; holding_cost_per_unit: number; part_id: string; economic_order_quantity: number; total_annual_cost: number; number_of_orders_per_year: number }

export const EOQAnalysis = ({ selectedPlant, refreshKey }: { selectedPlant: string; refreshKey: number }) => {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => {
    const load = async () => {
      const data = await api.getEoq(selectedPlant || undefined)
      const calculated = (data ?? []).map((r) => {
        const eoq = Math.sqrt((2 * r.annual_demand * r.ordering_cost) / Math.max(r.holding_cost_per_unit, 1))
        return { ...r, economic_order_quantity: eoq, number_of_orders_per_year: r.annual_demand / Math.max(eoq, 1) }
      })
      setRows(calculated)
    }
    void load()
  }, [selectedPlant, refreshKey])

  return <div className="overflow-x-auto rounded-xl bg-white p-4 shadow"><table className="min-w-full text-sm"><thead><tr><th>Part</th><th>Annual Demand</th><th>EOQ</th><th>Orders/Year</th><th>Total Annual Cost</th></tr></thead><tbody>{rows.map((r)=><tr key={r.id}><td>{r.part_id}</td><td>{r.annual_demand}</td><td>{r.economic_order_quantity.toFixed(2)}</td><td>{r.number_of_orders_per_year.toFixed(2)}</td><td>{r.total_annual_cost.toFixed(2)}</td></tr>)}</tbody></table></div>
}
