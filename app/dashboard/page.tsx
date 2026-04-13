import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Position {
  symbol: string;
  qty: number;
  avg_entry_price: number;
  current_price: number;
  market_value: number;
  unrealized_pl: number;
  unrealized_plpc: number;
}

interface Trade {
  id?: string;
  symbol: string;
  side: "buy" | "sell";
  qty: number;
  filled_avg_price: number;
  filled_at: string;
}

interface PortfolioData {
  portfolio_value: number;
  cash?: number;
  pnl_today?: number;
  pnl_today_pct?: number;
  positions?: Position[];
  trades?: Trade[];
  win_rate?: number;
  updated_at?: string;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchPortfolio(): Promise<PortfolioData | null> {
  try {
    const res = await fetch("https://api.nxscapital.ai/portfolio", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 2) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function winRate(trades: Trade[]): number {
  // "win" = a sell trade followed by a net positive — best-effort without cost basis
  // Fallback: count filled sells only; backend should ideally return this
  if (!trades.length) return 0;
  const sells = trades.filter((t) => t.side === "sell");
  if (!sells.length) return 0;
  // Without P&L per trade we return 0 — backend win_rate takes priority
  return 0;
}

// ─── Agent config (mirrors app/page.tsx) ─────────────────────────────────────

const AGENTS = [
  { id: "ATLAS", role: "Fundamental Analysis", color: "#6C8EF2" },
  { id: "SENTINEL", role: "Technical Analysis", color: "#4CAF7A" },
  { id: "ECHO", role: "Narrative Intelligence", color: "#E8A04A" },
  { id: "CONTRARIAN", role: "Risk & Adversarial", color: "#E05252" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const data = await fetchPortfolio();
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const positions = data?.positions ?? [];
  const trades = (data?.trades ?? []).slice(0, 10);
  const pnlToday = data?.pnl_today ?? 0;
  const pnlPct = data?.pnl_today_pct ?? 0;
  const portfolioValue = data?.portfolio_value ?? 100000;
  const computedWinRate = data?.win_rate != null
    ? data.win_rate
    : winRate(trades);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 bg-bg/90 backdrop-blur-sm z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" fill="#fff" />
              <path
                d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="font-semibold text-text-primary tracking-wide text-sm group-hover:text-accent transition-colors">
            NEXUS
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-secondary/60 font-mono">Dashboard</span>
          <span className="text-xs text-text-secondary/40">/</span>
          <span className="text-sm font-mono font-bold text-text-primary">Portfolio</span>
        </div>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-7xl mx-auto w-full flex flex-col gap-10">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">
                Portafolio NEXUS
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/25">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold text-success font-mono tracking-wider">
                  ACTIVO
                </span>
              </div>
            </div>
            <p className="text-sm text-text-secondary font-mono">
              Última actualización: {data?.updated_at ? fmtDate(data.updated_at) : now}
              {!data && (
                <span className="ml-2 text-warning/70">· Backend offline — mostrando datos demo</span>
              )}
            </p>
          </div>
          <Link
            href="/"
            className="text-xs text-text-secondary/60 hover:text-accent transition-colors font-mono shrink-0"
          >
            ← Volver al inicio
          </Link>
        </div>

        {/* ── Stats Row ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Valor total"
            value={`$${fmt(portfolioValue)}`}
            sub={data ? "cuenta Alpaca" : "simulado"}
            accent="#6C8EF2"
          />
          <StatCard
            label="P&L hoy"
            value={`${pnlToday >= 0 ? "+" : ""}$${fmt(Math.abs(pnlToday))}`}
            sub={`${pnlPct >= 0 ? "+" : ""}${fmt(pnlPct, 2)}%`}
            accent={pnlToday >= 0 ? "#4CAF7A" : "#E05252"}
            valueColor={pnlToday >= 0 ? "#4CAF7A" : "#E05252"}
          />
          <StatCard
            label="Posiciones abiertas"
            value={String(positions.length)}
            sub={positions.length === 1 ? "ticker activo" : "tickers activos"}
            accent="#E8A04A"
          />
          <StatCard
            label="Win Rate"
            value={
              computedWinRate > 0
                ? `${fmt(computedWinRate * 100, 1)}%`
                : data?.win_rate != null
                ? `${fmt(data.win_rate * 100, 1)}%`
                : "—"
            }
            sub={`${trades.length} trades recientes`}
            accent="#4CAF7A"
          />
        </div>

        {/* ── Positions Table ─────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="Posiciones" count={positions.length} unit="abiertas" />
          {positions.length === 0 ? (
            <EmptyState message="No hay posiciones abiertas." />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {["Símbolo", "Acciones", "Precio prom.", "Precio actual", "Valor mkt.", "P&L", "P&L %"].map(
                        (h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs text-text-secondary tracking-widest uppercase font-medium whitespace-nowrap"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos, i) => {
                      const profit = pos.unrealized_pl >= 0;
                      return (
                        <tr
                          key={pos.symbol}
                          className="border-b border-border last:border-0 transition-colors hover:bg-surface-elevated/50"
                          style={{
                            background: profit
                              ? i % 2 === 0
                                ? "rgba(76,175,122,0.03)"
                                : "rgba(76,175,122,0.02)"
                              : i % 2 === 0
                              ? "rgba(224,82,82,0.03)"
                              : "rgba(224,82,82,0.02)",
                          }}
                        >
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-text-primary">
                              {pos.symbol}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-secondary">
                            {fmt(pos.qty, 0)}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-secondary">
                            ${fmt(pos.avg_entry_price)}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-primary">
                            ${fmt(pos.current_price)}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-primary">
                            ${fmt(pos.market_value)}
                          </td>
                          <td
                            className="px-5 py-3.5 font-mono font-semibold"
                            style={{ color: profit ? "#4CAF7A" : "#E05252" }}
                          >
                            {profit ? "+" : ""}${fmt(pos.unrealized_pl)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className="inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold"
                              style={{
                                color: profit ? "#4CAF7A" : "#E05252",
                                background: profit
                                  ? "rgba(76,175,122,0.12)"
                                  : "rgba(224,82,82,0.12)",
                              }}
                            >
                              {profit ? "+" : ""}
                              {fmt(pos.unrealized_plpc * 100)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ── Recent Trades ───────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="Trades recientes" count={trades.length} unit="operaciones" />
          {trades.length === 0 ? (
            <EmptyState message="No hay trades registrados." />
          ) : (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-surface-elevated">
                      {["Fecha", "Símbolo", "Acción", "Acciones", "Precio", "Total"].map((h) => (
                        <th
                          key={h}
                          className="px-5 py-3 text-left text-xs text-text-secondary tracking-widest uppercase font-medium whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {trades.map((trade, i) => {
                      const isBuy = trade.side === "buy";
                      const total = trade.qty * trade.filled_avg_price;
                      return (
                        <tr
                          key={trade.id ?? i}
                          className="border-b border-border last:border-0 hover:bg-surface-elevated/50 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-mono text-text-secondary text-xs whitespace-nowrap">
                            {fmtDate(trade.filled_at)}
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="font-mono font-bold text-text-primary">
                              {trade.symbol}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className="inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold tracking-wider"
                              style={{
                                color: isBuy ? "#4CAF7A" : "#E05252",
                                background: isBuy
                                  ? "rgba(76,175,122,0.12)"
                                  : "rgba(224,82,82,0.12)",
                                border: `1px solid ${isBuy ? "rgba(76,175,122,0.25)" : "rgba(224,82,82,0.25)"}`,
                              }}
                            >
                              {trade.side.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-secondary">
                            {fmt(trade.qty, 0)}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-text-primary">
                            ${fmt(trade.filled_avg_price)}
                          </td>
                          <td className="px-5 py-3.5 font-mono font-semibold text-text-primary">
                            ${fmt(total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* ── Agent Status ────────────────────────────────────────────────── */}
        <section>
          <SectionHeader label="Estado de agentes" count={AGENTS.length} unit="activos" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4"
                style={{ borderTopColor: agent.color, borderTopWidth: "2px" }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: `${agent.color}15`,
                      color: agent.color,
                      border: `1px solid ${agent.color}30`,
                    }}
                  >
                    {agent.id.slice(0, 2)}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success/10 border border-success/20">
                    <div className="w-1 h-1 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-mono font-semibold text-success">ACTIVE</span>
                  </div>
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm">{agent.id}</p>
                  <p className="text-xs mt-0.5" style={{ color: agent.color }}>
                    {agent.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  accent: string;
  valueColor?: string;
}) {
  return (
    <div
      className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-2"
      style={{ borderTopColor: accent, borderTopWidth: "2px" }}
    >
      <p className="text-xs text-text-secondary uppercase tracking-widest font-medium">{label}</p>
      <p
        className="text-2xl font-bold font-mono"
        style={{ color: valueColor ?? "var(--color-text-primary)" }}
      >
        {value}
      </p>
      <p className="text-xs text-text-secondary/60 font-mono">{sub}</p>
    </div>
  );
}

function SectionHeader({
  label,
  count,
  unit,
}: {
  label: string;
  count: number;
  unit: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <p className="text-xs text-text-secondary uppercase tracking-widest font-medium">{label}</p>
      <div className="flex-1 h-px bg-border" />
      <span className="text-xs text-text-secondary/50 font-mono">
        {count} {unit}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl px-6 py-12 flex items-center justify-center">
      <p className="text-sm text-text-secondary/50 font-mono">{message}</p>
    </div>
  );
}
