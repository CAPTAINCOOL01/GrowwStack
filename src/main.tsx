import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import App from "./app/App.tsx";
import { AdminDashboard } from "./app/pages/AdminDashboard.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
