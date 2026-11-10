/**
 * Testimonials. Only entries with `consent: "granted"` AND `status: "published"`
 * are ever rendered on the public website. Do NOT add invented reviews.
 *
 * To add one: obtain written consent, record it here, and set status to "published".
 */
export type Testimonial = {
  id: string;
  /** Verified customer name, or an approved anonymous label (e.g. "Textile manufacturer, Surat"). */
  name: string;
  quote: string;
  businessType: string;
  city?: string;
  /** Path under /public — only with the business's approval. */
  logo?: string;
  consent: "granted" | "pending" | "withdrawn";
  status: "draft" | "published";
  /** Date consent was received (YYYY-MM-DD) — for audit. */
  consentDate?: string;
};

export const TESTIMONIALS: Testimonial[] = [];

export const PUBLISHED_TESTIMONIALS = TESTIMONIALS.filter(
  (t) => t.consent === "granted" && t.status === "published",
);

/** Prompts for collecting real customer feedback — never shown as testimonials. */
export const REVIEW_PROMPTS = [
  "Please describe how our team supported your transportation requirement and what you valued about the experience.",
  "Please share your experience of our communication, quotation process and transport coordination.",
  "Please tell us how our services have supported your recurring or commercial transport requirements.",
];
