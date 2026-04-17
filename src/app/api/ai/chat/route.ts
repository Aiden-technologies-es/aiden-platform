import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  const { message, history = [], context = '' } = await req.json()
  if (!message?.trim()) return NextResponse.json({ error: 'Mensaje requerido' }, { status: 400 })

  const system = `Eres Lunnar, el asistente inteligente de Aiden, una plataforma digital que ofrece dominios, correo electrónico profesional y páginas web. Ayudas a los clientes con sus servicios y consultas de soporte. NUNCA menciones Claude ni Anthropic. Responde SIEMPRE en español. Sé conciso y amigable.${context ? '\n\nCONTEXTO:\n' + context : ''}`

  const messages: { role: 'user' | 'assistant'; content: string }[] = [
    ...history.slice(-8).filter((h: any) => h.role === 'user' || h.role === 'assistant'),
  ]
  if (!messages.length || messages[messages.length - 1].content !== message) {
    messages.push({ role: 'user', content: message })
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      system,
      messages,
    })
    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return NextResponse.json({ reply })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
