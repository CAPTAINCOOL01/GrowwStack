import { useEffect } from "react";
import { HeroSection } from "./components/HeroSection";
import { FounderSection, PartnershipsSection } from "./components/growwstack/FounderAndPartnerships";
import { GrowthStackSection } from "./components/growwstack/GrowthAndResults";
import {
  ApplicationSection,
  PartnershipProcessSection,
} from "./components/growwstack/ProcessAndApplication";
import { QuickContactSection } from "./components/growwstack/QuickContactSection";
import { FreeBuildOffer } from "./components/growwstack/FreeBuildOffer";
import { WebsiteBuildSection } from "./components/growwstack/WebsiteBuildSection";
import { SiteFooter } from "./components/growwstack/SiteFooter";
import { SiteNav } from "./components/growwstack/SiteNav";
import { WhatsAppFab } from "./components/growwstack/WhatsAppFab";
import { trackPageView } from "../lib/tracking";
import { initAnalytics } from "../lib/analytics";
import { syncOptOutFromUrl } from "../lib/optOut";
import { initEventTracking } from "../lib/events";
import { ConsentBanner } from "./components/growwstack/ConsentBanner";

export default function App() {
  useEffect(() => {
    syncOptOutFromUrl();
    initAnalytics();
    initEventTracking();
    trackPageView();

    // Keep inbound links useful when optional forms are collapsed.
    const revealHashTarget = (hash = window.location.hash) => {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      const disclosures = target.id === "build" || target.id === "apply" ? target.querySelectorAll<HTMLDetailsElement>("details[data-hash-disclosure]") : [];
      disclosures.forEach((detail) => {
        detail.open = true;
      });
      let parent: HTMLElement | null = target;
      while (parent) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
        parent = parent.parentElement;
      }
      requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "instant" }));
    };
    revealHashTarget();
    const onHashChange = () => revealHashTarget();
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (anchor?.hash === window.location.hash) revealHashTarget(anchor.hash);
    };
    window.addEventListener("hashchange", onHashChange);
    document.addEventListener("click", onAnchorClick);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      document.removeEventListener("click", onAnchorClick);
    };
  }, []);

  return (
    <div className="gs-site">
      <a className="gs-skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteNav />
      <main id="main-content">
        <HeroSection />
        <GrowthStackSection />
        <PartnershipsSection />
        <FounderSection />
        <PartnershipProcessSection />
        <FreeBuildOffer />
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
