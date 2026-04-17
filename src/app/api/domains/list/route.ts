import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ domains: [] })
  const { data } = await db.from('domains').select('id, domain').eq('customer_id', customer.id).eq('status', 'active').order('domain')
  return NextResponse.json({ domains: data ?? [] })
}
