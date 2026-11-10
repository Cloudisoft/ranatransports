# Rana Transport & Logistics — Corporate Website

**Beyond Transportation. Into Tomorrow.**

Cinematic corporate website for Rana Transport & Logistics — a three-generation family transport business from
Nadiad, Gujarat. Built with Next.js (App Router), React, TypeScript, Tailwind CSS v4, GSAP ScrollTrigger and Motion.

## Pages

| Route | Page |
|---|---|
| `/` | Home — brand film, hero highway, highlights, services, vehicles, legacy road, Why Rana, DMIC map, Tej Rana vision, quote process, testimonials, FAQ, map + full enquiry form |
| `/legacy` | Our Legacy — scroll-driven three-generation road, founder tribute, archive photograph |
| `/services` | Transport & Logistics Services — 10 full-width service sections with quotation CTAs |
| `/vehicles` | Vehicles & Load Capacities — filterable vehicle showcase, dumper feature |
| `/network` | Network & DMIC — interactive India map (zoomable regions), DMIC section, office directory |
| `/leadership` | Leadership & Vision — Tej Rana (featured), Jalpesh Rana, Late Shri Dinesh Vasantlal Rana |
| `/digital-logistics` | Rana Connect (live) and Rana Track (coming soon — no simulated data) |
| `/contact` | Contact & Get a Quote — enquiry form, direct contact, map, all FAQs |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

Requires Node.js 20+.

## Enquiry form (Rana Connect)

`POST /api/enquiry` validates every submission server-side (zod), then:

1. **Stores** it in PostgreSQL (`DATABASE_URL`) — create the table once with `npm run db:init`.
2. **Emails** it to `ENQUIRY_TO` (default `contact@ranatransports.in`) via SMTP (`SMTP_*`, `ENQUIRY_FROM`).
3. Optionally **forwards** it as JSON to `CRM_WEBHOOK_URL` (CRM-ready).

Success is shown to the visitor **only** if the enquiry was stored or emailed. If neither is configured the API
returns `503` and the visitor is asked to call / WhatsApp instead — the form never fakes a submission.

Spam protection: hidden honeypot field, minimum fill-time check, per-IP rate limiting (in-memory — use Redis
for multi-instance hosting) and optional Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`).
Consent text is stored with every record (`src/lib/consent.ts`). IP addresses are stored only as salted hashes
(set `IP_HASH_SALT`).

Forms opened from a vehicle card, service section or office card are pre-filled (`?vehicle=`, `?service=`, `?from=`).

## Editing content

All copy and business facts live in `src/content/`:

| File | Contents |
|---|---|
| `site.ts` | Name, taglines, phone/WhatsApp/email, highlights, Why Rana, comparison, quote steps |
| `services.ts` | Services — set `approved: false` to hide one |
| `vehicles.ts` | Vehicle catalogue — figures are **illustrative**; set `verified: true` once confirmed; add `image` for a real photo |
| `offices.ts` | Office addresses and approximate map coordinates |
| `leadership.ts` | The three leaders (only these three appear on the site) |
| `faqs.ts` | FAQ answers (also emitted as FAQPage structured data) |
| `testimonials.ts` | Testimonials — rendered only when `consent: "granted"` **and** `status: "published"` |

### Brand assets

- `public/brand/` — official logo, cropped emblem, favicons (from the supplied logo).
- `public/media/rana-brand-film.mp4` — supplied brand film (fast-start remux); poster and hero stills are frames from it;
  `hero-loop.mp4` is a muted, audio-free 9-second excerpt for the hero background.
- `public/people/` — Dinesh Rana portrait + archive photo, Jalpesh Rana portrait.
- **Tej Rana**: a gradient "TR" monogram is shown until an approved photo is supplied. Add
  `public/people/tej-rana-portrait.jpg` and set `photo` for Tej in `src/content/leadership.ts`.

Colours come from the official logo (amber → flame → magenta → orchid → indigo → sky) plus the corporate
Midnight / Navy / Graphite / Electric Blue / Champagne Gold palette (`src/app/globals.css`).

### Vehicle imagery

Vehicle cards use original, unbranded SVG renders (`src/components/graphics/VehicleArt.tsx`). Third-party (e.g. Porter)
icons were **not** copied. To use real fleet or licensed photography, add an `image` path to a vehicle entry and the
card will display it instead.

### Map

India outline: [@svg-maps/india](https://github.com/VictorCazanave/svg-maps) by Victor Cazanave, CC BY 4.0 (credited in
the footer). Pins are approximate locality positions. The DMIC line is an *indicative alignment* for orientation only;
the site states that Rana is not an official DMIC partner and draws no delivery routes or unverified hubs.

## Pre-launch verification checklist

These items are flagged in the content files and must be confirmed by the company:

- [ ] Founding year (site currently says "around 1998–2001" and "approximately 25 years").
- [ ] Every vehicle payload / body length (currently illustrative ranges, labelled "Indicative").
- [ ] Which vehicle categories are actually available.
- [ ] Every service in `services.ts` is genuinely offered.
- [ ] Office postal addresses and pin coordinates.
- [ ] GPS tracking statement matches real capability.
- [ ] Approved photograph of Tej Rana.
- [ ] Real, consented testimonials (none are published by default).
- [ ] `DATABASE_URL` and/or SMTP configured, and a test enquiry received at contact@ranatransports.in.

## Accessibility & performance

- Respects `prefers-reduced-motion` (animations stop; scroll-road renders complete).
- Skip link, visible focus rings, semantic landmarks, labelled form fields with inline errors, `aria-live` alerts.
- Animations are SVG/CSS/GSAP — no WebGL bundle is shipped (Three.js was deliberately left out to keep mobile fast).
- Videos are muted/inline, with poster frames; the hero loop uses `preload="none"`.
- Metadata, Open Graph, `sitemap.xml`, `robots.txt`, MovingCompany + FAQPage JSON-LD.
