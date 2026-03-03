import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Database } from '../lib/database.types'
import { trackPartTransaction } from '../lib/analytics'

type Part = Database['public']['Tables']['spare_parts']['Row']

export const TransactionForm = ({ selectedPlant, onSaved }: { selectedPlant: string; onSaved: () => void }) => {
  const [parts, setParts] = useState<Part[]>([])
  const [partId, setPartId] = useState('')
  const [type, setType] = useState<'in' | 'out' | 'adjustment'>('in')
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const load = async () => {
      let q = supabase.from('spare_parts').select('*')
      if (selectedPlant) q = q.eq('plant_id', selectedPlant)
      const { data } = await q
      setParts(data ?? [])
    }
    void load()
  }, [selectedPlant])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const selected = parts.find((p) => p.id === partId)
    if (!selected) return
    const newQty = type === 'in' ? selected.quantity_on_hand + qty : type === 'out' ? selected.quantity_on_hand - qty : qty
    await supabase.from('spare_parts').update({ quantity_on_hand: Math.max(0, newQty) }).eq('id', selected.id)
    await supabase.from('inventory_transactions').insert({ part_id: selected.id, transaction_type: type, quantity: qty, notes, plant_id: selectedPlant || selected.plant_id })
    await trackPartTransaction(selected.id, type, qty)
    setQty(1); setNotes(''); onSaved()
  }

  return <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-4 shadow"><h3 className="text-lg font-semibold">Record Transaction</h3><select required className="w-full rounded border p-2" value={partId} onChange={(e)=>setPartId(e.target.value)}><option value="">Select part</option>{parts.map((p)=><option key={p.id} value={p.id}>{p.part_number} - {p.name} (Stock: {p.quantity_on_hand})</option>)}</select><select value={type} className="w-full rounded border p-2" onChange={(e)=>setType(e.target.value as 'in'|'out'|'adjustment')}><option value="in">Stock In</option><option value="out">Stock Out</option><option value="adjustment">Adjustment</option></select><input min={1} type="number" className="w-full rounded border p-2" value={qty} onChange={(e)=>setQty(Number(e.target.value))} /><textarea className="w-full rounded border p-2" value={notes} onChange={(e)=>setNotes(e.target.value)} placeholder="Notes"/><button className="rounded bg-primary px-4 py-2 text-white">Submit</button></form>
}
