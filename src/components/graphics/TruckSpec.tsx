"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Vehicle } from "@/content/vehicles";
import { formatFt } from "@/content/vehicles";

/**
 * Technical side-elevation of a commercial vehicle, drawn to scale from its
 * class dimensions, with dimension lines for cargo length and height — the
 * spec-sheet style used by Indian logistics platforms. No manufacturer marks.
 */

const W = 440;
const H = 224;
const GROUND = 200;
const LEFT = 74;
const RIGHT = 14;
const TOP = 40;

const INK = "#1b2130";
const DIM = "#9aa1ad";
const LABEL = "#5b6472";

const CAB_LEN: Record<Vehicle["drawing"]["cab"], number> = {
  auto: 3.0,
  mini: 3.4,
  pickup: 5.6,
  lcv: 5.6,
  hcv: 7.0,
  tractor: 7.4,
};

function bodyTopFt(v: Vehicle) {
  const d = v.drawing;
  if (d.body === "flatbed") return d.deckFt;
  return d.deckFt + v.heightFt;
}

export function TruckSpec({
  v,
  className = "",
  animate = true,
  bare = false,
  tint,
  flip = false,
}: {
  v: Vehicle;
  className?: string;
  animate?: boolean;
  /** Decorative mode: no dimension lines or ground line */
  bare?: boolean;
  /** Paint colour for cab and body (default white) */
  tint?: string;
  /** Face left */
  flip?: boolean;
}) {
  const paint = tint ?? "#fff";
  const uid = `${v.id}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const reduce = useReducedMotion();
  const d = v.drawing;
  const bodyLen = v.lengthFt;
  const cabLen = CAB_LEN[d.cab];
  const cab0 = bodyLen + 0.4;
  const maxX = cab0 + cabLen + (d.cab === "hcv" || d.cab === "tractor" ? 0.2 : 0);
  const topFt = Math.max(d.cabHeightFt + (d.cab === "hcv" || d.cab === "tractor" ? 0.9 : 0), bodyTopFt(v));

  const s = Math.min((W - LEFT - RIGHT) / maxX, (GROUND - TOP) / topFt, 24);
  const ox = LEFT + (W - LEFT - RIGHT - maxX * s) / 2;
  const X = (x: number) => +(ox + x * s).toFixed(2);
  const Y = (y: number) => +(GROUND - y * s).toFixed(2);
  const pts = (arr: [number, number][]) => arr.map(([x, y]) => `${X(x)},${Y(y)}`).join(" ");

  const b = d.wheelFt * 1.15; // cab floor line
  const R = d.cabHeightFt;
  const deck = d.deckFt;
  const draw = animate && !reduce;

  /* ───────────── cab ───────────── */
  let cab: React.ReactNode;
  const c0 = cab0;
  const L = cabLen;
  if (d.cab === "auto") {
    cab = (
      <g>
        <path
          d={`M${X(c0)},${Y(b)} L${X(c0)},${Y(R - 0.5)} Q${X(c0)},${Y(R)} ${X(c0 + 0.5)},${Y(R)} L${X(c0 + L - 1.1)},${Y(R)} Q${X(c0 + L - 0.1)},${Y(R - 0.1)} ${X(c0 + L)},${Y(R - 1.6)} Q${X(c0 + L + 0.2)},${Y(b + 1.2)} ${X(c0 + L + 0.1)},${Y(b + 0.5)} L${X(c0 + L)},${Y(b)} Z`}
          fill={paint}
          stroke={INK}
          strokeWidth={1.6}
        />
        <rect x={X(c0 + 0.45)} y={Y(R - 0.55)} width={(L * 0.5) * s} height={(R - 0.55 - (b + 1.0)) * s} rx={4} fill="#e9ecf2" stroke={INK} strokeWidth={1.2} />
        <path d={`M${X(c0 + L - 1.0)},${Y(R - 0.35)} Q${X(c0 + L - 0.3)},${Y(R - 0.6)} ${X(c0 + L - 0.25)},${Y(R - 1.9)} L${X(c0 + L * 0.62)},${Y(R - 1.9)} Z`} fill={`url(#glass-${uid})`} stroke={INK} strokeWidth={1.2} />
        <circle cx={X(c0 + L - 0.05)} cy={Y(b + 1.3)} r={2.4} fill="#ffd27a" stroke={INK} strokeWidth={1} />
      </g>
    );
  } else if (d.cab === "pickup") {
    const hood = deck + 1.3;
    cab = (
      <g>
        <polygon
          points={pts([[c0, b], [c0, R - 0.2], [c0 + 0.2, R], [c0 + 2.2, R], [c0 + 3.1, hood + 0.25], [c0 + L - 0.45, hood], [c0 + L, hood - 0.5], [c0 + L, b + 0.3], [c0 + L - 0.25, b]])}
          fill={paint}
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <polygon points={pts([[c0 + 0.5, R - 0.3], [c0 + 2.1, R - 0.3], [c0 + 2.8, hood + 0.5], [c0 + 0.5, hood + 0.5]])} fill={`url(#glass-${uid})`} stroke={INK} strokeWidth={1.2} />
        <line x1={X(c0 + 2.95)} y1={Y(hood + 0.3)} x2={X(c0 + 2.95)} y2={Y(b + 0.3)} stroke={INK} strokeWidth={1} />
        <rect x={X(c0 + 1.9)} y={Y(hood - 0.05)} width={0.45 * s} height={2} rx={1} fill={INK} />
        <rect x={X(c0 + L - 0.3)} y={Y(hood - 0.35)} width={0.3 * s} height={0.35 * s} rx={1.5} fill="#ffd27a" stroke={INK} strokeWidth={1} />
        <rect x={X(c0 + L - 0.35)} y={Y(b + 0.35)} width={0.55 * s} height={0.4 * s} rx={2} fill={INK} />
      </g>
    );
  } else {
    // cab-over (mini / lcv / hcv / tractor)
    const big = d.cab === "hcv" || d.cab === "tractor";
    const slope = d.cab === "mini" ? 1.5 : 0.9;
    const wb = R - (R - b) * 0.42;
    cab = (
      <g>
        {big && (
          <polygon points={pts([[c0 + L * 0.22, R], [c0 + L * 0.34, R + 0.85], [c0 + L - 1.5, R + 0.85], [c0 + L - 0.9, R]])} fill="#eef0f4" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
        )}
        <polygon
          points={pts([[c0, b], [c0, R - 0.25], [c0 + 0.25, R], [c0 + L - 0.95, R], [c0 + L - 0.1, R - slope], [c0 + L, b + 0.45], [c0 + L - 0.2, b]])}
          fill={paint}
          stroke={INK}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <polygon points={pts([[c0 + L * 0.46, R - 0.4], [c0 + L - 1.0, R - 0.4], [c0 + L - 0.35, R - slope + 0.1], [c0 + L - 0.32, wb], [c0 + L * 0.46, wb]])} fill={`url(#glass-${uid})`} stroke={INK} strokeWidth={1.2} strokeLinejoin="round" />
        <line x1={X(c0 + L * 0.4)} y1={Y(R - 0.3)} x2={X(c0 + L * 0.4)} y2={Y(b + 0.2)} stroke={INK} strokeWidth={1} />
        <rect x={X(c0 + L * 0.47)} y={Y(wb - 0.45)} width={0.5 * s} height={2} rx={1} fill={INK} />
        {/* brand stripe */}
        <rect x={X(c0 + 0.05)} y={Y(b + (R - b) * 0.3)} width={(L - 0.2) * s} height={Math.max(2, 0.14 * s)} fill={`url(#stripe-${uid})`} />
        {/* headlight + bumper + mirror */}
        <rect x={X(c0 + L - 0.28)} y={Y(b + 1.1)} width={0.28 * s} height={0.4 * s} rx={1.5} fill="#ffd27a" stroke={INK} strokeWidth={1} />
        <rect x={X(c0 + L - 0.4)} y={Y(b + 0.4)} width={0.65 * s} height={0.42 * s} rx={2} fill={INK} />
        <line x1={X(c0 + L + 0.1)} y1={Y(R - 0.6)} x2={X(c0 + L + 0.1)} y2={Y(wb + 0.2)} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        {/* step */}
        <line x1={X(c0 + L * 0.5)} y1={Y(b - 0.25)} x2={X(c0 + L * 0.85)} y2={Y(b - 0.25)} stroke={INK} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  }

  /* ───────────── cargo body ───────────── */
  let body: React.ReactNode;
  const top = bodyTopFt(v);
  if (d.body === "container" || d.body === "auto-box") {
    const ribs = d.body === "container" ? Math.floor(bodyLen / 1.4) : 0;
    body = (
      <g>
        <rect x={X(0)} y={Y(top)} width={bodyLen * s} height={v.heightFt * s} rx={d.body === "auto-box" ? 4 : 2} fill={paint} stroke={INK} strokeWidth={1.6} />
        {Array.from({ length: ribs }).map((_, i) => (
          <line key={i} x1={X(((i + 1) * bodyLen) / (ribs + 1))} y1={Y(top - 0.2)} x2={X(((i + 1) * bodyLen) / (ribs + 1))} y2={Y(deck + 0.2)} stroke="#d5d9e1" strokeWidth={1} />
        ))}
        <line x1={X(0.35)} y1={Y(top - 0.15)} x2={X(0.35)} y2={Y(deck + 0.15)} stroke={INK} strokeWidth={1} />
        <rect x={X(0)} y={Y(deck + v.heightFt * 0.32)} width={bodyLen * s} height={Math.max(2, 0.12 * s)} fill={`url(#stripe-${uid})`} />
        {bodyLen >= 14 && (
          <text x={X(bodyLen / 2)} y={Y(deck + v.heightFt * 0.55)} textAnchor="middle" fontFamily="Space Grotesk Variable, sans-serif" fontWeight={700} fontSize={Math.min(16, v.heightFt * s * 0.22)} letterSpacing={Math.min(6, s * 0.4)} fill={INK} opacity={0.85} transform={flip ? `translate(${2 * X(bodyLen / 2)},0) scale(-1,1)` : undefined}>
            RANA
          </text>
        )}
      </g>
    );
  } else if (d.body === "open") {
    const planks = Math.max(1, Math.round(v.heightFt / 0.55));
    const posts = Math.max(1, Math.round(bodyLen / 4.5));
    body = (
      <g>
        <rect x={X(0)} y={Y(deck)} width={bodyLen * s} height={0.4 * s} fill={INK} />
        <rect x={X(0)} y={Y(top)} width={bodyLen * s} height={v.heightFt * s} fill={paint} stroke={INK} strokeWidth={1.6} />
        {Array.from({ length: planks - 1 }).map((_, i) => (
          <line key={i} x1={X(0)} x2={X(bodyLen)} y1={Y(deck + ((i + 1) * v.heightFt) / planks)} y2={Y(deck + ((i + 1) * v.heightFt) / planks)} stroke="#c9ced8" strokeWidth={1} />
        ))}
        {Array.from({ length: posts + 1 }).map((_, i) => (
          <rect key={i} x={X((i * bodyLen) / posts) - 1.5} y={Y(top)} width={3} height={v.heightFt * s} fill={INK} />
        ))}
      </g>
    );
  } else if (d.body === "tipper") {
    body = (
      <g className="tipper-body transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transformBox: "view-box", transformOrigin: `${X(0)}px ${Y(deck)}px` }}>
        <polygon points={pts([[0, deck], [-0.3, top], [bodyLen + 0.3, top], [bodyLen, deck + 0.5], [bodyLen - 0.8, deck]])} fill={paint} stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} x1={X(bodyLen * f)} x2={X(bodyLen * f - 0.15)} y1={Y(top - 0.05)} y2={Y(deck + 0.05)} stroke={INK} strokeWidth={2.5} />
        ))}
        <line x1={X(-0.25)} x2={X(bodyLen + 0.25)} y1={Y(top - 0.35)} y2={Y(top - 0.35)} stroke={INK} strokeWidth={1} />
        {/* canopy over cab */}
        <polygon points={pts([[bodyLen + 0.3, top], [bodyLen + 1.6, top + 0.25], [bodyLen + 1.6, top - 0.05], [bodyLen + 0.3, top - 0.35]])} fill={INK} />
        <rect x={X(0)} y={Y(deck + v.heightFt * 0.45)} width={(bodyLen - 0.3) * s} height={Math.max(2, 0.12 * s)} fill={`url(#stripe-${uid})`} />
      </g>
    );
  } else {
    // flatbed trailer
    body = (
      <g>
        <rect x={X(0)} y={Y(deck)} width={bodyLen * s} height={0.65 * s} fill={paint} stroke={INK} strokeWidth={1.6} />
        {Array.from({ length: Math.floor(bodyLen / 3) }).map((_, i) => (
          <line key={i} x1={X(1.5 + i * 3)} x2={X(1.5 + i * 3)} y1={Y(deck)} y2={Y(deck - 0.65)} stroke="#c9ced8" strokeWidth={1} />
        ))}
        <rect x={X(0)} y={Y(deck - 0.3)} width={bodyLen * s} height={Math.max(2, 0.1 * s)} fill={`url(#stripe-${uid})`} />
        {/* landing legs */}
        <line x1={X(bodyLen - 10)} x2={X(bodyLen - 10)} y1={Y(deck - 0.65)} y2={Y(0.5)} stroke={INK} strokeWidth={2} />
        <rect x={X(bodyLen - 10.4)} y={Y(0.5)} width={0.8 * s} height={2.5} fill={INK} />
      </g>
    );
  }

  /* ───────────── chassis + wheels ───────────── */
  const chassisFrom = d.cab === "tractor" ? bodyLen - 7.5 : 0.5;
  const chassisY = d.cab === "tractor" ? deck - 0.9 : deck - 0.15;
  const r = d.wheelFt * s;

  const dims = {
    lenY: Y(top) - 14,
    hX: X(0) - 16,
    h0: v.heightRef === "deck" ? 0 : deck,
    h1: v.heightRef === "deck" ? deck : top,
  };

  const dimPath = (dd: string, delay: number) =>
    draw ? (
      <motion.path d={dd} fill="none" stroke={DIM} strokeWidth={1.4} initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay, ease: "easeOut" }} />
    ) : (
      <path d={dd} fill="none" stroke={DIM} strokeWidth={1.4} />
    );

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} role="img" aria-label={`${v.name} side view: cargo length ${formatFt(v.lengthFt)}, ${v.heightRef} height ${formatFt(v.heightFt)}`}>
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#bfe7ff" />
          <stop offset="1" stopColor="#7d8fb3" />
        </linearGradient>
        <linearGradient id={`stripe-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffb547" />
          <stop offset="0.35" stopColor="#fc1f86" />
          <stop offset="0.65" stopColor="#cc2dd3" />
          <stop offset="1" stopColor="#1db3ff" />
        </linearGradient>
      </defs>

      {/* ground */}
      {!bare && <line x1={X(-0.8)} x2={X(maxX + 0.6)} y1={GROUND} y2={GROUND} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />}
      <ellipse cx={X(maxX / 2)} cy={GROUND + 3} rx={(maxX * s) / 2} ry={3.5} fill={INK} opacity={0.08} />

      <g transform={flip ? `translate(${W},0) scale(-1,1)` : undefined}>
      <g className="truck-drive transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]">
        {/* chassis */}
        <rect x={X(chassisFrom)} y={Y(chassisY)} width={(cab0 + L * 0.6 - chassisFrom) * s} height={Math.max(3, 0.45 * s)} rx={1.5} fill={INK} />
        {d.cab === "tractor" && <rect x={X(bodyLen - 5)} y={Y(deck - 0.05)} width={3 * s} height={0.25 * s} fill={INK} />}
        {body}
        {cab}
        {/* mudguards + wheels */}
        {d.axles.map((ax) => (
          <g key={ax}>
            {d.cab !== "auto" && (
              <path d={`M${X(ax) - r - 3},${Y(d.wheelFt)} A${r + 3},${r + 3} 0 0 1 ${X(ax) + r + 3},${Y(d.wheelFt)}`} fill="none" stroke={INK} strokeWidth={1.6} />
            )}
            <circle cx={X(ax)} cy={Y(d.wheelFt)} r={r} fill={INK} />
            <g className="wheel-spin" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={X(ax)} cy={Y(d.wheelFt)} r={r * 0.56} fill="#d9dde4" />
              {[0, 72, 144, 216, 288].map((a) => (
                <circle key={a} cx={X(ax) + Math.cos((a * Math.PI) / 180) * r * 0.36} cy={Y(d.wheelFt) + Math.sin((a * Math.PI) / 180) * r * 0.36} r={Math.max(0.9, r * 0.07)} fill={INK} />
              ))}
              <circle cx={X(ax)} cy={Y(d.wheelFt)} r={r * 0.16} fill={INK} />
            </g>
          </g>
        ))}
      </g>

      </g>
      {!bare && (
      <>
      {/* dimension: cargo length */}
      {dimPath(`M${X(0)},${dims.lenY} H${X(bodyLen)} M${X(0)},${dims.lenY - 6} V${dims.lenY + 6} M${X(bodyLen)},${dims.lenY - 6} V${dims.lenY + 6}`, 0.15)}
      <text x={(X(0) + X(bodyLen)) / 2} y={dims.lenY - 9} textAnchor="middle" fontFamily="Inter Variable, sans-serif" fontWeight={600} fontSize={16} fill={LABEL}>
        {formatFt(v.lengthFt)}
      </text>
      {/* dimension: height */}
      {dimPath(`M${dims.hX},${Y(dims.h0)} V${Y(dims.h1)} M${dims.hX - 6},${Y(dims.h0)} H${dims.hX + 6} M${dims.hX - 6},${Y(dims.h1)} H${dims.hX + 6}`, 0.35)}
      <text x={dims.hX - 8} y={(Y(dims.h0) + Y(dims.h1)) / 2 + 5} textAnchor="end" fontFamily="Inter Variable, sans-serif" fontWeight={600} fontSize={16} fill={LABEL}>
        {formatFt(v.heightFt)}
      </text>
      </>
      )}
    </svg>
  );
}

/** Small rear-elevation showing cargo width. */
export function RearView({ v, className = "" }: { v: Vehicle; className?: string }) {
  const d = v.drawing;
  const bodyH = d.body === "flatbed" ? 0.65 : v.heightFt;
  const total = d.deckFt + bodyH;
  const k = Math.min(64 / v.widthFt, 46 / total);
  const cx = 50;
  const g = 62;
  const w = v.widthFt * k;
  const wheelW = Math.max(5, 0.9 * k);
  return (
    <svg viewBox="0 0 100 92" className={className} role="img" aria-label={`Rear view: cargo width ${formatFt(v.widthFt)}`}>
      <rect x={cx - w / 2} y={g - total * k} width={w} height={bodyH * k} rx={2} fill="#fff" stroke={INK} strokeWidth={1.3} />
      <rect x={cx - w / 2 + 2} y={g - d.deckFt * k} width={w - 4} height={Math.max(2, (d.deckFt - d.wheelFt * 2) * k * 0.4)} fill={INK} />
      <rect x={cx - w / 2 + 3} y={g - d.wheelFt * 2 * k} width={wheelW} height={d.wheelFt * 2 * k} rx={1.5} fill={INK} />
      <rect x={cx + w / 2 - 3 - wheelW} y={g - d.wheelFt * 2 * k} width={wheelW} height={d.wheelFt * 2 * k} rx={1.5} fill={INK} />
      <line x1={10} x2={90} y1={g} y2={g} stroke={INK} strokeWidth={1.3} />
      <path d={`M${cx - w / 2},${g + 10} H${cx + w / 2} M${cx - w / 2},${g + 6} V${g + 14} M${cx + w / 2},${g + 6} V${g + 14}`} stroke={DIM} strokeWidth={1.2} fill="none" />
      <text x={cx} y={g + 27} textAnchor="middle" fontFamily="Inter Variable, sans-serif" fontWeight={600} fontSize={12} fill={LABEL}>
        {formatFt(v.widthFt)}
      </text>
    </svg>
  );
}
