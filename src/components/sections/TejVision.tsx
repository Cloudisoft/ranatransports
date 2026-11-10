import { Portrait } from "@/components/graphics/Portrait";
import { FutureExpressway } from "@/components/graphics/FutureExpressway";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { leader, DIRECTION } from "@/content/leadership";

export function TejVision({ withDirection = false }: { withDirection?: boolean }) {
  const t = leader("tej");
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <FutureExpressway className="-z-10 opacity-40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight via-midnight/80 to-midnight" />
      <div className="container-x grid items-center gap-14 lg:grid-cols-[auto_1fr] lg:gap-20">
        <Reveal className="flex justify-center">
          <div className="relative">
            <Portrait src={t.photo} alt={t.photoAlt!} initials={t.initials} size="xl" tone="brand" />
            <span className="glass absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Chief Executive Officer
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky">Leading our future · Third generation</p>
          <h2 className="mt-4 font-display text-[clamp(2.1rem,5vw,4rem)] font-bold uppercase leading-[0.98] text-white">
            The legacy continues. <span className="text-gradient">The future moves forward.</span>
          </h2>
          <p className="mt-6 font-heading text-2xl font-bold text-white">{t.name}</p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-300">{t.summary}</p>
          {withDirection ? (
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {DIRECTION.map((d) => (
                <li key={d.title} className="glass rounded-2xl p-5">
                  <p className="font-heading font-bold text-white">{d.title}</p>
                  <p className="mt-1.5 text-sm text-slate-400">{d.body}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/leadership">Leadership &amp; Vision</LinkButton>
              <LinkButton href="/digital-logistics" variant="ghost">
                Digital Logistics
              </LinkButton>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
