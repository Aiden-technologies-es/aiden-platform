import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createMailbox } from '@/lib/titan'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { username, domainId, firstName, lastName, password, quotaMB } = await req.json()
  if (!username?.trim() || !domainId || !password) return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })

  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  const { data: domain } = await db.from('domains').select('domain').eq('id', domainId).eq('customer_id', customer.id).single()
  if (!domain) return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 })

  const address = `${username.trim().toLowerCase()}@${domain.domain}`

  try {
    const result = await createMailbox({ email: address, password, firstName, lastName, quotaMB: parseInt(quotaMB ?? '5000') })
    await db.from('mailboxes').insert({
      customer_id: customer.id,
      domain_id: domainId,
      address,
      quota_mb: parseInt(quotaMB ?? '5000'),
      status: 'active',
      titan_account_id: result.accountId,
    })
    return NextResponse.json({ success: true, address })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
