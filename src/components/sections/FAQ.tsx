import { FAQS } from "@/content/faqs";
import { Icon } from "@/components/ui/Icon";

export function FAQ({ limit }: { limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <div className="grid gap-3">
      {items.map((f, i) => (
        <details key={f.q} className="group glass rounded-2xl open:border-white/20 open:bg-white/[0.04]" {...(i === 0 ? { open: true } : {})}>
          <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 text-left font-heading text-base font-semibold text-white sm:p-6 sm:text-lg">
            <span className="flex gap-4">
              <span className="font-display text-sm text-sky/70">{String(i + 1).padStart(2, "0")}</span>
              {f.q}
            </span>
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/10 transition duration-300 group-open:rotate-45 group-open:bg-brand">
              <Icon name="plus" className="size-4" />
            </span>
          </summary>
          <p className="px-5 pb-6 pl-14 text-sm leading-relaxed text-slate-300 sm:px-6 sm:pl-[4.25rem] sm:text-base">{f.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </div>
  );
}
