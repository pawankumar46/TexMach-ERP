import { cn } from "@/lib/utils"

export const Skeleton = ({ className }) => {
  return <div className={cn("animate-pulse rounded-lg bg-slate-200", className)} />
}

export const PageSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-16" />
      <Skeleton className="h-80" />
    </div>
  )
}

export const TableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-line px-4 py-4 last:border-b-0">
          <Skeleton className="h-12 w-12 shrink-0" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="hidden h-4 w-24 sm:block" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}

export const CardGridSkeleton = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-64" />
      ))}
    </div>
  )
}
