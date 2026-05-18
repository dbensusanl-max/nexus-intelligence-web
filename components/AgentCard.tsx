interface AgentOutput {
  agent: string;
  stance: string;
  conviction: number;
  summary: string;
  key_points?: string[];
  bull_case?: string;
  bear_case?: string;
}

const AGENT_META: Record<
  string,
  { role: string; color: string; bgColor: string }
> = {
  ATLAS: {
    role: "Fundamental Analysis",
    color: "#6C8EF2",
    bgColor: "#6C8EF210",
  },
  SENTINEL: {
    role: "Technical Analysis",
    color: "#4CAF7A",
    bgColor: "#4CAF7A10",
  },
  ECHO: {
    role: "Narrative Intelligence",
    color: "#E8A04A",
    bgColor: "#E8A04A10",
  },
  CONTRARIAN: {
    role: "Risk & Adversarial",
    color: "#E05252",
    bgColor: "#E0525210",
  },
};

const STANCE_CONFIG = {
  bullish: { label: "BULLISH", colorClass: "text-success",          bgClass: "bg-success/10"          },
  bearish: { label: "BEARISH", colorClass: "text-danger",           bgClass: "bg-danger/10"           },
  neutral: { label: "NEUTRAL", colorClass: "text-text-secondary",   bgClass: "bg-text-secondary/10"   },
};

export default function AgentCard({ data }: { data: AgentOutput }) {
  const meta = AGENT_META[data.agent] ?? {
    role: data.agent,
    color: "#6C8EF2",
    bgColor: "#6C8EF210",
  };
  const stance = STANCE_CONFIG[data.stance.toLowerCase() as keyof typeof STANCE_CONFIG] ?? STANCE_CONFIG.neutral;

  const barWidth = `${Math.max(0, Math.min(100, data.conviction))}%`;

  return (
    <div
      className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col"
      style={{ borderTopColor: meta.color, borderTopWidth: "2px" }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
            style={{ backgroundColor: meta.bgColor, color: meta.color, border: `1px solid ${meta.color}30` }}
          >
            {data.agent.slice(0, 2)}
          </div>
          <div>
            <p className="font-semibold text-text-primary text-sm">{data.agent}</p>
            <p className="text-xs mt-0.5" style={{ color: meta.color }}>
              {meta.role}
            </p>
          </div>
        </div>
        <div
          className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wider shrink-0 ${stance.colorClass} ${stance.bgClass}`}
        >
          {stance.label}
        </div>
      </div>

      {/* Conviction bar */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-secondary tracking-wider">CONVICTION</span>
          <span className="text-xs font-mono font-semibold" style={{ color: meta.color }}>
            {data.conviction}%
          </span>
        </div>
        <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-[width] duration-700"
            style={{ width: barWidth, backgroundColor: meta.color, boxShadow: `0 0 6px ${meta.color}60` }}
          />
        </div>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
        {/* Summary */}
        <p className="text-sm text-text-secondary leading-relaxed">{data.summary}</p>

        {/* Key points */}
        {data.key_points && data.key_points.length > 0 && (
          <div>
            <p className="text-xs text-text-secondary/60 uppercase tracking-widest mb-2 font-medium">
              Key Points
            </p>
            <ul className="flex flex-col gap-1.5">
              {data.key_points.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                  <span
                    className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bull / Bear case */}
        {(data.bull_case || data.bear_case) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto pt-2">
            {data.bull_case && (
              <div className="bg-success/5 border border-success/15 rounded-lg p-3">
                <p className="text-xs font-semibold text-success mb-1 tracking-wider">BULL CASE</p>
                <p className="text-xs text-text-secondary leading-relaxed">{data.bull_case}</p>
              </div>
            )}
            {data.bear_case && (
              <div className="bg-danger/5 border border-danger/15 rounded-lg p-3">
                <p className="text-xs font-semibold text-danger mb-1 tracking-wider">BEAR CASE</p>
                <p className="text-xs text-text-secondary leading-relaxed">{data.bear_case}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
