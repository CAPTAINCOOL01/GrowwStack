/**
 * Generates every static page after `vite build`: case studies, blog posts,
 * the blog index, and one sitemap covering all of them.
 *
 * These are content pages with no interactivity, so they are emitted as real
 * HTML rather than client-rendered routes. A crawler gets the copy, headings
 * and structured data in the first response instead of having to execute the
 * bundle — which matters more for AI crawlers, which are less patient about
 * running JavaScript. Plain Node, so it runs in Vercel's build.
 *
 * cleanUrls serves dist/blog/<slug>.html at /blog/<slug>.
 *
 * One sitemap writer lives here on purpose: when case studies and blog posts
 * each wrote their own, they raced and the last one won.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { analyticsSnippet } from "./analytics-snippet.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ORIGIN = "https://growwstack.in";

const studies = JSON.parse(
  fs.readFileSync(path.join(root, "src/content/case-studies.json"), "utf8"),
);

const blogDir = path.join(root, "src/content/blog");
const posts = fs
  .readdirSync(blogDir)
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(blogDir, f), "utf8")))
  // `draft: true` keeps a post out of the build entirely, so publishing can be
  // staggered without deleting work.
  .filter((p) => !p.draft)
  .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Escape first, then re-introduce links from a [text](/path) token. Escaping
 * happens before linkifying so author text can never inject markup; only
 * same-site paths and growwstack.in URLs are allowed through.
 */
function inline(text) {
  return esc(text).replace(
    /\[([^\]]+)\]\((\/[^)\s]*|https:\/\/growwstack\.in[^)\s]*)\)/g,
    (_m, label, href) => `<a href="${href}">${label}</a>`,
  );
}

function findCss() {
  const assets = path.join(dist, "assets");
  const file = fs.readdirSync(assets).find((f) => f.endsWith(".css"));
  if (!file) throw new Error("No built CSS found in dist/assets");
  return `/assets/${file}`;
}

const ANALYTICS = analyticsSnippet();

const VERIFY =
  '<meta name="google-site-verification" content="hNmg2XkeP3fmFhpV0CLhl85GMDJYZSv4h6Fct36obAM" />';

function shell({ url, metaTitle, metaDescription, css, ld, body, type = "website" }) {
  return `<!doctype html>
<html lang="en-IN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#07111d" />
    ${VERIFY}
    <title>${esc(metaTitle)}</title>
    <meta name="description" content="${esc(metaDescription)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="${type}" />
    <meta property="og:site_name" content="GrowwStack" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${esc(metaTitle)}" />
    <meta property="og:description" content="${esc(metaDescription)}" />
    <meta property="og:image" content="${ORIGIN}/og.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(metaTitle)}" />
    <meta name="twitter:description" content="${esc(metaDescription)}" />
    <meta name="twitter:image" content="${ORIGIN}/og.png" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${css}" />
    ${ANALYTICS}

${ld.map((b) => `    <script type="application/ld+json">${JSON.stringify(b)}</script>`).join("\n")}
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
${body}
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

/* ---------------------------------------------------------------- blog post */

function postBody(post) {
  const byline = `<p class="gs-post__meta">
              <span class="gs-post__cat">${esc(post.category)}</span>
              <time datetime="${esc(post.publishedAt)}">${esc(formatDate(post.publishedAt))}</time>
              <span>${esc(post.readingTime)}</span>
            </p>`;

  const sections = post.sections
    .map((s) => {
      const paras = (s.paragraphs || []).map((p) => `              <p>${inline(p)}</p>`).join("\n");
      let list = "";
      if (s.list && s.list.length) {
        const tag = s.listType === "number" ? "ol" : "ul";
        const cls = s.listType === "number" ? "gs-post__steps" : "gs-post__list";
        list = `\n              <${tag} class="${cls}">\n${s.list
          .map((i) => `                <li>${inline(i)}</li>`)
          .join("\n")}\n              </${tag}>`;
      }
      return `            <section class="gs-post__section">
              <h2>${esc(s.heading)}</h2>
${paras}${list}
            </section>`;
    })
    .join("\n\n");

  const related = (post.related || [])
    .map((slug) => posts.find((p) => p.slug === slug))
    .filter(Boolean);

  const relatedBlock = related.length
    ? `            <nav class="gs-case__more" aria-label="Related reading">
              <h2>Related reading</h2>
              <ul>
${related
  .map(
    (r) =>
      `                <li><a href="/blog/${r.slug}"><strong>${esc(r.title)}</strong><span>${esc(r.category)}</span></a></li>`,
  )
  .join("\n")}
              </ul>
            </nav>`
    : "";

  return `        <article class="gs-section gs-case__body gs-post">
          <div class="gs-shell">
            <nav class="gs-case__crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a> <span aria-hidden="true">/</span>
              <a href="/blog">Blog</a> <span aria-hidden="true">/</span>
              <span>${esc(post.category)}</span>
            </nav>

            ${byline}
            <h1 class="gs-case__title gs-post__title">${esc(post.title)}</h1>

${(post.intro || []).map((p) => `            <p class="gs-post__intro">${inline(p)}</p>`).join("\n")}

${sections}

            <aside class="gs-post__takeaway">
              <p class="gs-post__takeaway-label">In short</p>
              <p>${inline(post.takeaway)}</p>
            </aside>

            <section class="gs-case__cta">
              <h2>Want this built properly?</h2>
              <p>
                We build custom websites and the systems behind them with nothing to pay upfront,
                and are paid from the growth the work produces. We take a limited number at a time.
              </p>
              <div class="gs-case__cta-actions">
                <a class="gs-button gs-button--primary" href="/#build">Request a website build</a>
                <a class="gs-button gs-button--secondary" href="/#apply">Apply for a partnership</a>
              </div>
            </section>

${relatedBlock}
          </div>
        </article>`;
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function postLd(post) {
  const url = `${ORIGIN}/blog/${post.slug}`;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      headline: post.title,
      description: post.metaDescription,
      datePublished: post.publishedAt,
      dateModified: post.publishedAt,
      author: { "@id": `${ORIGIN}/#founder` },
      publisher: { "@id": `${ORIGIN}/#organization` },
      isPartOf: { "@id": `${ORIGIN}/#website` },
      image: `${ORIGIN}/og.png`,
      inLanguage: "en-IN",
      articleSection: post.category,
      mainEntityOfPage: url,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${ORIGIN}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
}

