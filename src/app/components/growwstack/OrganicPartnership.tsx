const origin = 'https://growwstack.in';

const questions = [
  { question: 'Do you charge an upfront SEO fee or monthly retainer?', answer: 'No upfront agency fee or monthly retainer applies to the agreed revenue-share partnership. GrowwStack is paid an agreed percentage when the work produces revenue under the written measurement rules. The percentage, revenue base and payment timing are agreed before work starts. Hosting, software, production and other business costs are identified separately in the proposal; no upfront agency fee does not mean every business expense is covered.' },
  { question: 'Can a new brand start with zero organic traffic or online sales?', answer: 'Yes, a brand can be assessed with zero organic traffic or online sales. Share what you sell, who needs it, how orders or enquiries will be fulfilled and whether the margins can support a revenue share. Existing businesses moving online and launch-ready brands can have different starting points. We evaluate readiness and demand rather than requiring an existing keyword ranking; acceptance and scope are agreed individually.' },
  { question: 'Are SEO, AEO and GEO included in the partnership?', answer: 'The search scope can cover technical SEO, commercially useful pages, answer-focused content, internal links and visibility in AI-assisted search. We agree the pages, buyer questions, markets and implementation responsibilities in the plan. AEO means answer engine optimization; GEO means generative engine optimization. The aim is relevant discovery and customer enquiries, supported by a usable website and a sales follow-up process.' },
  { question: 'Do we pay when a keyword ranks or when an AI answer mentions us?', answer: 'The partnership is based on agreed revenue, rather than a fee for a keyword position, an impression or an AI mention. We track visibility, organic visits, successfully saved enquiries, qualified opportunities and collected revenue as separate measures. Search rankings and AI recommendations vary and cannot be guaranteed. The contract defines the baseline, included channels, returns, cancellations and attribution before the revenue share is calculated.' },
];

export function OrganicPartnership() {
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${origin}/partnership#organic-growth-service`,
    name: 'Revenue-share SEO, AEO and GEO partnership',
    serviceType: ['Search engine optimization', 'Answer engine optimization', 'Generative engine optimization'],
    description: 'Organic growth work with no upfront agency fee or monthly retainer under an agreed revenue-share partnership. Scope, revenue definition and payment terms are agreed before starting.',
    url: `${origin}/partnership`,
    provider: { '@id': `${origin}/#organization` },
    areaServed: { '@type': 'Country', name: 'India' },
  };

  return <div className="gs-minimal gs-container">
    <section className="gs-minimal__section" id="organic-growth" aria-labelledby="organic-partnership-title">
      <h2 id="organic-partnership-title">An organic growth partner paid from revenue</h2>
      <p>GrowwStack helps brands build organic discovery through SEO, AEO and GEO with no upfront agency fee. We earn an agreed percentage of revenue from the work, rather than billing a monthly agency retainer. Start by sharing your offer, customers and current growth constraint.</p>
      <div className="gs-minimal__columns">
        <article><h3>Get found by relevant buyers</h3><p>Map commercial searches and buyer questions to useful service, product and category pages. Fix crawl access, indexing obstacles, page clarity and contextual links before adding content simply to increase the page count.</p><a href="/services#search-visibility">See the search scope →</a></article>
        <article><h3>Turn discovery into enquiries</h3><p>Connect the page to a working order, enquiry or RFQ path. For manufacturers, that means useful capability and specification information. For D2C brands, it means product discovery, buying information and a usable checkout.</p><a href="/services#manufacturer-growth">Explore manufacturer and D2C growth →</a></article>
        <article><h3>Agree what earns a share</h3><p>Define the baseline, attributable revenue and payment timing together. A form click is not a saved lead, a lead is not a sale, and an analytics session is not a financial record.</p><a href="/blog/revenue-share-marketing-attribution-checklist">Review the measurement checklist →</a></article>
      </div>
      <p><a href="#apply">Discuss a revenue-share search partnership →</a></p>
    </section>
    <section className="gs-minimal__section" id="organic-growth-questions" aria-labelledby="organic-questions-title">
      <h2 id="organic-questions-title">Before you choose a no-upfront SEO partner</h2>
      {questions.map(item => <article key={item.question}><h3>{item.question}</h3><p style={{maxWidth: 'none'}}>{item.answer}</p></article>)}
      <p><a href="/blog/pay-after-results-seo-india">Compare pay-after-results SEO with revenue share →</a></p>
    </section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(service).replace(/</g, '\\u003c')}} />
  </div>;
}
