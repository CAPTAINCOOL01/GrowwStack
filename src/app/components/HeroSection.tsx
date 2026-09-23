import { BrandExplorer } from "./growwstack/BrandExplorer";

const proofPoints = [
  { value: "3", label: "Active partner brands" },
  { value: "₹1.5 Cr", label: "Partner revenue · 3 months" },
  { value: "₹1.5 Cr", label: "E-commerce · from ₹0 in 110 days" },
  { value: "₹0", label: "Upfront agency fee · selected partners" },
];

export function HeroSection() {
  return (
    <section className="gs-hero" id="home" aria-labelledby="hero-title">
      <div className="gs-container gs-hero__layout">
        <div className="gs-hero__copy">
          <p className="gs-eyebrow gs-eyebrow--light">
            <span className="gs-status-dot" aria-hidden="true" />
            Founder-led growth partnerships
          </p>
          <h1 id="hero-title">Good businesses.<br /><span>Built to grow.</span></h1>
          <p className="gs-hero__lede">
            Websites, customer acquisition, and sales systems—built and operated
            together. One partner, from first visit to repeat revenue.
          </p>
          <div className="gs-hero__actions">
            <a className="gs-button gs-button--signal" href="#contact">
              Let’s talk growth <span aria-hidden="true">↗</span>
            </a>
            <a className="gs-button gs-button--outline-light" href="#partnerships">
              See our work <span aria-hidden="true">→</span>
            </a>
          </div>
          <p className="gs-hero__note">
            Selected partners pay no upfront agency fee. <a href="#offer">How it works ↗</a>
          </p>
        </div>
        <BrandExplorer />
      </div>
      <div className="gs-container gs-proof-strip" aria-label="GrowwStack proof points">
        {proofPoints.map((point) => (
          <div className="gs-proof-strip__item" key={point.label}>
            <strong>{point.value}</strong>
            <span>{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
