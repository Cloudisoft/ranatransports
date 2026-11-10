import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "./Icon";

type Variant = "primary" | "ghost" | "gold" | "whatsapp";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition duration-300 focus-visible:outline-2 whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand bg-[length:200%_auto] text-white shadow-[0_10px_40px_-10px_rgba(252,31,134,0.65)] hover:bg-[position:100%_center] hover:shadow-[0_14px_50px_-10px_rgba(29,179,255,0.7)]",
  ghost: "glass text-white hover:border-white/25 hover:bg-white/10",
  gold: "bg-gradient-to-r from-[#f3dfae] via-gold to-[#a8803a] text-midnight hover:brightness-110",
  whatsapp: "bg-[#1fae5b] text-white hover:bg-[#25c26a] shadow-[0_10px_40px_-14px_rgba(37,194,106,0.8)]",
};

export function LinkButton({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  className = "",
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: string | null;
  className?: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const content = (
    <>
      {variant === "whatsapp" && <Icon name="whatsapp" className="size-5" />}
      <span>{children}</span>
      {icon && variant !== "whatsapp" && (
        <Icon name={icon} className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external || /^(https?:|tel:|mailto:)/.test(href)) {
    return (
      <a
        href={href}
        className={cls}
        {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {content}
    </Link>
  );
}
