import { useState } from "react";
import { brandId, partnerBrands, ndaNote } from "../../../content/company";

const origin = "https://growwstack.in";

const services = [
  { title: "SEO services", copy: "Technical SEO, keyword research, service, product and category pages, internal links and buyer guides that grow organic traffic from Google and turn it into enquiries and orders.", href: "/services#search-visibility", link: "Explore SEO services" },
  { title: "AEO and GEO for AI search", copy: "Answer engine optimisation (AEO) and generative engine optimisation (GEO) so ChatGPT, Gemini, Perplexity and Google AI Overviews can find, understand and recommend your business.", href: "/blog/generative-engine-optimization-geo", link: "How GEO works" },
  { title: "Websites and growth systems", copy: "Fast, search-ready websites, landing pages, product planners, CRM and WhatsApp follow-up, so the traffic we bring becomes measurable revenue.", href: "/services#growth-stack", link: "Explore growth systems" },
];

// Guides linked from the homepage so crawlers and buyers reach them in one click.
const guides = [
  { href: "/blog/why-your-website-gets-no-traffic", label: "How to increase website traffic (and why you get none)" },
  { href: "/blog/aeo-geo-services-india", label: "AEO and GEO services in India: what you should get" },
  { href: "/blog/seo-cost-in-india", label: "SEO cost in India: monthly pricing explained" },
  { href: "/blog/ecommerce-seo-services-india", label: "E-commerce SEO services for Indian stores" },
  { href: "/blog/generative-engine-optimization-geo", label: "GEO: how to get your business into AI answers" },
  { href: "/blog/answer-engine-optimization-aeo", label: "AEO: answer engine optimisation for business websites" },
  { href: "/blog/seo-aeo-geo-audit-brief-india", label: "What an SEO, AEO and GEO audit should deliver" },
  { href: "/blog/technical-seo-checklist-new-website", label: "Technical SEO checklist for a new website" },
  { href: "/blog/d2c-store-traffic-no-sales", label: "Traffic but no sales? A D2C store diagnostic" },
  { href: "/blog/industrial-b2b-lead-generation-india", label: "Manufacturing SEO and industrial B2B leads" },
  { href: "/blog/google-business-profile-clinic-india", label: "Google Business Profile settings for clinics" },
  { href: "/blog/questions-to-ask-marketing-agency-india", label: "Nine questions to ask an agency before you sign" },
];

export const homeFaqs = [
  { question: "What does GrowwStack do?", answer: "GrowwStack is an organic growth agency in India. We do SEO (search engine optimisation), AEO (answer engine optimisation) and GEO (generative engine optimisation) for D2C brands, e-commerce stores, manufacturers, clinics and service businesses, and we build the websites, landing pages and follow-up systems that turn organic visitors into customers." },
  { question: "How does the no-upfront-fee model work?", answer: "Selected partners pay no upfront agency fee or monthly retainer. GrowwStack earns an agreed percentage of the revenue the work produces. The scope, starting baseline, what counts as attributable revenue and payment timing are agreed in writing before work begins. Separate business costs, such as hosting or software, are listed in the proposal." },
  { question: "Do you run Google Ads or Meta ads?", answer: "No. GrowwStack works only on organic growth: search rankings, visibility in AI answers, useful content, technical fixes, websites and conversion. We do not manage paid ad campaigns, so the traffic we build keeps working without a monthly ad budget." },
  { question: "What is the difference between SEO, AEO and GEO?", answer: "SEO helps your pages rank in Google and Bing search results. AEO structures your pages so search features and voice assistants can lift a direct answer from them. GEO helps generative AI tools such as ChatGPT, Gemini, Perplexity and Google AI Overviews understand, trust and cite your business. All three depend on clear, accurate pages that search engines can crawl." },
  { question: "How long does SEO take to increase traffic?", answer: "Fixes to pages that already appear in search, such as better titles, clearer answers and internal links, can lift clicks within a few weeks. New pages and competitive keywords usually take three to six months or longer and need mentions and links from other websites. We report progress from Google Search Console every week rather than promising a ranking." },
  { question: "Can a new brand with zero traffic or sales work with you?", answer: "Yes, a launch-ready brand with zero organic traffic or online sales can be assessed, alongside established businesses. We look at what you sell, who buys it, your margins and how orders or enquiries will be fulfilled. Acceptance depends on fit, and we will tell you plainly if we are not the right partner." },
  { question: "Is GrowwStack connected to companies with similar names?", answer: "No. GrowwStack (growwstack.in, spelt with a double w and no s) is an independent organic growth agency founded by Ramayana Singh. It is not affiliated with businesses that have similar names." },
];

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${origin}/#faq`,
  mainEntity: homeFaqs.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })),
};

