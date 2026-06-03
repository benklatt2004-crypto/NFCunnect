/* NFCunnect – Tab-Navigation & Interaktivität */

const MAIL = 'nfcunnect@outlook.com';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jahr').textContent = new Date().getFullYear();
  initTabs();
  initBurger();
  initCountUp();
  initKontakt();
});

/* ══════════════════════════════
   Tab-Navigation
   ══════════════════════════════ */
function initTabs() {
  // Alle Klick-Handler für Tab-Buttons (Header + Mobile + Buttons im Inhalt)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    e.preventDefault();
    switchTab(btn.dataset.tab);
  });
}

function switchTab(tabId) {
  // Alte aktive Seite ausblenden
  const currentPage = document.querySelector('.page--active');
  if (currentPage) currentPage.classList.remove('page--active');

  // Neue Seite einblenden
  const nextPage = document.getElementById(`page-${tabId}`);
  if (!nextPage) return;
  nextPage.classList.add('page--entering');
  nextPage.addEventListener('animationend', () => {
    nextPage.classList.remove('page--entering');
    nextPage.classList.add('page--active');
  }, { once: true });

  // Tabs aktualisieren
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('tab--active', t.dataset.tab === tabId);
  });

  // Mobile-Menü schließen
  const mobileNav = document.querySelector('.mobile-nav');
  const burger = document.querySelector('.burger');
  mobileNav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');

  // Scroll nach oben
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Zähler starten wenn Über-uns-Seite
  if (tabId === 'ueber') startCounters();
}

/* ══════════════════════════════
   Mobile Burger-Menü
   ══════════════════════════════ */
function initBurger() {
  const burger = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');

  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
  });
}

/* ══════════════════════════════
   Zähler-Animation (Über uns)
   ══════════════════════════════ */
let countersStarted = false;

function initCountUp() {
  // Wird bei Tab-Wechsel zu "ueber" aufgerufen
}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.stat__num[data-target]').forEach(countUp);
}

function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  const run = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target);
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}

function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ══════════════════════════════
   Kontaktformular → mailto
   ══════════════════════════════ */
function initKontakt() {
  const form   = document.getElementById('kontakt-form');
  const status = document.getElementById('kontakt-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status';

    const name      = document.getElementById('k-name').value.trim();
    const email     = document.getElementById('k-email').value.trim();
    const betreff   = document.getElementById('k-betreff').value.trim() || 'Kontaktanfrage NFCunnect';
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
