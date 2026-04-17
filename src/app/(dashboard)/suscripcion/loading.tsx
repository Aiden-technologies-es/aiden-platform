import { Skeleton, CardSkeleton } from '@/components/ui/skeleton'
export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <Skeleton className="h-3 w-20 mb-2" />
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="aiden-card dark-hero p-6 mb-4">
        <Skeleton className="h-3 w-24 mb-2" style={{background:'rgba(255,255,255,.1)'}} />
        <Skeleton className="h-8 w-36 mb-4" style={{background:'rgba(255,255,255,.1)'}} />
        <Skeleton className="h-12 w-48 mb-5" style={{background:'rgba(255,255,255,.08)'}} />
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" style={{background:'rgba(255,255,255,.08)'}} />)}
        </div>
        <Skeleton className="h-10 rounded-xl" style={{background:'rgba(255,255,255,.12)'}} />
      </div>
      <CardSkeleton className="mb-4" />
      <CardSkeleton />
    </div>
  )
}
