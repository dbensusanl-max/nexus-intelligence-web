"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const API = "https://api.nxscapital.ai";

interface Trade {
  ticker: string;
  action: string;
  price: number;
  shares: number;
  pnl?: number;
  timestamp: string;
  conviction?: number;
}

interface Performance {
  portfolio_value: number;
  starting_value: number;
  total_pnl: number;
  total_return_pct: number;
  total_trades: number;
  closed_trades: number;
  win_rate: number;
  wins: number;
  losses: number;
  avg_win: number;
  avg_loss: number;
  best_trade: Partial<Trade>;
  worst_trade: Partial<Trade>;
  trades: Trade[];
  last_updated: string;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(n);
}

function fdate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatCard({
  label,
  value,
  sub,
  pos,
}: {
  label: string;
  value: string;
  sub?: string;
  pos?: boolean | null;
}) {
  const col =
    pos === true
      ? "text-success"
      : pos === false
      ? "text-danger"
      : "text-text-primary";
  return (
    <div className="bg-surface border border-border-strong rounded-xl p-5 flex flex-col gap-1">
      <span className="text-text-muted text-xs uppercase tracking-widest">
        {label}
      </span>
      <span className={`text-2xl font-bold ${col}`}>{value}</span>
      {sub && <span className="text-text-muted text-xs">{sub}</span>}
    </div>
  );
}

