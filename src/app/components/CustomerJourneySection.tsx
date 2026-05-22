import { motion } from "motion/react";

const milestones = [
  {
    phase: "WEEK 1–2",
    label: "DIAGNOSIS",
    description:
      "Deep audit of your current presence, competitors, and industry pain points. We identify exactly where leads are leaking and what it's costing you per month.",
    signal: "AUDIT COMPLETE",
  },
  {
    phase: "WEEK 3–4",
    label: "FOUNDATION",
    description:
      "Website built and launched. SEO infrastructure activated. WhatsApp funnel mapped, scripted, and deployed. You go from invisible to operational.",
    signal: "SYSTEM LIVE",
  },
  {
    phase: "MONTH 2",
    label: "IGNITION",
    description:
      "Ad campaigns launch. Organic content strategy activated. First lead data starts flowing in. Every channel instrumented and tracked.",
    signal: "LEADS FLOWING",
  },
  {
    phase: "MONTH 3",
    label: "ACCELERATION",
    description:
      "Performance data reviewed against baseline. Systems optimized for conversion. Ad spend calibrated to ROAS. WhatsApp scripts refined.",
    signal: "OPTIMISING",
  },
  {
    phase: "MONTH 4–6",
    label: "COMPOUNDING",
    description:
      "Organic traffic compounds. Ads optimized. WhatsApp pipeline consistently full. Your business looks and operates like the market leader in your category.",
    signal: "MARKET LEADER",
  },
];

export function CustomerJourneySection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
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
          [05] JOURNEY
        </motion.div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-neutral">FROM INVISIBLE</span>
            <br />
            <span className="text-electric">TO UNDENIABLE.</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Here is exactly what happens when we build your growth system — milestone by milestone.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[22px] md:left-1/2 top-0 bottom-0 w-px bg-neutral-dim/30 transform md:-translate-x-1/2" />

          <div className="space-y-10 md:space-y-12">
            {milestones.map((milestone, index) => (
              <MilestoneItem
                key={milestone.label}
                {...milestone}
                index={index}
                isRight={index % 2 !== 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MilestoneItem({
  phase,
  label,
  description,
  signal,
  index,
  isRight,
}: {
  phase: string;
  label: string;
  description: string;
  signal: string;
  index: number;
  isRight: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative flex items-start gap-6 md:gap-0 ${
        isRight ? "md:flex-row-reverse" : "md:flex-row"
      }`}
    >
      {/* Content */}
      <div className={`flex-1 pl-12 md:pl-0 ${isRight ? "md:pl-12" : "md:pr-12"}`}>
        <div
          className={`bg-industrial-surface/30 backdrop-blur-sm border border-neutral-dim/30 rounded-lg p-6 hover:border-electric/40 transition-all group ${
            isRight ? "md:ml-8" : "md:mr-8"
          }`}
        >
          {/* Phase + signal */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="text-xs text-neutral-muted uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {phase}
            </span>
            <span
              className="text-xs text-electric uppercase tracking-wider"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ● {signal}
            </span>
          </div>

          {/* Label */}
          <h3
            className="text-xl md:text-2xl text-neutral mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {label}
          </h3>

          {/* Description */}
          <p
            className="text-neutral-muted text-sm md:text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {description}
          </p>
        </div>
      </div>

      {/* Center dot — desktop */}
      <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
          className="w-4 h-4 bg-electric rounded-full border-2 border-industrial-dark"
        />
      </div>

      {/* Mobile dot */}
      <div className="absolute left-0 top-6 flex md:hidden items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.15 + 0.2, duration: 0.4 }}
          className="w-4 h-4 bg-electric rounded-full border-2 border-industrial-dark"
        />
      </div>

      {/* Empty space for alternating layout on desktop */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}
