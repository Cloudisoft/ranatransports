"use client";

import { setMotionPaused, useReduceMotion } from "@/lib/motion-pref";
import { Icon } from "./Icon";

export function MotionToggle() {
  const paused = useReduceMotion();
  return (
    <button
      type="button"
      onClick={() => setMotionPaused(!paused)}
      aria-pressed={paused}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-white/25 hover:text-white"
    >
      <Icon name={paused ? "play" : "pause"} className="size-3.5" />
      {paused ? "Play animations" : "Pause animations"}
    </button>
  );
}
