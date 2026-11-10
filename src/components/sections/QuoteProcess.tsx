"use client";

import { motion, useReducedMotion } from "motion/react";
import { QUOTE_STEPS } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

const icons = ["quote", "truck", "briefcase", "route"];

/** Animated four-step quotation process with a travelling progress line. */
export function QuoteProcess() {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <div className="absolute left-6 top-6 h-[calc(100%-3rem)] w-px bg-white/10 md:left-0 md:top-7 md:h-px md:w-full" aria-hidden />
      <motion.div
        className="absolute left-6 top-6 w-px origin-top bg-brand md:left-0 md:top-7 md:hidden md:h-px"
        style={{ height: "calc(100% - 3rem)" }}
        initial={reduce ? false : { scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute left-0 top-7 hidden h-px w-full origin-left bg-brand md:block"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "0px 0px -12% 0px" }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        aria-hidden
      />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {QUOTE_STEPS.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative flex gap-5 md:block"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ delay: 0.25 + i * 0.35, duration: 0.6 }}
          >
            <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 bg-navy text-white shadow-[0_0_30px_-6px_rgba(29,179,255,0.6)] md:size-14">
              <Icon name={icons[i]} className="size-6 text-sky" />
              <span className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-brand text-[0.65rem] font-bold">
                {i + 1}
              </span>
            </span>
            <div className="md:mt-6">
              <h3 className="font-heading text-lg font-bold text-white">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
