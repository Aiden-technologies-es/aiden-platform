'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { formatDate, daysUntil } from '@/lib/utils'

interface Domain {
  id: string
  domain: string
  status: string
  expires_at: string | null
  auto_renew: boolean
  nameservers: string[] | null
  registrar: string
}

interface DnsRecord {
  id: number
  host: string
  type: string
  answer: string
  ttl: number
}

const DNS_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SRV']

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
  }
}

export default function DomainDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [domain, setDomain] = useState<Domain | null>(null)
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [dnsLoading, setDnsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'dns' | 'nameservers'>('overview')

  // New DNS record form
  const [newRecord, setNewRecord] = useState({ host: '', type: 'A', answer: '', ttl: 300 })
  const [addingDns, setAddingDns] = useState(false)
  const [showAddDns, setShowAddDns] = useState(false)

  // Renew
  const [renewing, setRenewing] = useState(false)

  useEffect(() => { loadDomain() }, [id])
  useEffect(() => { if (activeTab === 'dns') loadDns() }, [activeTab])

  async function loadDomain() {
    setLoading(true)
    try {
      const res = await fetch(`/api/domains/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDomain(data.domain)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function loadDns() {
    if (!domain) return
    setDnsLoading(true)
    try {
      const res = await fetch(`/api/domains/${id}/dns`)
      const data = await res.json()
      setDnsRecords(data.records ?? [])
    } catch { /* ignore */ }
    finally { setDnsLoading(false) }
  }

  async function addDnsRecord() {
    if (!newRecord.host || !newRecord.answer) return
    setAddingDns(true)
    try {
      const res = await fetch(`/api/domains/${id}/dns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setNewRecord({ host: '', type: 'A', answer: '', ttl: 300 })
      setShowAddDns(false)
      loadDns()
    } catch (e: any) { alert(e.message) }
    finally { setAddingDns(false) }
  }

  async function deleteDnsRecord(recordId: number) {
    if (!confirm('¿Eliminar este registro DNS?')) return
    await fetch(`/api/domains/${id}/dns/${recordId}`, { method: 'DELETE' })
    loadDns()
  }

  async function renewDomain() {
    if (!confirm(`¿Renovar ${domain?.domain} por 1 año?`)) return
    setRenewing(true)
    try {
      const res = await fetch(`/api/domains/${id}/renew`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      alert('¡Dominio renovado correctamente!')
      loadDomain()
    } catch (e: any) { alert(e.message) }
    finally { setRenewing(false) }
  }

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-48 skeleton rounded-xl mb-6" />
      <div className="aiden-card p-6"><div className="h-32 skeleton rounded-xl" /></div>
    </div>
  )

  if (error || !domain) return (
    <div className="text-center py-16">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="text-sm text-[#7A7A8C]">{error || 'Dominio no encontrado'}</p>
      <button onClick={() => router.push('/dominios')} className="aiden-btn aiden-btn-secondary aiden-btn-sm mt-4">
        Volver a dominios
      </button>
    </div>
  )

  const days = daysUntil(domain.expires_at)
  const isExpiringSoon = days !== null && days <= 30
  const statusColor = domain.status === 'active' ? '#34C759' : '#FF9500'

  return (
    <div>
      {/* Back */}
      <motion.button
        onClick={() => router.push('/dominios')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-5 hover:text-[#0A0A0F] transition-colors"
        {...fadeUp(0)}
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Mis dominios
      </motion.button>

      {/* Header */}
      <motion.div className="mb-6" {...fadeUp(0.05)}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">🌐</span>
              <h1 className="text-2xl font-black text-[#0A0A0F] tracking-tight">{domain.domain}</h1>
              <span className="aiden-pill" style={{ background: statusColor + '20', color: statusColor }}>
                {domain.status === 'active' ? 'Activo' : domain.status}
              </span>
            </div>
            <div className="text-sm text-[#7A7A8C] ml-9">
              {domain.expires_at
                ? <>Vence el {formatDate(domain.expires_at)}{days !== null && <span className={isExpiringSoon ? ' text-red-500 font-semibold' : ''}> · {days} días</span>}</>
                : 'Sin fecha de vencimiento'
              }
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={renewDomain}
              disabled={renewing}
              className="aiden-btn aiden-btn-primary"
            >
              {renewing ? 'Renovando…' : 'Renovar 1 año'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Expiry alert */}
      {isExpiringSoon && (
        <motion.div {...fadeUp(0.08)} className="mb-4 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-700">Este dominio vence pronto</div>
            <div className="text-xs text-red-600">Renuévalo para no perder acceso a tu dominio y correo.</div>
          </div>
        </motion.div>
      )}

      {/* Tabs */}
      <motion.div {...fadeUp(0.1)}>
        <div className="flex gap-1 mb-4 p-1 bg-black/5 rounded-xl w-fit">
          {(['overview', 'dns', 'nameservers'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab ? 'bg-white shadow-sm text-[#0A0A0F]' : 'text-[#7A7A8C] hover:text-[#0A0A0F]'
              }`}
            >
              {tab === 'overview' ? 'Resumen' : tab === 'dns' ? 'Registros DNS' : 'Nameservers'}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="aiden-card p-5">
              <h3 className="text-sm font-bold text-[#0A0A0F] mb-4">Información del dominio</h3>
              <div className="space-y-3">
                {[
                  { label: 'Dominio', value: domain.domain },
                  { label: 'Estado', value: domain.status === 'active' ? '✅ Activo' : domain.status },
                  { label: 'Registrador', value: domain.registrar || 'Name.com' },
                  { label: 'Renovación automática', value: domain.auto_renew ? '✅ Activada' : '❌ Desactivada' },
                  { label: 'Fecha de vencimiento', value: domain.expires_at ? formatDate(domain.expires_at) : '—' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                    <span className="text-xs font-semibold text-[#7A7A8C]">{item.label}</span>
                    <span className="text-sm font-medium text-[#0A0A0F]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Quick actions */}
              <div className="aiden-card p-5">
                <h3 className="text-sm font-bold text-[#0A0A0F] mb-3">Acciones</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('dns')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/4 transition-colors text-left">
                    <span className="text-lg">📋</span>
                    <div>
                      <div className="text-sm font-semibold text-[#0A0A0F]">Gestionar DNS</div>
                      <div className="text-xs text-[#7A7A8C]">Añadir o editar registros DNS</div>
                    </div>
                    <svg className="w-4 h-4 text-[#AEAEB2] ml-auto" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                  <button onClick={() => setActiveTab('nameservers')} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/4 transition-colors text-left">
                    <span className="text-lg">🔗</span>
                    <div>
                      <div className="text-sm font-semibold text-[#0A0A0F]">Nameservers</div>
                      <div className="text-xs text-[#7A7A8C]">Ver o cambiar nameservers</div>
                    </div>
                    <svg className="w-4 h-4 text-[#AEAEB2] ml-auto" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                  <button onClick={renewDomain} disabled={renewing} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-black/4 transition-colors text-left">
                    <span className="text-lg">🔄</span>
                    <div>
                      <div className="text-sm font-semibold text-[#0A0A0F]">Renovar dominio</div>
                      <div className="text-xs text-[#7A7A8C]">Extender 1 año más</div>
                    </div>
                    <svg className="w-4 h-4 text-[#AEAEB2] ml-auto" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              {/* Info box */}
              <div className="aiden-card p-5 bg-[#13967e]/4 border-[#13967e]/20">
                <div className="text-sm font-bold text-[#0A0A0F] mb-2">💡 ¿Necesitas correo?</div>
                <p className="text-xs text-[#7A7A8C] leading-relaxed mb-3">
                  Crea buzones de correo profesional con este dominio, como <span className="font-mono text-[#13967e]">tu@{domain.domain}</span>
                </p>
                <button onClick={() => router.push('/correo/nuevo')} className="aiden-btn aiden-btn-primary aiden-btn-sm w-full">
                  Crear buzón de correo →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DNS tab */}
        {activeTab === 'dns' && (
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <div>
                <h3 className="text-sm font-bold text-[#0A0A0F]">Registros DNS</h3>
                <p className="text-xs text-[#7A7A8C] mt-0.5">Los cambios pueden tardar hasta 48h en propagarse</p>
              </div>
              <button onClick={() => setShowAddDns(!showAddDns)} className="aiden-btn aiden-btn-primary aiden-btn-sm">
                {showAddDns ? 'Cancelar' : '+ Añadir registro'}
              </button>
            </div>

            {/* Add DNS form */}
            {showAddDns && (
              <div className="p-5 border-b border-black/5 bg-[#13967e]/3">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Host</label>
                    <input className="aiden-input" placeholder="@" value={newRecord.host} onChange={e => setNewRecord(r => ({ ...r, host: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Tipo</label>
                    <select className="aiden-input" value={newRecord.type} onChange={e => setNewRecord(r => ({ ...r, type: e.target.value }))}>
                      {DNS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Valor</label>
                    <input className="aiden-input" placeholder="1.2.3.4" value={newRecord.answer} onChange={e => setNewRecord(r => ({ ...r, answer: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">TTL</label>
                    <input className="aiden-input" type="number" value={newRecord.ttl} onChange={e => setNewRecord(r => ({ ...r, ttl: parseInt(e.target.value) }))} />
                  </div>
                </div>
                <button onClick={addDnsRecord} disabled={addingDns} className="aiden-btn aiden-btn-primary aiden-btn-sm">
                  {addingDns ? 'Añadiendo…' : 'Añadir registro'}
                </button>
              </div>
            )}

            {/* DNS records list */}
            <div>
              {dnsLoading ? (
                <div className="p-8 text-center">
                  <div className="inline-block w-6 h-6 border-2 border-[#13967e] border-t-transparent rounded-full animate-spin mb-2" />
                  <p className="text-sm text-[#7A7A8C]">Cargando registros DNS…</p>
                </div>
              ) : dnsRecords.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-3xl mb-2">📋</div>
                  <p className="text-sm text-[#7A7A8C]">No hay registros DNS todavía</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-black/5">
                        <th className="text-left px-5 py-3 text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">Host</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">Tipo</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">Valor</th>
                        <th className="text-left px-3 py-3 text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">TTL</th>
                        <th className="px-5 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/4">
                      {dnsRecords.map(record => (
                        <tr key={record.id} className="hover:bg-black/2 transition-colors">
                          <td className="px-5 py-3 font-mono text-xs">{record.host || '@'}</td>
                          <td className="px-3 py-3">
                            <span className="px-2 py-0.5 rounded-md bg-black/6 text-xs font-bold">{record.type}</span>
                          </td>
                          <td className="px-3 py-3 font-mono text-xs text-[#4A4A5A] max-w-[200px] truncate">{record.answer}</td>
                          <td className="px-3 py-3 text-xs text-[#7A7A8C]">{record.ttl}s</td>
                          <td className="px-5 py-3">
                            <button
                              onClick={() => deleteDnsRecord(record.id)}
                              className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nameservers tab */}
        {activeTab === 'nameservers' && (
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-2">Nameservers actuales</h3>
            <p className="text-xs text-[#7A7A8C] mb-4">Los nameservers controlan dónde se gestionan los DNS de tu dominio.</p>
            {domain.nameservers && domain.nameservers.length > 0 ? (
              <div className="space-y-2 mb-4">
                {domain.nameservers.map((ns, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-black/3 rounded-xl">
                    <span className="text-xs font-bold text-[#7A7A8C] w-5">NS{i+1}</span>
                    <span className="font-mono text-sm text-[#0A0A0F]">{ns}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-black/3 rounded-xl text-sm text-[#7A7A8C] mb-4">
                Usando nameservers por defecto de Name.com
              </div>
            )}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700">
                <strong>Atención:</strong> Cambiar los nameservers puede interrumpir el correo y otros servicios asociados al dominio. Solo modifícalos si sabes lo que haces.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
