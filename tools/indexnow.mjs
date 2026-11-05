/**
 * Submit changed URLs to IndexNow (Bing, Yandex, Seznam, Naver; Bing feeds Copilot and ChatGPT search).
 *
 *   node tools/indexnow.mjs https://growwstack.in/ https://growwstack.in/services
 *
 * The key is public by design: IndexNow verifies ownership by fetching
 * https://growwstack.in/<key>.txt, which lives in public/. Submit only URLs
 * that changed; never resubmit unchanged pages.
 */
const KEY = "6c45e9e613023de90da07f72bc9363d4";
const HOST = "growwstack.in";
const urls = process.argv.slice(2).filter((u) => u.startsWith(`https://${HOST}/`));
if (!urls.length) {
  console.error("Pass one or more https://growwstack.in/ URLs");
  process.exit(1);
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow ${res.status} ${res.statusText} for ${urls.length} URL(s)`);
if (res.status >= 400) process.exit(1);
