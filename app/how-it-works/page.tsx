"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const AGENTS = [
  { name: "ATLAS", model: "Claude · Anthropic", role: "Fundamental Hunter", desc: "Finds stocks with real earnings catalysts, guidance raises, and institutional accumulation before the market prices them in. Penalizes hype without substance.", color: "#6C8EF2" },
  { name: "SENTINEL", model: "GPT-4o · OpenAI", role: "Technical Breakout", desc: "Reads price action, volume surges, and institutional momentum. Identifies breakouts and 52-week highs before they appear on financial news.", color: "#4CAF7A" },
  { name: "ECHO", model: "Grok · xAI", role: "Real-Time Intelligence", desc: "Monitors X/Twitter, Reddit, and breaking news in real time via Grok's live feed. Markets move on narrative before data confirms it. ECHO is first.", color: "#F2A93B" },
  { name: "CONTRARIAN", model: "Gemini · Google", role: "Risk Destroyer", desc: "Actively tries to kill every trade thesis. Finds hidden risks, asymmetric downside, and worst-case scenarios nobody else is pricing in.", color: "#F25C5C" },
];

const STEPS = [
  { n: "01", time: "8:00 PM EST", tag: "Night Scan", title: "150+ stocks analyzed while you sleep", body: "Every night, NEXUS scans 150+ tickers — semiconductors, AI, biotech, crypto, fintech. Four intelligence systems rank every stock by expected move tomorrow.", note: "No human reviews these. Pure signal.", color: "#6C8EF2" },
  { n: "02", time: "9:00 AM EST", tag: "Morning Hunt", title: "4 AIs debate what moves TODAY", body: "Before market open, each agent analyzes the top candidates with fresh data. Earnings catalysts. Technical setups. Social momentum. Hidden risks.", note: "They disagree. That disagreement is the signal.", color: "#4CAF7A" },
  { n: "03", time: "9:30 AM EST", tag: "Consensus", title: "Only high-conviction signals execute", body: "A trade only happens when agents agree. Conviction score must exceed 68/100. Risk score must stay below 60. One agent's strong doubt can block the trade.", note: "Most stocks get HOLD. The few that don't — those are your trades.", color: "#F2A93B" },
  { n: "04", time: "Every 15 min", tag: "Protection", title: "Continuous monitoring and protection", body: "Every 15 minutes, NEXUS re-evaluates every open position. Stop losses execute at -4%. Winners are held. Weak positions rotate out. New signals rotate in.", note: "NEXUS never goes on vacation.", color: "#F25C5C" },
  { n: "05", time: "Always", tag: "Custody", title: "Your money never leaves your account", body: "Every order routes directly to your personal Alpaca account. NEXUS never holds, touches, or moves your capital. You can withdraw at any moment.", note: "Your money. Your account. NEXUS just operates it.", color: "#6C8EF2" },
];

