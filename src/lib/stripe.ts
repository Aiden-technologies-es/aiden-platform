import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
  typescript: true,
})

export async function getOrCreateStripeCustomer(
  email: string,
  name?: string,
  clerkUserId?: string
): Promise<string> {
  // Search existing
  const existing = await stripe.customers.list({ email, limit: 1 })
  if (existing.data.length > 0) return existing.data[0].id

  // Create new
  const customer = await stripe.customers.create({
    email,
    name: name ?? undefined,
    metadata: { clerk_user_id: clerkUserId ?? '' },
  })
  return customer.id
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string
): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
  return session.url
}

export function formatStripeAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
