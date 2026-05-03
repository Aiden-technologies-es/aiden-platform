'use client'
import { useUser } from '@clerk/nextjs'
import { initials } from '@/lib/utils'
import { useState } from 'react'

export function TopBar() {
  const { user } = useUser()
  const [search, setSearch] = useState('')

  return (
    <header className="h-14 bg-white border-b border-[#E8EAED] flex items-center px-6 gap-4 flex-shrink-0">
      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex-1 max-w-xs">
        <svg className="w-4 h-4 text-[#94A3B8] flex-shrink-0" fill="none" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8"/>
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="flex-1 bg-transparent text-[13px] text-[#111] placeholder-[#94A3B8] outline-none"
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Create button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111] text-white text-[13px] font-medium hover:bg-black transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Crear
        </button>

        {/* Help */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          Ayuda
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-center hover:bg-[#F8FAFC] transition-colors">
          <svg className="w-4 h-4 text-[#64748B]" fill="none" viewBox="0 0 24 24">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Avatar */}
        <button className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center text-white text-[12px] font-bold overflow-hidden border-2 border-[#E2E8F0]">
          {user?.imageUrl
            ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
            : <span>{initials(user?.fullName)}</span>
          }
        </button>
      </div>
    </header>
  )
}
