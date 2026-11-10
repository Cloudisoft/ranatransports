"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { LinkButton } from "@/components/ui/Button";
import { HighwayScene } from "@/components/graphics/HighwayScene";
import { Icon } from "@/components/ui/Icon";

const POINTS = [
  { icon: "legacy", text: "25 Years of Family Transport Heritage" },
  { icon: "truck", text: "Small to Heavy Commercial Vehicle Options" },
  { icon: "route", text: "Pan-India Transportation Enquiries" },
  { icon: "factory", text: "Corporate & Industrial Transport Focus" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "18%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  const word = {
    hidden: { opacity: 0, y: "0.6em", rotateX: -40 },
    show: (i: number) => ({ opacity: 1, y: 0, rotateX: 0, transition: { delay: 0.15 + i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const } }),
  };
  const line1 = "BEYOND TRANSPORTATION.".split(" ");
  const line2 = "INTO TOMORROW.".split(" ");

  return (
    <section id="hero" ref={ref} className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[72px]">
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
        <video
          className="absolute inset-0 size-full scale-110 object-cover opacity-55"
          src="/media/hero-loop.mp4"
          poster="/media/truck-front.jpg"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,transparent,#05070d_75%)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight via-midnight/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-midnight to-transparent" />
      </motion.div>

      <motion.div style={{ y: yText, opacity: fade }} className="container-x relative z-10 flex flex-1 flex-col justify-center py-16">
        <motion.p
          initial={reduce ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-gold backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-gold shadow-[0_0_10px_#d5ae62]" /> Moving Generations · Connecting Businesses
        </motion.p>
        <h1 className="max-w-5xl font-display text-[clamp(2.6rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-tight text-white [perspective:600px]">
          <span className="block">
            {line1.map((w, i) => (
              <motion.span key={w} custom={i} variants={word} initial={reduce ? false : "hidden"} animate="show" className="mr-[0.25em] inline-block">
                {w}
              </motion.span>
            ))}
          </span>
          <span className="block">
            {line2.map((w, i) => (
              <motion.span key={w} custom={i + 2} variants={word} initial={reduce ? false : "hidden"} animate="show" className="mr-[0.25em] inline-block text-gradient animate-shimmer">
                {w}
              </motion.span>
            ))}
          </span>
        </h1>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
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

      <HighwayScene className="relative h-[26vh] min-h-[170px] w-full sm:h-[30vh]" />

      <div className="relative z-10 border-y border-white/5 bg-midnight/80 backdrop-blur">
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
