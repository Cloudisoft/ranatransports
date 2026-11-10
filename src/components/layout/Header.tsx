"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV, SITE } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

/**
 * At the top of the page the header is a full-width transparent bar with the
 * full wordmark. Once the visitor scrolls it condenses into a floating,
 * frosted pill and the wordmark folds away, leaving only the emblem.
 */
export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const pill = scrolled || open;

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <a
        href="#main"
        className="pointer-events-auto sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-midnight"
      >
        Skip to content
      </a>
      <div
        className={`pointer-events-auto mx-auto transition-[max-width,margin,padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
          pill ? "mt-3 max-w-[1180px] px-3 sm:px-4" : "mt-0 max-w-[1240px] px-0"
        }`}
      >
        <div
          className={`relative flex items-center justify-between gap-4 transition-all duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
            pill
              ? "h-[64px] rounded-[22px] border border-white/10 bg-[#0a0f1a]/75 pl-3 pr-2 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl backdrop-saturate-150"
              : "h-[84px] rounded-none border border-transparent bg-transparent px-4 sm:px-6 lg:px-8"
          }`}
        >
          <Logo collapsed={scrolled && !open} />

          <nav aria-label="Primary" className="hidden xl:block" onMouseLeave={() => setHovered(null)}>
            <ul className="flex items-center">
              {NAV.slice(1, -1).map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href} className="relative">
                    {hovered === item.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-white/[0.07]"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHovered(item.href)}
                      onFocus={() => setHovered(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={`relative block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.84rem] font-medium transition-colors ${
                        active ? "text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <motion.span layoutId="nav-active" className="absolute inset-x-3.5 -bottom-px h-[2px] rounded-full bg-brand" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={SITE.phoneHref}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm text-slate-300 transition hover:text-white 2xl:flex"
            >
              <Icon name="phone" className="size-4 text-sky" />
              {SITE.phone}
            </a>
            <Link
              href="/contact#quote"
              className="group hidden items-center gap-2 whitespace-nowrap rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-midnight shadow-[0_8px_30px_-8px_rgba(252,31,134,0.6)] transition hover:bg-brand hover:text-white sm:inline-flex"
            >
              Get a Quote
              <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-11 place-items-center rounded-full border border-white/10 bg-white/5 text-white xl:hidden"
            >
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto mx-3 mt-2 max-h-[calc(100svh-96px)] overflow-y-auto rounded-[22px] border border-white/10 bg-[#0a0f1a]/95 shadow-2xl backdrop-blur-2xl sm:mx-4 xl:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col p-5">
              {NAV.map((item, i) => (
                <motion.div key={item.href} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i }}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-white/5 py-3.5 font-display text-xl font-semibold ${
                      isActive(item.href) ? "text-amber" : "text-white"
                    }`}
                  >
                    {item.label}
                    <Icon name="arrow" className="size-5 text-slate-600" />
                  </Link>
                </motion.div>
              ))}
              <div className="mt-5 grid gap-3">
                <Link href="/contact#quote" className="rounded-full bg-brand py-3.5 text-center font-semibold text-white">
                  Get a Transport Quote
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={SITE.phoneHref} className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 py-3 text-sm text-white">
                    <Icon name="phone" className="size-4" /> Call
                  </a>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#1fae5b] py-3 text-sm text-white"
                  >
                    <Icon name="whatsapp" className="size-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
