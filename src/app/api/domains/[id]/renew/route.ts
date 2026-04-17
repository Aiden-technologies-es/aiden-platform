import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { renewDomain } from '@/lib/namecom'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  const { data: domain } = await db.from('domains').select('*').eq('id', id).eq('customer_id', customer?.id ?? '').single()
  if (!domain) return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 })
  try {
    const result = await renewDomain(domain.domain, 1)
    // Update expiry in DB
    if (result) {
      await db.from('domains').update({ updated_at: new Date().toISOString() }).eq('id', id)
    }
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
