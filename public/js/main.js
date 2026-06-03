/* ===========================================================
   NFCunnect – Frontend-Logik
   - Bewertungen laden & anzeigen
   - Bewertungsformular absenden (POST /api/bewertung)
   - Kontaktformular via mailto an nfcunnect@outlook.com
   =========================================================== */

const KONTAKT_EMAIL = 'nfcunnect@outlook.com';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jahr').textContent = new Date().getFullYear();
  initNavigation();
  initRevealAnimation();
  initSterneEingabe();
  initBewertungForm();
  initKontaktForm();
  bewertungenLaden();
});

/* ---------- Navigation (Mobile-Menü) ---------- */
function initNavigation() {
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if (!burger || !links) return;

  burger.addEventListener('click', () => {
    const offen = links.classList.toggle('offen');
    burger.setAttribute('aria-expanded', String(offen));
  });
  links.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      links.classList.remove('offen');
      burger.setAttribute('aria-expanded', 'false');
    })
  );
}

/* ---------- Reveal beim Scrollen ---------- */
function initRevealAnimation() {
  const elemente = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elemente.forEach((el) => el.classList.add('sichtbar'));
    return;
  }
  const obs = new IntersectionObserver(
    (eintraege) => {
      eintraege.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('sichtbar');
          obs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elemente.forEach((el) => obs.observe(el));
}

/* ---------- Sterne-Eingabe ---------- */
function initSterneEingabe() {
  const container = document.getElementById('sterne-input');
  const hidden = document.getElementById('b-sterne');
  if (!container || !hidden) return;

  const sterne = [...container.querySelectorAll('.stern')];

  const malen = (wert) => {
    sterne.forEach((s) =>
      s.classList.toggle('aktiv', Number(s.dataset.wert) <= wert)
    );
  };

  sterne.forEach((stern) => {
    stern.addEventListener('mouseenter', () => malen(Number(stern.dataset.wert)));
    stern.addEventListener('click', () => {
      hidden.value = stern.dataset.wert;
      malen(Number(stern.dataset.wert));
    });
  });
  container.addEventListener('mouseleave', () => malen(Number(hidden.value)));
}

/* ---------- Bewertungen laden & rendern ---------- */
async function bewertungenLaden() {
  try {
    const res = await fetch('/api/bewertungen');
    if (!res.ok) throw new Error('Netzwerkfehler');
    const daten = await res.json();
    bewertungenRendern(daten);
  } catch (err) {
    console.error('Bewertungen konnten nicht geladen werden:', err);
  }
}

function sterneText(anzahl) {
  const voll = '★'.repeat(anzahl);
  const leer = '☆'.repeat(5 - anzahl);
  return { voll, leer };
}

function bewertungenRendern(daten) {
  const { anzahl, durchschnitt, verteilung, bewertungen } = daten;

  // Zusammenfassung
  document.getElementById('summary-avg').textContent =
    anzahl > 0 ? durchschnitt.toFixed(1).replace('.', ',') : '–';

  const gerundet = Math.round(durchschnitt);
  const { voll, leer } = sterneText(gerundet);
  document.getElementById('summary-stars').textContent = voll + leer;

  document.getElementById('summary-count').textContent =
    anzahl === 0
      ? 'Noch keine Bewertungen'
      : `${anzahl} Bewertung${anzahl === 1 ? '' : 'en'}`;

  // Verteilung
  const distEl = document.getElementById('summary-dist');
  distEl.innerHTML = '';
  for (let s = 5; s >= 1; s--) {
    const n = verteilung[s] || 0;
    const prozent = anzahl > 0 ? Math.round((n / anzahl) * 100) : 0;
    const row = document.createElement('div');
    row.className = 'dist-row';
    row.innerHTML = `
      <span class="dist-row__label">${s} ★</span>
      <span class="dist-bar"><span class="dist-bar__fill" style="width:${prozent}%"></span></span>
      <span class="dist-row__num">${n}</span>`;
    distEl.appendChild(row);
  }

  // Liste
  const liste = document.getElementById('bewertung-liste');
  liste.innerHTML = '';
  if (!bewertungen || bewertungen.length === 0) {
    liste.innerHTML =
      '<p class="bewertung-leer">Sei die/der Erste und hinterlasse eine Bewertung!</p>';
    return;
  }
  for (const b of bewertungen) {
    const sterne = sterneText(b.sterne);
    const datum = new Date(b.datum).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const el = document.createElement('article');
    el.className = 'bewertung';
    el.innerHTML = `
      <div class="bewertung__kopf">
        <span class="bewertung__name"></span>
        <span class="bewertung__datum">${datum}</span>
      </div>
      <div class="bewertung__sterne">${sterne.voll}<span class="leer">${sterne.leer}</span></div>
      <p class="bewertung__text"></p>`;
    // Inhalte sicher setzen (kein HTML-Injection)
    el.querySelector('.bewertung__name').textContent = b.name;
    el.querySelector('.bewertung__text').textContent = b.text;
    liste.appendChild(el);
  }
}

/* ---------- Bewertungsformular absenden ---------- */
function initBewertungForm() {
  const form = document.getElementById('bewertung-form');
  const status = document.getElementById('bewertung-status');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';
    status.textContent = '';

    const name = document.getElementById('b-name').value.trim();
    const sterne = Number(document.getElementById('b-sterne').value);
    const text = document.getElementById('b-text').value.trim();

    if (!name) return zeigeStatus(status, 'Bitte gib deinen Namen an.', false);
    if (!sterne) return zeigeStatus(status, 'Bitte wähle eine Sterne-Bewertung.', false);
    if (!text) return zeigeStatus(status, 'Bitte schreibe einen kurzen Text.', false);

    try {
      const res = await fetch('/api/bewertung', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, sterne, text })
      });
      const daten = await res.json();
      if (!res.ok) throw new Error(daten.fehler || 'Fehler beim Senden.');

      bewertungenRendern(daten);
      form.reset();
      document.getElementById('b-sterne').value = '0';
      document
        .querySelectorAll('#sterne-input .stern')
        .forEach((s) => s.classList.remove('aktiv'));
      zeigeStatus(status, 'Danke für deine Bewertung!', true);
    } catch (err) {
      zeigeStatus(status, err.message, false);
    }
  });
}

/* ---------- Kontaktformular via mailto ---------- */
function initKontaktForm() {
  const form = document.getElementById('kontakt-form');
  const status = document.getElementById('kontakt-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.className = 'form-status';

    const name = document.getElementById('k-name').value.trim();
    const email = document.getElementById('k-email').value.trim();
    const nachricht = document.getElementById('k-nachricht').value.trim();

    if (!name || !email || !nachricht) {
      return zeigeStatus(status, 'Bitte fülle alle Felder aus.', false);
    }

    const betreff = `Kontaktanfrage von ${name}`;
    const koerper =
      `Name: ${name}\n` +
      `E-Mail: ${email}\n\n` +
      `Nachricht:\n${nachricht}\n`;

    const mailto =
      `mailto:${KONTAKT_EMAIL}` +
      `?subject=${encodeURIComponent(betreff)}` +
      `&body=${encodeURIComponent(koerper)}`;

    window.location.href = mailto;
    zeigeStatus(
      status,
      'Dein E-Mail-Programm öffnet sich – bitte sende die Nachricht ab.',
      true
    );
  });
}

/* ---------- Hilfsfunktion ---------- */
function zeigeStatus(el, text, ok) {
  el.textContent = text;
  el.className = 'form-status ' + (ok ? 'ok' : 'err');
}
