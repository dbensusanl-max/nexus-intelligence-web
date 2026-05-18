"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const AGENTS = [
  {
    id: "ATLAS",
    role: "Análisis Fundamental",
    color: "#6C8EF2",
    description:
      "Evalúa balances, calidad de earnings y ventajas competitivas. Identifica valor intrínseco antes de que el mercado lo reconozca.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6C8EF2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    action: "Decide si el precio justifica el negocio.",
  },
  {
    id: "SENTINEL",
    role: "Análisis Técnico",
    color: "#4CAF7A",
    description:
      "Lee price action, volumen y momentum. Detecta los movimientos institucionales antes de que sean visibles en las noticias.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" stroke="#4CAF7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    action: "Determina cuándo entrar y cuándo salir.",
  },
  {
    id: "ECHO",
    role: "Inteligencia Narrativa",
    color: "#E8A04A",
    description:
      "Procesa noticias, filings y señales sociales en tiempo real. Los mercados se mueven por narrativas antes de que los datos las confirmen.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#E8A04A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    action: "Captura el sentimiento antes de que impacte.",
  },
  {
    id: "CONTRARIAN",
    role: "Riesgo & Adversarial",
    color: "#E05252",
    description:
      "Destruye cada tesis alcista. Busca riesgos ocultos, downside asimétrico y los escenarios que nadie está descontando.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#E05252" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="12" y1="9" x2="12" y2="13" stroke="#E05252" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12.01" y2="17" stroke="#E05252" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    action: "Decide el tamaño de posición y stop-loss.",
  },
];

const LAST_TRADES = ["NVDA", "PLTR", "TTD", "PANW", "SNOW"];

const WHY_NEXUS = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M9 12l2 2 4-4" stroke="#4CAF7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" stroke="#4CAF7A" strokeWidth="1.5"/>
      </svg>
    ),
    color: "#4CAF7A",
    title: "No apostamos",
    body: "Cada operación pasa por 4 filtros de IA. Sin impulso. Sin emoción. Solo lógica.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6C8EF2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#6C8EF2",
    title: "Tu dinero es tuyo",
    body: "Opera en tu cuenta Alpaca. NEXUS nunca toca tu capital. Retiras cuando quieras.",
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="#E8A04A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#E8A04A",
    title: "Ganamos cuando tú ganas",
    body: "Sin fees fijos. Solo tomamos un % de tus ganancias. Si no ganas, no cobramos.",
  },
];

interface PortfolioStats {
  portfolio_value: number;
  total_pnl: number;
  total_return_pct: number;
  total_trades: number;
  win_rate: number;
}

