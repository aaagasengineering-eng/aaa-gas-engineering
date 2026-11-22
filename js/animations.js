/* ============================================================
   AAA GAS ENGINEERING
   File: js/animations.js
   Purpose: Scroll reveal animations for cards and sections
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Intersection Observer for reveal animations ── */
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.1 });

  // Elements to animate on scroll
  const animatedEls = document.querySelectorAll(
    '.product-card, .why-item, .about-fact, .contact-item'
  );

  animatedEls.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });


  /* ── Counter animation for hero stats ── */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500; // ms
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(function () {
      current += step;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, 16);
  }


  /* ── Smooth image loading ── */
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(function (img) {
    imageObserver.observe(img);
  });

});
