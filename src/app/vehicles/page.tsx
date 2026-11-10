import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { VehicleShowcase } from "@/components/sections/VehicleShowcase";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TruckSpec } from "@/components/graphics/TruckSpec";
import { vehicle } from "@/content/vehicles";

export const metadata: Metadata = {
  title: "Vehicles & Load Capacities",
  description:
    "Explore light commercial vehicles, 6 to 12 wheeler trucks, dumpers and container / long-haul options. Indicative payloads and body lengths — availability confirmed on enquiry.",
  alternates: { canonical: "/vehicles" },
};

export default function VehiclesPage() {
  return (
    <>
      <PageHero
        eyebrow="Vehicles & Load Capacities"
        title={
          <>
            From small commercial loads <span className="text-slate-500">to heavy transportation.</span>
          </>
        }
        subtitle="Different loads. Different requirements. The right vehicle matters."
        visual={
          <div className="relative aspect-[4/3]">
            <div className="absolute inset-0 rounded-full bg-orchid/20 blur-3xl" aria-hidden />
            <div className="spec-paper absolute inset-x-0 top-0 rounded-[24px] p-2 shadow-[0_40px_80px_-40px_rgba(29,179,255,0.5)] motion-safe:animate-float">
              <TruckSpec v={vehicle("truck-12w")} className="block h-auto w-full" />
            </div>
            <div className="spec-paper auto-tip absolute -bottom-4 right-[-4%] w-[58%] rounded-[20px] p-1.5 shadow-2xl ring-1 ring-white/10">
              <TruckSpec v={vehicle("tipper-10w")} className="block h-auto w-full" />
            </div>
          </div>
        }
      >
        <p>Explore vehicle categories based on cargo size, vehicle configuration and transportation needs.</p>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <VehicleShowcase detailed />
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="Heavy dumper solutions"
            title="Built for construction & bulk material."
            lead={
              <>
                <p>
                  Dumper capacity depends on chassis, permitted gross vehicle weight, body volume, material density and
                  axle configuration. Share your material, quantity and site details — our team will propose a suitable
                  configuration.
                </p>
              </>
            }
          />
          <Reveal className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#0b111c] p-2">
            <div className="spec-paper auto-tip rounded-[22px]">
              <TruckSpec v={vehicle("tipper-12w")} className="block h-auto w-full" />
            </div>
            <p className="px-4 py-3 text-sm text-slate-400">
              12 Wheeler Tipper · body ≈ 18 m³ · typical payload 20–25 t, subject to material density and permitted GVW.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Not sure which vehicle fits your load?"
        body="Tell us the weight, cargo type and transport route."
        primary={{ href: "/contact?vehicle=Not%20sure%20%E2%80%94%20please%20advise#quote", label: "Find a Suitable Vehicle" }}
      />
    </>
  );
}
