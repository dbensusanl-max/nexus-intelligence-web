"use client";

/**
 * NEXUS Intelligence — Landing Page v2 GHOST LEVEL
 * Chat 17 — Rediseño completo
 *
 * NUEVO:
 *   - Video modal animado (CSS/JS) para "Ver cómo funciona"
 *   - Agentes con nombre real: Claude, GPT-4o, Grok, Gemini
 *   - "Construido con" logos Anthropic/OpenAI/xAI/Google
 *   - Comparación vs DraftKings/eToro/Robinhood
 *   - FAQ section con accordion
 *   - Live stats ticker
 *   - "Ver mi portafolio" restaurado
 *   - Sticky mobile CTA
 */

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";

const API = "https://api.nxscapital.ai";
const WEBHOOK = "https://hook.us2.make.com/zjla3tg8pmarzgut2bneigy6ckmcag1h";

interface PortfolioData {
  portfolio_value: number;
  total_pnl: number;
  total_return_pct: number;
  timestamp: string;
}

function fmt$(n: number, decimals = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);
}

// ── VIDEO MODAL ─────────────────────────────────────────────────────────────
function VideoModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const phases = [
    { id: 0, title: "El mercado nunca duerme", duration: 3500 },
    { id: 1, title: "4 IAs analizan 150+ acciones", duration: 4000 },
    { id: 2, title: "Debaten. Solo compran con consenso.", duration: 4000 },
    { id: 3, title: "Tu portafolio crece. Tú no haces nada.", duration: 4000 },
  ];

  useEffect(() => {
    if (!autoPlay) return;
    const current = phases[phase];
    timerRef.current = setTimeout(() => {
      if (phase < phases.length - 1) setPhase(p => p + 1);
      else setAutoPlay(false);
    }, current.duration);
    return () => clearTimeout(timerRef.current);
  }, [phase, autoPlay]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(4,6,12,0.97)", backdropFilter: "blur(12px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-3xl">
        <button onClick={onClose} className="absolute -top-10 right-0 text-[#3d4f6e] hover:text-white text-sm flex items-center gap-2">
          ✕ Cerrar
        </button>

        <div className="bg-[#080d18] border border-[#1a2540] rounded-2xl overflow-hidden" style={{ aspectRatio: "16/9", minHeight: 320 }}>
          {/* Phase 0: Satellite + Global Market */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 0 ? "opacity-100" : "opacity-0"}`}
            style={{ background: "radial-gradient(ellipse at 50% 30%, #0a1628 0%, #040610 70%)" }}>
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
              {/* Stars */}
              {[...Array(40)].map((_, i) => (
                <div key={i} className="absolute rounded-full bg-white animate-pulse"
                  style={{ width: Math.random() > 0.8 ? 2 : 1, height: Math.random() > 0.8 ? 2 : 1, top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, opacity: Math.random() * 0.8 + 0.1, animationDelay: `${Math.random() * 3}s` }} />
              ))}
              {/* Earth */}
              <div className="relative" style={{ width: 160, height: 160 }}>
                <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle at 35% 35%, #1a6b9e, #0d3d5e, #071a2e)", boxShadow: "inset -20px -10px 40px rgba(0,0,0,0.8), 0 0 60px rgba(108,142,242,0.15)" }} />
                <div className="absolute rounded-full" style={{ background: "#1a7a3e", width: 40, height: 25, top: 55, left: 35, borderRadius: 8 }} />
                <div className="absolute rounded-full" style={{ background: "#1a6b30", width: 55, height: 30, top: 70, left: 75, borderRadius: 10 }} />
                {/* Satellite orbit */}
                <div className="absolute inset-0 rounded-full" style={{ border: "1px dashed rgba(108,142,242,0.3)", margin: -30 }}>
                  <div className="absolute" style={{ animation: "orbit 3s linear infinite", transformOrigin: "80px 80px", top: -8, left: 72 }}>
                    <div style={{ width: 14, height: 8, background: "#6C8EF2", borderRadius: 2, boxShadow: "0 0 8px #6C8EF2" }}>
                      <div style={{ position: "absolute", top: -3, left: 2, width: 10, height: 2, background: "#a0b4f0", borderRadius: 1 }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Signal lines */}
              <div className="mt-6 text-center">
                <div className="text-[#6C8EF2] text-xs uppercase tracking-widest mb-1 animate-pulse">Datos de mercado en tiempo real</div>
                <div className="text-white text-2xl font-bold">NYSE · NASDAQ · CRYPTO</div>
                <div className="text-[#3d4f6e] text-sm mt-1">150+ mercados monitoreados 24/7</div>
              </div>
              {/* Ticker */}
              <div className="absolute bottom-0 left-0 right-0 py-2 px-4" style={{ background: "rgba(6,10,18,0.9)", borderTop: "1px solid #1a2540" }}>
                <div className="flex gap-6 text-xs overflow-hidden">
                  {[["PLTR","+3.2%","#4CAF7A"],["IONQ","+5.8%","#4CAF7A"],["AFRM","+4.1%","#4CAF7A"],["META","+2.9%","#4CAF7A"],["MU","+1.8%","#4CAF7A"],["MRVL","+3.5%","#4CAF7A"]].map(([t,p,c]) => (
                    <span key={t} className="whitespace-nowrap"><span className="text-white font-semibold">{t}</span> <span style={{ color: c }}>{p}</span></span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Phase 1: 4 AIs Scanning */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 1 ? "opacity-100" : "opacity-0"}`}
            style={{ background: "#040810" }}>
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-6">Análisis paralelo — 4 inteligencias simultáneas</div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                {[
                  { name: "ATLAS", model: "Claude (Anthropic)", color: "#6C8EF2", signal: "Analizando fundamentales...", score: 82 },
                  { name: "SENTINEL", model: "GPT-4o (OpenAI)", color: "#4CAF7A", signal: "Detectando breakouts...", score: 78 },
                  { name: "ECHO", model: "Grok (xAI)", color: "#F2A93B", signal: "Escaneando X/Twitter...", score: 91 },
                  { name: "CONTRARIAN", model: "Gemini (Google)", color: "#F25C5C", signal: "Buscando riesgos...", score: 65 },
                ].map((a, i) => (
                  <div key={a.name} className="bg-[#0a0f1a] border rounded-xl p-4" style={{ borderColor: a.color + "40", animationDelay: `${i * 0.2}s` }}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="font-bold text-sm" style={{ color: a.color }}>{a.name}</div>
                        <div className="text-[#3d4f6e] text-xs">{a.model}</div>
                      </div>
                      <div className="text-lg font-bold" style={{ color: a.color }}>{a.score}</div>
                    </div>
                    <div className="text-xs text-[#5a6e8e] animate-pulse">{a.signal}</div>
                    <div className="mt-2 h-1 bg-[#1a2540] rounded-full overflow-hidden">
                      <div className="h-full rounded-full animate-pulse" style={{ width: `${a.score}%`, background: a.color, opacity: 0.7 }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[#3d4f6e] text-xs">Analizando 150+ tickers en paralelo...</div>
            </div>
          </div>

          {/* Phase 2: AI Debate */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 2 ? "opacity-100" : "opacity-0"}`}
            style={{ background: "#040810" }}>
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
              <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-4">Debate entre agentes — ticker: PLTR</div>
              <div className="w-full max-w-lg space-y-3">
                {[
                  { from: "ATLAS", color: "#6C8EF2", msg: "PLTR: Contrato DoD nuevo. Guidance raised. COMPRAR — conviction 87", side: "left" },
                  { from: "SENTINEL", color: "#4CAF7A", msg: "Confirmado. Volumen 3.2x sobre media. Breakout técnico validado.", side: "right" },
                  { from: "ECHO", color: "#F2A93B", msg: "⚡ Trending en X. +2,400 menciones última hora. Catalizador fresco.", side: "left" },
                  { from: "CONTRARIAN", color: "#F25C5C", msg: "Riesgo aceptable. P/E elevado pero momentum justifica. HOLD/BUY.", side: "right" },
                ].map((msg, i) => (
                  <div key={i} className={`flex ${msg.side === "right" ? "justify-end" : "justify-start"}`}
                    style={{ opacity: 0, animation: `fadeIn 0.4s ease ${0.5 + i * 0.6}s forwards` }}>
                    <div className="max-w-xs">
                      <div className="text-xs mb-1" style={{ color: msg.color, textAlign: msg.side === "right" ? "right" : "left" }}>{msg.from}</div>
                      <div className="px-4 py-2 rounded-xl text-xs text-white" style={{ background: msg.color + "20", border: `1px solid ${msg.color}40` }}>
                        {msg.msg}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="text-center mt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold" style={{ background: "#4CAF7A20", border: "1px solid #4CAF7A40", color: "#4CAF7A" }}>
                    ✓ CONSENSO: BUY PLTR — Orden enviada a tu cuenta Alpaca
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3: Portfolio Growth + Happy User */}
          <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 3 ? "opacity-100" : "opacity-0"}`}
            style={{ background: "#040810" }}>
            <div className="w-full h-full flex items-center justify-center p-8 gap-8">
              {/* Portfolio */}
              <div className="flex-1 max-w-xs">
                <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">Tu portafolio NEXUS</div>
                <div className="text-4xl font-bold text-white mb-1">$107,641</div>
                <div className="text-emerald-400 text-xl font-bold mb-4">▲ +$7,641 (+7.64%)</div>
                {/* Simple chart bars */}
                <div className="flex items-end gap-1 h-16">
                  {[40,45,42,48,52,50,55,58,55,62,65,70,68,74,78,80,76,83,88,92].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i > 15 ? "#4CAF7A" : "#1a2540", opacity: i > 15 ? 1 : 0.5 }} />
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  {["IONQ +35%", "AFRM +15%", "META +15%"].map(t => (
                    <span key={t} className="text-xs px-2 py-1 rounded-lg text-emerald-400" style={{ background: "#4CAF7A15", border: "1px solid #4CAF7A30" }}>{t}</span>
                  ))}
                </div>
              </div>
              {/* User reaction */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-6xl" style={{ animation: "bounce 1s ease infinite" }}>😄</div>
                <div className="text-center">
                  <div className="text-white font-semibold">Tú</div>
                  <div className="text-[#3d4f6e] text-xs">mientras NEXUS opera</div>
                </div>
                <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-3 text-center">
                  <div className="text-xs text-[#3d4f6e] mb-1">Notificación</div>
                  <div className="text-emerald-400 text-sm font-semibold">💰 PLTR cerrado +4.2%</div>
                  <div className="text-[#3d4f6e] text-xs">NEXUS ejecutó automáticamente</div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 flex">
            {phases.map((p, i) => (
              <div key={i} className="flex-1 h-0.5 cursor-pointer" style={{ background: i <= phase ? "#6C8EF2" : "#1a2540", transition: "background 0.3s" }} onClick={() => { setPhase(i); setAutoPlay(false); }} />
            ))}
          </div>

          {/* Phase label */}
          <div className="absolute top-4 left-4 right-16">
            <div className="text-[#6C8EF2] text-xs font-semibold">{phases[phase].title}</div>
          </div>

          {/* Controls */}
          <div className="absolute top-3 right-4 flex gap-2">
            <button onClick={() => setPhase(p => Math.max(0, p - 1))} className="text-[#3d4f6e] hover:text-white text-xs px-2">◀</button>
            <button onClick={() => { setAutoPlay(!autoPlay); }} className="text-[#3d4f6e] hover:text-white text-xs px-2">{autoPlay ? "⏸" : "▶"}</button>
            <button onClick={() => setPhase(p => Math.min(phases.length - 1, p + 1))} className="text-[#3d4f6e] hover:text-white text-xs px-2">▶</button>
          </div>
        </div>

        {/* CTA below video */}
        <div className="mt-4 text-center">
          <p className="text-[#3d4f6e] text-sm mb-3">¿Listo para que las 4 IAs trabajen para ti?</p>
          <button onClick={onClose} className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-8 py-3 rounded-xl font-semibold text-sm transition-colors">
            Quiero acceso anticipado →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes orbit { from { transform: rotate(0deg) translateX(80px) rotate(0deg); } to { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      `}</style>
    </div>
  );
}

// ── WAITLIST MODAL ──────────────────────────────────────────────────────────
function WaitlistModal({ onClose, portfolio, pReturn }: { onClose: () => void; portfolio: number; pReturn: number }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "waitlist", email, source: "landing", timestamp: new Date().toISOString(),
          message: `🎯 WAITLIST: ${email} | Portfolio: $${portfolio.toLocaleString()} | Return: +${pReturn}%` }) });
    } catch (_) {}
    setSent(true); setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(6,10,18,0.95)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#3d4f6e] hover:text-white">✕</button>
        {sent ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold mb-2">¡Estás en la lista!</h3>
            <p className="text-[#3d4f6e] text-sm">Te avisamos cuando abramos. Mientras tanto, sigue el track record en vivo.</p>
            <Link href="/track-record" className="inline-block mt-5 text-[#6C8EF2] text-sm border border-[#6C8EF2]/30 px-4 py-2 rounded-lg hover:bg-[#6C8EF2]/10 transition-colors">
              Ver track record →
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-xl font-bold mx-auto mb-4">N</div>
              <h3 className="text-2xl font-bold mb-2">Únete a la beta privada</h3>
              <p className="text-[#3d4f6e] text-sm leading-relaxed">Plazas limitadas. Tu dinero en tu cuenta de Alpaca — NEXUS solo opera.</p>
            </div>
            <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-4 mb-6">
              <div className="text-[#3d4f6e] text-xs uppercase tracking-wider mb-1">Portfolio NEXUS ahora mismo</div>
              <div className="text-2xl font-bold">{fmt$(portfolio)}</div>
              <div className="text-emerald-400 text-sm font-semibold">▲ +{pReturn}% desde inicio</div>
            </div>
            <form onSubmit={submit} className="flex flex-col gap-3">
              <input type="email" required placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#060a12] border border-[#1a2540] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6e] focus:outline-none focus:border-[#6C8EF2] transition-colors" />
              <button type="submit" disabled={loading}
                className="w-full bg-[#6C8EF2] hover:bg-[#5a7de0] disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors">
                {loading ? "Enviando..." : "Quiero que inviertan por mí →"}
              </button>
            </form>
            <p className="text-center text-[#3d4f6e] text-xs mt-3">Sin spam. Sin compromiso. Solo te avisamos.</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── DISCLAIMER MODAL ────────────────────────────────────────────────────────
function DisclaimerModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(6,10,18,0.95)", backdropFilter: "blur(8px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-8 max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-[#3d4f6e] hover:text-white">✕</button>
        <h3 className="text-sm font-bold mb-4 text-[#5a6e8e] uppercase tracking-wider">⚠️ Aviso Legal — Risk Disclosure</h3>
        <div className="text-xs text-[#3d4f6e] leading-relaxed space-y-3">
          <p><strong className="text-[#5a6e8e]">Paper Trading:</strong> Todos los resultados son operaciones simuladas. No representan resultados reales. El rendimiento pasado no garantiza resultados futuros.</p>
          <p><strong className="text-[#5a6e8e]">No somos asesores financieros:</strong> NEXUS Intelligence y Bensu Electronics Inc. no son asesores de inversiones registrados, broker-dealers, ni entidades reguladas por la SEC o FINRA.</p>
          <p><strong className="text-[#5a6e8e]">Riesgo de pérdida:</strong> El trading conlleva riesgo significativo. Nunca invierta dinero que no pueda permitirse perder.</p>
          <p><strong className="text-[#5a6e8e]">Custodia:</strong> El capital permanece en cuentas personales de Alpaca Securities LLC (SIPC member). NEXUS nunca custodia el dinero del usuario.</p>
        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [trades, setTrades] = useState(114);

  const fetchData = useCallback(async () => {
    try {
      const r = await fetch(`${API}/portfolio`);
      if (r.ok) setPortfolio(await r.json());
    } catch (_) {}
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    // Animate trade counter
    const tradeInterval = setInterval(() => {
      setTrades(t => t + (Math.random() > 0.85 ? 1 : 0));
    }, 45000);
    return () => { clearInterval(interval); clearInterval(tradeInterval); };
  }, [fetchData]);

  const pValue = portfolio?.portfolio_value ?? 107641;
  const pReturn = portfolio?.total_return_pct ?? 7.64;
  const pPnl = portfolio?.total_pnl ?? 7641;
  const pAnnualized = Math.round(pReturn * 52);
  const isPos = pPnl >= 0;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const faqs = [
    { q: "¿Es seguro mi dinero?", a: "Tu dinero nunca sale de tu cuenta personal de Alpaca Securities (SIPC insured, igual que Fidelity o Schwab). NEXUS solo tiene permiso de trading — no puede retirar ni mover tu dinero fuera de tu cuenta." },
    { q: "¿Cómo gana dinero NEXUS?", a: "Solo ganamos cuando tú ganas. Cobramos un % de las ganancias generadas. Si NEXUS no genera ganancias, no cobramos nada. Alineamos nuestros incentivos completamente con los tuyos." },
    { q: "¿Puedo retirar mi dinero cuando quiera?", a: "Sí, en cualquier momento. Tu cuenta de Alpaca es tuya. Puedes retirar fondos directamente desde Alpaca sin pedir permiso a NEXUS ni esperar períodos de lockup." },
    { q: "¿Qué diferencia a NEXUS de un ETF o Betterment?", a: "Los ETFs y robo-advisors compran el mercado completo. NEXUS usa 4 IAs distintas para encontrar alpha real — acciones individuales con catalizadores específicos que el mercado no ha descontado aún." },
    { q: "¿Esto es legal?", a: "Actualmente operamos en paper trading (dinero simulado) mientras completamos el registro como proveedor de señales de inversión. Cuando abramos al público, operaremos completamente dentro del marco regulatorio vigente." },
  ];

  return (
    <div className="min-h-screen bg-[#060a12] text-white" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* Modals */}
      {showVideo && <VideoModal onClose={() => { setShowVideo(false); setShowWaitlist(true); }} />}
      {showWaitlist && <WaitlistModal onClose={() => setShowWaitlist(false)} portfolio={pValue} pReturn={pReturn} />}
      {showDisclaimer && <DisclaimerModal onClose={() => setShowDisclaimer(false)} />}

      {/* ── HEADER ── */}
      <header className="border-b border-[#1a2540]/50 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060a12]/95 backdrop-blur z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-sm font-bold">N</div>
          <span className="font-semibold">NEXUS Intelligence</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#3d4f6e]">
          <button onClick={() => setShowVideo(true)} className="hover:text-white transition-colors">Cómo funciona</button>
          <Link href="/track-record" className="hover:text-white transition-colors">Track record</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>
        <button onClick={() => setShowWaitlist(true)} className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white text-sm px-4 py-2 rounded-lg font-semibold transition-colors">
          Acceso anticipado
        </button>
      </header>

      {/* ── HERO ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0a0f1a] border border-[#1a2540] rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            BETA PRIVADA · {trades} trades ejecutados esta semana
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] mb-6">
            Mientras tú<br />duermes,<br />
            <span className="bg-gradient-to-r from-[#6C8EF2] to-[#4CAF7A] bg-clip-text text-transparent">
              NEXUS opera<br />por ti.
            </span>
          </h1>
          <p className="text-[#3d4f6e] text-lg leading-relaxed mb-8">
            Deja de adivinar. <strong className="text-white">4 inteligencias artificiales</strong> analizan, debaten y ejecutan operaciones en tu cuenta — sin que el dinero pase por nosotros.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={() => setShowWaitlist(true)}
              className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]">
              Quiero que inviertan por mí
            </button>
            <button onClick={() => setShowVideo(true)}
              className="border border-[#1a2540] hover:border-[#6C8EF2] text-[#8a9bbf] hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#6C8EF2]/20 flex items-center justify-center text-xs">▶</span>
              Ver cómo funciona
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-[#3d4f6e] hover:text-[#6C8EF2] transition-colors flex items-center gap-1">
              Ver mi portafolio →
            </Link>
            <span className="text-emerald-400 text-sm font-semibold">+{pReturn}% esta semana</span>
          </div>
        </div>

        {/* Live Portfolio Card */}
        <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#6C8EF2]/5 to-transparent pointer-events-none" />
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#3d4f6e] uppercase tracking-wider">Portafolio activo ahora</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <div className="text-4xl font-bold mb-1">{fmt$(pValue)}</div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-3">
              <div className="text-[#3d4f6e] text-xs mb-1">P&L Total</div>
              <div className={`text-lg font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}>{isPos ? "+" : ""}{fmt$(pPnl, 2)}</div>
              <div className={`text-xs ${isPos ? "text-emerald-400" : "text-red-400"}`}>{isPos ? "+" : ""}{pReturn}%</div>
            </div>
            <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-3">
              <div className="text-[#3d4f6e] text-xs mb-1">Retorno anualizado</div>
              <div className="text-lg font-bold text-[#6C8EF2]">+{pAnnualized}%</div>
              <div className="text-xs text-[#3d4f6e]">proyectado</div>
            </div>
          </div>
          <div className="mt-4 border-t border-[#1a2540] pt-4">
            <div className="text-[#3d4f6e] text-xs mb-2 uppercase tracking-wider">Últimas operaciones</div>
            <div className="flex gap-2 flex-wrap">
              {["IONQ +35%", "AFRM +15%", "META +15%", "MU +9%"].map(t => (
                <span key={t} className="text-xs bg-[#060a12] border border-emerald-900/40 text-emerald-400 px-2 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 text-xs text-[#3d4f6e] flex items-center gap-2">
            <span>🔒</span> Tu dinero en Alpaca · SIPC protegido · NEXUS nunca lo toca
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-y border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-4xl font-bold text-[#6C8EF2] mb-1">150+</div>
            <div className="text-sm text-white font-medium">tickers analizados</div>
            <div className="text-xs text-[#3d4f6e]">cada día sin descanso</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#4CAF7A] mb-1">4</div>
            <div className="text-sm text-white font-medium">IAs distintas</div>
            <div className="text-xs text-[#3d4f6e]">debatiendo cada operación</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#F2A93B] mb-1">+{pAnnualized}%</div>
            <div className="text-sm text-white font-medium">retorno anualizado</div>
            <div className="text-xs text-[#3d4f6e]">proyectado desde inicio</div>
          </div>
        </div>
      </section>

      {/* ── BUILT WITH ── */}
      <section className="border-b border-[#1a2540]">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center text-xs text-[#3d4f6e] uppercase tracking-widest mb-6">Construido con las IAs más avanzadas del mundo</div>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { name: "Anthropic", sub: "Claude", color: "#6C8EF2" },
              { name: "OpenAI", sub: "GPT-4o", color: "#4CAF7A" },
              { name: "xAI", sub: "Grok-3", color: "#F2A93B" },
              { name: "Google AI", sub: "Gemini", color: "#F25C5C" },
            ].map(b => (
              <div key={b.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: b.color }} />
                <span className="text-white font-semibold text-sm">{b.name}</span>
                <span className="text-[#3d4f6e] text-xs">{b.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SISTEMA ── */}
      <section id="sistema" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">El Sistema</div>
          <h2 className="text-4xl font-bold mb-4">El consejo de guerra que otros no tienen</h2>
          <p className="text-[#3d4f6e] max-w-xl mx-auto">
            Mientras un inversor normal actúa por emoción, NEXUS manda 4 IAs a debatir cada operación antes de ejecutarla.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { id: "01", name: "ATLAS", role: "Análisis Fundamental", model: "Claude · Anthropic", desc: "Evalúa balances, calidad de earnings y ventajas competitivas. Identifica valor intrínseco antes de que el mercado lo reconozca.", cta: "Decide si el precio justifica el negocio.", color: "#6C8EF2" },
            { id: "02", name: "SENTINEL", role: "Análisis Técnico", model: "GPT-4o · OpenAI", desc: "Lee price action, volumen y momentum. Detecta los movimientos institucionales antes de que sean visibles en las noticias.", cta: "Determina cuándo entrar y cuándo salir.", color: "#4CAF7A" },
            { id: "03", name: "ECHO", role: "Inteligencia Narrativa", model: "Grok-3 · xAI", desc: "Acceso directo a X/Twitter en tiempo real. Los mercados se mueven por narrativas antes de que los datos las confirmen.", cta: "Captura el sentimiento antes de que impacte.", color: "#F2A93B" },
            { id: "04", name: "CONTRARIAN", role: "Riesgo & Adversarial", model: "Gemini · Google", desc: "Destruye cada tesis alcista. Busca riesgos ocultos, downside asimétrico y escenarios que nadie está descontando.", cta: "Decide el tamaño de posición y stop-loss.", color: "#F25C5C" },
          ].map(a => (
            <div key={a.id} className="bg-[#0a0f1a] border border-[#1a2540] hover:border-opacity-60 rounded-xl p-5 flex flex-col transition-colors" style={{ "--hover-color": a.color } as React.CSSProperties}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${a.color}20`, color: a.color }}>{a.id}</div>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse mt-1" style={{ background: a.color }} />
              </div>
              <div className="font-bold mb-0.5" style={{ color: a.color }}>{a.name}</div>
              <div className="text-xs uppercase tracking-wider mb-0.5" style={{ color: a.color + "80" }}>{a.role}</div>
              <div className="text-[#3d4f6e] text-xs mb-3 font-medium">{a.model}</div>
              <p className="text-sm text-[#8a9bbf] mb-4 flex-1 leading-relaxed">{a.desc}</p>
              <p className="text-xs" style={{ color: a.color }}>{a.cta}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VS COMPETITION ── */}
      <section className="border-t border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">La Diferencia</div>
            <h2 className="text-3xl font-bold">Por qué NEXUS, no las otras opciones</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a2540]">
                  <th className="text-left py-3 px-4 text-[#3d4f6e] font-medium">¿Quién gana cuando tú pierdes?</th>
                  {["DraftKings","eToro","Robinhood","Betterment","NEXUS"].map(c => (
                    <th key={c} className={`py-3 px-4 text-center font-bold ${c === "NEXUS" ? "text-[#6C8EF2]" : "text-[#3d4f6e]"}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Ellos ganan cuando TÚ pierdes", "✅ Sí", "✅ Sí (B-Book)", "✅ Sí (PFOF)", "❌ No", "❌ No"],
                  ["Tu dinero bajo tu control", "❌", "❌", "⚠️", "⚠️", "✅ Siempre"],
                  ["Inteligencia activa vs mercado", "❌", "❌", "❌", "❌", "✅ 4 IAs"],
                  ["Ganamos solo si tú ganas", "❌", "❌", "❌", "❌", "✅"],
                  ["Sin fee fijo mensual", "N/A", "❌", "❌", "❌", "✅"],
                ].map((row, i) => (
                  <tr key={i} className="border-b border-[#1a2540]/50">
                    <td className="py-3 px-4 text-[#8a9bbf]">{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td key={j} className={`py-3 px-4 text-center ${j === 4 ? "text-[#6C8EF2] font-bold bg-[#6C8EF2]/5" : "text-[#5a6e8e]"}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS STEPS ── */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">En 3 pasos</div>
          <h2 className="text-3xl font-bold">Empezar no puede ser más simple</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { n: "01", title: "Abre cuenta en Alpaca", desc: "Alpaca es un broker regulado (SIPC). Tu cuenta, tu dinero. Gratis. 5 minutos.", icon: "🏦" },
            { n: "02", title: "Conecta NEXUS", desc: "Le das a NEXUS solo permiso de trading. No puede retirar tu dinero ni enviarlo a ningún lado.", icon: "🔗" },
            { n: "03", title: "Las 4 IAs trabajan para ti", desc: "NEXUS analiza el mercado cada 15 minutos. Compra, vende y protege tu capital automáticamente.", icon: "🤖" },
          ].map(s => (
            <div key={s.n} className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-6 text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="text-[#6C8EF2] text-xs font-mono mb-2">PASO {s.n}</div>
              <div className="font-bold mb-2">{s.title}</div>
              <div className="text-sm text-[#3d4f6e] leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="border-t border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">FAQ</div>
            <h2 className="text-3xl font-bold">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#060a12] border border-[#1a2540] rounded-xl overflow-hidden">
                <button className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-[#0a0f1a] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <span className="text-[#3d4f6e] text-lg">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[#3d4f6e] leading-relaxed border-t border-[#1a2540]"
                    style={{ paddingTop: 12 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-br from-[#0d1628] to-[#0a0f1a] border border-[#6C8EF2]/20 rounded-2xl p-12">
          <div className="text-5xl mb-4">🤖</div>
          <h2 className="text-4xl font-bold mb-4">4 IAs listas para trabajar para ti</h2>
          <p className="text-[#3d4f6e] mb-6 max-w-md mx-auto">
            El track record está en vivo. Los resultados son reales. Tú decides cuándo entrar.
          </p>
          <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-4 mb-8 inline-block">
            <div className="text-[#3d4f6e] text-xs mb-1">Portfolio NEXUS ahora</div>
            <div className="text-3xl font-bold">{fmt$(pValue)}</div>
            <div className="text-emerald-400 font-semibold">+{pReturn}% desde inicio · +{pAnnualized}% anualizado</div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button onClick={() => setShowWaitlist(true)}
              className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-[1.02]">
              Quiero acceso anticipado
            </button>
            <Link href="/track-record"
              className="border border-[#1a2540] hover:border-[#6C8EF2] text-[#8a9bbf] hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors">
              Ver track record público
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1a2540] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-xs font-bold">N</div>
            <span className="text-xs text-[#3d4f6e]">NEXUS Intelligence — Bensu Electronics Inc. · Aventura, FL</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#3d4f6e]">
            <button onClick={() => setShowDisclaimer(true)} className="hover:text-white transition-colors underline">No somos asesores financieros</button>
            <span>Paper trading activo</span>
            <span>v0.1 beta</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-3 text-center">
          <button onClick={() => setShowDisclaimer(true)} className="text-xs text-[#1a2540] hover:text-[#3d4f6e] transition-colors">
            ⚠️ Risk Disclosure: Paper trading con fines educativos. No garantizamos rendimientos. Ver aviso legal →
          </button>
        </div>
      </footer>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-30 p-4 bg-[#060a12]/95 backdrop-blur border-t border-[#1a2540]">
        <button onClick={() => setShowWaitlist(true)} className="w-full bg-[#6C8EF2] text-white py-3 rounded-xl font-semibold text-sm">
          Quiero acceso anticipado →
        </button>
      </div>
    </div>
  );
}
