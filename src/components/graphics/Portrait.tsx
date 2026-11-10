"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReduceMotion } from "@/lib/motion-pref";

/**
 * Circular portrait with a champagne-gold frame and a circular "iris" reveal.
 * Falls back to an elegant monogram — never a generated face.
 */
export function Portrait({
  src,
  alt,
  initials,
  size = "md",
  tone = "gold",
  objectPosition = "50% 30%",
  priority,
}: {
  src?: string;
  alt: string;
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  tone?: "gold" | "brand";
  objectPosition?: string;
  priority?: boolean;
}) {
  const reduce = useReduceMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const dims = { sm: "size-24", md: "size-40 sm:size-48", lg: "size-56 sm:size-64", xl: "size-64 sm:size-80" }[size];
  const ring =
    tone === "gold"
      ? "bg-[conic-gradient(from_210deg,#f3dfae,#d5ae62,#8c6a2e,#f3dfae,#d5ae62)]"
      : "bg-[conic-gradient(from_200deg,#ffb547,#fc1f86,#cc2dd3,#5b4cf0,#1db3ff,#ffb547)]";
  return (
    <div ref={ref} className={`relative ${dims} shrink-0`}>
      <div className={`absolute -inset-6 rounded-full blur-2xl ${tone === "gold" ? "bg-gold/20" : "bg-orchid/25"}`} aria-hidden />
      <div className={`relative size-full rounded-full p-[3px] ${ring} shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)]`}>
        <div className="relative size-full overflow-hidden rounded-full bg-midnight ring-4 ring-midnight">
        <motion.div
          className="relative size-full overflow-hidden rounded-full bg-graphite"
          initial={reduce ? false : { clipPath: "circle(0% at 50% 50%)" }}
          animate={inView || reduce ? { clipPath: "circle(75% at 50% 50%)" } : undefined}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {src ? (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 256px, 320px"
              className="object-cover"
              style={{ objectPosition }}
              priority={priority}
            />
          ) : (
            <div
              role="img"
              aria-label={`${alt} — monogram placeholder until an approved photograph is provided`}
              className="grid size-full place-items-center bg-[radial-gradient(circle_at_30%_25%,#1b2a44,#071426_60%,#05070d)]"
            >
              <span className="font-display text-[clamp(2.5rem,7vw,5rem)] font-bold tracking-widest text-gradient">{initials}</span>
            </div>
          )}
        </motion.div>
        </div>
      </div>
    </div>
  );
}
