'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { cn, initials } from '@/lib/utils'

const NAV = [
  {
    group: 'Principal',
    items: [
      { href: '/dashboard',   label: 'Inicio',      icon: IconHome },
      { href: '/dominios',    label: 'Dominios',    icon: IconDomains },
      { href: '/correo',      label: 'Correo',      icon: IconMail },
      { href: '/hosting',     label: 'Hosting',     icon: IconHosting },
    ],
  },
  {
    group: 'Cuenta',
    items: [
      { href: '/suscripcion', label: 'Facturación', icon: IconBilling },
      { href: '/soporte',     label: 'Soporte',     icon: IconSupport },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user } = useUser()
  const { signOut, openUserProfile } = useClerk()

  return (
    <aside className="w-[220px] flex flex-col h-screen bg-[#0A0A0A] text-white">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-white/8">
        <div className="mb-4 h-7 flex items-center">
          <img
            src="/aiden-logo.png"
            alt="Aiden"
            className="h-6 w-auto object-contain object-left brightness-0 invert"
            onError={e => {
              e.currentTarget.style.display='none'
              const p=e.currentTarget.parentElement
              if(p&&!p.querySelector('.lf')){
                const d=document.createElement('div')
                d.className='lf flex items-center gap-2'
                d.innerHTML='<span style="font-size:16px;font-weight:700;color:white;letter-spacing:-0.5px">aiden</span>'
                p.appendChild(d)
              }
            }}
          />
        </div>

        {/* User */}
        <button
          onClick={() => openUserProfile()}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-white/8 transition-colors group text-left"
        >
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 overflow-hidden">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
              : <span>{initials(user?.fullName)}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-medium text-white/90 truncate">{user?.fullName ?? 'Usuario'}</div>
            <div className="text-[10px] text-white/40 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
          </div>
          <svg className="w-3 h-3 text-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {NAV.map(section => (
          <div key={section.group} className="mb-5">
            <div className="px-2.5 mb-1.5 text-[10px] font-semibold text-white/30 uppercase tracking-widest">
              {section.group}
            </div>
            {section.items.map(item => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium mb-0.5 transition-colors duration-100',
                    active
                      ? 'bg-white/12 text-white'
                      : 'text-white/50 hover:bg-white/6 hover:text-white/80'
                  )}
                >
                  <Icon active={active} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8">
        <button
          onClick={() => signOut({ redirectUrl: '/login' })}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-white/40 hover:bg-white/6 hover:text-white/70 transition-colors"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}

interface IconProps { active?: boolean }
const c = (a?: boolean) => a ? 'white' : 'rgba(255,255,255,0.45)'
function IconHome({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IconDomains({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="M12 2C8 6 8 18 12 22M12 2c4 4 4 16 0 20M2 12h20" strokeLinecap="round"/></svg>
}
function IconMail({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round"/></svg>
}
function IconHosting({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>
}
function IconBilling({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4M16 15h2" strokeLinecap="round"/></svg>
}
function IconSupport({ active }: IconProps) {
  return <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={c(active)} strokeWidth="1.8"><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
