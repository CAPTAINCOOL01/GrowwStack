import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "../../../lib/config";

export function SiteFooter() {
  const whatsappHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I'd like to talk.",
  )}`;

  return (
    <footer className="gs-footer">
      <div className="gs-container gs-footer__statement">
        <p className="gs-eyebrow gs-eyebrow--light">The partnership premise</p>
        <blockquote>
          You bring the product, expertise, and ambition. <span>GrowwStack brings the system required to scale it.</span>
        </blockquote>
        <a className="gs-button gs-button--signal" href="#apply">
          Tell us about your brand
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="gs-container gs-footer__base">
        <a className="gs-brand gs-brand--footer" href="#home" aria-label="GrowwStack home">
          <span className="gs-brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="gs-brand__word">GrowwStack</span>
        </a>
        <p>Founder-led growth systems for selected brands.</p>
        <div className="gs-footer__links">
          <a href="/blog">Blog</a>
          <a href={`tel:+${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="mailto:ceo-office@growwstack.in">ceo-office@growwstack.in</a>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
