"use client";

interface ConvictionMeterProps {
  score: number; // 0–100
  size?: number;
}

export default function ConvictionMeter({ score, size = 180 }: ConvictionMeterProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const radius = 70;
  const cx = size / 2;
  const cy = size * 0.62;
  const strokeWidth = 8;

  // Arc spans 210 degrees (from 195° to 345° going clockwise, i.e., -15° to -195° mathematically)
  // We use a semicircle-ish gauge: from 195deg to 345deg (210 deg sweep)
  const startAngleDeg = 195;
  const sweepDeg = 210;
  const endAngleDeg = startAngleDeg + sweepDeg;

  function polarToCartesian(angleDeg: number) {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function arcPath(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const trackPath = arcPath(startAngleDeg, endAngleDeg);
  const fillEnd = startAngleDeg + (sweepDeg * clamped) / 100;
  const fillPath = arcPath(startAngleDeg, fillEnd);

  // Needle
  const needleAngle = startAngleDeg + (sweepDeg * clamped) / 100;
  const needleRad = (needleAngle * Math.PI) / 180;
  const needleLength = radius - strokeWidth / 2 - 4;
  const nx = cx + needleLength * Math.cos(needleRad);
  const ny = cy + needleLength * Math.sin(needleRad);

  // Color based on score — uses CSS variables so tokens stay in sync
  const color =
    clamped >= 70 ? "var(--color-success)" : clamped >= 40 ? "var(--color-warning)" : "var(--color-danger)";

  // Label ticks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size * 0.72}
        viewBox={`0 0 ${size} ${size * 0.72}`}
        className="overflow-visible"
        role="img"
        aria-label={`Conviction score: ${clamped} out of 100`}
      >
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        {clamped > 0 && (
          <path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 6px color-mix(in oklch, ${color} 50%, transparent))`,
            }}
          />
        )}
        {/* Tick marks */}
        {ticks.map((t) => {
          const tickAngle = startAngleDeg + (sweepDeg * t) / 100;
          const tickRad = (tickAngle * Math.PI) / 180;
          const innerR = radius - strokeWidth / 2 - 10;
          const outerR = radius + strokeWidth / 2 + 2;
          const ix = cx + innerR * Math.cos(tickRad);
          const iy = cy + innerR * Math.sin(tickRad);
          const ox = cx + outerR * Math.cos(tickRad);
          const oy = cy + outerR * Math.sin(tickRad);
          return (
            <line
              key={t}
              x1={ix} y1={iy}
              x2={ox} y2={oy}
              stroke="#3A4055"
              strokeWidth="1"
              strokeLinecap="round"
            />
          );
        })}
        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "x2 0.6s cubic-bezier(0.16,1,0.3,1), y2 0.6s cubic-bezier(0.16,1,0.3,1)" }}
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r="5" fill="var(--color-surface-elevated)" stroke={color} strokeWidth="2" />
        {/* Score label */}
        <text
          x={cx}
          y={cy - 20}
          textAnchor="middle"
          fill={color}
          fontSize="28"
          fontWeight="700"
          fontFamily="Inter, sans-serif"
        >
          {clamped}
        </text>
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="10"
          fontWeight="500"
          fontFamily="Inter, sans-serif"
          letterSpacing="2"
        >
          CONVICTION
        </text>
      </svg>
    </div>
  );
}
