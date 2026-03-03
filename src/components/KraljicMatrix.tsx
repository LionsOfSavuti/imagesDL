import type { Database } from '../lib/database.types'

type Kraljic = Database['public']['Tables']['kraljic_analysis']['Row']

const quadrantColors = { strategic: 'bg-red-100', leverage: 'bg-green-100', bottleneck: 'bg-yellow-100', noncritical: 'bg-blue-100' }
const tips = {
  strategic: 'Partner with suppliers and secure long-term contracts.',
  leverage: 'Use volume leverage and competitive bidding.',
  bottleneck: 'Mitigate risk with safety stock and backup vendors.',
  noncritical: 'Automate ordering and standardize SKUs.'
}

export const KraljicMatrix = ({ rows }: { rows: Kraljic[] }) => {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{(Object.keys(quadrantColors) as Array<keyof typeof quadrantColors>).map((q) => <div key={q} className={`rounded-xl p-4 ${quadrantColors[q]}`}><h4 className="font-semibold capitalize">{q}</h4><p className="mb-2 text-xs text-slate-600">{tips[q]}</p><ul className="list-disc pl-5 text-sm">{rows.filter((r) => r.category===q).map((r) => <li key={r.id}>{r.part_id} (risk {Number(r.supply_risk).toFixed(2)}, impact {Number(r.profit_impact).toFixed(2)})</li>)}</ul></div>)}</div>
}
