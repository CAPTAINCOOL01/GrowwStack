import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Founder", href: "#founder" },
  { label: "Partnerships", href: "#partnerships" },
  { label: "Results", href: "#results" },
  { label: "Websites", href: "#build" },
];

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="gs-nav" data-scrolled={scrolled} data-open={menuOpen}>
      <div className="gs-container gs-nav__inner">
        <a className="gs-brand" href="#home" aria-label="GrowwStack home" onClick={() => setMenuOpen(false)}>
          <span className="gs-brand__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="gs-brand__word">GrowwStack</span>
          <span className="gs-brand__descriptor">Growth systems</span>
        </a>

        <button
          ref={toggleRef}
          className="gs-nav__toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
        </button>

        <nav className="gs-nav__menu" id="primary-navigation" aria-label="Primary navigation">
          <div className="gs-nav__links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
          </div>
          <a className="gs-button gs-button--small gs-button--dark" href="#apply" onClick={() => setMenuOpen(false)}>
            Apply to partner
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
