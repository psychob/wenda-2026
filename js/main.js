document.addEventListener('DOMContentLoaded', () => {

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });

  // Mobile nav toggle
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');

  toggle?.addEventListener('click', () => {
    links?.classList.toggle('open');
  });

  // Close nav on link click
  document.querySelectorAll('.nav__links a').forEach((link) => {
    link.addEventListener('click', () => {
      links?.classList.remove('open');
    });
  });

  // Nav background on scroll
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 100) {
      nav.style.borderBottomColor = 'var(--border)';
    } else {
      nav.style.borderBottomColor = 'transparent';
    }
    lastScroll = currentScroll;
  });

  // Smooth hover cursor for work cards (desktop only)
  if (window.innerWidth > 768) {
    document.querySelectorAll('.work__card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `
          perspective(1000px)
          rotateY(${x * 8}deg)
          rotateX(${y * -8}deg)
          translateY(-8px)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
});
