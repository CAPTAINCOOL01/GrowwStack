import { useState } from "react";
import { brandId, partnerBrands, ndaNote } from "../../../content/company";

const services = [
  { title: "Get discovered", copy: "SEO, AEO and GEO, backed by sitemaps, indexing and technical fixes. Build your presence across search and AI answers.", href: "/services#growth-stack", link: "Explore digital presence" },
  { title: "Turn visits into leads", copy: "Customer acquisition tools, landing pages and product planners that turn interest into qualified enquiries and sales.", href: "/services#growth-stack", link: "Explore acquisition tools" },
  { title: "Build systems that scale", copy: "Custom SaaS products, CRM, WhatsApp automation and analytics to capture leads, follow up and measure revenue.", href: "/services#growth-stack", link: "Explore growth systems" },
];

export function MinimalHome() {
  const [brandsPaused, setBrandsPaused] = useState(false);
  return <div className="gs-minimal">
    <section className="gs-minimal__hero gs-container" id="home" aria-labelledby="hero-title">
      <p className="gs-eyebrow">Founder-led growth partnerships</p>
      <h1 id="hero-title">Good businesses.<br /><span>Built to grow.</span></h1>
      <p className="gs-minimal__lede">Search visibility, customer acquisition and SaaS systems.<br />One partner to build and run them together.</p>
      <div className="gs-zero-offer"><strong>Get onboarded at <span>₹0 upfront fees.</span></strong><p>We charge nothing until you earn revenue from our work.</p><small>For selected partners. Revenue share and measurement agreed before we begin.</small></div>
      <div className="gs-minimal__actions"><a className="gs-button gs-button--signal" href="/contact">Start at ₹0 upfront ↗</a><a href="/partnership">How it works →</a></div>
      <p className="gs-minimal__proof"><strong>₹2.5 Cr+</strong> in revenue across partner brands · 5 months · ₹0 ad spend</p>
    </section>
    <section className="gs-container gs-brand-strip" id="partnerships" aria-labelledby="minimal-brands">
      <div className="gs-brand-strip__header"><h2 id="minimal-brands">Brands we’ve worked with</h2><a href="/work">Our work →</a><button type="button" aria-pressed={brandsPaused} onClick={() => setBrandsPaused(!brandsPaused)} aria-label={brandsPaused ? "Play brand scrolling" : "Pause brand scrolling"}>{brandsPaused ? "Play" : "Pause"}</button></div>
      <div className="gs-brand-strip__window" data-paused={brandsPaused}><div className="gs-brand-strip__track">
        <div className="gs-brand-strip__group">{partnerBrands.map(brand => <a key={brand.name} href={`/work#${brandId(brand.name)}`}>{brand.name}</a>)}<a href="/work#other-brands">Other brands</a><span>and many more</span></div>
        <div className="gs-brand-strip__group" aria-hidden="true">{partnerBrands.map(brand => <span key={brand.name}>{brand.name}</span>)}<span>Other brands</span><span>and many more</span></div>
      </div></div>
      <p className="gs-brand-strip__note">{ndaNote}</p>
    </section>
    <section className="gs-container gs-minimal__section" id="growth-stack" aria-labelledby="minimal-services">
      <div className="gs-minimal__heading"><h2 id="minimal-services">Your growth, connected.</h2><a href="/services">All services →</a></div>
      <div className="gs-minimal__columns">{services.map((service, i) => <article key={service.title}><span className="gs-minimal__number">0{i + 1}</span><h3>{service.title}</h3><p>{service.copy}</p><a href={service.href}>{service.link} →</a></article>)}</div>
    </section>
    <section className="gs-container gs-minimal__section gs-minimal__closing" aria-label="About and partnerships">
      <article id="founder"><p className="gs-eyebrow">The people</p><h2>Engineering depth.<br />Commercial focus.</h2><p>A core team with backgrounds at BITS Pilani, IIT Guwahati, IIT Kharagpur, Frido and NoBroker. Led by founder Ramayana Singh.</p><a href="/about#gs-team-title">Meet our team →</a></article>
      <article id="offer"><p className="gs-eyebrow">The partnership</p><h2>We build.<br />We grow together.</h2><p>Selected businesses pay no upfront agency fee or monthly retainer. We earn a share of measurable growth, on terms agreed before we begin.</p><a href="/partnership">How it works & apply →</a></article>
    </section>
    <section className="gs-container gs-minimal__contact" id="contact"><h2>Let’s build your next stage.</h2><a className="gs-button gs-button--signal" href="/contact">Start a conversation ↗</a></section>
  </div>;
}
