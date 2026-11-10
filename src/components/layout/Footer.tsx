import Link from "next/link";
import { NAV, SITE } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { MotionToggle } from "@/components/ui/MotionToggle";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#03050a]">
      <div className="absolute inset-x-0 top-0 h-px bg-brand opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-orchid/10 blur-3xl"
        aria-hidden
      />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-6 font-display text-lg font-semibold uppercase text-white">{SITE.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            A family transportation legacy built through generations and focused on connecting businesses through
            practical logistics solutions.
          </p>
        </div>
        <div>
          <h2 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Quick Links</h2>
          <ul className="mt-5 grid gap-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-slate-300 transition hover:text-white">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Business Enquiries</h2>
          <ul className="mt-5 grid gap-3 text-sm">
            <li>
              <a href={SITE.phoneHref} className="flex items-center gap-2 text-slate-200 hover:text-white">
                <Icon name="phone" className="size-4 text-sky" /> {SITE.phone}
              </a>
            </li>
            <li>
              <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-200 hover:text-white">
                <Icon name="whatsapp" className="size-4 text-[#25c26a]" /> WhatsApp {SITE.whatsapp}
              </a>
            </li>
            <li>
              <a href={SITE.emailHref} className="flex items-center gap-2 text-slate-200 hover:text-white">
                <Icon name="mail" className="size-4 text-magenta" /> {SITE.email}
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h2 className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Historical Headquarters</h2>
          <p className="mt-5 flex gap-2 text-sm leading-relaxed text-slate-300">
            <Icon name="pin" className="mt-0.5 size-4 shrink-0 text-gold" />
            {SITE.hq}
          </p>
          <Link href="/network#offices" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-sky hover:text-white">
            Full office directory <Icon name="arrow" className="size-4" />
          </Link>
        </div>
      </div>
      <div className="container-x relative border-t border-white/5 py-8">
        <p className="text-center font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold sm:text-base">
          {SITE.legacyLine}
        </p>
        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Rana Transport &amp; Logistics. All rights reserved.</p>
          <MotionToggle />
          <p>
            India map outline: <a className="underline hover:text-slate-300" href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noopener noreferrer">svg-maps</a> (CC BY 4.0).
          </p>
        </div>
      </div>
    </footer>
  );
}
