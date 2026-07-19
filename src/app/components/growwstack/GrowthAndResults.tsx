const growthLayers = [
  {
    number: "01",
    action: "Establish",
    title: "Digital Presence",
    description:
      "Websites, landing pages, product catalogues, e-commerce stores, and digital brand positioning.",
  },
  {
    number: "02",
    action: "Attract",
    title: "Customer Acquisition",
    description:
      "SEO, GEO, AEO, content strategy, organic growth, lead generation, and campaign landing pages.",
  },
  {
    number: "03",
    action: "Convert",
    title: "Conversion Systems",
    description:
      "Customer journeys, product pages, checkout optimisation, lead capture, follow-ups, and sales funnels.",
  },
  {
    number: "04",
    action: "Close",
    title: "Sales Infrastructure",
    description:
      "Sales representatives, scripts, SOPs, lead assignment, objection handling, performance tracking, and closures.",
  },
  {
    number: "05",
    action: "Orchestrate",
    title: "CRM & Automation",
    description:
      "CRM pipelines, WhatsApp automation, email workflows, reminders, customer segmentation, and lead tracking.",
  },
  {
    number: "06",
    action: "Measure",
    title: "Revenue Intelligence",
    description:
      "GA4, GTM, Meta Pixel, attribution, conversion events, revenue dashboards, and sales analytics.",
  },
];

const results = [
  {
    value: "₹93L",
    label: "Revenue generated",
    description: "Across three active partner brands within the first three months.",
  },
  {
    value: "₹35L+",
    label: "E-commerce revenue",
    description: "Generated through one e-commerce partnership within 45 days.",
  },
  {
    value: "3",
    qualifier: "industries",
    label: "Active sector experience",
    description: "Healthcare, sports equipment, and refrigeration and deep tech.",
  },
  {
    value: "₹0",
    qualifier: "upfront",
    label: "Fixed agency fee",
    description: "No fixed upfront agency fee for selected partner brands.",
  },
];

export function GrowthStackSection() {
  return (
    <section className="gs-stack" id="growth-stack" aria-labelledby="growth-stack-title">
      <div className="gs-container gs-stack__container">
        <header className="gs-section-heading gs-stack__heading">
          <p className="gs-eyebrow">
            <span aria-hidden="true">06</span>
            The revenue operating system
          </p>
          <h2 id="growth-stack-title">One partner for the complete growth journey.</h2>
          <p className="gs-stack__introduction">
            We engineer every layer as one connected system—so market attention becomes qualified demand,
            demand becomes revenue, and every result improves the next decision.
          </p>
        </header>

        <div className="gs-stack__blueprint">
          <div className="gs-stack__endpoint gs-stack__endpoint--input" aria-hidden="true">
            <span>Market signal</span>
            <span>In</span>
          </div>

          <ol className="gs-stack__layers" aria-label="Six connected layers in the GrowwStack growth system">
            {growthLayers.map((layer) => (
              <li className="gs-stack__layer" key={layer.number}>
                <span className="gs-stack__number" aria-hidden="true">
                  {layer.number}
                </span>
                <div className="gs-stack__identity">
                  <span className="gs-stack__action">{layer.action}</span>
                  <h3>{layer.title}</h3>
                </div>
                <p className="gs-stack__description">{layer.description}</p>
                <span className="gs-stack__connector" aria-hidden="true" />
              </li>
            ))}
          </ol>

          <div className="gs-stack__endpoint gs-stack__endpoint--output" aria-hidden="true">
            <span>Revenue intelligence</span>
            <span>Feeds every layer</span>
          </div>
        </div>

        <p className="gs-stack__closing">
          Not six disconnected deliverables. One accountable operating stack, built around the way your business
          actually sells.
        </p>
      </div>
    </section>
  );
}

export function ResultsSection() {
  return (
    <section className="gs-results" id="results" aria-labelledby="results-title">
      <div className="gs-container gs-results__container">
        <header className="gs-section-heading gs-results__heading">
          <p className="gs-eyebrow">
            <span aria-hidden="true">Proof</span>
            Early partner outcomes
          </p>
          <h2 id="results-title">Measurable growth. Not agency activity.</h2>
          <p>
            We judge the work by commercial movement: stronger demand, functioning sales systems, and revenue that
            can be measured.
          </p>
        </header>

        <dl className="gs-results__ledger">
          {results.map((result) => (
            <div className="gs-results__metric" key={result.value}>
              <dt className="gs-results__figure">
                <span className="gs-results__value">{result.value}</span>
                {result.qualifier ? <span className="gs-results__qualifier">{result.qualifier}</span> : null}
              </dt>
              <dd className="gs-results__detail">
                <strong>{result.label}</strong>
                <span>{result.description}</span>
              </dd>
            </div>
          ))}
        </dl>

        <aside className="gs-results__terms" aria-label="Partnership terms">
          <span className="gs-results__terms-mark" aria-hidden="true">↳</span>
          <p>
            <strong>Partnership terms</strong> are customised after business evaluation and mutual acceptance.
          </p>
        </aside>
      </div>
    </section>
  );
}
