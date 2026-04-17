import { auth, currentUser } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2025-01-27.acacia' })

async function getOrCreateCustomer(userId: string, db: any) {
  const { data: existing } = await db.from('customers').select('id, stripe_customer_id, email').eq('clerk_user_id', userId).single()
  if (existing) return existing
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? ''
  const name  = user?.fullName ?? ''

  // Create Stripe customer
  const stripeCustomer = await stripe.customers.create({ email, name })

  const { data: created } = await db.from('customers').insert({
    clerk_user_id:      userId,
    email,
    name,
    avatar_url:         user?.imageUrl ?? null,
    plan:               'free',
    stripe_customer_id: stripeCustomer.id,
  }).select('id, stripe_customer_id, email').single()

  return created
}

// POST /api/domains/purchase
// Step 1: { domainName, price } → creates PaymentIntent → returns clientSecret
// Step 2: { domainName, paymentIntentId, confirmed: true } → verifies payment → registers domain
export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await req.json()
  const { domainName, price, paymentIntentId, confirmed } = body

  if (!domainName) return NextResponse.json({ error: 'Dominio requerido' }, { status: 400 })

  const db = createSupabaseAdmin()
  const customer = await getOrCreateCustomer(userId, db)
  if (!customer) return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })

  // ── STEP 1: Create payment intent ──
  if (!confirmed) {
    if (!price) return NextResponse.json({ error: 'Precio requerido' }, { status: 400 })

    const amountCents = Math.round(price * 100)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   amountCents,
      currency: 'eur',
      customer: customer.stripe_customer_id ?? undefined,
      metadata: { domainName, userId },
      automatic_payment_methods: { enabled: true },
      description: `Dominio: ${domainName} (1 año)`,
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  }

  // ── STEP 2: Verify payment and register domain ──
  if (!paymentIntentId) return NextResponse.json({ error: 'Payment intent requerido' }, { status: 400 })

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId)
  if (intent.status !== 'succeeded') {
    return NextResponse.json({ error: 'El pago no se ha completado' }, { status: 400 })
  }

  // Register domain in Name.com
  const BASE_URL = process.env.NAMECOM_API_URL ?? 'https://api.name.com/v4'
  const encoded  = Buffer.from(`${process.env.NAMECOM_USERNAME}:${process.env.NAMECOM_TOKEN}`).toString('base64')

  const contact = {
    firstName: 'Admin', lastName: 'Aiden',
    email: 'admin@aiden.es', phone: '+34.600000000',
    address1: 'Calle Mayor 1', city: 'Madrid',
    state: 'MD', zip: '28001', country: 'ES',
  }

  const res = await fetch(`${BASE_URL}/domains`, {
    method: 'POST',
    headers: { Authorization: `Basic ${encoded}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      domain: { domainName }, years: 1,
      contacts: { registrant: contact, admin: contact, tech: contact, billing: contact },
    }),
  })

  const data = await res.json()
  if (!res.ok) return NextResponse.json({ error: data.message ?? 'Error al registrar dominio' }, { status: 400 })

  // Save to Supabase
  await db.from('domains').insert({
    customer_id: customer.id,
    domain:      domainName,
    registrar:   'namecom',
    status:      'active',
    expires_at:  data.domain?.expireDate ?? null,
    auto_renew:  true,
  })

  return NextResponse.json({ success: true, domain: data.domain })
}
