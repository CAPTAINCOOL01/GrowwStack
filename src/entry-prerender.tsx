import { renderToString } from "react-dom/server";
import { Route, Routes, StaticRouter } from "react-router";
import App from "./app/App.tsx";

/**
 * Build-time render of the homepage (see tools/prerender-home.mjs).
 *
 * The same route tree as main.tsx, so the markup hydrates without a mismatch.
 * Crawlers that never run JavaScript, which includes most AI crawlers, then
 * receive the real copy and links instead of an empty root.
 */
export function render(url: string): string {
  return renderToString(
    <StaticRouter location={url}>
      <Routes>
        <Route path="*" element={<App />} />
      </Routes>
    </StaticRouter>,
  );
}
