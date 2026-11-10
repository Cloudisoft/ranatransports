import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Eyebrow({ children, tone = "brand" }: { children: ReactNode; tone?: "brand" | "gold" }) {
  return (
    <p
      className={`mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] ${
        tone === "gold" ? "text-gold" : "text-sky"
      }`}
    >
      <span className={`h-px w-8 ${tone === "gold" ? "bg-gold" : "bg-brand"}`} aria-hidden />
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  tone = "brand",
  className = "",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  tone?: "brand" | "gold";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <Tag className="text-3xl font-bold uppercase leading-[1.05] text-white sm:text-4xl lg:text-5xl">{title}</Tag>
      {lead && <div className="mt-5 text-base leading-relaxed text-slate-300 sm:text-lg">{lead}</div>}
    </Reveal>
  );
}
