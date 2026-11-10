import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { VehicleShowcase } from "@/components/sections/VehicleShowcase";
import { CtaBand } from "@/components/sections/CtaBand";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { VehicleArt } from "@/components/graphics/VehicleArt";

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
            From small commercial loads <span className="text-gradient">to heavy transportation.</span>
          </>
        }
        subtitle="Different loads. Different requirements. The right vehicle matters."
        visual={
          <div className="relative aspect-[4/3]">
            <div className="absolute inset-0 rounded-full bg-orchid/20 blur-3xl" aria-hidden />
            <VehicleArt art="truck12" uid="hero-12" className="absolute inset-x-0 top-[6%] w-full animate-float" />
            <VehicleArt art="dumper" axles={3} uid="hero-dump" className="absolute bottom-0 left-[10%] w-[70%] [&_.dumper-tub]:animate-[tip_6s_ease-in-out_infinite]" />
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
          <Reveal className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_50%_100%,#3a2a12,#0b111d_55%,#05070d)]">
            <div className="absolute inset-x-0 bottom-[10%] h-[12%] bg-[linear-gradient(180deg,#5a4526,#2a1f10)] [clip-path:polygon(0_40%,20%_0,45%_30%,70%_5%,100%_35%,100%_100%,0_100%)] opacity-70" />
            <VehicleArt art="dumper" axles={4} uid="dumper-feature" className="absolute inset-x-[6%] bottom-[6%] w-[88%] [&_.dumper-tub]:animate-[tip_5s_ease-in-out_infinite] motion-reduce:[&_.dumper-tub]:animate-none" />
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
