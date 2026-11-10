"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import { AnimatePresence, motion } from "motion/react";
import { enquirySchema } from "@/lib/enquiry-schema";
import { CONSENT_TEXT } from "@/lib/consent";
import { VEHICLES } from "@/content/vehicles";
import { APPROVED_SERVICES } from "@/content/services";
import { SITE } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; reference: string } | { kind: "error"; message: string };

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const inputCls =
  "w-full rounded-xl border border-white/10 bg-midnight/60 px-4 py-3 text-[0.95rem] text-white placeholder:text-slate-500 transition focus:border-sky focus:bg-midnight focus:outline-none focus:ring-2 focus:ring-sky/30 aria-[invalid=true]:border-magenta";

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-200">
        {label} {required ? <span className="text-magenta">*</span> : <span className="font-normal text-slate-500">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-magenta">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const params = useSearchParams();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef<number>(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const prefillVehicle = params.get("vehicle") ?? "";
  const prefillService = params.get("service") ?? "";
  const prefillFrom = params.get("from") ?? "";
  const serviceTitle = APPROVED_SERVICES.find((s) => s.slug === prefillService)?.title ?? "";

  const errProps = (name: string) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `${name}-error` } : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      ...Object.fromEntries(fd.entries()),
      consent: fd.get("consent") === "on",
      startedAt: startedAt.current,
      turnstileToken: (fd.get("cf-turnstile-response") as string) || undefined,
    };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) {
        const k = String(i.path[0]);
        if (!fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      const first = Object.keys(fe)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      setStatus({ kind: "error", message: "Please check the highlighted fields." });
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        reference?: string;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (res.ok && data.ok && data.reference) {
        setStatus({ kind: "success", reference: data.reference });
        formRef.current?.reset();
        window.scrollTo({ top: (formRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY - 120, behavior: "smooth" });
        return;
      }
      if (data.fieldErrors) setErrors(data.fieldErrors);
      setStatus({ kind: "error", message: data.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({
        kind: "error",
        message: `We could not reach the server. Please check your connection, or call / WhatsApp ${SITE.phone}.`,
      });
    }
  }

  if (status.kind === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        role="status"
        className="neon-border glass rounded-3xl p-8 text-center sm:p-12"
      >
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-brand">
          <Icon name="check" className="size-8 text-white" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold text-white">Thank you for contacting Rana Transport &amp; Logistics.</h3>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">
          Your transportation enquiry has been received. Our team will review your information and contact you using the
          details provided.
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Reference: <span className="font-mono font-semibold text-white">{status.reference}</span>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#1fae5b] px-5 py-3 text-sm font-semibold text-white">
            <Icon name="whatsapp" className="size-4" /> Follow up on WhatsApp
          </a>
          <button onClick={() => setStatus({ kind: "idle" })} className="glass rounded-full px-5 py-3 text-sm font-semibold text-white">
            Submit another enquiry
          </button>
        </div>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="glass relative rounded-3xl p-5 sm:p-8 lg:p-10" aria-describedby="form-note">
      {TURNSTILE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="fullName" label="Full Name" required error={errors.fullName}>
          <input id="fullName" name="fullName" autoComplete="name" placeholder="Enter your name." className={inputCls} {...errProps("fullName")} />
        </Field>
        <Field id="phone" label="Mobile Number" required error={errors.phone}>
          <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Enter your contact number." className={inputCls} {...errProps("phone")} />
        </Field>
        <Field id="email" label="Email Address" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" placeholder="Enter your email address." className={inputCls} {...errProps("email")} />
        </Field>
        <Field id="company" label="Company Name" error={errors.company}>
          <input id="company" name="company" autoComplete="organization" placeholder="Enter your company name." className={inputCls} {...errProps("company")} />
        </Field>

        <Field id="requirement" label="Transport Requirement" required error={errors.requirement} className="sm:col-span-2">
          <input
            id="requirement"
            name="requirement"
            list="service-list"
            defaultValue={serviceTitle}
            placeholder="Describe the goods or transportation service required."
            className={inputCls}
            {...errProps("requirement")}
          />
          <datalist id="service-list">
            {APPROVED_SERVICES.map((s) => (
              <option key={s.slug} value={s.title} />
            ))}
          </datalist>
          <input type="hidden" name="service" value={serviceTitle} />
        </Field>

        <Field id="cargo" label="Cargo Description" required error={errors.cargo} className="sm:col-span-2">
          <textarea id="cargo" name="cargo" rows={3} placeholder="What are you transporting? Packaging, quantity, nature of goods." className={inputCls} {...errProps("cargo")} />
        </Field>

        <Field id="weight" label="Cargo Weight" required error={errors.weight}>
          <div className="flex gap-2">
            <input id="weight" name="weight" type="number" min="0" step="any" inputMode="decimal" placeholder="Enter the weight." className={inputCls} {...errProps("weight")} />
            <select name="weightUnit" aria-label="Weight unit" defaultValue="KG" className={`${inputCls} !w-28 shrink-0`}>
              <option value="KG">KG</option>
              <option value="TON">TON</option>
            </select>
          </div>
        </Field>
        <Field id="preferredVehicle" label="Preferred Vehicle" error={errors.preferredVehicle}>
          <select id="preferredVehicle" name="preferredVehicle" defaultValue={prefillVehicle} className={inputCls}>
            <option value="">Select a vehicle category if known.</option>
            {VEHICLES.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
            <option value="Not sure — please advise">Not sure — please advise</option>
          </select>
        </Field>

        <Field id="loadingLocation" label="Loading Location" required error={errors.loadingLocation}>
          <input id="loadingLocation" name="loadingLocation" defaultValue={prefillFrom} placeholder="Where should the goods be collected?" className={inputCls} {...errProps("loadingLocation")} />
        </Field>
        <Field id="unloadingLocation" label="Unloading Location" required error={errors.unloadingLocation}>
          <input id="unloadingLocation" name="unloadingLocation" placeholder="Where should the goods be delivered?" className={inputCls} {...errProps("unloadingLocation")} />
        </Field>

        <Field id="budget" label="Desired Budget (INR)" error={errors.budget}>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
            <input id="budget" name="budget" type="number" min="0" step="1" inputMode="numeric" placeholder="Enter your estimated budget in INR." className={`${inputCls} pl-8`} {...errProps("budget")} />
          </div>
        </Field>
        <Field id="loadingDate" label="Preferred Loading Date" error={errors.loadingDate}>
          <input id="loadingDate" name="loadingDate" type="date" className={`${inputCls} [color-scheme:dark]`} {...errProps("loadingDate")} />
        </Field>

        <Field id="details" label="Additional Details" error={errors.details} className="sm:col-span-2">
          <textarea
            id="details"
            name="details"
            rows={4}
            placeholder="Include cargo dimensions, loading instructions, access limitations or other relevant information."
            className={inputCls}
          />
        </Field>

        {/* Honeypot — hidden from people, tempting to bots */}
        <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input id="website" name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              name="consent"
              className="mt-0.5 size-5 shrink-0 rounded border-white/20 bg-midnight accent-[#fc1f86]"
              {...errProps("consent")}
            />
            <span>{CONSENT_TEXT}</span>
          </label>
          {errors.consent && (
            <p id="consent-error" role="alert" className="mt-1.5 text-xs font-medium text-magenta">
              {errors.consent}
            </p>
          )}
        </div>

        {TURNSTILE_KEY && <div className="cf-turnstile sm:col-span-2" data-sitekey={TURNSTILE_KEY} data-theme="dark" />}
      </div>

      <AnimatePresence>
        {status.kind === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="mt-6 rounded-xl border border-magenta/30 bg-magenta/10 p-4 text-sm text-white"
          >
            {status.message}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-brand bg-[length:200%_auto] px-8 py-4 text-sm font-bold uppercase tracking-widest text-white shadow-[0_10px_40px_-10px_rgba(252,31,134,0.7)] transition hover:bg-[position:100%_center] disabled:cursor-wait disabled:opacity-70 sm:w-auto"
        >
          {submitting ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden /> Submitting…
            </>
          ) : (
            <>
              Submit Transport Enquiry <Icon name="arrow" className="size-4" />
            </>
          )}
        </button>
        <p id="form-note" className="text-xs text-slate-500">
          Fields marked <span className="text-magenta">*</span> are required. Your details are used only to respond to this enquiry.
        </p>
      </div>
    </form>
  );
}
