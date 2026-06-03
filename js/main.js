/* NFCunnect – Tab-Navigation & Interaktivität */

const MAIL = 'nfcunnect@outlook.com';

/* ════════════════════════════════════════════════════════════
   ► WEB3FORMS ACCESS-KEY HIER EINTRAGEN ◄
   1. Auf https://web3forms.com kostenlos mit eurer Mail registrieren
      (Empfänger-Adresse: nfcunnect@outlook.com)
   2. Den Access-Key kopieren und unten zwischen die Anführungszeichen
      einfügen — fertig, die Mail geht dann direkt raus.
   Solange hier 'DEIN-ACCESS-KEY' steht, öffnet sich als Fallback
   weiterhin das Mailprogramm.
   ════════════════════════════════════════════════════════════ */
const WEB3FORMS_KEY = 'DEIN-ACCESS-KEY';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jahr').textContent = new Date().getFullYear();
  initTabs();
  initBurger();
  initCountUp();
  initKontakt();
  initSwatches();
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
   Kontaktformular → Direktversand (Web3Forms)
   ══════════════════════════════ */
function initKontakt() {
  const form   = document.getElementById('kontakt-form');
  const status = document.getElementById('kontakt-status');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
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

    // Fallback: solange kein Access-Key hinterlegt ist → Mailprogramm öffnen
    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === 'DEIN-ACCESS-KEY') {
      const body = `Name: ${name}\nE-Mail: ${email}\n\n${nachricht}`;
      window.location.href =
        `mailto:${MAIL}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Dein E-Mail-Programm öffnet sich — bitte Nachricht absenden.';
      status.className   = 'form-status ok';
      return;
    }

    // Direktversand über Web3Forms
    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Senden …';
    status.textContent = 'Nachricht wird gesendet …';

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[NFCunnect] ${betreff}`,
          from_name: name,
          name,
          email,
          replyto: email,
          message: nachricht,
          botcheck: form.botcheck.checked
        })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        status.textContent = 'Danke! Deine Nachricht wurde gesendet — wir melden uns bald.';
        status.className   = 'form-status ok';
        form.reset();
      } else {
        throw new Error(data.message || 'Senden fehlgeschlagen');
      }
    } catch (err) {
      status.textContent = 'Senden hat nicht geklappt. Bitte später erneut versuchen oder direkt an ' + MAIL + ' schreiben.';
      status.className   = 'form-status err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = origText;
    }
  });
}

/* ══════════════════════════════
   Produkt – Finish-Varianten (ein Produkt, mehrere Looks)
   ══════════════════════════════ */
function initSwatches() {
  const swatches = document.querySelectorAll('.swatch');
  const mainImg  = document.getElementById('produkt-main');
  const label    = document.getElementById('produkt-finish');
  if (!swatches.length || !mainImg) return;

  swatches.forEach(sw => {
    sw.addEventListener('click', () => {
      const newSrc = sw.dataset.img;
      if (mainImg.getAttribute('src') === newSrc) return;

      // sanfte Überblendung
      mainImg.style.opacity = '0';
      const swap = () => {
        mainImg.src = newSrc;
        mainImg.alt = `NFCunnect Anhänger – Finish ${sw.dataset.finish}`;
        if (label) label.textContent = sw.dataset.finish;
        mainImg.style.opacity = '1';
        mainImg.removeEventListener('transitionend', swap);
      };
      mainImg.addEventListener('transitionend', swap, { once: true });
      // Fallback falls keine Transition feuert
      setTimeout(() => { if (mainImg.style.opacity === '0') swap(); }, 220);

      swatches.forEach(s => s.classList.remove('swatch--active'));
      sw.classList.add('swatch--active');
    });
  });
}
