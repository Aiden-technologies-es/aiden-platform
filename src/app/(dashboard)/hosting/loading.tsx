import { CardSkeleton } from '@/components/ui/skeleton'
export default function Loading() {
  return (
    <div>
      <div className="mb-7">
        <div className="h-3 w-20 mb-2 skeleton rounded-xl" />
        <div className="h-9 w-32 skeleton rounded-xl" />
      </div>
      <CardSkeleton />
    </div>
  )
}
