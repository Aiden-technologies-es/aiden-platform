import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig  = req.headers.get('stripe-signature')!
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }

  const db = createSupabaseAdmin()

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const sub = event.data.object
    const { data: customer } = await db.from('customers').select('id').eq('stripe_customer_id', sub.customer).single()
    if (customer) {
      await db.from('subscriptions').upsert({
        customer_id: customer.id,
        stripe_sub_id: sub.id,
        stripe_price_id: sub.items.data[0]?.price?.id,
        plan_name: sub.items.data[0]?.price?.nickname,
        status: sub.status,
        current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        cancel_at_period_end: sub.cancel_at_period_end,
      }, { onConflict: 'stripe_sub_id' })
    }
  }

  if (event.type === 'customer.created') {
    const cust = event.data.object
    const clerkId = cust.metadata?.clerk_user_id
    if (clerkId) {
      await db.from('customers').upsert({
        clerk_user_id: clerkId,
        stripe_customer_id: cust.id,
        email: cust.email,
        name: cust.name,
      }, { onConflict: 'clerk_user_id' })
    }
  }

  return NextResponse.json({ received: true })
}
