import { CALENDLY_CALL, CONTACT_PHONE } from "../../../lib/config";

const comparison = [
  { label: "To start", usual: "Full fee upfront", ours: "₹0" },
  { label: "Every month", usual: "Retainer, regardless", ours: "₹0" },
  { label: "We are paid", usual: "On delivery", ours: "On growth" },
  { label: "If it does not work", usual: "You still pay", ours: "We earn nothing" },
  { label: "Who carries the risk", usual: "You", ours: "Us" },
];

const qualifiers = [
  "A product customers already pay for.",
  "Healthy margins and reliable delivery.",
  "An involved founder or decision-maker.",
];

export function FreeBuildOffer() {
  const waHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I think my business fits your free build offer.",
  )}`;

  return (
    <section className="gs-offer gs-offer--compact" id="offer" aria-labelledby="gs-offer-title">
      <div className="gs-container gs-offer__inner">
        <div className="gs-offer__copy">
        <p className="gs-eyebrow gs-eyebrow--light">The partnership model</p>

        <h2 className="gs-offer__title" id="gs-offer-title">
          We invest in the build.
          <span>We share in the growth.</span>
        </h2>

        <p className="gs-offer__lede">
          For selected businesses, we design, build, and operate your growth system with no upfront agency fee or monthly retainer. We earn a share of the measurable growth it produces.
        </p>

        <ul className="gs-offer__criteria">
          {qualifiers.map((item) => (
            <li key={item}>
              <span aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="gs-offer__terms">
          The share is agreed in writing before work begins, following business evaluation and mutual acceptance. Limited partnerships; no growth means no earnings for us.
        </p>

        <div className="gs-offer__actions">
          <a className="gs-button gs-button--signal" href="#build">
            See if you qualify
            <span aria-hidden="true"> ↗</span>
          </a>
          <a
            className="gs-button gs-button--ghost"
            href={CALENDLY_CALL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Book a 15-minute call
          </a>
          <a
            className="gs-button gs-button--ghost"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask on WhatsApp
          </a>
        </div>
        </div>

        <aside className="gs-offer__card" aria-labelledby="gs-offer-card-title">
          <p className="gs-offer__card-title" id="gs-offer-card-title">
            Where the risk sits
          </p>

          <ul className="gs-offer__compare">
            <li className="gs-offer__compare-head" aria-hidden="true">
              <span />
              <span>Usual way</span>
              <span>With us</span>
            </li>
            {comparison.map((row) => (
              <li key={row.label} className="gs-offer__compare-row">
                <span className="gs-offer__compare-label">{row.label}</span>
                <span className="gs-offer__compare-usual">{row.usual}</span>
                <span className="gs-offer__compare-ours">{row.ours}</span>
              </li>
            ))}
          </ul>

          <p className="gs-offer__card-foot">
            Built around proven products, healthy margins, and an involved business owner.
          </p>
        </aside>
      </div>
    </section>
  );
}
