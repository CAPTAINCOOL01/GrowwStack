import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./app/App.tsx";
import { AdminDashboard } from "./app/pages/AdminDashboard.tsx";
import "./styles/index.css";

const container = document.getElementById("root")!;
const app = (
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>
);

// The homepage arrives prerendered (tools/prerender-home.mjs); other shells are empty.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
