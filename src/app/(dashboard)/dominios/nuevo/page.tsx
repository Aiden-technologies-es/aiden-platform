'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface DomainResult {
  domainName: string
  purchasable: boolean
  purchasePrice: number  // raw from Name.com (dollars)
  renewalPrice: number
}

const MARGIN = 0.20
const USD_TO_EUR = 0.92 // approximate, could be dynamic

function calcPrice(raw: number) {
  // Name.com returns prices in dollars (not cents)
  const withMargin = raw * (1 + MARGIN)
  const inEur = withMargin * USD_TO_EUR
  return Math.ceil(inEur * 100) / 100 // round up to 2 decimals
}

function fmtEur(amount: number) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount)
}

// ── Stripe checkout form ──
function CheckoutForm({ domainName, price, onSuccess, onCancel }: {
  domainName: string; price: number; onSuccess: () => void; onCancel: () => void
}) {
  const stripe   = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true); setError('')

    // Confirm payment
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Error al procesar el pago')
      setLoading(false)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Register domain
      const res = await fetch('/api/domains/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName, paymentIntentId: paymentIntent.id, confirmed: true }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al registrar el dominio')
        setLoading(false)
        return
      }
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handlePay}>
      <div className="mb-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 mb-4">{error}</div>
      )}
      <div className="flex gap-3">
        <button type="button" onClick={onCancel} disabled={loading} className="aiden-btn aiden-btn-ghost flex-1">
          Cancelar
        </button>
        <button type="submit" disabled={!stripe || loading} className="aiden-btn aiden-btn-primary flex-1">
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
              Procesando…
            </span>
          ) : `Pagar ${fmtEur(price)}`}
        </button>
      </div>
    </form>
  )
}

export default function NuevoDominioPage() {
  const router = useRouter()
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<DomainResult[]>([])
  const [error, setError]     = useState('')

  // Modal state
  const [selectedDomain, setSelectedDomain] = useState<DomainResult | null>(null)
  const [clientSecret, setClientSecret]     = useState('')
  const [loadingIntent, setLoadingIntent]   = useState(false)
  const [success, setSuccess]               = useState(false)

  async function search() {
    if (!query.trim()) return
    setLoading(true); setError(''); setResults([])
    try {
      const res  = await fetch('/api/domains/search?q=' + encodeURIComponent(query))
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.results ?? [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function startPurchase(domain: DomainResult) {
    setSelectedDomain(domain)
    setClientSecret('')
    setLoadingIntent(true)
    const price = calcPrice(domain.purchasePrice)
    try {
      const res  = await fetch('/api/domains/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domainName: domain.domainName, price }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setClientSecret(data.clientSecret)
    } catch (e: any) {
      alert(e.message)
      setSelectedDomain(null)
    } finally {
      setLoadingIntent(false)
    }
  }

  function closeModal() {
    setSelectedDomain(null)
    setClientSecret('')
    setSuccess(false)
  }

  function handleSuccess() {
    setSuccess(true)
    setTimeout(() => router.push('/dominios'), 2500)
  }

  const selectedPrice = selectedDomain ? calcPrice(selectedDomain.purchasePrice) : 0
  const selectedRenewal = selectedDomain ? calcPrice(selectedDomain.renewalPrice) : 0

  return (
    <div>
      <motion.button onClick={() => router.push('/dominios')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-5 hover:text-[#0A0A0F] transition-colors"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
            <input className="aiden-input flex-1" placeholder="miempresa.com"
              value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && search()} />
            <button onClick={search} disabled={loading} className="aiden-btn aiden-btn-primary px-6">
              {loading ? <span className="flex items-center gap-2"><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Buscando…</span> : 'Buscar'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
        </div>

        {results.length > 0 && (
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <h3 className="text-sm font-bold text-[#0A0A0F]">Resultados para "{query}"</h3>
              <p className="text-xs text-[#7A7A8C] mt-0.5">Precios en EUR · IVA no incluido</p>
            </div>
            <div className="divide-y divide-black/5">
              {results.map(r => {
                const price   = calcPrice(r.purchasePrice)
                const renewal = calcPrice(r.renewalPrice)
                return (
                  <div key={r.domainName} className="flex items-center gap-4 px-5 py-4">
                    <div className="text-xl flex-shrink-0">{r.purchasable ? '🌐' : '🔒'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[#0A0A0F]">{r.domainName}</div>
                      {r.purchasable && (
                        <div className="text-xs text-[#7A7A8C] mt-0.5">
                          Primer año: <strong className="text-[#13967e]">{fmtEur(price)}</strong> · Renovación: {fmtEur(renewal)}/año
                        </div>
                      )}
                    </div>
                    {r.purchasable ? (
                      <button onClick={() => startPurchase(r)} className="aiden-btn aiden-btn-primary aiden-btn-sm flex-shrink-0">
                        Registrar
                      </button>
                    ) : (
                      <span className="text-xs font-semibold text-[#AEAEB2]">No disponible</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment modal */}
      <AnimatePresence>
        {selectedDomain && (
          <>
            <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !loadingIntent && closeModal()} />
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <div className="aiden-card p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

                {success ? (
                  <div className="text-center py-6">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-black text-[#0A0A0F] mb-2">¡Dominio registrado!</h2>
                    <p className="text-sm text-[#7A7A8C]">{selectedDomain.domainName} ya es tuyo. Redirigiendo…</p>
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="text-center mb-5">
                      <div className="text-3xl mb-2">🌐</div>
                      <h2 className="text-xl font-black text-[#0A0A0F] mb-1">{selectedDomain.domainName}</h2>
                      <p className="text-sm text-[#7A7A8C]">Registrar por 1 año</p>
                    </div>

                    {/* Order summary */}
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
                        <span className="font-semibold">{fmtEur(selectedRenewal)}/año</span>
                      </div>
                      <div className="border-t border-black/6 pt-2 flex justify-between items-center">
                        <span className="font-bold text-[#0A0A0F]">Total</span>
                        <span className="font-black text-2xl text-[#13967e]">{fmtEur(selectedPrice)}</span>
                      </div>
                    </div>

                    {/* Payment form */}
                    {loadingIntent ? (
                      <div className="text-center py-8">
                        <svg className="animate-spin w-8 h-8 text-[#13967e] mx-auto mb-2" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        <p className="text-sm text-[#7A7A8C]">Preparando pago seguro…</p>
                      </div>
                    ) : clientSecret ? (
                      <>
                        <div className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-3">Método de pago</div>
                        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'flat', variables: { colorPrimary: '#13967e', borderRadius: '10px' } } }}>
                          <CheckoutForm
                            domainName={selectedDomain.domainName}
                            price={selectedPrice}
                            onSuccess={handleSuccess}
                            onCancel={closeModal}
                          />
                        </Elements>
                        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-[#AEAEB2]">
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8"/></svg>
                          Pago seguro con Stripe · SSL cifrado
                        </div>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
