import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { purchaseDomain } from '@/lib/namecom'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { domainName } = await req.json()
  if (!domainName) return NextResponse.json({ error: 'Dominio requerido' }, { status: 400 })
  try {
    const result = await purchaseDomain(domainName)
    const db = createSupabaseAdmin()
    const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
    if (customer) {
      await db.from('domains').insert({ customer_id: customer.id, domain: domainName, registrar: 'namecom', status: 'active', expires_at: result.domain?.expireDate ?? null, auto_renew: true })
    }
    return NextResponse.json({ success: true })
  } catch (e: any) { return NextResponse.json({ error: e.message }, { status: 500 }) }
}
