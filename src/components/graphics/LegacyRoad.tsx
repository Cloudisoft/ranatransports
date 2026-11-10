"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { isMotionPaused } from "@/lib/motion-pref";

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

/** Tractor-trailer seen from directly above, nose pointing down the road. */
function TopDownTruck() {
  return (
    <svg viewBox="0 0 40 100" className="block h-auto w-full overflow-visible drop-shadow-[0_8px_14px_rgba(0,0,0,0.7)]" aria-hidden>
      <defs>
        <linearGradient id="td-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="td-stripe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1db3ff" />
          <stop offset="0.45" stopColor="#cc2dd3" />
          <stop offset="0.75" stopColor="#fc1f86" />
          <stop offset="1" stopColor="#ffb547" />
        </linearGradient>
        <linearGradient id="td-cab" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c9d0db" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d0db" />
        </linearGradient>
      </defs>
      {/* headlight beams */}
      <path d="M12 93 L2 140 L18 140 Z M28 93 L22 140 L38 140 Z" fill="url(#td-beam)" opacity="0.55" />
      {/* wheels peeking out */}
      {[10, 16, 50, 56, 82].map((y) => (
        <g key={y}>
          <rect x="3.5" y={y} width="3.5" height="6" rx="1" fill="#05070d" />
          <rect x="33" y={y} width="3.5" height="6" rx="1" fill="#05070d" />
        </g>
      ))}
      {/* trailer */}
      <rect x="6" y="1" width="28" height="64" rx="2.5" fill="#1a2334" stroke="#2f3b52" strokeWidth="0.8" />
      {[9, 17, 25, 33, 41, 49, 57].map((y) => (
        <line key={y} x1="8" x2="32" y1={y} y2={y} stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" />
      ))}
      <rect x="18.5" y="3" width="3" height="60" rx="1.5" fill="url(#td-stripe)" />
      <rect x="7" y="1.5" width="4" height="2" rx="0.8" fill="#ff2a4a" />
      <rect x="29" y="1.5" width="4" height="2" rx="0.8" fill="#ff2a4a" />
      {/* fifth-wheel coupling */}
      <rect x="17" y="64" width="6" height="4" fill="#0b0f16" />
      {/* cab */}
      <rect x="7" y="67" width="26" height="25" rx="5" fill="url(#td-cab)" stroke="#8d97a8" strokeWidth="0.6" />
      <rect x="9.5" y="69" width="21" height="11" rx="3.5" fill="#e6eaf0" />
      <rect x="13" y="71" width="14" height="1.6" rx="0.8" fill="#ffb547" />
      <path d="M9 84 Q20 81.5 31 84 L30 89 Q20 87.5 10 89 Z" fill="#0b2747" />
      {/* mirrors */}
      <rect x="3" y="83" width="4.5" height="2" rx="1" fill="#0b0f16" />
      <rect x="32.5" y="83" width="4.5" height="2" rx="1" fill="#0b0f16" />
      {/* headlights */}
      <rect x="9.5" y="90.5" width="5" height="1.8" rx="0.9" fill="#fff6e0" />
      <rect x="25.5" y="90.5" width="5" height="1.8" rx="0.9" fill="#fff6e0" />
    </svg>
  );
}

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
  const roadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduce = isMotionPaused();
    const path = measureRef.current!;
    const total = path.getTotalLength();
    const desktopMq = window.matchMedia("(min-width: 768px)");
    let last = -1;
    const place = (p: number) => {
      last = p;
      const box = roadRef.current;
      const truck = truckRef.current;
      if (!box || !truck) return;
      const w = box.clientWidth;
      const h = box.clientHeight;
      let x: number;
      let y: number;
      let heading: number;
      if (desktopMq.matches) {
        // path is drawn in a 100×1000 box stretched to the element → convert to px
        const pt = path.getPointAtLength(total * p);
        const a = path.getPointAtLength(Math.min(total, total * p + 6));
        const b = path.getPointAtLength(Math.max(0, total * p - 6));
        x = (pt.x / 100) * w;
        y = (pt.y / 1000) * h;
        heading = (Math.atan2(((a.y - b.y) / 1000) * h, ((a.x - b.x) / 100) * w) * 180) / Math.PI;
        clipRef.current?.setAttribute("height", String(pt.y));
      } else {
        x = w / 2;
        y = p * h;
        heading = 90;
      }
      // truck art faces down (+y); heading 90° = straight down
      truck.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -50%) rotate(${(heading - 90).toFixed(2)}deg)`;
    };
    const onResize = () => last >= 0 && place(last);
    window.addEventListener("resize", onResize);
    if (reduce) {
      place(1);
      return () => window.removeEventListener("resize", onResize);
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
    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={root} className="relative">
      {/* Road */}
      <div ref={roadRef} className="absolute inset-y-0 left-3 w-10 md:left-1/2 md:w-40 md:-translate-x-1/2" aria-hidden>
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
        <div ref={truckRef} className="absolute left-0 top-0 z-10 w-[22px] will-change-transform md:w-[30px]">
          <TopDownTruck />
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
