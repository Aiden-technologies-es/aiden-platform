import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase'

async function getCustomer(clerkId: string) {
  const db = createSupabaseAdmin()
  const { data } = await db.from('customers').select('*').eq('clerk_user_id', clerkId).single()
  return data
}

export default async function SettingsPage() {
  const user = await currentUser()
  if (!user) redirect('/login')
  const customer = await getCustomer(user.id)

  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Cuenta</p>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Configuración</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left — profile */}
        <div className="lg:col-span-2 space-y-4">

          {/* Profile card */}
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-[14px] font-bold text-[#0F172A]">Perfil</h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">Tu información personal</p>
            </div>
            <div className="p-5">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[#F1F5F9]">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#0F172A] flex items-center justify-center flex-shrink-0">
                  {user.imageUrl
                    ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover"/>
                    : <span className="text-xl font-bold text-white">{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  }
                </div>
                <div>
                  <div className="text-[15px] font-bold text-[#0F172A]">{user.fullName}</div>
                  <div className="text-[13px] text-[#64748B] mt-0.5">{user.primaryEmailAddress?.emailAddress}</div>
                  <div className="text-[11px] text-[#94A3B8] mt-1">La foto de perfil se gestiona desde tu cuenta de Clerk</div>
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-3">
                {[
                  { label: 'Nombre completo', value: user.fullName ?? '—' },
                  { label: 'Email', value: user.primaryEmailAddress?.emailAddress ?? '—' },
                  { label: 'ID de cliente', value: customer?.id ?? 'Sin registrar' },
                  { label: 'Miembro desde', value: new Date(user.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-[#F8FAFC] last:border-0">
                    <span className="text-[12px] text-[#64748B] font-medium">{row.label}</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan */}
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-[14px] font-bold text-[#0F172A]">Plan actual</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[16px] font-extrabold text-[#0F172A] uppercase tracking-wide">{customer?.plan ?? 'Free'}</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">Plan básico incluido</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[11px] font-bold border border-[#BBF7D0]">Activo</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Dominios', value: '∞' },
                  { label: 'Buzones', value: '∞' },
                  { label: 'Soporte', value: '24/7' },
                ].map(f => (
                  <div key={f.label} className="bg-[#F8FAFC] rounded-xl p-3 text-center border border-[#F1F5F9]">
                    <div className="text-[18px] font-bold text-[#0F172A]">{f.value}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">{f.label}</div>
                  </div>
                ))}
              </div>
              <a href="https://support.aiden.es" target="_blank" rel="noopener noreferrer">
                <button className="aiden-btn aiden-btn-primary w-full">Mejorar plan →</button>
              </a>
            </div>
          </div>

          {/* Danger zone */}
          <div className="aiden-card overflow-hidden border-red-100">
            <div className="px-5 py-4 border-b border-red-50">
              <h2 className="text-[14px] font-bold text-red-600">Zona de peligro</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[13px] font-semibold text-[#0F172A]">Cerrar sesión en todos los dispositivos</div>
                  <div className="text-[12px] text-[#64748B] mt-0.5">Se cerrará tu sesión en todos los navegadores y dispositivos</div>
                </div>
                <button className="aiden-btn aiden-btn-danger aiden-btn-sm flex-shrink-0">Cerrar todas las sesiones</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right — quick links */}
        <div className="space-y-4">
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F1F5F9]">
              <h2 className="text-[14px] font-bold text-[#0F172A]">Accesos rápidos</h2>
            </div>
            <div className="p-3 space-y-1">
              {[
                { label: 'Centro de ayuda', href: 'https://support.aiden.es', external: true, icon: '💬' },
                { label: 'Gestionar dominios', href: '/dominios', external: false, icon: '🌐' },
                { label: 'Correo electrónico', href: '/correo', external: false, icon: '📧' },
                { label: 'Facturación', href: '/suscripcion', external: false, icon: '💳' },
              ].map(item => (
                item.external
                  ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-[13px] font-medium text-[#374151] flex-1">{item.label}</span>
                        <svg className="w-3.5 h-3.5 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </a>
                  : <a key={item.label} href={item.href}>
                      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer">
                        <span className="text-base">{item.icon}</span>
                        <span className="text-[13px] font-medium text-[#374151] flex-1">{item.label}</span>
                        <svg className="w-3.5 h-3.5 text-[#CBD5E1]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                      </div>
                    </a>
              ))}
            </div>
          </div>

          {/* Account ID */}
          <div className="aiden-card p-5">
            <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">ID de usuario</div>
            <div className="font-mono text-[11px] text-[#374151] bg-[#F8FAFC] rounded-lg px-3 py-2 border border-[#F1F5F9] break-all">
              {user.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
