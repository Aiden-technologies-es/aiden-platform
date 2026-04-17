import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { deleteDnsRecord } from '@/lib/namecom'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; recordId: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id, recordId } = await params
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  const { data: domain } = await db.from('domains').select('domain').eq('id', id).eq('customer_id', customer?.id ?? '').single()
  if (!domain) return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 })
  try {
    await deleteDnsRecord(domain.domain, parseInt(recordId))
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
