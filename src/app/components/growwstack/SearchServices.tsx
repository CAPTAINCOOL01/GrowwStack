const origin = 'https://growwstack.in';
const services = [
  { id: 'search-visibility', title: 'SEO, AEO and GEO for business websites', copy: 'Start with your buyers’ questions and a measured search baseline. We connect technical SEO, useful content, internal links and AI search visibility with enquiry and revenue reporting.', scope: 'For businesses evaluating an SEO agency, an AI search audit or ongoing organic growth support. Scope and measurement are agreed before work begins.', links: [{label:'Understand GEO and AI visibility',href:'/blog/generative-engine-optimization-geo'},{label:'Compare AEO with SEO',href:'/blog/answer-engine-optimization-aeo'}] },
  { id: 'manufacturer-growth', title: 'Manufacturing SEO and qualified enquiry systems', copy: 'Connect your products, capabilities and applications to relevant buyer searches. Make specifications readable, improve the RFQ path and route enquiries into a sales follow-up system.', scope: 'For manufacturers and exporters with established products and delivery capacity. Measure qualified enquiries and sales progress alongside search visibility.', links: [{label:'Industrial B2B lead generation',href:'/blog/industrial-b2b-lead-generation-india'},{label:'Export enquiry workflows',href:'/blog/industrial-exporter-enquiry-system-india'}] },
  { id: 'd2c-growth', title: 'D2C organic growth and conversion systems', copy: 'Connect ecommerce discovery with product information, a working checkout, customer follow-up and clear attribution. Diagnose traffic quality and conversion friction before scaling content.', scope: 'For established D2C brands seeking organic acquisition and a connected sales operation. Selective revenue-share partnerships depend on fit and agreed terms.', links: [{label:'Diagnose traffic without sales',href:'/blog/d2c-store-traffic-no-sales'},{label:'Understand checkout recovery',href:'/blog/whatsapp-abandoned-checkout-recovery-india'}] },
];
const deliverables = [
 { title: 'Technical SEO audit and fixes', copy: 'Crawling, indexing, canonical tags, redirects, page speed, mobile layout and structured data, checked in Search Console and fixed in order of impact.' },
 { title: 'Keyword and buyer-question map', copy: 'The searches and questions your buyers use, grouped by intent, with one owner page for each so your pages do not compete with each other.' },
 { title: 'Service, product and category pages', copy: 'Titles, headings, copy and comparison tables that answer the buyer’s question early and lead to an enquiry or order.' },
 { title: 'Guides and content clusters', copy: 'In-depth guides on the problems your buyers search for, linked to the pages that sell, with sources and dates.' },
 { title: 'AEO and GEO', copy: 'Answer-first sections, consistent business facts across the web and tracking of how AI answers from Google, ChatGPT and Perplexity describe you.' },
 { title: 'Internal links and authority', copy: 'Links from your strongest pages to the ones that need to rank, plus genuine mentions on directories, client sites and industry publications.' },
 { title: 'Measurement and reporting', copy: 'Search Console clicks and impressions, page-level rankings, AI visibility, saved enquiries and revenue kept as separate numbers.' },
 { title: 'Website and conversion fixes', copy: 'Forms, WhatsApp and RFQ paths, checkout and follow-up, so the traffic that arrives can turn into enquiries and sales.' },
];
const steps = [
 'Baseline: we read your Search Console, analytics and site, and record where clicks, impressions and enquiries stand today.',
 'Plan: we map buyer searches and questions to pages, list technical fixes and agree the scope, measurement and responsibilities in writing.',
 'Fix and build: technical issues first, then the pages closest to page one, then new pages and guides for gaps.',
 'Authority: internal links, then genuine external mentions and listings.',
 'Measure and adjust: monthly reporting on clicks, rankings, AI visibility and enquiries, and a change of plan when the numbers say so.',
];
const pricing = [
 ['Monthly retainer', 'A fixed monthly fee for an agreed scope of SEO work.', 'Businesses that want steady, ongoing work and can fund it from day one.'],
 ['Project fee', 'A one-time fee for a defined job, such as an audit, a migration or a set of pages.', 'A specific problem with a clear end point.'],
 ['Revenue share', 'No upfront agency fee or retainer; an agreed share of the revenue the work produces, under written measurement rules.', 'Selected partners with products, margins and fulfilment that can support it.'],
];
export const servicesFaqs = [
 { question: 'What is included in GrowwStack’s SEO services?', answer: 'Technical SEO, a keyword and buyer-question map, page and content work, AEO and GEO for AI answers, internal links and authority building, and reporting on clicks, rankings and enquiries. Website and conversion fixes are included where they stop traffic turning into enquiries. The exact scope is agreed in writing for each business.' },
 { question: 'How much do SEO services cost in India?', answer: 'SEO in India is usually priced as a monthly retainer, a one-time project fee or, less often, a revenue share. The cost depends on the number of pages, how much content is needed, technical fixes and how competitive your market is. GrowwStack offers a no-upfront revenue-share model to selected partners; other work is quoted on scope.' },
 { question: 'How long do SEO services take to show results?', answer: 'Fixes to pages that already appear in search, such as clearer titles and answers, can lift clicks within weeks. New pages and competitive head terms usually take several months, because Google has to crawl, index and trust them. We report progress monthly so you can see what is moving.' },
 { question: 'Do you guarantee first-page rankings?', answer: 'No. No agency controls Google’s rankings or AI answers, and a guarantee is a warning sign. We agree a baseline, a plan and the measures that matter, such as clicks, rankings for agreed terms and enquiries, and report them honestly.' },
 { question: 'Do you offer e-commerce SEO?', answer: 'Yes. For online stores we work on category and product pages, structured data, site speed, internal links and the path from product page to checkout, and we measure orders and revenue alongside traffic.' },
 { question: 'What do you need from us to start?', answer: 'Access to Google Search Console and analytics, your website or its admin, and an hour with someone who knows your products, customers and margins. For a revenue-share partnership we also agree the revenue definition and how it will be measured.' },
];
export function SearchServices() {
 const ld = {'@context':'https://schema.org','@graph':[...services.map(service=>({'@type':'Service','@id':`${origin}/services#${service.id}-service`,name:service.title,description:service.copy,url:`${origin}/services#${service.id}`,provider:{'@id':`${origin}/#organization`},areaServed:{'@type':'Country',name:'India'}})),{'@type':'FAQPage','@id':`${origin}/services#faq`,mainEntity:servicesFaqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))}]};
 return <div className="gs-minimal gs-container">
  <section className="gs-minimal__section" id="seo-services-india" aria-labelledby="seo-services-answer-title">
   <h2 id="seo-services-answer-title">What our SEO services in India include</h2>
   <p className="gs-minimal__answer">GrowwStack’s SEO services help Indian businesses get more organic traffic from Google, Bing and AI answers, and turn it into enquiries and sales. We fix technical problems, map the searches your buyers make to the right pages, improve and write those pages, build authority and report clicks, rankings and enquiries separately. Organic only: we do not run paid ads.</p>
   <div className="gs-minimal__faq">{deliverables.map(item=><article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
  </section>
  {services.map(service=><section key={service.id} id={service.id} className="gs-minimal__section" aria-labelledby={`${service.id}-title`}>
   <h2 id={`${service.id}-title`}>{service.title}</h2>
   <div className="gs-minimal__columns"><article><p>{service.copy}</p><p>{service.scope}</p></article><article><h3>Explore the approach</h3>{service.links.map(link=><p key={link.href}><a href={link.href}>{link.label} →</a></p>)}</article><article><h3>Discuss your requirements</h3><p>Share your business, current website and acquisition challenge. We assess fit before proposing a scope.</p><a href="/contact">Start a conversation →</a></article></div>
  </section>)}
  <section className="gs-minimal__section" aria-labelledby="payment-model-question"><h2 id="payment-model-question">SEO, AEO and GEO with no upfront agency fee</h2><p>Our revenue-share partnership has no upfront agency fee or monthly retainer. We earn an agreed percentage when the work produces revenue. The scope, baseline, revenue definition and payment timing are agreed before starting. A new brand with zero organic traffic or online sales can be assessed alongside an established business; readiness, margins and fulfilment matter.</p><p><a href="/partnership#organic-growth">See the revenue-share search partnership →</a> · <a href="/blog/marketing-retainer-vs-revenue-share-cost">Compare payment models →</a></p></section>
  <section className="gs-minimal__section" id="seo-process" aria-labelledby="seo-process-title">
   <h2 id="seo-process-title">How an SEO engagement works</h2>
   <ol className="gs-minimal__steps">{steps.map(step=><li key={step}>{step}</li>)}</ol>
  </section>
  <section className="gs-minimal__section" id="seo-pricing" aria-labelledby="seo-pricing-title">
   <h2 id="seo-pricing-title">How SEO services are priced in India</h2>
   <p>Most agencies in India price SEO in one of three ways. Compare the written scope and deliverables, not only the monthly number. Our <a href="/blog/seo-cost-in-india">guide to SEO cost in India</a> explains what drives the price and what to ask.</p>
   <div className="gs-minimal__table-wrap"><table className="gs-minimal__table"><thead><tr><th scope="col">Model</th><th scope="col">How it works</th><th scope="col">Best for</th></tr></thead><tbody>{pricing.map(row=><tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div>
  </section>
  <section className="gs-minimal__section" id="faq" aria-labelledby="services-faq-title">
   <h2 id="services-faq-title">SEO services: frequently asked questions</h2>
   <div className="gs-minimal__faq">{servicesFaqs.map(item=><article key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></article>)}</div>
  </section>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(ld).replace(/</g,'\\u003c')}} />
 </div>;
}
