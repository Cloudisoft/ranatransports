import type { Vehicle } from "@/content/vehicles";

/**
 * Original, brand-neutral vehicle renders (side elevation) used until licensed
 * photography of the actual fleet is supplied. No manufacturer marks are drawn.
 */
type Art = Vehicle["art"];

const G = 138; // ground line

function Wheel({ cx, r = 13, uid }: { cx: number; r?: number; uid: string }) {
  return (
    <g>
      <ellipse cx={cx} cy={G + 3} rx={r * 1.15} ry={3} fill="#000" opacity="0.55" />
      <circle cx={cx} cy={G - r} r={r} fill="#07090e" stroke="#2b3443" strokeWidth="1.5" />
      <circle cx={cx} cy={G - r} r={r * 0.62} fill={`url(#rim-${uid})`} />
      <circle cx={cx} cy={G - r} r={r * 0.22} fill="#0b0f16" stroke="#8c99ad" strokeWidth="0.8" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <circle
          key={a}
          cx={cx + Math.cos((a * Math.PI) / 180) * r * 0.42}
          cy={G - r + Math.sin((a * Math.PI) / 180) * r * 0.42}
          r={0.9}
          fill="#c9d3e3"
        />
      ))}
    </g>
  );
}

function Cab({ x, w, h, uid, chassis = G - 24 }: { x: number; w: number; h: number; uid: string; chassis?: number }) {
  const top = chassis - h;
  return (
    <g>
      <path
        d={`M${x},${chassis} L${x},${top + 4} Q${x},${top} ${x + 4},${top} L${x + w * 0.62},${top} Q${x + w * 0.7},${top} ${x + w * 0.76},${top + h * 0.18} L${x + w},${top + h * 0.5} L${x + w},${chassis} Z`}
        fill={`url(#cab-${uid})`}
        stroke="#5c6b82"
        strokeWidth="0.8"
      />
      {/* window */}
      <path
        d={`M${x + w * 0.42},${top + h * 0.1} L${x + w * 0.64},${top + h * 0.1} L${x + w * 0.9},${top + h * 0.47} L${x + w * 0.42},${top + h * 0.47} Z`}
        fill={`url(#glass-${uid})`}
      />
      {/* door line + handle */}
      <path d={`M${x + w * 0.38},${top + h * 0.08} V${chassis - 3}`} stroke="#0b1220" strokeWidth="1" opacity="0.6" />
      <rect x={x + w * 0.44} y={top + h * 0.58} width={w * 0.1} height={2} rx={1} fill="#9aa7bb" />
      {/* brand stripe */}
      <rect x={x + 1} y={top + h * 0.72} width={w - 2} height={3} fill={`url(#stripe-${uid})`} />
      {/* headlight */}
      <rect x={x + w - 5} y={chassis - h * 0.32} width={5} height={5} rx={1.5} fill="#e8f6ff" />
      <ellipse cx={x + w + 18} cy={chassis - h * 0.3} rx={22} ry={5} fill={`url(#beam-${uid})`} />
      {/* bumper */}
      <rect x={x + w - 6} y={chassis - 3} width={10} height={6} rx={2} fill="#1b2230" />
      {/* mirror */}
      <rect x={x + w * 0.72} y={top + h * 0.12} width={2.5} height={10} rx={1} fill="#1b2230" />
    </g>
  );
}

function Chassis({ x1, x2, y = G - 24 }: { x1: number; x2: number; y?: number }) {
  return <rect x={x1} y={y - 1} width={x2 - x1} height={7} rx={2} fill="#141a24" />;
}

function OpenBody({ x, w, h, uid, y = G - 24 }: { x: number; w: number; h: number; uid: string; y?: number }) {
  const slats = Math.max(3, Math.round(w / 26));
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx={2} fill={`url(#body-${uid})`} stroke="#3c4a60" strokeWidth="0.8" />
      {Array.from({ length: slats }).map((_, i) => (
        <rect key={i} x={x + ((i + 1) * w) / (slats + 1) - 1} y={y - h + 2} width={2} height={h - 4} fill="#000" opacity="0.18" />
      ))}
      <rect x={x} y={y - h} width={w} height={3} fill="#cfd8e6" opacity="0.35" />
      <rect x={x} y={y - 6} width={w} height={3} fill={`url(#stripe-${uid})`} opacity="0.9" />
    </g>
  );
}

