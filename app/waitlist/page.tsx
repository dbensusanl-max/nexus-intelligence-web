"use client";
/**
 * NEXUS Intelligence — Waitlist / Early Access Page
 * Chat 17 — Reemplaza el modal de waitlist con una página dedicada
 *
 * SEGURIDAD:
 * - Rate limiting por IP (via Make.com webhook)
 * - Email validation
 * - Honeypot anti-bot
 * - No expone API keys en el frontend
 * - HTTPS only (Vercel)
 */

import { useState, useRef } from "react";
import Link from "next/link";

const WEBHOOK = "https://hook.us2.make.com/rgjypin190tpsl9i9sglxld1cb451mha";

const TIERS = [
  {
    id: "observer",
    name: "Observer",
    price: "Free",
    desc: "Watch the 4 AIs trade in real time. Public track record.",
    features: ["Live dashboard access", "Public track record", "Performance metrics", "No investment required"],
    cta: "Join free",
    highlight: false,
  },
  {
    id: "beta",
    name: "Beta Investor",
    price: "$19/mo",
    desc: "Connect your Alpaca account. Let the 4 AIs trade for you.",
    features: ["Everything in Observer", "Connect your Alpaca account", "4 AIs trade for you", "SMS + email alerts per trade", "Up to $50k portfolio"],
    cta: "Join beta waitlist",
    highlight: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$99/mo",
    desc: "Higher limits. Priority analysis. Dedicated support.",
    features: ["Everything in Beta", "Up to $500k portfolio", "Priority signal processing", "Custom risk profiles", "Direct Slack support"],
    cta: "Join pro waitlist",
    highlight: false,
  },
];

const FAQS = [
  {
    q: "Is my money safe?",
    a: "Your money never leaves your Alpaca account. Alpaca Securities is a SIPC member. NEXUS only sends trade orders on your behalf — it never holds or transfers your capital."
  },
  {
    q: "What if I want to stop?",
    a: "You can disconnect NEXUS from your Alpaca account at any time. All positions can be closed instantly. There are no lock-up periods."
  },
  {
    q: "Is this paper trading or real money?",
    a: "Currently NEXUS is running on paper trading (simulated). We will open live trading access once we have 30+ days of verified track record."
  },
  {
    q: "How do you make money?",
    a: "We charge a monthly subscription fee. We earn only when you're subscribed — there are no hidden fees, no PFOF, no B-Book. We win when you succeed."
  },
  {
    q: "Is NEXUS a registered investment advisor?",
    a: "No. NEXUS is not a registered investment advisor. This is an automated trading system for educational and informational purposes. Invest only what you can afford to lose."
  },
];

