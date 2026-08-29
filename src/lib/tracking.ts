import { sbInsert } from "./supabase";

const SESSION_KEY = "gs_session_id";
const LAST_PING_KEY = "gs_last_ping";
const MIN_INTERVAL_MS = 30 * 60 * 1000;

function getSessionId(): string {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

function pickParam(params: URLSearchParams, key: string): string | null {
  const value = params.get(key);
  return value && value.length <= 128 ? value : null;
}

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/growwstack/admin")) return;

  try {
    const last = Number(localStorage.getItem(LAST_PING_KEY) ?? "0");
    if (Date.now() - last < MIN_INTERVAL_MS && last > 0) return;
    localStorage.setItem(LAST_PING_KEY, String(Date.now()));
  } catch {
    // storage disabled — still send the ping
  }

  const params = new URLSearchParams(window.location.search);
  const payload = {
    session_id: getSessionId(),
    page_path: window.location.pathname + window.location.search,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    screen_width: window.screen?.width ?? null,
    screen_height: window.screen?.height ?? null,
    language: navigator.language ?? null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    utm_source: pickParam(params, "utm_source"),
    utm_medium: pickParam(params, "utm_medium"),
    utm_campaign: pickParam(params, "utm_campaign"),
  };

  sbInsert("gs_visitors", payload).catch(() => {
    // fail silent — tracking must never break the site
  });
}
