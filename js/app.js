document.addEventListener('DOMContentLoaded', () => {
  // Split text reveal (hero)
  const splitEls = document.querySelectorAll('[data-split]');
  splitEls.forEach((el) => {
    if (el.classList.contains('hm-hero__title')) {
      const html = el.innerHTML;
      const lines = html.split('<br>');
      el.innerHTML = lines.map((line) => `<span class="line">${line.trim()}</span>`).join('');
    } else if (el.classList.contains('hm-hero__desc')) {
      const text = el.textContent;
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      el.innerHTML = sentences.map((s) => `<span class="line">${s.trim()}</span>`).join('');
    }
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      splitEls.forEach((el) => el.classList.add('revealed'));
    });
  });

  // Fade in Spline iframe after load delay
  setTimeout(() => {
    const visual = document.querySelector('.hm-hero__visual');
    if (visual) visual.classList.add('iframe-ready');
  }, 1500);

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el));

  // Sticky nav on scroll
  const nav = document.querySelector('.cs-nav');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 80) {
          nav.classList.add('cs-nav--sticky');
        } else {
          nav.classList.remove('cs-nav--sticky');
        }
        ticking = false;
      });
      ticking = true;
    }
  });

  // Hamburger toggle
  var linksContainer = document.querySelector('.cs-nav__links');
  document.querySelector('.cs-nav__toggle').addEventListener('click', function() {
    var isOpen = nav.classList.toggle('cs-nav--open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.querySelectorAll('.cs-nav__links a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('cs-nav--open');
      document.body.style.overflow = '';
    });
  });
  linksContainer.addEventListener('click', function(e) {
    if (e.target === linksContainer || !e.target.closest('.cs-nav__links-inner')) {
      nav.classList.remove('cs-nav--open');
      document.body.style.overflow = '';
    }
  });

  // Parallax reveal — slides image up once when card is 50% visible
  const parallaxRows = document.querySelectorAll('[data-parallax]');

  const parallaxObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('parallax-visible');
          parallaxObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  parallaxRows.forEach((el) => parallaxObserver.observe(el));

  // Draggable tags with physics (about section)
  const tags = document.querySelectorAll('[data-tag]');
  if (tags.length) {
    const box = tags[0].closest('.hm-about__tags-box');
    const cx = box.offsetWidth / 2;
    const cy = box.offsetHeight / 2;

    const state = [];
    let mouseX = null, mouseY = null;
    let animId = null;

    tags.forEach((tag, i) => {
      const r = tag.offsetWidth / 2;
      const pos = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, av: 0, r, el: tag, drag: false, targetX: 0, targetY: 0 };
      state.push(pos);
      tag.style.transform = 'translate(0px, 0px)';

      // distribute initial positions slightly
      const a = (i / tags.length) * Math.PI * 2;
      pos.x = Math.cos(a) * 10;
      pos.y = Math.sin(a) * 10;
    });

    function tick() {
      const bx = box.offsetWidth / 2;
      const by = box.offsetHeight / 2;

      for (let i = 0; i < state.length; i++) {
        const a = state[i];

        // Spring force toward center
        let fx = -0.003 * (a.x - a.targetX);
        let fy = -0.003 * (a.y - a.targetY);

        // Repulsion from other tags
        for (let j = 0; j < state.length; j++) {
          if (i === j) continue;
          const b = state[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const minDist = a.r + b.r + 10;
          if (dist < minDist) {
            const force = (minDist - dist) / minDist * 0.6;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
            // Collision spin
            const nx = dx / dist;
            const ny = dy / dist;
            const tx = -ny;
            const ty = nx;
            const relVx = (a.drag ? 0 : a.vx) - (b.drag ? 0 : b.vx);
            const relVy = (a.drag ? 0 : a.vy) - (b.drag ? 0 : b.vy);
            const tanVel = relVx * tx + relVy * ty;
            a.av += tanVel * 0.0025;
          }
        }

        // Repulsion from cursor
        if (mouseX !== null && mouseY !== null) {
          const boxRect = box.getBoundingClientRect();
          const dx = a.x - (mouseX - boxRect.left - bx);
          const dy = a.y - (mouseY - boxRect.top - by);
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          if (dist < 120) {
            const force = (120 - dist) / 120 * 0.75;
            fx += (dx / dist) * force;
            fy += (dy / dist) * force;
            a.av += (dx / dist) * force * 0.0015;
          }
        }

        // Apply forces (skip when dragging)
        if (!a.drag) {
          a.vx += fx;
          a.vy += fy;
          a.vx *= 0.92;
          a.vy *= 0.92;
          a.x += a.vx;
          a.y += a.vy;
        }

        // Tilt from velocity
        const speed = Math.sqrt(a.vx * a.vx + a.vy * a.vy);
        const targetAngle = speed > 0.5 ? Math.atan2(a.vy, a.vx) * 0.06 : 0;
        a.av += (targetAngle - a.angle) * 0.005;

        // Angular damping
        a.av *= 0.92;
        a.angle += a.av;

        // Clamp to box (soft wall)
        const margin = a.r + 10;
        const maxX = bx - margin;
        const maxY = by - margin;
        if (a.x > maxX) { a.x = maxX; a.vx *= -0.5; a.av += 0.02; }
        if (a.x < -maxX) { a.x = -maxX; a.vx *= -0.5; a.av -= 0.02; }
        if (a.y > maxY) { a.y = maxY; a.vy *= -0.5; a.av -= 0.02; }
        if (a.y < -maxY) { a.y = -maxY; a.vy *= -0.5; a.av += 0.02; }

        a.el.style.transform = `translate(${a.x}px, ${a.y}px) rotate(${a.angle}rad)`;
      }

      animId = requestAnimationFrame(tick);
    }

    // Mouse tracking
    box.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    box.addEventListener('mouseleave', () => {
      mouseX = null;
      mouseY = null;
    });

    // Drag
    let dragIdx = -1;
    let dragStartX = 0, dragStartY = 0;
    let dragTagStartX = 0, dragTagStartY = 0;

    function onPointerDown(e) {
      const pt = e.type.startsWith('touch') ? e.touches[0] : e;
      const rect = box.getBoundingClientRect();
      const mx = pt.clientX - rect.left;
      const my = pt.clientY - rect.top;

      for (let i = state.length - 1; i >= 0; i--) {
        const s = state[i];
        const tagCenterX = s.x + rect.width / 2;
        const tagCenterY = s.y + rect.height / 2;
        const dx = mx - tagCenterX;
        const dy = my - tagCenterY;
        if (Math.sqrt(dx * dx + dy * dy) < s.r + 10) {
          dragIdx = i;
          dragStartX = pt.clientX;
          dragStartY = pt.clientY;
          dragTagStartX = s.x;
          dragTagStartY = s.y;
          s.drag = true;
          s.vx = 0;
          s.vy = 0;
          s.el.classList.add('dragging');
          break;
        }
      }
      e.preventDefault();
    }

    function onPointerMove(e) {
      if (dragIdx === -1) return;
      const pt = e.type.startsWith('touch') ? e.touches[0] : e;
      const s = state[dragIdx];
      s.x = dragTagStartX + (pt.clientX - dragStartX);
      s.y = dragTagStartY + (pt.clientY - dragStartY);
      e.preventDefault();
    }

    function onPointerUp() {
      if (dragIdx === -1) return;
      state[dragIdx].drag = false;
      state[dragIdx].el.classList.remove('dragging');
      dragIdx = -1;
    }

    tags.forEach((tag) => {
      tag.addEventListener('mousedown', onPointerDown);
      tag.addEventListener('touchstart', onPointerDown, { passive: false });
    });

    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp);

    tick();
  }

  // Page transition — circle wipe on case study links
  const bodyBg = getComputedStyle(document.body).backgroundColor || '#ffffff';
  const transitionOverlay = document.createElement('div');
  transitionOverlay.id = 'page-transition';
  Object.assign(transitionOverlay.style, {
    position: 'fixed', inset: '0', zIndex: '9999',
    pointerEvents: 'none', background: bodyBg,
    clipPath: 'circle(0% at var(--tx, 50%) var(--ty, 50%))',
    transition: 'clip-path 0.6s cubic-bezier(0.65, 0.05, 0, 1)'
  });
  document.body.appendChild(transitionOverlay);

  // Reset overlay when returning via bfcache (browser back/forward)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      const el = document.getElementById('page-transition');
      if (el) el.style.clipPath = 'circle(0% at var(--tx, 50%) var(--ty, 50%))';
    }
  });

  document.querySelectorAll('.hm-work__row').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const color = link.getAttribute('data-transition') || bodyBg;
      transitionOverlay.style.background = color;

      const rect = link.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      transitionOverlay.style.setProperty('--tx', cx + 'px');
      transitionOverlay.style.setProperty('--ty', cy + 'px');
      transitionOverlay.style.clipPath = 'circle(141% at ' + cx + 'px ' + cy + 'px)';

      setTimeout(() => { window.location.href = href; }, 600);
    });
  });

  // Back to top
  var backBtn = document.getElementById('backToTop');
  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? scrollTop / docHeight : 0;
    if (backBtn) {
      backBtn.classList.toggle('visible', scrollTop > 300);
      backBtn.classList.toggle('at-bottom', progress > 0.98);
    }
  });
  if (backBtn) {
    backBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
