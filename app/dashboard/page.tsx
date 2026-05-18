"use client";

/**
 * NEXUS Intelligence — Dashboard Page
 * NEXUS Chat 16 Fix: "use client" + useEffect — NO server-side fetch
 * API: https://api.nxscapital.ai
 *
 * Endpoints usados:
 *   GET /portfolio  → valor, cash, P&L total
 *   GET /positions  → posiciones abiertas con P&L
 *   GET /performance → historial de trades + win rate
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

// ── Config ──────────────────────────────────────────────────────────────────
const API = "https://api.nxscapital.ai";
const REFRESH_MS = 30_000; // auto-refresh cada 30 segundos

// ── Types — deben coincidir EXACTAMENTE con server.py ───────────────────────
interface PortfolioData {
  portfolio_value: number;
  starting_capital: number;
  cash: number;
  equity: number;
  total_pnl: number;
  total_return_pct: number;
  buying_power: number;
  timestamp: string;
}

interface Position {
  ticker: string;
  qty: number;
  avg_entry: number;
  current_price: number;
  market_value: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  side: string;
}

interface PositionsData {
  count: number;
  total_unrealized_pnl: number;
  positions: Position[];
  timestamp: string;
}

interface Trade {
  ticker: string;
  side: string;
  qty: number;
  avg_price: number;
  notional: number;
  filled_at: string;
  order_type: string;
}

interface PerformanceData {
  portfolio_value: number;
  starting_value: number;
  total_pnl: number;
  total_return_pct: number;
  total_trades: number;
  buys: number;
  sells: number;
  open_positions: number;
  winning_positions: number;
  losing_positions: number;
  unrealized_pnl: number;
  win_rate: number;
  trades: Trade[];
  last_updated: string;
}

// ── Utils ────────────────────────────────────────────────────────────────────
const fmt$ = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const fmtPct = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;

const fmtDate = (iso: string) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

// ── Fetch helper con timeout ─────────────────────────────────────────────────
async function fetchWithTimeout<T>(url: string, ms = 8000): Promise<T> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(id);
  }
}

// ── Sub-components ───────────────────────────────────────────────────────────

function AgentDot({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse inline-block"
        style={{ background: color }}
      />
      <span className="text-xs font-mono text-text-muted uppercase tracking-widest">
        {name}
      </span>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  positive,
  mono,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean | null;
  mono?: boolean;
}) {
  const valueColor =
    positive === true
      ? "var(--color-success)"
      : positive === false
      ? "var(--color-danger)"
      : "var(--color-text-primary)";

  return (
    <div className="bg-surface border border-border-strong rounded-2xl p-5 flex flex-col gap-1.5 relative overflow-hidden group hover:border-[#2d3f5a] transition-all duration-300">
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
        style={{ background: positive === true ? "var(--color-success)" : positive === false ? "var(--color-danger)" : "var(--color-accent)",
          filter: "blur(20px)", transform: "translate(30%, -30%)" }} />
      <span className="text-xs text-text-muted uppercase tracking-[0.15em] font-medium">
        {label}
      </span>
      <span
        className={`text-2xl font-bold leading-none ${mono ? "font-mono" : ""}`}
        style={{ color: valueColor }}
      >
        {value}
      </span>
      {sub && (
        <span className="text-xs text-text-muted leading-tight">{sub}</span>
      )}
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-border-strong rounded-xl mb-3 w-3/4" />
      <div className="h-4 bg-surface-elevated rounded-xl w-1/2" />
    </div>
  );
}

// ── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [positions, setPositions] = useState<PositionsData | null>(null);
  const [perf, setPerf] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [tab, setTab] = useState<"positions" | "trades">("positions");

  const loadData = useCallback(async () => {
    setError(null);
    try {
      // Fetch en paralelo — si uno falla no bloquea el resto
      const [p, pos, pf] = await Promise.allSettled([
        fetchWithTimeout<PortfolioData>(`${API}/portfolio`),
        fetchWithTimeout<PositionsData>(`${API}/positions`),
        fetchWithTimeout<PerformanceData>(`${API}/performance`),
      ]);

      if (p.status === "fulfilled") setPortfolio(p.value);
      if (pos.status === "fulfilled") setPositions(pos.value);
      if (pf.status === "fulfilled") setPerf(pf.value);

      // Solo error si los 3 fallaron
      if (
        p.status === "rejected" &&
        pos.status === "rejected" &&
        pf.status === "rejected"
      ) {
        setError("No se pudo conectar a api.nxscapital.ai — verifica Railway");
      }

      setLastRefresh(new Date());
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, REFRESH_MS);
    return () => clearInterval(id);
  }, [loadData]);

  const isPositive = (portfolio?.total_pnl ?? 0) >= 0;
  const totalReturn = portfolio?.total_return_pct ?? 0;

  return (
    <div className="min-h-screen bg-bg text-white font-sans">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-border-strong bg-bg/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-success flex items-center justify-center text-sm font-bold shadow-lg shadow-accent/20">
              N
            </div>
            <div>
              <span className="font-semibold text-white text-sm">NEXUS Intelligence</span>
              <div className="text-xs text-text-muted leading-none">4 AIs · Alpaca Paper</div>
            </div>
          </Link>

          {/* Agent status pills */}
          <div className="hidden md:flex items-center gap-4">
            <AgentDot name="ATLAS" color="#6C8EF2" />
            <AgentDot name="SENTINEL" color="#f59e0b" />
            <AgentDot name="ECHO" color="var(--color-success)" />
            <AgentDot name="CONTRARIAN" color="#f472b6" />
          </div>

          <div className="flex items-center gap-3">
            {lastRefresh && (
              <span className="text-xs text-text-muted hidden sm:block">
                {lastRefresh.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
            <button
              onClick={loadData}
              disabled={loading}
              aria-label="Actualizar datos del portafolio"
              className="w-11 h-11 rounded-lg border border-border-strong hover:border-accent flex items-center justify-center transition-all group disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
              title="Refresh"
            >
              <svg
                className="w-3.5 h-3.5 text-text-muted group-hover:text-accent transition-colors"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="flex items-center gap-1.5 bg-surface border border-border-strong rounded-lg px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-mono font-semibold">LOCURA</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Error Banner ─────────────────────────────────────── */}
        {error && (
          <div role="alert" className="bg-red-950/40 border border-red-800/50 rounded-2xl p-4 flex items-start gap-3">
            <svg aria-hidden="true" className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-red-400 text-sm font-semibold">Error de conexión</p>
              <p className="text-red-400/70 text-xs mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* ── Portfolio Hero ───────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden border border-border-strong bg-gradient-to-br from-surface via-[#0a1628] to-surface">
          {/* Background glow */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${isPositive ? "var(--color-success)" : "var(--color-danger)"} 0%, transparent 60%)`,
            }}
          />
          <div className="relative px-6 sm:px-10 py-10 sm:py-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <p className="text-xs text-text-muted uppercase tracking-[0.2em] mb-2">
                  Portfolio Value
                </p>
                {loading ? (
                  <LoadingPulse />
                ) : (
                  <>
                    <p className="text-5xl sm:text-6xl font-bold tracking-tight font-mono">
                      {portfolio ? fmt$(portfolio.portfolio_value) : "—"}
                    </p>
                    <div className="mt-2 flex items-center gap-3 flex-wrap">
                      <span
                        className="text-xl font-semibold font-mono"
                        style={{ color: isPositive ? "var(--color-success)" : "var(--color-danger)" }}
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {portfolio
                          ? `${fmt$(Math.abs(portfolio.total_pnl))} (${fmtPct(totalReturn)})`
                          : "—"}
                      </span>
                      <span className="text-xs text-text-muted">
                        vs {fmt$(portfolio?.starting_capital ?? 100000)} capital inicial
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex flex-col items-start sm:items-end gap-1 text-xs text-text-muted">
                <div className="flex items-center gap-2">
                  <span>Cash disponible</span>
                  <span className="font-mono text-white text-sm font-semibold">
                    {portfolio ? fmt$(portfolio.cash) : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Buying power</span>
                  <span className="font-mono text-accent text-sm font-semibold">
                    {portfolio ? fmt$(portfolio.buying_power) : "—"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>Equity</span>
                  <span className="font-mono text-white text-sm font-semibold">
                    {portfolio ? fmt$(portfolio.equity) : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Grid ─────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface border border-border-strong rounded-2xl p-5 animate-pulse">
                <div className="h-3 bg-border-strong rounded w-2/3 mb-3" />
                <div className="h-7 bg-border-strong rounded w-4/5 mb-2" />
                <div className="h-2 bg-surface-elevated rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Total Trades"
              value={perf ? String(perf.total_trades) : "—"}
              sub={`${perf?.buys ?? 0} compras · ${perf?.sells ?? 0} ventas`}
            />
            <KpiCard
              label="Win Rate"
              value={
                perf && (perf.winning_positions + perf.losing_positions) > 0
                  ? `${perf.win_rate.toFixed(1)}%`
                  : "—"
              }
              sub={`${perf?.winning_positions ?? 0}W / ${perf?.losing_positions ?? 0}L posiciones`}
              positive={
                perf && (perf.winning_positions + perf.losing_positions) > 0
                  ? perf.win_rate >= 50
                  : null
              }
            />
            <KpiCard
              label="P&L No Realizado"
              value={perf ? fmt$(perf.unrealized_pnl) : "—"}
              sub={`${perf?.open_positions ?? positions?.count ?? 0} posiciones abiertas`}
              positive={
                perf ? perf.unrealized_pnl > 0 : null
              }
            />
            <KpiCard
              label="Retorno Total"
              value={portfolio ? fmtPct(portfolio.total_return_pct) : "—"}
              sub={`desde $${(portfolio?.starting_capital ?? 100000).toLocaleString()}`}
              positive={portfolio ? portfolio.total_return_pct > 0 : null}
              mono
            />
          </div>
        )}

        {/* ── Tabs: Positions / Trades ──────────────────────────── */}
        <div className="bg-surface border border-border-strong rounded-3xl overflow-hidden">
          {/* Tab nav */}
          <div role="tablist" aria-label="Vista del portafolio" className="flex border-b border-border-strong">
            {(["positions", "trades"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                aria-controls={`panel-${t}`}
                id={`tab-${t}`}
                onClick={() => setTab(t)}
                className={`flex-1 sm:flex-none px-6 py-4 text-sm font-semibold transition-all relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/50 ${
                  tab === t
                    ? "text-white"
                    : "text-text-muted hover:text-text-dim"
                }`}
              >
                {t === "positions"
                  ? `Posiciones Abiertas${positions ? ` (${positions.count})` : ""}`
                  : `Historial de Trades${perf ? ` (${perf.total_trades})` : ""}`}
                {tab === t && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-accent to-success" />
                )}
              </button>
            ))}
            {positions && tab === "positions" && (
              <div className="ml-auto flex items-center pr-5 gap-2">
                <span className="text-xs text-text-muted">P&L total:</span>
                <span
                  className="text-sm font-mono font-bold"
                  style={{
                    color: positions.total_unrealized_pnl >= 0 ? "var(--color-success)" : "var(--color-danger)",
                  }}
                >
                  {positions.total_unrealized_pnl >= 0 ? "+" : ""}
                  {fmt$(positions.total_unrealized_pnl)}
                </span>
              </div>
            )}
          </div>

          {/* ── Posiciones ─────────────────────────────────────── */}
          {tab === "positions" && (
            <div role="tabpanel" id="panel-positions" aria-labelledby="tab-positions">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-elevated rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !positions || positions.positions.length === 0 ? (
                <div className="text-center py-20 text-text-muted">
                  <svg aria-hidden="true" className="w-10 h-10 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <p className="text-sm">Sin posiciones abiertas</p>
                  <p className="text-xs mt-1">Los 4 agentes están en cash.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-text-muted uppercase tracking-[0.12em] border-b border-border-strong/50">
                        <th className="text-left px-5 sm:px-6 py-3">Ticker</th>
                        <th className="text-right px-5 sm:px-6 py-3">Qty</th>
                        <th className="text-right px-5 sm:px-6 py-3">Entrada</th>
                        <th className="text-right px-5 sm:px-6 py-3">Actual</th>
                        <th className="text-right px-5 sm:px-6 py-3">Valor</th>
                        <th className="text-right px-5 sm:px-6 py-3">P&L</th>
                        <th className="text-right px-5 sm:px-6 py-3">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.positions.map((pos, i) => {
                        const pnlPos = pos.unrealized_pnl >= 0;
                        return (
                          <tr
                            key={`${pos.ticker}-${i}`}
                            className="border-b border-border-strong/30 hover:bg-surface transition-colors"
                          >
                            <td className="px-5 sm:px-6 py-3.5">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-white">{pos.ticker}</span>
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded font-semibold uppercase"
                                  style={{
                                    background: pos.side === "long" ? "#14532d55" : "#7f1d1d55",
                                    color: pos.side === "long" ? "var(--color-success)" : "var(--color-danger)",
                                  }}
                                >
                                  {pos.side}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-text-dim">
                              {pos.qty.toFixed(4)}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-text-dim">
                              {fmt$(pos.avg_entry)}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-white font-semibold">
                              {fmt$(pos.current_price)}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-text-dim">
                              {fmt$(pos.market_value)}
                            </td>
                            <td
                              className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm font-bold"
                              style={{ color: pnlPos ? "var(--color-success)" : "var(--color-danger)" }}
                            >
                              {pnlPos ? "+" : ""}{fmt$(pos.unrealized_pnl)}
                            </td>
                            <td
                              className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm font-semibold"
                              style={{ color: pnlPos ? "var(--color-success)" : "var(--color-danger)" }}
                            >
                              {fmtPct(pos.unrealized_pnl_pct)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── Historial de Trades ────────────────────────────── */}
          {tab === "trades" && (
            <div role="tabpanel" id="panel-trades" aria-labelledby="tab-trades">
              {loading ? (
                <div className="p-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-surface-elevated rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !perf || perf.trades.length === 0 ? (
                <div className="text-center py-20 text-text-muted">
                  <svg aria-hidden="true" className="w-10 h-10 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  <p className="text-sm">Sin trades registrados</p>
                  <p className="text-xs mt-1">Aparecerán aquí cuando el mercado abra.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-xs text-text-muted uppercase tracking-[0.12em] border-b border-border-strong/50">
                        <th className="text-left px-5 sm:px-6 py-3">Ticker</th>
                        <th className="text-left px-5 sm:px-6 py-3">Acción</th>
                        <th className="text-right px-5 sm:px-6 py-3">Precio</th>
                        <th className="text-right px-5 sm:px-6 py-3">Qty</th>
                        <th className="text-right px-5 sm:px-6 py-3">Total</th>
                        <th className="text-right px-5 sm:px-6 py-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perf.trades.map((trade, i) => {
                        const isBuy = trade.side === "buy";
                        return (
                          <tr
                            key={i}
                            className="border-b border-border-strong/30 hover:bg-surface transition-colors"
                          >
                            <td className="px-5 sm:px-6 py-3.5 font-bold text-sm text-white">
                              {trade.ticker}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5">
                              <span
                                className="text-xs px-2 py-1 rounded font-bold uppercase"
                                style={{
                                  background: isBuy ? "#14532d55" : "#7f1d1d55",
                                  color: isBuy ? "var(--color-success)" : "var(--color-danger)",
                                }}
                              >
                                {trade.side?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-text-dim">
                              {trade.avg_price ? fmt$(trade.avg_price) : "—"}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-text-dim">
                              {trade.qty?.toFixed(4) ?? "—"}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right font-mono text-sm text-white font-semibold">
                              {trade.notional ? fmt$(trade.notional) : "—"}
                            </td>
                            <td className="px-5 sm:px-6 py-3.5 text-right text-xs text-text-muted">
                              {fmtDate(trade.filled_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer CTA ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-surface to-[#0a1628] border border-border-strong rounded-2xl p-6 hover:border-accent/40 transition-all group">
            <p className="text-xs text-text-muted uppercase tracking-[0.15em] mb-2">Track Record Público</p>
            <p className="text-sm text-text-dim mb-4">
              Historial verificable de cada operación ejecutada por los 4 agentes.
            </p>
            <Link
              href="/track-record"
              className="inline-flex items-center gap-2 text-sm text-accent font-semibold group-hover:gap-3 transition-all"
            >
              Ver track record →
            </Link>
          </div>
          <div className="bg-gradient-to-br from-surface to-[#0a1628] border border-border-strong rounded-2xl p-6 hover:border-success/40 transition-all group">
            <p className="text-xs text-text-muted uppercase tracking-[0.15em] mb-2">NEXUS Intelligence</p>
            <p className="text-sm text-text-dim mb-4">
              4 IAs trabajando 24/7. Tú solo decides el riesgo y retiras cuando quieras.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-success font-semibold group-hover:gap-3 transition-all"
            >
              Saber más →
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#2d3f5a] pb-4">
          NEXUS Intelligence © 2026 · Bensu Electronics Inc. · Paper trading en Alpaca Markets · Solo con fines educativos
          {lastRefresh && ` · Datos: ${lastRefresh.toLocaleTimeString()}`}
        </p>
      </main>
    </div>
  );
}
