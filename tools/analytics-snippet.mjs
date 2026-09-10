/**
 * Inline analytics for the statically generated pages.
 *
 * Those pages ship no bundle, so the React app never runs on them — which meant
 * the blog and case studies were invisible to both GA4 and the Supabase visitor
 * ping. Every page designed to attract search traffic was unmeasurable.
 *
 * This reproduces what src/lib/{optOut,tracking,analytics}.ts do: honour the
 * ?gs_track opt-out, throttle the first-party ping the same way, declare Consent
 * Mode v2 defaults as denied before gtag.js loads, and render the same banner
 * (styled by classes already present in the bundle CSS).
 *
 * Config is read at build time. With VITE_GA_ID unset, no GA code runs at all.
 */

function body(gaId, sbUrl, sbKey) {
  return `(function () {
  var GA = ${JSON.stringify(gaId)}, SBU = ${JSON.stringify(sbUrl)}, SBK = ${JSON.stringify(sbKey)};
  function ls(fn, d) { try { return fn(); } catch (e) { return d; } }

  var q = new URLSearchParams(location.search).get("gs_track");
  if (q === "off") ls(function () { localStorage.setItem("gs_optout", "1"); });
  else if (q === "on") ls(function () { localStorage.removeItem("gs_optout"); });
  if (ls(function () { return localStorage.getItem("gs_optout"); }) === "1") return;

  if (SBU && SBK) {
    var last = Number(ls(function () { return localStorage.getItem("gs_last_ping"); }, 0) || 0);
    if (!(last && Date.now() - last < 1800000)) {
      ls(function () { localStorage.setItem("gs_last_ping", String(Date.now())); });
      var sid = ls(function () {
        var v = sessionStorage.getItem("gs_session_id");
        if (!v) { v = crypto.randomUUID ? crypto.randomUUID() : String(Date.now()); sessionStorage.setItem("gs_session_id", v); }
        return v;
      }, "anon");
      var pr = new URLSearchParams(location.search);
      fetch(SBU + "/rest/v1/gs_visitors", {
        method: "POST", keepalive: true,
        headers: { apikey: SBK, Authorization: "Bearer " + SBK, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          session_id: sid,
          page_path: location.pathname + location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          screen_width: screen.width,
          screen_height: screen.height,
          language: navigator.language || null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
          utm_source: pr.get("utm_source"),
          utm_medium: pr.get("utm_medium"),
          utm_campaign: pr.get("utm_campaign")
        })
      }).catch(function () {});
    }
  }

  if (!GA) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  var DENY = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  var stored = ls(function () { return localStorage.getItem("gs_consent"); });

  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted",
    security_storage: "granted", wait_for_update: 500
  });
  if (stored === "granted") {
    gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  }
  gtag("js", new Date());
  gtag("config", GA, { anonymize_ip: true });

  var sc = document.createElement("script");
  sc.async = true; sc.id = "ga-src";
  sc.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA);
  document.head.appendChild(sc);

  if (stored === "granted" || stored === "denied") return;

  function banner() {
    var b = document.createElement("div");
    b.className = "gs-consent";
    b.setAttribute("role", "dialog");
    b.innerHTML = '<div class="gs-consent__inner"><div class="gs-consent__copy">' +
      '<p class="gs-consent__title">Analytics cookies</p>' +
      '<p>We use Google Analytics to see which pages bring partners in. Nothing is stored on your device until you accept, and we never use it for advertising.</p>' +
      '</div><div class="gs-consent__actions">' +
      '<button type="button" class="gs-consent__button" data-c="denied">Decline</button>' +
      '<button type="button" class="gs-consent__button gs-consent__button--primary" data-c="granted">Accept</button>' +
      '</div></div>';
    b.addEventListener("click", function (e) {
      var c = e.target && e.target.getAttribute && e.target.getAttribute("data-c");
      if (!c) return;
      ls(function () { localStorage.setItem("gs_consent", c); });
      gtag("consent", "update", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: c });
      b.remove();
    });
    document.body.appendChild(b);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner);
  else banner();
})();`;
}

export function analyticsSnippet() {
  const gaId = (process.env.VITE_GA_ID || "").trim();
  const sbUrl = (process.env.VITE_SUPABASE_URL || "").trim();
  const sbKey = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();
  if (!gaId && !(sbUrl && sbKey)) return "";
  return "<script>" + body(gaId, sbUrl, sbKey) + "</" + "script>";
}
