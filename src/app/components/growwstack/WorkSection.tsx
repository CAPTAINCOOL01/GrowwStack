import { brandId, partnerBrands, otherBrandWork, ndaNote } from "../../../content/company";

export function WorkSection() {
  return <div className="gs-minimal gs-company-page gs-container" id="partnerships">
    <header className="gs-company-page__intro"><p className="gs-eyebrow">Our work</p><h1>Different brands.<br />One connected growth system.</h1><p>From custom stores to search strategy and sales tools. Each engagement starts with what the business needs.</p></header>
    <p className="gs-minimal__proof"><strong>₹2.5 Cr+</strong> in revenue closed across partner brands in five months, with ₹0 spent on ads.<small>May–October 2026 · Across partner brands</small></p>
    <div className="gs-work-grid">{partnerBrands.map(brand => <article key={brand.name} id={brandId(brand.name)}><p className="gs-eyebrow">{brand.sector}</p><h2>{brand.name}</h2><p>{brand.summary}</p>{brand.name !== "Viva Fitness" && <a href={brand.href} {...(brand.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{brand.link} ↗</a>}</article>)}</div>
    <section className="gs-minimal__section" id="other-brands" aria-labelledby="more-work"><h2 id="more-work">Other brands</h2><p className="gs-company-page__muted">{ndaNote}</p><div className="gs-work-grid gs-work-grid--anonymous">{otherBrandWork.map(work => <article key={work.sector}><h3>{work.sector}</h3><p>{work.summary}</p></article>)}</div><p className="gs-company-page__muted">And many more across healthcare and technical B2B businesses.</p><div className="gs-minimal__actions"><a href="/case-studies/healthcare-clinic-growth">Healthcare case study →</a><a href="/case-studies/deep-tech-b2b-expansion">Deep-tech case study →</a></div></section>
    <section className="gs-minimal__contact"><h2>See what we could build for you.</h2><a className="gs-button gs-button--signal" href="/contact">Let’s talk ↗</a></section>
  </div>;
}