function BoxBody({ x, w, h, uid, y = G - 24, label = true, flip = false }: { x: number; w: number; h: number; uid: string; y?: number; label?: boolean; flip?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx={3} fill={`url(#box-${uid})`} stroke="#4a5873" strokeWidth="0.8" />
      {Array.from({ length: Math.round(w / 14) }).map((_, i) => (
        <rect key={i} x={x + 6 + i * 14} y={y - h + 4} width={1} height={h - 8} fill="#ffffff" opacity="0.05" />
      ))}
      <rect x={x} y={y - h * 0.38} width={w} height={4} fill={`url(#stripe-${uid})`} />
      {label && (
        <text
          x={x + w / 2}
          y={y - h * 0.58}
          textAnchor="middle"
          fontFamily="Space Grotesk Variable, sans-serif"
          fontWeight="700"
          fontSize={Math.min(16, h * 0.3)}
          letterSpacing="5"
          fill="#ffffff"
          opacity="0.9"
          transform={flip ? `translate(${2 * (x + w / 2)},0) scale(-1,1)` : undefined}
        >
          RANA
        </text>
      )}
    </g>
  );
}

function DumperBody({ x, w, h, uid, y = G - 24 }: { x: number; w: number; h: number; uid: string; y?: number }) {
  return (
    <g className="dumper-tub" style={{ transformOrigin: `${x}px ${y}px`, transformBox: "view-box" }}>
      <path
        d={`M${x},${y} L${x - 4},${y - h} L${x + w + 6},${y - h} L${x + w},${y - h * 0.25} L${x + w - 10},${y} Z`}
        fill={`url(#tub-${uid})`}
        stroke="#6b5226"
        strokeWidth="1"
      />
      {[0.25, 0.5, 0.75].map((f) => (
        <path key={f} d={`M${x + w * f},${y - h + 2} V${y - 2}`} stroke="#000" strokeWidth="2.5" opacity="0.2" />
      ))}
      <path d={`M${x - 4},${y - h} Q${x + w / 2},${y - h - 12} ${x + w + 6},${y - h}`} fill="#8a6a3d" opacity="0.85" />
      <rect x={x - 2} y={y - h * 0.5} width={w} height={3} fill={`url(#stripe-${uid})`} opacity="0.8" />
    </g>
  );
}

