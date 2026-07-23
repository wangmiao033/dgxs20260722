(() => {
  'use strict';

  function patchHomeHeroButton() {
    let route = 'home';
    try { route = decodeURIComponent(location.hash.slice(1) || 'home'); } catch {}
    if (route !== 'home') return;

    document.querySelectorAll('.hero-actions a').forEach(link => {
      const text = (link.textContent || '').trim();
      if (text === '查看实景素材' || link.getAttribute('href') === '#apk-gallery') {
        link.href = '#apk/heroes';
        link.textContent = '英雄图鉴';
        link.setAttribute('aria-label', '打开完整英雄图鉴');
      }
    });
  }

  window.addEventListener('hashchange', () => setTimeout(patchHomeHeroButton, 30));
  const observer = new MutationObserver(patchHomeHeroButton);
  observer.observe(document.body, { childList: true, subtree: true });
  patchHomeHeroButton();
})();
