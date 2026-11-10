import "server-only";
import nodemailer from "nodemailer";
import type { Enquiry } from "./enquiry-schema";
import { SITE } from "@/content/site";

export const mailConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && process.env.ENQUIRY_FROM);

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export function enquiryRows(e: Enquiry): [string, string][] {
  return [
    ["Full name", e.fullName],
    ["Phone", e.phone],
    ["Email", e.email ?? "—"],
    ["Company", e.company ?? "—"],
    ["Transport requirement", e.requirement],
    ["Service", e.service ?? "—"],
    ["Cargo description", e.cargo],
    ["Weight", `${e.weight} ${e.weightUnit}`],
    ["Loading location", e.loadingLocation],
    ["Unloading location", e.unloadingLocation],
    ["Desired budget (INR)", e.budget !== undefined ? `₹${e.budget.toLocaleString("en-IN")}` : "—"],
    ["Desired loading date", e.loadingDate ?? "—"],
    ["Preferred vehicle", e.preferredVehicle ?? "—"],
    ["Additional details", e.details ?? "—"],
  ];
}

export async function sendEnquiryEmail(e: Enquiry, reference: string) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const rows = enquiryRows(e);
  const html = `
  <div style="font-family:Arial,sans-serif;color:#0b1220">
    <h2 style="margin:0 0 8px">New transport enquiry — ${esc(reference)}</h2>
    <p style="margin:0 0 16px;color:#555">Submitted via ${esc(SITE.url)}. The customer consented to be contacted about this enquiry.</p>
    <table cellpadding="8" style="border-collapse:collapse;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="border:1px solid #ddd;background:#f6f7fb;font-weight:bold">${esc(k)}</td><td style="border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`).join("")}
    </table>
  </div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
  await transport.sendMail({
    from: process.env.ENQUIRY_FROM,
    to: process.env.ENQUIRY_TO ?? SITE.email,
    replyTo: e.email,
    subject: `Transport enquiry ${reference}: ${e.loadingLocation} → ${e.unloadingLocation} (${e.weight} ${e.weightUnit})`,
    text: `New transport enquiry ${reference}\n\n${text}`,
    html,
  });
}
