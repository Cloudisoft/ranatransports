"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CATEGORY_LABEL,
  VEHICLES,
  VEHICLE_DISCLAIMER,
  VEHICLE_FILTERS,
  formatCapacity,
  formatFt,
  type Vehicle,
} from "@/content/vehicles";
import { RearView, TruckSpec } from "@/components/graphics/TruckSpec";
import { Icon } from "@/components/ui/Icon";

function WeightIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 3a3 3 0 0 0-2.83 4H7.6a2 2 0 0 0-1.96 1.6l-2.4 11.2A1.8 1.8 0 0 0 5 22h14a1.8 1.8 0 0 0 1.76-2.2l-2.4-11.2A2 2 0 0 0 16.4 7h-1.57A3 3 0 0 0 12 3zm0 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
  );
}

function VehicleCard({ v, detailed, bestFit }: { v: Vehicle; detailed: boolean; bestFit: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      tabIndex={-1}
      className={`spotlight group relative flex flex-col overflow-hidden rounded-[26px] border bg-[#0b111c] p-2 transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(29,179,255,0.45)] ${
        bestFit ? "border-amber/70 ring-2 ring-amber/40" : "border-white/[0.07] hover:border-white/15"
      }`}
    >
      {/* spec drawing */}
      <div className="spec-paper relative overflow-hidden rounded-[20px]">
        {v.image ? (
          <div className="relative aspect-[440/224]">
            <Image src={v.image} alt={v.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
          </div>
        ) : (
          <TruckSpec v={v} className="block h-auto w-full" />
        )}
        {bestFit && (
          <span className="absolute right-3 top-3 rounded-full bg-amber px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.14em] text-midnight">
            Best fit
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sky">{CATEGORY_LABEL[v.category]}</p>
            <h3 className="mt-1 font-heading text-lg font-bold text-white">{v.name}</h3>
            <p className="mt-0.5 text-xs text-slate-400">{v.spec}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#e8f1ff] px-2.5 py-1.5 text-sm font-bold text-[#0b1b33]">
            <WeightIcon className="size-4" />
            {formatCapacity(v.capacityKg)}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-3">
          <dl className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Length", formatFt(v.lengthFt)],
              ["Width", formatFt(v.widthFt)],
              [v.heightRef === "cargo" ? "Height" : v.heightRef === "deck" ? "Deck ht." : "Side wall", formatFt(v.heightFt)],
            ].map(([k, val]) => (
              <div key={k}>
                <dt className="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-500">{k}</dt>
                <dd className="mt-0.5 font-heading text-sm font-bold text-white">{val}</dd>
              </div>
            ))}
          </dl>
          <div className="spec-paper w-16 rounded-xl" title="Rear view — cargo width">
            <RearView v={v} className="block h-auto w-full" />
          </div>
        </div>
        {v.volumeM3 && (
          <p className="mt-2 text-xs text-slate-400">
            Body volume ≈ <span className="font-semibold text-white">{v.volumeM3} m³</span> — payload also depends on material density.
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-slate-300">{v.bestFor}</p>
        {detailed && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {v.cargo.map((c) => (
              <li key={c} className="rounded-full border border-white/10 px-2.5 py-1 text-[0.7rem] text-slate-300">
                {c}
              </li>
            ))}
          </ul>
        )}
        {detailed && <p className="mt-3 text-xs text-slate-500">Loading: {v.loading}</p>}

        <div className="mt-auto pt-5">
          <Link
            href={`/contact?vehicle=${encodeURIComponent(v.name)}#quote`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white transition group-hover:border-transparent group-hover:bg-white group-hover:text-midnight"
          >
            Request this vehicle <Icon name="arrow" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-2 text-center text-[0.68rem] text-slate-500">Typical class spec · confirmed on enquiry</p>
        </div>
      </div>
    </motion.article>
  );
}

/** Find the smallest vehicle class whose typical payload covers the load. */
function useBestFit(loadKg: number | null) {
  return useMemo(() => {
    if (!loadKg || loadKg <= 0) return null;
    const fits = VEHICLES.filter((v) => v.capacityKg[1] >= loadKg && v.category !== "dumper").sort(
      (a, b) => a.capacityKg[1] - b.capacityKg[1],
    );
    return fits[0]?.id ?? null;
  }, [loadKg]);
}

export function VehicleShowcase({ detailed = false, limit }: { detailed?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<(typeof VEHICLE_FILTERS)[number]["id"]>("all");
  const [load, setLoad] = useState("");
  const [unit, setUnit] = useState<"KG" | "TON">("KG");
  const loadKg = load ? Number(load) * (unit === "TON" ? 1000 : 1) : null;
  const bestFit = useBestFit(loadKg);
  const tooHeavy = loadKg !== null && loadKg > 0 && !bestFit;

  let list = VEHICLES.filter((v) => filter === "all" || v.category === filter);
  if (bestFit && filter === "all") {
    const fit = VEHICLES.find((v) => v.id === bestFit)!;
    list = [fit, ...list.filter((v) => v.id !== bestFit)];
  }
  const shown = limit && filter === "all" ? list.slice(0, limit) : list;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter vehicles by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {VEHICLE_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                filter === f.id ? "border-white bg-white text-midnight" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* load finder */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 pl-4"
          aria-label="Find a vehicle for your load"
        >
          <WeightIcon className="size-4 shrink-0 text-amber" />
          <label htmlFor="load-finder" className="sr-only">
            Load weight
          </label>
          <input
            id="load-finder"
            inputMode="decimal"
            type="number"
            min="0"
            step="any"
            value={load}
            onChange={(e) => {
              setLoad(e.target.value);
              setFilter("all");
            }}
            placeholder="Your load weight"
            className="w-36 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
          />
          <div className="flex rounded-full bg-white/5 p-0.5" role="group" aria-label="Unit">
            {(["KG", "TON"] as const).map((u) => (
              <button
                key={u}
                type="button"
                aria-pressed={unit === u}
                onClick={() => setUnit(u)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${unit === u ? "bg-white text-midnight" : "text-slate-400"}`}
              >
                {u}
              </button>
            ))}
          </div>
        </form>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-slate-400">
        {bestFit && (
          <>
            Smallest typical class for {load} {unit === "KG" ? "kg" : "t"}:{" "}
            <span className="font-semibold text-amber">{VEHICLES.find((v) => v.id === bestFit)!.name}</span>. Our team will confirm
            the right vehicle.
          </>
        )}
        {tooHeavy && <>That load exceeds a single standard truck — share it with us and we&apos;ll plan multiple or specialised vehicles.</>}
      </p>

      <motion.div layout className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((v) => (
            <VehicleCard key={v.id} v={v} detailed={detailed} bestFit={v.id === bestFit} />
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-slate-400 sm:text-sm">
        <strong className="text-slate-200">About these figures: </strong>
        {VEHICLE_DISCLAIMER}
      </p>
    </div>
  );
}
