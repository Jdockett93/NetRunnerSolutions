// Netrunner Solutions — front-end interactions
// Set this if you wire a backend or Formspree/Netlify Forms.
const FORM_ENDPOINT = ""; // e.g., "https://formspree.io/f/xxxxxx"

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll (respects prefers-reduced-motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
}

// Back to top button
const topBtn = document.getElementById('top');
const showTop = () => {
  if (window.scrollY > 400) { topBtn.classList.add('show'); } else { topBtn.classList.remove('show'); }
};
window.addEventListener('scroll', showTop, { passive: true });
if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

// Form validation + fake submit
const form = document.getElementById('brief');
const submitBtn = document.getElementById('submitBtn');
const errorBox = document.getElementById('form-error');
const success = document.getElementById('success');

const validate = () => {
  if (!form) return false;
  errorBox.textContent = '';
  let ok = form.checkValidity();
  const honeypot = document.getElementById('company');
  if (honeypot && honeypot.value) ok = false; // bot
  submitBtn.disabled = !ok;
  return ok;
};

if (form) {
  form.addEventListener('input', validate);
  form.addEventListener('change', validate);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate()) {
      errorBox.textContent = 'Please fill in the required fields correctly.';
      return;
    }

    const data = new FormData(form);
    if (FORM_ENDPOINT) {
      try {
        const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: data });
        if (!res.ok) throw new Error('Network');
      } catch (err) {
        errorBox.textContent = 'Could not send right now. Please email hello@netrunnersolutions.au';
        return;
      }
    }
    success.style.display = 'block';
    form.reset();
    submitBtn.disabled = true;
  });
}
