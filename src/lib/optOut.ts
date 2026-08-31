const OPT_OUT_KEY = "gs_optout";

/**
 * Self-exclusion, so the team's own visits don't pollute the numbers.
 *
 * Visit any page with ?gs_track=off once per browser to opt out, and
 * ?gs_track=on to opt back in. The flag lives in localStorage, so it persists
 * per browser profile and survives normal browsing — but not a cleared cache,
 * a different browser, or private windows.
 *
 * Suppresses both the Supabase visitor ping and GA4.
 */
export function syncOptOutFromUrl(): void {
  if (typeof window === "undefined") return;
  try {
    const value = new URLSearchParams(window.location.search).get("gs_track");
    if (value === "off") localStorage.setItem(OPT_OUT_KEY, "1");
    else if (value === "on") localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    // Storage blocked — nothing to persist.
  }
}

export function isOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}