function useVisible(ref: React.RefObject<HTMLElement>, threshold = 0.2) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return v;
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const v = useVisible(ref as React.RefObject<HTMLElement>);
  return (
    <div ref={ref} className={className} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(32px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

export default function HowItWorks() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-[#060a12] text-white" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between" style={{ background: scrolled ? "rgba(6,10,18,0.96)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid #1a2540" : "none", transition: "all 0.3s" }}>
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg,#6C8EF2,#4CAF7A)" }}>N</div>
          <span className="font-semibold">NEXUS Intelligence</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/track-record" className="text-sm text-[#3d4f6e] hover:text-white transition-colors hidden md:block">Track Record</Link>
          <Link href="/" className="text-sm text-white px-4 py-2 rounded-lg font-semibold transition-colors" style={{ background: "#6C8EF2" }}>Get Access</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(#1a254018 1px,transparent 1px),linear-gradient(90deg,#1a254018 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%,#6C8EF212,transparent)" }} />
        <div className="relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-xs mb-8" style={{ borderColor: "#1a2540", color: "#6C8EF2", background: "#0a0f1a" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C8EF2] animate-pulse inline-block" />
            Four AIs. One Portfolio. Zero Emotion.
          </div>
          <h1 className="text-7xl md:text-8xl font-black leading-none mb-6 tracking-tight">
            How{" "}
            <span style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NEXUS</span>
            <br />works.
          </h1>
          <p className="text-xl text-[#3d4f6e] max-w-2xl mx-auto leading-relaxed mb-16">
            While you live your life, four AI systems argue about the market — then execute only when they reach consensus.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-16">
            {[{ v: "+7.3%", l: "Live return", s: "since April 2026" }, { v: "4", l: "AI agents", s: "always running" }, { v: "150+", l: "Stocks scanned", s: "every night" }].map(s => (
              <div key={s.l} className="rounded-xl p-4 border border-[#1a2540] bg-[#0a0f1a]">
                <div className="text-2xl font-bold text-[#6C8EF2]">{s.v}</div>
                <div className="text-xs text-white font-medium mt-1">{s.l}</div>
                <div className="text-xs text-[#3d4f6e]">{s.s}</div>
              </div>
            ))}
          </div>
          <div className="text-[#3d4f6e] text-sm animate-bounce">scroll to understand ↓</div>
        </div>
      </section>

      {/* ── THE COUNCIL ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <FadeIn className="text-center mb-16">
          <div className="text-xs text-[#3d4f6e] uppercase tracking-widest mb-4">The War Council</div>
          <h2 className="text-4xl font-bold mb-4">Four minds. <span style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>One verdict.</span></h2>
          <p className="text-[#3d4f6e] max-w-xl mx-auto">Each agent sees the market differently. They debate. They challenge each other. A trade only executes when their combined conviction clears 68/100.</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {AGENTS.map((a, i) => (
            <FadeIn key={a.name} delay={i * 0.1} className="rounded-2xl p-6 border border-[#1a2540] bg-[#0a0f1a]">
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-black" style={{ color: a.color }}>{a.name}</div>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: a.color }} />
              </div>
              <div className="text-xs text-[#3d4f6e] uppercase tracking-widest mb-1">{a.model}</div>
              <div className="text-sm font-semibold text-white mb-3">{a.role}</div>
              <p className="text-sm text-[#8a9bbf] leading-relaxed">{a.desc}</p>
            </FadeIn>
          ))}
        </div>

        {/* Live consensus example */}
        <FadeIn>
          <div className="rounded-2xl p-8 border border-[#1a2540] bg-[#0a0f1a]">
            <div className="text-center mb-6">
              <div className="text-xs text-[#3d4f6e] uppercase tracking-widest mb-1">Live Example — PLTR Analysis</div>
              <div className="text-white font-semibold">3 of 4 agents agree → Order executes</div>
            </div>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[{ n:"ATLAS",s:78,v:"BUY",c:"#6C8EF2"},{n:"SENTINEL",s:74,v:"BUY",c:"#4CAF7A"},{n:"ECHO",s:81,v:"BUY",c:"#F2A93B"},{n:"CONTRARIAN",s:42,v:"HOLD",c:"#F25C5C"}].map(a => (
                <div key={a.n} className="rounded-xl p-4 text-center bg-[#060a12] border border-[#1a2540]">
                  <div className="text-xs font-bold mb-2" style={{ color: a.c }}>{a.n}</div>
                  <div className="text-3xl font-black mb-1" style={{ color: a.s >= 68 ? "#4CAF7A" : "#F25C5C" }}>{a.s}</div>
                  <div className="text-xs font-bold px-2 py-0.5 rounded" style={{ color: a.v === "BUY" ? "#4CAF7A" : "#F2A93B", background: a.v === "BUY" ? "#4CAF7A15" : "#F2A93B15" }}>{a.v}</div>
                </div>
              ))}
            </div>
            <div className="text-center text-sm text-[#3d4f6e]">Avg conviction: <span className="text-[#4CAF7A] font-bold">76/100</span> · Risk: <span className="text-[#4CAF7A] font-bold">38/100</span> · <span className="text-white font-semibold">ORDER EXECUTES</span></div>
          </div>
        </FadeIn>
      </section>

      {/* ── TIMELINE ── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <FadeIn className="text-center mb-16">
          <div className="text-xs text-[#3d4f6e] uppercase tracking-widest mb-4">Daily Cycle</div>
          <h2 className="text-4xl font-bold">What happens <span style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>every day</span></h2>
        </FadeIn>
        <div>
          {STEPS.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05} className="flex gap-6 mb-0">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ borderColor: s.color, color: s.color, background: `${s.color}15` }}>{s.n}</div>
                {i < STEPS.length - 1 && <div className="w-px flex-1 min-h-12 mt-2" style={{ background: `linear-gradient(${s.color}60,transparent)` }} />}
              </div>
              <div className="pb-12 flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ color: s.color, background: `${s.color}15` }}>{s.time}</span>
                  <span className="text-xs text-[#3d4f6e]">{s.tag}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-[#8a9bbf] text-sm leading-relaxed mb-2">{s.body}</p>
                <p className="text-xs italic" style={{ color: s.color }}>{s.note}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── VS ── */}
      <section className="border-y border-[#1a2540] bg-[#0a0f1a]">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl font-bold">Not like anything you've used before.</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { vs: "vs Robinhood", bad: "You trade based on emotion. They profit from your order flow (PFOF).", good: "NEXUS trades for you with zero emotion. We only earn when you earn." },
              { vs: "vs eToro Copy Trading", bad: "You copy humans. Humans have fear, greed, and sleep schedules.", good: "You deploy four AIs. They have no bias, no sleep, no self-interest." },
              { vs: "vs Betterment", bad: "Passive ETF allocation. 7% on a great decade. Nothing else.", good: "Active AI intelligence. Every market day. Every opportunity." },
            ].map((c, i) => (
              <FadeIn key={c.vs} delay={i * 0.1} className="rounded-xl p-6 border border-[#1a2540] bg-[#060a12]">
                <div className="text-xs text-[#3d4f6e] uppercase tracking-widest mb-3">{c.vs}</div>
                <p className="text-sm text-[#F25C5C] mb-3 leading-relaxed">{c.bad}</p>
                <p className="text-sm text-[#4CAF7A] leading-relaxed">{c.good}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-6 py-28 text-center">
        <FadeIn>
          <h2 className="text-5xl font-black mb-5 leading-tight">
            Ready to let 4 AIs<br />
            <span style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>work for you?</span>
          </h2>
          <p className="text-[#3d4f6e] text-lg mb-10 max-w-md mx-auto">The track record is public. The system is live 24/7. Private beta — limited spots.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/" className="text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:opacity-90" style={{ background: "#6C8EF2" }}>Request early access →</Link>
            <Link href="/track-record" className="border border-[#1a2540] text-[#8a9bbf] hover:text-white px-8 py-4 rounded-xl font-semibold text-base transition-colors">See live track record</Link>
          </div>
          <p className="text-xs text-[#3d4f6e]">Paper trading only · Not financial advice · Past performance does not guarantee future results</p>
        </FadeIn>
      </section>

      <footer className="border-t border-[#1a2540] px-6 py-6 text-center text-xs text-[#3d4f6e]">
        NEXUS Intelligence © 2026 — Bensu Electronics Inc. · Aventura, FL
      </footer>
    </div>
  );
}
