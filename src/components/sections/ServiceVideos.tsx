"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Icon } from "@/components/ui/Icon";

const VIDEOS = [
  {
    slug: "services-road-freight",
    title: "Road Freight & Commercial Transport",
    short: "Road freight",
    duration: "0:26",
    summary:
      "How we plan road freight around your cargo, route and timing — commercial goods, industrial cargo, regional & intercity and long-distance movements, from our Nadiad base to offices in Ahmedabad, Petlad, Mumbai and New Delhi.",
  },
  {
    slug: "services-vehicles-bulk",
    title: "Heavy Trucks, Tippers & Bulk",
    short: "Vehicles & bulk",
    duration: "0:26",
    summary:
      "The vehicle classes we coordinate — from a 750 kg mini truck to 21–25 t 12-wheelers, 32 ft containers and 40 ft trailers — plus tippers for sand, soil and aggregates, and full-truckload bulk cargo. Figures are typical for each class and confirmed per enquiry.",
  },
  {
    slug: "services-corporate-quote",
    title: "Corporate Logistics & Quotations",
    short: "Corporate & quotes",
    duration: "0:26",
    summary:
      "Recurring and contract-based transport, fleet & vehicle coordination and B2B distribution — and the four steps to a quotation: share your requirement, we review options, you receive a quote, we plan the movement.",
  },
];

/** Three sub-30-second motion-graphic explainers with an original background score. */
export function ServiceVideos() {
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const wrap = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrap, { amount: 0.45 });
  const v = VIDEOS[active];

  // autoplay (muted) while in view; pause when scrolled away
  useEffect(() => {
    const el = video.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (inView && !reduce) el.play().catch(() => {});
    else el.pause();
  }, [inView, active]);

  const select = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  const toggleSound = () => {
    const el = video.current!;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (el.paused) el.play().catch(() => {});
  };

  return (
    <div ref={wrap} className="grid gap-6 lg:grid-cols-[1.55fr_1fr] lg:items-start">
      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_40px_100px_-40px_rgba(252,31,134,0.45)]">
        <div className="relative aspect-video">
          <AnimatePresence mode="wait">
            <motion.video
              key={v.slug}
              ref={video}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0 size-full object-cover"
              src={`/media/${v.slug}.mp4`}
              poster={`/media/${v.slug}-poster.jpg`}
              muted={muted}
              playsInline
              preload="metadata"
              controls={false}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
              onEnded={() => select((active + 1) % VIDEOS.length)}
              aria-label={`${v.title} — ${v.summary}`}
            />
          </AnimatePresence>
          <button
            type="button"
            onClick={() => {
              const el = video.current!;
              if (el.paused) el.play().catch(() => {});
              else el.pause();
            }}
            className="absolute inset-0 grid place-items-center"
            aria-label={playing ? `Pause ${v.title}` : `Play ${v.title}`}
          >
            {!playing && (
              <span className="grid size-20 place-items-center rounded-full bg-white/90 text-midnight shadow-2xl transition hover:scale-105">
                <Icon name="play" className="ml-1 size-8" />
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-3 border-t border-white/10 bg-[#0a0f1a] px-4 py-3">
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition ${
              muted ? "bg-white text-midnight" : "bg-white/10 text-white"
            }`}
          >
            <Icon name={muted ? "volumeOff" : "volumeOn"} className="size-4" />
            {muted ? "Turn sound on" : "Sound on"}
          </button>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div className="h-full bg-brand" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="text-xs tabular-nums text-slate-400">{v.duration}</span>
        </div>
      </div>

      <div>
        <ol className="grid gap-3">
          {VIDEOS.map((x, i) => (
            <li key={x.slug}>
              <button
                type="button"
                onClick={() => select(i)}
                aria-pressed={active === i}
                className={`spotlight group flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${
                  active === i ? "border-white/25 bg-white/[0.06]" : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <span className="relative block aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/media/${x.slug}-poster.jpg`} alt="" loading="lazy" className="size-full object-cover" />
                  {active === i && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20">
                      <span className="block h-full bg-brand" style={{ width: `${progress * 100}%` }} />
                    </span>
                  )}
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sky">
                    Video {i + 1} · {x.duration}
                  </span>
                  <span className="mt-1 block font-heading text-[0.95rem] font-bold leading-snug text-white">{x.title}</span>
                </span>
              </button>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-500">In this video</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{v.summary}</p>
        </div>
      </div>
    </div>
  );
}
