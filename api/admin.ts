import crypto from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Admin data endpoint.
 *
 * Reads run here with the service_role key so the browser never holds a
 * credential that can read gs_leads. The anon key shipped to visitors can
 * only INSERT; both anon SELECT policies were dropped alongside this.
 *
 * Required env (Production, server-side — no VITE_ prefix, so they are never
 * bundled into the client):
 *   ADMIN_PASSWORD
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_URL  (falls back to VITE_SUPABASE_URL)
 */

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;

function timingSafeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  // Compare fixed-length digests so length alone doesn't leak via timing.
  const ah = crypto.createHash("sha256").update(ab).digest();
  const bh = crypto.createHash("sha256").update(bb).digest();
  return crypto.timingSafeEqual(ah, bh);
}

function sign(expiry: number, secret: string): string {
  const mac = crypto.createHmac("sha256", secret).update(String(expiry)).digest("hex");
  return `${expiry}.${mac}`;
}

function verifyToken(token: string, secret: string): boolean {
  const [expRaw, mac] = token.split(".");
  const exp = Number(expRaw);
  if (!expRaw || !mac || !Number.isFinite(exp)) return false;
  if (Date.now() > exp) return false;
  return timingSafeEqual(sign(exp, secret), token);
}

async function readTable(base: string, key: string, table: string, limit: number) {
  const url = `${base}/rest/v1/${table}?select=*&order=created_at.desc&limit=${limit}`;
  const res = await fetch(url, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${table} read failed (${res.status})`);
  return res.json();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Referrer-Policy", "no-referrer");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;

  if (!adminPassword || !serviceKey || !supabaseUrl) {
    return res.status(500).json({ error: "Admin endpoint is not configured." });
  }

  const body = (typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body) ?? {};
  const { password, token } = body as { password?: string; token?: string };

  let authorised = false;
  let issued: string | null = null;

  if (typeof token === "string" && token) {
    authorised = verifyToken(token, adminPassword);
  } else if (typeof password === "string" && password) {
    authorised = timingSafeEqual(password, adminPassword);
    if (authorised) issued = sign(Date.now() + SESSION_TTL_MS, adminPassword);
  }

  if (!authorised) {
    // Blunt the speed of an online guessing loop.
    await new Promise((r) => setTimeout(r, 400));
    return res.status(401).json({ error: "Unauthorised" });
  }

  try {
    const [leads, visitors] = await Promise.all([
      readTable(supabaseUrl, serviceKey, "gs_leads", 1000),
      readTable(supabaseUrl, serviceKey, "gs_visitors", 1000),
    ]);
    return res.status(200).json({ token: issued, leads, visitors });
  } catch (err) {
    return res.status(502).json({ error: err instanceof Error ? err.message : "Upstream read failed" });
  }
}
