import Link from "next/link";
import { Suspense } from "react";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { BrandFilm } from "@/components/home/BrandFilm";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { CargoScene } from "@/components/graphics/CargoScene";
import { NetworkLines } from "@/components/graphics/NetworkLines";
import { IndiaMap } from "@/components/graphics/IndiaMap";
import { VehicleShowcase } from "@/components/sections/VehicleShowcase";
import { LegacyChapters } from "@/components/sections/LegacyChapters";
import { TejVision } from "@/components/sections/TejVision";
import { FAQ } from "@/components/sections/FAQ";
import { CtaBand } from "@/components/sections/CtaBand";
import { QuoteProcess } from "@/components/sections/QuoteProcess";
import {
  Comparison,
  HighlightGrid,
  OfficeMapEmbed,
  ServiceGrid,
  Testimonials,
  WhyRanaGrid,
} from "@/components/sections/Blocks";
import { SITE, STRENGTHS } from "@/content/site";
import { VEHICLES, formatCapacity } from "@/content/vehicles";
import { Marquee } from "@/components/ui/Marquee";
import { ServiceVideos } from "@/components/sections/ServiceVideos";

export default function HomePage() {
  return (
    <>
      <BrandFilm />
      <Hero />

      <section aria-label="Vehicle classes and business corridors" className="border-b border-white/5 bg-[#070a12] py-5">
        <Marquee
          speed={55}
          items={[
            ...VEHICLES.map((v) => (
              <span key={v.id} className="inline-flex items-baseline gap-2.5 font-display text-lg font-semibold uppercase tracking-wide text-slate-300">
                {v.name}
                <span className="font-sans text-xs font-semibold normal-case tracking-normal text-slate-500">{formatCapacity(v.capacityKg)}</span>
              </span>
            )),
            ...["Nadiad", "Ahmedabad", "Petlad", "Mumbai", "New Delhi"].map((c) => (
              <span key={c} className="font-display text-lg font-semibold uppercase tracking-wide text-gold">
                {c}
              </span>
            )),
          ]}
        />
      </section>

      {/* Introducing Rana + Our Strength */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <NetworkLines className="absolute inset-0 size-full opacity-40" />
        <div className="container-x relative grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Introducing Rana"
              title={
                <>
                  Transportation <span className="text-slate-500">built on relationships.</span>
                </>
              }
              lead={
                <>
                  <p>
                    From a single truck in Nadiad to a growing transportation and logistics business, Rana Transport
                    &amp; Logistics represents a legacy of determination, personal commitment and business
                    relationships.
                  </p>
                  <p className="mt-4">
                    At Rana, transportation is more than moving goods between two locations. It is about understanding
                    each shipment, identifying suitable transport arrangements, coordinating business requirements and
                    building relationships that last.
                  </p>
                </>
              }
            />
            <ul className="mt-10 grid gap-4 sm:grid-cols-2">
              {STRENGTHS.map((s, i) => (
                <Reveal as="li" key={s.title} delay={i * 0.08} className="glass rounded-2xl p-5">
                  <Icon name={s.icon} className="size-6 text-gold" />
                  <p className="mt-3 font-heading font-bold text-white">{s.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{s.body}</p>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={0.15}>
            <CargoScene />
            <p className="mt-4 text-center text-xs uppercase tracking-[0.25em] text-slate-500">
              Loading · Coordination · Movement
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand highlights */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="What we offer"
            title="Highlights at a glance."
            lead="Transport enquiries for every scale of business cargo — coordinated personally by our team."
          />
          <div className="mt-12">
            <HighlightGrid />
          </div>
          <p className="mt-6 text-xs text-slate-500">
            Pricing is requirement-based; we do not claim guaranteed lowest prices. GPS visibility applies only where a
            vehicle or shipment has confirmed tracking integration.
          </p>
        </div>
      </section>

      {/* Services overview */}
      <section className="relative py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Our capabilities"
              title={
                <>
                  From everyday business cargo <span className="text-slate-500">to heavy commercial loads.</span>
                </>
              }
            />
            <LinkButton href="/services" variant="ghost">
              Explore All Services
            </LinkButton>
          </div>
          <div className="mt-12">
            <ServiceGrid />
          </div>
          <p className="mt-6 text-xs text-slate-500">Vehicle and route availability is confirmed when discussing each requirement.</p>
        </div>
      </section>

      {/* Service explainer videos */}
      <section id="services-in-motion" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Services in motion"
            title={
              <>
                Our services in <span className="text-slate-500">under 30 seconds.</span>
              </>
            }
            lead="Three short films: road freight, heavy vehicles and bulk, and corporate logistics with our quotation process."
          />
          <div className="mt-12">
            <ServiceVideos />
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="relative overflow-hidden bg-gradient-to-b from-midnight via-navy/60 to-midnight py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="Vehicle options"
              title={
                <>
                  The right vehicle <span className="text-slate-500">for the right load.</span>
                </>
              }
              lead="Whether your business requires a smaller commercial vehicle, a larger cargo truck or a heavy-duty dumper, our team can help review the transport options suitable for your requirements."
            />
            <LinkButton href="/vehicles" variant="ghost">
              Explore Vehicles
            </LinkButton>
          </div>
          <div className="mt-12">
            <VehicleShowcase limit={6} />
          </div>
        </div>
      </section>

      {/* Legacy */}
      <section className="relative py-24 sm:py-32">
        <div className="container-x">
          <SectionHeading
            align="center"
            tone="gold"
            eyebrow="Our legacy"
            title={
              <>
                One truck. Three generations. <span className="text-gold">One extraordinary legacy.</span>
              </>
            }
            lead="Every business has a beginning. Ours began with the determination of Late Shri Dinesh Vasantlal Rana. His vision was carried forward by Jalpesh Rana, and today Tej Rana represents the next generation."
          />
          <div className="mt-20">
            <LegacyChapters />
          </div>
          <div className="mt-16 text-center">
            <LinkButton href="/legacy" variant="gold">
              Discover Our Journey
            </LinkButton>
          </div>
        </div>
      </section>

      {/* Why Rana */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Why Rana"
            title={
              <>
                More than a truck booking. <span className="text-slate-500">A transport partner that understands business.</span>
              </>
            }
          />
          <div className="mt-12">
            <Comparison />
          </div>
          <div className="mt-12">
            <WhyRanaGrid />
          </div>
        </div>
      </section>

      {/* DMIC & Network */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Strategic connectivity"
            title={
              <>
                Rooted in Gujarat. <span className="text-slate-500">Focused on India&apos;s industrial future.</span>
              </>
            }
            lead="Our transportation heritage began in Nadiad, Gujarat. Today our strategic business focus includes the commercial connectivity between Ahmedabad, Mumbai, Delhi and other important Indian destinations — including the growing Delhi–Mumbai Industrial Corridor."
          />
          <div className="mt-12">
            <IndiaMap compact />
          </div>
          <div className="mt-8">
            <Link href="/network" className="inline-flex items-center gap-2 font-semibold text-sky hover:text-white">
              Explore Our Network <Icon name="arrow" className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <TejVision />

      {/* Quote process */}
      <section className="py-20 sm:py-28">
        <div className="container-x">
          <SectionHeading eyebrow="How quotations work" title="From requirement to movement." />
          <div className="mt-14">
            <QuoteProcess />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-24">
        <div className="container-x">
          <Testimonials />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <SectionHeading eyebrow="FAQs" title="Frequently asked questions." lead="Quick answers about vehicles, quotations, tracking and coverage." />
            <Link href="/contact#faq" className="mt-6 inline-flex items-center gap-2 font-semibold text-sky hover:text-white">
              All questions <Icon name="arrow" className="size-4" />
            </Link>
          </div>
          <FAQ limit={8} />
        </div>
      </section>

      {/* Contact + small map + full enquiry form */}
      <section id="quote" className="scroll-mt-24 py-20 sm:py-24">
        <div className="container-x">
          <SectionHeading
            eyebrow="Get a transport quote"
            title={
              <>
                Share your requirement. <span className="text-slate-500">We&apos;ll review the options.</span>
              </>
            }
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.5fr]">
            <div className="grid content-start gap-6">
              <Reveal className="glass rounded-3xl p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Historical headquarters</p>
                <p className="mt-3 text-slate-200">{SITE.hq}</p>
                <ul className="mt-6 grid gap-3">
                  <li>
                    <a href={SITE.phoneHref} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-white hover:bg-white/10">
                      <Icon name="phone" className="size-5 text-sky" /> {SITE.phone}
                    </a>
                  </li>
                  <li>
                    <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-white hover:bg-white/10">
                      <Icon name="whatsapp" className="size-5 text-[#25c26a]" /> WhatsApp {SITE.whatsapp}
                    </a>
                  </li>
                  <li>
                    <a href={SITE.emailHref} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-white hover:bg-white/10">
                      <Icon name="mail" className="size-5 text-magenta" /> {SITE.email}
                    </a>
                  </li>
                </ul>
              </Reveal>
              <OfficeMapEmbed className="h-[300px]" />
            </div>
            <Suspense fallback={<div className="glass min-h-[600px] rounded-3xl" />}>
              <EnquiryForm />
            </Suspense>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
