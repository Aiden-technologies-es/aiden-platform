import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { domainName } = await req.json()
  if (!domainName) return NextResponse.json({ error: 'Dominio requerido' }, { status: 400 })

  const BASE_URL = process.env.NAMECOM_API_URL ?? 'https://api.name.com/v4'
  const USERNAME = process.env.NAMECOM_USERNAME ?? ''
  const TOKEN    = process.env.NAMECOM_TOKEN ?? ''
  const encoded  = Buffer.from(`${USERNAME}:${TOKEN}`).toString('base64')

  const contact = {
    firstName: 'Admin',
    lastName:  'Aiden',
    email:     'admin@aiden.es',
    phone:     '+34.600000000',
    address1:  'Calle Mayor 1',
    city:      'Madrid',
    state:     'MD',
    zip:       '28001',
    country:   'ES',
  }

  const body = {
    domain: { domainName },
    years: 1,
    contacts: {
      registrant: contact,
      admin:      contact,
      tech:       contact,
      billing:    contact,
    },
  }

  const res = await fetch(`${BASE_URL}/domains`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await res.json()

  // Return full response for debugging
  if (!res.ok) {
    return NextResponse.json({ 
      error: data.message ?? 'Error',
      details: data,
      sentBody: body,
    }, { status: 400 })
  }

  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  if (customer) {
    await db.from('domains').insert({
      customer_id: customer.id,
      domain: domainName,
      registrar: 'namecom',
      status: 'active',
      expires_at: data.domain?.expireDate ?? null,
      auto_renew: true,
    })
  }

  return NextResponse.json({ success: true })
}
