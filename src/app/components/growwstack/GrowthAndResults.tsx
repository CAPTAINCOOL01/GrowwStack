const growthLayers = [
  {
    number: "01",
    action: "Establish",
    title: "Digital presence",
    description:
      "Websites, landing pages, product catalogues, e-commerce stores, and digital brand positioning.",
  },
  {
    number: "02",
    action: "Attract",
    title: "Customer acquisition",
    description:
      "SEO, GEO, AEO, content strategy, organic growth, lead generation, and campaign landing pages.",
  },
  {
    number: "03",
    action: "Convert",
    title: "Conversion systems",
    description:
      "Customer journeys, product pages, checkout optimisation, lead capture, follow-ups, and sales funnels.",
  },
  {
    number: "04",
    action: "Close",
    title: "Sales infrastructure",
    description:
      "Sales representatives, scripts, SOPs, lead assignment, objection handling, performance tracking, and closures.",
  },
  {
    number: "05",
    action: "Orchestrate",
    title: "CRM & automation",
    description:
      "CRM pipelines, WhatsApp automation, email workflows, reminders, customer segmentation, and lead tracking.",
  },
  {
    number: "06",
    action: "Measure",
    title: "Revenue intelligence",
    description:
      "GA4, GTM, Meta Pixel, attribution, conversion events, revenue dashboards, and sales analytics.",
  },
];

const results = [
  {
    value: "₹1.5 Cr",
    label: "Organic revenue generated",
    description: "Approximately, across three active partner brands in our first three months. No paid ads.",
  },
  {
    value: "₹1.5 Cr",
    label: "Organic e-commerce revenue",
    description: "Grew from ₹0 to ₹1.5 crore through one e-commerce partnership in 110 days, without any paid ads.",
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
    <section className="gs-stack gs-stack--compact" id="growth-stack" aria-labelledby="growth-stack-title">
      <div className="gs-container gs-stack__container">
        <header className="gs-section-heading gs-stack__heading">
          <p className="gs-eyebrow">
            What we do
          </p>
          <h2 id="growth-stack-title">Your complete growth stack.</h2>
          <p className="gs-stack__introduction">
            From your first website to sales and revenue reporting. Six connected services, one accountable partner.
          </p>
        </header>

        <div className="gs-stack__blueprint">
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

        </div>

      </div>
    </section>
  );
}

export function ResultsSection() {
  return (
    <div className="gs-results gs-results--compact" id="results" role="region" aria-label="Early partner outcomes">
      <div className="gs-results__container">

        <dl className="gs-results__ledger">
          {results.map((result) => (
            <div className="gs-results__metric" key={result.label}>
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
    </div>
  );
}
