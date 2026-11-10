"use client";

import { useSyncExternalStore } from "react";

/**
 * Site motion preference.
 *
 * Decorative animation (trucks, marquee, slides, reveals) runs by default — even
 * when the OS "reduce motion" setting is on — and visitors can stop it with the
 * "Pause animations" control in the footer (persisted in localStorage).
 * Motion that commonly causes discomfort (inertial smooth scrolling, parallax)
 * additionally respects the OS setting via `useCalmMotion()`.
 */
const KEY = "rana-motion";
const EVENT = "rana-motion-change";

const paused = () => typeof document !== "undefined" && document.documentElement.dataset.motion === "reduced";
const osReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const subscribe = (cb: () => void) => {
  window.addEventListener(EVENT, cb);
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    mq.removeEventListener("change", cb);
  };
};

/** True only when the visitor paused animations on this site. */
export function useReduceMotion() {
  return useSyncExternalStore(subscribe, paused, () => false);
}

/** True when paused on-site OR the OS asks for reduced motion — for parallax / scroll inertia. */
export function useCalmMotion() {
  return useSyncExternalStore(subscribe, () => paused() || osReduced(), () => false);
}

export const isMotionPaused = paused;
export const isCalmMotion = () => paused() || osReduced();

export function setMotionPaused(value: boolean) {
  document.documentElement.dataset.motion = value ? "reduced" : "full";
  try {
    localStorage.setItem(KEY, value ? "reduced" : "full");
  } catch {
    /* storage unavailable — preference lasts for this page view */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Inline, render-blocking snippet so a paused preference applies before first paint. */
export const MOTION_BOOT_SCRIPT = `try{if(localStorage.getItem("${KEY}")==="reduced")document.documentElement.dataset.motion="reduced"}catch(e){}`;
