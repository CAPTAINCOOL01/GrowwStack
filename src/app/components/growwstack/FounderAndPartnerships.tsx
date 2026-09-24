import { ResultsSection } from "./GrowthAndResults";

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
    company: "Camstar Sports",
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

const caseStudySlugs: Record<string, string> = {
  "Healthcare & clinics": "healthcare-clinic-growth",
  "Sports equipment": "ecommerce-sports-equipment",
  "Refrigeration & deep tech": "deep-tech-b2b-expansion",
};

const activePartnerships = [
  {
    sector: "Healthcare & clinics",
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
    sector: "Sports equipment",
    mandate: "End-to-end e-commerce growth",
    summary: "Product discovery, checkout, customer conversations, and fulfilment in one system.",
    systems: [
      "Website optimisation and product positioning",
      "SEO, analytics, and conversion funnels",
      "WhatsApp sales and CRM workflows",
      "Payments, order operations, and customer support",
    ],
  },
  {
    sector: "Refrigeration & deep tech",
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
          <p className="gs-eyebrow">Founder-led execution</p>
          <h2 className="gs-section__title" id="gs-founder-title">
            Engineering depth. <span>Commercial focus.</span>
          </h2>
        </header>

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
            Three industries. <span>Growth in operation.</span>
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
                <a
                  className="gs-partnerships__case-link"
                  href={`/case-studies/${caseStudySlugs[partnership.sector]}`}
                >
                  Read the case study
                  <span aria-hidden="true"> →</span>
                </a>
              </footer>
            </article>
          ))}
        </div>
        <ResultsSection />
      </div>
    </section>
  );
}