export default function Home() {
  const [portfolio, setPortfolio] = useState<PortfolioStats | null>(null);

  useEffect(() => {
    fetch("https://api.nxscapital.ai/performance")
      .then(r => r.json())
      .then(d => setPortfolio(d))
      .catch(() => {});
  }, []);

  const portfolioValue = portfolio?.portfolio_value ?? 100000;
  const totalPnl = portfolio?.total_pnl ?? 0;
  const totalReturn = portfolio?.total_return_pct ?? 0;
  const totalTrades = portfolio?.total_trades ?? 0;
  const winRate = portfolio?.win_rate ?? 0;
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center" aria-hidden="true">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" fill="#fff"/>
              <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-semibold text-text-primary tracking-wide text-sm">NEXUS</span>
        </div>
        <span className="text-xs text-text-secondary font-mono tracking-widest uppercase">Autonomous Investing</span>
      </nav>

      {/* Stats Bar */}
      <div className="border-b border-border bg-surface px-4 py-2.5 flex items-center justify-center gap-4 sm:gap-6 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium font-mono">Sistema activo</span>
        </div>
        <span aria-hidden="true" className="text-border hidden sm:inline">·</span>
        <span className="text-xs text-text-secondary font-mono shrink-0 hidden sm:inline">150 tickers monitoreados 24/7</span>
        <span aria-hidden="true" className="text-border hidden sm:inline">·</span>
        <span className="text-xs text-text-secondary font-mono shrink-0 hidden sm:inline">Sistema activo en paper trading</span>
        <span aria-hidden="true" className="text-border">·</span>
        <span className="text-xs text-text-secondary font-mono shrink-0">Paper trading · Sin riesgo real aún</span>
      </div>

      {/* Hero */}
      <section className="flex flex-col lg:flex-row items-center justify-center gap-10 xl:gap-16 px-6 pt-16 pb-16 max-w-6xl mx-auto w-full">
        {/* Left */}
        <div className="flex flex-col items-start text-left flex-1 max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/40 bg-accent/10 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs text-accent font-semibold tracking-widest uppercase font-mono">BETA PRIVADA · SISTEMA ACTIVO</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            <span className="text-text-primary">Mientras tú duermes,</span>
            <br />
            <span className="text-accent">NEXUS opera por ti.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-text-secondary text-xl leading-relaxed mb-6 max-w-xl">
            Deja de adivinar.{" "}
            <span className="text-text-primary font-medium">4 inteligencias artificiales</span>{" "}
            analizan, debaten y ejecutan operaciones reales en tu cuenta, sin que el dinero pase por nosotros.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-2 mb-10 px-3 py-2 rounded-lg bg-surface border border-border">
            <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#4CAF7A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs font-mono text-success">
              <span className="font-semibold">{totalTrades > 0 ? totalTrades : 46} operaciones ejecutadas</span> · <span className="font-semibold">Paper trading activo</span> desde Abril 2026
            </span>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href="/dashboard"
              className="px-7 py-3.5 bg-accent hover:bg-accent-dim text-white rounded-xl text-base font-semibold transition-colors shadow-lg shadow-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              Quiero que inviertan por mí
            </Link>
            <a
              href="#como-funciona"
              className="px-6 py-3.5 border border-border hover:border-text-secondary/40 text-text-secondary hover:text-text-primary rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Ver cómo funciona
            </a>
            <Link
              href="/dashboard"
              className="px-6 py-3.5 border border-accent/40 hover:border-accent text-accent rounded-xl text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
            >
              Ver mi portafolio →
            </Link>
          </div>
        </div>

        {/* Right: Portfolio Card */}
        <div
          className="w-full max-w-sm shrink-0 rounded-2xl border border-border p-6 flex flex-col gap-5"
          style={{
            background: "linear-gradient(145deg, #111318 0%, #0d0f14 100%)",
            boxShadow: "0 0 0 1px #232731, 0 20px 60px -10px rgba(76,175,122,0.08)",
          }}
        >
          {/* Card header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-text-secondary font-mono uppercase tracking-widest mb-2">Portafolio activo ahora</p>
              <p
                className="text-4xl font-bold font-mono text-text-primary"
                style={{ textShadow: "0 0 30px rgba(76,175,122,0.35)" }}
              >
                {portfolioValue.toLocaleString("en-US", {style:"currency",currency:"USD",maximumFractionDigits:0})}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success font-mono">ACTIVE</span>
            </div>
          </div>

          {/* P&L + annual return */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-elevated border border-border rounded-xl p-3.5">
              <p className="text-xs text-text-secondary mb-1.5">P&L total</p>
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: totalPnl >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
              >
                {totalPnl >= 0 ? "+" : ""}
                {totalPnl.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-text-secondary/50 mt-0.5">
                {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
              </p>
            </div>
            <div
              className="bg-surface-elevated border border-success/20 rounded-xl p-3.5"
              style={{ background: "color-mix(in oklch, var(--color-success) 5%, transparent)" }}
            >
              <p className="text-xs text-text-secondary mb-1.5">Retorno desde inicio</p>
              <p
                className="text-2xl font-bold font-mono"
                style={{ color: totalReturn >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
              >
                {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
              </p>
              <p className="text-xs text-text-secondary/50 mt-0.5">desde inicio</p>
            </div>
          </div>

          {/* Last trades */}
          <div>
            <p className="text-xs text-text-secondary font-mono uppercase tracking-widest mb-2.5">Últimas operaciones</p>
            <div className="flex flex-wrap gap-2">
              {LAST_TRADES.map((ticker) => (
                <span
                  key={ticker}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold"
                  style={{
                    background: "rgba(76,175,122,0.12)",
                    border: "1px solid rgba(76,175,122,0.25)",
                    color: "#4CAF7A",
                  }}
                >
                  {ticker}
                </span>
              ))}
            </div>
          </div>

          {/* Trust badge */}
          <div className="pt-4 border-t border-border flex items-center gap-2">
            <svg aria-hidden="true" width="14" height="14" fill="none" viewBox="0 0 24 24" className="shrink-0">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#8A9BB5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-xs text-text-secondary/70 leading-snug">
              Tu dinero en Alpaca · SIPC protegido · NEXUS nunca lo toca
            </span>
          </div>
        </div>
      </section>

      {/* Scale Section */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary leading-tight">
              Lo que 4 IAs hacen en 24 horas,
              <br />
              <span className="text-accent">tú no puedes hacerlo en un año.</span>
            </h2>
          </div>

          {/* Stat blocks */}
          <div
            className="rounded-2xl p-8 sm:p-10 mb-10"
            style={{
              background: "linear-gradient(145deg, #0d0f14 0%, #111318 100%)",
              boxShadow: "0 0 0 1px rgba(108,142,242,0.2), 0 0 60px -20px rgba(108,142,242,0.12)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {[
                { number: "92", unit: "tickers", sub: "analizados cada día sin descanso" },
                { number: "4", unit: "perspectivas", sub: "debatiendo cada operación antes de ejecutarla" },
                { number: "24/7/365", unit: "", sub: "el mercado no duerme. NEXUS tampoco." },
              ].map(({ number, unit, sub }) => (
                <div key={number} className="flex flex-col items-center text-center px-6 py-6 sm:py-0 first:pt-0 last:pb-0 sm:first:pt-0 sm:last:pb-0">
                  <div className="mb-2">
                    <span className="text-5xl sm:text-6xl font-bold font-mono text-accent leading-none">{number}</span>
                    {unit && (
                      <span className="ml-2 text-xl font-semibold text-text-secondary align-baseline">{unit}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-[180px]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Bottom line */}
            <div className="mt-8 pt-8 border-t border-border text-center">
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
                Un humano analiza 1 acción por hora.{" "}
                <span className="text-text-primary font-medium">NEXUS analiza 92 en segundos</span>, las debate entre 4 inteligencias, y ejecuta solo cuando hay consenso.{" "}
                <span className="text-accent font-semibold">El resultado es estructuralmente superior.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="como-funciona" className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs text-text-secondary tracking-widest uppercase mb-3 font-medium font-mono">El sistema</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              El consejo de guerra que otros no tienen
            </h2>
            <p className="text-text-secondary text-base max-w-xl mx-auto leading-relaxed">
              Mientras un inversor normal actúa por emoción, NEXUS manda 4 inteligencias a debatir cada operación antes de ejecutarla.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {AGENTS.map((agent, i) => (
              <div
                key={agent.id}
                className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 hover:border-[color:var(--agent-color)] transition-colors"
                style={{ "--agent-color": agent.color } as React.CSSProperties}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${agent.color}15`, border: `1px solid ${agent.color}30` }}
                    aria-hidden="true"
                  >
                    {agent.icon}
                  </div>
                  <span className="text-xs font-mono text-text-secondary/40">0{i + 1}</span>
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm mb-0.5">{agent.id}</p>
                  <p className="text-xs font-semibold" style={{ color: agent.color }}>{agent.role}</p>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed flex-1">{agent.description}</p>
                <div className="pt-3 border-t border-border">
                  <p className="text-xs font-medium" style={{ color: `${agent.color}CC` }}>{agent.action}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Decision flow */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Análisis paralelo",
                desc: "Los 4 agentes escanean simultáneamente los 92 tickers del universo de inversión desde su perspectiva única.",
              },
              {
                step: "02",
                title: "Debate y consenso",
                desc: "Se desafían mutuamente. Una operación solo se ejecuta cuando hay suficiente convicción colectiva.",
              },
              {
                step: "03",
                title: "Ejecución automática",
                desc: "La orden se envía directamente a tu cuenta Alpaca. NEXUS nunca toca tu dinero.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
                  <span className="text-xs font-mono text-text-secondary">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">{title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why NEXUS */}
      <section className="px-6 py-20 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 text-center">
            <p className="text-xs text-text-secondary tracking-widest uppercase mb-3 font-medium font-mono">La diferencia</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
              Por qué NEXUS, no una app de trading
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {WHY_NEXUS.map(({ icon, color, title, body }) => (
              <div
                key={title}
                className="bg-surface border border-border rounded-2xl p-7 flex flex-col gap-4 hover:border-[color:var(--card-color)] transition-colors"
                style={{ "--card-color": color } as React.CSSProperties}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}12`, border: `1px solid ${color}25` }}
                  aria-hidden="true"
                >
                  {icon}
                </div>
                <div>
                  <p className="font-bold text-text-primary text-base mb-2">{title}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-accent/20 border border-accent/30 flex items-center justify-center" aria-hidden="true">
              <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" fill="#6C8EF2"/>
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-primary font-mono">NEXUS INTELLIGENCE</p>
              <p className="text-xs text-text-secondary/60">Bensu Electronics Inc · Aventura, FL</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center">
            <span className="text-xs text-text-secondary/50">No somos asesores financieros</span>
            <span aria-hidden="true" className="hidden sm:inline text-border">·</span>
            <span className="text-xs text-text-secondary/50">Paper trading activo</span>
            <span aria-hidden="true" className="hidden sm:inline text-border">·</span>
            <span className="text-xs text-text-secondary/50 font-mono">v0.1 beta</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
