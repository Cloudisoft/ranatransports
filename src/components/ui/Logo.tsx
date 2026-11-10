import Image from "next/image";
import Link from "next/link";

/**
 * Official Rana emblem (cropped from the supplied logo) + typeset wordmark.
 * `collapsed` folds the wordmark away (used by the floating pill header).
 */
export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <Link href="/" className="group flex items-center" aria-label="Rana Transport & Logistics — Home">
      <span
        className={`relative block shrink-0 overflow-hidden shadow-[0_0_24px_-6px_rgba(252,31,134,0.8)] ring-1 ring-white/10 transition-all duration-500 group-hover:shadow-[0_0_30px_-4px_rgba(29,179,255,0.9)] ${
          collapsed ? "h-11 w-11 rounded-[14px]" : "h-12 w-11 rounded-[6px]"
        }`}
      >
        <Image src="/brand/rana-emblem.webp" alt="" fill sizes="44px" className="object-cover object-top" priority />
      </span>
      <span
        aria-hidden={collapsed}
        className={`overflow-hidden whitespace-nowrap leading-none transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          collapsed ? "ml-0 max-w-0 -translate-x-2 opacity-0" : "ml-3 max-w-[220px] translate-x-0 opacity-100"
        }`}
      >
        <span className="block font-display text-xl font-bold tracking-[0.32em] text-white">RANA</span>
        <span className="mt-1 block text-[0.56rem] font-semibold tracking-[0.3em] text-slate-400">TRANSPORT &amp; LOGISTICS</span>
      </span>
    </Link>
  );
}
