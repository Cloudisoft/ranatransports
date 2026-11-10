import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { TejVision } from "@/components/sections/TejVision";
import { CtaBand } from "@/components/sections/CtaBand";
import { Portrait } from "@/components/graphics/Portrait";
import { Reveal } from "@/components/ui/Reveal";
import { leader } from "@/content/leadership";

export const metadata: Metadata = {
  title: "Leadership & Vision",
  description:
    "Three generations, one enduring commitment: founder Late Shri Dinesh Vasantlal Rana, second-generation successor Jalpesh Rana and Chief Executive Officer Tej Rana.",
  alternates: { canonical: "/leadership" },
};

export default function LeadershipPage() {
  const d = leader("dinesh");
  const j = leader("jalpesh");
  return (
    <>
      <PageHero
        eyebrow="Leadership & Vision"
        title={
          <>
            Three generations. <span className="text-gold">One enduring commitment.</span>
          </>
        }
        subtitle="The people behind the journey."
      >
        <p>Three generations. One commitment to carrying the legacy forward.</p>
      </PageHero>

      {/* Tej Rana — greatest emphasis, shown first */}
      <TejVision withDirection />

      <section className="py-20 sm:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {[
            { l: d, label: "Our Founder", pos: "52% 28%" },
            { l: j, label: "Our Second Generation", pos: "50% 40%" },
          ].map(({ l, label, pos }, i) => (
            <Reveal key={l.id} delay={i * 0.1} className="glass flex flex-col items-center rounded-3xl p-8 text-center sm:p-10">
              <Portrait src={l.photo} alt={l.photoAlt!} initials={l.initials} size="md" objectPosition={pos} />
              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">{label}</p>
              <h2 className="mt-3 font-heading text-2xl font-bold text-white">
                {l.honorific ? `${l.honorific} ` : ""}
                {l.name}
              </h2>
              <p className="mt-1 text-sm text-slate-400">{l.role}</p>
              {l.id === "dinesh" && <p className="mt-1 text-xs text-slate-500">{l.years}</p>}
              <p className="mt-5 leading-relaxed text-slate-300">{l.summary}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBand
        title="A legacy we honour. A responsibility we carry. A future we build."
        body="Partner with a family business that has grown through generations of transportation work."
      />
    </>
  );
}
