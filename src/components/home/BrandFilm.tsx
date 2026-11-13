"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCalmMotion, useReduceMotion } from "@/lib/motion-pref";
import { Icon } from "@/components/ui/Icon";

/**
 * Section 1 — the official Rana brand film. Muted inline autoplay (where the
 * browser allows), poster fallback, play/pause, sound and replay controls.
 * As the visitor scrolls, the film recedes into the page (no forced intro).
 */
export function BrandFilm() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReduceMotion();
  const calm = useCalmMotion();
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ended, setEnded] = useState(false);
  const [progress, setProgress] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, calm ? 1 : 0.86]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, calm ? 1 : 0.2]);

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (reduce) {
      v.pause();
      return;
    }
    v.play().catch(() => setPlaying(false));
  }, [reduce]);

  const toggle = () => {
    const v = video.current!;
    if (v.paused) v.play();
    else v.pause();
  };
  const replay = () => {
    const v = video.current!;
    v.currentTime = 0;
    setEnded(false);
    v.play();
  };
  const toggleSound = () => {
    const v = video.current!;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted && v.paused) v.play();
  };

  return (
    <section ref={ref} aria-label="Rana brand film" className="relative h-[min(100vw,78svh)] bg-black sm:h-[100svh] sm:min-h-[460px]">
      <motion.div style={{ scale, opacity }} className="h-full w-full overflow-hidden will-change-transform">
        <video
          ref={video}
          className="absolute inset-0 size-full object-cover"
          poster="/media/rana-brand-film-poster.jpg"
          muted
          playsInline
          preload="metadata"
          autoPlay={!reduce}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setEnded(true);
            setPlaying(false);
          }}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
          aria-label="Rana Transports & Logistics brand film: a truck formed of light drives towards the Rana logo. A part of Rana Enterprise, serving from 25 years, all over India."
        >
          {/* AI-enhanced 1080p master: AV1 first (sharper per MB), H.264 for older browsers */}
          <source src="/media/rana-brand-film-1080p-av1.mp4" type='video/mp4; codecs="av01.0.08M.08"' />
          <source src="/media/rana-brand-film-1080p.mp4" type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-midnight to-transparent" />

        {ended && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 grid place-items-center bg-black/40">
            <a href="#hero" className="group flex flex-col items-center gap-3 text-white">
              <span className="font-display text-sm uppercase tracking-[0.4em] text-slate-200">Enter</span>
              <span className="grid size-14 place-items-center rounded-full bg-brand transition group-hover:scale-110">
                <Icon name="arrowDown" className="size-6" />
              </span>
            </a>
          </motion.div>
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-4 pr-24 sm:p-8 sm:pr-28">
          <div className="flex items-center gap-2">
            <button onClick={toggle} aria-label={playing ? "Pause brand film" : "Play brand film"} className="glass grid size-11 place-items-center rounded-full text-white hover:bg-white/10">
              <Icon name={playing ? "pause" : "play"} className="size-4" />
            </button>
            <button onClick={toggleSound} aria-label={muted ? "Turn sound on" : "Mute"} aria-pressed={!muted} className="glass grid size-11 place-items-center rounded-full text-white hover:bg-white/10">
              <Icon name={muted ? "volumeOff" : "volumeOn"} className="size-4" />
            </button>
            <button onClick={replay} aria-label="Replay brand film" className="glass grid size-11 place-items-center rounded-full text-white hover:bg-white/10">
              <Icon name="replay" className="size-4" />
            </button>
            <div className="ml-2 hidden h-1 w-40 overflow-hidden rounded-full bg-white/15 sm:block" aria-hidden>
              <div className="h-full bg-brand" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
          <a href="#hero" className="glass inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white/10">
            Skip <Icon name="arrowDown" className="size-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}
