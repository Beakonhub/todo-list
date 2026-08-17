export interface DonutChartProps {
  percentage: number;
  color: string;
  label: string;
  size?: number;
  strokeWidth?: number;
}

export function DonutChart({ percentage, color, label, size = 88, strokeWidth = 7 }: DonutChartProps) {
  const clamped = Math.max(0, Math.min(100, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);
  const tickRadius = size / 2 - 1;
  const ticks = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-2" data-testid="donut-chart" data-label={label} data-percentage={clamped}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {ticks.map((i) => {
            const angle = (i / ticks.length) * 360;
            return (
              <line
                key={i}
                x1={size / 2}
                y1={size / 2 - tickRadius}
                x2={size / 2}
                y2={size / 2 - tickRadius + 3}
                stroke="var(--color-board-line)"
                strokeWidth={1}
                transform={`rotate(${angle} ${size / 2} ${size / 2})`}
              />
            );
          })}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--color-board-line)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="butt"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold text-strip">
          {clamped}%
        </div>
      </div>
      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-strip/60">
        <span className="h-1.5 w-1.5" style={{ backgroundColor: color }} />
        {label}
      </div>
    </div>
  );
}
