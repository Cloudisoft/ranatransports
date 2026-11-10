/** Perspective neon expressway with a scrolling grid — the "road into tomorrow". */
export function FutureExpressway({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className="absolute inset-x-0 top-[34%] h-[30%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(252,31,134,0.45),rgba(204,45,211,0.15)_40%,transparent_70%)]" />
      <div className="absolute left-1/2 top-[40%] size-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ffb547,#fc1f86_45%,transparent_70%)] opacity-70 blur-sm" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] [perspective:340px]">
        <div
          className="absolute inset-x-[-50%] bottom-0 h-[220%] origin-bottom [transform:rotateX(72deg)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(29,179,255,0.55) 2px, transparent 2px), linear-gradient(90deg, rgba(204,45,211,0.45) 2px, transparent 2px)",
            backgroundSize: "70px 70px",
            animation: "grid-scroll 1.6s linear infinite",
            maskImage: "linear-gradient(to top, #000 30%, transparent 95%)",
            WebkitMaskImage: "linear-gradient(to top, #000 30%, transparent 95%)",
          }}
        />
        {/* road surface + edges */}
        <div className="absolute bottom-0 left-1/2 h-full w-[44%] -translate-x-1/2 [clip-path:polygon(47%_0,53%_0,100%_100%,0_100%)] bg-[linear-gradient(180deg,transparent,rgba(5,7,13,0.95)_35%)]" />
        <div className="absolute bottom-0 left-1/2 h-full w-[44%] -translate-x-1/2 [clip-path:polygon(46.6%_0,47%_0,1%_100%,0_100%)] bg-[linear-gradient(180deg,transparent,#ffb547_30%,#fc1f86)]" />
        <div className="absolute bottom-0 left-1/2 h-full w-[44%] -translate-x-1/2 [clip-path:polygon(53%_0,53.4%_0,100%_100%,99%_100%)] bg-[linear-gradient(180deg,transparent,#cc2dd3_30%,#1db3ff)]" />
      </div>
      <style>{`@keyframes grid-scroll{to{background-position:0 70px}}@media (prefers-reduced-motion: reduce){[style*="grid-scroll"]{animation:none!important}}`}</style>
    </div>
  );
}
