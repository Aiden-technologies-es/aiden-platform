'use client'

// Base skeleton block
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className}`} />
}

// Card skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`aiden-card p-5 ${className}`}>
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-5/6 mb-2" />
      <Skeleton className="h-3 w-4/6" />
    </div>
  )
}

// Stat card skeleton
export function StatSkeleton() {
  return (
    <div className="aiden-card p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton className="h-7 w-10 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

// Ticket row skeleton
export function TicketSkeleton() {
  return (
    <div className="p-4 rounded-2xl border border-black/6 bg-black/[.015]">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="flex items-center gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <Skeleton className="w-5 h-5 rounded-full" />
              <Skeleton className="h-2 w-10" />
            </div>
            {i < 4 && <Skeleton className="h-0.5 flex-1 mx-1 mb-3.5" />}
          </div>
        ))}
      </div>
    </div>
  )
}

// List row skeleton
export function RowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3.5 w-2/3 mb-1.5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full" />
    </div>
  )
}

// Dashboard skeleton — full page
export function DashboardSkeleton() {
  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <Skeleton className="h-3 w-32 mb-2" />
        <Skeleton className="h-10 w-56" />
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
      {/* Main grid */}
      <div className="grid lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <div className="aiden-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="p-4 space-y-3">
              <TicketSkeleton />
              <TicketSkeleton />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2 space-y-4">
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4 space-y-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-3 p-3">
                  <Skeleton className="w-9 h-9 rounded-xl" />
                  <Skeleton className="h-3.5 flex-1" />
                  <Skeleton className="w-4 h-4 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="aiden-card overflow-hidden">
            <div className="px-5 py-4 border-b border-black/5">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="divide-y divide-black/5">
              <RowSkeleton />
              <RowSkeleton />
              <RowSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generic list page skeleton
export function ListPageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-9 w-40" />
        </div>
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>
      <div className="aiden-card p-5">
        <Skeleton className="h-4 w-28 mb-4" />
        <div className="divide-y divide-black/5">
          {Array.from({ length: rows }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      </div>
    </div>
  )
}
