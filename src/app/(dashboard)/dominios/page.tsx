import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase'
import { formatDate, daysUntil, Badge, statusColor } from '@/lib/utils'
import { Button, Card, CardHeader, CardTitle, CardBody, EmptyState, StatCard } from '@/components/ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getDomains(clerkUserId: string) {
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', clerkUserId).single()
  if (!customer) return []
  const { data } = await db.from('domains').select('*').eq('customer_id', customer.id).order('created_at',{ascending:false})
  return data ?? []
}

export default async function DominiosPage() {
  const user = await currentUser()
  if (!user) redirect('/login')
  const domains = await getDomains(user.id)
  const active = domains.filter(d=>d.status==='active').length
  const expiring = domains.filter(d=>{const days=daysUntil(d.expires_at);return days!==null&&days<=30}).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Gestión</p>
          <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Dominios</h1>
        </div>
        <Link href="/dominios/nuevo">
          <Button variant="brand" size="md">+ Registrar dominio</Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <StatCard value={domains.length} label="Total dominios" icon="🌐" color="#0071E3"/>
        <StatCard value={active} label="Activos" icon="✅" color="#13967e"/>
        <StatCard value={expiring} label="Por vencer" icon="⚠️" color="#FF3B30" alert={expiring>0}/>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tus dominios</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          {domains.length === 0 ? (
            <EmptyState
              icon="🌐"
              title="Sin dominios registrados"
              description="Registra tu primer dominio y empieza a construir tu presencia online."
              action={<Link href="/dominios/nuevo"><Button variant="brand" size="sm">Registrar dominio</Button></Link>}
            />
          ) : (
            <div className="divide-y divide-black/5">
              {domains.map(domain => {
                const days = daysUntil(domain.expires_at)
                const color = days !== null && days <= 30 ? '#FF3B30' : days !== null && days <= 90 ? '#FF9500' : '#34C759'
                return (
                  <Link key={domain.id} href={`/dominios/${domain.id}`}>
                    <div className="flex items-center gap-3 py-3.5 hover:bg-black/2 rounded-lg px-2 -mx-2 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">🌐</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[#0A0A0F]">{domain.domain}</div>
                        <div className="text-xs text-[#7A7A8C] mt-0.5">
                          {domain.expires_at ? <>Vence {formatDate(domain.expires_at)}{days !== null ? <span className={days<=30?' text-red-500 font-medium':''}>  ({days}d)</span> : null}</> : 'Sin fecha'}
                          {domain.auto_renew && ' · Auto-renovación ✓'}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{background:color+'20',color}}>
                          {domain.status==='active'?'Activo':domain.status}
                        </span>
                        <svg className="w-4 h-4 text-[#AEAEB2]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
