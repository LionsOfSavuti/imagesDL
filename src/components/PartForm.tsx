import { type FormEvent, useState } from 'react'
import { api } from '../lib/api'
import { trackFormSubmit } from '../lib/analytics'

const categories = ['Mechanical', 'Electrical', 'Hydraulic', 'Pneumatic', 'Safety', 'Consumables']

export const PartForm = ({ selectedPlant, onSaved }: { selectedPlant: string; onSaved: () => void }) => {
  const [form, setForm] = useState({ part_number: '', name: '', description: '', category: 'Mechanical', unit_price: 0, reorder_point: 0, quantity_on_hand: 0 })
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.createPart({ ...form, plant_id: selectedPlant || null })
      setForm({ part_number: '', name: '', description: '', category: 'Mechanical', unit_price: 0, reorder_point: 0, quantity_on_hand: 0 })
      setMessage({ type: 'ok', text: 'Part created successfully.' })
      await trackFormSubmit('part_form', true)
      onSaved()
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to create part'
      setMessage({ type: 'err', text: msg })
      await trackFormSubmit('part_form', false, msg)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 rounded-xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">Add Spare Part</h3>
      {message && <div className={`rounded p-2 text-sm ${message.type === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message.text}</div>}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Part Number</span>
          <input id="part-number" required placeholder="e.g. BRG-1001" className="w-full rounded border p-2 focus:border-primary focus:outline-none" value={form.part_number} onChange={(e) => setForm({ ...form, part_number: e.target.value })} />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Name</span>
          <input id="part-name" required placeholder="Bearing Assembly" className="w-full rounded border p-2 focus:border-primary focus:outline-none" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Description</span>
          <textarea id="part-description" placeholder="Optional description" className="w-full rounded border p-2 focus:border-primary focus:outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Category</span>
          <select id="part-category" className="w-full rounded border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Unit Price</span>
          <input id="unit-price" required type="number" step="0.01" placeholder="0.00" className="w-full rounded border p-2" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: Number(e.target.value) })} />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Reorder Point</span>
          <input id="reorder-point" required type="number" placeholder="10" className="w-full rounded border p-2" value={form.reorder_point} onChange={(e) => setForm({ ...form, reorder_point: Number(e.target.value) })} />
        </label>

        <label className="space-y-1 text-sm font-medium text-slate-700">
          <span>Initial Quantity</span>
          <input id="initial-quantity" required type="number" placeholder="50" className="w-full rounded border p-2" value={form.quantity_on_hand} onChange={(e) => setForm({ ...form, quantity_on_hand: Number(e.target.value) })} />
        </label>
      </div>
      <button className="rounded bg-primary px-4 py-2 text-white">Save Part</button>
    </form>
  )
}
