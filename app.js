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

  // OneAll logo: the "n" turns a quarter to the right and closes into a loop, so "on" reads as ∞.
  // Geometry is in the logo PNG's own pixels (272 × 78).
  function oneallLogo(img) {
    const NS = 'http://www.w3.org/2000/svg';
    const W = 11.7, GAP = 4.6, R = 22.65, D2R = Math.PI / 180;
    const L = [28.8, 49.5], RC = [87.9, 49.5], C = [90, 49.3];          // left loop, right loop, pivot of the n
    const pt = (c, r, a) => [c[0] + r * Math.cos(a * D2R), c[1] - r * Math.sin(a * D2R)];
    const line = (a, b, n = 12) => Array.from({ length: n + 1 }, (_, i) => [a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n]);
    const arc = (c, r, a0, a1, n = 40) => Array.from({ length: n + 1 }, (_, i) => pt(c, r, a0 + (a1 - a0) * i / n));
    const cubic = (p0, p1, p2, p3, n = 30) => Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n, u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
      return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
    });
    // Same number of evenly spaced points on every curve, so two curves can be blended point by point.
    const resample = (pts, n) => {
      const len = [0];
      for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const out = []; let j = 1;
      for (let i = 0; i <= n; i++) {
        const s = len[len.length - 1] * i / n;
        while (j < pts.length - 1 && len[j] < s) j++;
        const f = (s - len[j - 1]) / ((len[j] - len[j - 1]) || 1);
        out.push([pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * f, pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * f]);
      }
      return out;
    };
    const d = (pts) => 'M' + pts.map((p) => p[0].toFixed(2) + ' ' + p[1].toFixed(2)).join('L');

    // ∞ state: the crossing strokes are the inner tangents of the two loops.
    const PHI = Math.asin(2 * R / (RC[0] - L[0])) / D2R, TA = 90 - PHI;   // tangent points sit at ±TA on each loop
    const tL = pt(L, R, -TA), tR = pt(RC, R, 180 - TA), tL2 = pt(L, R, TA), tR2 = pt(RC, R, 180 + TA);
    // Logo state.
    const U = [0.663, -0.749];                                            // direction of the logo's diagonal
    const J = [73.3, 38];                                                 // where the diagonal bends into the n
    const B0 = 296, B = pt(L, R, B0), bt = [Math.sin(B0 * D2R), Math.cos(B0 * D2R)];
    const top = [95.5, 26.45];

    const N = 56;
    const cross0 = resample(cubic(B, [B[0] + 13 * bt[0], B[1] + 13 * bt[1]], [J[0] - 16 * U[0], J[1] - 16 * U[1]], J), 28);
    const cross1 = resample(line(tL, tR), 28);
    const body0 = resample([...cubic(J, [J[0] + 9 * U[0], J[1] + 9 * U[1]], [top[0] - 10, top[1]], top), ...arc([95.5, 41.5], 15.05, 90, 0), ...line([110.55, 41.5], [110.55, 78])], N);
    const body1 = resample([...arc(RC, R, 38, -(180 - TA)), ...line(tR2, tL2)], N);
    const stem0 = resample(line([69.45, 78], [69.45, 20.6]), 28);
    const stem1 = resample(arc(RC, R, 180 - TA, 30), 28);

    // A point of the n: blended around the pivot (angle and distance), then turned with the letter.
    const turn = (a, b, k) => {
      const ax = a[0] - C[0], ay = a[1] - C[1], bx = b[1] - C[1], by = -(b[0] - C[0]);   // b, un-turned by a quarter
      const ra = Math.hypot(ax, ay), rb = Math.hypot(bx, by);
      let aa = Math.atan2(ay, ax), da = Math.atan2(by, bx) - aa;
      da -= Math.round(da / (2 * Math.PI)) * 2 * Math.PI;
      const r = ra + (rb - ra) * k, ang = aa + da * k + k * Math.PI / 2;
      return [C[0] + r * Math.cos(ang), C[1] + r * Math.sin(ang)];
    };
    const mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k];

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 272 78');
    svg.setAttribute('class', 'brand-on');
    svg.setAttribute('aria-hidden', 'true');
    const id = 'oa-cut';
    svg.innerHTML = `<defs><mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="180" height="120"><rect x="-20" y="-20" width="180" height="120" fill="#fff"/><path fill="none" stroke="#000"/></mask></defs>
  <g fill="none" stroke="#002a37" stroke-width="${W}" stroke-linejoin="round" opacity=".757"><g mask="url(#${id})"><path/><path/><path/></g><path/></g>`;
    const cut = svg.querySelector('mask path');
    const [ring, stem, body, cross] = svg.querySelectorAll('g path');

    const draw = (k) => {
      const x = cross0.map((p, i) => mix(p, cross1[i], k));
      const n = x.length, ex = [x[n - 1][0] - x[n - 2][0], x[n - 1][1] - x[n - 2][1]], el = Math.hypot(ex[0], ex[1]) || 1;
      cut.setAttribute('d', d(x.slice(3)));
      cut.setAttribute('stroke-width', W + 2 * GAP);
      cross.setAttribute('d', d([...x, [x[n - 1][0] + 1.5 * ex[0] / el, x[n - 1][1] + 1.5 * ex[1] / el]]));
      ring.setAttribute('d', d(arc(L, R, -12 + (TA + 12) * k, B0 + (360 - TA - B0) * k, 90)));
      stem.setAttribute('d', d(stem0.map((p, i) => turn(p, stem1[i], k))));
      body.setAttribute('d', d(body0.map((p, i) => turn(p, body1[i], k))));
    };
    draw(0);
    img.parentNode.classList.add('has-on');
    img.parentNode.appendChild(svg);
    return draw;
  }

  // From time to time the n turns into the ∞, waits, and turns back.
  const brandImg = document.querySelector('.site-header .brand img');
  if (brandImg) {
    const TURN = 950, HOLD = 1500, REST = 6500, FIRST = 2600;
    const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const startLogo = () => {
      const draw = oneallLogo(brandImg);
      const run = (from, to, then) => {
        let t0 = 0;
        const step = (now) => {
          t0 = t0 || now;
          const t = Math.min(1, (now - t0) / TURN);
          draw(from + (to - from) * ease(t));
          if (t < 1) requestAnimationFrame(step); else then();
        };
        requestAnimationFrame(step);
      };
      const cycle = () => run(0, 1, () => setTimeout(() => run(1, 0, () => setTimeout(cycle, REST)), HOLD));
      setTimeout(cycle, FIRST);
    };
    if (brandImg.complete && brandImg.naturalWidth) startLogo(); else brandImg.addEventListener('load', startLogo, { once: true });
  }

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
