'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface DomainResult {
  domainName: string
  purchasable: boolean
  purchasePrice: number
  renewalPrice: number
}

function formatPrice(cents: number) {
  return '€' + (cents / 100).toFixed(2)
}

export default function NuevoDominioPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [error, setError] = useState('')

  // Confirmation modal
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState('')

  async function search() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults([])
    try {
      const res = await fetch('/api/domains/search?q=' + encodeURIComponent(query))
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.results ?? [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function confirmPurchase() {
    if (!selectedDomain) return
    setPurchasing(true); setPurchaseError('')
    try {
      const res = await fetch('/api/domains/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: selectedDomain.domainName, confirmed: true }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/dominios')
    } catch (e: any) { setPurchaseError(e.message) }
    finally { setPurchasing(false) }
  }

  return (
    <div>
      <motion.button
        onClick={() => router.push('/dominios')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-5 hover:text-[#0A0A0F] transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Volver a dominios
      </motion.button>

      <motion.div className="mb-7" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-[11px] font-bold text-[#9A9AB0] uppercase tracking-widest mb-1">Dominios</p>
        <h1 className="text-3xl font-black text-[#0A0A0F] tracking-tight">Registrar dominio</h1>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <div className="aiden-card p-5 mb-4">
          <div className="flex gap-2">
            <input
              className="aiden-input flex-1"
              placeholder="miempresa.com"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()}
            />
            <button
              onClick={search}
              disabled={loading}
              className="aiden-btn aiden-btn-primary px-6"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Buscando…
                </span>
              ) : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {results.length > 0 && (
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h3 className="text-sm font-bold text-[#0A0A0F]">Resultados para "{query}"</h3>
            </div>
            <div className="divide-y divide-black/5">
              {results.map(r => (
                <div key={r.domainName} className="flex items-center gap-4 px-5 py-4">
                  <div className="text-xl flex-shrink-0">{r.purchasable ? '🌐' : '🔒'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[#0A0A0F]">{r.domainName}</div>
                    {r.purchasable && (
                      <div className="text-xs text-[#7A7A8C] mt-0.5">
                        Registro: {formatPrice(r.purchasePrice)}/año · Renovación: {formatPrice(r.renewalPrice)}/año
                      </div>
                    )}
                  </div>
                  {r.purchasable ? (
                    <button
                      onClick={() => setSelectedDomain(r)}
                      className="aiden-btn aiden-btn-primary aiden-btn-sm flex-shrink-0"
                    >
                      Registrar
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-[#AEAEB2]">No disponible</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {selectedDomain && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !purchasing && setSelectedDomain(null)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="aiden-card p-6 w-full max-w-md">
                <div className="text-center mb-5">
                  <div className="text-4xl mb-3">🌐</div>
                  <h2 className="text-xl font-black text-[#0A0A0F] mb-1">{selectedDomain.domainName}</h2>
                  <p className="text-sm text-[#7A7A8C]">¿Confirmas el registro de este dominio?</p>
                </div>

                <div className="bg-black/3 rounded-2xl p-4 mb-5 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7A7A8C]">Dominio</span>
                    <span className="font-semibold">{selectedDomain.domainName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7A7A8C]">Duración</span>
                    <span className="font-semibold">1 año</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#7A7A8C]">Renovación anual</span>
                    <span className="font-semibold">{formatPrice(selectedDomain.renewalPrice)}/año</span>
                  </div>
                  <div className="border-t border-black/6 pt-2 flex justify-between">
                    <span className="font-bold text-[#0A0A0F]">Total hoy</span>
                    <span className="font-black text-lg text-[#13967e]">{formatPrice(selectedDomain.purchasePrice)}</span>
                  </div>
                </div>

                <p className="text-xs text-[#7A7A8C] text-center mb-4">
                  Se cargará a la tarjeta configurada en tu cuenta de Name.com
                </p>

                {purchaseError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 mb-4">
                    {purchaseError}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => { setSelectedDomain(null); setPurchaseError('') }}
                    disabled={purchasing}
                    className="aiden-btn aiden-btn-ghost flex-1"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmPurchase}
                    disabled={purchasing}
                    className="aiden-btn aiden-btn-primary flex-1"
                  >
                    {purchasing ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        Registrando…
                      </span>
                    ) : 'Confirmar y pagar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
