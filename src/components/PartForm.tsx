import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { trackFormSubmit } from '../lib/analytics'

const categories = ['Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Safety', 'Consumables']

export const PartForm = ({ selectedPlant, onSaved }: { selectedPlant: string; onSaved: () => void }) => {
  const [form, setForm] = useState({ part_number: '', name: '', description: '', category: 'Mechanical', unit_price: 0, reorder_point: 0, quantity_on_hand: 0 })
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('spare_parts').insert({ ...form, plant_id: selectedPlant || null })
    if (error) {
      setMessage({ type: 'err', text: error.message })
      await trackFormSubmit('part_form', false, error.message)
      return
    }
    setForm({ part_number: '', name: '', description: '', category: 'Mechanical', unit_price: 0, reorder_point: 0, quantity_on_hand: 0 })
    setMessage({ type: 'ok', text: 'Part created successfully.' })
    await trackFormSubmit('part_form', true)
    onSaved()
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">Add Spare Part</h3>
      {message && <div className={`rounded p-2 text-sm ${message.type === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input required placeholder="Part Number" className="rounded border p-2 focus:border-primary focus:outline-none" value={form.part_number} onChange={(e) => setForm({ ...form, part_number: e.target.value })} />
        <input required placeholder="Name" className="rounded border p-2 focus:border-primary focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Description" className="rounded border p-2 focus:border-primary focus:outline-none md:col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <select className="rounded border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        <input required type="number" step="0.01" placeholder="Unit Price" className="rounded border p-2" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })} />
        <input required type="number" placeholder="Reorder Point" className="rounded border p-2" value={form.reorder_point} onChange={(e) => setForm({ ...form, reorder_point: Number(e.target.value) })} />
        <input required type="number" placeholder="Initial Quantity" className="rounded border p-2" value={form.quantity_on_hand} onChange={(e) => setForm({ ...form, quantity_on_hand: Number(e.target.value) })} />
      </div>
      <button className="rounded bg-primary px-4 py-2 text-white">Save Part</button>
    </form>
  )
}
