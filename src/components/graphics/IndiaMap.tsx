"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import { FOCUS_STATES } from "@/content/india-map";
import { OFFICES, REGIONS, mapsDirectionsUrl, type Office } from "@/content/offices";
import { Icon } from "@/components/ui/Icon";

/** Mercator projection calibrated to the @svg-maps/india artboard (612 × 696). */
export function project(lat: number, lng: number): [number, number] {
  const x = (lng - 68.18) * 20.95;
  const y = 838.35 - 1203.97 * Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y];
}

/** Indicative Delhi–Mumbai Industrial Corridor alignment (approximate, for illustration only). */
const DMIC_WAYPOINTS: [number, number][] = [
  [28.62, 77.25], [28.19, 76.62], [26.91, 75.79], [26.45, 74.64], [24.59, 73.71],
  [23.6, 72.4], [23.02, 72.57], [22.31, 73.18], [21.17, 72.83], [20.1, 72.9], [18.95, 72.95],
];

function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

type View = "india" | "dmic" | "gujarat" | "rajasthan" | "maharashtra" | "delhi";

const VIEWS: { id: View; label: string; box: [number, number, number, number] }[] = [
  { id: "india", label: "All India", box: [0, 0, 612, 696] },
  { id: "dmic", label: "DMIC Corridor", box: [20, 170, 260, 300] },
  { id: "gujarat", label: "Gujarat", box: [40, 300, 90, 100] },
  { id: "rajasthan", label: "Rajasthan", box: [10, 160, 220, 200] },
  { id: "maharashtra", label: "Maharashtra", box: [60, 350, 230, 170] },
  { id: "delhi", label: "Delhi & North", box: [140, 160, 110, 100] },
];

const REGION_OF_VIEW: Partial<Record<View, string>> = {
  gujarat: "gj",
  rajasthan: "rj",
  maharashtra: "mh",
  delhi: "dl",
};

