"use client";

import { motion, useReducedMotion } from "motion/react";
import { VehicleArt } from "./VehicleArt";

function Crate({ color = "#d5ae62", label }: { color?: string; label?: string }) {
  return (
    <svg viewBox="0 0 40 40" className="size-full" aria-hidden>
      <rect x="1" y="1" width="38" height="38" rx="3" fill={color} />
      <rect x="1" y="1" width="38" height="38" rx="3" fill="url(#crate-shade)" />
      <path d="M1 14h38M1 26h38" stroke="#000" strokeOpacity="0.18" strokeWidth="2" />
      <rect x="15" y="1" width="10" height="38" fill="#fff" opacity="0.18" />
      {label && (
        <text x="20" y="24" textAnchor="middle" fontSize="7" fontWeight="700" fill="#05070d" opacity="0.7">
          {label}
        </text>
      )}
      <defs>
        <linearGradient id="crate-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.25" />
          <stop offset="1" stopColor="#000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const crates = [
  { color: "#d5ae62", label: "RTL" },
  { color: "#ff7a2f" },
  { color: "#cc2dd3" },
  { color: "#1db3ff", label: "RTL" },
];

/**
 * Loading-bay loop: crates travel along a conveyor ramp into a truck, which
 * then departs and returns empty — a compact cargo loading / unloading story.
 */
export function CargoScene({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const cycle = 8;
  return (
    <div className={`relative aspect-[16/9] w-full overflow-hidden rounded-3xl bg-gradient-to-b from-navy to-midnight ${className}`} aria-hidden>
      <div className="grid-bg absolute inset-0 opacity-60" />
      {/* warehouse wall + bay door */}
      <div className="absolute bottom-[18%] left-[4%] h-[62%] w-[34%] rounded-t-xl border border-white/10 bg-graphite/80">
        <div className="absolute inset-x-[12%] bottom-0 h-[70%] rounded-t-md border border-white/10 bg-[repeating-linear-gradient(0deg,#0b111d_0_6px,#141c2b_6px_12px)]" />
        <div className="absolute left-[12%] top-[8%] text-[0.55rem] font-bold tracking-[0.3em] text-gold sm:text-xs">BAY 01</div>
        <div className="absolute right-[10%] top-[9%] size-2 rounded-full bg-[#25c26a] shadow-[0_0_12px_#25c26a]" />
      </div>
      {/* floor */}
      <div className="absolute inset-x-0 bottom-0 h-[18%] border-t border-white/10 bg-[#070b14]" />
      <div className="absolute inset-x-0 bottom-[9%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      {/* conveyor */}
      <div className="absolute bottom-[18%] left-[30%] h-[3%] w-[24%] origin-left -rotate-[8deg] rounded-full bg-[repeating-linear-gradient(90deg,#2a3446_0_8px,#1b2230_8px_16px)]" />

      {/* crates moving into truck */}
      {crates.map((c, i) => (
        <motion.div
          key={i}
          className="absolute bottom-[19%] left-[22%] w-[7%]"
          initial={false}
          animate={
            reduce
              ? { x: `${i * 110}%` }
              : {
                  x: ["0%", "0%", "430%", "430%", "430%"],
                  y: ["0%", "0%", "-60%", "-60%", "-60%"],
                  opacity: [0, 1, 1, 0, 0],
                }
          }
          transition={reduce ? undefined : { duration: cycle, times: [0, 0.08 + i * 0.08, 0.3 + i * 0.08, 0.36 + i * 0.08, 1], repeat: Infinity, ease: "easeInOut" }}
        >
          <Crate {...c} />
        </motion.div>
      ))}

      {/* truck drives away loaded and returns */}
      <motion.div
        className="absolute bottom-[6%] left-[50%] w-[48%]"
        initial={false}
        animate={reduce ? { x: 0 } : { x: ["0%", "0%", "140%", "-160%", "0%"] }}
        transition={reduce ? undefined : { duration: cycle, times: [0, 0.68, 0.82, 0.83, 1], repeat: Infinity, ease: "easeInOut" }}
      >
        <VehicleArt art="lcv" uid="cargo-truck" className="w-full" />
      </motion.div>

      <div className="absolute right-4 top-4 rounded-full border border-white/10 bg-midnight/70 px-3 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-sky sm:text-xs">
        Loading · Dispatch · Delivery
      </div>
    </div>
  );
}
