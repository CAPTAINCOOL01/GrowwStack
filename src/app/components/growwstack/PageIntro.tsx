import '../../../styles/page-intro.css';
const introductions: Record<string, { title: string; description: string }> = {
  '/services': {title:'Website, search and sales growth services',description:'Connect your digital presence, customer acquisition, CRM and revenue reporting with one growth partner.'},
  '/about': {title:'Meet the GrowwStack team',description:'Product engineering, organic acquisition and sales operations, working together around your business.'},
  '/partnership': {title:'A growth partnership built around your business',description:'Understand the fit, scope and measurement before exploring a selective revenue-share engagement.'},
  '/contact': {title:'Tell us about your next stage of growth',description:'Share your business, website and current challenges so we can assess where GrowwStack can help.'},
};
export function PageIntro({pathname}: {pathname: string}) {
  const intro = introductions[pathname];
  if (!intro) return null;
  return <header className="gs-container gs-page-intro"><h1>{intro.title}</h1><p>{intro.description}</p></header>;
}
