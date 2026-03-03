import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { trackPartView } from '../lib/analytics'
import type { Database } from '../lib/database.types'

type Part = Database['public']['Tables']['spare_parts']['Row']

type Column = { key: keyof Part | 'actions'; label: string }
const columns: Column[] = [
  { key: 'part_number', label: 'Part Number' },
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'quantity_on_hand', label: 'Quantity on Hand' },
  { key: 'reorder_point', label: 'Reorder Point' },
  { key: 'unit_price', label: 'Unit Price' },
  { key: 'actions', label: 'Actions' }
]

export const PartsTable = ({ selectedPlant, refreshKey, onSaved }: { selectedPlant: string; refreshKey: number; onSaved: () => void }) => {
  const [parts, setParts] = useState<Part[]>([])
  const [sort, setSort] = useState<keyof Part>('part_number')
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => setParts(await api.getParts(selectedPlant || undefined))
    void load()
  }, [selectedPlant, refreshKey])

  const sorted = useMemo(() => [...parts].sort((a, b) => String(a[sort]).localeCompare(String(b[sort]))), [parts, sort])

  const save = async (part: Part) => {
    await api.updatePart(part.id, part)
    setEditing(null)
    onSaved()
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-sky-100 bg-white p-4 shadow">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-sky-800">Spare Parts Inventory</h3>
        <p className="text-xs text-slate-500">Click a column title to sort</p>
      </div>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-sky-50">
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.key !== 'actions' && setSort(column.key)}
                className={`p-3 font-semibold text-sky-800 ${column.key !== 'actions' ? 'cursor-pointer' : ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => {
            const low = Number(p.quantity_on_hand) <= Number(p.reorder_point)
            return (
              <tr key={p.id} className={`${low ? 'bg-red-50' : ''} border-b`} onClick={() => void trackPartView(p.id, p.part_number)}>
                {(['part_number', 'name', 'category'] as const).map((f) => (
                  <td key={f} className="p-3">
                    {editing === p.id ? (
                      <input
                        className="w-full rounded border p-1"
                        value={p[f]}
                        onChange={(e) => setParts((prev) => prev.map((x) => (x.id === p.id ? { ...x, [f]: e.target.value } : x)))}
                      />
                    ) : p[f]}
                  </td>
                ))}
                <td className="p-3">
                  {editing === p.id ? (
                    <input
                      type="number"
                      className="w-24 rounded border p-1"
                      value={Number(p.quantity_on_hand)}
                      onChange={(e) => setParts((prev) => prev.map((x) => (x.id === p.id ? { ...x, quantity_on_hand: Number(e.target.value) } : x)))}
                    />
                  ) : (
                    <span className="flex items-center gap-1">
                      {Number(p.quantity_on_hand)}
                      {low && <AlertCircle className="h-4 w-4 text-warning" />}
                    </span>
                  )}
                </td>
                <td className="p-3">{Number(p.reorder_point)}</td>
                <td className="p-3 text-emerald-700 font-medium">${Number(p.unit_price).toFixed(2)}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {editing === p.id ? (
                      <button onClick={() => void save(p)} className="rounded bg-emerald-100 px-2 py-1 text-emerald-700">Save</button>
                    ) : (
                      <button onClick={() => setEditing(p.id)} className="rounded bg-sky-100 p-1"><Pencil className="h-4 w-4" /></button>
                    )}
                    <button
                      onClick={async () => {
                        if (confirm('Delete this part?')) {
                          await api.deletePart(p.id)
                          onSaved()
                        }
                      }}
                      className="rounded bg-red-100 p-1"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
