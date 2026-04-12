"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
const API = "http://localhost:8000";
interface Trade { ticker: string; action: string; price: number; shares: number; pnl?: number; timestamp: string; conviction?: number; }
interface Performance { portfolio_value: number; starting_value: number; total_pnl: number; total_return_pct: number; total_trades: number; closed_trades: number; win_rate: number; wins: number; losses: number; avg_win: number; avg_loss: number; best_trade: Partial<Trade>; worst_trade: Partial<Trade>; trades: Trade[]; last_updated: string; }
function fmt(n: number) { return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n); }
function fdate(iso: string) { if(!iso) return "—"; return new Date(iso).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}); }
function Card({label,value,sub,pos}:{label:string;value:string;sub?:string;pos?:boolean|null}) {
  const col = pos===true?"text-emerald-400":pos===false?"text-red-400":"text-white";
  return <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-xl p-5 flex flex-col gap-1"><span className="text-[#4a5568] text-xs uppercase tracking-widest">{label}</span><span className={`text-2xl font-bold ${col}`}>{value}</span>{sub&&<span className="text-[#4a5568] text-xs">{sub}</span>}</div>;
}
export default function TrackRecord() {
  const [perf, setPerf] = useState<Performance|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(()=>{ fetch(`${API}/performance`).then(r=>r.json()).then(d=>{setPerf(d);setLoading(false);}).catch(()=>{setError("No se pudo conectar al servidor.");setLoading(false);}); },[]);
  const pos = (perf?.total_pnl??0)>=0;
  return (
    <div className="min-h-screen bg-[#070b10] text-white">
      <header className="border-b border-[#1e2d3d] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-sm font-bold">N</div><span className="font-semibold">NEXUS Intelligence</span></Link>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/><span className="text-xs text-[#4a5568]">Paper Trading Activo</span></div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#0d1117] border border-[#1e2d3d] rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] mb-6"><span className="w-1.5 h-1.5 rounded-full bg-[#6C8EF2] inline-block"/>Historial verificable — cada trade registrado en tiempo real</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Track Record <span className="bg-gradient-to-r from-[#6C8EF2] to-[#4CAF7A] bg-clip-text text-transparent">Público</span></h1>
          <p className="text-[#4a5568] max-w-xl mx-auto">4 IAs trabajando en tiempo real. Sin trampa. Sin edición.</p>
        </div>
        {loading&&<div className="text-center py-20 text-[#4a5568]"><div className="w-8 h-8 border-2 border-[#6C8EF2] border-t-transparent rounded-full animate-spin mx-auto mb-4"/>Cargando datos reales...</div>}
        {error&&<div className="text-center py-20 text-red-400 bg-[#0d1117] border border-red-900 rounded-xl p-8">{error}</div>}
        {perf&&!loading&&<>
          <div className="text-center mb-12 bg-[#0d1117] border border-[#1e2d3d] rounded-2xl p-10">
            <div className="text-[#4a5568] text-sm uppercase tracking-widest mb-2">Valor Actual del Portfolio</div>
            <div className="text-6xl font-bold mb-3">{fmt(perf.portfolio_value)}</div>
            <div className={`text-xl font-semibold ${pos?"text-emerald-400":"text-red-400"}`}>{pos?"▲":"▼"} {fmt(Math.abs(perf.total_pnl))} ({perf.total_return_pct>0?"+":""}{perf.total_return_pct}%)</div>
            <div className="text-[#4a5568] text-xs mt-2">Capital inicial: {fmt(perf.starting_value)} · Actualizado: {fdate(perf.last_updated)}</div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Card label="Total Trades" value={String(perf.total_trades)} sub="operaciones ejecutadas"/>
            <Card label="Win Rate" value={perf.closed_trades>0?`${perf.win_rate}%`:"—"} sub={`${perf.wins}W / ${perf.losses}L`} pos={perf.win_rate>=50?true:perf.win_rate>0?false:null}/>
            <Card label="Ganancia Media" value={perf.avg_win>0?fmt(perf.avg_win):"—"} sub="por trade ganador" pos={perf.avg_win>0}/>
            <Card label="Pérdida Media" value={perf.avg_loss<0?fmt(Math.abs(perf.avg_loss)):"—"} sub="por trade perdedor" pos={false}/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {perf.best_trade?.ticker&&<div className="bg-[#0d1117] border border-emerald-900/40 rounded-xl p-5"><div className="text-[#4a5568] text-xs uppercase tracking-widest mb-2">Mejor Trade</div><div className="flex items-center justify-between"><span className="text-xl font-bold">{perf.best_trade.ticker}</span><span className="text-emerald-400 text-xl font-bold">+{fmt(perf.best_trade.pnl??0)}</span></div><div className="text-[#4a5568] text-xs mt-1">{fdate(perf.best_trade.timestamp??"")}</div></div>}
            {perf.worst_trade?.ticker&&<div className="bg-[#0d1117] border border-red-900/40 rounded-xl p-5"><div className="text-[#4a5568] text-xs uppercase tracking-widest mb-2">Mayor Pérdida</div><div className="flex items-center justify-between"><span className="text-xl font-bold">{perf.worst_trade.ticker}</span><span className="text-red-400 text-xl font-bold">{fmt(perf.worst_trade.pnl??0)}</span></div><div className="text-[#4a5568] text-xs mt-1">{fdate(perf.worst_trade.timestamp??"")}</div></div>}
          </div>
          <div className="bg-[#0d1117] border border-[#1e2d3d] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1e2d3d] flex items-center justify-between"><h2 className="font-semibold">Historial de Trades</h2><span className="text-[#4a5568] text-xs">Últimas {Math.min(50,perf.trades.length)} operaciones</span></div>
            {perf.trades.length===0?<div className="text-center py-16 text-[#4a5568]"><div className="text-4xl mb-3">📊</div><div>Los trades aparecerán aquí cuando el mercado abra.</div></div>:
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-[#4a5568] text-xs uppercase tracking-widest border-b border-[#1e2d3d]"><th className="text-left px-6 py-3">Ticker</th><th className="text-left px-6 py-3">Acción</th><th className="text-right px-6 py-3">Precio</th><th className="text-right px-6 py-3">Shares</th><th className="text-right px-6 py-3">P&L</th><th className="text-right px-6 py-3">Convicción</th><th className="text-right px-6 py-3">Fecha</th></tr></thead>
            <tbody>{perf.trades.map((t,i)=>{const buy=t.action?.toUpperCase()==="BUY";const hp=t.pnl!==undefined&&t.pnl!==null;return(<tr key={i} className="border-b border-[#1e2d3d]/50 hover:bg-[#111820] transition-colors"><td className="px-6 py-3 font-semibold">{t.ticker}</td><td className="px-6 py-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${buy?"bg-emerald-900/40 text-emerald-400":"bg-red-900/40 text-red-400"}`}>{t.action?.toUpperCase()}</span></td><td className="px-6 py-3 text-right text-[#a0aec0]">{t.price?fmt(t.price):"—"}</td><td className="px-6 py-3 text-right text-[#a0aec0]">{t.shares??"—"}</td><td className="px-6 py-3 text-right font-semibold">{hp?<span className={(t.pnl??0)>=0?"text-emerald-400":"text-red-400"}>{(t.pnl??0)>=0?"+":""}{fmt(t.pnl??0)}</span>:<span className="text-[#4a5568]">En posición</span>}</td><td className="px-6 py-3 text-right text-[#4a5568]">{t.conviction??"—"}</td><td className="px-6 py-3 text-right text-[#4a5568] text-xs">{fdate(t.timestamp)}</td></tr>);})}</tbody></table></div>}
          </div>
          <div className="mt-12 text-center bg-gradient-to-br from-[#0d1117] to-[#0a1628] border border-[#1e2d3d] rounded-2xl p-10">
            <h3 className="text-2xl font-bold mb-3">¿Quieres que las 4 IAs trabajen para ti?</h3>
            <p className="text-[#4a5568] mb-6 max-w-md mx-auto">Este es el historial real de NEXUS. Sin edición. Sin trampa.</p>
            <div className="flex items-center justify-center gap-3"><Link href="/dashboard" className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-6 py-3 rounded-lg font-semibold transition-colors">Ver Dashboard</Link><Link href="/" className="border border-[#1e2d3d] hover:border-[#6C8EF2] text-[#a0aec0] px-6 py-3 rounded-lg font-semibold transition-colors">Saber más</Link></div>
          </div>
        </>}
      </main>
      <footer className="border-t border-[#1e2d3d] px-6 py-6 text-center text-[#4a5568] text-xs mt-12">NEXUS Intelligence © 2026 — Bensu Electronics Inc. · Paper trading en Alpaca Markets</footer>
    </div>
  );
}
