import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import { getDnsRecords, createDnsRecord } from '@/lib/namecom'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  const { data: domain } = await db.from('domains').select('domain').eq('id', id).eq('customer_id', customer?.id ?? '').single()
  if (!domain) return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 })
  try {
    const data = await getDnsRecords(domain.domain)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  const { data: domain } = await db.from('domains').select('domain').eq('id', id).eq('customer_id', customer?.id ?? '').single()
  if (!domain) return NextResponse.json({ error: 'Dominio no encontrado' }, { status: 404 })
  try {
    const data = await createDnsRecord(domain.domain, body)
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
