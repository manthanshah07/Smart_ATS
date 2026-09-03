import React from 'react'
import { cn } from '../../lib/utils'

export const Skeleton = ({ className, ...props }) => {
  return <div className={cn('animate-pulse rounded-md bg-muted/70', className)} {...props} />
}

export const CardSkeleton = () => (
  <div className="rounded-xl border border-border/60 p-6 space-y-3 bg-card animate-pulse">
    <div className="flex justify-between items-center">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-12 w-full" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
  </div>
)

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
    <div className="h-10 bg-muted/40 border-b border-border/60 flex items-center px-4 gap-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/6" />
      <Skeleton className="h-4 w-1/6" />
    </div>
    <div className="divide-y divide-border/40">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4 animate-pulse">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
        </div>
      ))}
    </div>
  </div>
)
