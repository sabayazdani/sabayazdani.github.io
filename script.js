/* Saba Yazdani: site behaviour */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- theme (persisted; falls back to OS preference) ---- */
  /* initial theme is applied by the inline script in <head> */
  var themeBtn = document.getElementById('theme');
  function paintIcon() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.innerHTML = '<i class="bi bi-' + (dark ? 'sun-fill' : 'moon-stars-fill') + '"></i>';
  }
  paintIcon();
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    paintIcon();
  });

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var links = document.getElementById('links');
  burger.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.innerHTML = '<i class="bi bi-' + (open ? 'x-lg' : 'list') + '"></i>';
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      burger.innerHTML = '<i class="bi bi-list"></i>';
    }
  });

  /* ---- nav shadow + back-to-top ---- */
  var nav = document.getElementById('nav');
  var top = document.getElementById('top');
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    top.classList.toggle('show', window.scrollY > 600);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  top.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  /* ---- typewriter ---- */
  var roles = ['Software Developer', 'AI Systems Builder', 'Research Assistant @ York', 'Human-in-the-Loop by Design'];
  var el = document.getElementById('type');
  if (reduce) {
    el.textContent = roles[0];
  } else {
    var ri = 0, ci = 0, erasing = false;
    (function tick() {
      var word = roles[ri];
      ci += erasing ? -1 : 1;
      el.textContent = word.slice(0, ci);
      var wait = erasing ? 40 : 75;
      if (!erasing && ci === word.length) { erasing = true; wait = 1700; }
      else if (erasing && ci === 0) { erasing = false; ri = (ri + 1) % roles.length; wait = 320; }
      setTimeout(tick, wait);
    })();
  }

  /* ---- scroll reveal ---- */
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (n) { n.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---- count-up stats ---- */
  var nums = document.querySelectorAll('[data-count]');
  if (!reduce) nums.forEach(function (n) {
    n.textContent = (0).toFixed(parseInt(n.dataset.dec || '0', 10)) + (n.dataset.suffix || '');
  });
  function countUp(node) {
    var target = parseFloat(node.dataset.count);
    var dec = parseInt(node.dataset.dec || '0', 10);
    var suffix = node.dataset.suffix || '';
    if (reduce) { node.textContent = target.toFixed(dec) + suffix; return; }
    var start = performance.now(), dur = 1400;
    (function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = (target * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    })(start);
  }
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io2.observe(n); });
  }

  /* ---- active section in nav ---- */
  var navAs = [].slice.call(document.querySelectorAll('.nav-links a'));
  var sections = navAs.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navAs.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io3.observe(s); });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
