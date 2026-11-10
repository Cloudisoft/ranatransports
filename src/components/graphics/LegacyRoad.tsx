"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type Chapter = {
  id: string;
  era: string;
  generation: string;
  headline: string;
  name: string;
  role: string;
  visual: ReactNode;
  children: ReactNode;
};

const ROAD = "M50,0 C82,120 18,210 50,333 C82,456 18,545 50,666 C82,790 18,880 50,1000";

/**
 * Signature scroll animation: a road that draws itself as the visitor scrolls,
 * carrying a truck from the founder's era to the present. The colour shifts
 * from heritage gold to the neon logo spectrum as the story reaches Tej Rana.
 */
export function LegacyRoad({ chapters }: { chapters: Chapter[] }) {
  const root = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGRectElement>(null);
  const measureRef = useRef<SVGPathElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const path = measureRef.current!;
    const total = path.getTotalLength();
    const place = (p: number) => {
      const pt = path.getPointAtLength(total * p);
      const ahead = path.getPointAtLength(Math.min(total, total * p + 4));
      const angle = (Math.atan2(ahead.y - pt.y, (ahead.x - pt.x) * 4) * 180) / Math.PI;
      clipRef.current?.setAttribute("height", String(pt.y));
      if (truckRef.current) {
        truckRef.current.style.left = `${pt.x}%`;
        truckRef.current.style.top = `${pt.y / 10}%`;
        truckRef.current.style.transform = `translate(-50%,-50%) rotate(${angle - 90}deg)`;
      }
    };
    if (reduce) {
      place(1);
      return;
    }
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 60%",
        end: "bottom 60%",
        scrub: 0.6,
        onUpdate: (self) => {
          place(self.progress);
        },
      });
      gsap.utils.toArray<HTMLElement>("[data-chapter]").forEach((el) => {
        gsap.from(el.querySelectorAll("[data-anim]"), {
          opacity: 0,
          y: 40,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        });
      });
    }, root);
    place(0);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative">
      {/* Road */}
      <div className="absolute inset-y-0 left-3 w-10 md:left-1/2 md:w-40 md:-translate-x-1/2" aria-hidden>
        <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          <defs>
            <linearGradient id="legacy-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="1000">
              <stop offset="0" stopColor="#d5ae62" />
              <stop offset="0.3" stopColor="#ffb547" />
              <stop offset="0.55" stopColor="#ff7a2f" />
              <stop offset="0.72" stopColor="#fc1f86" />
              <stop offset="0.86" stopColor="#cc2dd3" />
              <stop offset="1" stopColor="#1db3ff" />
            </linearGradient>
            <clipPath id="legacy-clip">
              <rect ref={clipRef} x="-50" y="-20" width="200" height="0" />
            </clipPath>
          </defs>
          <path ref={measureRef} d={ROAD} fill="none" stroke="none" />
          <path d={ROAD} fill="none" stroke="#0e1522" strokeWidth="26" vectorEffect="non-scaling-stroke" strokeLinecap="round" className="hidden md:block" />
          <path d={ROAD} fill="none" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="10 12" vectorEffect="non-scaling-stroke" className="hidden md:block" />
          <path
            d={ROAD}
            clipPath="url(#legacy-clip)"
            fill="none"
            stroke="url(#legacy-grad)"
            strokeWidth="4"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            className="hidden drop-shadow-[0_0_8px_rgba(252,31,134,0.7)] md:block"
          />
        </svg>
        {/* Mobile: straight road */}
        <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 rounded-full bg-[#0e1522] md:hidden" />
        <div className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#d5ae62,#ffb547_30%,#fc1f86_70%,#1db3ff)] md:hidden" />
        <div
          ref={truckRef}
          className="absolute left-1/2 top-0 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-midnight shadow-[0_0_24px_rgba(252,31,134,0.8)] ring-2 ring-magenta md:grid"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-white" fill="currentColor" aria-hidden>
            <path d="M8 3h8v12H8zM9 15h6v4H9z" opacity=".9" />
            <rect x="9" y="4" width="6" height="3" fill="#1db3ff" />
          </svg>
        </div>
      </div>

      <ol className="relative grid gap-24 md:gap-40">
        {chapters.map((c, i) => (
          <li key={c.id} data-chapter className="relative grid items-center gap-10 pl-16 md:grid-cols-2 md:gap-48 md:pl-0">
            <span
              className="absolute left-[1.75rem] top-2 z-10 size-4 -translate-x-1/2 rounded-full border-2 border-midnight bg-gold shadow-[0_0_0_4px_rgba(213,174,98,0.25)] md:left-1/2"
              aria-hidden
            />
            <div className={`${i % 2 ? "md:order-2" : ""}`}>
              <p data-anim className="font-display text-5xl font-bold text-white/10 sm:text-7xl">
                {c.era}
              </p>
              <p data-anim className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold">
                {c.generation}
              </p>
              <h3 data-anim className="mt-3 font-display text-2xl font-bold uppercase leading-tight text-white sm:text-3xl">
                {c.headline}
              </h3>
              <p data-anim className="mt-4 font-heading text-lg font-bold text-white">
                {c.name}
                <span className="block text-sm font-medium text-slate-400">{c.role}</span>
              </p>
              <div data-anim className="mt-4 space-y-3 text-base leading-relaxed text-slate-300">
                {c.children}
              </div>
            </div>
            <div data-anim className={`flex justify-center ${i % 2 ? "md:order-1" : ""}`}>
              {c.visual}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
