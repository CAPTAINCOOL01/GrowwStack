import { sbInsert } from "./supabase";
import { isOptedOut } from "./optOut";

/**
 * Outbound and CTA click tracking.
 *
 * The most likely conversion paths on the site all leave it — WhatsApp, Calendly,
 * tel: and mailto: — so a visitor who actually made contact was recorded nowhere
 * and reported as zero. This captures those, plus form starts and submits, so
 * "no leads" can be distinguished from "leads we never counted".
 *
 * One delegated listener rather than handlers on every link: the links are spread
 * across six components and the static pages have no React at all.
 */

type EventName =
  | "click_whatsapp"
  | "click_calendly"
  | "click_phone"
  | "click_email"
  | "click_cta"
  | "form_start"
  | "form_submit";

function classify(href: string): EventName | null {
  if (href.startsWith("https://wa.me/")) return "click_whatsapp";
  if (href.includes("calendly.com/")) return "click_calendly";
  if (href.startsWith("tel:")) return "click_phone";
  if (href.startsWith("mailto:")) return "click_email";
  return null;
}

export function trackEvent(name: EventName, label?: string): void {
  if (typeof window === "undefined" || isOptedOut()) return;

  sbInsert("gs_events", {
    session_id: (() => {
      try {
        return sessionStorage.getItem("gs_session_id") ?? "anon";
      } catch {
        return "anon";
      }
    })(),
    event_name: name,
    label: label ? label.slice(0, 200) : null,
    page_path: window.location.pathname,
    referrer: document.referrer || null,
  }).catch(() => {
    // Never let instrumentation break a real click.
  });

  try {
    window.gtag?.("event", name, { event_label: label });
  } catch {
    /* ignore */
  }
}

/** Delegated listener covering every outbound link and CTA on the page. */
export function initEventTracking(): void {
  if (typeof window === "undefined" || isOptedOut()) return;

  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const text = (anchor.textContent ?? "").trim().slice(0, 80);

      const outbound = classify(href);
      if (outbound) {
        trackEvent(outbound, text || href);
        return;
      }
      // In-page CTAs that move someone toward a form.
      if (href === "#apply" || href === "#build" || href === "#offer" || href === "#contact") {
        trackEvent("click_cta", `${href} :: ${text}`);
      }
    },
    { capture: true, passive: true },
  );
}
