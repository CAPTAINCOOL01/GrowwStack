import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CALENDLY_CALL,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
} from "../../lib/config";
import { sbInsert } from "../../lib/supabase";
import { initEventTracking, trackLead } from "../../lib/events";
import { contactProblem } from "../../lib/contact";
import { syncOptOutFromUrl } from "../../lib/optOut";
import { initAnalytics } from "../../lib/analytics";
import { trackPageView } from "../../lib/tracking";
import { ThemeToggle } from "../components/growwstack/ThemeToggle";
import { ConsentBanner } from "../components/growwstack/ConsentBanner";
import { WhatsAppFab } from "../components/growwstack/WhatsAppFab";

type Status = "idle" | "invalid" | "sending" | "sent" | "error";

const initial = { name: "", email: "", phone: "", message: "" };

/**
 * Dedicated landing page for the paid-search test (see the ₹1,000 Google Ads plan).
 *
 * The ad promises the revenue-share / pay-on-results model, so the page leads with
 * that promise and puts a short lead form beside it — a click should not have to
 * scroll eight sections of the homepage to reach a form. Copy and proof are reused
 * from the homepage verbatim; the ₹1.5 Cr figure stays attributed to Camstar Sports'
 * e-commerce revenue, purely organic, exactly as everywhere else on the site.
 *
 * Rendered client-side from dist/partner.html (a noindex shell), so it never enters
 * the sitemap or competes with the homepage for the brand term.
 */

const comparison = [
  { label: "To start", usual: "Full fee upfront", ours: "₹0" },
  { label: "Every month", usual: "Retainer, regardless", ours: "₹0" },
  { label: "We are paid", usual: "On delivery", ours: "On growth" },
  { label: "If it does not work", usual: "You still pay", ours: "We earn nothing" },
  { label: "Who carries the risk", usual: "You", ours: "Us" },
];

const qualifiers = [
  "A product or service customers already pay for.",
  "Healthy margins and reliable delivery.",
  "An involved founder or decision-maker.",
];

