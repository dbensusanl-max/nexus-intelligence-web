"use client";
/**
 * NEXUS Intelligence — Cinematic Video Explainer
 * Chat 17 — Full animated explainer, no external video needed
 * Plays like a movie trailer with voice-over text
 */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

const SCENES = [
  {
    id: 1,
    duration: 4000,
    headline: "Every day,\nmillions of people\ngamble their savings.",
    sub: "On apps designed to make them lose.",
    color: "#FF3B30",
    bg: "radial-gradient(ellipse at 50% 50%, #1a0505 0%, #060a12 100%)",
    accent: "#FF3B30",
  },
  {
    id: 2,
    duration: 4000,
    headline: "Robinhood\nsells your orders\nto hedge funds.",
    sub: "eToro profits when you lose. DraftKings is built on your failures.",
    color: "#FF9500",
    bg: "radial-gradient(ellipse at 50% 50%, #1a0e00 0%, #060a12 100%)",
    accent: "#FF9500",
  },
  {
    id: 3,
    duration: 3500,
    headline: "There's a better way.",
    sub: "",
    color: "#FFFFFF",
    bg: "radial-gradient(ellipse at 50% 50%, #0a0f1a 0%, #060a12 100%)",
    accent: "#6C8EF2",
    big: true,
  },
  {
    id: 4,
    duration: 4500,
    headline: "4 artificial\nintelligences.\nFighting for you.",
    sub: "Not against you.",
    color: "#6C8EF2",
    bg: "radial-gradient(ellipse at 30% 70%, #0d1628 0%, #060a12 100%)",
    accent: "#6C8EF2",
  },
  {
    id: 5,
    duration: 4000,
    headline: "ATLAS hunts\nearnings catalysts\nbefore the market sees them.",
    sub: "Powered by Claude · Anthropic",
    color: "#6C8EF2",
    bg: "radial-gradient(ellipse at 70% 30%, #0a1020 0%, #060a12 100%)",
    accent: "#6C8EF2",
    agent: "ATLAS",
  },
  {
    id: 6,
    duration: 4000,
    headline: "SENTINEL reads\nthe tape.\nBreakouts. Volume. Momentum.",
    sub: "Powered by GPT-4o · OpenAI",
    color: "#4CAF7A",
    bg: "radial-gradient(ellipse at 30% 30%, #051a0e 0%, #060a12 100%)",
    accent: "#4CAF7A",
    agent: "SENTINEL",
  },
  {
    id: 7,
    duration: 4000,
    headline: "ECHO monitors\nX/Twitter in real time.\n24 hours. Non-stop.",
    sub: "Powered by Grok · xAI",
    color: "#F2A93B",
    bg: "radial-gradient(ellipse at 70% 70%, #1a1000 0%, #060a12 100%)",
    accent: "#F2A93B",
    agent: "ECHO",
  },
  {
    id: 8,
    duration: 4000,
    headline: "CONTRARIAN\ndestroys every thesis.\nTo find what survives.",
    sub: "Powered by Gemini · Google",
    color: "#F25C5C",
    bg: "radial-gradient(ellipse at 50% 80%, #1a0505 0%, #060a12 100%)",
    accent: "#F25C5C",
    agent: "CONTRARIAN",
  },
  {
    id: 9,
    duration: 5000,
    headline: "They argue.\nThey challenge.\nOnly consensus executes.",
    sub: "Conviction must reach 68/100. Risk must stay below 60.",
    color: "#FFFFFF",
    bg: "radial-gradient(ellipse at 50% 50%, #0d1628 0%, #060a12 100%)",
    accent: "#6C8EF2",
  },
  {
    id: 10,
    duration: 4500,
    headline: "Your money\nnever leaves\nyour account.",
    sub: "Alpaca Securities · SIPC insured · You withdraw anytime.",
    color: "#4CAF7A",
    bg: "radial-gradient(ellipse at 50% 20%, #051a0e 0%, #060a12 100%)",
    accent: "#4CAF7A",
  },
  {
    id: 11,
    duration: 5000,
    headline: "$107,352\nfrom $100,000.\nIn 15 days.",
    sub: "+7.35% while the S&P fell -2.24% in one day.",
    color: "#4CAF7A",
    bg: "radial-gradient(ellipse at 50% 50%, #051a10 0%, #060a12 100%)",
    accent: "#4CAF7A",
    big: true,
  },
  {
    id: 12,
    duration: 6000,
    headline: "NEXUS\nIntelligence.",
    sub: "4 AIs working for you. Not against you.",
    color: "#6C8EF2",
    bg: "radial-gradient(ellipse at 50% 50%, #0d1628 0%, #060a12 100%)",
    accent: "#6C8EF2",
    final: true,
  },
];

