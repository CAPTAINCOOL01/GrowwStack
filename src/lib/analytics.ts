import { GA_ID } from "./config";

const CONSENT_KEY = "gs_consent";

export type ConsentChoice = "granted" | "denied";

type ConsentState = {
  ad_storage: ConsentChoice;
  ad_user_data: ConsentChoice;
  ad_personalization: ConsentChoice;
  analytics_storage: ConsentChoice;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function stateFor(choice: ConsentChoice): ConsentState {
  return {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: choice,
  };
}

export function readConsent(): ConsentChoice | null {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    return null;
  }
}

function ensureGtag(): (...args: unknown[]) => void {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag() {
      // Must push `arguments` itself — gtag.js reads the Arguments object.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  }
  return window.gtag;
}

/**
 * Consent Mode v2. Defaults are declared *before* gtag.js loads, so Google
 * holds back storage until the visitor answers the banner. Until then GA
 * receives only cookieless pings; nothing is written to the browser.
 *
 * No GA ID configured means no script, no dataLayer, no pings at all.
 */
export function initAnalytics(): void {
  if (typeof window === "undefined" || !GA_ID) return;
  if (document.getElementById("ga-src")) return;

  const gtag = ensureGtag();
  const stored = readConsent();

  gtag("consent", "default", {
    ...stateFor("denied"),
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });

  // Returning visitor who already accepted — apply before the first pageview.
  if (stored === "granted") gtag("consent", "update", stateFor("granted"));

  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.id = "ga-src";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  document.head.appendChild(script);
}

export function setConsent(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage blocked — the choice still applies for this page view.
  }
  if (!GA_ID) return;
  ensureGtag()("consent", "update", stateFor(choice));
}
