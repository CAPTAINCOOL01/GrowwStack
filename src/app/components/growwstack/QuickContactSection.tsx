import { useRef, useState, type FormEvent } from "react";
import {
  CALENDLY_CALL,
  CALENDLY_MEET,
  CONTACT_PHONE,
  CONTACT_PHONE_DISPLAY,
} from "../../../lib/config";
import { sbInsert } from "../../../lib/supabase";
import { trackLead } from "../../../lib/events";
import { contactProblem } from "../../../lib/contact";

type Status = "idle" | "invalid" | "sending" | "sent" | "error";

const initial = { name: "", email: "", phone: "", company: "", message: "" };

function whatsappLink(body: string) {
  const encoded = encodeURIComponent(body || "Hi GrowwStack, I'd like to talk.");
  return `https://wa.me/${CONTACT_PHONE}?text=${encoded}`;
}

export function QuickContactSection() {
  const [values, setValues] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  // A ref, not state: two submits in the same tick must not both save a lead.
  const inFlight = useRef(false);

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
        company: values.company.trim() || null,
        message: values.message.trim() || null,
        source: "quick_contact",
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

  const waBody =
    `Hi GrowwStack, I'm ${values.name || "[name]"} from ${values.company || "[company]"}.` +
    (values.message ? ` ${values.message}` : "");

  return (
    <section
      id="contact"
      className="gs-section gs-quick-contact gs-quick-contact--compact"
      aria-labelledby="quick-contact-title"
    >
      <div className="gs-shell gs-quick-contact__shell">
        <header className="gs-quick-contact__intro">
          <p className="gs-eyebrow">Quick contact</p>
          <h2 id="quick-contact-title" className="gs-quick-contact__title">
            Tell us about your business.
          </h2>
          <p className="gs-quick-contact__lede">
            Send a short note. The founder replies within one working day.
          </p>
          <ul className="gs-quick-contact__channels" aria-label="Direct channels">
            <li>
              <span className="gs-quick-contact__channel-label">Phone</span>
              <a href={`tel:+${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
            </li>
            <li>
              <span className="gs-quick-contact__channel-label">Email</span>
              <a href="mailto:ceo-office@growwstack.in">ceo-office@growwstack.in</a>
            </li>
            <li>
              <span className="gs-quick-contact__channel-label">WhatsApp</span>
              <a
                href={whatsappLink(waBody)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat with the founder
              </a>
            </li>
            <li>
              <span className="gs-quick-contact__channel-label">Call</span>
              <a href={CALENDLY_CALL} target="_blank" rel="noopener noreferrer">
                Book a 15-minute call
              </a>
            </li>
            <li>
              <span className="gs-quick-contact__channel-label">Video</span>
              <a href={CALENDLY_MEET} target="_blank" rel="noopener noreferrer">
                Book a 15-minute video meet
              </a>
            </li>
          </ul>
        </header>

        <form data-lead-form="quick_contact" className="gs-quick-contact__form" onSubmit={submit} noValidate>
          <div className="gs-quick-contact__grid">
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
              <span className="gs-field__label">Company</span>
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
            <label className="gs-field gs-field--wide">
              <span className="gs-field__label">What can we help with?</span>
              <textarea
                className="gs-field__textarea"
                name="message"
                rows={2}
                value={values.message}
                onChange={handleChange}
                placeholder="One or two lines about your business and the outcome you want."
              />
            </label>
          </div>

          <p className="gs-quick-contact__hint">
            Your name and an email or phone number are required, so we can reply.
          </p>

          <div className="gs-quick-contact__actions">
            <button
              className="gs-button gs-button--primary"
              type="submit"
              disabled={status === "sending" || !values.name.trim()}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <a
              className="gs-button gs-button--signal"
              href={whatsappLink(waBody)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Continue on WhatsApp
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>

          {status === "sent" && (
            <p className="gs-quick-contact__status gs-quick-contact__status--ok" role="status">
              Thank you. We have your note and will reply within one working day.
            </p>
          )}
          {status === "invalid" && (
            <p className="gs-quick-contact__status gs-quick-contact__status--err" role="alert">
              {error}
            </p>
          )}
          {status === "error" && (
            <p className="gs-quick-contact__status gs-quick-contact__status--err" role="alert">
              {error ?? "We couldn't submit that."} You can also reach us directly on WhatsApp or email above.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
