'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { formatDate, statusColor, statusLabel, daysUntil } from '@/lib/utils'

const TICKET_STEPS = ['Enviada', 'En revisión', 'Respondida', 'Resuelta']

interface Props {
  firstName: string
  data: any
  openTickets: number
  expiringDomains: any[]
  stepMap: Record<string, number>
}

// Fast, no delay — just opacity+y
const item = (i: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
})

export function DashboardClient({ firstName, data, openTickets, expiringDomains, stepMap }: Props) {
  return (
    <div>
      {/* Greeting */}
      <motion.div className="mb-8" {...item(0)}>
        <p className="text-[11px] font-bold text-[#9A9AB0] uppercase tracking-widest mb-1">Bienvenido de nuevo,</p>
        <h1 className="text-3xl lg:text-4xl font-black text-[#0A0A0F] tracking-tight">{firstName} 👋</h1>
      </motion.div>

      {/* Alert */}
      {expiringDomains.length > 0 && (
        <motion.div {...item(1)} className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-red-700">{expiringDomains.length === 1 ? 'Dominio próximo a vencer' : `${expiringDomains.length} dominios próximos a vencer`}</div>
            <div className="text-xs text-red-600 mt-0.5">{expiringDomains.map((d:any)=>d.domain).join(', ')}</div>
          </div>
          <Link href="/dominios" className="aiden-btn aiden-btn-danger aiden-btn-sm flex-shrink-0">Renovar →</Link>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div className="grid grid-cols-3 gap-3 mb-6" {...item(1)}>
        {[
          { label: 'Dominios', value: data?.domains.length ?? 0, icon: '🌐', href: '/dominios' },
          { label: 'Buzones', value: data?.mailboxes.length ?? 0, icon: '📧', href: '/correo' },
          { label: 'Consultas', value: openTickets, icon: '💬', href: '/soporte', alert: openTickets > 0 },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="aiden-card p-4 cursor-pointer hover:shadow-md transition-shadow duration-150">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-black/4">
                  {stat.icon}
                </div>
                <div>
                  <div className={`text-2xl font-black tracking-tight ${stat.alert ? 'text-red-500' : 'text-[#0A0A0F]'}`}>{stat.value}</div>
                  <div className="text-[11px] text-[#7A7A8C] font-medium">{stat.label}</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Tickets */}
        <motion.div className="lg:col-span-3" {...item(2)}>
          <div className="aiden-card overflow-hidden h-full">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <h2 className="text-[15px] font-bold text-[#0A0A0F]">Mis consultas</h2>
              <Link href="/soporte" className="text-xs font-semibold text-[#13967e] hover:underline">Ver todas →</Link>
            </div>
            <div className="p-4">
              {!data?.tickets.length ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-sm text-[#7A7A8C] mb-4">Sin consultas activas</p>
                  <Link href="/soporte/nuevo" className="aiden-btn aiden-btn-primary aiden-btn-sm">+ Nueva consulta</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.tickets.map((ticket: any, i: number) => {
                    const step = stepMap[ticket.status] ?? 1
                    const isWaiting = ticket.status === 'waiting_client'
                    return (
                      <Link key={ticket.id} href={`/soporte/${ticket.id}`}>
                        <div className={`p-4 rounded-2xl border cursor-pointer hover:shadow-sm transition-shadow duration-150 ${isWaiting ? 'border-pink-200 bg-pink-50/40' : 'border-black/6 bg-black/[.015]'}`}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-bold text-[#0A0A0F] truncate">{ticket.subject}</div>
                              <div className="text-[11px] text-[#7A7A8C] mt-0.5">{ticket.ticket_num} · {formatDate(ticket.created_at)}</div>
                            </div>
                            <span className="aiden-pill flex-shrink-0" style={{ background: statusColor(ticket.status)+'20', color: statusColor(ticket.status) }}>
                              {statusLabel(ticket.status)}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {TICKET_STEPS.map((s, i) => {
                              const done = step > i+1; const active = step === i+1
                              return (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done?'bg-[#13967e]':active?'border-2 border-[#13967e] bg-white':'bg-black/8'}`}>
                                      {done ? <svg width="9" height="9" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        : active ? <div className="w-2 h-2 rounded-full bg-[#13967e]"/>
                                        : <div className="w-1.5 h-1.5 rounded-full bg-black/20"/>}
                                    </div>
                                    <span className={`text-[9px] font-semibold whitespace-nowrap ${done||active?'text-[#13967e]':'text-[#AEAEB2]'}`}>{s}</span>
                                  </div>
                                  {i < TICKET_STEPS.length-1 && <div className={`h-0.5 flex-1 mx-1 mb-3.5 rounded-full ${done?'bg-[#13967e]':'bg-black/8'}`}/>}
                                </div>
                              )
                            })}
                          </div>
                          {isWaiting && <div className="mt-2 text-[11px] text-pink-600 font-semibold">⚡ El equipo espera tu respuesta</div>}
                        </div>
                      </Link>
                    )
                  })}
                  <Link href="/soporte/nuevo">
                    <button className="aiden-btn aiden-btn-secondary w-full mt-1">+ Nueva consulta</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right column */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div {...item(3)}>
            <div className="aiden-card overflow-hidden">
              <div className="px-5 py-4 border-b border-black/5">
                <h2 className="text-[15px] font-bold text-[#0A0A0F]">Acciones rápidas</h2>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { label: 'Registrar dominio', icon: '🌐', href: '/dominios/nuevo' },
                  { label: 'Crear buzón de correo', icon: '📧', href: '/correo/nuevo' },
                  { label: 'Nueva consulta', icon: '💬', href: '/soporte/nuevo' },
                ].map(action => (
                  <Link key={action.label} href={action.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/4 transition-colors duration-100 cursor-pointer">
                      <span className="text-lg w-8 text-center">{action.icon}</span>
                      <span className="text-[13px] font-semibold text-[#0A0A0F] flex-1">{action.label}</span>
                      <svg className="w-4 h-4 text-[#AEAEB2]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {data?.domains.length > 0 && (
            <motion.div {...item(4)}>
              <div className="aiden-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
                  <h2 className="text-[15px] font-bold text-[#0A0A0F]">Dominios</h2>
                  <Link href="/dominios" className="text-xs font-semibold text-[#13967e] hover:underline">Ver todos →</Link>
                </div>
                <div className="divide-y divide-black/5">
                  {data.domains.slice(0,3).map((domain: any) => {
                    const days = daysUntil(domain.expires_at)
                    const color = days !== null && days <= 30 ? '#FF3B30' : '#34C759'
                    return (
                      <div key={domain.id} className="flex items-center gap-3 px-5 py-3">
                        <span className="text-base">🌐</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#0A0A0F] truncate">{domain.domain}</div>
                          <div className="text-[11px] text-[#7A7A8C]">{days !== null ? `${days}d restantes` : '—'}</div>
                        </div>
                        <span className="aiden-pill" style={{ background: color+'20', color }}>{domain.status==='active'?'Activo':domain.status}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {!data?.domains.length && !data?.mailboxes.length && (
            <motion.div {...item(4)}>
              <div className="aiden-card p-6 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="text-sm font-bold text-[#0A0A0F] mb-1.5">Empieza aquí</h3>
                <p className="text-xs text-[#7A7A8C] mb-4 leading-relaxed">Registra tu primer dominio y crea tu correo profesional.</p>
                <Link href="/dominios/nuevo">
                  <button className="aiden-btn aiden-btn-primary aiden-btn-sm w-full">Registrar dominio →</button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