export function MinimalHome() {
  const [brandsPaused, setBrandsPaused] = useState(false);
  return <div className="gs-minimal">
    <section className="gs-minimal__hero gs-container" id="home" aria-labelledby="hero-title">
      <p className="gs-eyebrow">Organic growth agency · India</p>
      <h1 id="hero-title">SEO, AEO &amp; GEO agency in India.<br /><span>Paid only when you earn.</span></h1>
      <p className="gs-minimal__lede">We grow your organic traffic from Google and AI answers, then build the websites and systems that turn it into customers. Organic only, no paid ads.</p>
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
    <section className="gs-container gs-minimal__section" id="what-we-do" aria-labelledby="what-we-do-title">
      <h2 id="what-we-do-title">What is GrowwStack?</h2>
      <p className="gs-minimal__answer">GrowwStack is an organic growth agency in India, founded by Ramayana Singh (M.Tech, BITS Pilani). We grow traffic from Google search and AI assistants through SEO, AEO and GEO, and we build the websites, landing pages and CRM systems that turn those visitors into customers. Selected partners pay no upfront agency fee or monthly retainer: we earn an agreed share of the revenue our work produces. We do not run paid ads.</p>
    </section>
    <section className="gs-container gs-minimal__section" id="growth-stack" aria-labelledby="minimal-services">
      <div className="gs-minimal__heading"><h2 id="minimal-services">SEO, AEO and GEO services, connected to sales.</h2><a href="/services">All services →</a></div>
      <div className="gs-minimal__columns">{services.map((service, i) => <article key={service.title}><span className="gs-minimal__number">0{i + 1}</span><h3>{service.title}</h3><p>{service.copy}</p><a href={service.href}>{service.link} →</a></article>)}</div>
    </section>
    <section className="gs-container gs-minimal__section gs-minimal__closing" aria-label="About and partnerships">
      <article id="founder"><p className="gs-eyebrow">The people</p><h2>Engineering depth.<br />Commercial focus.</h2><p>A core team with backgrounds at BITS Pilani, IIT Guwahati, IIT Kharagpur, Frido and NoBroker. Led by founder Ramayana Singh.</p><a href="/about#gs-team-title">Meet our team →</a></article>
      <article id="offer"><p className="gs-eyebrow">The partnership</p><h2>We build.<br />We grow together.</h2><p>Selected businesses pay no upfront agency fee or monthly retainer. We earn a share of measurable growth, on terms agreed before we begin.</p><a href="/partnership">How it works & apply →</a></article>
    </section>
    <section className="gs-container gs-minimal__section" id="guides" aria-labelledby="guides-title">
      <div className="gs-minimal__heading"><h2 id="guides-title">Free guides to getting more organic traffic</h2><a href="/blog">All guides →</a></div>
      <ul className="gs-minimal__guides">{guides.map(guide => <li key={guide.href}><a href={guide.href}>{guide.label}</a></li>)}</ul>
    </section>
    <section className="gs-container gs-minimal__section" id="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">Questions about SEO, AEO and GEO with GrowwStack</h2>
      <div className="gs-minimal__faq">{homeFaqs.map(item => <article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
    </section>
    <section className="gs-container gs-minimal__contact" id="contact"><h2>Let’s grow your organic traffic.</h2><a className="gs-button gs-button--signal" href="/contact">Start a conversation ↗</a></section>
  </div>;
}
