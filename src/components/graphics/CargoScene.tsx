"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";
import { TruckSpec } from "./TruckSpec";
import { vehicle } from "@/content/vehicles";

function Crate({ color, label }: { color: string; label?: string }) {
  return (
    <svg viewBox="0 0 40 40" className="size-full drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]" aria-hidden>
      <rect x="1" y="1" width="38" height="38" rx="3" fill={color} />
      <path d="M1 13h38M1 27h38" stroke="#000" strokeOpacity="0.2" strokeWidth="1.5" />
      <rect x="16" y="1" width="8" height="38" fill="#fff" opacity="0.22" />
      <rect x="1" y="1" width="38" height="38" rx="3" fill="none" stroke="#000" strokeOpacity="0.25" />
      {label && (
        <text x="20" y="23.5" textAnchor="middle" fontSize="7" fontWeight="800" fill="#05070d" opacity="0.65" fontFamily="Inter Variable, sans-serif">
          {label}
        </text>
      )}
    </svg>
  );
}

const CRATES = [
  { color: "#d5ae62", label: "RTL" },
  { color: "#ff7a2f" },
  { color: "#cc2dd3" },
  { color: "#1db3ff", label: "RTL" },
  { color: "#ffb547" },
];

/** seconds: crates load from 0 → ~5.6s, truck departs 5.8–6.9s, next truck reverses in 6.9–8s */
const CYCLE = 8;

/**
 * Loading-bay loop. Coordinates are percentages of the stage:
 * crates leave the bay door, travel the conveyor and land inside the
 * truck's container; the truck then departs and a fresh one reverses in.
 */
export function CargoScene({ className = "" }: { className?: string }) {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "100px 0px" });
  const v = vehicle("lcv-14ft");
  return (
    <div ref={ref} data-anim-scope className={`relative aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-white/[0.07] bg-[linear-gradient(180deg,#0b1424,#05070d)] ${className}`} aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-50" />
      {/* warehouse */}
      <div className="absolute bottom-[16%] left-[3%] h-[60%] w-[30%] rounded-t-2xl border border-white/10 bg-graphite/70">
        <div className="absolute inset-x-[14%] bottom-0 h-[68%] rounded-t-md border border-white/10 bg-[repeating-linear-gradient(0deg,#0b111d_0_5px,#162034_5px_10px)]" />
        <span className="absolute left-[14%] top-[9%] text-[0.55rem] font-bold tracking-[0.3em] text-gold sm:text-[0.7rem]">BAY 01</span>
        <span className="absolute right-[10%] top-[10%] size-2 rounded-full bg-[#25c26a] shadow-[0_0_12px_#25c26a] motion-safe:animate-pulse" />
      </div>
      {/* floor + conveyor */}
      <div className="absolute inset-x-0 bottom-0 h-[16%] border-t border-white/10 bg-[#070b14]" />
      <div className="absolute bottom-[16%] left-[33%] h-[2.2%] w-[14%] rounded-full bg-[repeating-linear-gradient(90deg,#33405a_0_6px,#1b2230_6px_12px)]" />

      {/* truck (rear faces the bay) */}
      <motion.div
        className="absolute bottom-[7%] left-[44%] w-[58%] will-change-transform"
        initial={false}
        animate={reduce || !inView ? { x: 0 } : { x: ["0%", "0%", "120%", "120%", "-6%", "0%"] }}
        transition={reduce || !inView ? { duration: 0 } : { duration: CYCLE, times: [0, 5.8 / CYCLE, 6.9 / CYCLE, 6.92 / CYCLE, 7.8 / CYCLE, 1], repeat: Infinity, ease: "easeInOut" }}
      >
        <TruckSpec v={v} bare animate={false} className="w-full" />
      </motion.div>

      {/* crates — transform-only animation (x is % of the full-width track) */}
      {CRATES.map((c, i) => (
        <motion.div
          key={i}
          className="absolute inset-x-0 will-change-transform"
          style={{ bottom: "17.5%" }}
          initial={false}
          animate={
            reduce || !inView
              ? { x: `${34 + i * 3}%`, opacity: reduce ? 1 : 0 }
              : { x: ["22%", "22%", "48%", "52%", "52%"], opacity: [0, 1, 1, 0, 0] }
          }
          transition={
            reduce || !inView
              ? { duration: 0 }
              : {
                  duration: CYCLE,
                  times: [0, (i * 1.05) / CYCLE, (i * 1.05 + 1.35) / CYCLE, (i * 1.05 + 1.6) / CYCLE, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        >
          <div className="w-[6%]">
            <Crate {...c} />
          </div>
        </motion.div>
      ))}

      <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-midnight/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-slate-300 sm:text-xs">
        <span className="size-1.5 rounded-full bg-sky motion-safe:animate-pulse" /> Loading · Dispatch · Delivery
      </div>
    </div>
  );
}
