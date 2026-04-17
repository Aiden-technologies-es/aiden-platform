import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase'
import { Button, Card, CardHeader, CardTitle, CardBody, EmptyState } from '@/components/ui'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getMailboxes(clerkUserId: string) {
  const db = createSupabaseAdmin()
  const { data: c } = await db.from('customers').select('id').eq('clerk_user_id', clerkUserId).single()
  if (!c) return []
  const { data } = await db.from('mailboxes').select('*, domains(domain)').eq('customer_id', c.id)
  return data ?? []
}

export default async function CorreoPage() {
  const user = await currentUser()
  if (!user) redirect('/login')
  const mailboxes = await getMailboxes(user.id)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Servicios</p>
          <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Correo electrónico</h1>
        </div>
        <Link href="/correo/nuevo"><Button variant="brand">+ Crear buzón</Button></Link>
      </div>
      <Card>
        <CardHeader><CardTitle>Buzones de correo</CardTitle></CardHeader>
        <CardBody className="pt-0">
          {mailboxes.length === 0 ? (
            <EmptyState icon="📧" title="Sin buzones" description="Crea tu primer buzón de correo profesional asociado a tu dominio." action={<Link href="/correo/nuevo"><Button variant="brand" size="sm">Crear buzón</Button></Link>}/>
          ) : (
            <div className="divide-y divide-black/5">
              {mailboxes.map((m: any) => (
                <div key={m.id} className="flex items-center gap-3 py-3.5 first:pt-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-xl">📧</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#0A0A0F]">{m.address}</div>
                    <div className="text-xs text-[#7A7A8C]">{m.quota_mb ? `${m.quota_mb} MB` : '5 GB'} · {m.status}</div>
                  </div>
                  <div className="flex gap-2">
                    {m.titan_account_id && (
                      <form action="/api/email/webmail" method="POST">
                        <input type="hidden" name="accountId" value={m.titan_account_id}/>
                        <Button variant="brand" size="sm" type="submit">Abrir webmail</Button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
