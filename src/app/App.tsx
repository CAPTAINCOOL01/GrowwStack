import { useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { FounderSection, PartnershipsSection } from "./components/growwstack/FounderAndPartnerships";
import { GrowthStackSection, ResultsSection } from "./components/growwstack/GrowthAndResults";
import {
  ApplicationSection,
  PartnerFitSection,
  PartnershipProcessSection,
} from "./components/growwstack/ProcessAndApplication";
import { QuickContactSection } from "./components/growwstack/QuickContactSection";
import { WebsiteBuildSection } from "./components/growwstack/WebsiteBuildSection";
import { SiteFooter } from "./components/growwstack/SiteFooter";
import { SiteNav } from "./components/growwstack/SiteNav";
import { WhatsAppFab } from "./components/growwstack/WhatsAppFab";
import { trackPageView } from "../lib/tracking";
import { initAnalytics } from "../lib/analytics";
import { syncOptOutFromUrl } from "../lib/optOut";
import { ConsentBanner } from "./components/growwstack/ConsentBanner";

export default function App() {
  useEffect(() => {
    syncOptOutFromUrl();
    initAnalytics();
    trackPageView();
  }, []);

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
        <WebsiteBuildSection />
        <ApplicationSection />
        <QuickContactSection />
      </main>
      <SiteFooter />
      <WhatsAppFab />
      <ConsentBanner />
    </div>
  );
}
