import Image from "next/image";
import { LegacyRoad, type Chapter } from "@/components/graphics/LegacyRoad";
import { Portrait } from "@/components/graphics/Portrait";
import { VehicleArt } from "@/components/graphics/VehicleArt";
import { leader } from "@/content/leadership";

/** Shared three-generation story used on Home (compact) and Our Legacy (full). */
export function LegacyChapters({ full = false }: { full?: boolean }) {
  const d = leader("dinesh");
  const j = leader("jalpesh");
  const t = leader("tej");

  const chapters: Chapter[] = [
    {
      id: "gen-1",
      era: "1998–2001",
      generation: "Chapter One · The Founder",
      headline: "One truck. One vision. The beginning of a legacy.",
      name: `${d.honorific} ${d.name}`,
      role: `Founder of Dinesh Transport · ${d.years}`,
      visual: (
        <div className="relative flex flex-col items-center">
          <Portrait src={d.photo} alt={d.photoAlt!} initials={d.initials} size="lg" objectPosition="52% 28%" />
          <div className="relative -mt-6 w-72 sm:w-80">
            <VehicleArt art="truck6" uid="green-truck" accent="green" className="w-full" />
            <p className="text-center text-[0.65rem] uppercase tracking-[0.25em] text-slate-500">
              Illustration · the first green truck
            </p>
          </div>
        </div>
      ),
      children: full ? (
        <>
          <p>
            Around 1998–2001, Dinesh Vasantlal Rana began a transportation journey in Salun Bazaar, Rana Chowk, Nadiad.
          </p>
          <p>
            With one green Tata Eicher truck and a belief in honest work, he established Dinesh Transport. Those early
            years were defined not by the size of the business but by the commitment required to build it.
          </p>
          <p>
            Every journey, every relationship and every responsibility helped lay the foundation for the future. His
            contribution remains at the heart of Rana Transport &amp; Logistics today.
          </p>
        </>
      ) : (
        <p>
          In Salun Bazaar, Rana Chowk, Nadiad, Late Shri Dinesh Vasantlal Rana established Dinesh Transport with one green
          Tata Eicher truck and a belief in honest work.
        </p>
      ),
    },
    {
      id: "gen-2",
      era: "2015–16",
      generation: "Chapter Two · The Business Grows",
      headline: "Carrying the legacy. Expanding the journey.",
      name: j.name,
      role: j.role,
      visual: <Portrait src={j.photo} alt={j.photoAlt!} initials={j.initials} size="lg" objectPosition="50% 40%" />,
      children: full ? (
        <>
          <p>
            As the family enterprise developed, the responsibility of carrying the founder&apos;s work forward passed to
            the next generation.
          </p>
          <p>
            Jalpesh Rana played an important role in strengthening transportation operations, business continuity and
            commercial relationships. His involvement, particularly from approximately 2015–2016 onward, contributed to
            the continued development of Rana Transports.
          </p>
          <p>
            The business grew beyond its original beginnings while remaining connected to the values on which it had
            been established. The second generation did more than continue the work — it helped prepare the business
            for the opportunities ahead.
          </p>
        </>
      ) : (
        <p>
          Jalpesh Rana carried the founder&apos;s vision forward — strengthening operations and commercial relationships
          as Dinesh Transport grew into Rana Transports.
        </p>
      ),
    },
    {
      id: "gen-3",
      era: "2021 →",
      generation: "Chapter Three · The Next Generation",
      headline: "The next generation. The next horizon.",
      name: t.name,
      role: t.role,
      visual: <Portrait src={t.photo} alt={t.photoAlt!} initials={t.initials} size="xl" tone="brand" />,
      children: full ? (
        <>
          <p>
            In 2021, Tej Rana joined the family business with a vision to carry forward its heritage and develop its
            future. His approach brings together traditional transportation experience, modern business thinking and a
            stronger focus on corporate growth.
          </p>
          <p>
            Under his leadership, Rana Transport &amp; Logistics is working towards a broader transportation identity,
            stronger commercial relationships and future digital capabilities.
          </p>
          <p>The company continues to respect where it began while embracing the possibilities of where it can go.</p>
        </>
      ) : (
        <p>
          Since 2021, Tej Rana has led the development of Rana Transport &amp; Logistics as a modern corporate identity —
          focused on corporate relationships, strategic growth and digital logistics.
        </p>
      ),
    },
  ];

  return (
    <>
      <LegacyRoad chapters={chapters} />
      {full && (
        <figure className="mx-auto mt-28 max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-gold/30 shadow-[0_30px_80px_-30px_rgba(213,174,98,0.4)]">
            <Image
              src="/people/dinesh-rana-with-truck.jpg"
              alt="Late Shri Dinesh Vasantlal Rana standing in front of a decorated goods carriage truck"
              width={540}
              height={960}
              className="mx-auto h-auto max-h-[80svh] w-auto object-contain sepia-[0.15]"
            />
          </div>
          <figcaption className="mt-4 text-center text-sm text-slate-400">
            Late Shri Dinesh Vasantlal Rana — the founder, with a decorated goods carriage. From the family archive.
          </figcaption>
        </figure>
      )}
    </>
  );
}
