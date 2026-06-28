import { cn } from "@/lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/40", className)} />
);

export const RepoCardSkeleton = () => (
  <div className="glass rounded-xl p-4 space-y-3">
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <div className="flex gap-3 pt-1">
      <Skeleton className="h-3 w-12" />
      <Skeleton className="h-3 w-8" />
      <Skeleton className="h-3 w-8" />
    </div>
  </div>
);

export const HeatmapSkeleton = () => (
  <div className="glass rounded-2xl p-5">
    <Skeleton className="h-4 w-48 mb-4" />
    <div className="flex gap-1 flex-wrap">
      {Array.from({ length: 90 }).map((_, i) => (
        <Skeleton key={i} className="w-2.5 h-2.5 rounded-sm" />
      ))}
    </div>
  </div>
);

export const F1RowSkeleton = () => (
  <div className="flex items-center gap-3 px-5 py-3 border-b border-border/30">
    <Skeleton className="w-6 h-4" />
    <Skeleton className="w-1 h-7 rounded-full" />
    <div className="space-y-1 flex-1">
      <Skeleton className="h-3.5 w-36" />
      <Skeleton className="h-2.5 w-16" />
    </div>
    <Skeleton className="h-3 w-20 mr-4" />
    <Skeleton className="h-4 w-10" />
  </div>
);

export const StatCardSkeleton = () => (
  <div className="glass rounded-2xl px-6 py-4">
    <Skeleton className="h-7 w-20 mb-1" />
    <Skeleton className="h-3 w-24" />
  </div>
);
