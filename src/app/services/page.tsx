import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { QuoteProcess } from "@/components/sections/QuoteProcess";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { TruckSpec } from "@/components/graphics/TruckSpec";
import { formatCapacity, vehicle } from "@/content/vehicles";
import { CargoScene } from "@/components/graphics/CargoScene";
import { HighwayScene } from "@/components/graphics/HighwayScene";
import { APPROVED_SERVICES, type Service } from "@/content/services";

export const metadata: Metadata = {
  title: "Transport & Logistics Services",
  description:
    "Road freight, commercial goods, industrial cargo, intercity and long-distance transport, heavy commercial vehicles, dumpers for construction material and corporate logistics from Rana Transport & Logistics.",
  alternates: { canonical: "/services" },
};

function ServiceVisual({ s }: { s: Service }) {
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
    default: {
      const v = vehicle(SERVICE_VEHICLE[s.visual] ?? "truck-10w");
      return (
        <div className="group overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b111c] p-2">
          <div className="spec-paper rounded-[22px]">
            <TruckSpec v={v} className="block h-auto w-full" />
          </div>
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
            <span className="text-slate-400">
              Typical vehicle: <span className="font-semibold text-white">{v.name}</span>
            </span>
            <span className="rounded-lg bg-[#e8f1ff] px-2.5 py-1 text-xs font-bold text-[#0b1b33]">{formatCapacity(v.capacityKg)}</span>
          </div>
        </div>
      );
    }
  }
}

const SERVICE_VEHICLE: Record<string, string> = {
  industrial: "truck-12w",
  network: "lcv-17ft",
  longhaul: "container-32ft",
  heavy: "truck-10w",
  dumper: "tipper-12w",
  corporate: "container-20ft",
  fleet: "icv-19ft",
  ftl: "truck-6w",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Transport & Logistics Services"
        title={
          <>
            Transport solutions for a <span className="text-slate-500">business world in motion.</span>
          </>
        }
        image="/media/truck-angle.jpg"
      >
        <p>
          From everyday commercial cargo to larger industrial movements, Rana Transport &amp; Logistics helps businesses
          explore suitable transportation options through practical planning and coordination.
        </p>
      </PageHero>

      <nav aria-label="Services" className="sticky top-[84px] z-30 border-y border-white/5 bg-midnight/85 backdrop-blur-xl">
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
                <ServiceVisual s={s} />
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