export default function NexusVideo() {
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scene = SCENES[currentScene];

  const startScene = (idx: number) => {
    if (idx >= SCENES.length) {
      setFinished(true);
      setPlaying(false);
      return;
    }
    setCurrentScene(idx);
    setTextVisible(false);
    setProgress(0);
    setTimeout(() => setTextVisible(true), 200);

    const sc = SCENES[idx];
    const startTime = Date.now();
    if (progressRef.current) clearInterval(progressRef.current);
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / sc.duration) * 100);
      setProgress(pct);
      if (pct >= 100 && progressRef.current) clearInterval(progressRef.current);
    }, 50);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => startScene(idx + 1), sc.duration);
  };

  const play = () => {
    setPlaying(true);
    setFinished(false);
    startScene(0);
  };

  const restart = () => {
    setFinished(false);
    setPlaying(true);
    startScene(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060a12] flex flex-col items-center justify-center px-4 py-16">

      {/* Video container */}
      <div className="w-full max-w-4xl">

        {/* Screen */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "16/9",
            background: playing || finished ? scene?.bg || "#060a12" : "#0a0f1a",
            transition: "background 0.8s ease",
            border: "1px solid #1a2540",
          }}
        >
          {/* Scanlines effect */}
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
            }}
          />

          {/* Grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#1a254010 1px,transparent 1px),linear-gradient(90deg,#1a254010 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Play screen */}
          {!playing && !finished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-6 cursor-pointer"
                style={{ background: "#6C8EF2", boxShadow: "0 0 40px #6C8EF240" }}
                onClick={play}
              >
                <div style={{ borderLeft: "20px solid white", borderTop: "12px solid transparent", borderBottom: "12px solid transparent", marginLeft: "4px" }} />
              </div>
              <div className="text-white text-lg font-bold mb-2">Watch NEXUS in action</div>
              <div className="text-[#3d4f6e] text-sm">2 minutes · No sound needed</div>
            </div>
          )}

          {/* Scene content */}
          {playing && !finished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8 md:px-16">

              {/* Agent badge */}
              {scene.agent && (
                <div
                  className="mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
                  style={{
                    color: scene.accent,
                    background: `${scene.accent}15`,
                    border: `1px solid ${scene.accent}40`,
                    opacity: textVisible ? 1 : 0,
                    transition: "opacity 0.5s ease 0.2s",
                  }}
                >
                  {scene.agent}
                </div>
              )}

              {/* Main text */}
              <div
                className="text-center mb-6"
                style={{
                  opacity: textVisible ? 1 : 0,
                  transform: textVisible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                <h2
                  className="font-black leading-tight mb-4 whitespace-pre-line"
                  style={{
                    fontSize: scene.big ? "clamp(2.5rem, 6vw, 4.5rem)" : "clamp(1.8rem, 4vw, 3rem)",
                    color: scene.color,
                    textShadow: `0 0 60px ${scene.accent}40`,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {scene.headline}
                </h2>
                {scene.sub && (
                  <p
                    className="text-[#8a9bbf] text-sm md:text-base max-w-lg mx-auto leading-relaxed"
                    style={{
                      opacity: textVisible ? 1 : 0,
                      transition: "opacity 0.6s ease 0.4s",
                    }}
                  >
                    {scene.sub}
                  </p>
                )}
              </div>

              {/* Scene number */}
              <div className="absolute bottom-6 right-6 text-xs text-[#3d4f6e] font-mono">
                {currentScene + 1} / {SCENES.length}
              </div>

              {/* Accent line */}
              <div
                className="absolute bottom-0 left-0 h-0.5 transition-all duration-300"
                style={{ width: `${progress}%`, background: scene.accent }}
              />
            </div>
          )}

          {/* Final screen */}
          {finished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 px-8">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black mb-6"
                style={{ background: "linear-gradient(135deg,#6C8EF2,#4CAF7A)" }}
              >
                N
              </div>
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">NEXUS Intelligence</h2>
              <p className="text-[#3d4f6e] text-base mb-8 text-center max-w-sm">
                4 AIs working for you. Your money. Your account. We earn only when you earn.
              </p>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "#6C8EF2" }}
                >
                  Request access →
                </Link>
                <button
                  onClick={restart}
                  className="px-6 py-3 rounded-xl font-semibold text-sm text-[#8a9bbf] border border-[#1a2540] hover:border-[#6C8EF2] transition-colors"
                >
                  Watch again
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "linear-gradient(90deg,#6C8EF2,#4CAF7A)" }} />
            </div>
          )}
        </div>

        {/* Scene dots */}
        {playing && (
          <div className="flex items-center justify-center gap-1.5 mt-4">
            {SCENES.map((s, i) => (
              <div
                key={s.id}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === currentScene ? "20px" : "6px",
                  height: "6px",
                  background: i === currentScene ? scene.accent : "#1a2540",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="mt-8 text-center max-w-xl">
        <p className="text-[#3d4f6e] text-sm">
          Paper trading only · Not financial advice ·
          Past performance does not guarantee future results
        </p>
      </div>
    </div>
  );
}
