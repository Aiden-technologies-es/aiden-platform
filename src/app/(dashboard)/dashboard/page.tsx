import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdmin } from '@/lib/supabase'
import { formatDate, statusColor, statusLabel, daysUntil } from '@/lib/utils'
import Link from 'next/link'
import { DashboardClient } from './client'

export const dynamic = 'force-dynamic'

const STEP_MAP: Record<string,number> = {
  open:1, in_progress:2, waiting_admin:2, waiting_client:3, resolved:4, closed:4
}

async function getData(clerkUserId: string) {
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('*').eq('clerk_user_id', clerkUserId).single()
  if (!customer) return null
  const [d, m, t] = await Promise.all([
    db.from('domains').select('*').eq('customer_id', customer.id).order('created_at',{ascending:false}),
    db.from('mailboxes').select('*').eq('customer_id', customer.id),
    db.from('tickets').select('*').eq('customer_id', customer.id).order('updated_at',{ascending:false}).limit(5),
  ])
  return { customer, domains: d.data??[], mailboxes: m.data??[], tickets: t.data??[] }
}

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/login')
  const data = await getData(user.id)
  const openTickets = data?.tickets.filter(t => ['open','in_progress','waiting_admin','waiting_client'].includes(t.status)).length ?? 0
  const expiringDomains = data?.domains.filter(d => { const days = daysUntil(d.expires_at); return days !== null && days <= 30 }) ?? []

  return (
    <DashboardClient
      firstName={user.firstName ?? 'Usuario'}
      data={data}
      openTickets={openTickets}
      expiringDomains={expiringDomains}
      stepMap={STEP_MAP}
    />
  )
}
