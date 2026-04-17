// All skeleton components use only the CSS .skeleton class — no inline styles

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`} />
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`aiden-card p-5 ${className}`}>
      <div className="skeleton h-4 w-1/3 mb-4 rounded" />
      <div className="skeleton h-3 w-full mb-2 rounded" />
      <div className="skeleton h-3 w-4/5 mb-2 rounded" />
      <div className="skeleton h-3 w-3/5 rounded" />
    </div>
  )
}

export function StatSkeleton() {
  return (
    <div className="aiden-card p-4">
      <div className="skeleton h-4 w-4 rounded mb-3" />
      <div className="skeleton h-7 w-10 mb-1 rounded" />
      <div className="skeleton h-3 w-20 rounded" />
    </div>
  )
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
      <div className="flex-1">
        <div className="skeleton h-3.5 w-2/3 mb-1.5 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
  )
}

export function TicketSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-[#F4F4F5]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <div className="skeleton h-4 w-3/4 mb-1.5 rounded" />
          <div className="skeleton h-3 w-1/3 rounded" />
        </div>
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-1">
        {[1,2,3,4].map(i=>(
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className="skeleton w-4 h-4 rounded-full" />
              <div className="skeleton h-2 w-10 rounded" />
            </div>
            {i<4&&<div className="skeleton h-px flex-1 mx-1 mb-3.5" />}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <div className="skeleton h-7 w-56 mb-2 rounded" />
        <div className="skeleton h-4 w-40 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatSkeleton /><StatSkeleton /><StatSkeleton />
      </div>
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F4F5]">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="p-4 space-y-2">
              <TicketSkeleton /><TicketSkeleton />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#F4F4F5]">
              <div className="skeleton h-4 w-32 rounded" />
            </div>
            <div className="p-2">
              {[1,2,3].map(i=>(
                <div key={i} className="flex items-center gap-3 px-3 py-2.5">
                  <div className="skeleton w-4 h-4 rounded flex-shrink-0" />
                  <div className="skeleton h-3.5 flex-1 rounded" />
                  <div className="skeleton w-3 h-3 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F4F4F5]">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-3 w-14 rounded" />
            </div>
            <div className="divide-y divide-[#F4F4F5]">
              <RowSkeleton /><RowSkeleton /><RowSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="skeleton h-7 w-40 mb-1.5 rounded" />
          <div className="skeleton h-4 w-56 rounded" />
        </div>
        <div className="skeleton h-9 w-36 rounded-lg" />
      </div>
      <div className="aiden-card overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#F4F4F5]">
          <div className="skeleton h-4 w-28 rounded" />
        </div>
        <div className="divide-y divide-[#F4F4F5] px-5">
          {Array.from({length:rows}).map((_,i)=><RowSkeleton key={i}/>)}
        </div>
      </div>
    </div>
  )
}
