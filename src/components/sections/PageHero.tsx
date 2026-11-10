import type { ReactNode } from "react";
import { NetworkLines } from "@/components/graphics/NetworkLines";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  children,
  visual,
  image,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  children?: ReactNode;
  visual?: ReactNode;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-36 sm:pb-28 sm:pt-44">
      {image && (
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-35"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      )}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_0%,rgba(204,45,211,0.22),transparent_50%),radial-gradient(ellipse_at_10%_100%,rgba(29,179,255,0.18),transparent_55%)]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight/40 via-midnight/70 to-midnight" />
      <NetworkLines className="absolute inset-0 -z-10 size-full opacity-60" />
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display text-[clamp(2.3rem,6vw,4.75rem)] font-bold uppercase leading-[0.98] text-white">{title}</h1>
          {subtitle && <p className="mt-6 font-heading text-lg font-semibold text-gold sm:text-xl">{subtitle}</p>}
          {children && <div className="mt-6 max-w-2xl space-y-4 text-base leading-relaxed text-slate-300 sm:text-lg">{children}</div>}
        </div>
        {visual && <div className="relative">{visual}</div>}
      </div>
    </section>
  );
}
