import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Base date: May 22 2026 = day 454. Every day after adds 1.
const BASE_DAYS = 454;
const BASE_DATE = new Date("2026-05-22").getTime();

function getDaysCount() {
  const today = new Date().setHours(0, 0, 0, 0);
  const diff = Math.floor((today - BASE_DATE) / (1000 * 60 * 60 * 24));
  return BASE_DAYS + Math.max(0, diff);
}

export function HeroSection() {
  const [metrics, setMetrics] = useState({
    revenue: 0,
    leads: 0,
    visibility: 0,
    traffic: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMetrics({
        revenue: 207,
        leads: getDaysCount(),
        visibility: 1240,
        traffic: 378,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 md:px-8 pt-16">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Edge data panels - Desktop only */}
      <div className="hidden md:block absolute top-8 left-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="bg-industrial-surface/80 backdrop-blur-sm border border-neutral-dim/30 px-4 py-3 rounded"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-xs text-neutral-muted uppercase tracking-wider">System Status</div>
          <div className="text-sm text-electric mt-1">OPERATIONAL</div>
        </motion.div>
      </div>

      <div className="hidden md:block absolute top-8 right-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-industrial-surface/80 backdrop-blur-sm border border-neutral-dim/30 px-4 py-3 rounded text-right"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-xs text-neutral-muted uppercase tracking-wider">Active Clients</div>
          <div className="text-sm text-electric mt-1">3</div>
        </motion.div>
      </div>

      {/* Center content */}
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Before/After transformation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-12"
        >
          <div className="inline-block bg-industrial-surface/50 backdrop-blur-sm border border-electric/30 px-6 py-2 rounded-full mb-8">
            <span className="text-electric" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
              GROWWSTACK
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl leading-none mb-8"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-neutral-muted line-through block mb-2">INVISIBLE</span>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-neutral block"
            >
              UNSTOPPABLE
            </motion.span>
          </h1>
        </motion.div>

        {/* Live metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto mb-12"
        >
          <MetricCard
            label="Avg. Revenue Growth"
            value={metrics.revenue}
            suffix="%"
            delay={1.2}
          />
          <MetricCard
            label="Days in the Game"
            value={metrics.leads}
            suffix="+"
            delay={1.4}
          />
          <MetricCard
            label="Avg. Visibility Increase"
            value={metrics.visibility}
            suffix="%"
            delay={1.6}
          />
          <MetricCard
            label="Avg. Live Traffic / Client"
            value={metrics.traffic}
            suffix="/day"
            delay={1.8}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="text-neutral-muted max-w-2xl mx-auto mb-12 text-base md:text-lg"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Turn manufacturing, production, and healthcare businesses into market-dominating brands with proof-driven growth systems.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-neutral-dim"
          >
            <ArrowRight className="w-6 h-6 rotate-90" />
          </motion.div>
        </motion.div>
      </div>

      {/* Full-time clients panel - top center */}
      <div className="hidden md:block absolute top-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="bg-industrial-surface/80 backdrop-blur-sm border border-neutral-dim/30 px-4 py-3 rounded text-center"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-xs text-neutral-muted uppercase tracking-wider">Clients Served</div>
          <div className="text-sm text-neutral mt-1">8</div>
        </motion.div>
      </div>

      {/* Bottom edge panels - Desktop only */}
      <div className="hidden md:block absolute bottom-8 left-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-industrial-surface/80 backdrop-blur-sm border border-neutral-dim/30 px-4 py-3 rounded"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-xs text-neutral-muted uppercase tracking-wider">Avg. Growth</div>
          <div className="text-sm text-electric mt-1">287% / 6mo</div>
        </motion.div>
      </div>

      <div className="hidden md:block absolute bottom-8 right-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="bg-industrial-surface/80 backdrop-blur-sm border border-neutral-dim/30 px-4 py-3 rounded text-right"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          <div className="text-xs text-neutral-muted uppercase tracking-wider">Industries</div>
          <div className="text-sm text-neutral mt-1">MFG / PRD / HC</div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricCard({ label, value, suffix, delay }: { label: string; value: number; suffix: string; delay: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (value === 0) return;

    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="bg-industrial-surface/50 backdrop-blur-sm border border-electric/30 p-6 rounded-lg relative overflow-hidden group hover:border-electric/60 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-electric-glow to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10">
        <div className="text-xs text-neutral-muted uppercase tracking-wider mb-2" style={{ fontFamily: 'var(--font-mono)' }}>
          {label}
        </div>
        <div className="text-3xl md:text-4xl text-electric" style={{ fontFamily: 'var(--font-mono)' }}>
          {displayValue}{suffix}
        </div>
      </div>
    </motion.div>
  );
}
