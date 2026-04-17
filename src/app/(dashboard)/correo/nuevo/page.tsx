'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Domain { id: string; domain: string }

const QUOTA_OPTIONS = [
  { value: '1000', label: '1 GB', desc: 'Uso básico' },
  { value: '5000', label: '5 GB', desc: 'Recomendado' },
  { value: '10000', label: '10 GB', desc: 'Para equipos' },
  { value: '25000', label: '25 GB', desc: 'Uso intensivo' },
]

export default function NuevoBuzonPage() {
  const router = useRouter()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ username:'', domainId:'', firstName:'', lastName:'', password:'', confirmPassword:'', quotaMB:'5000' })

  useEffect(() => {
    fetch('/api/domains/list').then(r=>r.json()).then(d=>{
      setDomains(d.domains??[])
      if(d.domains?.[0]) setForm(f=>({...f, domainId:d.domains[0].id}))
    })
  }, [])

  function set(field: string, value: string) { setForm(f=>({...f,[field]:value})); setError('') }

  const selectedDomain = domains.find(d=>d.id===form.domainId)
  const fullAddress = selectedDomain && form.username ? `${form.username}@${selectedDomain.domain}` : ''
  const passwordMatch = !form.confirmPassword || form.password === form.confirmPassword

  async function submit() {
    if (!form.username.trim() || !form.domainId) return setError('Usuario y dominio obligatorios.')
    if (form.password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.')
    if (!passwordMatch) return setError('Las contraseñas no coinciden.')
    setLoading(true)
    try {
      const res = await fetch('/api/email/create', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push('/correo')
    } catch(e:any) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div>
      <motion.button onClick={()=>router.back()} className="flex items-center gap-1.5 text-xs font-semibold text-[#7A7A8C] mb-5 hover:text-[#0A0A0F] transition-colors" initial={{opacity:0}} animate={{opacity:1}}>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Volver al correo
      </motion.button>

      <motion.div className="mb-7" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.4}}>
        <p className="text-[11px] font-bold text-[#9A9AB0] uppercase tracking-widest mb-1">Correo electrónico</p>
        <h1 className="text-3xl font-black text-[#0A0A0F] tracking-tight">Crear buzón</h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-5">
        <motion.div className="lg:col-span-2 space-y-4" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.45,delay:0.1}}>
          {/* Email builder */}
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-4">Dirección de correo</h3>
            <div className="flex gap-2 items-center mb-3">
              <input className="aiden-input flex-1" placeholder="nombre.apellido" value={form.username} onChange={e=>set('username',e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g,''))}/>
              <span className="text-[#7A7A8C] font-bold text-lg flex-shrink-0">@</span>
              <select className="aiden-input flex-1" value={form.domainId} onChange={e=>set('domainId',e.target.value)}>
                {domains.length===0 ? <option value="">Sin dominios</option> : domains.map(d=><option key={d.id} value={d.id}>{d.domain}</option>)}
              </select>
            </div>
            {fullAddress && (
              <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} className="flex items-center gap-2.5 px-4 py-3 bg-[#13967e]/8 border border-[#13967e]/20 rounded-xl">
                <span className="text-lg">📧</span>
                <span className="text-sm font-bold text-[#13967e] font-mono">{fullAddress}</span>
                <span className="ml-auto text-xs text-[#13967e]/60 font-medium">Tu nueva dirección</span>
              </motion.div>
            )}
            {domains.length===0 && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
                Necesitas un dominio primero.{' '}
                <button onClick={()=>router.push('/dominios/nuevo')} className="font-bold underline">Registrar dominio →</button>
              </div>
            )}
          </div>

          {/* Personal info */}
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-4">Información personal <span className="text-[#AEAEB2] font-normal">(opcional)</span></h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Nombre</label>
                <input className="aiden-input" placeholder="Juan" value={form.firstName} onChange={e=>set('firstName',e.target.value)}/>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Apellidos</label>
                <input className="aiden-input" placeholder="García" value={form.lastName} onChange={e=>set('lastName',e.target.value)}/>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-4">Contraseña</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Contraseña</label>
                <input className="aiden-input" type="password" placeholder="Mín. 8 caracteres" value={form.password} onChange={e=>set('password',e.target.value)}/>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#7A7A8C] uppercase tracking-wider mb-1.5">Confirmar</label>
                <input className={`aiden-input ${form.confirmPassword&&!passwordMatch?'border-red-400':''}`} type="password" placeholder="Repite la contraseña" value={form.confirmPassword} onChange={e=>set('confirmPassword',e.target.value)}/>
              </div>
            </div>
            {form.password && (
              <div className="flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1,2,3,4].map(i=>(
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${form.password.length>=i*3 ? i<=2?'bg-red-400':i===3?'bg-amber-400':'bg-[#13967e]' : 'bg-black/8'}`}/>
                  ))}
                </div>
                <span className="text-xs text-[#7A7A8C]">{form.password.length<6?'Débil':form.password.length<9?'Regular':form.password.length<12?'Buena':'Fuerte'}</span>
              </div>
            )}
          </div>

          {/* Storage */}
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-4">Almacenamiento</h3>
            <div className="grid grid-cols-2 gap-2">
              {QUOTA_OPTIONS.map(opt=>(
                <button key={opt.value} onClick={()=>set('quotaMB',opt.value)}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${form.quotaMB===opt.value?'border-[#13967e] bg-[#13967e]/6':'border-black/8 hover:border-black/20'}`}>
                  <div className={`text-base font-bold ${form.quotaMB===opt.value?'text-[#13967e]':'text-[#0A0A0F]'}`}>{opt.label}</div>
                  <div className="text-xs text-[#7A7A8C]">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} className="p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600 flex items-center gap-2">
              <svg width="15" height="15" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              {error}
            </motion.div>
          )}

          <div className="flex items-center gap-3">
            <button onClick={submit} disabled={loading||domains.length===0} className="aiden-btn aiden-btn-primary px-7 py-3 text-[14px] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Creando…
                </span>
              ) : 'Crear buzón'}
            </button>
            <button onClick={()=>router.back()} className="aiden-btn aiden-btn-ghost px-5 py-3">Cancelar</button>
          </div>
        </motion.div>

        {/* Info sidebar */}
        <motion.div className="space-y-4" initial={{opacity:0,x:16}} animate={{opacity:1,x:0}} transition={{duration:0.45,delay:0.2}}>
          <div className="aiden-card p-5">
            <div className="w-10 h-10 rounded-xl bg-[#13967e]/10 flex items-center justify-center text-xl mb-3">📧</div>
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-3">¿Qué incluye?</h3>
            <ul className="space-y-2">
              {['Correo con tu dominio','Webmail desde el panel','IMAP / SMTP / POP3','Antispam incluido','Acceso desde móvil'].map(f=>(
                <li key={f} className="flex items-center gap-2 text-xs text-[#4A4A5A]">
                  <div className="w-4 h-4 rounded-full bg-[#13967e]/10 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#13967e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <div className="aiden-card p-5">
            <h3 className="text-sm font-bold text-[#0A0A0F] mb-2">💡 Consejo</h3>
            <p className="text-xs text-[#7A7A8C] leading-relaxed">Usa el formato <strong className="text-[#4A4A5A]">nombre.apellido</strong> para una dirección profesional. Por ejemplo: <span className="font-mono text-[#13967e]">juan.garcia@tuempresa.com</span></p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
