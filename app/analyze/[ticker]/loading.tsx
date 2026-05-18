export default function AnalyzeLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav skeleton */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-bg/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-surface-elevated animate-pulse" />
          <div className="h-3.5 w-14 bg-surface-elevated rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-12 bg-surface-elevated rounded animate-pulse" />
          <div className="h-3 w-1.5 bg-surface-elevated rounded animate-pulse" />
          <div className="h-3.5 w-10 bg-surface-elevated rounded animate-pulse" />
        </div>
      </div>

      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {/* Status message */}
        <div className="flex items-center gap-2.5 mb-10 text-text-muted">
          <div
            className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0"
            role="status"
            aria-label="Analizando"
          />
          <span className="text-sm">Los agentes están analizando el ticker...</span>
          <span className="text-xs text-text-muted/60 hidden sm:inline">
            (esto puede tardar hasta 30 segundos)
          </span>
        </div>

        <div className="flex flex-col gap-10">
          {/* Header row skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-start gap-8">
            {/* Ticker + verdict skeleton */}
            <div className="flex-1">
              <div className="h-3 w-20 bg-surface-elevated rounded animate-pulse mb-3" />
              <div className="h-14 w-36 bg-surface-elevated rounded animate-pulse mb-2" />
              <div className="h-4 w-40 bg-surface-elevated rounded animate-pulse mb-6" />
              <div className="h-12 w-24 bg-surface-elevated rounded-xl animate-pulse mb-6" />
              <div className="space-y-2 max-w-lg">
                <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
                <div className="h-3 w-11/12 bg-surface-elevated rounded animate-pulse" />
                <div className="h-3 w-4/5 bg-surface-elevated rounded animate-pulse" />
              </div>
            </div>

            {/* Score panels skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 shrink-0">
              <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col items-center gap-2">
                <div className="w-40 h-[116px] bg-surface-elevated rounded-lg animate-pulse" />
              </div>
              <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col items-center justify-center gap-3 min-w-[120px]">
                <div className="w-16 h-16 rounded-full bg-surface-elevated animate-pulse" />
                <div className="h-3 w-10 bg-surface-elevated rounded animate-pulse" />
                <div className="h-2.5 w-8 bg-surface-elevated rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Agent grid skeleton */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="h-3 w-24 bg-surface-elevated rounded animate-pulse" />
              <div className="flex-1 h-px bg-border" />
              <div className="h-3 w-14 bg-surface-elevated rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl overflow-hidden"
                  style={{ borderTopWidth: "2px", borderTopColor: "var(--color-border-strong)" }}
                >
                  <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-elevated animate-pulse shrink-0" />
                      <div>
                        <div className="h-3.5 w-20 bg-surface-elevated rounded animate-pulse mb-1.5" />
                        <div className="h-2.5 w-28 bg-surface-elevated rounded animate-pulse" />
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-surface-elevated rounded animate-pulse shrink-0" />
                  </div>
                  <div className="px-5 pb-4">
                    <div className="flex justify-between mb-1.5">
                      <div className="h-2.5 w-20 bg-surface-elevated rounded animate-pulse" />
                      <div className="h-2.5 w-8 bg-surface-elevated rounded animate-pulse" />
                    </div>
                    <div className="h-1.5 bg-surface-elevated rounded-full animate-pulse" />
                  </div>
                  <div className="px-5 pb-5 space-y-2">
                    <div className="h-3 w-full bg-surface-elevated rounded animate-pulse" />
                    <div className="h-3 w-11/12 bg-surface-elevated rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-surface-elevated rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
