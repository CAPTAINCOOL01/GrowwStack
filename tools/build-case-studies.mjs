/**
 * Emits a fully static HTML page per case study into dist/case-studies/.
 *
 * These are content pages with no interactivity, so they are generated as real
 * HTML rather than client-rendered routes. A crawler gets the copy, the
 * headings and the structured data in the first response instead of having to
 * execute the bundle. Runs on plain Node, so it works in Vercel's build.
 *
 * cleanUrls serves dist/case-studies/<slug>.html at /case-studies/<slug>.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const outDir = path.join(dist, "case-studies");
const ORIGIN = "https://growwstack.in";

const studies = JSON.parse(
  fs.readFileSync(path.join(root, "src/content/case-studies.json"), "utf8"),
);

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Vite hashes the CSS filename, so discover it from the built output.
function findCss() {
  const assets = path.join(dist, "assets");
  const file = fs.readdirSync(assets).find((f) => f.endsWith(".css"));
  if (!file) throw new Error("No built CSS found in dist/assets");
  return `/assets/${file}`;
}

function page(study, cssHref) {
  const url = `${ORIGIN}/case-studies/${study.slug}`;
  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: study.title,
    description: study.metaDescription,
    about: { "@type": "Thing", name: study.sector },
    isPartOf: { "@id": `${ORIGIN}/#website` },
    publisher: { "@id": `${ORIGIN}/#organization` },
    author: { "@id": `${ORIGIN}/#founder` },
    image: `${ORIGIN}/og.png`,
    inLanguage: "en-IN",
    mainEntityOfPage: url,
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Case studies", item: `${ORIGIN}/#partnerships` },
      { "@type": "ListItem", position: 3, name: study.title, item: url },
    ],
  };

  const list = (items) => items.map((i) => `<li>${esc(i)}</li>`).join("\n            ");

  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#07111d" />
    <title>${esc(study.metaTitle)}</title>
    <meta name="description" content="${esc(study.metaDescription)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="article" />
    <meta property="og:site_name" content="GrowwStack" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(study.metaTitle)}" />
    <meta property="og:description" content="${esc(study.metaDescription)}" />
    <meta property="og:image" content="${ORIGIN}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(study.metaTitle)}" />
    <meta name="twitter:description" content="${esc(study.metaDescription)}" />
    <meta name="twitter:image" content="${ORIGIN}/og.png" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${cssHref}" />

    <script type="application/ld+json">${JSON.stringify(ld)}</script>
    <script type="application/ld+json">${JSON.stringify(crumbs)}</script>
  </head>
  <body>
    <div class="gs-site gs-case">
      <header class="gs-case__bar">
        <div class="gs-shell gs-case__bar-inner">
          <a class="gs-case__back" href="/">&larr; GrowwStack</a>
          <a class="gs-button gs-button--small gs-button--dark" href="/#apply">Apply to partner</a>
        </div>
      </header>

      <main>
        <article class="gs-section gs-case__body">
          <div class="gs-shell">
            <nav class="gs-case__crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a> <span aria-hidden="true">/</span>
              <a href="/#partnerships">Case studies</a> <span aria-hidden="true">/</span>
              <span>${esc(study.sector)}</span>
            </nav>

            <p class="gs-eyebrow"><span aria-hidden="true">${esc(study.sector)}</span>${esc(study.mandate)}</p>
            <h1 class="gs-case__title">${esc(study.headline)}</h1>
            <p class="gs-case__summary">${esc(study.summary)}</p>

            <div class="gs-case__metric">
              <span class="gs-case__metric-value">${esc(study.headlineMetric.value)}</span>
              <span class="gs-case__metric-label">${esc(study.headlineMetric.label)}</span>
            </div>

            <section class="gs-case__block">
              <h2>The problem</h2>
              <ul class="gs-case__list">
            ${list(study.problem)}
              </ul>
            </section>

            <section class="gs-case__block">
              <h2>Systems we built</h2>
              <ul class="gs-case__list gs-case__list--systems">
            ${list(study.systems)}
              </ul>
            </section>

            <section class="gs-case__block">
              <h2>How we approached it</h2>
              <ol class="gs-case__steps">
            ${list(study.approach)}
              </ol>
            </section>

            <section class="gs-case__block">
              <h2>Where it stands</h2>
              <p>${esc(study.outcome)}</p>
              <p class="gs-case__note">${esc(study.relatedNote)}</p>
            </section>

            <section class="gs-case__cta">
              <h2>Building something similar?</h2>
              <p>
                We take on a small number of partnerships at a time. Tell us about the business and
                we will say honestly whether we are the right fit.
              </p>
              <div class="gs-case__cta-actions">
                <a class="gs-button gs-button--primary" href="/#apply">Apply for a growth partnership</a>
                <a class="gs-button gs-button--secondary" href="/#build">Request a website build</a>
              </div>
            </section>

            <nav class="gs-case__more" aria-label="Other case studies">
              <h2>Other partnerships</h2>
              <ul>
                ${studies
                  .filter((s) => s.slug !== study.slug)
                  .map(
                    (s) =>
                      `<li><a href="/case-studies/${s.slug}"><strong>${esc(s.sector)}</strong><span>${esc(s.mandate)}</span></a></li>`,
                  )
                  .join("\n                ")}
              </ul>
            </nav>
          </div>
        </article>
      </main>

      <footer class="gs-case__foot">
        <div class="gs-shell">
          <p>
            GrowwStack &mdash; growth systems for promising brands.
            <a href="mailto:ceo-office@growwstack.in">ceo-office@growwstack.in</a>
          </p>
        </div>
      </footer>
    </div>
  </body>
</html>
`;
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [
    { loc: `${ORIGIN}/`, priority: "1.0", changefreq: "weekly" },
    ...studies.map((s) => ({
      loc: `${ORIGIN}/case-studies/${s.slug}`,
      priority: "0.8",
      changefreq: "monthly",
    })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

const cssHref = findCss();
fs.mkdirSync(outDir, { recursive: true });
for (const study of studies) {
  fs.writeFileSync(path.join(outDir, `${study.slug}.html`), page(study, cssHref));
  console.log(`  case study -> /case-studies/${study.slug}`);
}

// Regenerate the sitemap so it can never drift from the pages that exist.
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap());
console.log(`  sitemap -> ${studies.length + 1} URLs`);
