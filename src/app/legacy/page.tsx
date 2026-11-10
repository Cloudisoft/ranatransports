import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { LegacyChapters } from "@/components/sections/LegacyChapters";
import { CtaBand } from "@/components/sections/CtaBand";
import { Portrait } from "@/components/graphics/Portrait";
import { Reveal } from "@/components/ui/Reveal";
import { leader } from "@/content/leadership";

export const metadata: Metadata = {
  title: "Our Legacy",
  description:
    "The three-generation story of Rana Transport & Logistics — from Late Shri Dinesh Vasantlal Rana's single truck in Nadiad to Jalpesh Rana and CEO Tej Rana.",
  alternates: { canonical: "/legacy" },
};

export default function LegacyPage() {
  const d = leader("dinesh");
  return (
    <>
      <PageHero
        eyebrow="Our history · Our family · Our legacy"
        title={
          <>
            The journey that started <span className="text-gold">with one truck.</span>
          </>
        }
        image="/media/truck-side.jpg"
      >
        <p>
          The story of Rana Transport &amp; Logistics is a story of vision, responsibility and continuity across three
          generations.
        </p>
        <p>
          It began in Nadiad, where determination and a single truck laid the foundation for what would become a family
          transportation business.
        </p>
      </PageHero>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <LegacyChapters full />
        </div>
      </section>

      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_30%,rgba(213,174,98,0.14),transparent_60%)]" />
        <Reveal className="container-x flex flex-col items-center text-center">
          <Portrait src={d.photo} alt={d.photoAlt!} initials={d.initials} size="md" objectPosition="52% 28%" />
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-gold">A founder&apos;s tribute</p>
          <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold uppercase leading-tight text-white">
            A vision that continues to move us.
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-slate-300">
            <p>
              The legacy of Late Shri Dinesh Vasantlal Rana is not measured only by the company that grew from his
              efforts. It lives in the values he established, the determination he demonstrated and the generations
              that continue his work.
            </p>
            <p>His story reminds us that lasting businesses are built through courage, responsibility and perseverance.</p>
          </div>
          <p className="mt-10 font-heading text-lg font-bold text-gold sm:text-xl">
            Founded with determination. Strengthened through generations. Carried forward with purpose.
          </p>
          <p className="mt-3 text-sm text-slate-500">{d.years}</p>
        </Reveal>
      </section>

      <CtaBand title="Be part of the next chapter." body="Bring your transportation requirement to a business built on three generations of commitment." />
    </>
  );
}
