import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { Dashboard } from './components/Dashboard'
import { PartForm } from './components/PartForm'
import { PartsTable } from './components/PartsTable'
import { PlantSelector } from './components/PlantSelector'
import { TransactionForm } from './components/TransactionForm'
import { UsageAnalytics } from './components/UsageAnalytics'
import { KraljicAnalysis } from './components/KraljicAnalysis'
import { EOQAnalysis } from './components/EOQAnalysis'
import { RecommendationsPanel } from './components/RecommendationsPanel'
import { trackPageView } from './lib/analytics'

type Tab = 'Dashboard' | 'Parts' | 'Transactions' | 'Analytics' | 'Kraljic' | 'Recommendations'

function App() {
  const [tab, setTab] = useState<Tab>('Dashboard')
  const [selectedPlant, setSelectedPlant] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => { void trackPageView(tab) }, [tab])

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
          <h1 className="text-xl font-bold">Spare Parts Inventory Management</h1>
          <div className="flex items-center gap-2">
            <PlantSelector selectedPlant={selectedPlant} onChange={setSelectedPlant} />
            <button onClick={() => setRefreshKey((k) => k + 1)} className="rounded border p-2"><RefreshCw className="h-4 w-4" /></button>
          </div>
        </div>
      </header>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto p-4">{(['Dashboard','Parts','Transactions','Analytics','Kraljic','Recommendations'] as Tab[]).map((t)=><button key={t} onClick={()=>setTab(t)} className={`rounded px-3 py-2 ${tab===t?'bg-primary text-white':'bg-white'}`}>{t}</button>)}</nav>
      <main className="mx-auto max-w-7xl space-y-4 p-4">
        {tab === 'Dashboard' && <Dashboard selectedPlant={selectedPlant} refreshKey={refreshKey} />}
        {tab === 'Parts' && <><PartForm selectedPlant={selectedPlant} onSaved={() => setRefreshKey((k) => k + 1)} /><PartsTable selectedPlant={selectedPlant} refreshKey={refreshKey} onSaved={() => setRefreshKey((k) => k + 1)} /></>}
        {tab === 'Transactions' && <TransactionForm selectedPlant={selectedPlant} onSaved={() => setRefreshKey((k) => k + 1)} />}
        {tab === 'Analytics' && <><UsageAnalytics selectedPlant={selectedPlant} refreshKey={refreshKey} /><EOQAnalysis selectedPlant={selectedPlant} refreshKey={refreshKey} /></>}
        {tab === 'Kraljic' && <KraljicAnalysis selectedPlant={selectedPlant} refreshKey={refreshKey} />}
        {tab === 'Recommendations' && <RecommendationsPanel selectedPlant={selectedPlant} refreshKey={refreshKey} />}
      </main>
    </div>
  )
}

export default App
