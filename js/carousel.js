/* ============================================================
   AAA GAS ENGINEERING
   File: js/carousel.js
   Purpose: Product carousel — drag, arrow, dot, auto-play, responsive
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const track        = document.getElementById('carousel-track');
  const wrapper      = document.querySelector('.carousel-track-wrapper');
  const prevBtn      = document.getElementById('carousel-prev');
  const nextBtn      = document.getElementById('carousel-next');
  const dotsContainer = document.getElementById('carousel-dots');

  if (!track || !wrapper) return;

  const cards = Array.from(track.children);
  const total  = cards.length;
  let currentIndex = 0;
  let autoPlayTimer = null;
  let isDragging = false;
  let startX = 0;
  let dragDelta = 0;

  /* ── Responsive: how many cards visible ── */
  function visibleCount() {
    const w = window.innerWidth;
    if (w <= 480)  return 1;
    if (w <= 768)  return 2;
    if (w <= 1100) return 2;
    return 3;
  }

  /* ── Card width calculation ── */
  function cardWidth() {
    const gap     = 24;
    const visible = visibleCount();
    const total_gap = gap * (visible - 1);
    return (wrapper.clientWidth - total_gap) / visible;
  }

  /* ── Set card widths ── */
  function setCardWidths() {
    const w = cardWidth();
    cards.forEach(function (card) {
      card.style.width = w + 'px';
      card.style.minWidth = w + 'px';
    });
  }

  /* ── Max index we can scroll to ── */
  function maxIndex() {
    return Math.max(0, total - visibleCount());
  }

  /* ── Move to index ── */
  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex()));

    const offset = currentIndex * (cardWidth() + 24);
    track.style.transform = 'translateX(-' + offset + 'px)';

    updateDots();
    updateButtons();
  }

  /* ── Dots ── */
  function buildDots() {
    dotsContainer.innerHTML = '';
    const count = maxIndex() + 1;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === currentIndex ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      dot.addEventListener('click', function () {
        goTo(i);
        resetAutoPlay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.carousel-dot');
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  /* ── Arrow buttons state ── */
  function updateButtons() {
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex();
  }

  /* ── Arrow clicks ── */
  prevBtn.addEventListener('click', function () {
    goTo(currentIndex - 1);
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', function () {
    goTo(currentIndex + 1);
    resetAutoPlay();
  });

  /* ── Auto-play ── */
  function startAutoPlay() {
    autoPlayTimer = setInterval(function () {
      if (currentIndex >= maxIndex()) {
        goTo(0);
      } else {
        goTo(currentIndex + 1);
      }
    }, 4000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  /* ── Drag / swipe support ── */
  function onDragStart(e) {
    isDragging = true;
    startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragDelta = 0;
    track.style.transition = 'none';
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const x = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    dragDelta = x - startX;

    const baseOffset = currentIndex * (cardWidth() + 24);
    track.style.transform = 'translateX(' + (-baseOffset + dragDelta) + 'px)';
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    track.style.transition = '';

    const threshold = cardWidth() * 0.25;
    if (dragDelta < -threshold) {
      goTo(currentIndex + 1);
    } else if (dragDelta > threshold) {
      goTo(currentIndex - 1);
    } else {
      goTo(currentIndex); // snap back
    }
    resetAutoPlay();
  }

  // Mouse drag
  wrapper.addEventListener('mousedown',  onDragStart);
  window.addEventListener('mousemove',  onDragMove);
  window.addEventListener('mouseup',    onDragEnd);

  // Touch swipe
  wrapper.addEventListener('touchstart', onDragStart, { passive: true });
  wrapper.addEventListener('touchmove',  onDragMove,  { passive: true });
  wrapper.addEventListener('touchend',   onDragEnd);

  // Prevent click on cards after drag
  wrapper.addEventListener('click', function (e) {
    if (Math.abs(dragDelta) > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  /* ── Keyboard arrow navigation ── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { goTo(currentIndex - 1); resetAutoPlay(); }
    if (e.key === 'ArrowRight') { goTo(currentIndex + 1); resetAutoPlay(); }
  });

  /* ── Pause auto-play on hover ── */
  wrapper.addEventListener('mouseenter', function () { clearInterval(autoPlayTimer); });
  wrapper.addEventListener('mouseleave', startAutoPlay);

  /* ── Rebuild on resize ── */
  let resizeTimeout;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function () {
      setCardWidths();
      // Rebuild dots (count may change)
      buildDots();
      // Clamp currentIndex
      if (currentIndex > maxIndex()) currentIndex = maxIndex();
      goTo(currentIndex);
    }, 150);
  });

  /* ── INIT ── */
  setCardWidths();
  buildDots();
  goTo(0);
  startAutoPlay();

});
