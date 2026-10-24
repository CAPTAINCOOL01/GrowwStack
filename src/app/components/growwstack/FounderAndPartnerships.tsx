import { ResultsSection } from "./GrowthAndResults";
import { coreTeam } from "../../../content/company";

const founderExperience = [
  {
    company: "Atomberg Technologies",
    domain: "Consumer products",
    focus: "Product development and new-product development",
  },
  {
    company: "Ecozen Solutions",
    domain: "Deep technology",
    focus: "Solar refrigeration, thermal systems, and product development",
  },
  {
    company: "Dover Corporation",
    domain: "Industrial systems",
    focus: "Refrigeration, product optimisation, and manufacturing",
  },
  {
    company: "Sports equipment brand",
    domain: "E-commerce",
    focus: "Growth, analytics, CRM, sales operations, and revenue systems",
  },
] as const;

const founderProof = [
  {
    value: "9.3 / 10",
    label: "BITS Pilani",
    detail: "M.Tech · Gold Medalist",
  },
  {
    value: "5+ years",
    label: "Operator experience",
    detail: "Product, engineering, operations, and growth",
  },
] as const;

const caseStudyLink = (slug: string) => ({
  href: `/case-studies/${slug}`,
  label: "Read the case study",
  external: false,
});

const newPartnerSystems = [
  "SaaS products",
  "E-commerce website and store",
  "SEO, GEO and AEO",
  "CRM, WhatsApp and automation",
  "Analytics and revenue reporting",
];

const activePartnerships = [
  {
    sector: "Healthcare & clinics",
    link: caseStudyLink("healthcare-clinic-growth"),
    mandate: "Patient acquisition and clinic growth",
    summary: "From digital discovery to booked appointments and patient follow-ups.",
    systems: [
      "Website development and lead generation",
      "CRM and appointment tracking",
      "Customer follow-ups and sales processes",
      "AI agents",
      "SEO, GEO and AEO",
    ],
  },
  {
    sector: "Sports equipment · Camstar Sports",
    link: caseStudyLink("ecommerce-sports-equipment"),
    mandate: "End-to-end e-commerce growth",
    summary: "For a sports-equipment partner: product discovery, checkout, customer conversations and fulfilment in one system.",
    systems: [
      "Website optimisation and product positioning",
      "SEO, analytics, and conversion funnels",
      "WhatsApp sales and CRM workflows",
      "Payments, order operations, and customer support",
    ],
  },
  {
    sector: "Refrigeration & deep tech",
    link: caseStudyLink("deep-tech-b2b-expansion"),
    mandate: "Technical business expansion",
    summary: "Technical positioning and B2B systems that create qualified commercial conversations.",
    systems: [
      "Brand positioning and technical websites",
      "B2B lead generation",
      "Product communication",
      "Sales and business-development systems",
      "AI agents",
      "SEO, GEO and AEO",
    ],
  },
  {
    sector: "Pet supplies · Furtopia",
    link: { href: "https://furtopia.co.in/", label: "Visit furtopia.co.in", external: true },
    mandate: "D2C pet-supplies growth",
    summary: "For Furtopia, a Navi Mumbai pet store shipping across India: the store, search visibility and the systems behind every order.",
    systems: newPartnerSystems,
  },
  {
    sector: "Fitness equipment · Viva Fitness",
    link: null,
    mandate: "Digital growth for a ₹350 Cr+ gym brand",
    summary: "For a ₹350 Cr+ fitness-equipment brand: SaaS products, e-commerce, search and the sales systems that connect them.",
    systems: newPartnerSystems,
  },
] as const;

