/* Shared by React and the static blog/case-study pages. Run before styles paint. */
(function () {
  var key = 'growwstack-theme';
  function apply(theme) {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f5f7f9' : '#07111d';
  }
  function savedTheme() {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  apply(savedTheme());
  document.addEventListener('click', function (event) {
    if (!(event.target instanceof Element) || !event.target.closest('[data-theme-toggle]')) return;
    var theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(theme);
    try { localStorage.setItem(key, theme); } catch (_) { /* Theme still works without storage. */ }
  });
  window.addEventListener('storage', function (event) {
    if (event.key === key || event.key === null) apply(savedTheme());
  });
})();
