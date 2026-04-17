import { Button, Card, CardBody, EmptyState } from '@/components/ui'

export default function HostingPage() {
  return (
    <div>
      <div className="mb-6">
        <p className="text-[11px] font-semibold text-[#9A9AB0] uppercase tracking-widest mb-1">Servicios</p>
        <h1 className="text-[26px] font-bold text-[#0A0A0F] tracking-tight">Hosting & Webs</h1>
      </div>
      <Card>
        <CardBody>
          <EmptyState icon="🚀" title="Próximamente" description="La gestión de hosting y despliegues estará disponible en breve. Podrás crear webs con IA, gestionar WordPress y desplegar proyectos." action={<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand bg-brand/10 px-3 py-1.5 rounded-full">En desarrollo</span>}/>
        </CardBody>
      </Card>
    </div>
  )
}
