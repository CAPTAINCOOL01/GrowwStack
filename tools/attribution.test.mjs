import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { createAttributionRuntime, attributionFromRecord, campaignLabel } from "../src/lib/attribution.mjs";
import { analyticsSnippet } from "./analytics-snippet.mjs";

function storage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
function browser(href, referrer = "", sessionStorage = storage()) {
  return { location: new URL(href), document: { referrer }, sessionStorage, crypto: { randomUUID: () => "12345678-1234-4321-1234-123456789012" } };
}
const origin = "https://growwstack.in";
const query = "?utm_source=growwstack_outreach&utm_medium=email&utm_campaign=daily_d2c_outreach&utm_id=daily_d2c_outreach&utm_content=initial_email&oid=aa11bb22cc33dd44";

test("email entry survives static blog to internal form, without schema changes", () => {
  const env = browser(origin + "/blog/ga4-lead-generation-tracking" + query);
  const blog = createAttributionRuntime(env);
  assert.equal(blog.capture().channel, "email");
  blog.markPageRecorded();
  assert.equal(blog.shouldRecordPage(), false);
  const form = createAttributionRuntime(browser(origin + "/contact", origin + "/blog/ga4-lead-generation-tracking" + query, env.sessionStorage));
  const row = attributionFromRecord({ page_path: form.pagePath(), referrer: form.capture().referrer });
  assert.equal(row.campaign, "daily_d2c_outreach");
  assert.equal(row.oid, "aa11bb22cc33dd44");
  assert.equal(new URL(form.pagePath(), origin).searchParams.get("utm_id"), "daily_d2c_outreach");
  assert.equal(form.gaConfig().campaign_id, "daily_d2c_outreach");
  assert.equal(new URL(form.gaConfig().page_location).searchParams.get("utm_id"), "daily_d2c_outreach");
  assert.equal(form.shouldRecordPage(), true);
  assert.equal(campaignLabel(row.campaign), "D2C daily outreach");
});

test("an incoming email campaign is recorded after a recent organic visit", () => {
  const env = browser(origin, "https://www.google.com/search?q=agency");
  const organic = createAttributionRuntime(env);
  assert.equal(organic.capture().channel, "organic_search");
  organic.markPageRecorded();
  assert.equal(organic.shouldRecordPage(), false);
  const email = createAttributionRuntime(browser(origin + query, "", env.sessionStorage));
  assert.equal(email.shouldRecordPage(), true);
  assert.equal(email.capture().utm_campaign, "daily_d2c_outreach");
  const foreign = createAttributionRuntime(browser(origin + query.replace("daily_d2c_outreach", "foreign_clients_outreach"), "", env.sessionStorage));
  email.markPageRecorded();
  assert.equal(foreign.shouldRecordPage(), true);
  assert.equal(foreign.capture().utm_campaign, "foreign_clients_outreach");
});

test("new external organic referral replaces stale email attribution", () => {
  const env = browser(origin + query);
  createAttributionRuntime(env).capture();
  const google = createAttributionRuntime(browser(origin, "https://www.google.co.in/search?q=service", env.sessionStorage));
  assert.equal(google.capture().channel, "organic_search");
  assert.equal(google.capture().utm_campaign, null);
  assert.equal(google.capture().oid, null);
  assert.equal(google.capture().referrer, "https://www.google.co.in/search");
});

test("opaque recipient ID stays first party, GA sees only approved campaign fields", () => {
  const runtime = createAttributionRuntime(browser(origin + query + "&email=private@example.com&name=Someone&unknown=secret"));
  const ga = runtime.gaConfig();
  assert.equal(ga.campaign_name, "daily_d2c_outreach");
  assert.equal(ga.campaign_source, "growwstack_outreach");
  assert.equal(ga.campaign_id, "daily_d2c_outreach");
  assert(!JSON.stringify(ga).includes("aa11bb22cc33dd44"));
  assert(!JSON.stringify(ga).includes("private"));
  assert(!runtime.pagePath().includes("private"));
  const bad = createAttributionRuntime(browser(origin + "?utm_source=private%40example.com&utm_medium=email&oid=short"));
  assert.equal(bad.capture().utm_source, null);
  assert.equal(bad.capture().oid, null);
});

