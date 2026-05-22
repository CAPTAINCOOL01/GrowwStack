import { motion } from "motion/react";
import { BarChart3, MousePointerClick, Search, MessageSquare } from "lucide-react";

const metrics = [
  {
    category: "SEO PERFORMANCE",
    icon: Search,
    stats: [
      { label: "Avg. Keyword Rankings", value: "Top 3", change: "+87 positions" },
      { label: "Organic Traffic Growth", value: "+1,247%", change: "12 months" },
      { label: "Domain Authority", value: "45-72", change: "avg increase" },
    ],
  },
  {
    category: "PAID ADVERTISING",
    icon: BarChart3,
    stats: [
      { label: "Cost Per Lead", value: "₹180–₹420", change: "vs. ₹1,200 industry avg" },
      { label: "ROAS", value: "4.7x", change: "average" },
      { label: "Click-Through Rate", value: "8.2%", change: "vs. 2.1% avg" },
    ],
  },
  {
    category: "WHATSAPP CONVERSION",
    icon: MessageSquare,
    stats: [
      { label: "Response Rate", value: "94%", change: "within 5 min" },
      { label: "Lead to Customer", value: "37%", change: "conversion" },
      { label: "Customer Satisfaction", value: "4.8/5", change: "avg rating" },
    ],
  },
  {
    category: "WEBSITE ENGAGEMENT",
    icon: MousePointerClick,
    stats: [
      { label: "Bounce Rate", value: "18%", change: "vs. 47% avg" },
      { label: "Time on Site", value: "4:23", change: "avg minutes" },
      { label: "Form Submissions", value: "+523%", change: "increase" },
    ],
  },
];

export function MetricsWallSection() {
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
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          [03] PERFORMANCE
        </motion.div>
      </div>

      {/* Performance indicator - top right */}
      <div className="hidden md:block absolute top-8 right-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2 h-2 bg-electric rounded-full"
          />
          <span
            className="text-xs text-neutral-muted uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            LIVE DATA
          </span>
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
            <span className="text-neutral">GROWTH</span>{" "}
            <span className="text-electric">METRICS</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Every channel optimized. Every dollar tracked. Every lead converted.
          </p>
        </motion.div>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {metrics.map((metric, index) => (
            <MetricPanel key={metric.category} {...metric} index={index} />
          ))}
        </div>

        {/* Bottom summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-block bg-industrial-surface/50 backdrop-blur-sm border border-electric/30 px-8 py-4 rounded-lg">
            <span
              className="text-sm text-neutral-muted"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              Average client growth across all metrics:{" "}
            </span>
            <span
              className="text-2xl text-electric ml-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              +287%
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetricPanel({
  category,
  icon: Icon,
  stats,
  index,
}: {
  category: string;
  icon: React.ElementType;
  stats: { label: string; value: string; change: string }[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="bg-industrial-surface/30 backdrop-blur-sm border border-neutral-dim/30 rounded-lg overflow-hidden hover:border-electric/40 transition-all group"
    >
      {/* Header */}
      <div className="border-b border-neutral-dim/30 p-6 bg-industrial-panel/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-industrial-surface rounded">
            <Icon className="w-5 h-5 text-electric" />
          </div>
          <span
            className="text-xs text-neutral-muted uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {category}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="p-6">
        <div className="space-y-6">
          {stats.map((stat, idx) => (
            <div key={stat.label} className={idx < stats.length - 1 ? 'pb-6 border-b border-neutral-dim/20' : ''}>
              <div
                className="text-xs text-neutral-muted uppercase tracking-wider mb-2"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {stat.label}
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <div
                  className="text-2xl md:text-3xl text-electric"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs text-neutral-muted text-right"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
