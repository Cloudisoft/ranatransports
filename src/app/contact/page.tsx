import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/sections/PageHero";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { QuoteProcess } from "@/components/sections/QuoteProcess";
import { FAQ } from "@/components/sections/FAQ";
import { OfficeMapEmbed } from "@/components/sections/Blocks";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact & Get a Quote",
  description: `Request a transport quotation from Rana Transport & Logistics. Call or WhatsApp ${SITE.phone}, or email ${SITE.email}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact & Get a Quote"
        title={
          <>
            Let&apos;s move your <span className="text-slate-500">business forward.</span>
          </>
        }
        subtitle="Have a transportation requirement?"
      >
        <p>
          Whether you need to move commercial goods, industrial material, business cargo or a larger load, share the
          details with us. Our team can review your requirements and discuss available transportation options.
        </p>
      </PageHero>

      <section className="pb-16">
        <div className="container-x">
          <QuoteProcess />
        </div>
      </section>

      <section id="quote" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <h2 className="mb-6 font-display text-2xl font-bold uppercase text-white sm:text-3xl">Request a transport quote</h2>
            <Suspense fallback={<div className="glass min-h-[700px] rounded-3xl" />}>
              <EnquiryForm />
            </Suspense>
          </div>
          <aside className="grid content-start gap-6">
            <div className="glass rounded-3xl p-7">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-slate-400">Direct business contact</h2>
              <ul className="mt-5 grid gap-3">
                <li>
                  <a href={SITE.phoneHref} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
                    <span className="grid size-10 place-items-center rounded-full bg-sky/15"><Icon name="phone" className="size-5 text-sky" /></span>
                    <span><span className="block text-xs text-slate-400">Call us</span><span className="font-semibold text-white">{SITE.phone}</span></span>
                  </a>
                </li>
                <li>
                  <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
                    <span className="grid size-10 place-items-center rounded-full bg-[#1fae5b]/15"><Icon name="whatsapp" className="size-5 text-[#25c26a]" /></span>
                    <span><span className="block text-xs text-slate-400">WhatsApp us</span><span className="font-semibold text-white">{SITE.whatsapp}</span></span>
                  </a>
                </li>
                <li>
                  <a href={SITE.emailHref} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 hover:bg-white/10">
                    <span className="grid size-10 place-items-center rounded-full bg-magenta/15"><Icon name="mail" className="size-5 text-magenta" /></span>
                    <span className="min-w-0"><span className="block text-xs text-slate-400">Email us</span><span className="block truncate font-semibold text-white">{SITE.email}</span></span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="glass rounded-3xl p-7">
              <h2 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-gold">Our location</h2>
              <p className="mt-3 font-heading font-bold text-white">Historical Headquarters</p>
              <p className="mt-1 text-sm text-slate-300">{SITE.hq}</p>
              <OfficeMapEmbed className="mt-5 h-60" />
              <Link href="/network#offices" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky hover:text-white">
                View the full office directory <Icon name="arrow" className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <SectionHeading eyebrow="FAQs" title="Frequently asked questions." />
          <FAQ />
        </div>
      </section>
    </>
  );
}
