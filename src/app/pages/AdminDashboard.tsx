import { useEffect, useMemo, useState, type FormEvent } from "react";
import { adminFetch, clearToken, readToken } from "../../lib/adminApi";

type Lead = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string | null;
  source: string | null;
  page_path: string | null;
  referrer: string | null;
  user_agent: string | null;
};

type Visitor = {
  id: string;
  created_at: string;
  session_id: string | null;
  page_path: string | null;
  referrer: string | null;
  user_agent: string | null;
  language: string | null;
  timezone: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function whatsappHref(phone: string | null, name: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10) return null;
  const withCountry = digits.length === 10 ? `91${digits}` : digits;
  const text = encodeURIComponent(
    `Hi ${name ?? "there"}, this is GrowwStack replying to your enquiry.`,
  );
  return `https://wa.me/${withCountry}?text=${text}`;
}

function downloadCsv(filename: string, rows: Array<Record<string, unknown>>) {
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  const csv = [
    keys.join(","),
    ...rows.map((r) => keys.map((k) => escape(r[k])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function LoginGate({ onSubmit }: { onSubmit: (pw: string) => Promise<boolean> }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const ok = await onSubmit(pw);
    setBusy(false);
    if (!ok) setErr("Incorrect password.");
  };

  return (
    <div className="gs-admin__gate">
      <form className="gs-admin__gate-card" onSubmit={handle}>
        <h1 className="gs-admin__title">GrowwStack admin</h1>
        <p className="gs-admin__subtitle">
          Sign in to view leads and visitor activity.
        </p>
        <label className="gs-field">
          <span className="gs-field__label">Password</span>
          <input
            className="gs-field__input"
            type="password"
            autoFocus
            value={pw}
            onChange={(e) => setPw(e.target.value)}
          />
        </label>
        {err && <p className="gs-admin__error">{err}</p>}
        <button className="gs-button gs-button--primary" type="submit" disabled={busy}>
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}

type Tab = "leads" | "visitors";

export function AdminDashboard() {
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The server decides: a 200 means authenticated and the data is in the reply.
  const load = async (credential: { password: string } | { token: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Lead, Visitor>(credential);
      setLeads(data.leads);
      setVisitors(data.visitors);
      setOk(true);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const authenticate = async (password: string) => load({ password });

  const refresh = () => {
    const token = readToken();
    void load(token ? { token } : { password: "" });
  };

  const logout = () => {
    clearToken();
    setLeads([]);
    setVisitors([]);
    setOk(false);
  };

  // Resume an existing session on reload without re-prompting.
  useEffect(() => {
    const token = readToken();
    if (token) void load({ token });
  }, []);

  const stats = useMemo(() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const leads24 = leads.filter(
      (l) => now - new Date(l.created_at).getTime() < day,
    ).length;
    const visits24 = visitors.filter(
      (v) => now - new Date(v.created_at).getTime() < day,
    ).length;
    const uniqueSessions = new Set(
      visitors.map((v) => v.session_id).filter(Boolean),
    ).size;
    return {
      totalLeads: leads.length,
      leads24,
      totalVisits: visitors.length,
      visits24,
      uniqueSessions,
    };
  }, [leads, visitors]);

  if (!ok) return <LoginGate onSubmit={authenticate} />;

  return (
    <div className="gs-admin">
      <header className="gs-admin__topbar">
        <div>
          <h1 className="gs-admin__title">GrowwStack admin</h1>
          <p className="gs-admin__subtitle">Live leads and visitor telemetry.</p>
        </div>
        <div className="gs-admin__topbar-actions">
          <button
            className="gs-button gs-button--secondary"
            type="button"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button
            className="gs-button gs-button--secondary"
            type="button"
            onClick={logout}
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="gs-admin__stats" aria-label="Snapshot">
        <StatCard label="Leads (total)" value={stats.totalLeads} />
        <StatCard label="Leads (24h)" value={stats.leads24} />
        <StatCard label="Page views (total)" value={stats.totalVisits} />
        <StatCard label="Page views (24h)" value={stats.visits24} />
        <StatCard label="Unique sessions" value={stats.uniqueSessions} />
      </section>

      <nav className="gs-admin__tabs" aria-label="Data views">
        <button
          className={`gs-admin__tab${tab === "leads" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("leads")}
        >
          Leads ({leads.length})
        </button>
        <button
          className={`gs-admin__tab${tab === "visitors" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("visitors")}
        >
          Visitors ({visitors.length})
        </button>
        <div className="gs-admin__tab-spacer" />
        <button
          className="gs-button gs-button--secondary gs-button--small"
          type="button"
          onClick={() =>
            tab === "leads"
              ? downloadCsv("growwstack-leads.csv", leads)
              : downloadCsv("growwstack-visitors.csv", visitors)
          }
        >
          Export CSV
        </button>
      </nav>

      {error && <p className="gs-admin__error">{error}</p>}

      {tab === "leads" ? (
        <LeadsTable leads={leads} />
      ) : (
        <VisitorsTable visitors={visitors} />
      )}

      <footer className="gs-admin__foot">
        <p>
          Reads use the public anon key. Anyone who guesses this URL and password
          can see this data. Rotate the password from your Vercel env vars if
          exposed.
        </p>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="gs-admin__stat">
      <p className="gs-admin__stat-value">{value}</p>
      <p className="gs-admin__stat-label">{label}</p>
    </div>
  );
}

function LeadsTable({ leads }: { leads: Lead[] }) {
  if (!leads.length) {
    return <p className="gs-admin__empty">No leads yet. They'll appear here as soon as someone submits the form.</p>;
  }

  return (
    <div className="gs-admin__table-wrap">
      <table className="gs-admin__table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Message</th>
            <th>Source</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => {
            const wa = whatsappHref(l.phone, l.name);
            return (
              <tr key={l.id}>
                <td>{formatDate(l.created_at)}</td>
                <td>{l.name}</td>
                <td>{l.company ?? "—"}</td>
                <td>
                  {l.email && <div><a href={`mailto:${l.email}`}>{l.email}</a></div>}
                  {l.phone && <div><a href={`tel:${l.phone}`}>{l.phone}</a></div>}
                  {!l.email && !l.phone && "—"}
                </td>
                <td className="gs-admin__cell-message">{l.message ?? "—"}</td>
                <td>{l.source ?? "—"}</td>
                <td>
                  {wa ? (
                    <a
                      className="gs-admin__link"
                      href={wa}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function VisitorsTable({ visitors }: { visitors: Visitor[] }) {
  if (!visitors.length) {
    return <p className="gs-admin__empty">No page views recorded yet.</p>;
  }

  return (
    <div className="gs-admin__table-wrap">
      <table className="gs-admin__table">
        <thead>
          <tr>
            <th>When</th>
            <th>Page</th>
            <th>Referrer</th>
            <th>Session</th>
            <th>Locale</th>
            <th>UTM</th>
          </tr>
        </thead>
        <tbody>
          {visitors.map((v) => (
            <tr key={v.id}>
              <td>{formatDate(v.created_at)}</td>
              <td>{v.page_path ?? "—"}</td>
              <td className="gs-admin__cell-ref">{v.referrer ?? "direct"}</td>
              <td className="gs-admin__cell-ref">
                {v.session_id ? v.session_id.slice(0, 8) : "—"}
              </td>
              <td>
                {v.language ?? "—"}
                {v.timezone ? ` · ${v.timezone}` : ""}
              </td>
              <td>
                {[v.utm_source, v.utm_medium, v.utm_campaign]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
