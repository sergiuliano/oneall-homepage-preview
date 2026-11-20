// Runs the looping hero demos on product and pricing pages (markup: build/demos.mjs).
// Without this script, or with reduced motion, each demo shows its finished state.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const list = (v) => (v || '').split(' ').filter(Boolean).map(Number);
  document.querySelectorAll('.demo').forEach((demo) => {
    const n = Number(demo.dataset.n) || 4;
    const stage = demo.querySelector('.dstage');
    const cur = demo.querySelector('.dcur');
    const steps = [...demo.querySelectorAll('.dsteps li')];
    const ranged = [...demo.querySelectorAll('[data-from], [data-to]')];
    const hls = [...demo.querySelectorAll('[data-hl]')];
    const curs = [...demo.querySelectorAll('[data-cur]')];
    let s = -1, timer = 0, visible = false;
    const show = (k) => {
      s = k; demo.dataset.s = k;
      ranged.forEach((el) => {
        const from = el.dataset.from === undefined ? 0 : Number(el.dataset.from);
        const to = el.dataset.to === undefined ? Infinity : Number(el.dataset.to);
        el.classList.toggle('in', k >= from && k <= to);
      });
      hls.forEach((el) => el.classList.toggle('hl', list(el.dataset.hl).includes(k)));
      let on = 0; steps.forEach((li, i) => { if (Number(li.dataset.step) <= k) on = i; });
      steps.forEach((li, i) => li.classList.toggle('on', i === on));
      const target = curs.find((el) => list(el.dataset.cur).includes(k) && el.offsetParent);
      if (target) {
        const a = stage.getBoundingClientRect(), b = target.getBoundingClientRect();
        cur.style.transform = `translate(${b.left - a.left + b.width * 0.62}px, ${b.top - a.top + b.height * 0.55}px)`;
        cur.classList.add('seen'); cur.classList.remove('tap'); void cur.offsetWidth; cur.classList.add('tap');
      } else if (k === 0) cur.classList.remove('seen');
    };
    const tick = () => { show((s + 1) % n); timer = setTimeout(tick, s === n - 1 ? 2600 : s === 0 ? 1300 : 1500); };
    demo.classList.add('run'); show(0);
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) { visible = true; timer = setTimeout(tick, 900); }
      if (!e.isIntersecting && visible) { visible = false; clearTimeout(timer); }
    }, { threshold: 0.15 }).observe(demo);
  });
})();