export function IndiaMap({ compact = false, initialView = "dmic" }: { compact?: boolean; initialView?: View }) {
  const reduce = useReduceMotion();
  const [view, setView] = useState<View>(initialView);
  const [active, setActive] = useState<Office | null>(null);
  const box = VIEWS.find((v) => v.id === view)!.box;
  const scale = 612 / box[2];
  const corridor = useMemo(() => smoothPath(DMIC_WAYPOINTS.map(([la, lo]) => project(la, lo))), []);
  const highlighted = REGION_OF_VIEW[view];
  const showCorridor = view !== "gujarat";

  const visibleOffices = OFFICES.filter((o) => {
    if (view === "gujarat") return o.region === "gujarat";
    if (view === "maharashtra") return o.region === "maharashtra";
    if (view === "delhi") return o.region === "delhi";
    if (view === "rajasthan") return false;
    return true;
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="relative">
        <div role="group" aria-label="Map region" className="mb-4 flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={view === v.id}
              onClick={() => {
                setView(v.id);
                setActive(null);
              }}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
                view === v.id ? "border-white bg-white text-midnight" : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div className={`neon-border relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_30%_40%,#0d2140,#05070d_70%)] ${compact ? "aspect-[4/4]" : "aspect-[612/640]"}`}>
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden />
          <motion.svg
            className="absolute inset-0 size-full"
            initial={false}
            animate={{ viewBox: box.join(" ") }}
            transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
            preserveAspectRatio="xMidYMid meet"
            role="img"
            aria-label="Map of India showing Rana office locations and the indicative Delhi–Mumbai Industrial Corridor"
          >
            <defs>
              <linearGradient id="dmic-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1db3ff" />
                <stop offset="0.45" stopColor="#cc2dd3" />
                <stop offset="0.75" stopColor="#fc1f86" />
                <stop offset="1" stopColor="#ffb547" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation={3 / scale} result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <image href="/maps/india.svg" x="0" y="0" width="612" height="696" />
            {Object.entries(FOCUS_STATES).map(([id, s]) => (
              <path
                key={id}
                d={s.path}
                fill={highlighted === id ? "#cc2dd3" : "#1db3ff"}
                fillOpacity={highlighted === id ? 0.35 : view === "india" || view === "dmic" ? 0.14 : 0.08}
                stroke={highlighted === id ? "#fc1f86" : "#1db3ff"}
                strokeOpacity={0.7}
                strokeWidth={1 / scale}
                className="transition-[fill-opacity] duration-500"
              >
                <title>{s.name}</title>
              </path>
            ))}

            {showCorridor && (
              <g filter="url(#glow)">
                <path d={corridor} fill="none" stroke="url(#dmic-grad)" strokeWidth={6 / scale} strokeOpacity={0.25} strokeLinecap="round" />
                <motion.path
                  d={corridor}
                  fill="none"
                  stroke="url(#dmic-grad)"
                  strokeWidth={2.4 / scale}
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 2.2, ease: "easeInOut" }}
                />
                <path
                  d={corridor}
                  fill="none"
                  stroke="#fff"
                  strokeWidth={1.6 / scale}
                  strokeDasharray={`${4 / scale} ${40 / scale}`}
                  className="animate-road motion-reduce:hidden"
                  style={{ animationDuration: "1.6s" }}
                />
              </g>
            )}

            {visibleOffices.map((o) => {
              const [x, y] = project(o.lat, o.lng);
              const r = (o.isHQ ? 5 : 4) / scale;
              const isActive = active?.id === o.id;
              return (
                <g
                  key={o.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${o.label}: ${o.address}`}
                  onClick={() => setActive(o)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(o)}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={x} cy={y} r={r * 3.2} fill={o.isHQ ? "#d5ae62" : "#1db3ff"} opacity={isActive ? 0.35 : 0.15} />
                  <circle cx={x} cy={y} r={r} fill={o.isHQ ? "#d5ae62" : "#ffffff"} stroke={o.isHQ ? "#fff" : "#1db3ff"} strokeWidth={1.4 / scale} />
                  {(scale > 3 || !compact) && (
                    <text
                      x={x + r * 1.8}
                      y={y + r * 0.6}
                      fontSize={(o.isHQ ? 11 : 10) / scale}
                      fontWeight={700}
                      fill="#fff"
                      style={{ paintOrder: "stroke", stroke: "#05070d", strokeWidth: 3 / scale }}
                      fontFamily="Manrope Variable, sans-serif"
                    >
                      {scale > 3 ? o.label.replace("Ahmedabad — ", "") : o.city === "Ahmedabad" ? "" : o.city}
                    </text>
                  )}
                </g>
              );
            })}
            {(view === "india" || view === "dmic") && (
              <text
                {...(() => {
                  const [x, y] = project(23.0, 72.55);
                  return { x: x - 6 / scale, y: y - 12 / scale };
                })()}
                textAnchor="end"
                fontSize={10 / scale}
                fontWeight={700}
                fill="#fff"
                style={{ paintOrder: "stroke", stroke: "#05070d", strokeWidth: 3 / scale }}
                fontFamily="Manrope Variable, sans-serif"
              >
                Gujarat offices
              </text>
            )}
          </motion.svg>

          <AnimatePresence>
            {active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="glass absolute inset-x-3 bottom-3 rounded-2xl p-4 sm:inset-x-auto sm:left-4 sm:max-w-xs"
              >
                <button onClick={() => setActive(null)} aria-label="Close" className="absolute right-3 top-3 text-slate-400 hover:text-white">
                  <Icon name="close" className="size-4" />
                </button>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">{active.isHQ ? "Historical HQ" : "Office"}</p>
                <p className="mt-1 font-heading text-base font-bold text-white">{active.label}</p>
                <p className="mt-1 text-sm text-slate-300">{active.address}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <a href={mapsDirectionsUrl(active)} target="_blank" rel="noopener noreferrer" className="font-semibold text-sky hover:text-white">
                    Directions
                  </a>
                  <Link href={`/contact?from=${encodeURIComponent(active.city)}#quote`} className="font-semibold text-magenta hover:text-white">
                    Enquire
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-white bg-gold" /> Historical headquarters
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-full border border-sky bg-white" /> Listed office
          </li>
          <li className="flex items-center gap-2">
            <span className="h-1 w-6 rounded bg-[linear-gradient(90deg,#1db3ff,#cc2dd3,#ffb547)]" /> DMIC — indicative alignment
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm bg-sky/30 ring-1 ring-sky/70" /> Strategic focus region
          </li>
        </ul>
        <p className="mt-2 text-xs text-slate-500">
          Corridor shown for orientation only. It is not a Rana delivery route, and Rana is not an official DMIC partner. No
          hubs or expansion areas are shown.
        </p>
      </div>

      <aside aria-label="Regions and offices" className="grid content-start gap-3">
        {(highlighted ? REGIONS.filter((r) => r.stateId === highlighted) : REGIONS).map((r) => (
          <button
            key={r.id}
            onClick={() => setView(r.id as View)}
            className={`glass rounded-2xl p-4 text-left transition hover:border-white/20 ${highlighted === r.stateId ? "ring-1 ring-magenta/60" : ""}`}
          >
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-white">{r.name}</p>
            {!compact && <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{r.body}</p>}
          </button>
        ))}
        <Link
          href="/contact#quote"
          className="mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Check Transport Availability <Icon name="arrow" className="size-4" />
        </Link>
      </aside>
    </div>
  );
}
