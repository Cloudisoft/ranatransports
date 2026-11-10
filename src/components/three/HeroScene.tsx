"use client";

import { useEffect, useRef, useState } from "react";

/** WebGL present AND hardware-accelerated (software rasterisers would make scrolling stutter). */
function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl2") || c.getContext("webgl")) as WebGLRenderingContext | null;
    if (!gl) return false;
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer);
  } catch {
    return false;
  }
}

/**
 * Lazy WebGL hero. Three.js is code-split and only loaded once the browser is
 * idle; until then (and when WebGL is unavailable) the poster image shows.
 */
export function HeroScene({ poster, offset = 0.2, className = "" }: { poster: string; offset?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!webglAvailable()) {
      setFailed(true);
      return;
    }
    let dispose: (() => void) | undefined;
    let cancelled = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const boot = () =>
      import("./highway-scene")
        .then(({ createHighwayScene }) => {
          if (cancelled || !canvasRef.current) return;
          dispose = createHighwayScene({ canvas: canvasRef.current, reducedMotion, offset, onReady: () => setReady(true) });
        })
        .catch(() => setFailed(true));
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(boot, { timeout: 1200 });
    else setTimeout(boot, 200);
    return () => {
      cancelled = true;
      dispose?.();
    };
  }, [offset]);

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {/* sunset sky from the logo palette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_45%_at_62%_58%,rgba(255,122,47,0.32),rgba(252,31,134,0.2)_35%,rgba(91,76,240,0.12)_60%,transparent_80%),linear-gradient(180deg,#05070d_0%,#0b0a1d_55%,#05070d_100%)]" />
      {(failed || !ready) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className={`absolute inset-0 size-full object-cover opacity-50 transition-opacity duration-700 ${ready ? "opacity-0" : ""}`} />
      )}
      {!failed && (
        <canvas ref={canvasRef} className={`absolute inset-0 size-full transition-opacity duration-[1200ms] ${ready ? "opacity-100" : "opacity-0"}`} />
      )}
    </div>
  );
}
