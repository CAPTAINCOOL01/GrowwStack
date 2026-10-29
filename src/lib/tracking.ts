import { sbInsert } from "./supabase";
import { isOptedOut } from "./optOut";
import { attributionRuntime } from "./attribution.mjs";

const pending = new Set<string>();

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname.startsWith("/admin")) return;
  if (isOptedOut()) return;

  const runtime = attributionRuntime()!;
  const attribution = runtime.capture();
  const pagePath = runtime.pagePath();
  if (!runtime.shouldRecordPage() || pending.has(pagePath)) return;
  pending.add(pagePath);
  const payload = {
    session_id: attribution.session_id,
    page_path: pagePath,
    referrer: attribution.referrer,
    user_agent: navigator.userAgent,
    screen_width: window.screen?.width ?? null,
    screen_height: window.screen?.height ?? null,
    language: navigator.language ?? null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
    utm_source: attribution.utm_source || null,
    utm_medium: attribution.utm_medium || null,
    utm_campaign: attribution.utm_campaign || null,
  };

  sbInsert("gs_visitors", payload).then(() => runtime.markPageRecorded()).catch(() => {
    // fail silent — tracking must never break the site
  }).finally(() => pending.delete(pagePath));
}