export function FounderSection() {
  return (
    <section
      className="gs-section gs-founder gs-founder--compact"
      id="founder"
      aria-labelledby="gs-founder-title"
    >
      <div className="gs-shell">
        <header className="gs-section__header gs-founder__header">
          <p className="gs-eyebrow">About GrowwStack · Pune, India</p>
          <h2 className="gs-section__title" id="gs-founder-title">
            Engineering depth. <span>Commercial focus.</span>
          </h2>
        </header>

        <p className="gs-about-intro">We build and operate websites, organic acquisition and sales systems for Indian brands. A small core team, with direct founder involvement.</p>
        <section className="gs-team" aria-labelledby="gs-team-title">
          <h2 id="gs-team-title">Meet the core team.</h2>
          <div className="gs-team__grid">{coreTeam.map(person => <article key={person.name}><h3>{person.name}</h3><p>{person.detail}</p></article>)}</div>
        </section>
        <div className="gs-founder__layout">
          <article className="gs-founder__profile">
            <header className="gs-founder__identity">
              <p className="gs-founder__role">Founder · Product-growth operator</p>
              <h3 className="gs-founder__name">Ramayana Singh</h3>
              <p className="gs-founder__bio">
                BITS Pilani postgraduate connecting product engineering,
                customer understanding, sales operations, and measurable growth.
              </p>
            </header>

            <details className="gs-disclosure gs-founder__experience">
              <summary>Experience across four companies</summary>
              <ul
                className="gs-founder__experience-list"
                aria-label="Ramayana Singh's company experience"
              >
                {founderExperience.map((item) => (
                  <li
                    className="gs-founder__experience-item"
                    key={item.company}
                  >
                    <div className="gs-founder__experience-heading">
                      <strong className="gs-founder__company">
                        {item.company}
                      </strong>
                      <span className="gs-founder__domain">{item.domain}</span>
                    </div>
                    <p className="gs-founder__focus">{item.focus}</p>
                  </li>
                ))}
              </ul>
            </details>
          </article>

          <dl
            className="gs-founder__proof-grid"
            aria-label="Founder credentials"
          >
            {founderProof.map((proof) => (
              <div className="gs-founder__proof-card" key={proof.label}>
                <dt className="gs-founder__proof-term">
                  <span className="gs-founder__proof-value">{proof.value}</span>
                  <span className="gs-founder__proof-label">{proof.label}</span>
                </dt>
                <dd className="gs-founder__proof-detail">{proof.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function PartnershipsSection() {
  return (
    <section
      className="gs-section gs-partnerships gs-partnerships--compact"
      id="partnerships"
      aria-labelledby="gs-partnerships-title"
    >
      <div className="gs-shell">
        <header className="gs-section__header gs-partnerships__header">
          <p className="gs-eyebrow">Active partnerships</p>
          <h2 className="gs-section__title" id="gs-partnerships-title">
            Camstar Sports. Viva Fitness. Furtopia.<span> And many more.</span>
          </h2>
        </header>

        <div className="gs-partnerships__grid">
          {activePartnerships.map((partnership) => (
            <article className="gs-partnerships__case" key={partnership.sector}>
              <header className="gs-partnerships__case-header">
                <p className="gs-partnerships__sector">{partnership.sector}</p>
                <h3 className="gs-partnerships__mandate">
                  {partnership.mandate}
                </h3>
                <p className="gs-partnerships__summary">
                  {partnership.summary}
                </p>
              </header>

              <details className="gs-disclosure gs-partnerships__scope">
                <summary>What we operate</summary>
                <ul className="gs-partnerships__systems">
                  {partnership.systems.map((system) => (
                    <li className="gs-partnerships__system" key={system}>
                      {system}
                    </li>
                  ))}
                </ul>
              </details>

              <footer className="gs-partnerships__case-footer">
                <span className="gs-partnerships__status">Active partnership</span>
                {partnership.link ? (
                  <a
                    className="gs-partnerships__case-link"
                    href={partnership.link.href}
                    {...(partnership.link.external ? { target: "_blank", rel: "noopener" } : {})}
                  >
                    {partnership.link.label}
                    <span aria-hidden="true">{partnership.link.external ? " ↗" : " →"}</span>
                  </a>
                ) : null}
              </footer>
            </article>
          ))}
        </div>
        <ResultsSection />
      </div>
    </section>
  );
}
