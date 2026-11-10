import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: "Digital Logistics — Rana Connect & Rana Track",
  description:
    "Rana Connect — digital transport enquiries, quotations and WhatsApp contact, available now. Rana Track — shipment visibility, coming soon.",
  alternates: { canonical: "/digital-logistics" },
};

const CONNECT = [
  { t: "Transportation enquiry submission", href: "/contact#quote", icon: "quote" },
  { t: "Business quotation requests", href: "/contact#quote", icon: "briefcase" },
  { t: "Vehicle requirement selection", href: "/vehicles", icon: "truck" },
  { t: "Corporate enquiries", href: "/contact?service=corporate#quote", icon: "factory" },
  { t: "Direct WhatsApp communication", href: SITE.whatsappHref, icon: "whatsapp" },
  { t: "Email contact", href: SITE.emailHref, icon: "mail" },
];

const TRACK = [
  "Shipment status enquiries",
  "Consignment reference lookup",
  "Pickup and dispatch updates",
  "Delivery confirmation",
  "Digital transport documentation",
  "GPS-based visibility for supported vehicles",
  "Customer shipment dashboards",
  "Notifications & mobile applications",
];

export default function DigitalPage() {
  return (
    <>
      <PageHero
        eyebrow="Digital Logistics"
        title={
          <>
            Traditional experience. <span className="text-gradient">Modern possibilities.</span>
          </>
        }
      >
        <p>
          Transportation is evolving, and the way businesses communicate, coordinate and access logistics information is
          evolving with it. Rana Transport &amp; Logistics is developing a more connected digital experience for its
          customers.
        </p>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <Reveal className="neon-border relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-midnight p-8 sm:p-10">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-sky/20 blur-3xl" aria-hidden />
            <div className="flex items-center justify-between">
              <p className="font-display text-3xl font-bold tracking-[0.15em] text-white">
                RANA <span className="text-gradient">CONNECT</span>
              </p>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#1fae5b]/15 px-3 py-1 text-xs font-semibold text-[#3ddc84] ring-1 ring-[#1fae5b]/40">
                <span className="size-1.5 rounded-full bg-[#3ddc84]" /> Live
              </span>
            </div>
            <h2 className="mt-6 font-heading text-xl font-bold uppercase text-white">One digital connection. Every business interaction.</h2>
            <p className="mt-3 text-slate-300">
              Rana Connect is the company&apos;s digital business enquiry experience. Through our website, businesses can
              share transportation requirements, request quotations and connect directly with our team.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {CONNECT.map((c) => (
                <li key={c.t}>
                  {c.href.startsWith("/") ? (
                    <Link href={c.href} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white transition hover:bg-white/10">
                      <Icon name={c.icon} className="size-5 shrink-0 text-sky" /> {c.t}
                    </Link>
                  ) : (
                    <a href={c.href} {...(c.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="flex items-center gap-3 rounded-2xl bg-white/5 p-4 text-sm text-white transition hover:bg-white/10">
                      <Icon name={c.icon} className="size-5 shrink-0 text-sky" /> {c.t}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="relative overflow-hidden rounded-3xl border border-white/10 bg-graphite/40 p-8 sm:p-10">
            <div className="flex items-center justify-between">
              <p className="font-display text-3xl font-bold tracking-[0.15em] text-white">
                RANA <span className="text-gradient">TRACK</span>
              </p>
              <span className="rounded-full bg-amber/15 px-3 py-1 text-xs font-semibold text-amber ring-1 ring-amber/40">Coming soon</span>
            </div>
            <h2 className="mt-6 font-heading text-xl font-bold uppercase text-white">Visibility. Coordination. Confidence.</h2>
            <p className="mt-3 text-slate-300">
              Our vision includes more accessible digital shipment information and customer communication. Online
              tracking is <strong className="text-white">not live yet</strong> — for the status of a current movement,
              please contact our team directly.
            </p>
            <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-5" aria-label="Rana Track preview (not functional)">
              <label htmlFor="track-ref" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Consignment reference
              </label>
              <div className="mt-2 flex gap-2">
                <input id="track-ref" disabled placeholder="Available when Rana Track launches" className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-sm text-slate-500" />
                <button disabled className="cursor-not-allowed rounded-xl bg-white/5 px-4 text-sm font-semibold text-slate-500">
                  Track
                </button>
              </div>
            </div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Future capabilities may include</p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {TRACK.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm text-slate-400">
                  <Icon name="spark" className="size-4 shrink-0 text-orchid" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-slate-500">
              These functions will become available as the necessary operating systems and integrations are developed.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Your logistics. Closer to you."
        body="We envision digital platforms that make it easier for customers to communicate with Rana Transport & Logistics wherever they are — practical technology that supports better transportation communication and coordination."
        primary={{ href: "/contact#quote", label: "Connect With Our Team" }}
      />
    </>
  );
}
