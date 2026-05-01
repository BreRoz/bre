(function(){
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const nav = document.getElementById('nav');
  const progress = document.getElementById('nav-progress');
  const burger = document.getElementById('nav-burger');

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? y / h : 0;
    if (progress) progress.style.transform = 'scaleX(' + p + ')';
    if (nav) nav.classList.toggle('nav--scrolled', y > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('nav--open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('[data-nav-close]').forEach(el => {
      el.addEventListener('click', () => {
        nav.classList.remove('nav--open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
      });
    });
  }

  /* HERO H1 word reveal */
  const h1 = document.querySelector('[data-reveal-h1]');
  if (h1) {
    if (reduced) {
      h1.classList.add('is-in');
    } else {
      const ioH = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            h1.classList.add('is-in');
            ioH.disconnect();
          }
        });
      }, { threshold: 0.05 });
      ioH.observe(h1);
    }
  }

  /* RECEIPT counters */
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const animateCounter = (el) => {
      const target = parseFloat(el.dataset.counter);
      const decimals = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      if (reduced) {
        el.textContent = (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix;
        return;
      }
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const e = 1 - Math.pow(1 - p, 3);
        const val = target * e;
        const display = decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString();
        el.textContent = display + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const ioR = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          ioR.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => ioR.observe(c));
  }

  /* List & quote in-view reveals */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length) {
    if (reduced) {
      reveals.forEach(c => c.classList.add('is-in'));
    } else {
      const ioL = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            ioL.unobserve(e.target);
          }
        });
      }, { threshold: 0.18 });
      reveals.forEach(c => ioL.observe(c));
    }
  }

  /* Footer marquee build */
  const slashHTML = (size) => '<span class="slash" aria-hidden="true" style="width:' + (size * 0.5) + 'px;height:' + size + 'px;"></span>';
  const footerMarquee = document.getElementById('footer-marquee');
  if (footerMarquee) {
    const words = ['BUILD', 'SHIP', 'RECEIPTS'];
    let html = '';
    for (let i = 0; i < 2; i++) {
      words.forEach(w => {
        html += '<span>' + w + slashHTML(88) + '</span>';
      });
    }
    footerMarquee.innerHTML = html;
  }

  onScroll();
})();