test("new direct visit and historical unknown rows stay distinct", () => {
  const direct = createAttributionRuntime(browser(origin));
  assert.equal(attributionFromRecord({ page_path: direct.pagePath() }).channel, "direct");
  assert.equal(attributionFromRecord({ page_path: "/contact", referrer: origin }).channel, "unknown");
  assert.equal(attributionFromRecord({ page_path: "/", utm_medium: "email", utm_campaign: "foreign_clients_outreach" }).channel, "email");
});

test("auto-tagged ads keep native GA click identifiers and never masquerade as organic", () => {
  const runtime = createAttributionRuntime(browser(origin + "?gclid=0123456789_test", "https://www.google.com"));
  assert.equal(runtime.capture().channel, "paid_search");
  assert(runtime.gaConfig().page_location.includes("gclid=0123456789_test"));
  assert(!runtime.pagePath().includes("gclid"));
  assert.equal(attributionFromRecord({ page_path: "http://" }).channel, "unknown");
});

test("session expiry prevents carrying a previous campaign into a later direct visit", () => {
  const env = browser(origin + query);
  createAttributionRuntime(env).capture();
  const stored = JSON.parse(env.sessionStorage.getItem("gs_attribution_v1"));
  stored.touched -= 1800001;
  env.sessionStorage.setItem("gs_attribution_v1", JSON.stringify(stored));
  const later = createAttributionRuntime(browser(origin, "", env.sessionStorage));
  assert.equal(later.capture().channel, "direct");
  assert.equal(later.capture().utm_campaign, undefined);
});

test("blocked storage keeps same-page instrumentation working", () => {
  const env = browser(origin + query);
  env.sessionStorage = { getItem() { throw Error("blocked"); }, setItem() { throw Error("blocked"); } };
  const runtime = createAttributionRuntime(env);
  assert.equal(runtime.capture().channel, "email");
  assert.equal(runtime.shouldRecordPage(), true);
  runtime.markPageRecorded();
});

test("generated HTML embeds the same attribution and preserves denied consent", async () => {
  process.env.VITE_GA_ID = "G-TEST";
  process.env.VITE_SUPABASE_URL = "https://example.supabase.co";
  process.env.VITE_SUPABASE_ANON_KEY = "public-test-key";
  const env = browser(origin + "/blog/test" + query);
  const requests = [], listeners = {};
  const doc = { ...env.document, readyState: "loading", addEventListener(name, fn) { listeners[name] = fn; }, createElement: () => ({}), head: { appendChild() {} } };
  const context = { ...env, document: doc, localStorage: storage(), URL, URLSearchParams, Date, Math, Object, Number, JSON, Intl, navigator: { userAgent: "test", language: "en" }, screen: { width: 1280, height: 800 }, fetch: async (url, options) => { requests.push({ url, row: JSON.parse(options.body) }); return { ok: true }; } };
  context.window = context;
  vm.runInNewContext(analyticsSnippet().slice(8, -9), context);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(requests.length, 1);
  assert.equal(requests[0].row.utm_campaign, "daily_d2c_outreach");
  assert.equal(attributionFromRecord(requests[0].row).oid, "aa11bb22cc33dd44");
  const calls = context.dataLayer.map(args => Array.from(args));
  assert.equal(calls.find(args => args[0] === "consent")[2].analytics_storage, "denied");
  assert.equal(calls.find(args => args[0] === "config")[2].campaign_id, "daily_d2c_outreach");
  assert(!JSON.stringify(calls).includes("aa11bb22cc33dd44"));
});
