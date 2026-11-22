/* ============================================================
   AAA GAS ENGINEERING
   File: js/form.js
   Purpose: Contact form submission + validation
============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('.form-submit');
    const name    = form.querySelector('input[name="name"]').value.trim();
    const phone   = form.querySelector('input[name="phone"]').value.trim();

    /* ── Basic validation ── */
    if (!name) {
      showError('Please enter your name.');
      return;
    }

    if (!phone) {
      showError('Please enter your phone number.');
      return;
    }

    /* ── Loading state ── */
    btn.textContent = 'Sending...';
    btn.disabled = true;
    btn.style.opacity = '0.7';

    /* ── Simulate send (replace with real backend/EmailJS later) ── */
    setTimeout(function () {
      btn.textContent = '✓ Inquiry Sent!';
      btn.style.background = '#22c55e';
      btn.style.opacity = '1';

      // Reset after 3 seconds
      setTimeout(function () {
        btn.textContent = 'Send Inquiry →';
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    }, 1200);
  });

  /* ── Error display helper ── */
  function showError(message) {
    let errEl = form.querySelector('.form-error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'form-error';
      errEl.style.cssText = 'color:#e24b4a;font-size:13px;margin-top:-8px;';
      form.insertBefore(errEl, form.querySelector('.form-submit'));
    }
    errEl.textContent = message;
    setTimeout(function () { errEl.textContent = ''; }, 4000);
  }

});
