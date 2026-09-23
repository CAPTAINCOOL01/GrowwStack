export function ThemeToggle() {
  return (
    <button className="gs-theme-toggle" type="button" data-theme-toggle title="Change color theme">
      <svg className="gs-theme-toggle__sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
      </svg>
      <svg className="gs-theme-toggle__moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M20.8 13a9 9 0 0 1-9.8-9.8A9 9 0 1 0 20.8 13Z" />
      </svg>
      <span className="gs-theme-toggle__light-label gs-visually-hidden">Switch to light theme</span>
      <span className="gs-theme-toggle__dark-label gs-visually-hidden">Switch to dark theme</span>
    </button>
  );
}
