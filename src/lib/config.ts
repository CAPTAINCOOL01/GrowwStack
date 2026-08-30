export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? "growwstack@2026";

// Empty unless a real measurement ID is configured, so analytics never ships by accident.
export const GA_ID = (import.meta.env.VITE_GA_ID ?? "").trim();

const FALLBACK_PHONE = "917017138349";

// wa.me and tel: links need the full country-coded number. The env var has been
// set without the 91 prefix before, so normalise rather than trust it blindly.
function normalisePhone(raw: string | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return digits;
  return FALLBACK_PHONE;
}

export const CONTACT_PHONE = normalisePhone(import.meta.env.VITE_CONTACT_PHONE);
export const CONTACT_PHONE_DISPLAY = "+91 70171 38349";
