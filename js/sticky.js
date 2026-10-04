// Barre collante : apparaît une fois le hero sorti de l'écran (amélioration progressive, la nav du hero reste disponible sans JS).
(() => {
  const bar = document.querySelector('.topbar-sticky');
  const hero = document.querySelector('.hero');
  if (!bar || !hero || !('IntersectionObserver' in window)) return;
  new IntersectionObserver(([e]) => {
    bar.classList.toggle('is-visible', !e.isIntersecting);
  }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
})();
