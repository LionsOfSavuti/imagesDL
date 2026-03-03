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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50">
      <header className="border-b border-sky-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 p-4">
          <div>
            <h1 className="text-2xl font-bold text-sky-800">Spare Parts Inventory Management</h1>
            <p className="text-sm text-slate-600">Multi-plant visibility with analytics and procurement intelligence</p>
          </div>
          <div className="flex items-center gap-2">
            <PlantSelector selectedPlant={selectedPlant} onChange={setSelectedPlant} />
            <button onClick={() => setRefreshKey((k) => k + 1)} className="rounded border border-sky-200 bg-white p-2 text-sky-700 hover:bg-sky-50"><RefreshCw className="h-4 w-4" /></button>
          </div>
        </div>
      </header>
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto p-4">{(['Dashboard','Parts','Transactions','Analytics','Kraljic','Recommendations'] as Tab[]).map((t)=><button key={t} onClick={()=>setTab(t)} className={`rounded-full px-4 py-2 text-sm font-medium transition ${tab===t?'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow':'bg-white text-slate-700 hover:bg-sky-50'}`}>{t}</button>)}</nav>
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
