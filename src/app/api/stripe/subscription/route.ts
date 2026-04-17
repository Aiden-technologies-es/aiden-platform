import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('*').eq('clerk_user_id', userId).single()
  if (!customer) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
  let stripeCustomerId = customer.stripe_customer_id
  if (!stripeCustomerId) {
    const customers = await stripe.customers.list({ email: customer.email, limit: 5 })
    if (customers.data.length > 0) {
      stripeCustomerId = customers.data[0].id
      await db.from('customers').update({ stripe_customer_id: stripeCustomerId }).eq('id', customer.id)
    } else {
      return NextResponse.json({ error: `No se encontró cliente en Stripe con email: ${customer.email}` }, { status: 404 })
    }
  }
  const [subs, pms, cust, invs] = await Promise.all([
    stripe.subscriptions.list({ customer: stripeCustomerId, limit: 10 }),
    stripe.paymentMethods.list({ customer: stripeCustomerId, type: 'card', limit: 10 }),
    stripe.customers.retrieve(stripeCustomerId) as Promise<any>,
    stripe.invoices.list({ customer: stripeCustomerId, limit: 10 }),
  ])
  return NextResponse.json({ customer_id: stripeCustomerId, subscriptions: subs.data, payment_methods: pms.data, default_pm: cust.invoice_settings?.default_payment_method, invoices: invs.data })
}
