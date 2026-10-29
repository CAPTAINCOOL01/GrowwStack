import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import { attributionRuntime } from "./attribution.mjs";
import { isOptedOut } from "./optOut";

const restUrl = `${SUPABASE_URL}/rest/v1`;

function headers(extra: Record<string, string> = {}): HeadersInit {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function sbInsert<T extends Record<string, unknown>>(
  table: string,
  row: T,
): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error("The contact service is unavailable right now.");
  }
  // Forms show this message to visitors, so the technical detail travels as the
  // cause instead of being printed on the page.
  const unsaved = (cause: unknown) =>
    new Error("We could not save your details just now. Please try again.", { cause });
  let res: Response;
  // Reuse existing columns so attribution cannot break forms on an older DB.
  // Retain the form's source (quick_contact, website_build, etc.) separately.
  let payload: Record<string, unknown> = row;
  if (["gs_leads", "gs_applications", "gs_website_orders", "gs_events"].includes(table) && !isOptedOut()) {
    const runtime = attributionRuntime();
    if (runtime) payload = { ...row, page_path: runtime.pagePath(typeof row.page_path === "string" ? row.page_path : undefined), referrer: runtime.capture().referrer };
  }
  try {
    res = await fetch(`${restUrl}/${table}`, {
      method: "POST",
      headers: headers({ Prefer: "return=minimal" }),
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch (err) {
    throw unsaved(err);
  }
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw unsaved(`Supabase insert failed (${res.status}): ${text}`);
  }
}

export async function sbSelect<T>(
  table: string,
  query: string = "select=*&order=created_at.desc&limit=500",
): Promise<T[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const res = await fetch(`${restUrl}/${table}?${query}`, {
    headers: headers(),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase select failed (${res.status}): ${text}`);
  }
  return (await res.json()) as T[];
}
