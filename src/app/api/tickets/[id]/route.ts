import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  const { data: ticket } = await db.from('tickets').select('*').eq('id', id).eq('customer_id', customer.id).single()
  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
  const { data: replies } = await db.from('ticket_replies').select('*').eq('ticket_id', id).order('created_at', { ascending: true })
  return NextResponse.json({ ticket, replies: replies ?? [] })
}
