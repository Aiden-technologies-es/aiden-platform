import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const event = await req.json()
  const db = createSupabaseAdmin()

  if (event.type === 'user.created' || event.type === 'user.updated') {
    const u = event.data
    await db.from('customers').upsert({
      clerk_user_id: u.id,
      email: u.email_addresses?.[0]?.email_address ?? '',
      name: [u.first_name, u.last_name].filter(Boolean).join(' ') || null,
      avatar_url: u.image_url ?? null,
    }, { onConflict: 'clerk_user_id' })
  }

  return NextResponse.json({ received: true })
}
