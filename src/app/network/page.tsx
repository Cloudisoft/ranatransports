import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { IndiaMap } from "@/components/graphics/IndiaMap";
import { OfficeDirectory } from "@/components/sections/Blocks";
import { REGIONS } from "@/content/offices";

export const metadata: Metadata = {
  title: "Network & DMIC",
  description:
    "Rana Transport & Logistics offices in Nadiad, Ahmedabad, Petlad, Mumbai and New Delhi, and our strategic focus on the Delhi–Mumbai Industrial Corridor.",
  alternates: { canonical: "/network" },
};

export default function NetworkPage() {
  return (
    <>
      <PageHero
        eyebrow="Network & DMIC"
        title={
          <>
            Connecting <span className="text-slate-500">commercial destinations.</span>
          </>
        }
        subtitle="Rooted in Gujarat. Focused on major Indian business corridors."
      >
        <p>
          Rana Transport &amp; Logistics began its journey in Nadiad and has developed a broader business presence. Our
          network and strategic vision focus on connecting businesses through practical road transportation and logistics
          coordination.
        </p>
      </PageHero>

      <section className="py-12 sm:py-16">
        <div className="container-x">
          <IndiaMap initialView="india" />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Our strategic transport focus" title="Four regions. One corridor of opportunity." />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {REGIONS.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 0.06} className="glass rounded-3xl p-6">
                <p className="font-display text-3xl font-bold text-slate-600">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-heading text-lg font-bold uppercase text-white">{r.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{r.body}</p>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <h3 className="font-heading text-lg font-bold uppercase text-white">Pan-India transport requirements</h3>
            <p className="mt-2 text-slate-400">
              We welcome transportation enquiries for destinations across India, with each movement subject to route,
              cargo and vehicle availability.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_50%,rgba(29,179,255,0.15),transparent_55%),radial-gradient(ellipse_at_10%_30%,rgba(252,31,134,0.12),transparent_50%)]" />
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Delhi–Mumbai Industrial Corridor"
            title={
              <>
                Connecting industry. <span className="text-slate-500">Moving India forward.</span>
              </>
            }
          />
          <Reveal delay={0.1} className="space-y-4 text-lg leading-relaxed text-slate-300">
            <p className="font-heading text-xl font-bold text-white">Positioned for India&apos;s industrial future.</p>
            <p>
              The Delhi–Mumbai Industrial Corridor is an important industrial development initiative supporting
              manufacturing, infrastructure investment and commercial connectivity.
            </p>
            <p>
              For transport businesses, industrial development creates opportunities for movement of materials,
              manufactured goods and commercial cargo.
            </p>
            <p>
              With historical roots in Gujarat and a strategic business interest connecting Ahmedabad, Mumbai and Delhi,
              Rana Transport &amp; Logistics aims to develop transportation opportunities relevant to these growing
              business regions — through suitable road transport solutions, practical coordination and long-term
              commercial relationships.
            </p>
            <p className="rounded-2xl border border-amber/25 bg-amber/5 p-4 text-sm text-slate-300">
              Rana Transport &amp; Logistics is not an official DMIC project partner or government-appointed logistics
              operator.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="offices" className="scroll-mt-24 py-16 sm:py-24">
        <div className="container-x">
          <SectionHeading eyebrow="Our business presence" title="Office directory." />
          <div className="mt-12">
            <OfficeDirectory />
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Office locations and postal details should be verified against current company records. Map pins are
            approximate locality positions.
          </p>
        </div>
      </section>

      <CtaBand
        title="Need transportation between business destinations?"
        body="Share your loading and unloading locations."
        primary={{ href: "/contact#quote", label: "Check Transport Availability" }}
      />
    </>
  );
}
