import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { seoPages } from "./seo-metadata.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
for (const [slug, meta] of Object.entries(seoPages)) {
  const file = path.join(root, "dist", `${slug || "index"}.html`);
  if (!fs.existsSync(file)) throw new Error(`Missing prerendered SEO page: ${slug || "/"}`);
  let html = fs.readFileSync(file, "utf8");
  const url = `https://growwstack.in/${slug}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`);
  for (const [attribute, name, content] of [
    ["name", "description", meta.description],
    ["property", "og:title", meta.title],
    ["property", "og:description", meta.description],
    ["property", "og:url", url],
    ["name", "twitter:title", meta.title],
    ["name", "twitter:description", meta.description],
  ]) {
    const pattern = new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="[^"]*"\\s*\\/?>`);
    if (!pattern.test(html)) throw new Error(`Missing ${name} on ${url}`);
    html = html.replace(pattern, `<meta ${attribute}="${name}" content="${esc(content)}" />`);
  }
  html = html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (tag, json) => {
    const ld = JSON.parse(json);
    for (const entity of ld["@graph"] || []) {
      if (entity["@type"] === "WebPage") Object.assign(entity, { "@id": `${url}#webpage`, url, name: meta.title, description: meta.description });
    }
    return `<script type="application/ld+json">${JSON.stringify(ld).replaceAll("<", "\\u003c")}</script>`;
  });
  fs.writeFileSync(file, html);
}
console.log(`  SEO metadata -> ${Object.keys(seoPages).length} pages`);
