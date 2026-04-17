import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { getWebmailToken } from '@/lib/titan'
import { createSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { accountId } = await req.json()
  if (!accountId) return NextResponse.json({ error: 'ID de cuenta requerido' }, { status: 400 })
  const db = createSupabaseAdmin()
  const { data: customer } = await db.from('customers').select('id').eq('clerk_user_id', userId).single()
  const { data: mailbox } = await db.from('mailboxes').select('titan_account_id').eq('titan_account_id', accountId).eq('customer_id', customer?.id ?? '').single()
  if (!mailbox) return NextResponse.json({ error: 'Buzón no encontrado' }, { status: 404 })
  try {
    const url = await getWebmailToken(accountId)
    return NextResponse.redirect(url)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
