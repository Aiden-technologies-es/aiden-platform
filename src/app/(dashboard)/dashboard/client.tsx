'use client'
import Link from 'next/link'
import { formatDate, statusColor, statusLabel, daysUntil } from '@/lib/utils'

const TICKET_STEPS = ['Enviada','En revisión','Respondida','Resuelta']

interface Props {
  firstName: string
  data: any
  openTickets: number
  expiringDomains: any[]
  stepMap: Record<string, number>
}

export function DashboardClient({ firstName, data, openTickets, expiringDomains, stepMap }: Props) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#111] tracking-tight">Bienvenido, {firstName}</h1>
        <p className="text-sm text-[#71717A] mt-0.5">Panel de control de Aiden</p>
      </div>

      {/* Expiry alert */}
      {expiringDomains.length > 0 && (
        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-amber-800">{expiringDomains.map((d:any)=>d.domain).join(', ')} </span>
            <span className="text-sm text-amber-700">vence pronto.</span>
          </div>
          <Link href="/dominios" className="aiden-btn aiden-btn-sm bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 flex-shrink-0">Renovar</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Dominios', value: data?.domains.length ?? 0, href: '/dominios', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg> },
          { label: 'Buzones', value: data?.mailboxes.length ?? 0, href: '/correo', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
          { label: 'Consultas abiertas', value: openTickets, href: '/soporte', alert: openTickets > 0, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg> },
        ].map(s => (
          <Link key={s.label} href={s.href}>
            <div className="aiden-card p-4 cursor-pointer hover:border-[#D4D4D8] transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className={s.alert ? 'text-red-500' : 'text-[#71717A]'}>{s.icon}</span>
              </div>
              <div className={`text-2xl font-bold tracking-tight mb-0.5 ${s.alert ? 'text-red-500' : 'text-[#111]'}`}>{s.value}</div>
              <div className="text-xs text-[#71717A] font-medium">{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Tickets */}
        <div className="lg:col-span-3">
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F4F5]">
              <h2 className="text-sm font-semibold text-[#111]">Mis consultas</h2>
              <Link href="/soporte" className="text-xs text-[#71717A] hover:text-[#111] transition-colors">Ver todas →</Link>
            </div>
            <div className="p-4">
              {!data?.tickets.length ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <p className="text-sm text-[#71717A] mb-3">Sin consultas activas</p>
                  <Link href="/soporte/nuevo" className="aiden-btn aiden-btn-primary aiden-btn-sm">Nueva consulta</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.tickets.map((ticket: any) => {
                    const step = stepMap[ticket.status] ?? 1
                    const isWaiting = ticket.status === 'waiting_client'
                    return (
                      <Link key={ticket.id} href={`/soporte/${ticket.id}`}>
                        <div className={`p-4 rounded-xl border cursor-pointer hover:bg-[#FAFAFA] transition-colors ${isWaiting ? 'border-red-200 bg-red-50/50' : 'border-[#F4F4F5]'}`}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-[#111] truncate">{ticket.subject}</div>
                              <div className="text-xs text-[#A1A1AA] mt-0.5">{ticket.ticket_num} · {formatDate(ticket.created_at)}</div>
                            </div>
                            <span className="aiden-pill flex-shrink-0" style={{background:statusColor(ticket.status)+'15',color:statusColor(ticket.status)}}>{statusLabel(ticket.status)}</span>
                          </div>
                          {/* Timeline */}
                          <div className="flex items-center">
                            {TICKET_STEPS.map((s,i)=>{
                              const done=step>i+1;const active=step===i+1
                              return(
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done?'bg-[#111]':active?'border-2 border-[#111] bg-white':'bg-[#E4E4E7]'}`}>
                                      {done?<svg width="7" height="7" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        :active?<div className="w-1.5 h-1.5 rounded-full bg-[#111]"/>
                                        :<div className="w-1 h-1 rounded-full bg-[#A1A1AA]"/>}
                                    </div>
                                    <span className={`text-[9px] font-medium whitespace-nowrap ${done||active?'text-[#111]':'text-[#D4D4D8]'}`}>{s}</span>
                                  </div>
                                  {i<TICKET_STEPS.length-1&&<div className={`h-px flex-1 mx-1 mb-3.5 ${done?'bg-[#111]':'bg-[#E4E4E7]'}`}/>}
                                </div>
                              )
                            })}
                          </div>
                          {isWaiting&&<div className="mt-2 text-xs text-red-500 font-medium">Esperando tu respuesta</div>}
                        </div>
                      </Link>
                    )
                  })}
                  <Link href="/soporte/nuevo">
                    <button className="aiden-btn aiden-btn-secondary w-full mt-1 text-xs">+ Nueva consulta</button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-4">
          {/* Quick actions */}
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F4F4F5]">
              <h2 className="text-sm font-semibold text-[#111]">Acciones rápidas</h2>
            </div>
            <div className="p-2">
              {[
                { label:'Registrar dominio', href:'/dominios/nuevo', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg> },
                { label:'Crear buzón de correo', href:'/correo/nuevo', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
                { label:'Abrir consulta', href:'/soporte/nuevo', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg> },
              ].map(a=>(
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#F4F4F5] transition-colors cursor-pointer">
                    <span className="text-[#71717A]">{a.icon}</span>
                    <span className="text-[13px] font-medium text-[#111] flex-1">{a.label}</span>
                    <svg className="w-3.5 h-3.5 text-[#D4D4D8]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Domains */}
          {data?.domains.length > 0 && (
            <div className="aiden-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F4F5]">
                <h2 className="text-sm font-semibold text-[#111]">Dominios</h2>
                <Link href="/dominios" className="text-xs text-[#71717A] hover:text-[#111] transition-colors">Ver todos →</Link>
              </div>
              <div className="divide-y divide-[#F4F4F5]">
                {data.domains.slice(0,4).map((d:any)=>{
                  const days=daysUntil(d.expires_at)
                  return(
                    <Link key={d.id} href={`/dominios/${d.id}`}>
                      <div className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAFAFA] transition-colors cursor-pointer">
                        <div className="w-7 h-7 rounded-lg bg-[#F4F4F5] flex items-center justify-center flex-shrink-0">
                          <svg className="w-3.5 h-3.5 text-[#71717A]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12h20M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-medium text-[#111] truncate">{d.domain}</div>
                          <div className="text-[11px] text-[#A1A1AA]">{days!==null?`${days}d restantes`:'—'}</div>
                        </div>
                        <span className="aiden-pill" style={{background:days!==null&&days<=30?'#FEF2F2':'#F0FDF4',color:days!==null&&days<=30?'#DC2626':'#16A34A'}}>{d.status==='active'?'Activo':d.status}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {!data?.domains.length && (
            <div className="aiden-card p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F4F4F5] flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-sm font-semibold text-[#111] mb-1">Empieza aquí</h3>
              <p className="text-xs text-[#71717A] mb-4 leading-relaxed">Registra tu primer dominio y crea tu correo profesional.</p>
              <Link href="/dominios/nuevo">
                <button className="aiden-btn aiden-btn-primary aiden-btn-sm w-full">Registrar dominio</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
