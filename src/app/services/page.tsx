import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { QuoteProcess } from "@/components/sections/QuoteProcess";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { VehicleArt } from "@/components/graphics/VehicleArt";
import { CargoScene } from "@/components/graphics/CargoScene";
import { HighwayScene } from "@/components/graphics/HighwayScene";
import { NetworkLines } from "@/components/graphics/NetworkLines";
import { APPROVED_SERVICES, type Service } from "@/content/services";

export const metadata: Metadata = {
  title: "Transport & Logistics Services",
  description:
    "Road freight, commercial goods, industrial cargo, intercity and long-distance transport, heavy commercial vehicles, dumpers for construction material and corporate logistics from Rana Transport & Logistics.",
  alternates: { canonical: "/services" },
};

function ServiceVisual({ s, i }: { s: Service; i: number }) {
  const frame = "relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_100%,#13284a,#071426_55%,#05070d)]";
  switch (s.visual) {
    case "highway":
      return (
        <div className={frame}>
          <HighwayScene className="absolute inset-0" dense={false} />
        </div>
      );
    case "boxes":
      return <CargoScene />;
    case "network":
    case "longhaul":
      return (
        <div className={frame}>
          <NetworkLines className="absolute inset-0 size-full" />
          <VehicleArt art={s.visual === "longhaul" ? "container" : "truck10"} uid={`svc-${s.slug}`} className="absolute inset-x-[8%] bottom-[6%] w-[84%]" />
        </div>
      );
    default: {
      const art = ({ industrial: "truck12", heavy: "truck12", dumper: "dumper", corporate: "container", fleet: "lcv", ftl: "truck10" } as const)[
        s.visual as "industrial" | "heavy" | "dumper" | "corporate" | "fleet" | "ftl"
      ];
      return (
        <div className={`${frame} group`}>
          <div className="grid-bg absolute inset-0 opacity-60" />
          <div className="absolute inset-x-0 bottom-[12%] h-px bg-gradient-to-r from-transparent via-magenta/60 to-transparent" />
          <VehicleArt
            art={art}
            axles={s.visual === "dumper" ? 4 : undefined}
            uid={`svc-${s.slug}-${i}`}
            className="absolute inset-x-[8%] bottom-[8%] w-[84%] [&_.dumper-tub]:animate-[tip_5s_ease-in-out_infinite] motion-reduce:[&_.dumper-tub]:animate-none"
          />
          {s.visual === "fleet" && (
            <VehicleArt art="truck6" uid={`svc-fleet-b`} className="absolute left-[4%] top-[10%] w-[44%] opacity-40" />
          )}
        </div>
      );
    }
  }
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transport & Logistics Services"
        title={
          <>
            Transport solutions for a <span className="text-gradient">business world in motion.</span>
          </>
        }
        image="/media/truck-angle.jpg"
      >
        <p>
          From everyday commercial cargo to larger industrial movements, Rana Transport &amp; Logistics helps businesses
          explore suitable transportation options through practical planning and coordination.
        </p>
      </PageHero>

      <nav aria-label="Services" className="sticky top-[72px] z-30 border-y border-white/5 bg-midnight/85 backdrop-blur-xl">
        <ul className="container-x flex gap-2 overflow-x-auto py-3">
          {APPROVED_SERVICES.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a href={`#${s.slug}`} className="block rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:border-white/25 hover:text-white">
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="py-12">
        {APPROVED_SERVICES.map((s, i) => (
          <section key={s.slug} id={s.slug} className="scroll-mt-36 py-14 sm:py-20">
            <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal className={i % 2 ? "lg:order-2" : ""}>
                <ServiceVisual s={s} i={i} />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="font-display text-sm font-bold text-sky">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-2 font-display text-3xl font-bold uppercase leading-tight text-white sm:text-4xl">{s.title}</h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-200">{s.intro}</p>
                <p className="mt-3 leading-relaxed text-slate-400">{s.body}</p>
                <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div className="glass rounded-2xl p-4">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">Who it serves</dt>
                    <dd className="mt-1.5 text-sm text-slate-200">{s.idealFor}</dd>
                  </div>
                  <div className="glass rounded-2xl p-4">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">Typical cargo</dt>
                    <dd className="mt-1.5 text-sm text-slate-200">{s.cargo.join(" · ")}</dd>
                  </div>
                  <div className="glass rounded-2xl p-4 sm:col-span-2">
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">How we plan it</dt>
                    <dd className="mt-1.5 text-sm text-slate-200">{s.planning}</dd>
                  </div>
                </dl>
                <Link
                  href={`/contact?service=${s.slug}#quote`}
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white"
                >
                  Request a Quotation <Icon name="arrow" className="size-4" />
                </Link>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How to obtain a quotation" title="A simple, personal process." />
          <div className="mt-14">
            <QuoteProcess />
          </div>
          <p className="mt-12 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
            We do not currently advertise customs clearance, international freight, warehousing, hazardous-goods,
            cold-chain or specialised oversized-load operations. Please contact our team to discuss any such requirement.
          </p>
        </div>
      </section>

      <CtaBand
        title="Your transport requirement deserves the right solution."
        body="Share your cargo details and let us review the options."
        primary={{ href: "/contact#quote", label: "Request a Quotation" }}
        note="All services depend on cargo suitability, route availability, lawful vehicle capacity and operational confirmation."
      />
    </>
  );
}
