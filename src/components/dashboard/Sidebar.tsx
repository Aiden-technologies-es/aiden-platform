'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'

const NAV_PRINCIPAL = [
  { href: '/dashboard',   label: 'Dashboard',    color: '#16A34A', bg: '#DCFCE7', icon: IconDashboard },
  { href: '/dominios',    label: 'Dominios',     color: '#2563EB', bg: '#DBEAFE', icon: IconDomains },
  { href: '/correo',      label: 'Correo',       color: '#DC2626', bg: '#FEE2E2', icon: IconMail },
  { href: '/hosting',     label: 'Hosting',      color: '#D97706', bg: '#FEF3C7', icon: IconHosting },
  { href: '/soporte',     label: 'Soporte',      color: '#7C3AED', bg: '#EDE9FE', icon: IconSupport },
]
const NAV_RECURSOS = [
  { href: '/suscripcion', label: 'Facturación',  color: '#0891B2', bg: '#CFFAFE', icon: IconBilling },
  { href: '/settings',    label: 'Configuración',color: '#64748B', bg: '#F1F5F9', icon: IconSettings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  const renderItem = (item: any) => {
    const active = pathname === item.href || pathname.startsWith(item.href + '/')
    const Icon = item.icon
    return (
      <Link key={item.href} href={item.href}>
        <div className={cn(
          'flex items-center gap-2.5 px-2 py-[5px] rounded-xl transition-all duration-100 mb-0.5',
          active ? 'bg-white shadow-sm' : 'hover:bg-white/50'
        )}>
          <div className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
            <Icon color={item.color} />
          </div>
          <span className={cn('flex-1 text-[13px]', active ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#374151]')}>
            {item.label}
          </span>
          {item.badge > 0 && (
            <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#3B82F6]/15 text-[#2563EB] text-[10px] font-bold flex items-center justify-center">
              {item.badge}
            </span>
          )}
        </div>
      </Link>
    )
  }

  return (
    <aside className="w-[215px] flex flex-col h-screen bg-[#E8EBF4] border-r border-[#D4D8E8]">
      {/* Logo */}
      <div className="px-3.5 pt-4 pb-2.5">
        <div className="flex items-center justify-between mb-3">
          <img src="/aiden-logo.png" alt="Aiden" className="h-6 w-auto object-contain object-left"
            onError={e => {
              e.currentTarget.style.display='none'
              const p=e.currentTarget.parentElement
              if(p&&!p.querySelector('.lf')){const d=document.createElement('span');d.className='lf text-base font-black text-[#0F172A]';d.textContent='aiden';p.prepend(d)}
            }}
          />
          <button className="w-6 h-6 rounded-lg hover:bg-white/60 flex items-center justify-center transition-colors">
            <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Company card */}
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl bg-white shadow-sm hover:shadow-md transition-all text-left">
          <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 overflow-hidden">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover"/>
              : <span>{initials(user?.fullName ?? 'A')}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-extrabold text-[#0F172A] truncate uppercase tracking-wide leading-none mb-0.5">{user?.fullName?.toUpperCase().slice(0,15) ?? 'AIDEN USER'}</div>
            <div className="text-[10px] text-[#94A3B8]">Plan Free</div>
          </div>
          <svg className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-1 overflow-y-auto">
        <div className="mb-3">
          <div className="px-2 mb-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Principal</div>
          {NAV_PRINCIPAL.map(renderItem)}
        </div>
        <div>
          <div className="px-2 mb-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Recursos</div>
          {NAV_RECURSOS.map(renderItem)}
        </div>
      </nav>

      {/* Bottom */}
      <div className="px-2.5 pb-3.5 pt-1">
        <button onClick={() => signOut({ redirectUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/60 group transition-colors">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover"/>
              : <span className="text-[10px] font-bold text-[#64748B]">{initials(user?.fullName)}</span>
            }
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[12px] font-semibold text-[#374151] truncate group-hover:text-red-500 transition-colors">Cerrar sesión</div>
            <div className="text-[10px] text-[#94A3B8] truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </button>
      </div>
    </aside>
  )
}

interface IconProps { color: string }
function IconDashboard({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg> }
function IconDomains({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22"/></svg> }
function IconMail({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg> }
function IconHosting({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.657 4.03 3 9 3s9-1.343 9-3V5" strokeLinecap="round"/><path d="M3 12c0 1.657 4.03 3 9 3s9-1.343 9-3" strokeLinecap="round"/></svg> }
function IconSupport({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IconBilling({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4M16 15h2" strokeLinecap="round"/></svg> }
function IconSettings({ color }: IconProps) { return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" strokeLinecap="round"/></svg> }
