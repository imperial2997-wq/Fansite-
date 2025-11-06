// ----------------- Utilities -----------------
document.addEventListener('DOMContentLoaded', function () {
  // set year in footers
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  const el2 = document.getElementById('year2');
  if (el) el.textContent = y;
  if (el2) el2.textContent = y;

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', (!expanded).toString());
      navLinks.style.display = expanded ? '' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '8px';
      navLinks.style.alignItems = 'flex-start';
    });
  }

  // smooth scroll for anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // ----------------- Scroll reveal (IntersectionObserver) -----------------
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { root: null, threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ----------------- GLightbox init -----------------
  try {
    const lightbox = GLightbox({ selector: '.glightbox', touchNavigation: true });
  } catch (e) {
    // GLightbox not loaded or error
    console.warn('GLightbox init failed', e);
  }

  // ----------------- Fan form submission (AJAX friendly) -----------------
  const form = document.getElementById('fanForm');
  const formMessage = document.getElementById('formMessage');
  if (form) {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      formMessage.textContent = 'Sending…';
      const data = new FormData(form);

      // NOTE: replace action in index.html with your Formspree endpoint if needed
      const action = form.getAttribute('action') || '/';
      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Accept': 'application/json' },
          body: data
        });
        if (res.ok) {
          formMessage.textContent = 'Thanks! Your submission was received and will be reviewed.';
          form.reset();
        } else {
          const json = await res.json();
          formMessage.textContent = (json && json.error) ? json.error : 'Submission failed — try again later.';
        }
      } catch (err) {
        formMessage.textContent = 'Network error — please try again later.';
        console.error(err);
      }

      // fade message
      setTimeout(() => { formMessage.textContent = ''; }, 7000);
    });
  }
});
