/* NFCunnect – Frontend JS */

const MAIL = 'nfcunnect@outlook.com';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jahr').textContent = new Date().getFullYear();
  initNav();
  initReveal();
  initCountUp();
  initKontakt();
});

/* ── Mobile Navigation ── */
function initNav() {
  const burger = document.querySelector('.nav__burger');
  const links  = document.querySelector('.nav__links');
  if (!burger) return;
  burger.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      links.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ── Scroll-Reveal ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── Zähler-Animation (Über-uns Stats) ── */
function initCountUp() {
  const nums = document.querySelectorAll('.stat__num[data-target]');
  if (!('IntersectionObserver' in window)) {
    nums.forEach(el => { el.textContent = el.dataset.target; });
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      countUp(e.target);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => obs.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const val = Math.round(easeOut(progress) * target);
    el.textContent = val;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ── Kontaktformular → mailto ── */
function initKontakt() {
  const form   = document.getElementById('kontakt-form');
  const status = document.getElementById('kontakt-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    status.className = 'form-status';

    const name      = document.getElementById('k-name').value.trim();
    const email     = document.getElementById('k-email').value.trim();
    const betreff   = document.getElementById('k-betreff').value.trim() || 'Kontaktanfrage';
    const nachricht = document.getElementById('k-nachricht').value.trim();

    if (!name || !email || !nachricht) {
      status.textContent = 'Bitte fülle alle Pflichtfelder aus.';
      status.className   = 'form-status err';
      return;
    }

    const body =
      `Name: ${name}\n` +
      `E-Mail: ${email}\n\n` +
      `${nachricht}`;

    window.location.href =
      `mailto:${MAIL}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}`;

    status.textContent = 'Dein E-Mail-Programm öffnet sich — bitte Nachricht absenden.';
    status.className   = 'form-status ok';
  });
}
