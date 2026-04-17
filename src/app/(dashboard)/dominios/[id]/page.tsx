'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { formatDate, daysUntil } from '@/lib/utils'

interface Domain { id:string;domain:string;status:string;expires_at:string|null;auto_renew:boolean;nameservers:string[]|null;registrar:string }
interface DnsRecord { id:number;host:string;type:string;answer:string;ttl:number }
const DNS_TYPES = ['A','AAAA','CNAME','MX','TXT','NS','SRV']

export default function DomainDetailPage() {
  const { id } = useParams<{id:string}>()
  const router = useRouter()
  const [domain,setDomain] = useState<Domain|null>(null)
  const [dns,setDns] = useState<DnsRecord[]>([])
  const [loading,setLoading] = useState(true)
  const [dnsLoading,setDnsLoading] = useState(false)
  const [tab,setTab] = useState<'overview'|'dns'|'nameservers'>('overview')
  const [showAdd,setShowAdd] = useState(false)
  const [newRec,setNewRec] = useState({host:'',type:'A',answer:'',ttl:300})
  const [adding,setAdding] = useState(false)
  const [renewing,setRenewing] = useState(false)

  useEffect(()=>{loadDomain()},[id])
  useEffect(()=>{if(tab==='dns'&&domain)loadDns()},[tab,domain])

  async function loadDomain(){
    setLoading(true)
    try{const res=await fetch(`/api/domains/${id}`);const d=await res.json();if(!res.ok)throw new Error(d.error);setDomain(d.domain)}
    catch{}finally{setLoading(false)}
  }
  async function loadDns(){
    setDnsLoading(true)
    try{const res=await fetch(`/api/domains/${id}/dns`);const d=await res.json();setDns(d.records??[])}
    catch{}finally{setDnsLoading(false)}
  }
  async function addDns(){
    if(!newRec.host||!newRec.answer)return
    setAdding(true)
    try{const res=await fetch(`/api/domains/${id}/dns`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newRec)});if(!res.ok)throw new Error((await res.json()).error);setNewRec({host:'',type:'A',answer:'',ttl:300});setShowAdd(false);loadDns()}
    catch(e:any){alert(e.message)}finally{setAdding(false)}
  }
  async function deleteDns(rid:number){
    if(!confirm('Eliminar este registro DNS?'))return
    await fetch(`/api/domains/${id}/dns/${rid}`,{method:'DELETE'});loadDns()
  }
  async function renew(){
    if(!confirm(`Renovar ${domain?.domain} por 1 año?`))return
    setRenewing(true)
    try{const res=await fetch(`/api/domains/${id}/renew`,{method:'POST'});if(!res.ok)throw new Error((await res.json()).error);loadDomain()}
    catch(e:any){alert(e.message)}finally{setRenewing(false)}
  }

  if(loading)return(<div className="space-y-4 animate-fade-in"><div className="h-8 w-48 skeleton mb-6"/><div className="aiden-card p-6"><div className="h-24 skeleton"/></div><div className="aiden-card p-6"><div className="h-40 skeleton"/></div></div>)
  if(!domain)return(<div className="text-center py-20"><p className="text-sm text-[#888] mb-4">Dominio no encontrado</p><button onClick={()=>router.push('/dominios')} className="aiden-btn aiden-btn-secondary aiden-btn-sm">Volver</button></div>)

  const days=daysUntil(domain.expires_at)
  const expiringSoon=days!==null&&days<=30

  return(
    <div className="animate-fade-in">
      <button onClick={()=>router.push('/dominios')} className="flex items-center gap-1.5 text-xs font-medium text-[#888] mb-5 hover:text-[#13967e] transition-colors">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Dominios
      </button>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-1.5">{domain.domain}</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{background:domain.status==='active'?'#E6F7F2':'#F5F5F5',color:domain.status==='active'?'#13967e':'#888'}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background:domain.status==='active'?'#13967e':'#888'}}/>
              {domain.status==='active'?'Activo':domain.status}
            </span>
            {domain.expires_at&&<span className={`text-xs ${expiringSoon?'text-red-500 font-semibold':'text-[#888]'}`}>Vence el {formatDate(domain.expires_at)}{days!==null&&` · ${days} días`}</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>router.push('/correo/nuevo')} className="aiden-btn aiden-btn-secondary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Crear correo
          </button>
          <button onClick={renew} disabled={renewing} className="aiden-btn aiden-btn-primary">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {renewing?'Renovando…':'Renovar 1 año'}
          </button>
        </div>
      </div>

      {expiringSoon&&(
        <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <div><p className="text-sm font-semibold text-red-700">Este dominio vence pronto</p><p className="text-xs text-red-600 mt-0.5">Renuévalo para no perder acceso a tu sitio web y correo.</p></div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-[#EBEBEB] mb-5">
        {(['overview','dns','nameservers'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${tab===t?'border-[#13967e] text-[#13967e]':'border-transparent text-[#888] hover:text-[#333]'}`}>
            {t==='overview'?'Resumen':t==='dns'?'Registros DNS':'Nameservers'}
          </button>
        ))}
      </div>

      {tab==='overview'&&(
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F0F0F0]"><h3 className="text-[13px] font-bold text-[#1A1A1A]">Información del dominio</h3></div>
            <div className="divide-y divide-[#F8F8F8]">
              {[{label:'Dominio',value:domain.domain},{label:'Registrador',value:'Name.com'},{label:'Estado',value:domain.status==='active'?'Activo':domain.status},{label:'Fecha de vencimiento',value:domain.expires_at?formatDate(domain.expires_at):'—'},{label:'Renovación automática',value:domain.auto_renew?'Activada':'Desactivada'}].map(row=>(
                <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-xs text-[#888] font-medium">{row.label}</span>
                  <span className="text-xs font-semibold text-[#1A1A1A]">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="aiden-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[13px] font-bold text-[#1A1A1A] mb-1">Renovación automática</div>
                  <div className="text-xs text-[#888] leading-relaxed">Tu dominio se renovará automáticamente para que no pierdas acceso.</div>
                </div>
                <div className={`w-11 h-6 rounded-full flex-shrink-0 relative ${domain.auto_renew?'bg-[#13967e]':'bg-[#CCCCCC]'}`}>
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${domain.auto_renew?'translate-x-5':'translate-x-0.5'}`}/>
                </div>
              </div>
            </div>
            <div className="aiden-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#555]" fill="none" viewBox="0 0 24 24"><path d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div><div className="text-[13px] font-bold text-[#1A1A1A]">Transferir dominio</div><div className="text-xs text-[#888]">Mueve este dominio a otro registrador</div></div>
              </div>
              <button className="aiden-btn aiden-btn-secondary aiden-btn-sm w-full">Iniciar transferencia</button>
            </div>
            <div className="aiden-card p-5 bg-[#F0FAF7]/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#13967e]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#13967e]" fill="none" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                </div>
                <div><div className="text-[13px] font-bold text-[#1A1A1A]">Correo profesional</div><div className="text-xs text-[#888]">Crea <span className="font-mono text-[#13967e]">tu@{domain.domain}</span></div></div>
              </div>
              <button onClick={()=>router.push('/correo/nuevo')} className="aiden-btn aiden-btn-primary aiden-btn-sm w-full">Crear buzón de correo</button>
            </div>
          </div>
        </div>
      )}

      {tab==='dns'&&(
        <div className="aiden-card overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0F0F0]">
            <div><h3 className="text-[13px] font-bold text-[#1A1A1A]">Registros DNS</h3><p className="text-[11px] text-[#888] mt-0.5">Los cambios tardan hasta 48h en propagarse</p></div>
            <button onClick={()=>setShowAdd(!showAdd)} className="aiden-btn aiden-btn-primary aiden-btn-sm">{showAdd?'Cancelar':'+ Añadir'}</button>
          </div>
          {showAdd&&(
            <div className="px-5 py-4 bg-[#F8FFF9] border-b border-[#E8F5F0]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                <div><label className="block text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1">Host</label><input className="aiden-input text-xs" placeholder="@" value={newRec.host} onChange={e=>setNewRec(r=>({...r,host:e.target.value}))}/></div>
                <div><label className="block text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1">Tipo</label><select className="aiden-input text-xs" value={newRec.type} onChange={e=>setNewRec(r=>({...r,type:e.target.value}))}>{DNS_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1">Valor</label><input className="aiden-input text-xs" placeholder="1.2.3.4" value={newRec.answer} onChange={e=>setNewRec(r=>({...r,answer:e.target.value}))}/></div>
                <div><label className="block text-[10px] font-bold text-[#888] uppercase tracking-wider mb-1">TTL</label><input className="aiden-input text-xs" type="number" value={newRec.ttl} onChange={e=>setNewRec(r=>({...r,ttl:parseInt(e.target.value)}))}/></div>
              </div>
              <button onClick={addDns} disabled={adding} className="aiden-btn aiden-btn-primary aiden-btn-sm">{adding?'Guardando…':'Guardar registro'}</button>
            </div>
          )}
          {dnsLoading?(<div className="p-8 space-y-3">{[1,2,3].map(i=><div key={i} className="h-10 skeleton"/>)}</div>):dns.length===0?(<div className="text-center py-12"><p className="text-sm text-[#888]">No hay registros DNS</p></div>):(
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
                  <tr>{['Host','Tipo','Valor','TTL',''].map(h=><th key={h} className="text-left px-5 py-2.5 text-[10px] font-bold text-[#888] uppercase tracking-wider">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-[#F8F8F8]">
                  {dns.map(r=>(
                    <tr key={r.id} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3 font-mono text-xs text-[#1A1A1A]">{r.host||'@'}</td>
                      <td className="px-5 py-3"><span className="px-2 py-0.5 bg-[#F0F0F0] rounded text-[10px] font-bold text-[#555]">{r.type}</span></td>
                      <td className="px-5 py-3 font-mono text-xs text-[#555] max-w-[200px] truncate">{r.answer}</td>
                      <td className="px-5 py-3 text-xs text-[#888]">{r.ttl}s</td>
                      <td className="px-5 py-3"><button onClick={()=>deleteDns(r.id)} className="text-[11px] font-semibold text-red-400 hover:text-red-600 transition-colors">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab==='nameservers'&&(
        <div className="aiden-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#F0F0F0]"><h3 className="text-[13px] font-bold text-[#1A1A1A]">Nameservers</h3><p className="text-[11px] text-[#888] mt-0.5">Controlan dónde se gestionan los DNS de tu dominio</p></div>
          <div className="p-5">
            {domain.nameservers?.length?(<div className="space-y-2 mb-5">{domain.nameservers.map((ns,i)=><div key={i} className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-[#EBEBEB] rounded-lg"><span className="text-[10px] font-bold text-[#888] w-6">NS{i+1}</span><span className="font-mono text-sm text-[#1A1A1A] flex-1">{ns}</span></div>)}</div>):(<div className="p-4 bg-[#FAFAFA] border border-[#EBEBEB] rounded-lg text-sm text-[#888] mb-5">Usando nameservers por defecto de Name.com</div>)}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="text-xs text-amber-700 leading-relaxed">Cambiar los nameservers interrumpirá temporalmente tu sitio web y correo. Solo modifícalos si sabes lo que haces.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