/* --------------------------------------------------------------- blog index */

function indexBody() {
  const cards = posts
    .map(
      (p) => `              <li class="gs-bloglist__item">
                <a href="/blog/${p.slug}">
                  <p class="gs-post__meta">
                    <span class="gs-post__cat">${esc(p.category)}</span>
                    <span>${esc(p.readingTime)}</span>
                  </p>
                  <h2>${esc(p.title)}</h2>
                  <p class="gs-bloglist__excerpt">${esc(p.excerpt)}</p>
                  <span class="gs-bloglist__more">Read <span aria-hidden="true">&rarr;</span></span>
                </a>
              </li>`,
    )
    .join("\n");

  return `        <div class="gs-section gs-case__body">
          <div class="gs-shell">
            <nav class="gs-case__crumbs" aria-label="Breadcrumb">
              <a href="/">Home</a> <span aria-hidden="true">/</span>
              <span>Blog</span>
            </nav>
            <p class="gs-eyebrow"><span aria-hidden="true">Writing</span>Websites, traffic and systems</p>
            <h1 class="gs-case__title">Notes from building growth systems</h1>
            <p class="gs-case__summary">
              What we have learned building and operating websites that are expected to produce
              revenue rather than represent a company. No theory we have not used.
            </p>
            <ul class="gs-bloglist">
${cards}
            </ul>
          </div>
        </div>`;
}

/* ------------------------------------------------------------- case studies */

function studyBody(study) {
  const list = (items, cls) =>
    items.map((i) => `                <li>${inline(i)}</li>`).join("\n");

  return `        <article class="gs-section gs-case__body">
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
      `                <li><a href="/case-studies/${s.slug}"><strong>${esc(s.sector)}</strong><span>${esc(s.mandate)}</span></a></li>`,
  )
  .join("\n")}
              </ul>
            </nav>
          </div>
        </article>`;
}

function studyLd(study) {
  const url = `${ORIGIN}/case-studies/${study.slug}`;
  return [
    {
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
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        { "@type": "ListItem", position: 2, name: "Case studies", item: `${ORIGIN}/#partnerships` },
        { "@type": "ListItem", position: 3, name: study.title, item: url },
      ],
    },
  ];
}

/* ------------------------------------------------------------------- output */

const css = findCss();

fs.mkdirSync(path.join(dist, "case-studies"), { recursive: true });
for (const study of studies) {
  const url = `${ORIGIN}/case-studies/${study.slug}`;
  fs.writeFileSync(
    path.join(dist, "case-studies", `${study.slug}.html`),
    shell({
      url,
      metaTitle: study.metaTitle,
      metaDescription: study.metaDescription,
      css,
      ld: studyLd(study),
      body: studyBody(study),
      type: "article",
    }),
  );
}
console.log(`  case studies -> ${studies.length}`);

fs.mkdirSync(path.join(dist, "blog"), { recursive: true });
for (const post of posts) {
  fs.writeFileSync(
    path.join(dist, "blog", `${post.slug}.html`),
    shell({
      url: `${ORIGIN}/blog/${post.slug}`,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      css,
      ld: postLd(post),
      body: postBody(post),
      type: "article",
    }),
  );
}

fs.writeFileSync(
  path.join(dist, "blog.html"),
  shell({
    url: `${ORIGIN}/blog`,
    metaTitle: "Blog — Websites, Traffic and Growth Systems | GrowwStack",
    metaDescription:
      "Practical writing on why websites fail to generate traffic and leads, what custom builds change, and how SEO, GEO and AEO actually work.",
    css,
    ld: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        "@id": `${ORIGIN}/blog#blog`,
        name: "GrowwStack Blog",
        url: `${ORIGIN}/blog`,
        publisher: { "@id": `${ORIGIN}/#organization` },
        inLanguage: "en-IN",
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${ORIGIN}/blog/${p.slug}`,
          datePublished: p.publishedAt,
        })),
      },
    ],
    body: indexBody(),
  }),
);
console.log(`  blog posts   -> ${posts.length} (+ index)`);

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${ORIGIN}/`, priority: "1.0", changefreq: "weekly" },
  { loc: `${ORIGIN}/blog`, priority: "0.9", changefreq: "weekly" },
  ...studies.map((s) => ({
    loc: `${ORIGIN}/case-studies/${s.slug}`,
    priority: "0.8",
    changefreq: "monthly",
  })),
  ...posts.map((p) => ({
    loc: `${ORIGIN}/blog/${p.slug}`,
    priority: "0.7",
    changefreq: "monthly",
    lastmod: p.publishedAt,
  })),
];

fs.writeFileSync(
  path.join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod || today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`,
);
console.log(`  sitemap      -> ${urls.length} URLs`);
