import "server-only";
import { Pool } from "pg";
import type { Enquiry } from "./enquiry-schema";

let pool: Pool | null = null;

export const dbConfigured = () => Boolean(process.env.DATABASE_URL);

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      ssl: process.env.DATABASE_SSL === "disable" ? false : process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export const CREATE_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS enquiries (
  id               BIGSERIAL PRIMARY KEY,
  reference        TEXT UNIQUE NOT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  full_name        TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT,
  company          TEXT,
  requirement      TEXT NOT NULL,
  cargo            TEXT NOT NULL,
  weight           NUMERIC NOT NULL,
  weight_unit      TEXT NOT NULL CHECK (weight_unit IN ('KG','TON')),
  loading_location TEXT NOT NULL,
  unloading_location TEXT NOT NULL,
  budget_inr       NUMERIC,
  loading_date     DATE,
  preferred_vehicle TEXT,
  service          TEXT,
  details          TEXT,
  consent          BOOLEAN NOT NULL,
  consent_text     TEXT NOT NULL,
  source_path      TEXT,
  ip_hash          TEXT,
  user_agent       TEXT,
  email_status     TEXT NOT NULL DEFAULT 'pending',
  crm_status       TEXT NOT NULL DEFAULT 'pending',
  status           TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS enquiries_created_at_idx ON enquiries (created_at DESC);
`;

export async function saveEnquiry(
  e: Enquiry,
  meta: { reference: string; consentText: string; sourcePath?: string; ipHash?: string; userAgent?: string },
) {
  await getPool().query(
    `INSERT INTO enquiries (reference, full_name, phone, email, company, requirement, cargo, weight, weight_unit,
      loading_location, unloading_location, budget_inr, loading_date, preferred_vehicle, service, details,
      consent, consent_text, source_path, ip_hash, user_agent)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)`,
    [
      meta.reference, e.fullName, e.phone, e.email ?? null, e.company ?? null, e.requirement, e.cargo, e.weight,
      e.weightUnit, e.loadingLocation, e.unloadingLocation, e.budget ?? null, e.loadingDate ?? null,
      e.preferredVehicle ?? null, e.service ?? null, e.details ?? null, e.consent, meta.consentText,
      meta.sourcePath ?? null, meta.ipHash ?? null, meta.userAgent?.slice(0, 300) ?? null,
    ],
  );
}

export async function markEnquiry(reference: string, field: "email_status" | "crm_status", value: string) {
  if (!dbConfigured()) return;
  await getPool().query(`UPDATE enquiries SET ${field} = $1 WHERE reference = $2`, [value, reference]);
}
