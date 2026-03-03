import { useMemo } from 'react'

interface Datum { label: string; value: number }

export const Charts = ({ data, type, title }: { data: Datum[]; type: 'bar' | 'line' | 'pie'; title: string }) => {
  const max = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data])

  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h3 className="mb-4 text-lg font-semibold">{title}</h3>
      {type === 'bar' && <div className="space-y-2">{data.map((d) => <div key={d.label}><div className="flex justify-between text-sm"><span>{d.label}</span><span>{d.value}</span></div><div className="h-2 rounded bg-slate-100"><div className="h-2 rounded bg-primary" style={{ width: `${(d.value / max) * 100}%` }} /></div></div>)}</div>}
      {type === 'line' && <svg viewBox="0 0 100 30" className="h-40 w-full">{data.map((d, i) => { const x = (i / Math.max(data.length - 1, 1)) * 100; const y = 30 - (d.value / max) * 25; return <circle key={d.label} cx={x} cy={y} r="1.2" fill="#3b82f6" /> })}</svg>}
      {type === 'pie' && <div className="grid grid-cols-2 gap-2">{data.map((d) => <div key={d.label} className="rounded bg-slate-100 p-2 text-sm">{d.label}: {d.value}</div>)}</div>}
    </div>
  )
}