export default function TrackRecord() {
  const [perf, setPerf] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/performance`)
      .then((r) => r.json())
      .then((d) => {
        setPerf(d);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo conectar al servidor.");
        setLoading(false);
      });
  }, []);

  const pos = (perf?.total_pnl ?? 0) >= 0;

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <header className="border-b border-border-strong px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-success flex items-center justify-center text-sm font-bold">
            N
          </div>
          <span className="font-semibold">NEXUS Intelligence</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-text-muted">Paper Trading Activo</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-surface border border-border-strong rounded-full px-4 py-1.5 text-xs text-accent mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            Historial verificable — cada trade registrado en tiempo real
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Track Record <span className="text-accent">Público</span>
          </h1>
          <p className="text-text-muted max-w-xl mx-auto">
            4 IAs trabajando en tiempo real. Sin trampa. Sin edición.
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-center py-20 text-text-muted">
            <div
              className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"
              role="status"
              aria-label="Cargando datos"
            />
            Cargando datos reales...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="text-center py-20 text-danger bg-surface border border-danger/20 rounded-xl p-8"
          >
            {error}
          </div>
        )}

        {perf && !loading && (
          <>
            {/* Portfolio value */}
            <div className="mb-12 bg-surface border border-border-strong rounded-2xl p-8 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="text-text-muted text-sm uppercase tracking-widest mb-2">
                    Valor Actual del Portfolio
                  </div>
                  <div className="text-5xl sm:text-6xl font-bold font-mono mb-3">
                    {fmt(perf.portfolio_value)}
                  </div>
                  <div
                    className={`text-xl font-semibold font-mono ${
                      pos ? "text-success" : "text-danger"
                    }`}
                  >
                    {pos ? "▲" : "▼"} {fmt(Math.abs(perf.total_pnl))} (
                    {perf.total_return_pct > 0 ? "+" : ""}
                    {perf.total_return_pct}%)
                  </div>
                </div>
                <div className="text-text-muted text-xs text-right shrink-0">
                  <p>Capital inicial: {fmt(perf.starting_value)}</p>
                  <p className="mt-1">
                    Actualizado: {fdate(perf.last_updated)}
                  </p>
                </div>
              </div>
            </div>

            {/* KPI grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard
                label="Total Trades"
                value={String(perf.total_trades)}
                sub="operaciones ejecutadas"
              />
              <StatCard
                label="Win Rate"
                value={perf.closed_trades > 0 ? `${perf.win_rate}%` : "—"}
                sub={`${perf.wins}W / ${perf.losses}L`}
                pos={
                  perf.win_rate >= 50 ? true : perf.win_rate > 0 ? false : null
                }
              />
              <StatCard
                label="Ganancia Media"
                value={perf.avg_win > 0 ? fmt(perf.avg_win) : "—"}
                sub="por trade ganador"
                pos={perf.avg_win > 0}
              />
              <StatCard
                label="Pérdida Media"
                value={perf.avg_loss < 0 ? fmt(Math.abs(perf.avg_loss)) : "—"}
                sub="por trade perdedor"
                pos={false}
              />
            </div>

            {/* Best / worst trade */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {perf.best_trade?.ticker && (
                <div className="bg-surface border border-success/20 rounded-xl p-5">
                  <div className="text-text-muted text-xs uppercase tracking-widest mb-2">
                    Mejor Trade
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {perf.best_trade.ticker}
                    </span>
                    <span className="text-success text-xl font-bold">
                      +{fmt(perf.best_trade.pnl ?? 0)}
                    </span>
                  </div>
                  <div className="text-text-muted text-xs mt-1">
                    {fdate(perf.best_trade.timestamp ?? "")}
                  </div>
                </div>
              )}
              {perf.worst_trade?.ticker && (
                <div className="bg-surface border border-danger/20 rounded-xl p-5">
                  <div className="text-text-muted text-xs uppercase tracking-widest mb-2">
                    Mayor Pérdida
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold">
                      {perf.worst_trade.ticker}
                    </span>
                    <span className="text-danger text-xl font-bold">
                      {fmt(perf.worst_trade.pnl ?? 0)}
                    </span>
                  </div>
                  <div className="text-text-muted text-xs mt-1">
                    {fdate(perf.worst_trade.timestamp ?? "")}
                  </div>
                </div>
              )}
            </div>

            {/* Trade history table */}
            <div className="bg-surface border border-border-strong rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border-strong flex items-center justify-between">
                <h2 className="font-semibold">Historial de Trades</h2>
                <span className="text-text-muted text-xs">
                  Últimas {Math.min(50, perf.trades.length)} operaciones
                </span>
              </div>

              {perf.trades.length === 0 ? (
                <div className="text-center py-16 text-text-muted">
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10 mx-auto mb-3 opacity-30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                    />
                  </svg>
                  <div>Los trades aparecerán aquí cuando el mercado abra.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-text-muted text-xs uppercase tracking-widest border-b border-border-strong">
                        <th scope="col" className="text-left px-6 py-3">
                          Ticker
                        </th>
                        <th scope="col" className="text-left px-6 py-3">
                          Acción
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                          Precio
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                          Shares
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                          P&L
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                          Convicción
                        </th>
                        <th scope="col" className="text-right px-6 py-3">
                          Fecha
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {perf.trades.map((t, i) => {
                        const buy = t.action?.toUpperCase() === "BUY";
                        const hasPnl = t.pnl !== undefined && t.pnl !== null;
                        return (
                          <tr
                            key={i}
                            className="border-b border-border-strong/50 hover:bg-surface-elevated transition-colors"
                          >
                            <td className="px-6 py-3 font-semibold">
                              {t.ticker}
                            </td>
                            <td className="px-6 py-3">
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold ${
                                  buy
                                    ? "bg-success/10 text-success"
                                    : "bg-danger/10 text-danger"
                                }`}
                              >
                                {t.action?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right text-text-dim">
                              {t.price ? fmt(t.price) : "—"}
                            </td>
                            <td className="px-6 py-3 text-right text-text-dim">
                              {t.shares ?? "—"}
                            </td>
                            <td className="px-6 py-3 text-right font-semibold">
                              {hasPnl ? (
                                <span
                                  className={
                                    (t.pnl ?? 0) >= 0
                                      ? "text-success"
                                      : "text-danger"
                                  }
                                >
                                  {(t.pnl ?? 0) >= 0 ? "+" : ""}
                                  {fmt(t.pnl ?? 0)}
                                </span>
                              ) : (
                                <span className="text-text-muted">
                                  En posición
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-3 text-right text-text-muted">
                              {t.conviction ?? "—"}
                            </td>
                            <td className="px-6 py-3 text-right text-text-muted text-xs">
                              {fdate(t.timestamp)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center bg-surface border border-border-strong rounded-2xl p-10">
              <h3 className="text-2xl font-bold mb-3">
                ¿Quieres que las 4 IAs trabajen para ti?
              </h3>
              <p className="text-text-muted mb-6 max-w-md mx-auto">
                Este es el historial real de NEXUS. Sin edición. Sin trampa.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/dashboard"
                  className="bg-accent hover:bg-accent-dim text-white px-6 py-3.5 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Ver Dashboard
                </Link>
                <Link
                  href="/"
                  className="border border-border-strong hover:border-accent text-text-dim px-6 py-3.5 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
                >
                  Saber más
                </Link>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-border-strong px-6 py-6 text-center text-text-muted text-xs mt-12">
        NEXUS Intelligence © 2026 — Bensu Electronics Inc. · Paper trading en Alpaca Markets
      </footer>
    </div>
  );
}
