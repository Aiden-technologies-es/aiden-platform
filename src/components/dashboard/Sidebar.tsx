'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'
import { useState } from 'react'

const NAV_TOP = [
  { href: '/dashboard',   label: 'Inicio',       icon: IconHome },
  { href: '/dominios',    label: 'Dominios',     icon: IconDomains },
  { href: '/correo',      label: 'Correo',       icon: IconMail },
  { href: '/hosting',     label: 'Hosting',      icon: IconHosting },
  { href: '/soporte',     label: 'Soporte',      icon: IconSupport },
]

const NAV_BOTTOM = [
  { href: '/suscripcion', label: 'Facturación',  icon: IconBilling },
  { href: '/settings',    label: 'Configuración',icon: IconSettings, arrow: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [search, setSearch] = useState('')

  return (
    <aside className="w-[240px] flex flex-col h-screen bg-[#0A0A0A] border-r border-white/[0.06]">

      {/* Account switcher */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
            : <span className="text-[9px] font-bold text-white">{initials(user?.fullName)}</span>
          }
        </div>
        <span className="text-[13px] font-medium text-white/90 flex-1 truncate">{user?.fullName ?? 'Usuario'}</span>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-white/10 bg-white/5">
          <span className="text-[10px] text-white/50 font-medium">Free</span>
        </div>
        <svg className="w-3.5 h-3.5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <path d="M7 10l5-5 5 5M7 14l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Search */}
      <div className="px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08]">
          <svg className="w-3.5 h-3.5 text-white/30 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 bg-transparent text-[13px] text-white/60 placeholder-white/25 outline-none min-w-0"
          />
          <div className="flex items-center justify-center w-5 h-5 rounded border border-white/10 bg-white/5 flex-shrink-0">
            <span className="text-[10px] text-white/30 font-medium">F</span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
        {NAV_TOP.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-100',
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
              )}>
                <Icon active={active} />
                <span>{item.label}</span>
              </div>
            </Link>
          )
        })}

        <div className="my-2 border-t border-white/[0.06]" />

        {NAV_BOTTOM.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}>
              <div className={cn(
                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors duration-100',
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-white/50 hover:bg-white/[0.06] hover:text-white/80'
              )}>
                <Icon active={active} />
                <span className="flex-1">{item.label}</span>
                {(item as any).arrow && (
                  <svg className="w-3 h-3 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Bottom team */}
      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={() => signOut({ redirectUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/[0.06] transition-colors group"
        >
          <div className="w-5 h-5 rounded-full bg-[#13967e] flex items-center justify-center flex-shrink-0 overflow-hidden relative">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              : <span className="text-[9px] font-bold text-white">{initials(user?.fullName)}</span>
            }
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-400 border border-[#0A0A0A]"/>
          </div>
          <span className="text-[13px] font-medium text-white/60 flex-1 text-left truncate group-hover:text-white/80 transition-colors">
            Aiden Technologies
          </span>
          <svg className="w-3.5 h-3.5 text-white/20 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </aside>
  )
}

interface IconProps { active?: boolean }
const ic = (a?: boolean) => a ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.4)'

function IconHome({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconDomains({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg>
}
function IconMail({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg>
}
function IconHosting({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>
}
function IconSupport({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconBilling({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4M16 15h2" strokeLinecap="round"/></svg>
}
function IconSettings({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={ic(active)} strokeWidth="1.7"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3"/></svg>
}
