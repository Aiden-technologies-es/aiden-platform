import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { message } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  const { data: ticket } = await db.from('tickets').select('id, status').eq('id', params.id).eq('customer_id', customer.id).single()
  if (!ticket) return NextResponse.json({ error: 'Ticket no encontrado' }, { status: 404 })
  if (ticket.status === 'closed') return NextResponse.json({ error: 'Ticket cerrado' }, { status: 400 })
  await db.from('ticket_replies').insert({ ticket_id: params.id, author_clerk_id: userId, is_admin: false, message: message.trim() })
  await db.from('tickets').update({ status: 'waiting_admin', updated_at: new Date().toISOString() }).eq('id', params.id)
  return NextResponse.json({ success: true })
}
