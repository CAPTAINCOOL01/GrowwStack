import { HeroSection } from "./components/HeroSection";
import { PainPointsSection } from "./components/PainPointsSection";
import { CaseStudiesSection } from "./components/CaseStudiesSection";
import { MetricsWallSection } from "./components/MetricsWallSection";
import { SystemServicesSection } from "./components/SystemServicesSection";
import { CustomerJourneySection } from "./components/CustomerJourneySection";
import { GrowthPlansSection } from "./components/GrowthPlansSection";
import { CTASection } from "./components/CTASection";
import { Navbar } from "./components/Navbar";

export default function App() {
  return (
    <div className="size-full overflow-y-auto bg-industrial-dark">
      <Navbar />
      <div id="hero"><HeroSection /></div>
      <div id="pain"><PainPointsSection /></div>
      <div id="proof"><CaseStudiesSection /></div>
      <div id="metrics"><MetricsWallSection /></div>
      <div id="services"><SystemServicesSection /></div>
      <div id="journey"><CustomerJourneySection /></div>
      <div id="plans"><GrowthPlansSection /></div>
      <div id="cta"><CTASection /></div>
    </div>
  );
}
