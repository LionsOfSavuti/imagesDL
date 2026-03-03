import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import type { Database } from '../lib/database.types'

type Plant = Database['public']['Tables']['plants']['Row']

interface Props {
  selectedPlant: string
  onChange: (plantId: string) => void
}

export const PlantSelector = ({ selectedPlant, onChange }: Props) => {
  const [plants, setPlants] = useState<Plant[]>([])

  useEffect(() => {
    const load = async () => {
      const data = await api.getPlants()
      setPlants(data ?? [])
    }
    void load()
  }, [])

  return (
    <select className="rounded border border-slate-300 bg-white px-3 py-2" value={selectedPlant} onChange={(e) => onChange(e.target.value)}>
      <option value="">All Plants</option>
      {plants.map((plant) => (
        <option key={plant.id} value={plant.id}>{plant.name}</option>
      ))}
    </select>
  )
}
