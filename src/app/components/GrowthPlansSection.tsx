import { motion } from "motion/react";

const plans = [
  {
    id: "01",
    name: "FOUNDATION",
    for: "Businesses with zero or broken digital presence",
    delivers: ["Custom website built from scratch", "SEO infrastructure setup", "WhatsApp conversion funnel"],
    signal: "START HERE",
    highlight: false,
  },
  {
    id: "02",
    name: "GROWTH",
    for: "Businesses with a presence but no consistent leads",
    delivers: [
      "Full system audit + diagnosis",
      "Google + Meta ad campaigns",
      "Conversion rate optimization",
      "Monthly performance reviews",
    ],
    signal: "MOST CHOSEN",
    highlight: true,
  },
  {
    id: "03",
    name: "DOMINANCE",
    for: "Businesses ready to own their category online",
    delivers: [
      "Complete brand system rebuild",
      "All four engines running simultaneously",
      "Weekly strategy sessions",
      "Competitor displacement strategy",
    ],
    signal: "MARKET LEADER",
    highlight: false,
  },
  {
    id: "04",
    name: "GMAIL OUTREACH",
    for: "Businesses that want direct B2B leads in their inbox",
    delivers: [
      "Targeted cold email campaigns",
      "Industry-specific prospect lists",
      "Automated follow-up sequences",
      "Open rate & reply tracking",
    ],
    signal: "HIGH INTENT LEADS",
    highlight: false,
  },
];

export function GrowthPlansSection() {
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
          [06] STRATEGY
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
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
            <span className="text-neutral">YOU DON'T NEED</span>
            <br />
            <span className="text-electric">MORE EFFORT.</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every growth plan is built around your industry, your buyer, and your current gap — not
            a generic package.
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {plans.map((plan, index) => (
            <PlanCard key={plan.id} {...plan} index={index} />
          ))}
        </div>

        {/* Pricing note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <p
            className="text-neutral-muted text-sm"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Every plan is scoped after a real conversation.{" "}
            <span className="text-neutral">No pricing on this page</span> — because your business
            isn't a template.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function PlanCard({
  id,
  name,
  for: forText,
  delivers,
  signal,
  highlight,
  index,
}: {
  id: string;
  name: string;
  for: string;
  delivers: string[];
  signal: string;
  highlight: boolean;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className={`relative bg-industrial-surface/30 backdrop-blur-sm border rounded-lg overflow-hidden transition-all group ${
        highlight
          ? "border-electric/50 shadow-[0_0_30px_rgba(0,255,136,0.1)]"
          : "border-neutral-dim/30 hover:border-electric/40"
      }`}
    >
      {/* Highlight glow */}
      {highlight && (
        <div className="absolute inset-0 bg-gradient-to-b from-electric/5 to-transparent pointer-events-none" />
      )}

      {/* Header */}
      <div
        className={`border-b p-6 ${
          highlight ? "border-electric/30 bg-electric/5" : "border-neutral-dim/30 bg-industrial-panel/30"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs text-neutral-muted uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {id}
          </span>
          <span
            className={`text-xs uppercase tracking-wider ${
              highlight ? "text-electric" : "text-neutral-dim"
            }`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ● {signal}
          </span>
        </div>
        <h3
          className={`text-2xl md:text-3xl ${highlight ? "text-electric" : "text-neutral"}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {name}
        </h3>
      </div>

      {/* For */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="text-xs text-neutral-muted uppercase tracking-wider mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          FOR
        </div>
        <p
          className="text-neutral text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {forText}
        </p>
      </div>

      {/* Delivers */}
      <div className="px-6 pb-8">
        <div
          className="text-xs text-neutral-muted uppercase tracking-wider mb-4"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          DELIVERS
        </div>
        <div className="space-y-3">
          {delivers.map((item) => (
            <div
              key={item}
              className="flex items-start gap-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className={`text-xs mt-0.5 ${highlight ? "text-electric" : "text-neutral-dim"}`}>
                ▸
              </span>
              <span className="text-xs text-neutral-muted uppercase tracking-wider leading-relaxed">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
