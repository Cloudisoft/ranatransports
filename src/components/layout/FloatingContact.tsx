import { SITE } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export function FloatingContact() {
  return (
    <a
      href={SITE.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Rana Transport & Logistics on WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-[#1fae5b] text-white shadow-[0_12px_40px_-8px_rgba(31,174,91,0.8)] transition hover:scale-105"
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full bg-[#1fae5b]/50 motion-reduce:hidden" aria-hidden />
      <Icon name="whatsapp" className="relative size-7" />
    </a>
  );
}
