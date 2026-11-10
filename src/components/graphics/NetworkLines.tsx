/** Decorative freight-network background: arcs with travelling pulses between nodes. */
export function NetworkLines({ className = "" }: { className?: string }) {
  const nodes = [
    [120, 420], [340, 220], [560, 380], [760, 160], [980, 300], [1180, 120], [1360, 360], [860, 520], [420, 560],
  ];
  const links: [number, number][] = [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 6], [2, 7], [7, 6], [0, 8], [8, 7],
  ];
  return (
    <svg viewBox="0 0 1440 640" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none ${className}`} aria-hidden>
      <defs>
        <linearGradient id="nl-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="0.4" stopColor="#fc1f86" />
          <stop offset="0.7" stopColor="#cc2dd3" />
          <stop offset="1" stopColor="#1db3ff" />
        </linearGradient>
      </defs>
      {links.map(([a, b], i) => {
        const [x1, y1] = nodes[a];
        const [x2, y2] = nodes[b];
        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 60;
        const d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke="url(#nl-grad)" strokeOpacity="0.22" strokeWidth="1.2" />
            <path
              d={d}
              fill="none"
              stroke="url(#nl-grad)"
              strokeWidth="2"
              strokeDasharray="14 400"
              className="animate-road"
              style={{ animationDuration: `${2 + (i % 4)}s`, animationDirection: i % 2 ? "reverse" : "normal" }}
            />
          </g>
        );
      })}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="10" fill="#1db3ff" opacity="0.08" />
          <circle cx={x} cy={y} r="3.5" fill={i % 3 === 0 ? "#ffb547" : i % 3 === 1 ? "#fc1f86" : "#1db3ff"} />
        </g>
      ))}
    </svg>
  );
}
