import { VehicleArt } from "./VehicleArt";

/**
 * Layered highway: sunset skyline with port cranes, neon-edged multi-lane road
 * with animated lane markings, and trucks travelling in both directions.
 * Pure SVG + CSS animation — cheap to render and respects reduced motion.
 */
export function HighwayScene({ className = "", dense = true }: { className?: string; dense?: boolean }) {
  return (
    <div className={`pointer-events-none relative overflow-hidden ${className}`} aria-hidden="true">
      {/* skyline */}
      <svg viewBox="0 0 1600 200" preserveAspectRatio="xMidYMax slice" className="absolute inset-x-0 bottom-[38%] h-[46%] w-full">
        <defs>
          <linearGradient id="hw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cc2dd3" stopOpacity="0" />
            <stop offset="0.6" stopColor="#fc1f86" stopOpacity="0.25" />
            <stop offset="1" stopColor="#ffb547" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <rect width="1600" height="200" fill="url(#hw-sky)" />
        <g fill="#0a0f1c">
          {/* cranes */}
          <path d="M120 200V60h8v140zM90 70h170v6H90zM240 76l-6 40h-4l6-40zM128 60l40-30h4l-40 30z" />
          <path d="M1320 200V50h8v150zM1290 60h190v6h-190zM1460 66l-6 46h-4l6-46zM1328 50l40-30h4l-40 30z" />
          {/* buildings */}
          {[
            [300, 120, 40], [345, 90, 30], [380, 140, 50], [440, 100, 36], [482, 70, 26], [520, 130, 60],
            [600, 110, 30], [640, 150, 44], [700, 95, 38], [760, 125, 54], [830, 80, 30], [870, 140, 40],
            [930, 105, 34], [980, 135, 52], [1050, 88, 30], [1090, 120, 46], [1150, 100, 40], [1200, 145, 50],
          ].map(([x, h, w]) => (
            <rect key={x} x={x} y={200 - h} width={w} height={h} />
          ))}
          {/* containers stack */}
          <rect x="160" y="170" width="60" height="30" />
          <rect x="1380" y="168" width="70" height="32" />
        </g>
        <g fill="#ffb547" opacity="0.5">
          {[[318, 100], [395, 80], [455, 120], [540, 90], [655, 70], [775, 100], [885, 80], [1000, 90], [1105, 100], [1215, 80]].map(([x, y]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" />
          ))}
        </g>
      </svg>

      {/* road */}
      <svg viewBox="0 0 1600 300" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[42%] w-full">
        <defs>
          <linearGradient id="hw-road" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0b111d" />
            <stop offset="1" stopColor="#05070d" />
          </linearGradient>
          <linearGradient id="hw-edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffb547" />
            <stop offset="0.35" stopColor="#fc1f86" />
            <stop offset="0.65" stopColor="#cc2dd3" />
            <stop offset="1" stopColor="#1db3ff" />
          </linearGradient>
        </defs>
        <rect width="1600" height="300" fill="url(#hw-road)" />
        <rect y="0" width="1600" height="3" fill="url(#hw-edge)" />
        <rect y="296" width="1600" height="4" fill="url(#hw-edge)" opacity="0.6" />
        <line x1="0" x2="1600" y1="150" y2="150" stroke="#d5ae62" strokeWidth="3" opacity="0.7" />
        <line x1="0" x2="1600" y1="80" y2="80" stroke="#ffffff" strokeOpacity="0.45" strokeWidth="3" strokeDasharray="34 26" className="animate-road" />
        <line x1="0" x2="1600" y1="225" y2="225" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="4" strokeDasharray="34 26" className="animate-road" />
        {/* light trails */}
        <line x1="0" x2="1600" y1="40" y2="40" stroke="#fc1f86" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="200 600" className="animate-road" style={{ animationDuration: "0.6s" }} />
        <line x1="0" x2="1600" y1="262" y2="262" stroke="#1db3ff" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="260 500" className="animate-road" style={{ animationDuration: "0.5s" }} />
      </svg>

      {/* far lane — oncoming */}
      <div className="absolute bottom-[25%] left-0 w-[22vw] min-w-[150px] max-w-[300px] animate-drive-rev opacity-70 motion-reduce:animate-none" style={{ animationDelay: "-6s" }}>
        <VehicleArt art="container" uid="hw-a" className="w-full" flip />
      </div>
      {dense && (
        <div className="absolute bottom-[25%] left-0 w-[14vw] min-w-[110px] max-w-[200px] animate-drive-rev opacity-60 motion-reduce:hidden" style={{ animationDelay: "-14s", animationDuration: "21s" }}>
          <VehicleArt art="truck6" uid="hw-b" className="w-full" flip />
        </div>
      )}
      {/* near lane */}
      <div className="absolute bottom-[1%] left-0 w-[34vw] min-w-[220px] max-w-[460px] animate-drive motion-reduce:animate-none motion-reduce:left-[8%]">
        <VehicleArt art="container" uid="hw-c" className="w-full drop-shadow-[0_0_30px_rgba(29,179,255,0.35)]" />
      </div>
      {dense && (
        <div className="absolute bottom-[3%] left-0 w-[22vw] min-w-[150px] max-w-[300px] animate-drive motion-reduce:hidden" style={{ animationDelay: "-8s", animationDuration: "11s" }}>
          <VehicleArt art="dumper" axles={3} uid="hw-d" className="w-full" />
        </div>
      )}
    </div>
  );
}
