import { CONTACT_PHONE } from "../../../lib/config";

const qualifiers = [
  "The product solves a problem people already pay to solve.",
  "The foundations are real — margins, delivery, and something to sell.",
  "You are the operator, not looking for one to replace you.",
];

export function FreeBuildOffer() {
  const waHref = `https://wa.me/${CONTACT_PHONE}?text=${encodeURIComponent(
    "Hi GrowwStack, I think my business fits your free build offer.",
  )}`;

  return (
    <section className="gs-offer" id="offer" aria-labelledby="gs-offer-title">
      <div className="gs-container gs-offer__inner">
        <p className="gs-eyebrow gs-eyebrow--light">No fee. A share of what it earns.</p>

        <h2 className="gs-offer__title" id="gs-offer-title">
          If the product is good,
          <span>we build it for free.</span>
        </h2>

        <p className="gs-offer__lede">
          Strong foundations and a product worth buying are all we ask for upfront. We design,
          engineer and operate the whole system at no cost to you — and take a small cut of the
          growth it produces. If it earns nothing, we earn nothing.
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
          The cut is agreed in writing before anything starts, and it is only ever a share of growth
          we can measure. We take a limited number of these at a time, and we say no far more often
          than yes.
        </p>

        <div className="gs-offer__actions">
          <a className="gs-button gs-button--signal" href="#build">
            See if you qualify
            <span aria-hidden="true"> ↗</span>
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
    </section>
  );
}
