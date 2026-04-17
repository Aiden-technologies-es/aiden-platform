'use client'
import { useState } from 'react'
import { Input, Button, Card, CardBody } from '@/components/ui'

interface DomainResult { domainName: string; purchasable: boolean; purchasePrice: number; renewalPrice: number }

export default function NuevoDominioPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [purchasing, setPurchasing] = useState<string|null>(null)
  const [error, setError] = useState('')

  async function search() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults([])
    try {
      const res = await fetch('/api/domains/search?q=' + encodeURIComponent(query))
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.results ?? [])
    } catch(e:any) { setError(e.message) } finally { setLoading(false) }
  }

  async function purchase(domainName: string) {
    setPurchasing(domainName)
    try {
      const res = await fetch('/api/domains/purchase', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ domainName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = '/dominios'
    } catch(e:any) { alert(e.message) } finally { setPurchasing(null) }
  }

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Dominios</p>
        <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Registrar dominio</h1>
      </div>
      <Card className="mb-4">
        <CardBody>
          <div className="flex gap-2">
            <Input className="flex-1" placeholder="miempresa.com" value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()}/>
            <Button variant="brand" onClick={search} loading={loading}>Buscar</Button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </CardBody>
      </Card>
      {results.length > 0 && (
        <Card>
          <CardBody>
            <div className="divide-y divide-black/5">
              {results.map(r => (
                <div key={r.domainName} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-base">{r.purchasable?'🌐':'🔒'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{r.domainName}</div>
                    {r.purchasable && <div className="text-xs text-[#7A7A8C]">€{(r.purchasePrice/100).toFixed(2)}/año</div>}
                  </div>
                  {r.purchasable
                    ? <Button variant="brand" size="sm" loading={purchasing===r.domainName} onClick={()=>purchase(r.domainName)}>Registrar</Button>
                    : <span className="text-xs font-semibold text-[#AEAEB2]">No disponible</span>
                  }
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
