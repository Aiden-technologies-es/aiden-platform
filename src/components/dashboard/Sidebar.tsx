'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'

const NAV_PRINCIPAL = [
  { href: '/dashboard',   label: 'Dashboard',    color: '#6366F1', bg: '#EEF2FF', icon: IconDashboard },
  { href: '/dominios',    label: 'Dominios',     color: '#0EA5E9', bg: '#E0F2FE', icon: IconDomains },
  { href: '/correo',      label: 'Correo',       color: '#F59E0B', bg: '#FEF3C7', icon: IconMail },
  { href: '/hosting',     label: 'Hosting',      color: '#10B981', bg: '#D1FAE5', icon: IconHosting },
  { href: '/soporte',     label: 'Soporte',      color: '#EF4444', bg: '#FEE2E2', icon: IconSupport, badge: 0 },
]

const NAV_RECURSOS = [
  { href: '/suscripcion', label: 'Facturación',  color: '#8B5CF6', bg: '#EDE9FE', icon: IconBilling },
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
          'flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] font-medium transition-all duration-100 mb-0.5',
          active ? 'bg-[#F0F4FF] text-[#111]' : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#111]'
        )}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: item.bg }}>
            <Icon color={item.color} />
          </div>
          <span className="flex-1">{item.label}</span>
          {item.badge > 0 && (
            <span className="min-w-5 h-5 px-1.5 rounded-full bg-[#EF4444] text-white text-[10px] font-bold flex items-center justify-center">
              {item.badge}
            </span>
          )}
          {item.label === 'Soporte' && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0]">NEW</span>
          )}
        </div>
      </Link>
    )
  }

  return (
    <aside className="w-[220px] flex flex-col h-screen bg-white border-r border-[#E8EAED]">
      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-[#F1F5F9]">
        <div className="flex items-center justify-between mb-3">
          <img
            src="/aiden-logo.png"
            alt="Aiden"
            className="h-7 w-auto object-contain object-left"
            onError={e => {
              e.currentTarget.style.display = 'none'
              const p = e.currentTarget.parentElement
              if (p && !p.querySelector('.lf')) {
                const d = document.createElement('span')
                d.className = 'lf text-xl font-black text-[#111] tracking-tight'
                d.textContent = 'aiden'
                p.prepend(d)
              }
            }}
          />
          <button className="w-7 h-7 rounded-lg hover:bg-[#F1F5F9] flex items-center justify-center transition-colors">
            <svg className="w-4 h-4 text-[#94A3B8]" fill="none" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Company selector */}
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-[#E8EAED] hover:border-[#CBD5E1] bg-[#F8FAFC] hover:bg-white transition-all group text-left">
          <div className="w-8 h-8 rounded-xl bg-[#0F172A] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0">
            {initials(user?.fullName ?? 'A')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-[#111] truncate uppercase tracking-wide leading-none mb-0.5">
              {user?.fullName?.toUpperCase() ?? 'AIDEN USER'}
            </div>
            <div className="text-[10px] text-[#94A3B8]">Plan Free</div>
          </div>
          <svg className="w-3.5 h-3.5 text-[#CBD5E1] flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        <div className="mb-4">
          <div className="px-2 mb-2 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Principal</div>
          {NAV_PRINCIPAL.map(renderItem)}
        </div>
        <div>
          <div className="px-2 mb-2 text-[10px] font-semibold text-[#94A3B8] uppercase tracking-widest">Recursos</div>
          {NAV_RECURSOS.map(renderItem)}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#F1F5F9]">
        <button
          onClick={() => signOut({ redirectUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl hover:bg-[#FEF2F2] group transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-[#F1F5F9] flex items-center justify-center flex-shrink-0 overflow-hidden">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-[11px] font-bold text-[#64748B]">{initials(user?.fullName)}</span>
            }
          </div>
          <div className="flex-1 min-w-0 text-left">
            <div className="text-[12px] font-semibold text-[#374151] truncate group-hover:text-red-600 transition-colors">Cerrar sesión</div>
            <div className="text-[10px] text-[#94A3B8] truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
          <svg className="w-4 h-4 text-[#CBD5E1] group-hover:text-red-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}

interface IconProps { color: string }
function IconDashboard({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
}
function IconDomains({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg>
}
function IconMail({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg>
}
function IconHosting({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>
}
function IconSupport({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round"/></svg>
}
function IconBilling({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4M16 15h2" strokeLinecap="round"/></svg>
}
function IconSettings({ color }: IconProps) {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth="2"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round"/><circle cx="12" cy="12" r="3"/></svg>
}