export function PartnerLanding() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // A ref, not state: two submits in the same tick must not both save a lead.
  const inFlight = useRef(false);

  useEffect(() => {
    document.title = "Pay Us From the Growth — GrowwStack";
    syncOptOutFromUrl();
    initAnalytics();
    initEventTracking();
    trackPageView();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    const problem = contactProblem(values.email, values.phone);
    if (problem) {
      setStatus("invalid");
      setError(problem);
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    setError(null);
    try {
      await sbInsert("gs_leads", {
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        company: null,
        message: values.message.trim() || null,
        source: "partner_lp",
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
      setStatus("sent");
      trackLead("quick_contact");
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      inFlight.current = false;
    }
  };

  const waHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I saw your revenue-share offer and would like to talk.",
  )}`;

  return (
    <div className="gs-site gs-lp">
      <a className="gs-skip-link" href="#lp-form">
        Skip to the form
      </a>

      <header className="gs-lp__bar">
        <div className="gs-lp__bar-inner">
          <a className="gs-brand" href="/" aria-label="GrowwStack home">
            <span className="gs-brand__mark" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="gs-brand__word">GrowwStack</span>
          </a>
          <div className="gs-lp__bar-utilities">
            <a className="gs-lp__bar-phone" href={`tel:+${CONTACT_PHONE}`}>
              {CONTACT_PHONE_DISPLAY}
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="gs-lp__main" id="main-content">
        <div className="gs-lp__grid">
          <section className="gs-lp__pitch">
            <p className="gs-eyebrow">
              <span className="gs-status-dot" aria-hidden="true" />
              Performance-based growth partner
            </p>
            <h1 className="gs-lp__title">
              We build your growth system. <span>You pay us from the growth.</span>
            </h1>
            <p className="gs-lp__lede">
              No upfront agency fee and no monthly retainer. For selected Indian
              businesses, we design, build and operate your website, acquisition
              and sales systems — and earn a share of the measurable growth they
              produce.
            </p>
            <p className="gs-lp__proof">
              <strong>
                Camstar Sports' e-commerce revenue grew from ₹0 to ₹1.5 Cr in 110
                days.
              </strong>{" "}
              <span>Purely organic — ₹0 spent on ads.</span>
            </p>
            <ul className="gs-lp__trust" aria-label="Who this fits">
              {qualifiers.map((item) => (
                <li key={item}>
                  <span aria-hidden="true">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <aside className="gs-lp__form-card" aria-labelledby="lp-form-title">
            <h2 className="gs-lp__form-title" id="lp-form-title">
              Talk to the founder
            </h2>
            <p className="gs-lp__form-sub">
              A short note, replied to within one working day. No sales team, no
              call centre.
            </p>
            <form
              id="lp-form"
              data-lead-form="quick_contact"
              className="gs-lp__form"
              onSubmit={submit}
              noValidate
            >
              <label className="gs-field">
                <span className="gs-field__label">Your name *</span>
                <input
                  className="gs-field__input"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
              </label>
              <label className="gs-field">
                <span className="gs-field__label">Email</span>
                <input
                  className="gs-field__input"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </label>
              <label className="gs-field">
                <span className="gs-field__label">Phone / WhatsApp</span>
                <input
                  className="gs-field__input"
                  name="phone"
                  type="tel"
                  value={values.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </label>
              <label className="gs-field">
                <span className="gs-field__label">
                  Your business and the outcome you want
                </span>
                <textarea
                  className="gs-field__textarea"
                  name="message"
                  rows={2}
                  value={values.message}
                  onChange={handleChange}
                  placeholder="e.g. D2C skincare brand, traffic but weak sales."
                />
              </label>

              <p className="gs-lp__hint">
                Your name and an email or phone number are required, so we can reply.
              </p>

              <div className="gs-lp__actions">
                <button
                  className="gs-button gs-button--signal"
                  type="submit"
                  disabled={status === "sending" || !values.name.trim()}
                >
                  {status === "sending" ? "Sending…" : "Request a callback"}
                  <span aria-hidden="true"> ↗</span>
                </button>
                <a
                  className="gs-button gs-button--ghost"
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ask on WhatsApp
                </a>
              </div>

              {status === "sent" && (
                <p className="gs-lp__status gs-lp__status--ok" role="status">
                  Thank you. We have your note and will reply within one working day.
                </p>
              )}
              {(status === "invalid" || status === "error") && (
                <p className="gs-lp__status gs-lp__status--err" role="alert">
                  {error ?? "We couldn't submit that."} You can also reach us on
                  WhatsApp above or call {CONTACT_PHONE_DISPLAY}.
                </p>
              )}
            </form>
          </aside>
        </div>

        <section className="gs-lp__risk" aria-labelledby="lp-risk-title">
          <div className="gs-lp__risk-copy">
            <h2 className="gs-lp__risk-title" id="lp-risk-title">
              Where the risk sits
            </h2>
            <p>
              Most agencies are paid whether or not you grow. We are paid only when
              you do. The share is agreed in writing before any work begins, after a
              business evaluation and mutual acceptance.
            </p>
            <a className="gs-button gs-button--outline-light" href={CALENDLY_CALL} target="_blank" rel="noopener noreferrer">
              Book a 15-minute call
            </a>
          </div>
          <ul className="gs-lp__compare">
            <li className="gs-lp__compare-head" aria-hidden="true">
              <span />
              <span>Usual way</span>
              <span>With us</span>
            </li>
            {comparison.map((row) => (
              <li key={row.label} className="gs-lp__compare-row">
                <span className="gs-lp__compare-label">{row.label}</span>
                <span className="gs-lp__compare-usual">{row.usual}</span>
                <span className="gs-lp__compare-ours">{row.ours}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="gs-lp__foot">
        <p>
          GrowwStack — founder-led growth systems for selected brands.{" "}
          <a href="/">Full site</a> · <a href="/blog/performance-based-marketing-agency-india">How revenue share works</a>
        </p>
      </footer>

      <WhatsAppFab />
      <ConsentBanner />
    </div>
  );
}