function Defs({ uid, accent = "brand" }: { uid: string; accent?: "brand" | "gold" | "green" }) {
  const body =
    accent === "green"
      ? ["#3f7d4a", "#1e4a2a"]
      : accent === "gold"
        ? ["#3a3f4c", "#1d222c"]
        : ["#2a3446", "#141a26"];
  return (
    <defs>
      <linearGradient id={`cab-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={accent === "green" ? "#4c9a5a" : "#e9eef6"} />
        <stop offset="0.55" stopColor={accent === "green" ? "#2f6b3a" : "#b9c3d3"} />
        <stop offset="1" stopColor={accent === "green" ? "#1d4526" : "#6d7a8f"} />
      </linearGradient>
      <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#1db3ff" stopOpacity="0.85" />
        <stop offset="0.5" stopColor="#0b2747" />
        <stop offset="1" stopColor="#cc2dd3" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={body[0]} />
        <stop offset="1" stopColor={body[1]} />
      </linearGradient>
      <linearGradient id={`box-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#202a3c" />
        <stop offset="0.5" stopColor="#141c2b" />
        <stop offset="1" stopColor="#0c121d" />
      </linearGradient>
      <linearGradient id={`tub-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f0b54a" />
        <stop offset="1" stopColor="#a8701e" />
      </linearGradient>
      <linearGradient id={`stripe-${uid}`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffb547" />
        <stop offset="0.35" stopColor="#fc1f86" />
        <stop offset="0.65" stopColor="#cc2dd3" />
        <stop offset="1" stopColor="#1db3ff" />
      </linearGradient>
      <radialGradient id={`rim-${uid}`}>
        <stop offset="0" stopColor="#dfe6f0" />
        <stop offset="1" stopColor="#5b6678" />
      </radialGradient>
      <radialGradient id={`beam-${uid}`}>
        <stop offset="0" stopColor="#bfe9ff" stopOpacity="0.55" />
        <stop offset="1" stopColor="#1db3ff" stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}

export function VehicleArt({
  art,
  uid,
  axles,
  className = "",
  accent,
  flip = false,
}: {
  art: Art;
  uid: string;
  axles?: number;
  className?: string;
  accent?: "brand" | "gold" | "green";
  /** Mirror the vehicle to face left; lettering stays readable. */
  flip?: boolean;
}) {
  let content: React.ReactNode;
  switch (art) {
    case "three-wheeler":
      content = (
        <>
          <Chassis x1={150} x2={262} y={G - 20} />
          <OpenBody x={150} w={70} h={26} uid={uid} y={G - 20} />
          <path
            d={`M220,${G - 20} L220,${G - 70} Q222,${G - 76} 230,${G - 76} L250,${G - 76} Q262,${G - 72} 266,${G - 40} L268,${G - 20} Z`}
            fill={`url(#cab-${uid})`}
            stroke="#5c6b82"
            strokeWidth="0.8"
          />
          <path d={`M238,${G - 70} L252,${G - 70} Q259,${G - 64} 261,${G - 46} L238,${G - 46} Z`} fill={`url(#glass-${uid})`} />
          <rect x={221} y={G - 34} width={46} height={3} fill={`url(#stripe-${uid})`} />
          <Wheel cx={172} r={11} uid={uid} />
          <Wheel cx={252} r={11} uid={uid} />
        </>
      );
      break;
    case "mini":
      content = (
        <>
          <Chassis x1={120} x2={290} />
          <OpenBody x={120} w={110} h={28} uid={uid} />
          <Cab x={230} w={60} h={52} uid={uid} />
          <Wheel cx={150} r={12} uid={uid} />
          <Wheel cx={268} r={12} uid={uid} />
        </>
      );
      break;
    case "pickup":
      content = (
        <>
          <Chassis x1={95} x2={300} />
          <OpenBody x={95} w={135} h={30} uid={uid} />
          <Cab x={230} w={70} h={56} uid={uid} />
          <Wheel cx={130} r={13} uid={uid} />
          <Wheel cx={274} r={13} uid={uid} />
        </>
      );
      break;
    case "lcv":
      content = (
        <>
          <Chassis x1={80} x2={308} />
          <BoxBody x={80} w={150} h={64} uid={uid} flip={flip} />
          <Cab x={234} w={74} h={62} uid={uid} />
          <Wheel cx={118} r={14} uid={uid} />
          <Wheel cx={280} r={14} uid={uid} />
        </>
      );
      break;
    case "truck6":
    case "truck8":
    case "truck10":
    case "truck12": {
      const len = { truck6: 190, truck8: 215, truck10: 235, truck12: 255 }[art];
      const cabW = 80;
      const cabX = 350 - cabW;
      const bx = cabX - 6 - len;
      const rear =
        art === "truck6" ? [bx + len * 0.7] : [bx + len * 0.6, bx + len * 0.6 + 32];
      const front = art === "truck8" || art === "truck12" ? [cabX + 46, cabX + 14] : [cabX + 46];
      content = (
        <>
          <Chassis x1={bx} x2={cabX + cabW} />
          {art === "truck10" ? (
            <BoxBody x={bx} w={len} h={74} uid={uid} flip={flip} />
          ) : (
            <OpenBody x={bx} w={len} h={art === "truck6" ? 52 : 58} uid={uid} />
          )}
          <Cab x={cabX} w={cabW} h={78} uid={uid} />
          {[...rear, ...front].map((cx) => (
            <Wheel key={cx} cx={cx} r={15} uid={uid} />
          ))}
        </>
      );
      break;
    }
    case "dumper": {
      const n = axles ?? 3;
      const rear = n >= 3 ? [170, 202] : [186];
      const front = n >= 4 ? [300, 268] : [300];
      content = (
        <>
          <Chassis x1={110} x2={330} />
          <DumperBody x={112} w={128} h={56} uid={uid} />
          <rect x={232} y={G - 92} width={8} height={68} fill="#141a24" />
          <Cab x={244} w={86} h={74} uid={uid} />
          {[...rear, ...front].map((cx) => (
            <Wheel key={cx} cx={cx} r={16} uid={uid} />
          ))}
        </>
      );
      break;
    }
    case "container":
    default:
      content = (
        <>
          <Chassis x1={20} x2={372} />
          <BoxBody x={20} w={268} h={84} uid={uid} flip={flip} />
          <rect x={288} y={G - 30} width={10} height={8} fill="#141a24" />
          <Cab x={296} w={76} h={84} uid={uid} />
          {[60, 92, 124, 318, 350].map((cx) => (
            <Wheel key={cx} cx={cx} r={14} uid={uid} />
          ))}
        </>
      );
  }

  return (
    <svg viewBox="0 0 400 160" className={className} role="img" aria-hidden="true">
      <Defs uid={uid} accent={accent} />
      <ellipse cx="200" cy={G + 4} rx="185" ry="6" fill="#000" opacity="0.35" />
      <g transform={flip ? "translate(400,0) scale(-1,1)" : undefined}>{content}</g>
    </svg>
  );
}
