"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useCalmMotion, useReduceMotion } from "@/lib/motion-pref";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { HeroScene } from "@/components/three/HeroScene";
import { VEHICLES } from "@/content/vehicles";

const POINTS = [
  { icon: "legacy", text: "25 Years of Family Transport Heritage" },
  { icon: "truck", text: "Small to Heavy Commercial Vehicle Options" },
  { icon: "route", text: "Pan-India Transportation Enquiries" },
  { icon: "factory", text: "Corporate & Industrial Transport Focus" },
];

function Chip({
  mx,
  my,
  depth,
  className,
  delay,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depth: number;
  className: string;
  delay: number;
  children: React.ReactNode;
}) {
  const x = useTransform(mx, (v) => v * depth);
  const y = useTransform(my, (v) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute hidden lg:block ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="motion-safe:animate-float rounded-2xl border border-white/10 bg-[#0b111c]/70 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          style={{ animationDelay: `${delay}s` }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduceMotion();
  const calm = useCalmMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", calm ? "0%" : "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, calm ? 1 : 0]);

  // mouse parallax (cloudisoft-style data-mouse layers)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 60, damping: 18 });
  const my = useSpring(rawY, { stiffness: 60, damping: 18 });
  useEffect(() => {
    if (calm) return;
    const onMove = (e: PointerEvent) => {
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [calm, rawX, rawY]);

  const word = {
    hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { delay: 0.15 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };
  const line1 = "BEYOND TRANSPORTATION.".split(" ");
  const line2 = "INTO TOMORROW.".split(" ");
  const classes = VEHICLES.length;

  return (
    <section id="hero" ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[84px]">
      <HeroScene poster="/media/truck-angle.jpg" offset={0.2} className="-z-20" />
      {/* legibility veil — strong on the text side only */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,#05070d_0%,rgba(5,7,13,0.86)_30%,rgba(5,7,13,0.25)_58%,transparent_75%)] max-lg:bg-[linear-gradient(180deg,rgba(5,7,13,0.92)_0%,rgba(5,7,13,0.72)_52%,rgba(5,7,13,0.15)_80%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-midnight to-transparent" />

      <motion.div style={{ y: yText, opacity: fade }} className="container-x relative z-10 flex flex-1 flex-col justify-center py-14 lg:py-20">
        <motion.p
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-300 backdrop-blur"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#25c26a] opacity-70 motion-reduce:hidden" />
            <span className="relative size-2 rounded-full bg-[#25c26a]" />
          </span>
          Moving generations · Connecting businesses
        </motion.p>
        <h1 className="max-w-[15ch] font-display text-[clamp(2.6rem,6.4vw,5.6rem)] font-bold leading-[0.92] tracking-[-0.035em] text-white">
          <span className="block">
            {line1.map((w, i) => (
              <motion.span key={w} custom={i} variants={word} initial={reduce ? false : "hidden"} animate="show" className="mr-[0.22em] inline-block">
                {w}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((w, i) => (
              <motion.span key={w} custom={i + 2} variants={word} initial={reduce ? false : "hidden"} animate="show" className="mr-[0.22em] inline-block text-gradient">
                {w}
              </motion.span>
            ))}
          </span>
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-7 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl"
        >
          Three generations of transportation heritage. One commitment to connecting businesses through dependable
          logistics solutions.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <LinkButton href="/contact#quote">Get a Transport Quote</LinkButton>
          <LinkButton href="/services" variant="ghost">
            Explore Our Services
          </LinkButton>
          <LinkButton href="/legacy" variant="ghost" icon={null} className="!text-gold">
            Discover Our Legacy
          </LinkButton>
        </motion.div>
      </motion.div>

      {/* floating glass stat chips over the 3D scene */}
      <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
        <Chip mx={mx} my={my} depth={-22} delay={1.2} className="right-[30%] top-[22%]">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">12-wheeler class · typical</p>
          <p className="mt-0.5 font-display text-2xl font-bold text-white">
            21–25 <span className="text-base text-slate-400">t payload</span>
          </p>
        </Chip>
        <Chip mx={mx} my={my} depth={18} delay={1.35} className="right-[5%] top-[30%]">
          <p className="flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
            <Icon name="truck" className="size-3.5 text-sky" /> Vehicle classes
          </p>
          <p className="mt-0.5 font-display text-2xl font-bold text-white">{classes}</p>
          <p className="text-xs text-slate-400">3-wheeler → 40 ft trailer</p>
        </Chip>
        <Chip mx={mx} my={my} depth={-14} delay={1.5} className="bottom-[24%] right-[12%]">
          <p className="flex items-center gap-2 text-xs font-semibold text-white">
            <span className="size-1.5 rounded-full bg-[#25c26a] shadow-[0_0_10px_#25c26a]" /> Enquiries open · Pan-India
          </p>
          <p className="mt-1 text-xs text-slate-400">Since 1998–2001 · Nadiad, Gujarat</p>
        </Chip>
      </div>

      <div className="relative z-10 border-t border-white/5 bg-midnight/70 backdrop-blur-md">
        <ul className="container-x grid grid-cols-2 gap-px lg:grid-cols-4">
          {POINTS.map((p, i) => (
            <motion.li
              key={p.text}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex items-center gap-3 py-5 pr-3 text-xs font-semibold leading-snug text-slate-200 sm:text-sm"
            >
              <Icon name={p.icon} className="size-5 shrink-0 text-sky" />
              {p.text}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
