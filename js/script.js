// Main behaviors: menu toggle, forms, captcha + localStorage, FAQ accordions
document.addEventListener('DOMContentLoaded', () => {
  /* MENU TOGGLE */
  const menuBtn = document.getElementById('menuBtn');
  const mainNav = document.getElementById('mainNav');
  menuBtn?.addEventListener('click', () => {
    const shown = mainNav.classList.toggle('show');
    menuBtn.setAttribute('aria-expanded', String(shown));
  });

  /* YEAR IN FOOTER */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* HERO BOOKING FORM */
  const heroForm = document.getElementById('hero-booking');
  const heroMsg = document.getElementById('heroMsg');
  if (heroForm && heroMsg) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('hero-name')?.value || '').trim();
      const phone = (document.getElementById('hero-phone')?.value || '').trim();
      if (!name || !phone) {
        heroMsg.hidden = false;
        heroMsg.textContent = 'Please fill in both name and mobile number.';
        heroMsg.style.color = 'crimson';
        setTimeout(() => (heroMsg.hidden = true), 4000);
        return;
      }
      heroMsg.hidden = false;
      heroMsg.textContent = `Thanks ${name}! Our team will call you on ${phone} shortly.`;
      heroMsg.style.color = 'green';
      setTimeout(() => (heroMsg.hidden = true), 4500);
      heroForm.reset();
    });
  }

  /* OFFER FORM (optional small confirmation) */
  const offerForm = document.getElementById('offer-form');
  const offerMsg = document.getElementById('offerMsg');
  if (offerForm && offerMsg) {
    offerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('offer-name')?.value || '').trim();
      const phone = (document.getElementById('offer-phone')?.value || '').trim();
      if (!name || !phone) {
        offerMsg.hidden = false;
        offerMsg.textContent = 'Please fill in both name and mobile number.';
        offerMsg.style.color = 'crimson';
        setTimeout(() => (offerMsg.hidden = true), 4000);
        return;
      }
      offerMsg.hidden = false;
      offerMsg.textContent = `Thanks ${name}! We have reserved this special offer for ${phone}.`;
      offerMsg.style.color = 'green';
      setTimeout(() => (offerMsg.hidden = true), 4500);
      offerForm.reset();
    });
  }

  /* CAPTCHA & CONTACT FORM STORAGE */
  const captchaBox = document.getElementById('captchaBox');
  const captchaInput = document.getElementById('captcha');
  function randomCaptcha(len = 5) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < len; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
    return s;
  }
  if (captchaBox) {
    captchaBox.textContent = randomCaptcha();
    captchaBox.addEventListener('click', () => (captchaBox.textContent = randomCaptcha()));
  }

  const form = document.getElementById('quote-form');
  const formMsg = document.getElementById('formMsg');
  const submissionsList = document.getElementById('submissionsList');

  function escapeHtml(s = '') {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function loadSubmissions() {
    if (!submissionsList) return;
    const data = JSON.parse(localStorage.getItem('dental_submissions') || '[]');
    if (!data.length) {
      submissionsList.textContent = 'No submissions yet.';
      return;
    }
    submissionsList.innerHTML = data
      .map(s => {
        const t = new Date(s.time).toLocaleString();
        return `<div class="submission-item">
          <strong>${escapeHtml(s.name)}</strong>
          <div>${escapeHtml(s.phone)}</div>
          <small style="color:#666">${t}</small>
        </div>`;
      })
      .join('');
  }

  function showMessage(msg, isError = false) {
    if (!formMsg) return;
    formMsg.hidden = false;
    formMsg.textContent = msg;
    formMsg.style.color = isError ? 'crimson' : 'green';
    setTimeout(() => {
      formMsg.hidden = true;
    }, 4500);
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('name')?.value || '').trim();
      const phone = (document.getElementById('phone')?.value || '').trim();
      const captcha = (captchaInput?.value || '').trim().toUpperCase();
      const expected = (captchaBox?.textContent || '').trim().toUpperCase();

      if (!name || !phone) {
        showMessage('Please enter both name and phone.', true);
        return;
      }
      if (captcha !== expected) {
        showMessage('Captcha does not match. Click the captcha box to regenerate.', true);
        return;
      }

      const submissions = JSON.parse(localStorage.getItem('dental_submissions') || '[]');
      submissions.unshift({ name, phone, time: Date.now() });
      localStorage.setItem('dental_submissions', JSON.stringify(submissions.slice(0, 50)));
      showMessage(`Thanks ${name}! We received your request and will contact you shortly.`, false);

      form.reset();
      if (captchaBox) captchaBox.textContent = randomCaptcha();
      loadSubmissions();
    });
  }

  loadSubmissions();

  /* FAQ ACCORDIONS (for both FAQ sections) */
  document.querySelectorAll('.faq-list').forEach(list => {
    list.querySelectorAll('.faq-item').forEach(item => {
      const toggle = item.querySelector('.faq-toggle');
      const closeBtn = item.querySelector('.faq-close');

      if (!toggle) return;

      item.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');

      toggle.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        if (isOpen) {
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          item.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });
});
