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
  {
    value: "₹1.5 Cr",
    label: "Partner revenue",
    detail: "Across three brands within three months",
  },
  {
    value: "₹35L+",
    label: "E-commerce revenue",
    detail: "Through one partnership within 45 days",
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
    summary:
      "A connected system for turning digital discovery into booked appointments, timely follow-ups, and measurable patient growth.",
    systems: [
      "Website development and lead generation",
      "CRM and appointment tracking",
      "Customer follow-ups and sales processes",
      "Digital visibility",
    ],
  },
  {
    sector: "Sports equipment",
    mandate: "End-to-end e-commerce growth",
    summary:
      "An operating layer across product discovery, checkout, customer conversations, fulfilment, and the decisions behind revenue growth.",
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
    summary:
      "Clear technical communication and B2B infrastructure designed to turn complex products into qualified commercial conversations.",
    systems: [
      "Brand positioning and technical websites",
      "B2B lead generation",
      "Product communication",
      "Sales and business-development systems",
    ],
  },
] as const;

export function FounderSection() {
  return (
    <section
      className="gs-section gs-founder"
      id="founder"
      aria-labelledby="gs-founder-title"
    >
      <div className="gs-shell">
        <header className="gs-section__header gs-founder__header">
          <p className="gs-eyebrow">Founder credibility</p>
          <h2 className="gs-section__title" id="gs-founder-title">
            Built by an Engineer. <span>Driven by Growth.</span>
          </h2>
          <p className="gs-section__lede">
            Engineering depth, commercial judgement, and hands-on execution in
            one founder-led growth practice.
          </p>
        </header>

        <div className="gs-founder__layout">
          <article className="gs-founder__profile">
            <header className="gs-founder__identity">
              <p className="gs-founder__role">Founder · Product-growth operator</p>
              <h3 className="gs-founder__name">Ramayana Singh</h3>
              <p className="gs-founder__bio">
                A BITS Pilani postgraduate and product-growth professional with
                more than five years of experience spanning engineering,
                consumer products, refrigeration, deep technology, e-commerce,
                analytics, and business operations.
              </p>
            </header>

            <p className="gs-founder__principle">
              His work connects technical execution with customer
              understanding, sales operations, and measurable business growth.
            </p>

            <div className="gs-founder__experience">
              <h4 className="gs-founder__experience-title">Company experience</h4>
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
            </div>
          </article>

          <dl
            className="gs-founder__proof-grid"
            aria-label="Founder and partnership proof points"
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
      className="gs-section gs-partnerships"
      id="partnerships"
      aria-labelledby="gs-partnerships-title"
    >
      <div className="gs-shell">
        <header className="gs-section__header gs-partnerships__header">
          <p className="gs-eyebrow">Active partnerships</p>
          <h2 className="gs-section__title" id="gs-partnerships-title">
            Brands We Are <span>Currently Growing.</span>
          </h2>
          <p className="gs-section__lede">
            GrowwStack works with selected brands across three industries,
            building the growth system around each business model—not forcing
            every company into the same playbook.
          </p>
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

              <div className="gs-partnerships__scope">
                <h4 className="gs-partnerships__scope-title">
                  Growth system in operation
                </h4>
                <ul className="gs-partnerships__systems">
                  {partnership.systems.map((system) => (
                    <li className="gs-partnerships__system" key={system}>
                      {system}
                    </li>
                  ))}
                </ul>
              </div>

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

        <aside
          className="gs-partnerships__result"
          aria-label="Combined active partnership result"
        >
          <div className="gs-partnerships__result-mark">
            <p className="gs-partnerships__result-label">Combined result</p>
            <p className="gs-partnerships__result-value">₹1.5 Cr</p>
          </div>
          <div className="gs-partnerships__result-copy">
            <p>
              Across these three active partner brands, GrowwStack helped
              generate approximately ₹1.5 crore in revenue within its first three
              months of operations.
            </p>
            <span>Three brands · Three industries · One operating window</span>
          </div>
        </aside>
      </div>
    </section>
  );
}
