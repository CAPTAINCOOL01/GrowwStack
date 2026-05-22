import { motion } from "motion/react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Work", href: "#proof" },
  { label: "Services", href: "#services" },
  { label: "Plans", href: "#plans" },
  { label: "Contact", href: "#cta" },
];

const allLinks = [
  { label: "Home", href: "#hero" },
  { label: "Problem", href: "#pain" },
  { label: "Work", href: "#proof" },
  { label: "Metrics", href: "#metrics" },
  { label: "Services", href: "#services" },
  { label: "Journey", href: "#journey" },
  { label: "Plans", href: "#plans" },
  { label: "Contact", href: "#cta" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <motion.span
          className="text-electric font-bold tracking-widest text-sm cursor-pointer"
          style={{ fontFamily: "var(--font-mono)" }}
          onClick={() => handleNav("#hero")}
          whileHover={{ scale: 1.05 }}
        >
          GROWWSTACK
        </motion.span>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2">
          {navLinks.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              onClick={() => handleNav(link.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer border
                ${link.label === "Contact"
                  ? "bg-electric/20 border-electric/50 text-electric hover:bg-electric/30 shadow-[0_0_12px_rgba(0,255,136,0.2)]"
                  : "bg-white/5 border-white/10 text-neutral-muted hover:bg-white/10 hover:text-neutral hover:border-white/20"
                }
                backdrop-blur-md`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {link.label}
            </motion.button>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
            className="block w-5 h-0.5 bg-neutral"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1 }}
            className="block w-5 h-0.5 bg-neutral"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
            className="block w-5 h-0.5 bg-neutral"
          />
        </button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: menuOpen ? "auto" : 0, opacity: menuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden bg-black/60 backdrop-blur-xl border-t border-white/10"
      >
        <div className="px-4 py-4 flex flex-col gap-2">
          {allLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNav(link.href)}
              className={`w-full text-left px-4 py-3 rounded-lg text-xs uppercase tracking-wider border transition-all
                ${link.label === "Contact"
                  ? "bg-electric/20 border-electric/40 text-electric"
                  : "bg-white/5 border-white/10 text-neutral-muted hover:bg-white/10 hover:text-neutral"
                }
                backdrop-blur-md`}
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {link.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
