import type { ReactNode } from "react";

/** Infinite horizontal ticker. Pauses on hover; static for reduced motion. */
export function Marquee({ items, speed = 40, className = "" }: { items: ReactNode[]; speed?: number; className?: string }) {
  const row = (aria: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={aria || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex shrink-0 items-center gap-10 whitespace-nowrap">
          {it}
          <span className="size-1.5 rounded-full bg-gold/60" aria-hidden />
        </li>
      ))}
    </ul>
  );
  return (
    <div
      data-anim-scope
      className={`group relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] ${className}`}
    >
      <div
        className="flex w-max will-change-transform animate-[marquee_var(--d)_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ ["--d" as string]: `${speed}s` }}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
