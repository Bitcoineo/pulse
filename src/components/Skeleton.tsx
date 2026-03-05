export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
      <div className="h-8 w-32 rounded bg-gray-200 mb-2" />
      <div className="h-3 w-16 rounded bg-gray-200" />
    </div>
  );
}

export function SkeletonChart({ height = "h-[300px]" }: { height?: string }) {
  return (
    <div className={`rounded-xl border border-gray-100 bg-white p-6 animate-pulse ${height}`}>
      <div className="h-4 w-40 rounded bg-gray-200 mb-4" />
      <div className="flex h-[calc(100%-32px)] items-end gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t bg-gray-200"
            style={{ height: `${20 + Math.random() * 60}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-gray-200 mb-4" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-3 w-6 rounded bg-gray-200" />
            <div className="h-3 flex-1 rounded bg-gray-200" />
            <div className="h-3 w-12 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
