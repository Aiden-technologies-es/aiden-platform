'use client'
import { useState, useEffect } from 'react'
import { Button, Card, CardHeader, CardTitle, CardBody, Badge, Spinner } from '@/components/ui'

function fmt(cents: number, cur: string) {
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:cur.toUpperCase()}).format(cents/100)
}
function fmtDate(ts: number) {
  return new Date(ts*1000).toLocaleDateString('es-ES',{day:'2-digit',month:'short',year:'numeric'})
}

export default function SuscripcionPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/stripe/subscription')
      .then(r=>r.json())
      .then(d=>{ if(d.error) setError(d.error); else setData(d); })
      .catch(()=>setError('Error al cargar la suscripción'))
      .finally(()=>setLoading(false))
  }, [])

  async function openPortal() {
    const res = await fetch('/api/stripe/portal', {method:'POST'})
    const d = await res.json()
    if (d.url) window.open(d.url,'_blank')
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner className="w-8 h-8 text-brand"/></div>

  const sub = data?.subscriptions?.[0]
  const pms = data?.payment_methods ?? []
  const invs = data?.invoices ?? []
  const price = sub?.items?.data?.[0]?.price
  const amount = price?.unit_amount ? fmt(price.unit_amount, price.currency) : null
  const daysLeft = sub?.current_period_end ? Math.max(0,Math.floor((sub.current_period_end*1000-Date.now())/86400000)) : null

  const stColors: Record<string,string> = {active:'#34C759',trialing:'#FF9F0A',past_due:'#FF3B30',canceled:'#9E9E9E'}
  const stLabels: Record<string,string> = {active:'Activa',trialing:'Prueba',past_due:'Pago pendiente',canceled:'Cancelada'}

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Cuenta</p>
        <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Mi suscripción</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-aiden bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
      )}

      {sub ? (
        <>
          {/* Hero */}
          <div className="dark-hero p-6 mb-4 text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-1">Plan activo</div>
                <div className="text-2xl font-bold">{price?.nickname ?? price?.product?.name ?? 'Aiden'}</div>
              </div>
              {sub.status && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold" style={{background:(stColors[sub.status]??'#9E9E9E')+'25',color:stColors[sub.status]??'#9E9E9E'}}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:stColors[sub.status]??'#9E9E9E'}}/>
                  {stLabels[sub.status]??sub.status}
                </span>
              )}
            </div>
            {amount && <div className="text-4xl font-bold mb-4">{amount}<span className="text-lg font-normal text-white/60">/mes</span></div>}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wide mb-1">Días restantes</div>
                <div className={`text-lg font-bold ${daysLeft!==null&&daysLeft<=7?'text-red-400':''}`}>{daysLeft!==null?`${daysLeft}d`:'—'}</div>
              </div>
              <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wide mb-1">Renovación</div>
                <div className="text-sm font-bold">{sub.current_period_end?fmtDate(sub.current_period_end):'—'}</div>
              </div>
              <div className="bg-white/8 rounded-xl p-3 border border-white/10">
                <div className="text-[9px] font-bold text-white/40 uppercase tracking-wide mb-1">Cliente desde</div>
                <div className="text-sm font-bold">{sub.start_date?new Date(sub.start_date*1000).toLocaleDateString('es-ES',{month:'short',year:'numeric'}):'—'}</div>
              </div>
            </div>
            <button onClick={openPortal} className="w-full py-2.5 rounded-[10px] bg-white text-[#1D1D1F] text-sm font-bold hover:opacity-88 transition-opacity">
              Gestionar plan en Stripe →
            </button>
          </div>

          {/* Payment methods */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Métodos de pago</CardTitle>
              <Button variant="secondary" size="sm" onClick={openPortal}>+ Añadir tarjeta</Button>
            </CardHeader>
            <CardBody className="pt-0">
              {pms.length === 0 ? (
                <p className="text-sm text-[#7A7A8C]">Sin tarjetas guardadas. <button onClick={openPortal} className="text-brand underline">Añadir tarjeta →</button></p>
              ) : pms.map((pm: any) => {
                const card = pm.card ?? {}
                const isDefault = pm.id === data?.default_pm
                const brandBg: Record<string,string> = {visa:'#1A1F71',mastercard:'#EB001B',amex:'#2E77BC'}
                const bg = brandBg[card.brand?.toLowerCase()] ?? '#374151'
                return (
                  <div key={pm.id} className="p-4 rounded-aiden border border-black/6 bg-black/[.015] mb-2 last:mb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded text-white" style={{background:bg}}>{card.brand?.toUpperCase()}</span>
                      {isDefault && <span className="text-xs font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">Predeterminada</span>}
                    </div>
                    <div className="font-mono text-[17px] font-semibold tracking-wider mb-2">•••• •••• •••• {card.last4}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#7A7A8C]">Vence {card.exp_month}/{card.exp_year}</span>
                      <Button variant="ghost" size="sm" onClick={openPortal}>Gestionar</Button>
                    </div>
                  </div>
                )
              })}
            </CardBody>
          </Card>

          {/* Invoices */}
          {invs.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Historial de pagos</CardTitle></CardHeader>
              <CardBody className="pt-0">
                <div className="divide-y divide-black/5">
                  {invs.slice(0,8).map((inv: any) => (
                    <div key={inv.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <div className="flex-1 text-sm text-[#0A0A0F]">{fmtDate(inv.created)}</div>
                      <div className="text-sm font-semibold">{fmt(inv.amount_paid||inv.total||0, inv.currency||'eur')}</div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{background:inv.status==='paid'?'#34C75920':'#FF3B3020',color:inv.status==='paid'?'#13967e':'#FF3B30'}}>{inv.status==='paid'?'Pagada':'Pendiente'}</span>
                      {inv.invoice_pdf && <a href={inv.invoice_pdf} target="_blank" className="text-xs font-semibold text-brand hover:underline">PDF</a>}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      ) : !error && (
        <Card>
          <CardBody>
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💳</div>
              <h3 className="text-sm font-bold mb-1.5">Sin suscripción activa</h3>
              <p className="text-sm text-[#7A7A8C] mb-4">No hay ninguna suscripción asociada a tu cuenta.</p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
