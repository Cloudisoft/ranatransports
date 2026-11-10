"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORY_LABEL, VEHICLES, VEHICLE_DISCLAIMER, VEHICLE_FILTERS, type Vehicle } from "@/content/vehicles";
import { VehicleArt } from "@/components/graphics/VehicleArt";
import { Icon } from "@/components/ui/Icon";

function VehicleCard({ v, detailed }: { v: Vehicle & { image?: string }; detailed: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="group glass relative flex flex-col overflow-hidden rounded-3xl transition hover:border-white/20"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[radial-gradient(ellipse_at_50%_90%,#13284a,#071426_60%,#05070d)]">
        <div className="absolute inset-x-0 bottom-[14%] h-px bg-gradient-to-r from-transparent via-sky/50 to-transparent" />
        {v.image ? (
          <Image src={v.image} alt={v.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
        ) : (
          <VehicleArt
            art={v.art}
            axles={v.axles}
            uid={v.id}
            className="absolute inset-x-[6%] bottom-[4%] w-[88%] transition duration-700 group-hover:-translate-x-2 group-hover:scale-[1.04] [&_.dumper-tub]:transition-transform [&_.dumper-tub]:duration-700 group-hover:[&_.dumper-tub]:-rotate-[14deg]"
          />
        )}
        <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-midnight/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sky">
          {CATEGORY_LABEL[v.category]}
        </span>
        {!v.verified && (
          <span className="absolute right-4 top-4 rounded-full bg-amber/15 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-wider text-amber ring-1 ring-amber/30">
            Indicative
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-heading text-xl font-bold text-white">{v.name}</h3>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-white/5 p-3">
            <dt className="text-[0.65rem] uppercase tracking-widest text-slate-400">{v.verified ? "Payload" : "Illustrative payload"}</dt>
            <dd className="mt-1 font-semibold text-white">{v.payload}</dd>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <dt className="text-[0.65rem] uppercase tracking-widest text-slate-400">Body length</dt>
            <dd className="mt-1 font-semibold text-white">{v.body}</dd>
          </div>
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-white">Best for: </span>
          {v.bestFor}
        </p>
        {detailed && (
          <>
            <p className="mt-3 text-sm text-slate-400">
              <span className="font-semibold text-slate-200">Suitable cargo: </span>
              {v.cargo.join(", ")}
            </p>
            <p className="mt-2 text-sm text-slate-400">
              <span className="font-semibold text-slate-200">Loading: </span>
              {v.loading}
            </p>
          </>
        )}
        <p className="mt-3 text-xs text-slate-500">Availability confirmed by our operations team on enquiry.</p>
        <Link
          href={`/contact?vehicle=${encodeURIComponent(v.name)}#quote`}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition group-hover:border-transparent group-hover:bg-brand"
        >
          Request This Vehicle <Icon name="arrow" className="size-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export function VehicleShowcase({ detailed = false, limit }: { detailed?: boolean; limit?: number }) {
  const [filter, setFilter] = useState<(typeof VEHICLE_FILTERS)[number]["id"]>("all");
  const list = VEHICLES.filter((v) => filter === "all" || v.category === filter);
  const shown = limit && filter === "all" ? list.slice(0, limit) : list;
  return (
    <div>
      <div role="tablist" aria-label="Filter vehicles" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {VEHICLE_FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
              filter === f.id ? "border-transparent bg-brand text-white" : "border-white/10 bg-white/5 text-slate-300 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((v) => (
            <VehicleCard key={v.id} v={v} detailed={detailed} />
          ))}
        </AnimatePresence>
      </motion.div>
      <p className="mt-8 rounded-2xl border border-amber/20 bg-amber/5 p-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
        <strong className="text-amber">Important vehicle information: </strong>
        {VEHICLE_DISCLAIMER}
      </p>
    </div>
  );
}
