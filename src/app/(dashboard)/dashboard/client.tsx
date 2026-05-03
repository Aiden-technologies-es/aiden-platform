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
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
  const greetEmoji = hour < 12 ? '👋' : hour < 18 ? '☀️' : '🌙'

  return (
    <div>
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-[15px] text-[#64748B] mb-1">{greetEmoji} {greeting}, {firstName}</p>
        <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight uppercase">
          {data?.customer?.name ?? 'AIDEN USER'}
        </h1>
      </div>

      {/* Expiry alert */}
      {expiringDomains.length > 0 && (
        <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
          <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div className="flex-1">
            <span className="text-sm font-semibold text-amber-800">{expiringDomains.map((d:any)=>d.domain).join(', ')}</span>
            <span className="text-sm text-amber-700"> vence pronto</span>
          </div>
          <Link href="/dominios" className="aiden-btn aiden-btn-sm bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200">Renovar</Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <Link href="/dominios">
          <div className="aiden-card p-5 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F172A]">{data?.domains?.length ?? 0}</div>
              <div className="text-[12px] text-[#64748B] font-medium">Dominios activos</div>
            </div>
          </div>
        </Link>
        <Link href="/correo">
          <div className="aiden-card p-5 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#0F172A]">{data?.mailboxes?.length ?? 0}</div>
              <div className="text-[12px] text-[#64748B] font-medium">Buzones de correo</div>
            </div>
          </div>
        </Link>
        <Link href="/soporte">
          <div className="aiden-card p-5 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${openTickets > 0 ? 'bg-[#FEF2F2]' : 'bg-[#F0FDF4]'}`}>
              <svg className={`w-5 h-5 ${openTickets > 0 ? 'text-[#EF4444]' : 'text-[#10B981]'}`} fill="none" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div className={`text-2xl font-bold ${openTickets > 0 ? 'text-[#EF4444]' : 'text-[#0F172A]'}`}>{openTickets}</div>
              <div className="text-[12px] text-[#64748B] font-medium">Consultas abiertas</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Dark hero card — domains summary */}
      {data?.domains?.length > 0 && (
        <div className="dark-hero p-6 mb-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <div className="text-[11px] font-semibold text-white/40 uppercase tracking-widest mb-1">Dominios</div>
              <h2 className="text-xl font-bold text-white">{data.domains[0]?.domain}</h2>
              <p className="text-[13px] text-white/50 mt-0.5">Registrador: Name.com</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>
                ACTIVO
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: 'Estado', value: 'Active' },
              { label: 'Vencimiento', value: data.domains[0]?.expires_at ? formatDate(data.domains[0].expires_at) : '—' },
              { label: 'Auto-renovación', value: data.domains[0]?.auto_renew ? 'Activada' : 'Desactivada' },
            ].map(item => (
              <div key={item.label} className="bg-white/[0.06] rounded-xl p-3 border border-white/[0.08]">
                <div className="text-[10px] font-semibold text-white/40 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-[14px] font-semibold text-white">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-4">
        {/* Tickets */}
        <div className="lg:col-span-3">
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
              <div>
                <h2 className="text-[14px] font-bold text-[#0F172A]">Mis consultas</h2>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Últimas consultas de soporte</p>
              </div>
              <Link href="/soporte" className="text-[12px] font-semibold text-[#6366F1] hover:underline">Ver todo →</Link>
            </div>
            <div className="p-4">
              {!data?.tickets?.length ? (
                <div className="text-center py-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                  </div>
                  <p className="text-sm text-[#94A3B8] mb-3">Aún no tienes consultas.</p>
                  <Link href="/soporte/nuevo" className="text-[13px] font-semibold text-[#6366F1] hover:underline">Crea tu primera consulta →</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {data.tickets.map((ticket: any) => {
                    const step = stepMap[ticket.status] ?? 1
                    const isWaiting = ticket.status === 'waiting_client'
                    return (
                      <Link key={ticket.id} href={`/soporte/${ticket.id}`}>
                        <div className={`p-4 rounded-xl border cursor-pointer hover:bg-[#F8FAFC] transition-colors ${isWaiting ? 'border-red-200 bg-red-50/50' : 'border-[#F1F5F9]'}`}>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-semibold text-[#0F172A] truncate">{ticket.subject}</div>
                              <div className="text-[11px] text-[#94A3B8] mt-0.5">{ticket.ticket_num} · {formatDate(ticket.created_at)}</div>
                            </div>
                            <span className="aiden-pill flex-shrink-0" style={{background:statusColor(ticket.status)+'18',color:statusColor(ticket.status)}}>{statusLabel(ticket.status)}</span>
                          </div>
                          <div className="flex items-center">
                            {TICKET_STEPS.map((s,i)=>{
                              const done=step>i+1;const active=step===i+1
                              return (
                                <div key={s} className="flex items-center flex-1 last:flex-none">
                                  <div className="flex flex-col items-center gap-1">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${done?'bg-[#6366F1]':active?'border-2 border-[#6366F1] bg-white':'bg-[#E2E8F0]'}`}>
                                      {done?<svg width="7" height="7" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                        :active?<div className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"/>
                                        :<div className="w-1 h-1 rounded-full bg-[#CBD5E1]"/>}
                                    </div>
                                    <span className={`text-[9px] font-medium whitespace-nowrap ${done||active?'text-[#6366F1]':'text-[#CBD5E1]'}`}>{s}</span>
                                  </div>
                                  {i<TICKET_STEPS.length-1&&<div className={`h-px flex-1 mx-1 mb-3.5 ${done?'bg-[#6366F1]':'bg-[#E2E8F0]'}`}/>}
                                </div>
                              )
                            })}
                          </div>
                          {isWaiting&&<div className="mt-2 text-[11px] text-red-500 font-semibold">Esperando tu respuesta</div>}
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
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-[14px] font-bold text-[#0F172A]">Tu configuración</h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">Acciones rápidas</p>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label:'Registrar dominio', href:'/dominios/nuevo', color:'#3B82F6', bg:'#EFF6FF', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg> },
                { label:'Crear buzón', href:'/correo/nuevo', color:'#F59E0B', bg:'#FFF7ED', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> },
                { label:'Nueva consulta', href:'/soporte/nuevo', color:'#EF4444', bg:'#FEF2F2', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg> },
              ].map(a=>(
                <Link key={a.label} href={a.href}>
                  <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:a.bg}}>
                      <span style={{color:a.color}}>{a.icon}</span>
                    </div>
                    <span className="text-[13px] font-medium text-[#374151] flex-1">{a.label}</span>
                    <svg className="w-3.5 h-3.5 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Domains list */}
          {data?.domains?.length > 0 && (
            <div className="aiden-card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#F1F5F9]">
                <h2 className="text-[14px] font-bold text-[#0F172A]">Dominios</h2>
                <Link href="/dominios" className="text-[12px] font-semibold text-[#6366F1] hover:underline">Ver todos →</Link>
              </div>
              <div className="divide-y divide-[#F8FAFC]">
                {data.domains.slice(0,4).map((d:any)=>{
                  const days=daysUntil(d.expires_at)
                  return(
                    <Link key={d.id} href={`/dominios/${d.id}`}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-[#3B82F6]" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-semibold text-[#0F172A] truncate">{d.domain}</div>
                          <div className="text-[11px] text-[#94A3B8]">{days!==null?`${days}d restantes`:'—'}</div>
                        </div>
                        <span className="aiden-pill text-[10px]" style={{background:days!==null&&days<=30?'#FEF2F2':'#F0FDF4',color:days!==null&&days<=30?'#DC2626':'#16A34A'}}>{d.status==='active'?'Activo':d.status}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {!data?.domains?.length && (
            <div className="aiden-card p-6 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24"><path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <h3 className="text-sm font-bold text-[#0F172A] mb-1">Empieza aquí</h3>
              <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">Registra tu primer dominio y crea tu correo profesional.</p>
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
