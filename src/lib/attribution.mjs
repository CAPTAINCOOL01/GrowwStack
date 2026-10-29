/**
 * Shared by the React app and the generated HTML pages. Keep this factory
 * self-contained: the static-page build embeds the same function, not a second
 * implementation. No names, email addresses or arbitrary URL parameters belong
 * in attribution. An optional oid is a random CRM lookup key, never sent to GA.
 */
export function createAttributionRuntime(env) {
  var KEY = "gs_attribution_v1", PING = "gs_last_ping_v2", TTL = 1800000;
  var fields = ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"];
  var clickFields = ["gclid", "dclid", "gbraid", "wbraid", "msclkid"];
  var state = null, initialized = false;
  function storage(fn, fallback) { try { return fn(); } catch (_) { return fallback; } }
  function token(value) {
    return typeof value === "string" && /^[a-z0-9][a-z0-9._~ -]{0,99}$/i.test(value) ? value : null;
  }
  function oid(value) { return typeof value === "string" && /^[a-z0-9_-]{16,64}$/i.test(value) ? value : null; }
  function clickId(value) { return typeof value === "string" && /^[a-z0-9_.-]{10,256}$/i.test(value) ? value : null; }
  function cleanReferrer(value) {
    try {
      var url = new URL(value);
      return /^(https?:)$/.test(url.protocol) && url.origin !== env.location.origin ? url.origin + url.pathname : null;
    } catch (_) { return null; }
  }
  function classify(referrer) {
    if (!referrer) return "direct";
    var host = new URL(referrer).hostname.toLowerCase();
    return /(^|\.)(google\.[a-z.]+|bing\.com|search\.yahoo\.com|duckduckgo\.com|ecosia\.org|search\.brave\.com)$/.test(host) ? "organic_search" : "referral";
  }
  function fresh(now) {
    var id = storage(function () { return env.crypto.randomUUID(); }, null) || "session-" + now + "-" + Math.random().toString(36).slice(2);
    return { session_id: id, touched: now, referrer: null, channel: "direct", oid: null };
  }
  function capture() {
    var now = Date.now(), first = !initialized;
    if (!initialized) {
      initialized = true;
      state = storage(function () { return JSON.parse(env.sessionStorage.getItem(KEY) || "null"); }, null);
    }
    if (!state || typeof state.session_id !== "string" || !Number.isFinite(state.touched) || now - state.touched >= TTL) state = fresh(now);
    var params = new URLSearchParams(env.location.search), incoming = {}, tagged = false;
    fields.forEach(function (field) { incoming[field] = token(params.get(field)); if (incoming[field]) tagged = true; });
    var paid = clickFields.some(function (field) { return Boolean(clickId(params.get(field))); });
    var referrer = cleanReferrer(env.document.referrer);
    if (tagged) {
      fields.forEach(function (field) { state[field] = incoming[field]; });
      var medium = (incoming.utm_medium || "").toLowerCase();
      state.channel = medium === "email" ? "email" : /^(cpc|ppc|paidsearch|paid_search)$/.test(medium) ? "paid_search" : medium === "organic" ? "organic_search" : "other_campaign";
      state.oid = medium === "email" ? oid(params.get("oid")) : null;
      state.referrer = referrer;
    } else if (paid || (first && referrer)) {
      fields.forEach(function (field) { state[field] = null; });
      state.channel = paid ? "paid_search" : classify(referrer);
      state.referrer = referrer;
      state.oid = null;
    }
    state.touched = now;
    storage(function () {
      env.sessionStorage.setItem(KEY, JSON.stringify(state));
      env.sessionStorage.setItem("gs_session_id", state.session_id);
    });
    return Object.assign({}, state);
  }
  function pagePath(path) {
    var a = capture(), query = new URLSearchParams();
    fields.forEach(function (field) { if (a[field]) query.set(field, a[field]); });
    query.set("gs_channel", a.channel);
    if (a.oid) query.set("oid", a.oid);
    return (path || env.location.pathname).split(/[?#]/)[0] + "?" + query.toString();
  }
  function gaConfig() {
    var a = capture(), query = new URLSearchParams(), config = {};
    fields.forEach(function (field) { if (a[field]) query.set(field, a[field]); });
    // Preserve auto-tagged ads for Google's native attribution, without storing
    // click identifiers in our customer dashboard.
    var incoming = new URLSearchParams(env.location.search);
    clickFields.forEach(function (field) { var value = clickId(incoming.get(field)); if (value) query.set(field, value); });
    config.page_location = env.location.origin + env.location.pathname + (query.size ? "?" + query.toString() : "");
    // GA's native campaign fields keep attribution across an internal redirect.
    var names = { utm_source: "campaign_source", utm_medium: "campaign_medium", utm_campaign: "campaign_name", utm_id: "campaign_id", utm_content: "campaign_content", utm_term: "campaign_term" };
    fields.forEach(function (field) { if (a[field]) config[names[field]] = a[field]; });
    if (a.referrer) config.page_referrer = a.referrer;
    return config;
  }
  function pingKey() { return capture().session_id + ":" + pagePath(); }
  function shouldRecordPage() {
    var key = pingKey();
    var last = storage(function () { return JSON.parse(env.sessionStorage.getItem(PING) || "null"); }, null);
    return !last || last.key !== key || Date.now() - last.time >= TTL;
  }
  function markPageRecorded() {
    storage(function () { env.sessionStorage.setItem(PING, JSON.stringify({ key: pingKey(), time: Date.now() })); });
  }
  return { capture: capture, pagePath: pagePath, gaConfig: gaConfig, shouldRecordPage: shouldRecordPage, markPageRecorded: markPageRecorded };
}

let runtime;
export function attributionRuntime() {
  if (typeof window === "undefined") return null;
  return runtime || (runtime = createAttributionRuntime(window));
}

/** Also reads historical rows which predate persisted attribution. */
export function attributionFromRecord(row) {
  let url;
  try { url = new URL(row.page_path || "/", "https://growwstack.in"); }
  catch { url = new URL("https://growwstack.in"); }
  const p = url.searchParams;
  const source = row.utm_source || p.get("utm_source") || null;
  const medium = row.utm_medium || p.get("utm_medium") || null;
  const campaign = row.utm_campaign || p.get("utm_campaign") || null;
  const content = p.get("utm_content");
  const oid = /^[a-z0-9_-]{16,64}$/i.test(p.get("oid") || "") ? p.get("oid") : null;
  const known = ["email", "organic_search", "paid_search", "referral", "direct", "other_campaign"];
  let channel = known.includes(p.get("gs_channel")) ? p.get("gs_channel") : null;
  if (medium) channel = medium.toLowerCase() === "email" ? "email" : /^(cpc|ppc|paidsearch|paid_search)$/i.test(medium) ? "paid_search" : medium.toLowerCase() === "organic" ? "organic_search" : "other_campaign";
  if (!channel && (source || campaign)) channel = "other_campaign";
  if (!channel && row.referrer) {
    try {
      const ref = new URL(row.referrer);
      if (!/(^|\.)growwstack\.in$/i.test(ref.hostname)) channel = /(^|\.)(google\.[a-z.]+|bing\.com|search\.yahoo\.com|duckduckgo\.com|ecosia\.org|search\.brave\.com)$/i.test(ref.hostname) ? "organic_search" : "referral";
    } catch { /* Historical malformed referrer: attribution remains unknown. */ }
  }
  // Historical untagged rows cannot establish whether a previous page lost UTMs.
  return { channel: channel || "unknown", source, medium, campaign, content, oid };
}

export function channelLabel(channel) {
  return ({ email: "Email outreach", organic_search: "Organic search", paid_search: "Paid search", referral: "Referral", direct: "Direct / untagged", other_campaign: "Other campaign", unknown: "Unknown (older record)" })[channel] || "Unknown";
}

export function campaignLabel(campaign) {
  return ({ daily_d2c_outreach: "D2C daily outreach", daily_manufacturer_outreach: "Manufacturer daily outreach", foreign_clients_outreach: "Foreign client outreach" })[campaign] || campaign || "No campaign";
}
