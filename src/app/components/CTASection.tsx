import { motion } from "motion/react";
import { useState } from "react";

export function CTASection() {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseLeave = () => {
    setHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 overflow-hidden">
      {/* Background pulse */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.03, 0.07, 0.03] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="absolute inset-0 bg-electric rounded-full blur-[200px] pointer-events-none"
      />

      {/* Section label */}
      <div className="absolute top-8 left-4 md:left-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs text-neutral-muted uppercase tracking-wider"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          [07] ACTION
        </motion.div>
      </div>

      {/* Edge data panels */}
      <div className="hidden md:block absolute top-8 right-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center gap-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-electric rounded-full"
          />
          <span className="text-xs text-electric uppercase tracking-wider">GROWWSTACK — ACCEPTING CLIENTS</span>
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Urgency label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-industrial-surface/50 border border-electric/30 px-4 py-2 rounded-full mb-10"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <span className="text-xs text-neutral-muted uppercase tracking-wider">
            Every day without a system is a day your competitors gain ground
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-5xl sm:text-6xl md:text-8xl leading-none mb-8"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="text-neutral">YOUR COMPETITORS</span>
          <br />
          <span className="text-electric">ARE NOT WAITING.</span>
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-neutral-muted max-w-xl mx-auto text-base md:text-lg mb-14"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Every day without a real growth system is a day your best leads go somewhere else. Let's
          fix that.
        </motion.p>

        {/* Magnetic CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex justify-center"
        >
          <motion.a
            href="https://wa.me/917017138349?text=Hi%2C%20I%20want%20a%20free%20business%20diagnosis"
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left - rect.width / 2;
              const y = e.clientY - rect.top - rect.height / 2;
              const distance = Math.sqrt(x * x + y * y);
              const maxDistance = 40;
              if (distance < maxDistance + 60) {
                setMousePos({
                  x: (x / (maxDistance + 60)) * maxDistance,
                  y: (y / (maxDistance + 60)) * maxDistance,
                });
              }
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={handleMouseLeave}
            animate={{
              x: mousePos.x,
              y: mousePos.y,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative group bg-electric text-industrial-dark px-10 py-5 rounded-lg font-bold uppercase tracking-widest text-sm overflow-hidden cursor-pointer inline-block"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              className="absolute inset-0 bg-white/20 rounded-lg"
            />
            <span className="relative z-10">START THE AUDIT</span>
          </motion.a>
        </motion.div>

        {/* Sub note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-6 text-neutral-muted text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Free 30-minute business diagnosis. No pitch. Just clarity on what's costing you leads
          right now.
        </motion.p>
      </div>

      {/* Footer line */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-neutral-dim text-xs"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          GROWWSTACK — Built for businesses that are serious offline and ready to be undeniable online.
        </motion.p>
      </div>
    </section>
  );
}
