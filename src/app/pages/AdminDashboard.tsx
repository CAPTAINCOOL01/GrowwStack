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

type Application = {
  id: string;
  created_at: string;
  founder_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  location: string | null;
  monthly_revenue_range: string | null;
  scaling_blocker: string | null;
  partnership_reason: string | null;
};

type Order = {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  business_type: string | null;
  current_website: string | null;
  project_type: string | null;
  primary_goal: string | null;
  timeline: string | null;
  message: string | null;
  source: string | null;
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

type Tab = "leads" | "applications" | "orders" | "visitors";

export function AdminDashboard() {
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The server decides: a 200 means authenticated and the data is in the reply.
  const load = async (credential: { password: string } | { token: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<Lead, Visitor, Order, Application>(credential);
      setLeads(data.leads);
      setVisitors(data.visitors);
      setOrders(data.orders ?? []);
      setApplications(data.applications ?? []);
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
    setOrders([]);
    setApplications([]);
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
    const orders24 = orders.filter(
      (o) => now - new Date(o.created_at).getTime() < day,
    ).length;
    return {
      totalApplications: applications.length,
      totalOrders: orders.length,
      orders24,
      totalLeads: leads.length,
      leads24,
      totalVisits: visitors.length,
      visits24,
      uniqueSessions,
    };
  }, [leads, visitors, orders, applications]);

  if (!ok) return <LoginGate onSubmit={authenticate} />;

  return (
    <div className="gs-admin">
      <header className="gs-admin__topbar">
        <div>
          <h1 className="gs-admin__title">GrowwStack admin</h1>
          <p className="gs-admin__subtitle">Leads, build requests and visitor telemetry.</p>
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
        <StatCard label="Applications" value={stats.totalApplications} />
        <StatCard label="Build requests" value={stats.totalOrders} />
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
          className={`gs-admin__tab${tab === "applications" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("applications")}
        >
          Applications ({applications.length})
        </button>
        <button
          className={`gs-admin__tab${tab === "orders" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("orders")}
        >
          Build requests ({orders.length})
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
              : tab === "applications"
                ? downloadCsv("growwstack-applications.csv", applications)
                : tab === "orders"
                ? downloadCsv("growwstack-website-orders.csv", orders)
                : downloadCsv("growwstack-visitors.csv", visitors)
          }
        >
          Export CSV
        </button>
      </nav>

      {error && <p className="gs-admin__error">{error}</p>}

      {tab === "leads" ? (
        <LeadsTable leads={leads} />
      ) : tab === "applications" ? (
        <ApplicationsTable applications={applications} />
      ) : tab === "orders" ? (
        <OrdersTable orders={orders} />
      ) : (
        <VisitorsTable visitors={visitors} />
      )}

      <footer className="gs-admin__foot">
        <p>
          Reads run server-side in /api/admin with the service-role key. The
          browser never holds a credential that can read this data. Rotate
          ADMIN_PASSWORD from your Vercel env vars if it is ever exposed.
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

function OrdersTable({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <p className="gs-admin__empty">
        No build requests yet. They will appear here as soon as someone submits the website form.
      </p>
    );
  }

  return (
    <div className="gs-admin__table-wrap">
      <table className="gs-admin__table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Name</th>
            <th>Business</th>
            <th>Contact</th>
            <th>Needs</th>
            <th>Goal</th>
            <th>Timeline</th>
            <th>Current site</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const wa = whatsappHref(o.phone, o.name);
            return (
              <tr key={o.id}>
                <td>{formatDate(o.created_at)}</td>
                <td>{o.name}</td>
                <td>
                  {o.company ?? "—"}
                  {o.business_type && (
                    <div className="gs-admin__muted">{o.business_type}</div>
                  )}
                </td>
                <td>
                  {o.email && (
                    <div>
                      <a href={`mailto:${o.email}`}>{o.email}</a>
                    </div>
                  )}
                  {o.phone && (
                    <div>
                      <a href={`tel:${o.phone}`}>{o.phone}</a>
                    </div>
                  )}
                  {!o.email && !o.phone && "—"}
                </td>
                <td>{o.project_type ?? "—"}</td>
                <td>{o.primary_goal ?? "—"}</td>
                <td>{o.timeline ?? "—"}</td>
                <td>
                  {o.current_website ? (
                    <a href={o.current_website} target="_blank" rel="noopener noreferrer">
                      Visit
                    </a>
                  ) : (
                    "None"
                  )}
                </td>
                <td>{o.message ?? "—"}</td>
                <td>{wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ApplicationsTable({ applications }: { applications: Application[] }) {
  if (!applications.length) {
    return (
      <p className="gs-admin__empty">
        No partnership applications yet. They will appear here as soon as someone submits the form.
      </p>
    );
  }

  return (
    <div className="gs-admin__table-wrap">
      <table className="gs-admin__table">
        <thead>
          <tr>
            <th>Received</th>
            <th>Founder</th>
            <th>Company</th>
            <th>Contact</th>
            <th>Industry</th>
            <th>Revenue</th>
            <th>Biggest blocker</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((a) => {
            const wa = whatsappHref(a.phone, a.founder_name);
            return (
              <tr key={a.id}>
                <td>{formatDate(a.created_at)}</td>
                <td>{a.founder_name}</td>
                <td>
                  {a.company_name ?? "—"}
                  {a.website && (
                    <div className="gs-admin__muted">
                      <a href={a.website} target="_blank" rel="noopener noreferrer">site</a>
                    </div>
                  )}
                </td>
                <td>
                  {a.email && <div><a href={`mailto:${a.email}`}>{a.email}</a></div>}
                  {a.phone && <div><a href={`tel:${a.phone}`}>{a.phone}</a></div>}
                  {!a.email && !a.phone && "—"}
                </td>
                <td>{a.industry ?? "—"}</td>
                <td>{a.monthly_revenue_range ?? "—"}</td>
                <td className="gs-admin__cell-message">{a.scaling_blocker ?? "—"}</td>
                <td>{wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
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
                <td>
                  {l.source ? (
                    <span
                      className={`gs-admin__badge${l.source === "website_build" ? " gs-admin__badge--build" : ""}`}
                    >
                      {l.source.replace(/_/g, " ")}
                    </span>
                  ) : (
                    <span className="gs-admin__badge gs-admin__badge--quiet">unknown</span>
                  )}
                </td>
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
