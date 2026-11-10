import type { ReactNode } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { FutureExpressway } from "@/components/graphics/FutureExpressway";
import { SITE } from "@/content/site";

export function CtaBand({
  title = "Let's move your business forward.",
  body = "Tell us what you need to transport, where it needs to go and when you need it moved.",
  primary = { href: "/contact#quote", label: "Get a Quote" },
  note,
}: {
  title?: ReactNode;
  body?: ReactNode;
  primary?: { href: string; label: string };
  note?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden py-28 sm:py-36">
      <FutureExpressway className="-z-10 opacity-70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-midnight via-midnight/60 to-midnight" />
      <Reveal className="container-x text-center">
        <h2 className="mx-auto max-w-4xl font-display text-[clamp(2.2rem,6vw,4.5rem)] font-bold uppercase leading-[0.98] text-white">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">{body}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <LinkButton href={primary.href}>{primary.label}</LinkButton>
          <LinkButton href={SITE.whatsappHref} variant="whatsapp">
            WhatsApp Our Team
          </LinkButton>
        </div>
        {note && <p className="mx-auto mt-8 max-w-2xl text-xs text-slate-500">{note}</p>}
      </Reveal>
    </section>
  );
}
