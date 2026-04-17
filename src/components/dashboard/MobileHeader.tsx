'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',   emoji: '🏠' },
  { href: '/dominios',    label: 'Dominios',    emoji: '🌐' },
  { href: '/correo',      label: 'Correo',      emoji: '📧' },
  { href: '/hosting',     label: 'Hosting',     emoji: '🖥️' },
  { href: '/suscripcion', label: 'Suscripción', emoji: '💳' },
  { href: '/soporte',     label: 'Soporte',     emoji: '💬' },
]

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-[rgba(235,238,246,.84)] backdrop-blur-[40px] border-b border-white/85 shadow-[0_1px_0_rgba(255,255,255,.9)_inset]">
        {/* Avatar */}
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0"
        >
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
            : <span>{initials(user?.fullName)}</span>
          }
        </button>

        {/* Brand */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-brand/10 flex items-center justify-center">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" className="text-brand">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="currentColor" strokeWidth="1.8"/>
            </svg>
          </div>
          <span className="text-sm font-bold text-[#0A0A0F]">Aiden</span>
        </div>

        {/* Menu button */}
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 rounded-full bg-white/70 flex items-center justify-center shadow-[0_1px_6px_rgba(0,0,0,.1)]"
        >
          <div className="flex flex-col gap-1 w-4">
            <span className="block h-0.5 bg-[#0A0A0F] rounded-full"/>
            <span className="block h-0.5 bg-[#0A0A0F] rounded-full"/>
            <span className="block h-0.5 bg-[#0A0A0F] rounded-full"/>
          </div>
        </button>
      </header>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-up menu */}
      <div className={cn(
        'fixed left-0 right-0 bottom-0 z-50 bg-[rgba(242,244,248,.94)] backdrop-blur-[40px] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,.18)] transition-transform duration-300',
        menuOpen ? 'translate-y-0' : 'translate-y-full'
      )}>
        {/* Handle */}
        <div className="w-9 h-1 bg-black/15 rounded-full mx-auto mt-3 mb-1" />

        {/* User info */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/6">
          <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold overflow-hidden">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
              : <span>{initials(user?.fullName)}</span>
            }
          </div>
          <div>
            <div className="text-[15px] font-bold text-[#0A0A0F]">{user?.fullName}</div>
            <div className="text-xs text-[#7A7A8C] truncate max-w-[200px]">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="px-3 py-2">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-[13px] mb-0.5 transition-colors',
                  active ? 'bg-brand/6' : 'hover:bg-black/4'
                )}
              >
                <span className="w-10 h-10 rounded-xl bg-white/95 flex items-center justify-center text-lg shadow-[0_2px_8px_rgba(0,0,0,.1)] flex-shrink-0">
                  {item.emoji}
                </span>
                <span className={cn('text-[15px] font-medium', active ? 'text-brand font-semibold' : 'text-[#0A0A0F]')}>
                  {item.label}
                </span>
                <span className="ml-auto text-[#7A7A8C] text-lg">›</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="px-5 py-3 border-t border-black/6 mb-safe">
          <button
            onClick={() => signOut({ redirectUrl: '/login' })}
            className="flex items-center gap-2 text-red-500 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden flex items-stretch h-[62px] bg-[rgba(235,237,245,.82)] backdrop-blur-[40px] border-t border-white/88 shadow-[0_-4px_24px_rgba(0,0,0,.07)]">
        {NAV_ITEMS.slice(0, 5).map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 pt-1"
            >
              <span className={cn('text-lg transition-transform', active && '-translate-y-0.5 scale-110')}>{item.emoji}</span>
              <span className={cn('text-[10px] font-semibold', active ? 'text-brand' : 'text-[#9A9AB0]')}>
                {item.label.split(' ')[0]}
              </span>
              {active && <span className="absolute bottom-0 w-4 h-0.5 bg-brand rounded-t-full"/>}
            </Link>
          )
        })}
      </nav>

      {/* Safe area padding for bottom tab */}
      <div className="lg:hidden h-[62px]" />
    </>
  )
}
