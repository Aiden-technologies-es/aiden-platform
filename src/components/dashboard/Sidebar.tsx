'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'

const NAV = [
  {
    group: 'Principal',
    items: [
      { href: '/dashboard',   label: 'Dashboard',   icon: '🏠' },
      { href: '/dominios',    label: 'Dominios',    icon: '🌐' },
      { href: '/correo',      label: 'Correo',      icon: '📧' },
      { href: '/hosting',     label: 'Hosting',     icon: '🖥️' },
    ],
  },
  {
    group: 'Cuenta',
    items: [
      { href: '/suscripcion', label: 'Suscripción', icon: '💳' },
      { href: '/soporte',     label: 'Soporte',     icon: '💬' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <aside className="w-[220px] sidebar flex flex-col h-screen">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-7 h-7 rounded-lg brand-gradient flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" stroke="white" strokeWidth="1.8"/>
              <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" stroke="white" strokeWidth="1.8"/>
            </svg>
          </div>
          <span className="text-[15px] font-bold text-[#0A0A0F] tracking-tight">Aiden</span>
        </div>

        {/* User pill */}
        <button
          onClick={() => openUserProfile()}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-black/5 transition-colors group text-left"
        >
          <div className="w-8 h-8 rounded-full brand-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              : <span>{initials(user?.fullName)}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-[#0A0A0F] truncate">{user?.fullName ?? 'Usuario'}</div>
            <div className="text-[10px] text-[#7A7A8C] truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
          <svg className="w-3 h-3 text-[#AEAEB2] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {NAV.map(section => (
          <div key={section.group} className="mb-4">
            <div className="px-2 mb-1.5 text-[9.5px] font-bold text-[#AEAEB2] uppercase tracking-widest">
              {section.group}
            </div>
            {section.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] font-medium mb-0.5 transition-all duration-100',
                    active
                      ? 'bg-white shadow-sm text-[#0A0A0F] font-semibold'
                      : 'text-[#4A4A5A] hover:bg-black/4 hover:text-[#0A0A0F]'
                  )}
                >
                  <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#13967e]" />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-black/5">
        <button
          onClick={() => signOut({ redirectUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
