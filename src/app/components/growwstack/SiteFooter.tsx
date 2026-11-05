import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY } from "../../../lib/config";

// Site-wide links so every page passes authority to the service pages and core guides.
const footerLinks = [
  { href: "/services", label: "SEO services" },
  { href: "/services#search-visibility", label: "AEO & GEO" },
  { href: "/partnership", label: "No-upfront revenue share" },
  { href: "/work", label: "Our work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Guides" },
  { href: "/blog/why-your-website-gets-no-traffic", label: "Why a website gets no traffic" },
  { href: "/blog/performance-based-marketing-agency-india", label: "How revenue share works" },
];

export function SiteFooter() {
  const whatsappHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I'd like to talk.",
  )}`;

  return (
    <footer className="gs-footer">
      <div className="gs-container gs-footer__base">
        <a className="gs-brand gs-brand--footer" href="/" aria-label="GrowwStack home">
          <span className="gs-brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="gs-brand__word">GrowwStack</span>
        </a>
        <p>Organic growth agency in India: SEO, AEO and GEO, paid from revenue.</p>
        <nav className="gs-footer__links" aria-label="Footer">
          {footerLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="/partnership#apply">Partnership application</a>
          <a href={`tel:+${CONTACT_PHONE}`}>{CONTACT_PHONE_DISPLAY}</a>
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href="mailto:ceo-office@growwstack.in">ceo-office@growwstack.in</a>
        </nav>
      </div>
    </footer>
  );
}
