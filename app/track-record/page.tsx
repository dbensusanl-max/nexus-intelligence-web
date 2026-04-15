"use client";

/**
 * NEXUS Intelligence — Track Record Público
 * Chat 17 Fix:
 *   - API apunta a api.nxscapital.ai (no localhost)
 *   - Campos corregidos: side/avg_price/qty/filled_at (no action/price/shares/timestamp)
 *   - wins = winning_positions, losses = losing_positions
 *   - Waitlist CTA al final
 *   - Disclaimer legal completo
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API = "https://api.nxscapital.ai";

interface PerfData {
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
  trades: RawTrade[];
  last_updated: string;
}

interface RawTrade {
  ticker: string;
  side: string;
  qty: number;
  avg_price: number;
  notional: number;
  filled_at: string;
  order_type: string;
}

function fmt$(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(n);
}

function fmtDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatCard({ label, value, sub, color = "white" }: { label: string; value: string; sub?: string; color?: string }) {
  const textColor = color === "green" ? "text-emerald-400" : color === "red" ? "text-red-400" : color === "blue" ? "text-[#6C8EF2]" : "text-white";
  return (
    <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-5 flex flex-col gap-1.5">
      <span className="text-[#3d4f6e] text-xs uppercase tracking-widest font-medium">{label}</span>
      <span className={`text-2xl font-bold ${textColor}`}>{value}</span>
      {sub && <span className="text-[#3d4f6e] text-xs">{sub}</span>}
    </div>
  );
}

export default function TrackRecord() {
  const [perf, setPerf] = useState<PerfData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);

  const fetchData = useCallback(() => {
    fetch(`${API}/performance`)
      .then(r => r.json())
      .then(d => { setPerf(d); setLoading(false); })
      .catch(() => { setError("No se pudo conectar a la API."); setLoading(false); });
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) return;
    setWaitlistLoading(true);
    try {
      await fetch("https://hook.us2.make.com/zjla3tg8pmarzgut2bneigy6ckmcag1h", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "waitlist",
          email: waitlistEmail,
          source: "track-record",
          timestamp: new Date().toISOString(),
          message: `🎯 Nueva solicitud de waitlist desde Track Record: ${waitlistEmail}`,
        }),
      });
    } catch (_) {}
    setWaitlistSent(true);
    setWaitlistLoading(false);
  };

  const isPositive = (perf?.total_pnl ?? 0) >= 0;
  const winRate = perf?.win_rate ?? 0;
  const wins = perf?.winning_positions ?? 0;
  const losses = perf?.losing_positions ?? 0;

  return (
    <div className="min-h-screen bg-[#060a12] text-white font-sans">
      {/* Header */}
      <header className="border-b border-[#1a2540] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060a12]/95 backdrop-blur z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-sm font-bold">N</div>
          <span className="font-semibold text-white">NEXUS Intelligence</span>
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[#3d4f6e]">Paper Trading Activo</span>
          </div>
          <Link href="/dashboard" className="text-xs text-[#6C8EF2] border border-[#6C8EF2]/30 px-3 py-1.5 rounded-lg hover:bg-[#6C8EF2]/10 transition-colors">
            Dashboard →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0a0f1a] border border-[#1a2540] rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C8EF2] inline-block animate-pulse" />
            Historial verificable — cada trade registrado en tiempo real
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            Track Record{" "}
            <span className="bg-gradient-to-r from-[#6C8EF2] to-[#4CAF7A] bg-clip-text text-transparent">Público</span>
          </h1>
          <p className="text-[#3d4f6e] max-w-xl mx-auto text-base leading-relaxed">
            4 IAs trabajando en tiempo real. Sin trampa. Sin edición.<br />
            Esto es lo que han hecho con $100,000 simulados desde Abril 2026.
          </p>
        </div>

        {loading && (
          <div className="text-center py-20 text-[#3d4f6e]">
            <div className="w-8 h-8 border-2 border-[#6C8EF2] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Cargando datos reales...
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400 bg-[#0a0f1a] border border-red-900/40 rounded-xl p-8">
            ⚠️ {error}
          </div>
        )}

        {perf && !loading && (
          <>
            {/* Portfolio Hero */}
            <div className="text-center mb-10 bg-gradient-to-br from-[#0a0f1a] to-[#0d1628] border border-[#1a2540] rounded-2xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6C8EF2]/5 to-transparent pointer-events-none" />
              <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">Valor Actual del Portfolio</div>
              <div className="text-6xl font-bold mb-3">{fmt$(perf.portfolio_value)}</div>
              <div className={`text-xl font-semibold mb-2 ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                {isPositive ? "▲" : "▼"} {fmt$(Math.abs(perf.total_pnl))} ({perf.total_return_pct > 0 ? "+" : ""}{perf.total_return_pct}%)
              </div>
              <div className="text-[#3d4f6e] text-xs">
                Capital inicial: {fmt$(perf.starting_value)} · Actualizado: {fmtDate(perf.last_updated)}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                label="Total Trades"
                value={String(perf.total_trades)}
                sub={`${perf.buys} compras · ${perf.sells} ventas`}
                color="blue"
              />
              <StatCard
                label="Win Rate"
                value={wins + losses > 0 ? `${winRate}%` : "—"}
                sub={`${wins} ganadoras · ${losses} perdedoras`}
                color={winRate >= 50 ? "green" : "red"}
              />
              <StatCard
                label="P&L No Realizado"
                value={fmt$(perf.unrealized_pnl)}
                sub={`${perf.open_positions} posiciones abiertas`}
                color={perf.unrealized_pnl >= 0 ? "green" : "red"}
              />
              <StatCard
                label="Retorno Total"
                value={`${perf.total_return_pct > 0 ? "+" : ""}${perf.total_return_pct}%`}
                sub="desde $100,000"
                color={perf.total_return_pct >= 0 ? "green" : "red"}
              />
            </div>

            {/* Agents bar */}
            <div className="grid grid-cols-4 gap-3 mb-10">
              {[
                { name: "ATLAS", desc: "Fundamental", color: "#6C8EF2" },
                { name: "SENTINEL", desc: "Técnico", color: "#4CAF7A" },
                { name: "ECHO", desc: "Sentimiento", color: "#F2A93B" },
                { name: "CONTRARIAN", desc: "Adversarial", color: "#F25C5C" },
              ].map(a => (
                <div key={a.name} className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-4 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: a.color }} />
                    <span className="text-xs font-bold" style={{ color: a.color }}>{a.name}</span>
                  </div>
                  <span className="text-[#3d4f6e] text-xs">{a.desc}</span>
                </div>
              ))}
            </div>

            {/* Trade History */}
            <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl overflow-hidden mb-10">
              <div className="px-6 py-4 border-b border-[#1a2540] flex items-center justify-between">
                <h2 className="font-semibold">Historial de Operaciones</h2>
                <span className="text-[#3d4f6e] text-xs">Últimas {Math.min(50, perf.trades.length)} operaciones · Auto-actualiza cada 30s</span>
              </div>

              {perf.trades.length === 0 ? (
                <div className="text-center py-16 text-[#3d4f6e]">
                  <div className="text-4xl mb-3">📊</div>
                  <div>Las operaciones aparecerán aquí cuando el mercado esté activo.</div>
                  <div className="text-xs mt-2">Horario: Lun–Vie 9:30am–4:00pm EST</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[#3d4f6e] text-xs uppercase tracking-widest border-b border-[#1a2540] bg-[#060a12]">
                        <th className="text-left px-6 py-3">Ticker</th>
                        <th className="text-left px-6 py-3">Acción</th>
                        <th className="text-right px-6 py-3">Precio</th>
                        <th className="text-right px-6 py-3">Cantidad</th>
                        <th className="text-right px-6 py-3">Valor</th>
                        <th className="text-right px-6 py-3">Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {perf.trades.map((t, i) => {
                        const isBuy = t.side === "buy";
                        return (
                          <tr key={i} className="border-b border-[#1a2540]/50 hover:bg-[#0d1628] transition-colors">
                            <td className="px-6 py-3 font-semibold text-white">{t.ticker}</td>
                            <td className="px-6 py-3">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${isBuy ? "bg-emerald-900/30 text-emerald-400 border border-emerald-900/50" : "bg-red-900/30 text-red-400 border border-red-900/50"}`}>
                                {isBuy ? "COMPRA" : "VENTA"}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-right text-[#8a9bbf]">
                              {t.avg_price > 0 ? fmt$(t.avg_price) : "—"}
                            </td>
                            <td className="px-6 py-3 text-right text-[#8a9bbf]">
                              {t.qty > 0 ? t.qty.toFixed(2) : "—"}
                            </td>
                            <td className="px-6 py-3 text-right text-[#8a9bbf]">
                              {t.notional > 0 ? fmt$(t.notional) : "—"}
                            </td>
                            <td className="px-6 py-3 text-right text-[#3d4f6e] text-xs">
                              {fmtDate(t.filled_at)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Waitlist CTA */}
            <div className="bg-gradient-to-br from-[#0d1628] to-[#0a0f1a] border border-[#6C8EF2]/20 rounded-2xl p-10 text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-[#6C8EF2]/10 border border-[#6C8EF2]/30 rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] mb-5">
                BETA PRIVADA · PLAZAS LIMITADAS
              </div>
              <h3 className="text-3xl font-bold mb-3">¿Quieres que las 4 IAs trabajen para ti?</h3>
              <p className="text-[#3d4f6e] mb-6 max-w-md mx-auto text-sm leading-relaxed">
                Este es el historial real. Sin edición. Sin trampa. Únete a la lista de espera y sé de los primeros cuando abramos al público.
              </p>

              {waitlistSent ? (
                <div className="bg-emerald-900/20 border border-emerald-900/40 rounded-xl px-6 py-4 text-emerald-400 max-w-sm mx-auto">
                  ✅ ¡Listo! Te avisamos cuando abramos. Revisa tu email.
                </div>
              ) : (
                <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    className="flex-1 bg-[#0a0f1a] border border-[#1a2540] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6e] focus:outline-none focus:border-[#6C8EF2] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="bg-[#6C8EF2] hover:bg-[#5a7de0] disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap"
                  >
                    {waitlistLoading ? "Enviando..." : "Quiero acceso"}
                  </button>
                </form>
              )}
              <p className="text-[#3d4f6e] text-xs mt-4">Sin spam. Sin compromiso. Solo te avisamos cuando esté listo.</p>
            </div>

            {/* Legal Disclaimer */}
            <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-6 text-xs text-[#3d4f6e] leading-relaxed">
              <div className="font-semibold text-[#5a6e8e] mb-2 uppercase tracking-wider text-xs">⚠️ Aviso Legal — Risk Disclosure</div>
              <p className="mb-2">
                <strong className="text-[#5a6e8e]">Paper Trading:</strong> Todos los resultados mostrados corresponden a operaciones simuladas (paper trading) en la plataforma Alpaca Markets. No representan resultados reales con capital real. El rendimiento pasado no garantiza resultados futuros.
              </p>
              <p className="mb-2">
                <strong className="text-[#5a6e8e]">No somos asesores financieros:</strong> NEXUS Intelligence y Bensu Electronics Inc. no son asesores de inversiones registrados, broker-dealers, ni entidades reguladas por la SEC, FINRA, o cualquier otro organismo regulador. La información presentada en este sitio es únicamente con fines educativos e informativos.
              </p>
              <p className="mb-2">
                <strong className="text-[#5a6e8e]">Riesgo de pérdida:</strong> El trading e inversión en valores conlleva riesgo significativo de pérdida. Las decisiones de inversión son responsabilidad exclusiva del usuario. Nunca invierta dinero que no pueda permitirse perder.
              </p>
              <p>
                <strong className="text-[#5a6e8e]">Custodia:</strong> El capital de los usuarios permanece en sus propias cuentas de Alpaca Securities LLC (SIPC member). NEXUS nunca custodia ni toca el dinero del usuario.
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-[#1a2540] px-6 py-6 text-center text-[#3d4f6e] text-xs mt-4">
        NEXUS Intelligence © 2026 — Bensu Electronics Inc. · Aventura, FL · Paper trading en Alpaca Markets · Solo con fines educativos · v0.1 beta
      </footer>
    </div>
  );
}
