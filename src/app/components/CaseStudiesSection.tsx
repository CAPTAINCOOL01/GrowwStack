import { motion } from "motion/react";
import { ArrowUpRight, Calendar, TrendingUp } from "lucide-react";

const caseStudies = [
  {
    industry: "SPORTS & LIFESTYLE BRAND",
    company: "Camstar Sports",
    before: {
      state: "No digital presence, word-of-mouth only, 10 sales/month",
      metric: "₹2,55,000 / month",
    },
    after: {
      state: "Full brand system + SEO + Ads + WhatsApp funnel deployed",
      metric: "₹21,67,500 / month",
    },
    results: [
      { label: "Revenue Growth", value: "750%", period: "1 month" },
      { label: "Orders", value: "85/month", period: "from 10/month" },
      { label: "Avg Order Size", value: "₹25,500", period: "per order" },
    ],
  },
  {
    industry: "HEALTHCARE — DIAGNOSTIC CLINIC",
    company: "Healthcare Client",
    before: {
      state: "Walk-in only, no online booking, invisible on Google",
      metric: "₹1,40,000 / month",
    },
    after: {
      state: "Online booking system + local SEO + WhatsApp appointment funnel",
      metric: "₹5,60,000 / month",
    },
    results: [
      { label: "Revenue Growth", value: "300%", period: "3 months" },
      { label: "Appointments", value: "210/month", period: "from 54/month" },
      { label: "Google Rank", value: "#1", period: "local search" },
    ],
  },
];

export function CaseStudiesSection() {
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
          [02] PROOF
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
            <span className="text-neutral">BEFORE</span>
            <span className="text-neutral-muted mx-3">/</span>
            <span className="text-electric">AFTER</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Real transformations. Real numbers. Real clients.
          </p>
        </motion.div>

        {/* Case studies */}
        <div className="space-y-12 md:space-y-16">
          {caseStudies.map((study, index) => (
            <CaseStudyCard key={study.company} {...study} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseStudyCard({
  industry,
  company,
  before,
  after,
  results,
  index,
}: {
  industry: string;
  company: string;
  before: { state: string; metric: string };
  after: { state: string; metric: string };
  results: { label: string; value: string; period: string }[];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, duration: 0.8 }}
      className="bg-industrial-surface/30 backdrop-blur-sm border border-neutral-dim/30 rounded-lg overflow-hidden"
    >
      {/* Header */}
      <div className="border-b border-neutral-dim/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span
              className="text-xs text-neutral-muted uppercase tracking-wider block mb-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {industry}
            </span>
            <h3
              className="text-2xl md:text-3xl text-neutral"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {company}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-electric">
            <Calendar className="w-4 h-4" />
            <span className="text-sm" style={{ fontFamily: 'var(--font-mono)' }}>
              {results[0].period}
            </span>
          </div>
        </div>
      </div>

      {/* Before/After comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-neutral-dim/30">
        {/* Before */}
        <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-neutral-dim/30">
          <div className="mb-4">
            <span
              className="text-xs text-neutral-muted uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              BEFORE
            </span>
          </div>
          <p
            className="text-neutral-muted mb-4 text-sm md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {before.state}
          </p>
          <div
            className="text-xl md:text-2xl text-neutral line-through opacity-60"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {before.metric}
          </div>
        </div>

        {/* After */}
        <div className="p-6 md:p-8 bg-industrial-panel/30">
          <div className="mb-4 flex items-center gap-2">
            <span
              className="text-xs text-electric uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              AFTER
            </span>
            <ArrowUpRight className="w-4 h-4 text-electric" />
          </div>
          <p
            className="text-neutral mb-4 text-sm md:text-base"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            {after.state}
          </p>
          <div
            className="text-xl md:text-2xl text-electric"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {after.metric}
          </div>
        </div>
      </div>

      {/* Results metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        {results.map((result, idx) => (
          <div
            key={result.label}
            className={`p-6 md:p-8 ${
              idx < results.length - 1 ? 'border-b sm:border-b-0 sm:border-r border-neutral-dim/30' : ''
            }`}
          >
            <div
              className="text-xs text-neutral-muted uppercase tracking-wider mb-2"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {result.label}
            </div>
            <div
              className="text-2xl md:text-3xl text-electric mb-1"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {result.value}
            </div>
            <div
              className="text-xs text-neutral-muted"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {result.period}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
