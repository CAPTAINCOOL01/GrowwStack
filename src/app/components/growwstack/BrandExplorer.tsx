import { useId, useState } from "react";

const layers = [
  { name: "Attract", title: "Get discovered by the right people.", description: "Search, campaigns and outreach that turn attention into opportunity." },
  { name: "Convert", title: "Make every visit count.", description: "Websites, stores and sales systems that turn interest into customers." },
  { name: "Retain", title: "Give customers a reason to return.", description: "Follow-ups, automation and customer experiences that build repeat business." },
];

/** The brand's three bars become an explorable, non-rotating growth stack. */
export function BrandExplorer() {
  const [active, setActive] = useState(0);
  const detailId = useId();
  const hintId = useId();

  return (
    <figure className="gs-logo-explorer" aria-label="Explore the GrowwStack logo">
      <div className="gs-logo-explorer__eyebrow" aria-hidden="true">
        <span>One connected growth stack</span><span className="gs-logo-explorer__spark" />
      </div>
      <div className="gs-logo-explorer__stage" role="group" aria-label="Growth layers" aria-describedby={hintId}>
        <div className="gs-logo-explorer__guides" aria-hidden="true" />
        <div className="gs-logo-explorer__bars">
          {layers.map((layer, index) => (
            <button
              key={layer.name}
              className="gs-logo-explorer__bar"
              type="button"
              aria-label={layer.name}
              aria-pressed={active === index}
              aria-controls={detailId}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
            >
              <span className="gs-logo-explorer__bar-number" aria-hidden="true">0{index + 1}</span>
              <span className="gs-logo-explorer__bar-name">{layer.name}</span>
              <span className="gs-logo-explorer__bar-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <span className="gs-logo-explorer__signature" aria-hidden="true">GROWWSTACK / 03</span>
      </div>
      <figcaption className="gs-logo-explorer__caption">
        <div id={detailId} className="gs-logo-explorer__detail" aria-live="polite" aria-atomic="true">
          <span className="gs-logo-explorer__step" aria-hidden="true">0{active + 1} / 03</span>
          <div><strong>{layers[active].title}</strong><p>{layers[active].description}</p></div>
        </div>
        <p id={hintId} className="gs-logo-explorer__hint">Hover or tap a layer to explore <span aria-hidden="true">↑</span></p>
      </figcaption>
    </figure>
  );
}
