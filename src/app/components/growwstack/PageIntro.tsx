import '../../../styles/page-intro.css';
const introductions: Record<string, { title: string; description: string }> = {
  '/services': {title:'SEO, AEO, GEO and revenue growth services',description:'Connect organic discovery, customer enquiries, CRM and revenue reporting. Explore search work through a revenue-share partnership with no upfront agency fee.'},
  '/about': {title:'Meet the GrowwStack team',description:'Product engineering, organic acquisition and sales operations, working together around your business.'},
  '/partnership': {title:'SEO, AEO and GEO on revenue share. No upfront agency fee.',description:'We work on organic visibility, leads and sales, and earn an agreed percentage when our work produces revenue. Explore the scope, business fit and measurement before starting.'},
  '/contact': {title:'Tell us about your next stage of growth',description:'Share your business, website and current challenges so we can assess where GrowwStack can help.'},
};
export function PageIntro({pathname}: {pathname: string}) {
  const intro = introductions[pathname];
  if (!intro) return null;
  return <header className="gs-container gs-page-intro"><h1>{intro.title}</h1><p>{intro.description}</p></header>;
}
