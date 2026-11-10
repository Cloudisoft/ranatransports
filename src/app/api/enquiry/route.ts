import { NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { enquirySchema } from "@/lib/enquiry-schema";
import { dbConfigured, markEnquiry, saveEnquiry } from "@/lib/db";
import { mailConfigured, sendEnquiryEmail } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { CONSENT_TEXT } from "@/lib/consent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 3000;

function clientIp(req: Request) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown"
  );
}

async function verifyTurnstile(token: string | undefined, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not enabled
  if (!token) return false;
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

function makeReference() {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `RTL-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  const ipHash = createHash("sha256").update(ip + (process.env.IP_HASH_SALT ?? "rana")).digest("hex").slice(0, 32);

  if (!rateLimit(ipHash)) {
    return NextResponse.json(
      { ok: false, error: "Too many enquiries from this connection. Please try again later or contact us on WhatsApp." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    // A filled honeypot is a bot — respond generically without detail.
    if (fieldErrors.website) return NextResponse.json({ ok: false, error: "Unable to submit." }, { status: 400 });
    return NextResponse.json({ ok: false, error: "Please check the highlighted fields.", fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  if (data.startedAt && Date.now() - data.startedAt < MIN_FILL_MS) {
    return NextResponse.json({ ok: false, error: "Unable to submit. Please try again." }, { status: 400 });
  }
  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, error: "Spam check failed. Please try again." }, { status: 400 });
  }

  const canStore = dbConfigured();
  const canMail = mailConfigured();
  if (!canStore && !canMail) {
    console.error("[enquiry] Neither DATABASE_URL nor SMTP is configured — enquiry NOT accepted.");
    return NextResponse.json(
      {
        ok: false,
        error:
          "Online enquiries are temporarily unavailable. Please call or WhatsApp +91 8320294127, or email contact@ranatransports.in.",
      },
      { status: 503 },
    );
  }

  const reference = makeReference();
  const sourcePath = req.headers.get("referer") ?? undefined;
  let stored = false;
  let mailed = false;

  if (canStore) {
    try {
      await saveEnquiry(data, {
        reference,
        consentText: CONSENT_TEXT,
        sourcePath,
        ipHash,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
      stored = true;
    } catch (err) {
      console.error("[enquiry] DB save failed", err);
    }
  }

  if (canMail) {
    try {
      await sendEnquiryEmail(data, reference);
      mailed = true;
      if (stored) await markEnquiry(reference, "email_status", "sent").catch(() => {});
    } catch (err) {
      console.error("[enquiry] Email failed", err);
      if (stored) await markEnquiry(reference, "email_status", "failed").catch(() => {});
    }
  }

  if (!stored && !mailed) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not record your enquiry just now. Please try again, or call / WhatsApp +91 8320294127.",
      },
      { status: 502 },
    );
  }

  const crm = process.env.CRM_WEBHOOK_URL;
  if (crm) {
    fetch(crm, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reference, createdAt: new Date().toISOString(), ...data, turnstileToken: undefined, website: undefined }),
    })
      .then((r) => (stored ? markEnquiry(reference, "crm_status", r.ok ? "sent" : `http_${r.status}`) : undefined))
      .catch(() => (stored ? markEnquiry(reference, "crm_status", "failed") : undefined));
  }

  return NextResponse.json({ ok: true, reference });
}
