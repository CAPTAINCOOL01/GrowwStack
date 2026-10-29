import { useEffect, useMemo, useState, type FormEvent } from "react";
import { adminFetch, clearToken, readToken } from "../../lib/adminApi";
import { attributionFromRecord, campaignLabel, channelLabel } from "../../lib/attribution.mjs";

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
  page_path: string | null;
  referrer: string | null;
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
  page_path: string | null;
  referrer: string | null;
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

const CHANNELS = ["email", "organic_search", "paid_search", "referral", "direct", "other_campaign", "unknown"];

function exportAttribution<T extends { page_path?: string | null; referrer?: string | null }>(rows: T[]) {
  return rows.map((row) => {
    const a = attributionFromRecord(row);
    return { ...row, acquisition_channel: channelLabel(a.channel), campaign: a.campaign, campaign_source: a.source, campaign_medium: a.medium, email_content: a.content, outreach_id: a.oid };
  });
}

export function AdminDashboard() {
  const [ok, setOk] = useState(false);
  const [tab, setTab] = useState<Tab>("leads");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState("all");
  const [campaign, setCampaign] = useState("all");

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

  const campaigns = useMemo(() => Array.from(new Set([
    "daily_d2c_outreach", "daily_manufacturer_outreach", "foreign_clients_outreach",
    ...[...visitors, ...leads, ...orders, ...applications].map((row) => attributionFromRecord(row).campaign).filter((value): value is string => Boolean(value)),
  ])), [visitors, leads, orders, applications]);

  const matches = (row: { page_path?: string | null; referrer?: string | null }) => {
    const a = attributionFromRecord(row);
    return (channel === "all" || a.channel === channel) && (campaign === "all" || a.campaign === campaign);
  };
  const shownLeads = leads.filter(matches);
  const shownVisitors = visitors.filter(matches);
  const shownOrders = orders.filter(matches);
  const shownApplications = applications.filter(matches);

  const stats = (() => {
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;
    const leads24 = shownLeads.filter(
      (l) => now - new Date(l.created_at).getTime() < day,
    ).length;
    const visits24 = shownVisitors.filter(
      (v) => now - new Date(v.created_at).getTime() < day,
    ).length;
    const uniqueSessions = new Set(
      shownVisitors.map((v) => v.session_id).filter(Boolean),
    ).size;
    const orders24 = shownOrders.filter(
      (o) => now - new Date(o.created_at).getTime() < day,
    ).length;
    return {
      totalApplications: shownApplications.length,
      totalOrders: shownOrders.length,
      orders24,
      totalLeads: shownLeads.length,
      leads24,
      totalVisits: shownVisitors.length,
      visits24,
      uniqueSessions,
    };
  })();

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

      <section aria-label="Traffic attribution">
        <h2>Where enquiries come from</h2>
        <p>Email campaigns and organic search are recorded separately. Filters apply to every view and its CSV export.</p>
        <div className="gs-admin__topbar-actions">
          <label className="gs-field">
            <span className="gs-field__label">Traffic source</span>
            <select className="gs-field__input" value={channel} onChange={(e) => setChannel(e.target.value)}>
              <option value="all">All sources</option>
              {CHANNELS.map((value) => <option key={value} value={value}>{channelLabel(value)}</option>)}
            </select>
          </label>
          <label className="gs-field">
            <span className="gs-field__label">Email campaign</span>
            <select className="gs-field__input" value={campaign} onChange={(e) => setCampaign(e.target.value)}>
              <option value="all">All campaigns</option>
              {campaigns.map((value) => <option key={value} value={value}>{campaignLabel(value)}</option>)}
            </select>
          </label>
        </div>
        <p className="gs-admin__muted">This view uses the latest 1,000 records from each data view. A visit identifies a campaign, not a person. Customer details come from submitted forms; an optional random outreach ID can be matched to your private send list. Email security scanners and bots can also generate visits. Older records may have unknown attribution.</p>
      </section>

      <section className="gs-admin__stats" aria-label="Snapshot">
        <StatCard label="Leads (loaded)" value={stats.totalLeads} />
        <StatCard label="Leads (24h)" value={stats.leads24} />
        <StatCard label="Applications" value={stats.totalApplications} />
        <StatCard label="Build requests" value={stats.totalOrders} />
        <StatCard label="Recorded page visits" value={stats.totalVisits} />
        <StatCard label="Page visits (24h)" value={stats.visits24} />
        <StatCard label="Unique sessions" value={stats.uniqueSessions} />
      </section>

      <nav className="gs-admin__tabs" aria-label="Data views">
        <button
          className={`gs-admin__tab${tab === "leads" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("leads")}
        >
          Leads ({shownLeads.length})
        </button>
        <button
          className={`gs-admin__tab${tab === "applications" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("applications")}
        >
          Applications ({shownApplications.length})
        </button>
        <button
          className={`gs-admin__tab${tab === "orders" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("orders")}
        >
          Build requests ({shownOrders.length})
        </button>
        <button
          className={`gs-admin__tab${tab === "visitors" ? " gs-admin__tab--active" : ""}`}
          type="button"
          onClick={() => setTab("visitors")}
        >
          Visitors ({shownVisitors.length})
        </button>
        <div className="gs-admin__tab-spacer" />
        <button
          className="gs-button gs-button--secondary gs-button--small"
          type="button"
          onClick={() =>
            tab === "leads"
              ? downloadCsv("growwstack-leads.csv", exportAttribution(shownLeads))
              : tab === "applications"
                ? downloadCsv("growwstack-applications.csv", exportAttribution(shownApplications))
                : tab === "orders"
                ? downloadCsv("growwstack-website-orders.csv", exportAttribution(shownOrders))
                : downloadCsv("growwstack-visitors.csv", exportAttribution(shownVisitors))
          }
        >
          Export CSV
        </button>
      </nav>

      {error && <p className="gs-admin__error">{error}</p>}

      {tab === "leads" ? (
        <LeadsTable leads={shownLeads} />
      ) : tab === "applications" ? (
        <ApplicationsTable applications={shownApplications} />
      ) : tab === "orders" ? (
        <OrdersTable orders={shownOrders} />
      ) : (
        <VisitorsTable visitors={shownVisitors} />
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

function AttributionCell({ row }: { row: { page_path?: string | null; referrer?: string | null } }) {
  const a = attributionFromRecord(row);
  return <td>
    <span className="gs-admin__badge">{channelLabel(a.channel)}</span>
    {a.campaign && <div>{campaignLabel(a.campaign)}</div>}
    {a.source && <div className="gs-admin__muted">{a.source}{a.medium ? ` / ${a.medium}` : ""}</div>}
    {a.content && <div className="gs-admin__muted">Email: {a.content.replace(/_/g, " ")}</div>}
    {a.oid && <div className="gs-admin__cell-ref" title="Match this random ID to your private outreach send list">Outreach ID: {a.oid}</div>}
  </td>;
}

function OrdersTable({ orders }: { orders: Order[] }) {
  if (!orders.length) {
    return (
      <p className="gs-admin__empty">
        No build requests match the current filters.
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
            <th>Traffic source</th>
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
                <AttributionCell row={o} />
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
        No partnership applications match the current filters.
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
            <th>Traffic source</th>
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
                <AttributionCell row={a} />
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
    return <p className="gs-admin__empty">No leads match the current filters.</p>;
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
            <th>Traffic source</th>
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
                <AttributionCell row={l} />
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
    return <p className="gs-admin__empty">No recorded page visits match the current filters.</p>;
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
            <th>Traffic source</th>
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
              <AttributionCell row={v} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
