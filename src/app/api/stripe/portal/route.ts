import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createBillingPortalSession } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('stripe_customer_id').eq('clerk_user_id', userId).single()
  if (!customer?.stripe_customer_id) return NextResponse.json({ error: 'Sin cuenta de facturación' }, { status: 404 })
  const url = await createBillingPortalSession(customer.stripe_customer_id, `${process.env.NEXT_PUBLIC_APP_URL}/suscripcion`)
  return NextResponse.json({ url })
}
