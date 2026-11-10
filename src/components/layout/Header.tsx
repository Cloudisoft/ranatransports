"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { NAV, SITE } from "@/content/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-white/5 bg-midnight/85 backdrop-blur-xl" : "bg-gradient-to-b from-midnight/70 to-transparent"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-midnight"
      >
        Skip to content
      </a>
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV.slice(1, -1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-full px-2.5 py-2 text-[0.8rem] font-medium tracking-wide transition hover:text-white ${
                    isActive(item.href) ? "text-white" : "text-slate-300"
                  }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.span layoutId="nav-underline" className="absolute inset-x-3 -bottom-0.5 h-[2px] rounded bg-brand" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={SITE.phoneHref}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm text-slate-200 transition hover:text-white 2xl:flex"
          >
            <Icon name="phone" className="size-4 text-sky" />
            {SITE.phone}
          </a>
          <Link
            href="/contact#quote"
            className="hidden whitespace-nowrap rounded-full bg-brand bg-[length:200%_auto] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[position:100%_center] sm:inline-flex"
          >
            Get a Quote
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="glass grid size-11 place-items-center rounded-full text-white xl:hidden"
          >
            <Icon name={open ? "close" : "menu"} className="size-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100svh - 72px)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t border-white/5 bg-midnight/95 xl:hidden"
          >
            <nav aria-label="Mobile" className="container-x flex flex-col gap-1 py-6">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={`flex items-center justify-between border-b border-white/5 py-4 font-display text-2xl font-semibold ${
                      isActive(item.href) ? "text-gradient" : "text-white"
                    }`}
                  >
                    {item.label}
                    <Icon name="arrow" className="size-5 text-slate-500" />
                  </Link>
                </motion.div>
              ))}
              <div className="mt-6 grid gap-3">
                <Link href="/contact#quote" className="rounded-full bg-brand py-4 text-center font-semibold text-white">
                  Get a Transport Quote
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={SITE.phoneHref} className="glass flex items-center justify-center gap-2 rounded-full py-3.5 text-sm text-white">
                    <Icon name="phone" className="size-4" /> Call
                  </a>
                  <a
                    href={SITE.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-full bg-[#1fae5b] py-3.5 text-sm text-white"
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
