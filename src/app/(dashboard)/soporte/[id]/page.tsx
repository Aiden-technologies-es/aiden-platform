'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button, Badge, Card, CardBody, Spinner } from '@/components/ui'
import { formatDateTime, statusColor, statusLabel } from '@/lib/utils'

interface Reply {
  id: string
  message: string
  is_admin: boolean
  author_clerk_id: string
  created_at: string
}

interface Ticket {
  id: string
  ticket_num: string
  subject: string
  message: string
  status: string
  priority: string
  category: string
  created_at: string
  updated_at: string
}

interface LunnarMsg { role: 'user' | 'bot'; text: string }

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baja', normal: 'Normal', high: 'Alta', urgent: '🚨 Urgente',
}

export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [ticket, setTicket]   = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<Reply[]>([])
  const [loading, setLoading] = useState(true)
  const [reply, setReply]     = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')

  // Lunnar AI
  const [lunnarOpen, setLunnarOpen]     = useState(false)
  const [lunnarMsgs, setLunnarMsgs]     = useState<LunnarMsg[]>([])
  const [lunnarInput, setLunnarInput]   = useState('')
  const [lunnarBusy, setLunnarBusy]     = useState(false)
  const [lunnarHistory, setLunnarHistory] = useState<{role:string;content:string}[]>([])
  const lunnarRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadTicket() }, [id])

  async function loadTicket() {
    setLoading(true)
    try {
      const res = await fetch(`/api/tickets/${id}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setTicket(data.ticket)
      setReplies(data.replies ?? [])
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  async function sendReply() {
    if (!reply.trim()) return
    setSending(true)
    try {
      const res = await fetch(`/api/tickets/${id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: reply }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setReply('')
      await loadTicket()
    } catch (e: any) { setError(e.message) }
    finally { setSending(false) }
  }

  async function lunnarSend(msg?: string) {
    const text = msg ?? lunnarInput.trim()
    if (!text || lunnarBusy) return
    setLunnarInput('')
    const userMsg: LunnarMsg = { role: 'user', text }
    setLunnarMsgs(m => [...m, userMsg])
    const newHistory = [...lunnarHistory, { role: 'user', content: text }]
    setLunnarHistory(newHistory)
    setLunnarBusy(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newHistory.slice(-8),
          ticketId: id,
          context: ticket
            ? `Ticket: ${ticket.ticket_num} — ${ticket.subject}\nEstado: ${ticket.status}\nMensaje: ${ticket.message}`
            : '',
        }),
      })
      const data = await res.json()
      const botReply = data.reply ?? 'Sin respuesta.'
      setLunnarMsgs(m => [...m, { role: 'bot', text: botReply }])
      setLunnarHistory(h => [...h, { role: 'assistant', content: botReply }])
    } catch {
      setLunnarMsgs(m => [...m, { role: 'bot', text: 'Error al contactar con Lunnar. Inténtalo de nuevo.' }])
    } finally {
      setLunnarBusy(false)
      setTimeout(() => lunnarRef.current?.scrollTo({ top: lunnarRef.current.scrollHeight, behavior: 'smooth' }), 50)
    }
  }

  async function lunnarSuggestReply() {
    setSending(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Sugiere una respuesta concisa y profesional para responder a este ticket de soporte. Escríbela directamente en primera persona como si fuera el cliente respondiendo al equipo, sin explicaciones adicionales.',
          history: [],
          ticketId: id,
          context: ticket
            ? `Ticket: ${ticket.ticket_num} — ${ticket.subject}\nMensaje original: ${ticket.message}\nÚltimas respuestas: ${replies.slice(-2).map(r => (r.is_admin ? '[Soporte]' : '[Cliente]') + ': ' + r.message).join('\n')}`
            : '',
        }),
      })
      const data = await res.json()
      if (data.reply) setReply(data.reply)
    } catch { /* ignore */ }
    finally { setSending(false) }
  }

  if (loading) return (
    <div className="flex justify-center py-24">
      <Spinner className="w-8 h-8 text-brand" />
    </div>
  )

  if (error || !ticket) return (
    <div className="text-center py-16">
      <div className="text-4xl mb-3">⚠️</div>
      <p className="text-sm text-[#7A7A8C]">{error || 'Ticket no encontrado'}</p>
      <Button variant="secondary" size="sm" className="mt-4" onClick={() => router.push('/soporte')}>
        Volver al soporte
      </Button>
    </div>
  )

  const canReply  = !['closed'].includes(ticket.status)
  const stColor   = statusColor(ticket.status)
  const isWaiting = ticket.status === 'waiting_client'

  return (
    <div>
      {/* Back */}
      <button
        onClick={() => router.push('/soporte')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-4 hover:text-[#0A0A0F] transition-colors"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Mis consultas
      </button>

      {/* Ticket header */}
      <div className="mb-4">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
          <h1 className="text-xl font-bold text-[#0A0A0F] leading-snug flex-1">{ticket.subject}</h1>
          <Badge label={statusLabel(ticket.status)} color={stColor} />
        </div>
        <div className="flex items-center gap-3 flex-wrap text-xs text-[#7A7A8C]">
          <span className="font-mono font-bold text-[#0A0A0F]">{ticket.ticket_num}</span>
          <span>·</span>
          <span>{ticket.category}</span>
          <span>·</span>
          <span>Prioridad: <strong>{PRIORITY_LABELS[ticket.priority]}</strong></span>
          <span>·</span>
          <span>{formatDateTime(ticket.created_at)}</span>
        </div>
      </div>

      {/* Waiting alert */}
      {isWaiting && (
        <div className="mb-4 p-3 rounded-aiden bg-pink-50 border border-pink-200 flex items-center gap-2 text-sm text-pink-700 font-medium">
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          El equipo de soporte está esperando tu respuesta
        </div>
      )}

      {/* Lunnar AI Panel */}
      <Card className="mb-4 border border-[rgba(19,150,126,.15)] bg-gradient-to-r from-[rgba(19,150,126,.03)] to-transparent">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" className="text-brand">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <div className="text-sm font-bold text-[#0A0A0F]">Lunnar — Asistente IA</div>
                <div className="text-[11px] text-[#7A7A8C]">Puedo ayudarte a redactar respuestas o resolver dudas</div>
              </div>
            </div>
            <Button
              variant={lunnarOpen ? 'ghost' : 'brand'}
              size="sm"
              onClick={() => {
                setLunnarOpen(!lunnarOpen)
                if (!lunnarOpen && lunnarMsgs.length === 0) {
                  setTimeout(() => lunnarSend('¿En qué consiste exactamente este ticket y cómo me recomiendas responder?'), 100)
                }
              }}
            >
              {lunnarOpen ? 'Cerrar' : '✦ Abrir Lunnar'}
            </Button>
          </div>

          {lunnarOpen && (
            <div className="mt-4 border-t border-black/6 pt-4">
              {/* Quick chips */}
              {lunnarMsgs.length === 0 && (
                <div className="flex gap-2 flex-wrap mb-3">
                  {[
                    '¿Cómo respondo a esto?',
                    'Redacta una respuesta',
                    '¿Cuánto tarda el soporte?',
                  ].map(chip => (
                    <button
                      key={chip}
                      onClick={() => lunnarSend(chip)}
                      className="text-xs px-3 py-1.5 rounded-full border border-brand/30 text-brand bg-brand/5 hover:bg-brand/10 transition-colors font-medium"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

              {/* Messages */}
              <div ref={lunnarRef} className="space-y-3 max-h-64 overflow-y-auto mb-3 pr-1">
                {lunnarMsgs.map((m, i) => (
                  <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {m.role === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">✦</div>
                    )}
                    <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-brand text-white rounded-tr-sm'
                        : 'bg-white border border-black/8 text-[#0A0A0F] rounded-tl-sm shadow-aiden'
                    }`}>
                      {m.text}
                    </div>
                    {m.role === 'user' && (
                      <div className="w-7 h-7 rounded-lg bg-black/6 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm">👤</div>
                    )}
                  </div>
                ))}
                {lunnarBusy && (
                  <div className="flex gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center text-sm">✦</div>
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-white border border-black/8 shadow-aiden">
                      <div className="flex gap-1 items-center h-4">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand/40 animate-bounce" style={{ animationDelay: `${i*0.15}s` }}/>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  className="flex-1 px-3 py-2 border border-black/10 rounded-[10px] text-sm outline-none focus:border-brand bg-white/80 transition-colors"
                  placeholder="Pregunta a Lunnar…"
                  value={lunnarInput}
                  onChange={e => setLunnarInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && lunnarSend()}
                  disabled={lunnarBusy}
                />
                <Button variant="brand" size="icon" onClick={() => lunnarSend()} disabled={lunnarBusy}>
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                    <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Conversation thread */}
      <Card className="mb-4">
        <CardBody>
          <div className="space-y-0 divide-y divide-black/5">
            {/* Original message */}
            <div className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-xs font-bold text-brand">Tú</div>
                <span className="text-xs font-semibold text-[#0A0A0F]">Mensaje original</span>
                <span className="text-xs text-[#7A7A8C] ml-auto">{formatDateTime(ticket.created_at)}</span>
              </div>
              <div className="text-sm text-[#3A3A4A] leading-relaxed whitespace-pre-wrap pl-9">
                {ticket.message}
              </div>
            </div>

            {/* Replies */}
            {replies.map(r => (
              <div key={r.id} className={`py-4 ${r.is_admin ? 'bg-[rgba(19,150,126,.02)] -mx-5 px-5' : ''}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    r.is_admin
                      ? 'bg-brand text-white'
                      : 'bg-black/8 text-[#3A3A4A]'
                  }`}>
                    {r.is_admin ? 'A' : 'Tú'}
                  </div>
                  <span className="text-xs font-semibold text-[#0A0A0F]">
                    {r.is_admin ? 'Equipo de Aiden' : 'Tú'}
                  </span>
                  {r.is_admin && (
                    <span className="text-[10px] font-bold bg-brand/10 text-brand px-2 py-0.5 rounded-full">Soporte</span>
                  )}
                  <span className="text-xs text-[#7A7A8C] ml-auto">{formatDateTime(r.created_at)}</span>
                </div>
                <div className="text-sm text-[#3A3A4A] leading-relaxed whitespace-pre-wrap pl-9">
                  {r.message}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Reply form */}
      {canReply ? (
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-[#0A0A0F]">Tu respuesta</div>
              <button
                onClick={lunnarSuggestReply}
                disabled={sending}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:bg-brand/8 px-2.5 py-1.5 rounded-lg transition-colors"
              >
                ✦ Lunnar — Sugerir respuesta
              </button>
            </div>
            <textarea
              rows={4}
              className="w-full px-3 py-2.5 border-[1.5px] rounded-[10px] text-sm text-[#0A0A0F] bg-black/[.03] outline-none transition-colors border-black/10 focus:border-brand focus:bg-white/90 resize-none mb-3"
              placeholder="Escribe tu respuesta aquí…"
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) sendReply() }}
            />
            {error && (
              <p className="text-xs text-red-500 mb-2">{error}</p>
            )}
            <div className="flex items-center gap-2">
              <Button variant="brand" onClick={sendReply} loading={sending} disabled={!reply.trim()}>
                Enviar respuesta
              </Button>
              <span className="text-xs text-[#AEAEB2]">⌘↵ para enviar</span>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="text-center py-8 text-sm text-[#7A7A8C]">
          Esta consulta está {statusLabel(ticket.status).toLowerCase()}. Si necesitas más ayuda,{' '}
          <button onClick={() => router.push('/soporte/nuevo')} className="text-brand font-semibold hover:underline">
            abre una nueva consulta
          </button>.
        </div>
      )}
    </div>
  )
}
