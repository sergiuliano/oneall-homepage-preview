// OneAll homepage — small progressive enhancements. The page works without this file.
(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const menuBtn = document.querySelector('.menu-btn');
  const menu = document.getElementById('mobile-menu');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header gets a frosted background once the page has scrolled.
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu.
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    root.classList.toggle('menu-open', open);
  };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') { setMenu(false); menuBtn.focus(); }
  });
  matchMedia('(min-width: 941px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  if (calm) return;

  // Sections fade up as they enter the viewport.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      el.style.transitionDelay = `${(Number(el.dataset.reveal) || 0) * 90}ms`;
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  // Hero demo: the highlighted network changes, to show that any of them works.
  const rows = [...document.querySelectorAll('.login .lb')];
  const cursor = document.querySelector('.login .cursor');
  const hello = document.querySelector('.hello');
  const helloText = hello && hello.querySelector('small');
  const names = ['Google', 'Facebook', 'Apple'];
  if (rows.length === names.length && cursor && helloText) {
    let i = 0;
    setInterval(() => {
      if (document.hidden) return;
      i = (i + 1) % rows.length;
      const step = rows[1].offsetTop - rows[0].offsetTop;
      rows.forEach((row, k) => row.classList.toggle('on', k === i));
      cursor.style.transform = `translateY(${i * step}px)`;
      helloText.textContent = `Signed in with ${names[i]} · 1 click`;
      hello.classList.remove('pop');
      void hello.offsetWidth;
      hello.classList.add('pop');
    }, 3200);
  }
})();
