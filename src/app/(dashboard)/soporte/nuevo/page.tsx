'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardBody, Input, Select } from '@/components/ui'

const CATEGORIES = [
  { value: 'general',   label: '💬 Consulta general' },
  { value: 'dominios',  label: '🌐 Dominios' },
  { value: 'correo',    label: '📧 Correo electrónico' },
  { value: 'hosting',   label: '🖥️ Hosting / Web' },
  { value: 'facturacion', label: '💳 Facturación' },
  { value: 'tecnico',   label: '🔧 Problema técnico' },
]

const PRIORITIES = [
  { value: 'low',    label: 'Baja — No es urgente' },
  { value: 'normal', label: 'Normal — En los próximos días' },
  { value: 'high',   label: 'Alta — Necesito respuesta pronto' },
  { value: 'urgent', label: '🚨 Urgente — Servicio caído' },
]

export default function NuevaConsultaPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    subject: '', message: '', category: 'general', priority: 'normal',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit() {
    if (!form.subject.trim() || !form.message.trim()) {
      setError('El asunto y el mensaje son obligatorios.')
      return
    }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear la consulta')
      router.push(`/soporte/${data.ticket.id}`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-3 hover:text-[#0A0A0F] transition-colors"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Volver al soporte
        </button>
        <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Soporte</p>
        <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Nueva consulta</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Form */}
        <div className="lg:col-span-2 space-y-3">
          <Card>
            <CardBody>
              <div className="space-y-4">
                <Input
                  label="Asunto"
                  placeholder="Resume tu consulta en una frase"
                  value={form.subject}
                  onChange={e => set('subject', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Select
                    label="Categoría"
                    value={form.category}
                    onChange={e => set('category', e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </Select>
                  <Select
                    label="Prioridad"
                    value={form.priority}
                    onChange={e => set('priority', e.target.value)}
                  >
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#7A7A8C] uppercase tracking-wider">
                    Descripción
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2.5 border-[1.5px] rounded-[10px] text-sm text-[#0A0A0F] bg-black/[.03] outline-none transition-colors border-black/10 focus:border-[#13967e] focus:bg-white/90 resize-none"
                    placeholder="Explica tu consulta con el mayor detalle posible. Cuanta más información incluyas, antes podremos ayudarte."
                    value={form.message}
                    onChange={e => set('message', e.target.value)}
                  />
                  <p className="text-xs text-[#AEAEB2]">{form.message.length} caracteres · Mínimo 10</p>
                </div>

                {error && (
                  <div className="p-3 rounded-[10px] bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1">
                  <Button variant="brand" onClick={submit} loading={loading} className="px-6">
                    Enviar consulta
                  </Button>
                  <Button variant="ghost" onClick={() => router.back()}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-3">
          {/* Response time */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" className="text-green-600">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0A0A0F]">Tiempo de respuesta</div>
                  <div className="text-[11px] text-[#7A7A8C]">Normalmente en menos de 24h</div>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Urgente', time: '< 2 horas', color: '#FF3B30' },
                  { label: 'Alta', time: '< 8 horas', color: '#FF9500' },
                  { label: 'Normal', time: '< 24 horas', color: '#13967e' },
                  { label: 'Baja', time: '< 48 horas', color: '#AEAEB2' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <span className="font-medium" style={{ color: item.color }}>{item.label}</span>
                    <span className="text-[#7A7A8C]">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Tips */}
          <Card>
            <CardBody>
              <div className="text-xs font-bold text-[#0A0A0F] mb-2">💡 Consejos</div>
              <ul className="space-y-1.5 text-xs text-[#7A7A8C]">
                <li className="flex items-start gap-1.5">
                  <span className="text-brand mt-0.5">•</span>
                  Incluye el nombre de dominio o servicio afectado
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-brand mt-0.5">•</span>
                  Describe los pasos que llevan al problema
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-brand mt-0.5">•</span>
                  Añade capturas de pantalla si es posible
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-brand mt-0.5">•</span>
                  Indica si el problema es nuevo o recurrente
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
