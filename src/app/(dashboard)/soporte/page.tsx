import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase'
import { formatDate, statusColor, statusLabel } from '@/lib/utils'
import { Badge, Button, Card, CardHeader, CardTitle, CardBody, EmptyState } from '@/components/ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getTickets(clerkUserId: string) {
  const db = createSupabaseAdmin()
  const { data: c } = await db.from('customers').select('id').eq('clerk_user_id', clerkUserId).single()
  if (!c) return []
  const { data } = await db.from('tickets').select('*').eq('customer_id', c.id).order('updated_at',{ascending:false})
  return data ?? []
}

export default async function SoportePage() {
  const user = await currentUser()
  if (!user) redirect('/login')
  const tickets = await getTickets(user.id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Ayuda</p>
          <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Soporte</h1>
        </div>
        <Link href="/soporte/nuevo"><Button variant="brand">+ Nueva consulta</Button></Link>
      </div>
      <Card>
        <CardHeader><CardTitle>Mis consultas</CardTitle></CardHeader>
        <CardBody className="pt-0">
          {tickets.length === 0 ? (
            <EmptyState icon="💬" title="Sin consultas" description="¿Tienes alguna pregunta? Crea una consulta y te respondemos en menos de 24h." action={<Link href="/soporte/nuevo"><Button variant="brand" size="sm">+ Nueva consulta</Button></Link>}/>
          ) : (
            <div className="divide-y divide-black/5">
              {tickets.map(t => (
                <Link key={t.id} href={`/soporte/${t.id}`}>
                  <div className="flex items-center gap-3 py-3.5 hover:bg-black/2 rounded-lg px-2 -mx-2 cursor-pointer transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{background:statusColor(t.status)+'18'}}>💬</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0A0A0F] truncate">{t.subject}</div>
                      <div className="text-xs text-[#7A7A8C] mt-0.5">{t.ticket_num} · {formatDate(t.updated_at)}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge label={statusLabel(t.status)} color={statusColor(t.status)}/>
                      <svg className="w-4 h-4 text-[#AEAEB2]" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
