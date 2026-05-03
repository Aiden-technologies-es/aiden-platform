'use client'
import { useUser } from '@clerk/nextjs'
import { initials } from '@/lib/utils'
import { useState } from 'react'
import Link from 'next/link'

export function TopBar() {
  const { user } = useUser()
  const [search, setSearch] = useState('')

  return (
    <header className="h-14 bg-[#E8EBF4] border-b border-[#D4D8E8] flex items-center px-5 gap-3 flex-shrink-0">
      {/* Search — pill shape */}
      <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/70 border border-white/80 w-56">
        <svg className="w-3.5 h-3.5 text-[#94A3B8] flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 bg-transparent text-[13px] text-[#374151] placeholder-[#94A3B8] outline-none"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Crear — green pill */}
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#16A34A] text-white text-[13px] font-semibold hover:bg-[#15803D] transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Crear
        </button>

        {/* Ayuda — pill */}
        <a
          href="https://support.aiden.es"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#E2E8F0] text-[#374151] text-[13px] font-semibold hover:bg-[#F8FAFC] transition-colors shadow-sm"
        >
          <svg className="w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Ayuda
        </a>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors shadow-sm">
          <svg className="w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Badge */}
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#E8EBF4]">2</span>
        </button>

        {/* Avatar */}
        <Link href="/settings">
          <button className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm hover:shadow-md transition-shadow">
            {user?.imageUrl
              ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover"/>
              : <div className="w-full h-full bg-[#0F172A] flex items-center justify-center text-white text-[12px] font-bold">{initials(user?.fullName)}</div>
            }
          </button>
        </Link>
      </div>
    </header>
  )
}
