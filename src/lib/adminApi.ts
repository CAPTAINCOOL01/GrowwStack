const TOKEN_KEY = "gs_admin_token";

export type AdminPayload<L, V, O, A> = {
  token: string | null;
  leads: L[];
  visitors: V[];
  orders: O[];
  applications: A[];
};

export function readToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function storeToken(token: string): void {
  try {
    sessionStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Session storage blocked — the token still works for this page view.
  }
}

export function clearToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Talks to /api/admin, which holds the service_role key. The browser only ever
 * sees a short-lived signed token — never the admin password, never a Supabase
 * credential that can read leads.
 */
export async function adminFetch<L, V, O, A>(
  credential: { password: string } | { token: string },
): Promise<AdminPayload<L, V, O, A>> {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credential),
  });

  if (res.status === 401) throw new Error("Incorrect password.");
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }

  const data = (await res.json()) as AdminPayload<L, V, O, A>;
  if (data.token) storeToken(data.token);
  return data;
}
