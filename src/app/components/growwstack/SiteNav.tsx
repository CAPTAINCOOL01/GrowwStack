import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { label: "Services", href: "#growth-stack" },
  { label: "Our work", href: "#partnerships" },
  { label: "About", href: "#founder" },
  { label: "Free build", href: "#offer", highlight: true },
  { label: "Blog", href: "/blog" },
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

        <div className="gs-nav__utilities">
          <ThemeToggle />
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
        </div>

        <nav className="gs-nav__menu" id="primary-navigation" aria-label="Primary navigation">
          <div className="gs-nav__links">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={item.highlight ? "gs-nav__link--free" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.highlight && <span className="gs-nav__free-dot" aria-hidden="true" />}
                {item.label}
              </a>
            ))}
          </div>
          <a className="gs-button gs-button--small gs-button--signal" href="#contact" onClick={() => setMenuOpen(false)}>
            Let’s talk
            <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
