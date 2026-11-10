import { z } from "zod";

const trimmed = (max: number) => z.string({ message: "This field is required." }).trim().max(max, `Please keep this under ${max} characters.`);
const optionalText = (max: number) =>
  trimmed(max)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Indian mobile / landline, with or without +91 — 10 to 13 digits after stripping spaces. */
const phoneRegex = /^(\+?\d[\d\s-]{8,15}\d)$/;

export const enquirySchema = z.object({
  fullName: trimmed(120).min(2, "Please enter your full name."),
  phone: trimmed(20).regex(phoneRegex, "Please enter a valid phone number."),
  email: z
    .union([z.literal(""), z.string().trim().email("Please enter a valid email address.").max(160)])
    .optional()
    .transform((v) => (v ? v : undefined)),
  company: optionalText(160),
  requirement: trimmed(160).min(2, "Please describe the transport requirement."),
  cargo: trimmed(600).min(2, "Please describe the cargo."),
  weight: z.coerce
    .number({ message: "Please enter the cargo weight." })
    .positive("Weight must be greater than zero.")
    .max(1_000_000, "Please check the weight."),
  weightUnit: z.enum(["KG", "TON"], { message: "Please choose KG or TON." }),
  loadingLocation: trimmed(200).min(2, "Please enter the loading location."),
  unloadingLocation: trimmed(200).min(2, "Please enter the unloading location."),
  budget: z
    .union([z.literal(""), z.coerce.number().nonnegative("Budget cannot be negative.").max(1_000_000_000)])
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v)),
  loadingDate: z
    .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please choose a valid date.")])
    .optional()
    .transform((v) => (v ? v : undefined)),
  preferredVehicle: optionalText(80),
  service: optionalText(80),
  details: optionalText(2000),
  consent: z.literal(true, { message: "Please agree so we can contact you about this enquiry." }),
  // Spam protection fields
  website: z.string().max(0).optional(), // honeypot — must stay empty
  startedAt: z.coerce.number().optional(), // epoch ms when form rendered
  turnstileToken: z.string().optional(),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;
