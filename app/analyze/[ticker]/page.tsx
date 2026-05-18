import Link from "next/link";
import ConvictionMeter from "@/components/ConvictionMeter";
import AgentCard from "@/components/AgentCard";

interface AgentOutput {
  agent: string;
  stance: string;
  conviction: number;
  summary: string;
  key_points?: string[];
  bull_case?: string;
  bear_case?: string;
}

interface VerdictResult {
  ticker: string;
  verdict: "BUY" | "HOLD" | "SELL";
  conviction_score: number;
  risk_score: number;
  agent_stances: Record<string, string>;
  executive_summary: string[];
  trade_eligible: boolean;
}

interface AnalysisResult {
  ticker: string;
  company_name?: string;
  current_price?: number;
  pct_change?: number;
  verdict: VerdictResult;
  agents: Record<string, AgentOutput>;
}

const VERDICT_CONFIG = {
  BUY:  { color: "var(--color-success)", badgeClass: "text-success bg-success/10 border-success/25" },
  HOLD: { color: "var(--color-warning)", badgeClass: "text-warning bg-warning/10 border-warning/25" },
  SELL: { color: "var(--color-danger)",  badgeClass: "text-danger bg-danger/10 border-danger/25"   },
};

async function fetchAnalysis(ticker: string): Promise<AnalysisResult> {
  const res = await fetch(`https://api.nxscapital.ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticker }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Backend returned ${res.status}: ${await res.text()}`);
  }

  return res.json();
}

export default async function AnalyzePage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await params;
  const upperTicker = ticker.toUpperCase();

  let data: AnalysisResult | null = null;
  let errorMsg: string | null = null;

  try {
    data = await fetchAnalysis(upperTicker);
  } catch (e) {
    errorMsg = e instanceof Error ? e.message : "Unknown error";
  }

  const verdict = data ? VERDICT_CONFIG[data.verdict.verdict] ?? VERDICT_CONFIG.HOLD : null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav
        aria-label="Navegación principal"
        className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-bg/90 backdrop-blur-sm z-10"
      >
        <Link
          href="/"
          className="flex items-center gap-3 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" fill="#fff"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-text-primary tracking-wide text-sm group-hover:text-accent transition-colors">NEXUS</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary/60 font-mono">Análisis</span>
          <span aria-hidden="true" className="text-xs text-text-secondary/40">/</span>
          <span className="text-sm font-mono font-bold text-text-primary" aria-current="page">{upperTicker}</span>
        </div>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-6xl mx-auto w-full">
        {errorMsg ? (
          <ErrorState ticker={upperTicker} message={errorMsg} />
        ) : data ? (
          <AnalysisView data={data} verdict={verdict!} />
        ) : null}
      </main>
    </div>
  );
}

function ErrorState({ ticker, message }: { ticker: string; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-12 h-12 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mb-6">
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
          className="text-danger"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-text-primary mb-2">Analysis Failed</h2>
      <p className="text-text-secondary text-sm max-w-sm mb-1">
        Could not retrieve analysis for{" "}
        <span className="font-mono text-text-primary">{ticker}</span>.
      </p>
      <p className="text-xs text-text-secondary/50 font-mono mb-8 max-w-md">{message}</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-surface border border-border rounded-lg text-sm text-text-primary hover:border-accent/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}

function AnalysisView({
  data,
  verdict,
}: {
  data: AnalysisResult;
  verdict: { color: string; badgeClass: string };
}) {
  return (
    <div className="flex flex-col gap-10">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-8">
        {/* Ticker + Verdict */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <Link
              href="/"
              className="text-xs text-text-secondary/60 hover:text-accent transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              ← Búsqueda nueva
            </Link>
          </div>
          <h1 className="text-5xl font-bold text-text-primary font-mono tracking-tight mb-1">
            {data.ticker}
          </h1>
          {data.company_name && (
            <p className="text-base text-text-secondary font-medium mb-1 truncate max-w-md">
              {data.company_name}
            </p>
          )}
          {data.current_price !== undefined && (
            <p className="text-sm text-text-secondary mb-4">
              <span className="font-mono text-text-primary font-semibold">
                ${data.current_price.toFixed(2)}
              </span>
              {data.pct_change !== undefined && (
                <span
                  className={`ml-2 font-mono text-xs ${
                    data.pct_change >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {data.pct_change >= 0 ? "+" : ""}{data.pct_change.toFixed(2)}%
                </span>
              )}
            </p>
          )}
          <p className="text-sm text-text-secondary mb-6">
            Análisis multi-agente
          </p>

          {/* Verdict badge */}
          <div
            className={`inline-flex items-center gap-3 px-5 py-3 rounded-xl border text-2xl font-bold tracking-widest ${verdict.badgeClass}`}
          >
            {data.verdict.verdict}
          </div>

          {data.verdict.executive_summary?.length > 0 && (
            <p className="mt-6 text-sm text-text-secondary leading-relaxed max-w-lg">
              {data.verdict.executive_summary.join(" ")}
            </p>
          )}
        </div>

        {/* Scores panel */}
        <div className="flex flex-col sm:flex-row gap-4 shrink-0">
          {/* Conviction Meter */}
          <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col items-center gap-2">
            <ConvictionMeter score={data.verdict.conviction_score} size={160} />
          </div>

          {/* Risk Score */}
          <div className="bg-surface border border-border rounded-xl px-6 py-5 flex flex-col items-center justify-center gap-3 min-w-[120px]">
            <RiskGauge score={data.verdict.risk_score} />
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      {data.agents && Object.keys(data.agents).length > 0 && (
        <div>
          {(() => {
            const agentList = Object.values(data.agents);
            return (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <p className="text-xs text-text-secondary uppercase tracking-widest font-medium">
                    Agent Reports
                  </p>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-text-secondary/50 font-mono">{agentList.length} agents</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {agentList.map((agent) => (
                    <AgentCard key={agent.agent} data={agent} />
                  ))}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const clamped = Math.max(0, Math.min(100, score));
  const color =
    clamped >= 70 ? "var(--color-danger)" : clamped >= 40 ? "var(--color-warning)" : "var(--color-success)";
  const label =
    clamped >= 70 ? "HIGH" : clamped >= 40 ? "MEDIUM" : "LOW";

  return (
    <>
      <div aria-hidden="true" className="relative w-16 h-16 flex items-center justify-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" style={{ stroke: "var(--color-border)" }} />
          <circle
            cx="32"
            cy="32"
            r="26"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${(clamped / 100) * 163.36} 163.36`}
            style={{
              stroke: color,
              filter: `drop-shadow(0 0 4px color-mix(in oklch, ${color} 50%, transparent))`,
            }}
          />
        </svg>
        <span className="absolute text-base font-bold font-mono" style={{ color }}>
          {clamped}
        </span>
      </div>
      <p aria-hidden="true" className="text-xs font-semibold tracking-widest" style={{ color }}>
        {label}
      </p>
      <p aria-hidden="true" className="text-xs text-text-secondary/60 tracking-wider uppercase">Risk</p>
      <span className="sr-only">Puntuación de riesgo: {clamped} — {label}</span>
    </>
  );
}
