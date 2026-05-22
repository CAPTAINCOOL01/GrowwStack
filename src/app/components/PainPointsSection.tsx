import { motion } from "motion/react";
import { AlertTriangle, TrendingDown, Users } from "lucide-react";

const painPoints = [
  {
    icon: AlertTriangle,
    industry: "MANUFACTURING",
    problem: "Invisible to procurement teams",
    impact: "Lost contracts to competitors with basic websites",
    stat: "73% of buyers never see you",
  },
  {
    icon: TrendingDown,
    industry: "PRODUCTION",
    problem: "No digital presence",
    impact: "Referrals dry up, growth stalls at current capacity",
    stat: "0 inbound leads/month",
  },
  {
    icon: Users,
    industry: "HEALTHCARE",
    problem: "Outdated patient acquisition",
    impact: "Competitors dominate local search, steal market share",
    stat: "-47% patient growth YoY",
  },
];

export function PainPointsSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20">
      {/* Section label - top left */}
      <div className="absolute top-8 left-4 md:left-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs text-neutral-muted uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          [01] DIAGNOSTIC
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
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-neutral">THE</span>{" "}
            <span className="text-electric">PROBLEM</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            You build things that matter. But online, you don't exist.
          </p>
        </motion.div>

        {/* Pain points grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {painPoints.map((point, index) => (
            <PainPointCard key={point.industry} {...point} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PainPointCard({
  icon: Icon,
  industry,
  problem,
  impact,
  stat,
  index,
}: {
  icon: React.ElementType;
  industry: string;
  problem: string;
  impact: string;
  stat: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.6 }}
      className="bg-industrial-surface/30 backdrop-blur-sm border border-neutral-dim/30 p-6 md:p-8 rounded-lg hover:border-electric/40 transition-all group"
    >
      {/* Industry label */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-industrial-panel rounded">
          <Icon className="w-5 h-5 text-electric" />
        </div>
        <span
          className="text-xs text-neutral-muted uppercase tracking-wider"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {industry}
        </span>
      </div>

      {/* Problem statement */}
      <h3
        className="text-xl md:text-2xl text-neutral mb-4 leading-tight"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {problem}
      </h3>

      {/* Impact */}
      <p
        className="text-neutral-muted mb-6 text-sm md:text-base leading-relaxed"
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {impact}
      </p>

      {/* Stat */}
      <div className="pt-4 border-t border-neutral-dim/30">
        <div
          className="text-2xl md:text-3xl text-electric group-hover:text-electric/80 transition-colors"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {stat}
        </div>
      </div>
    </motion.div>
  );
}
