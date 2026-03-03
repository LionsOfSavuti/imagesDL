import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Pencil, Trash2 } from 'lucide-react'
import { api } from '../lib/api'
import { trackPartView } from '../lib/analytics'
import type { Database } from '../lib/database.types'

type Part = Database['public']['Tables']['spare_parts']['Row']

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

  return <div className="overflow-x-auto rounded-xl bg-white p-4 shadow"><table className="min-w-full text-left text-sm"><thead><tr>{['part_number','name','category','quantity_on_hand','reorder_point','unit_price'].map((col) => <th key={col} onClick={() => setSort(col as keyof Part)} className="cursor-pointer p-2 uppercase text-slate-500">{col.replaceAll('_',' ')}</th>)}<th className="p-2">Actions</th></tr></thead><tbody>{sorted.map((p) => { const low = p.quantity_on_hand <= p.reorder_point; return <tr key={p.id} className={low ? 'bg-red-50' : ''} onClick={() => void trackPartView(p.id, p.part_number)}>{(['part_number','name','category'] as const).map((f) => <td key={f} className="p-2">{editing===p.id?<input className="rounded border p-1" value={p[f]} onChange={(e)=>setParts((prev)=>prev.map((x)=>x.id===p.id?{...x,[f]:e.target.value}:x))}/>:p[f]}</td>)}<td className="p-2">{editing===p.id?<input type="number" className="w-20 rounded border p-1" value={p.quantity_on_hand} onChange={(e)=>setParts((prev)=>prev.map((x)=>x.id===p.id?{...x,quantity_on_hand:Number(e.target.value)}:x))}/>:<span className="flex items-center gap-1">{p.quantity_on_hand}{low && <AlertCircle className="h-4 w-4 text-warning"/>}</span>}</td><td className="p-2">{p.reorder_point}</td><td className="p-2">${p.unit_price.toFixed(2)}</td><td className="p-2"><div className="flex gap-2">{editing===p.id?<button onClick={()=>void save(p)} className="text-primary">Save</button>:<button onClick={()=>setEditing(p.id)}><Pencil className="h-4 w-4"/></button>}<button onClick={async()=>{ if(confirm('Delete this part?')){ await api.deletePart(p.id); onSaved() }}}><Trash2 className="h-4 w-4 text-red-500"/></button></div></td></tr>})}</tbody></table></div>
}
