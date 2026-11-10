// Creates the `enquiries` table. Usage: DATABASE_URL=... npm run db:init
import pg from "pg";
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../src/lib/db.ts", import.meta.url), "utf8");
const sql = src.match(/CREATE_TABLE_SQL = `([\s\S]*?)`;/)?.[1];
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL.includes("localhost") || process.env.DATABASE_SSL === "disable" ? false : { rejectUnauthorized: false },
});
await client.connect();
await client.query(sql);
await client.end();
console.log("enquiries table is ready.");
