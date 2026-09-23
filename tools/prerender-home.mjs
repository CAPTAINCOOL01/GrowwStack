/**
 * Puts the rendered homepage into dist/index.html after `vite build`.
 *
 * The homepage used to ship an empty <div id="root">, so anything that reads
 * HTML without running the bundle saw no copy, no headings and no links. The
 * client entry hydrates this markup rather than replacing it.
 *
 * /admin is client-only and must not hydrate homepage markup, so the untouched
 * shell is kept as dist/admin.html and vercel.json rewrites /admin to it.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrOut = path.join(root, "dist-ssr");
const EMPTY_ROOT = '<div id="root"></div>';

await build({
  root,
  logLevel: "warn",
  build: {
    ssr: "src/entry-prerender.tsx",
    outDir: ssrOut,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: "entry-prerender.mjs" } },
  },
});

try {
  const { render } = await import(pathToFileURL(path.join(ssrOut, "entry-prerender.mjs")).href);
  const markup = render("/");
  if (!markup.includes('id="hero-title"')) throw new Error("Prerendered homepage is missing the hero");

  const shellPath = path.join(dist, "index.html");
  const shell = fs.readFileSync(shellPath, "utf8");
  if (!shell.includes(EMPTY_ROOT)) throw new Error("dist/index.html has no empty root to fill");

  const robots = /<meta name="robots" content="[^"]*" \/>/;
  if (!robots.test(shell)) throw new Error("dist/index.html has no robots meta to replace");
  fs.writeFileSync(
    path.join(dist, "admin.html"),
    shell.replace(robots, '<meta name="robots" content="noindex, nofollow" />'),
  );
  fs.writeFileSync(shellPath, shell.replace(EMPTY_ROOT, () => `<div id="root">${markup}</div>`));
  console.log(`  homepage     -> prerendered (${Math.round(markup.length / 1024)} KB of markup)`);
} finally {
  fs.rmSync(ssrOut, { recursive: true, force: true });
}
