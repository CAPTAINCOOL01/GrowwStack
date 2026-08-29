import { motion, useReducedMotion } from "motion/react";

const growthLayers = [
  { code: "L6", name: "Revenue intelligence", detail: "Measure" },
  { code: "L5", name: "CRM & automation", detail: "Nurture" },
  { code: "L4", name: "Sales infrastructure", detail: "Close" },
  { code: "L3", name: "Conversion systems", detail: "Convert" },
  { code: "L2", name: "Customer acquisition", detail: "Acquire" },
  { code: "L1", name: "Digital presence", detail: "Foundation" },
];

const proofPoints = [
  { value: "3", label: "Active brands" },
  { value: "₹1.5 Cr", label: "Generated in 3 months" },
  { value: "3", label: "Industries" },
  { value: "₹0", label: "Upfront agency fee" },
];

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="gs-hero" id="home" aria-labelledby="hero-title">
      <div className="gs-hero__grid" aria-hidden="true" />
      <div className="gs-hero__orb" aria-hidden="true" />

      <div className="gs-container gs-hero__layout">
        <motion.div
          className="gs-hero__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="gs-eyebrow gs-eyebrow--light">
            <span className="gs-status-dot" aria-hidden="true" />
            Selective growth partnerships · India
          </div>

          <h1 id="hero-title">
            We build growth systems for <span>promising brands.</span>
          </h1>

          <p className="gs-hero__lede">
            GrowwStack partners with ambitious businesses to build and operate the technology, acquisition,
            conversion, sales, automation, and intelligence required to scale.
          </p>

          <p className="gs-hero__credibility">
            Founded by a <strong>BITS Pilani postgraduate and Gold Medalist</strong> with experience across
            Atomberg Technologies, Ecozen Solutions, Dover Corporation, deep tech, and e-commerce growth.
          </p>

          <div className="gs-hero__actions">
            <a className="gs-button gs-button--signal" href="#apply">
              Apply for a growth partnership
              <span aria-hidden="true">↗</span>
            </a>
            <a className="gs-text-link gs-text-link--light" href="#partnerships">
              Explore active partnerships
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </motion.div>

        <motion.figure
          className="gs-stack-figure"
          initial={reduceMotion ? false : { opacity: 0, x: 36 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          aria-labelledby="stack-title"
        >
          <div className="gs-stack-figure__header">
            <div>
              <span>Operating model</span>
              <strong id="stack-title">The Growth Stack</strong>
            </div>
            <span className="gs-stack-figure__status">Founder-led</span>
          </div>

          <div className="gs-stack-figure__body">
            <div className="gs-stack-figure__rail" aria-hidden="true">
              <span />
            </div>
            <div className="gs-stack-layers">
              {growthLayers.map((layer, index) => (
                <motion.div
                  className="gs-stack-layer"
                  key={layer.code}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 + index * 4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + index * 0.08, duration: 0.55 }}
                >
                  <span className="gs-stack-layer__code">{layer.code}</span>
                  <span className="gs-stack-layer__name">{layer.name}</span>
                  <span className="gs-stack-layer__detail">{layer.detail}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <figcaption>
            Six connected systems. One accountable partner.
            <span>Designed around the business—not a template.</span>
          </figcaption>
        </motion.figure>
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
