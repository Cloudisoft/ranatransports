import Link from "next/link";
import { COMPARISON, HIGHLIGHTS, WHY_RANA } from "@/content/site";
import { APPROVED_SERVICES } from "@/content/services";
import { PUBLISHED_TESTIMONIALS } from "@/content/testimonials";
import { OFFICES, mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl } from "@/content/offices";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const serviceIcon: Record<string, string> = {
  highway: "truck",
  boxes: "box",
  industrial: "factory",
  network: "network",
  longhaul: "route",
  heavy: "truck",
  dumper: "factory",
  corporate: "briefcase",
  fleet: "sync",
  ftl: "box",
};

export function HighlightGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {HIGHLIGHTS.map((h, i) => (
        <Reveal as="li" key={h.title} delay={i * 0.06}>
          <div className="spotlight group glass relative h-full overflow-hidden rounded-3xl p-6 transition duration-500 hover:-translate-y-1 hover:border-white/20 sm:p-7">
            <div className="absolute -right-10 -top-10 size-32 rounded-full bg-brand opacity-0 blur-3xl transition duration-500 group-hover:opacity-30" aria-hidden />
            <span className="grid size-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Icon name={h.icon} className="size-6 text-sky" />
            </span>
            <h3 className="mt-5 font-heading text-lg font-extrabold uppercase tracking-wide text-white">{h.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{h.body}</p>
          </div>
        </Reveal>
      ))}
    </ul>
  );
}

export function ServiceGrid({ limit }: { limit?: number }) {
  const list = limit ? APPROVED_SERVICES.slice(0, limit) : APPROVED_SERVICES;
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s, i) => (
        <Reveal as="li" key={s.slug} delay={(i % 4) * 0.06}>
          <Link
            href={`/services#${s.slug}`}
            className="spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-graphite/80 to-navy/60 p-6 transition duration-500 hover:-translate-y-1 hover:border-white/15"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-brand transition duration-500 group-hover:scale-x-100" aria-hidden />
            <span className="font-display text-xs text-slate-500">{String(i + 1).padStart(2, "0")}</span>
            <Icon name={serviceIcon[s.visual]} className="mt-4 size-7 text-magenta transition group-hover:text-sky" />
            <h3 className="mt-4 font-heading text-base font-bold text-white">{s.title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">{s.short}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-sky">
              Learn more <Icon name="arrow" className="size-3.5 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

export function WhyRanaGrid() {
  return (
    <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/5 bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
      {WHY_RANA.map((w, i) => (
        <Reveal as="li" key={w.title} delay={(i % 3) * 0.06} className="bg-midnight p-6 sm:p-8">
          <span className="font-display text-3xl font-bold text-slate-600">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 font-heading text-lg font-bold text-white">{w.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{w.body}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function Comparison() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.25fr]">
      <Reveal className="rounded-3xl border border-white/5 bg-graphite/40 p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Standard flow</p>
        <h3 className="mt-3 font-heading text-xl font-bold text-slate-300">{COMPARISON.left.title}</h3>
        <ul className="mt-6 grid gap-3">
          {COMPARISON.left.steps.map((s) => (
            <li key={s} className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
              <span className="size-1.5 rounded-full bg-slate-500" /> {s}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs italic text-slate-500">{COMPARISON.left.note}</p>
      </Reveal>
      <Reveal delay={0.1} className="neon-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-midnight p-7 sm:p-9">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-orchid/20 blur-3xl" aria-hidden />
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">The Rana way</p>
        <h3 className="mt-3 font-heading text-xl font-bold text-white sm:text-2xl">{COMPARISON.right.title}</h3>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {COMPARISON.right.steps.map((s, i) => (
            <li key={s} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3 text-sm text-white">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-[0.65rem] font-bold">{i + 1}</span>
              {s}
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  );
}

export function Testimonials() {
  if (PUBLISHED_TESTIMONIALS.length === 0) {
    return (
      <Reveal className="neon-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy via-midnight to-navy p-8 sm:p-14">
        <span className="pointer-events-none absolute -top-10 left-6 font-display text-[12rem] leading-none text-white/5" aria-hidden>
          “
        </span>
        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Customer experiences</p>
            <h3 className="mt-3 font-display text-3xl font-bold uppercase text-white sm:text-4xl">Built on relationships.</h3>
            <p className="mt-5 text-slate-300">
              Every transportation requirement is an opportunity to build trust through communication, careful planning
              and business understanding. Our goal is to create lasting relationships with customers who value practical
              support and professional transport coordination.
            </p>
            <p className="mt-4 text-sm text-slate-400">Verified customer feedback and approved success stories will appear here.</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <p className="font-heading font-bold text-white">Worked with us?</p>
            <p className="mt-2 text-sm text-slate-400">
              We would value hearing how our team supported your transportation requirement. Feedback is published only
              with your written consent.
            </p>
            <a
              href="mailto:contact@ranatransports.in?subject=Customer%20feedback%20for%20Rana%20Transport%20%26%20Logistics"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky hover:text-white"
            >
              Share your experience <Icon name="arrow" className="size-4" />
            </a>
          </div>
        </div>
      </Reveal>
    );
  }
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PUBLISHED_TESTIMONIALS.map((t, i) => (
        <Reveal as="li" key={t.id} delay={i * 0.08}>
          <figure className="glass relative h-full rounded-3xl p-7">
            <span className="absolute right-6 top-2 font-display text-7xl text-white/10" aria-hidden>
              ”
            </span>
            <blockquote className="relative text-slate-200">“{t.quote}”</blockquote>
            <figcaption className="mt-6 text-sm">
              <span className="block font-bold text-white">{t.name}</span>
              <span className="text-slate-400">
                {t.businessType}
                {t.city ? ` · ${t.city}` : ""}
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}

export function OfficeDirectory() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {OFFICES.map((o, i) => (
        <Reveal as="li" key={o.id} delay={(i % 3) * 0.06}>
          <article className={`spotlight glass relative h-full rounded-3xl p-6 ${o.isHQ ? "ring-1 ring-gold/40" : ""}`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${o.isHQ ? "text-gold" : "text-sky"}`}>
              {o.isHQ ? "Historical Headquarters" : o.city}
            </p>
            <h3 className="mt-2 font-heading text-lg font-bold text-white">{o.label}</h3>
            <p className="mt-3 flex gap-2 text-sm leading-relaxed text-slate-300">
              <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-magenta" /> {o.address}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <a href={mapsSearchUrl(o)} target="_blank" rel="noopener noreferrer" className="text-sky hover:text-white">
                View on map
              </a>
              <a href={mapsDirectionsUrl(o)} target="_blank" rel="noopener noreferrer" className="text-sky hover:text-white">
                Directions
              </a>
              <Link href={`/contact?from=${encodeURIComponent(o.city)}#quote`} className="text-magenta hover:text-white">
                Enquire
              </Link>
            </div>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}

/** Compact embedded map (lazy-loaded iframe, no API key required). */
export function OfficeMapEmbed({ officeId = "nadiad", className = "" }: { officeId?: string; className?: string }) {
  const o = OFFICES.find((x) => x.id === officeId)!;
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 ${className}`}>
      <iframe
        title={`Map — ${o.label}`}
        src={mapsEmbedUrl(o)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full grayscale-[0.6] invert-[0.9] hue-rotate-180 contrast-[0.9]"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
      <a
        href={mapsDirectionsUrl(o)}
        target="_blank"
        rel="noopener noreferrer"
        className="glass absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-white"
      >
        <Icon name="pin" className="size-4 text-gold" /> Directions to {o.city}
      </a>
    </div>
  );
}
