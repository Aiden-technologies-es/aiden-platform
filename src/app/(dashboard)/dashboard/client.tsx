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

const item = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
})

export function DashboardClient({ firstName, data, openTickets, expiringDomains, stepMap }: Props) {
  return (
    <div>
      {/* Greeting */}
      <motion.div className="mb-7" {...item(0)}>
        <p className="text-[11px] font-semibold text-[#AAAAAA] uppercase tracking-widest mb-1">Panel de control</p>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#1A1A1A] tracking-tight">
          Bienvenido, {firstName}
        </h1>
      </motion.div>

      {/* Expiry alert */}
      {expiringDomains.length > 0 && (
        <motion.div {...item(1)} className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-amber-800">{expiringDomains.length === 1 ? 'Dominio próximo a vencer' : `${expiringDomains.length} dominios próximos a vencer`}</div>
            <div className="text-xs text-amber-700 mt-0.5">{expiringDomains.map((d:any)=>d.domain).join(', ')}</div>
          </div>
          <Link href="/dominios" className="aiden-btn aiden-btn-sm text-amber-700 bg-amber-100 hover:bg-amber-200 border border-amber-200 flex-shrink-0">Renovar</Link>
        </motion.div>
      )}

      {/* Stats */}
      <motion.div className="grid grid-cols-3 gap-3 mb-5" {...item(1)}>
        {[
          { label: 'Dominios activos', value: data?.domains.length ?? 0, href: '/dominios', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#13967e" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg>, color: '#13967e' },
          { label: 'Buzones de correo', value: data?.mailboxes.length ?? 0, href: '/correo', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="#0071E3" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg>, color: '#0071E3' },
          { label: 'Consultas abiertas', value: openTickets, href: '/soporte', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={openTickets > 0 ? '#E53935' : '#888'} strokeWidth="1.8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg>, color: openTickets > 0 ? '#E53935' : '#888' },
        ].map(stat => (
          <Link key={stat.label} href={stat.href}>
            <div className="aiden-card p-4 cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{background: stat.color + '12'}}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold tracking-tight" style={{color: stat.color === '#888' ? '#1A1A1A' : stat.color}}>{stat.value}</div>
                  <div className="text-[11px] text-[#888] font-medium leading-tight">{stat.label}</div>
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
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
              <h2 className="text-[14px] font-bold text-[#1A1A1A]">Mis consultas</h2>
              <Link href="/soporte" className="text-xs font-semibold text-[#13967e] hover:underline">Ver todas</Link>
            </div>
            <div className="p-4">
              {!data?.tickets.length ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <p className="text-sm text-[#888] mb-4">Sin consultas activas</p>
                  <Link href="/soporte/nuevo" className="aiden-btn aiden-btn-primary aiden-btn-sm">Nueva consulta</Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.tickets.map((ticket: any, i: number) => {
                    const step = stepMap[ticket.status] ?? 1
                    const isWaiting = ticket.status === 'waiting_client'
                    return (
                      <Link key={ticket.id} href={`/soporte/${ticket.id}`}>
                        <div className={`p-4 rounded-xl border cursor-pointer hover:bg-[#FAFAFA] transition-colors ${isWaiting ? 'border-red-200 bg-red-50/30' : 'border-[#EBEBEB]'}`}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{ticket.subject}</div>
                              <div className="text-[11px] text-[#888] mt-0.5">{ticket.ticket_num} · {formatDate(ticket.created_at)}</div>
                            </div>
                            <span className="aiden-pill flex-shrink-0" style={{ background: statusColor(ticket.status)+'18', color: statusColor(ticket.status) }}>
                              {statusLabel(ticket.status)}
                            </span>
                          </div>
                          {/* Timeline */}
                          <div className="flex items-center">
                            {TICKET_STEPS.map((s, i) => {
                              const done = step > i+1; const active = step === i+1
                              return (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${done?'bg-[#13967e]':active?'border-2 border-[#13967e] bg-white':'bg-[#EBEBEB]'}`}>
                                      {done ? <svg width="9" height="9" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        : active ? <div className="w-2 h-2 rounded-full bg-[#13967e]"/>
                                        : <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC]"/>}
                                    </div>
                                    <span className={`text-[9px] font-semibold whitespace-nowrap ${done||active?'text-[#13967e]':'text-[#CCCCCC]'}`}>{s}</span>
                                  </div>
                                  {i < TICKET_STEPS.length-1 && <div className={`h-0.5 flex-1 mx-1 mb-3.5 rounded-full ${done?'bg-[#13967e]':'bg-[#EBEBEB]'}`}/>}
                                </div>
                              )
                            })}
                          </div>
                          {isWaiting && <div className="mt-2 text-[11px] text-red-500 font-semibold flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>El equipo espera tu respuesta</div>}
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
              <div className="px-5 py-4 border-b border-[#F0F0F0]">
                <h2 className="text-[14px] font-bold text-[#1A1A1A]">Acciones rápidas</h2>
              </div>
              <div className="p-2">
                {[
                  { label: 'Registrar dominio', href: '/dominios/nuevo', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg> },
                  { label: 'Crear buzón de correo', href: '/correo/nuevo', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
                  { label: 'Abrir consulta de soporte', href: '/soporte/nuevo', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg> },
                ].map(action => (
                  <Link key={action.label} href={action.href}>
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer">
                      <div className="w-8 h-8 rounded-lg bg-[#F0F0F0] flex items-center justify-center text-[#555] flex-shrink-0">
                        {action.icon}
                      </div>
                      <span className="text-[13px] font-medium text-[#333] flex-1">{action.label}</span>
                      <svg className="w-4 h-4 text-[#CCCCCC]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {data?.domains.length > 0 && (
            <motion.div {...item(4)}>
              <div className="aiden-card overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
                  <h2 className="text-[14px] font-bold text-[#1A1A1A]">Dominios</h2>
                  <Link href="/dominios" className="text-xs font-semibold text-[#13967e] hover:underline">Ver todos</Link>
                </div>
                <div className="divide-y divide-[#F5F5F5]">
                  {data.domains.slice(0,3).map((domain: any) => {
                    const days = daysUntil(domain.expires_at)
                    const color = days !== null && days <= 30 ? '#E53935' : '#13967e'
                    return (
                      <Link key={domain.id} href={`/dominios/${domain.id}`}>
                        <div className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded-lg bg-[#F0FAF7] flex items-center justify-center flex-shrink-0">
                            <svg className="w-4 h-4 text-[#13967e]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12h20M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">{domain.domain}</div>
                            <div className="text-[11px] text-[#888]">{days !== null ? `Vence en ${days} días` : '—'}</div>
                          </div>
                          <span className="aiden-pill" style={{ background: color+'15', color }}>{domain.status==='active'?'Activo':domain.status}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {!data?.domains.length && !data?.mailboxes.length && (
            <motion.div {...item(4)}>
              <div className="aiden-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#F0FAF7] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#13967e]" fill="none" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5">Empieza aquí</h3>
                <p className="text-xs text-[#888] mb-4 leading-relaxed">Registra tu primer dominio y crea tu correo profesional.</p>
                <Link href="/dominios/nuevo">
                  <button className="aiden-btn aiden-btn-primary aiden-btn-sm w-full">Registrar dominio</button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
