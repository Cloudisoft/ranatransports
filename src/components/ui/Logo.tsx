import Image from "next/image";
import Link from "next/link";

/** Official Rana emblem (cropped from the supplied logo) with the wordmark set in type. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-3" aria-label="Rana Transport & Logistics — Home">
      <span className="relative block h-11 w-10 shrink-0 overflow-hidden rounded-[3px] shadow-[0_0_24px_-4px_rgba(252,31,134,0.7)] transition group-hover:shadow-[0_0_30px_-2px_rgba(29,179,255,0.8)]">
        <Image src="/brand/rana-emblem.webp" alt="" fill sizes="40px" className="object-cover" priority />
      </span>
      {!compact && (
        <span className="whitespace-nowrap leading-none">
          <span className="block font-display text-xl font-bold tracking-[0.32em] text-white">RANA</span>
          <span className="mt-1 block text-[0.56rem] font-semibold tracking-[0.3em] text-slate-300">
            TRANSPORT &amp; LOGISTICS
          </span>
        </span>
      )}
    </Link>
  );
}
