import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { subject, message, category = 'general', priority = 'normal' } = await req.json()
  if (!subject?.trim() || !message?.trim()) return NextResponse.json({ error: 'Asunto y mensaje requeridos' }, { status: 400 })

  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })

  const { data: ticket, error } = await db.from('tickets').insert({
    customer_id: customer.id,
    ticket_num: 'TK0000', // will be replaced by trigger
    subject: subject.trim(),
    message: message.trim(),
    category,
    priority,
    status: 'open',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ticket })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ tickets: [] })
  const { data } = await db.from('tickets').select('*').eq('customer_id', customer.id).order('updated_at', { ascending: false })
  return NextResponse.json({ tickets: data ?? [] })
}
