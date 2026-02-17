export function UserTableSkeleton() {
  return (
    <div className="space-y-0 overflow-hidden rounded-xl border border-border/50">
      {/* Header */}
      <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-4 py-3 bg-muted/30 border-b border-border/50">
        {[140, 200, 120, 80, 80, 60].map((w, i) => (
          <div key={i} className="h-3 rounded-full shimmer-bg" style={{ width: w }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto] gap-4 px-4 py-4 border-b border-border/30 last:border-0"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full shimmer-bg flex-shrink-0" />
            <div className="h-3.5 w-28 rounded-full shimmer-bg" />
          </div>
          <div className="flex items-center">
            <div className="h-3.5 w-40 rounded-full shimmer-bg" />
          </div>
          <div className="flex items-center">
            <div className="h-3.5 w-24 rounded-full shimmer-bg" />
          </div>
          <div className="flex items-center">
            <div className="h-5 w-14 rounded-md shimmer-bg" />
          </div>
          <div className="flex items-center">
            <div className="h-5 w-16 rounded-md shimmer-bg" />
          </div>
          <div className="flex items-center justify-end">
            <div className="h-8 w-8 rounded-lg shimmer-bg" />
          </div>
        </div>
      ))}
    </div>
  );
}
