import { useRef, useState, type FormEvent } from "react";
import { CONTACT_PHONE } from "../../../lib/config";
import { sbInsert } from "../../../lib/supabase";
import { trackLead } from "../../../lib/events";
import { contactProblem } from "../../../lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

const initial = {
  name: "",
  email: "",
  phone: "",
  company: "",
  businessType: "",
  currentWebsite: "",
  projectType: "",
  primaryGoal: "",
  timeline: "",
  message: "",
};

const projectTypes = [
  "New website from scratch",
  "Rebuild of an existing site",
  "E-commerce store",
  "Landing pages for campaigns",
];

const primaryGoals = [
  "Qualified enquiries",
  "Online sales",
  "Bookings or appointments",
  "Credibility for B2B deals",
];

const timelines = [
  "As soon as possible",
  "Within a month",
  "One to three months",
  "Still planning",
];

const included = [
  "Custom design and development. No templates.",
  "Built to scale with your traffic.",
  "Search, analytics, and tracking from day one.",
  "Connected lead capture and follow-up systems.",
];

export function WebsiteBuildSection() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // A ref, not state: two submits in the same tick must not both save a lead.
  const inFlight = useRef(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inFlight.current) return;
    const problem = contactProblem(values.email, values.phone);
    if (problem) {
      setStatus("error");
      setError(problem);
      return;
    }
    inFlight.current = true;
    setStatus("sending");
    setError(null);
    try {
      await sbInsert("gs_website_orders", {
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || null,
        company: values.company.trim() || null,
        business_type: values.businessType.trim() || null,
        current_website: values.currentWebsite.trim() || null,
        project_type: values.projectType || null,
        primary_goal: values.primaryGoal || null,
        timeline: values.timeline || null,
        message: values.message.trim() || null,
        source: "website_build",
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      });
      setStatus("sent");
      trackLead("website_build");
      setValues(initial);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      inFlight.current = false;
    }
  };

  const waHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I would like a website built for my business.",
  )}`;

  return (
    <section id="build" className="gs-section gs-build gs-build--compact" aria-labelledby="gs-build-title">
      <div className="gs-shell gs-build__shell">
        <header className="gs-build__intro">
          <p className="gs-eyebrow">
            <span aria-hidden="true">Build</span>
            Websites for growing businesses
          </p>
          <h2 id="gs-build-title" className="gs-section__title">
            A website built for your next stage.
          </h2>
          <p className="gs-build__lede">
            A custom site, search, and follow-up systems, with no upfront build fee for selected partners. We are paid from the growth it produces.
          </p>


        </header>

        <details className="gs-disclosure gs-build__disclosure" data-hash-disclosure>
          <summary>Request a website build <span>Tell us what you need</span></summary>
          <div className="gs-disclosure__body gs-build__scope">
          <ul className="gs-build__included">
            {included.map((item) => (
              <li key={item}>
                <span aria-hidden="true">&rarr;</span>
                {item}
              </li>
            ))}
          </ul>

          <p className="gs-build__note">
            Limited builds, direct founder attention. We review your business before agreeing the scope and partnership terms.
          </p>
          </div>
        <form data-lead-form="website_build" className="gs-build__form gs-disclosure__body" onSubmit={submit} noValidate>
          <div className="gs-build__grid">
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
              <span className="gs-field__label">Business name</span>
              <input
                className="gs-field__input"
                name="company"
                value={values.company}
                onChange={handleChange}
                autoComplete="organization"
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
              <span className="gs-field__label">What does the business do?</span>
              <input
                className="gs-field__input"
                name="businessType"
                value={values.businessType}
                onChange={handleChange}
                placeholder="e.g. dental clinic, sports equipment brand"
              />
            </label>
            <label className="gs-field">
              <span className="gs-field__label">Current website</span>
              <input
                className="gs-field__input"
                name="currentWebsite"
                value={values.currentWebsite}
                onChange={handleChange}
                placeholder="Link, or leave blank if there is none"
              />
            </label>
            <label className="gs-field">
              <span className="gs-field__label">What do you need?</span>
              <select
                className="gs-field__select"
                name="projectType"
                value={values.projectType}
                onChange={handleChange}
              >
                <option value="">Select one</option>
                {projectTypes.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="gs-field">
              <span className="gs-field__label">What should it achieve?</span>
              <select
                className="gs-field__select"
                name="primaryGoal"
                value={values.primaryGoal}
                onChange={handleChange}
              >
                <option value="">Select one</option>
                {primaryGoals.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="gs-field">
              <span className="gs-field__label">Timeline</span>
              <select
                className="gs-field__select"
                name="timeline"
                value={values.timeline}
                onChange={handleChange}
              >
                <option value="">Select one</option>
                {timelines.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
            <label className="gs-field gs-field--wide">
              <span className="gs-field__label">Anything else we should know?</span>
              <textarea
                className="gs-field__textarea"
                name="message"
                rows={3}
                value={values.message}
                onChange={handleChange}
                placeholder="Pages you need, references you like, or what the current site gets wrong."
              />
            </label>
          </div>

          <p className="gs-build__hint">
            Your name and an email or phone number are required, so we can reply.
          </p>

          <div className="gs-build__actions">
            <button
              className="gs-button gs-button--primary"
              type="submit"
              disabled={status === "sending" || !values.name.trim()}
            >
              {status === "sending" ? "Sending…" : "Request a build"}
            </button>
            <a
              className="gs-button gs-button--signal"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              Discuss on WhatsApp
              <span aria-hidden="true"> &#8599;</span>
            </a>
          </div>

          {status === "sent" && (
            <p className="gs-build__status gs-build__status--ok" role="status">
              Received. We will review the business and reply within one working day.
            </p>
          )}
          {status === "error" && (
            <p className="gs-build__status gs-build__status--error" role="alert">
              {error}
            </p>
          )}
        </form>
        </details>
      </div>
    </section>
  );
}