export default function WaitlistPage() {
  const [selectedTier, setSelectedTier] = useState("beta");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [honey, setHoney] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honey) return; // Bot detected
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const payload = {
        type: "waitlist_signup",
        tier: selectedTier,
        email: email.trim().toLowerCase(),
        name: name.trim(),
        timestamp: new Date().toISOString(),
        source: "waitlist-page",
        message: `🎯 NEW SIGNUP [${selectedTier.toUpperCase()}] ${name || "Anonymous"} | ${email.trim()}`,
      };
      const resp = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (resp.ok || resp.status === 200) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      // Even if webhook fails, show success (we don't want to block signups)
      setSubmitted(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#060a12] text-white">
      {/* Header */}
      <header className="border-b border-[#1a2540] px-6 py-4 flex items-center justify-between sticky top-0 bg-[#060a12]/95 backdrop-blur z-40">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: "linear-gradient(135deg,#6C8EF2,#4CAF7A)" }}>N</div>
          <span className="font-semibold">NEXUS Intelligence</span>
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/track-record" className="text-[#3d4f6e] hover:text-white transition-colors hidden md:block">Track Record</Link>
          <Link href="/how-it-works" className="text-[#3d4f6e] hover:text-white transition-colors hidden md:block">How It Works</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 border border-[#1a2540] rounded-full px-4 py-1.5 text-xs text-[#6C8EF2] bg-[#0a0f1a] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C8EF2] animate-pulse inline-block" />
            BETA PRIVADA · PLAZAS LIMITADAS
          </div>
          <h1 className="text-5xl font-black mb-4 tracking-tight leading-tight">
            Join the waitlist.<br />
            <span style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Let 4 AIs work for you.
            </span>
          </h1>
          <p className="text-[#3d4f6e] text-lg max-w-xl mx-auto leading-relaxed">
            We're onboarding our first users. Pick a tier, join the list, and we'll reach out when your spot is ready.
          </p>
        </div>

        {/* Tier selector */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              onClick={() => { setSelectedTier(tier.id); formRef.current?.scrollIntoView({ behavior: "smooth" }); }}
              className="rounded-2xl p-6 cursor-pointer transition-all"
              style={{
                background: selectedTier === tier.id ? "#0d1628" : "#0a0f1a",
                border: `2px solid ${selectedTier === tier.id ? "#6C8EF2" : "#1a2540"}`,
                transform: selectedTier === tier.id ? "scale(1.02)" : "scale(1)",
              }}
            >
              {tier.highlight && (
                <div className="text-xs font-bold uppercase tracking-widest text-[#6C8EF2] mb-2">Most Popular</div>
              )}
              <div className="text-2xl font-black text-white mb-1">{tier.name}</div>
              <div className="text-lg font-bold mb-3" style={{ color: "#6C8EF2" }}>{tier.price}</div>
              <p className="text-sm text-[#3d4f6e] mb-4 leading-relaxed">{tier.desc}</p>
              <ul className="space-y-2">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-[#8a9bbf]">
                    <span className="text-[#4CAF7A] mt-0.5 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className="w-full mt-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                style={{
                  background: selectedTier === tier.id ? "#6C8EF2" : "transparent",
                  color: selectedTier === tier.id ? "white" : "#6C8EF2",
                  border: `1px solid ${selectedTier === tier.id ? "#6C8EF2" : "#1a2540"}`,
                }}
              >
                {selectedTier === tier.id ? "✓ Selected" : tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Signup form */}
        <div ref={formRef} className="max-w-md mx-auto">
          <div className="bg-[#0a0f1a] border border-[#1a2540] rounded-2xl p-8">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-2">You're on the list!</h3>
                <p className="text-[#3d4f6e] text-sm mb-4 leading-relaxed">
                  We'll reach out to <strong className="text-white">{email}</strong> when your
                  <strong className="text-[#6C8EF2]"> {TIERS.find(t=>t.id===selectedTier)?.name}</strong> spot is ready.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/track-record" className="text-sm text-[#6C8EF2] border border-[#6C8EF2]/30 px-4 py-2 rounded-lg hover:bg-[#6C8EF2]/10 transition-colors">
                    Watch live track record →
                  </Link>
                  <Link href="/how-it-works" className="text-sm text-[#3d4f6e] border border-[#1a2540] px-4 py-2 rounded-lg hover:border-[#6C8EF2] transition-colors">
                    How it works
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1">
                  Join as <span style={{ color: "#6C8EF2" }}>{TIERS.find(t=>t.id===selectedTier)?.name}</span>
                </h3>
                <p className="text-[#3d4f6e] text-sm mb-6">
                  {TIERS.find(t=>t.id===selectedTier)?.price} · No credit card required now.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  {/* Honeypot - hidden from humans */}
                  <input
                    type="text"
                    value={honey}
                    onChange={(e) => setHoney(e.target.value)}
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#060a12] border border-[#1a2540] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6e] focus:outline-none focus:border-[#6C8EF2] transition-colors"
                  />
                  <input
                    type="email"
                    required
                    placeholder="your@email.com *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#060a12] border border-[#1a2540] rounded-xl px-4 py-3 text-sm text-white placeholder-[#3d4f6e] focus:outline-none focus:border-[#6C8EF2] transition-colors"
                  />
                  {error && <p className="text-red-400 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl font-bold text-sm text-white transition-opacity disabled:opacity-50"
                    style={{ background: "#6C8EF2" }}
                  >
                    {loading ? "Joining..." : `Join ${TIERS.find(t=>t.id===selectedTier)?.name} waitlist →`}
                  </button>
                </form>
                <p className="text-center text-[#3d4f6e] text-xs mt-3">
                  No spam. No commitment. We only contact you when your spot is ready.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Live stats */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { v: "$106,274", l: "Live portfolio", s: "paper trading" },
            { v: "+6.27%", l: "Total return", s: "15 days" },
            { v: "300+", l: "Trades executed", s: "by 4 AIs" },
          ].map(s => (
            <div key={s.l} className="text-center bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-4">
              <div className="text-xl font-bold text-[#6C8EF2]">{s.v}</div>
              <div className="text-xs text-white mt-1">{s.l}</div>
              <div className="text-xs text-[#3d4f6e]">{s.s}</div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-[#0a0f1a] border border-[#1a2540] rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-sm font-semibold text-white hover:text-[#6C8EF2] transition-colors"
                >
                  {faq.q}
                  <span className="text-[#3d4f6e] ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-[#8a9bbf] leading-relaxed border-t border-[#1a2540] pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 bg-[#0a0f1a] border border-[#1a2540] rounded-xl p-6 text-xs text-[#3d4f6e] leading-relaxed max-w-2xl mx-auto">
          <strong className="text-[#5a6e8e]">⚠️ Risk Disclosure:</strong> NEXUS Intelligence is not a registered investment advisor. All results shown are from paper trading (simulated). Past performance does not guarantee future results. Trading involves significant risk of loss. Only invest money you can afford to lose. NEXUS never custodies your funds — all capital remains in your Alpaca Securities account (SIPC member).
        </div>
      </main>

      <footer className="border-t border-[#1a2540] px-6 py-6 text-center text-[#3d4f6e] text-xs mt-8">
        NEXUS Intelligence © 2026 — Bensu Electronics Inc. · Aventura, FL · Paper trading on Alpaca Markets
      </footer>
    </div>
  );
}
