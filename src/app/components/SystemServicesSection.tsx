import { motion } from "motion/react";
import { Globe, Search, Megaphone, MessageSquare, ArrowRight, Users, Mail } from "lucide-react";

const services = [
  {
    id: "01",
    icon: Globe,
    name: "WEBSITE",
    role: "The Foundation",
    description:
      "Built to rank, convert, and signal credibility the moment a serious buyer lands. Not a template. A system engineered around your industry and buyer.",
    outputs: ["SEO-ready architecture", "Mobile-first responsive", "Conversion-optimized layout"],
  },
  {
    id: "02",
    icon: Search,
    name: "SEO",
    role: "The Long Game",
    description:
      "Organic traffic that compounds every month without paying per click. Your competitors are being found. You should be too.",
    outputs: ["Keyword dominance strategy", "Technical SEO audit", "Content authority system"],
  },
  {
    id: "03",
    icon: Megaphone,
    name: "ADS",
    role: "The Precision Strike",
    description:
      "Targeted performance campaigns that reach your exact buyer — not everyone. Only the ones worth closing. Every rupee tracked.",
    outputs: ["Google + Meta campaigns", "Industry-specific targeting", "ROAS-optimized spend"],
  },
  {
    id: "04",
    icon: MessageSquare,
    name: "WHATSAPP",
    role: "The Conversion Engine",
    description:
      "The fastest-converting channel in India. A structured funnel that turns inquiries into confirmed clients before they lose interest.",
    outputs: ["Automated lead nurturing", "94% response rate system", "37% lead-to-client conversion"],
  },
  {
    id: "05",
    icon: Mail,
    name: "GMAIL OUTREACH",
    role: "The Direct Line",
    description:
      "Targeted cold email campaigns that land directly in your prospect's inbox. Industry-specific lists, automated follow-ups, and tracked replies — B2B leads on autopilot.",
    outputs: ["Targeted prospect lists", "Automated follow-up sequences", "Open & reply rate tracking"],
  },
  {
    id: "06",
    icon: Users,
    name: "SALES AGENTS",
    role: "The Human Edge",
    description:
      "We deploy specialized, trained sales agents who handle your leads end-to-end — follow-ups, negotiations, and closings. You focus on the business. We close the deals.",
    outputs: ["Dedicated closing agents", "Industry-trained professionals", "Full pipeline management"],
  },
];

export function SystemServicesSection() {
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
          [04] SYSTEM
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2
            className="text-4xl sm:text-5xl md:text-7xl leading-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="text-neutral">NOT SERVICES.</span>
            <br />
            <span className="text-electric">A SYSTEM.</span>
          </h2>
          <p
            className="text-neutral-muted max-w-2xl mx-auto text-base md:text-lg"
            style={{ fontFamily: "var(--font-body)" }}
          >
            You don't need a website. You need a complete growth engine — where every part works
            together and nothing leaks leads.
          </p>
        </motion.div>

        {/* System connection diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex justify-center items-center gap-2 mb-16"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {services.map((service, index) => (
            <div key={service.id} className="flex items-center gap-2">
              <span className="text-xs text-electric uppercase">{service.name}</span>
              {index < services.length - 1 && (
                <ArrowRight className="w-3 h-3 text-neutral-dim" />
              )}
            </div>
          ))}
          <span className="ml-4 text-xs text-neutral-muted">= GROWTH</span>
        </motion.div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} {...service} index={index} />
          ))}
        </div>

        {/* System output statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div
            className="inline-block border border-electric/30 bg-industrial-surface/50 backdrop-blur-sm px-8 py-4 rounded-lg"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <span className="text-neutral-muted text-sm">System output: </span>
            <span className="text-electric text-sm">
              GROWWSTACK — One brief. Six engines. Every lead captured, nurtured, and closed.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ServiceCard({
  id,
  icon: Icon,
  name,
  role,
  description,
  outputs,
  index,
}: {
  id: string;
  icon: React.ElementType;
  name: string;
  role: string;
  description: string;
  outputs: string[];
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-industrial-surface rounded border border-neutral-dim/30">
              <Icon className="w-5 h-5 text-electric" />
            </div>
            <div>
              <div
                className="text-xs text-neutral-muted uppercase tracking-wider mb-1"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {id} / {role}
              </div>
              <div
                className="text-xl text-neutral"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {name}
              </div>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 3, delay: index * 0.5 }}
            className="w-2 h-2 bg-electric rounded-full"
          />
        </div>
      </div>

      {/* Description */}
      <div className="p-6">
        <p
          className="text-neutral-muted text-sm md:text-base leading-relaxed mb-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>

        {/* Outputs */}
        <div className="space-y-2">
          {outputs.map((output) => (
            <div
              key={output}
              className="flex items-center gap-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span className="text-electric text-xs">▸</span>
              <span className="text-xs text-neutral-muted uppercase tracking-wider">{output}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
