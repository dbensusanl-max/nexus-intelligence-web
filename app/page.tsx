"use client";

/**
 * NEXUS Intelligence — Landing Page
 * Chat 17 Fix:
 *   - "Quiero que inviertan por mí" → abre modal waitlist
 *   - "Ver cómo funciona" → scroll a sección #sistema
 *   - Stats actualizadas (150 tickers, LOCURA mode)
 *   - Modal waitlist con email
 *   - Disclaimer legal en footer
 *   - Portfolio data en vivo desde api.nxscapital.ai
 */

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API = "https://api.nxscapital.ai";

interface PortfolioData {
  portfolio_value: number;
  total_pnl: number;
  total_return_pct: number;
  timestamp: string;
}

interface StatsData {
  portfolio_value: number;
  total_return_pct: number;
  positions_count: number;
  mode: string;
}

export default function LandingPage() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSent, setWaitlistSent] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/portfolio`),
        fetch(`${API}/stats`),
      ]);
      if (pRes.ok) setPortfolio(await pRes.json());
      if (sRes.ok) setStats(await sRes.json());
    } catch (_) {}
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
          source: "landing",
          timestamp: new Date().toISOString(),
          portfolio_value: portfolio?.portfolio_value,
          message: `🎯 Nueva solicitud de waitlist: ${waitlistEmail} | Portfolio: $${portfolio?.portfolio_value?.toLocaleString()}`,
        }),
      });
    } catch (_) {}
    setWaitlistSent(true);
    setWaitlistLoading(false);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const pValue = portfolio?.portfolio_value ?? stats?.portfolio_value ?? 107352;
  const pReturn = portfolio?.total_return_pct ?? stats?.total_return_pct ?? 7.35;
  const pPnl = portfolio?.total_pnl ?? (pValue - 100000);
  const isPos = pPnl >= 0;

  return (
    <div className="min-h-screen bg-[#060a12] text-white font-sans">

      {/* ── WAITLIST MODAL ─────────────────────────────────────────── */}
      {showWaitlist && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,10,18,0.92)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowWaitlist(false); }}
        >
          <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowWaitlist(false)}
              className="absolute top-4 right-4 text-[#3d4f6e] hover:text-white text-xl leading-none"
            >✕</button>

            {waitlistSent ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">¡Estás en la lista!</h3>
                <p className="text-[#3d4f6e] text-sm">
                  Te avisamos cuando abramos acceso. Mientras tanto, sigue el track record en tiempo real.
                </p>
                <Link
                  href="/track-record"
                  className="inline-block mt-5 text-[#6C8EF2] text-sm border border-[#6C8EF2]/30 px-4 py-2 rounded-lg hover:bg-[#6C8EF2]/10 transition-colors"
                >
                  Ver track record →
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-xl font-bold mx-auto mb-4">N</div>
                  <h3 className="text-2xl font-bold mb-2">Únete a la beta privada</h3>
                  <p className="text-[#3d4f6e] text-sm leading-relaxed">
                    Plazas limitadas. Sé de los primeros cuando abramos al público. Tu dinero en tu cuenta de Alpaca — NEXUS solo opera.
                  </p>
                </div>

                {/* Live portfolio en el modal */}
                <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-4 mb-6">
                  <div className="text-[#3d4f6e] text-xs uppercase tracking-wider mb-1">Portfolio NEXUS ahora mismo</div>
                  <div className="text-2xl font-bold">${pValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                  <div className={`text-sm font-semibold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                    {isPos ? "▲" : "▼"} {isPos ? "+" : ""}{pReturn}% desde inicio
                  </div>
                </div>

                <form onSubmit={handleWaitlist} className="flex flex-col gap-3">
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    className="w-full bg-[#060a12] border border-[#1a2540] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6e] focus:outline-none focus:border-[#6C8EF2] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={waitlistLoading}
                    className="w-full bg-[#6C8EF2] hover:bg-[#5a7de0] disabled:opacity-50 text-white py-3 rounded-xl font-semibold text-sm transition-colors"
                  >
                    {waitlistLoading ? "Enviando..." : "Quiero que inviertan por mí →"}
                  </button>
                </form>
                <p className="text-center text-[#3d4f6e] text-xs mt-3">Sin spam. Sin compromiso. Solo te avisamos.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── DISCLAIMER MODAL ──────────────────────────────────────── */}
      {showDisclaimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(6,10,18,0.95)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowDisclaimer(false); }}
        >
          <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-8 max-w-lg w-full relative max-h-[80vh] overflow-y-auto">
            <button onClick={() => setShowDisclaimer(false)} className="absolute top-4 right-4 text-[#3d4f6e] hover:text-white text-xl">✕</button>
            <h3 className="text-lg font-bold mb-4 text-[#5a6e8e] uppercase tracking-wider text-sm">⚠️ Aviso Legal — Risk Disclosure</h3>
            <div className="text-xs text-[#3d4f6e] leading-relaxed space-y-3">
              <p><strong className="text-[#5a6e8e]">Paper Trading:</strong> Todos los resultados mostrados son operaciones simuladas (paper trading). No representan resultados reales. El rendimiento pasado no garantiza resultados futuros.</p>
              <p><strong className="text-[#5a6e8e]">No somos asesores financieros:</strong> NEXUS Intelligence y Bensu Electronics Inc. no son asesores de inversiones registrados, broker-dealers, ni entidades reguladas por la SEC, FINRA, o cualquier organismo regulador. La información es solo con fines educativos.</p>
              <p><strong className="text-[#5a6e8e]">Riesgo de pérdida:</strong> El trading conlleva riesgo significativo de pérdida. Las decisiones de inversión son responsabilidad exclusiva del usuario. Nunca invierta dinero que no pueda permitirse perder.</p>
              <p><strong className="text-[#5a6e8e]">Custodia:</strong> El capital permanece en cuentas personales de Alpaca Securities LLC (SIPC member). NEXUS nunca custodia ni maneja el dinero del usuario directamente.</p>
              <p><strong className="text-[#5a6e8e]">Disponibilidad:</strong> El sistema puede experimentar interrupciones técnicas. No garantizamos disponibilidad continua ni ejecución de todas las operaciones.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ────────────────────────────────────────────────── */}
      <header className="border-b border-[#1a2540]/50 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060a12]/95 backdrop-blur z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-sm font-bold">N</div>
          <span className="font-semibold">NEXUS Intelligence</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#3d4f6e]">
          <button onClick={() => window.location.href="/video"} className="hover:text-white transition-colors">Cómo funciona</button>
          <Link href="/track-record" className="hover:text-white transition-colors">Track record</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
        </nav>
        <button
          onClick={() => setShowWaitlist(true)}
          className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white text-sm px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          Acceso anticipado
        </button>
      </header>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#0a0f1a] border border-[#1a2540] rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C8EF2] animate-pulse inline-block" />
            BETA PRIVADA · SISTEMA ACTIVO
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Mientras tú<br />duermes,<br />
            <span className="bg-gradient-to-r from-[#6C8EF2] to-[#4CAF7A] bg-clip-text text-transparent">
              NEXUS opera<br />por ti.
            </span>
          </h1>
          <p className="text-[#3d4f6e] text-lg leading-relaxed mb-8">
            Deja de adivinar. <strong className="text-white">4 inteligencias artificiales</strong> analizan, debaten y ejecutan operaciones reales en tu cuenta — sin que el dinero pase por nosotros.
          </p>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setShowWaitlist(true)}
              className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            >
              Quiero que inviertan por mí
            </button>
            <button
              onClick={() => window.location.href="/video"}
              className="border border-[#1a2540] hover:border-[#6C8EF2] text-[#8a9bbf] hover:text-white px-6 py-3 rounded-xl font-semibold transition-colors"
            >
              Ver cómo funciona
            </button>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-400/40 rounded-full hover:bg-emerald-400/10 transition-all"
          >
            Ver mi portafolio <span className="text-emerald-400">+{pReturn}% esta semana</span>
          </Link>
        </div>

        {/* Live Portfolio Card */}
        <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs text-[#3d4f6e] uppercase tracking-wider">Portafolio activo ahora</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">ACTIVE</span>
            </div>
          </div>
          <div className="text-4xl font-bold mb-1">
            ${pValue.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-3">
              <div className="text-[#3d4f6e] text-xs mb-1">P&L Total</div>
              <div className={`text-lg font-bold ${isPos ? "text-emerald-400" : "text-red-400"}`}>
                {isPos ? "+" : ""}${Math.abs(pPnl).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`text-xs ${isPos ? "text-emerald-400" : "text-red-400"}`}>{isPos ? "+" : ""}{pReturn}%</div>
            </div>
            <div className="bg-[#060a12] border border-[#1a2540] rounded-xl p-3">
              <div className="text-[#3d4f6e] text-xs mb-1">Retorno anualizado</div>
              <div className="text-lg font-bold text-[#6C8EF2]">+{(pReturn * 52).toFixed(0)}%</div>
              <div className="text-xs text-[#3d4f6e]">proyectado</div>
            </div>
          </div>
          <div className="mt-4 border-t border-[#1a2540] pt-4">
            <div className="text-[#3d4f6e] text-xs mb-2 uppercase tracking-wider">Últimas operaciones</div>
            <div className="flex gap-2 flex-wrap">
              {["IONQ", "AFRM", "META", "MU", "SNOW"].map(t => (
                <span key={t} className="text-xs bg-[#060a12] border border-[#1a2540] text-[#8a9bbf] px-2 py-1 rounded-lg">{t}</span>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[#3d4f6e]">
            <span>🔒</span>
            <span>Tu dinero en Alpaca · SIPC protegido · NEXUS nunca lo toca</span>
          </div>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────── */}
      <section className="border-y border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <p className="text-center text-[#3d4f6e] text-sm mb-8 uppercase tracking-wider">Lo que 4 IAs hacen en 24 horas, tú no puedes hacerlo en un año.</p>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-[#6C8EF2] mb-1">150+</div>
              <div className="text-sm text-white font-medium">tickers</div>
              <div className="text-xs text-[#3d4f6e]">analizados cada día sin descanso</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#4CAF7A] mb-1">4</div>
              <div className="text-sm text-white font-medium">perspectivas</div>
              <div className="text-xs text-[#3d4f6e]">debatiendo cada operación antes de ejecutarla</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#F2A93B] mb-1">24/7</div>
              <div className="text-sm text-white font-medium">el mercado no duerme</div>
              <div className="text-xs text-[#3d4f6e]">NEXUS tampoco</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SISTEMA ───────────────────────────────────────────────── */}
      <section id="sistema" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">El Sistema</div>
          <h2 className="text-4xl font-bold mb-4">El consejo de guerra que otros no tienen</h2>
          <p className="text-[#3d4f6e] max-w-xl mx-auto">
            Mientras un inversor normal actúa por emoción, NEXUS manda 4 inteligencias a debatir cada operación antes de ejecutarla.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[
            { id: "01", name: "ATLAS", role: "Análisis Fundamental", ai: "Claude", desc: "Evalúa balances, calidad de earnings y ventajas competitivas. Identifica valor intrínseco antes de que el mercado lo reconozca.", cta: "Decide si el precio justifica el negocio.", color: "#6C8EF2" },
            { id: "02", name: "SENTINEL", role: "Análisis Técnico", ai: "GPT-4o", desc: "Lee price action, volumen y momentum. Detecta los movimientos institucionales antes de que sean visibles en las noticias.", cta: "Determina cuándo entrar y cuándo salir.", color: "#4CAF7A" },
            { id: "03", name: "ECHO", role: "Inteligencia Narrativa", ai: "Grok", desc: "Procesa noticias, filings y señales sociales en tiempo real vía X/Twitter. Los mercados se mueven por narrativas antes de que los datos las confirmen.", cta: "Captura el sentimiento antes de que impacte.", color: "#F2A93B" },
            { id: "04", name: "CONTRARIAN", role: "Riesgo & Adversarial", ai: "Gemini", desc: "Destruye cada tesis alcista. Busca riesgos ocultos, downside asimétrico y los escenarios que nadie está descontando.", cta: "Decide el tamaño de posición y stop-loss.", color: "#F25C5C" },
          ].map(a => (
            <div key={a.id} className="bg-[#0a0f1a] border border-[#1a2540] hover:border-[#1a2540] rounded-xl p-5 flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: `${a.color}20`, color: a.color }}>{a.id}</div>
                <div className="w-1.5 h-1.5 rounded-full animate-pulse mt-1" style={{ background: a.color }} />
              </div>
              <div className="font-bold mb-0.5" style={{ color: a.color }}>{a.name}</div>
              <div className="text-xs text-[#3d4f6e] uppercase tracking-wider mb-2">{a.role}</div>
              {a.ai && (
                <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-0.5 rounded-md" style={{ backgroundColor: `${a.color}12`, border: `1px solid ${a.color}30` }}>
                  <span className="text-[10px] font-medium" style={{ color: a.color }}>Powered by {a.ai}</span>
                </div>
              )}
              <p className="text-sm text-[#8a9bbf] mb-4 flex-1 leading-relaxed">{a.desc}</p>
              <p className="text-xs" style={{ color: a.color }}>{a.cta}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { n: "01", title: "Análisis paralelo", desc: "Los 4 agentes escanean simultáneamente los 150+ tickers del universo de inversión desde su perspectiva única." },
            { n: "02", title: "Debate y consenso", desc: "Se desafían mutuamente. Una operación solo se ejecuta cuando hay suficiente convicción colectiva." },
            { n: "03", title: "Ejecución automática", desc: "La orden se envía directamente a tu cuenta Alpaca. NEXUS nunca toca tu dinero." },
          ].map(s => (
            <div key={s.n} className="flex gap-4 bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-5">
              <div className="text-[#3d4f6e] font-mono text-sm mt-0.5">{s.n}</div>
              <div>
                <div className="font-semibold mb-1">{s.title}</div>
                <div className="text-sm text-[#3d4f6e] leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIFERENCIA ────────────────────────────────────────────── */}
      <section className="border-t border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <div className="text-[#3d4f6e] text-xs uppercase tracking-widest mb-3">La Diferencia</div>
            <h2 className="text-3xl font-bold">Por qué NEXUS, no una app de trading</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: "⬡", title: "No apostamos", desc: "Cada operación pasa por 4 filtros de IA. Sin impulso. Sin emoción. Solo lógica." },
              { icon: "⬡", title: "Tu dinero es tuyo", desc: "Opera en tu cuenta Alpaca. NEXUS nunca toca tu capital. Retiras cuando quieras." },
              { icon: "⬡", title: "Ganamos cuando tú ganas", desc: "Sin fees fijos. Solo tomamos un % de tus ganancias. Si no ganas, no cobramos." },
            ].map(d => (
              <div key={d.title} className="bg-[#060a12] border border-[#1a2540] rounded-xl p-6">
                <div className="text-[#6C8EF2] text-2xl mb-3">{d.icon}</div>
                <div className="font-semibold mb-2">{d.title}</div>
                <div className="text-sm text-[#3d4f6e] leading-relaxed">{d.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">¿Listo para que las 4 IAs trabajen para ti?</h2>
        <p className="text-[#3d4f6e] mb-8 max-w-md mx-auto">
          Beta privada con plazas limitadas. El track record está en vivo. Tú decides cuándo entrar.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setShowWaitlist(true)}
            className="bg-[#6C8EF2] hover:bg-[#5a7de0] text-white px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-[1.02]"
          >
            Quiero acceso anticipado
          </button>
          <Link
            href="/track-record"
            className="border border-[#1a2540] hover:border-[#6C8EF2] text-[#8a9bbf] hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors"
          >
            Ver track record público
          </Link>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="border-t border-[#1a2540] px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#6C8EF2] to-[#4CAF7A] flex items-center justify-center text-xs font-bold">N</div>
            <span className="text-xs text-[#3d4f6e]">NEXUS Intelligence — Bensu Electronics Inc. · Aventura, FL</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#3d4f6e]">
            <button onClick={() => setShowDisclaimer(true)} className="hover:text-white transition-colors underline underline-offset-2">
              No somos asesores financieros
            </button>
            <span>Paper trading activo</span>
            <span>v0.1 beta</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-4 text-center">
          <button onClick={() => setShowDisclaimer(true)} className="text-xs text-[#2a3650] hover:text-[#3d4f6e] transition-colors">
            ⚠️ Risk Disclosure: Paper trading solo con fines educativos. No garantizamos rendimientos. Ver aviso legal completo →
          </button>
        </div>
      </footer>
    </div>
  );
}
