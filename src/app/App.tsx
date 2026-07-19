import { HeroSection } from "./components/HeroSection";
import { FounderSection, PartnershipsSection } from "./components/growwstack/FounderAndPartnerships";
import { GrowthStackSection, ResultsSection } from "./components/growwstack/GrowthAndResults";
import {
  ApplicationSection,
  PartnerFitSection,
  PartnershipProcessSection,
} from "./components/growwstack/ProcessAndApplication";
import { SiteFooter } from "./components/growwstack/SiteFooter";
import { SiteNav } from "./components/growwstack/SiteNav";

export default function App() {
  return (
    <div className="gs-site">
      <a className="gs-skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteNav />
      <main id="main-content">
        <HeroSection />
        <FounderSection />
        <PartnershipsSection />
        <GrowthStackSection />
        <ResultsSection />
        <PartnershipProcessSection />
        <PartnerFitSection />
        <ApplicationSection />
      </main>
      <SiteFooter />
    </div>
  );
}
