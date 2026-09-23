import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

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
  try {
    res = await fetch(`${restUrl}/${table}`, {
      method: "POST",
      headers: headers({ Prefer: "return=minimal" }),
      body: JSON.stringify(row),
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
