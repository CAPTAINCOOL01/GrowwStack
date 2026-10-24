// Public company facts from the GrowwStack decks and first-month brief, 24 Oct 2026.
// Client contacts, access details and proposal-specific targets stay out of public copy.
export const coreTeam = [
  { name: "Ramayana Singh", detail: "Founder · M.Tech, BITS Pilani · Gold Medalist" },
  { name: "Abhishek Bajpai", detail: "IIT Guwahati" },
  { name: "Anmol Purwal", detail: "IIT Kharagpur" },
  { name: "Parvi Dixit", detail: "Previously at Frido and NoBroker" },
];

export const partnerBrands = [
  { name: "Camstar Sports", sector: "Sports equipment", summary: "Website, daily SEO, content and sales systems for a licensed airgun manufacturer.", href: "/case-studies/ecommerce-sports-equipment", link: "Read the case study", external: false },
  { name: "Viva Fitness", sector: "Fitness equipment", summary: "A gym space planner that turns a buyer’s space and budget into an equipment list and qualified sales lead.", href: "/work#viva-fitness", link: "Explore the project", external: false },
  { name: "Furtopia", sector: "Pet supplies", summary: "A custom online store with Razorpay checkout, search-ready product pages and order-source tracking.", href: "https://furtopia.co.in/", link: "Visit the store", external: true },
];

export const otherBrandWork = [
  { sector: "Women’s nutrition", summary: "Search audit and a 90-day organic roadmap for visibility across Google search and AI answers." },
  { sector: "Open-box electronics", summary: "Search and analytics audit, a measured baseline and a 90-day traffic plan on revenue share." },
];

export const ndaNote = "We cannot disclose every brand’s name due to signed non-disclosure agreements (NDAs).";

export const brandId = (name: string) => name.toLowerCase().replace(/\s+/g, "-");
