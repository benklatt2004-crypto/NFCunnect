/*  NFCunnect – main.js
    Web3Forms key → replace if changed
    ─────────────────────────────────── */
const MAIL          = 'nfcunnect@outlook.com';
const WEB3FORMS_KEY = 'a4bbb1a1-e07c-46e8-a015-ccc167ac1241';

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('jahr').textContent = new Date().getFullYear();

  lucide.createIcons();   // Lucide renders all <i data-lucide="…">

  initScrollProgress();
  initTabs();
  initBurger();
  initCountUp();
  initKontakt();
  initThumbs();
  initHeroTilt();
  initProduktTilt();
  initHowSteps();
  initTapDemo();
  initTypewriter();
  initReveal();
});

/* ══════════════════════════════
   Scroll Progress Bar
   ══════════════════════════════ */
function initScrollProgress() {
  const bar    = document.getElementById('scroll-progress');
  const header = document.getElementById('header');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ══════════════════════════════
   Tab-Navigation
   ══════════════════════════════ */
function initTabs() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tab]');
    if (!btn) return;
    e.preventDefault();
    switchTab(btn.dataset.tab);
  });
}

function switchTab(tabId) {
  const current = document.querySelector('.page--active');
  if (current) current.classList.remove('page--active');

  const next = document.getElementById(`page-${tabId}`);
  if (!next) return;

  next.classList.add('page--entering');
  next.addEventListener('animationend', () => {
    next.classList.remove('page--entering');
    next.classList.add('page--active');
    // Re-run reveals for new tab
    triggerReveal();
    // Re-render Lucide icons in case tab was hidden
    lucide.createIcons();
  }, { once: true });

  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('tab--active', t.dataset.tab === tabId);
  });

  const mobileNav = document.querySelector('.mobile-nav');
  const burger    = document.querySelector('.burger');
  mobileNav.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.setAttribute('aria-hidden', 'true');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (tabId === 'ueber') startCounters();
}

/* ══════════════════════════════
   Burger Menu
   ══════════════════════════════ */
function initBurger() {
  const burger    = document.querySelector('.burger');
  const mobileNav = document.querySelector('.mobile-nav');
  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    mobileNav.setAttribute('aria-hidden', String(!open));
  });
}

/* ══════════════════════════════
   Scroll-Reveal (Intersection Observer)
   ══════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Stagger siblings
      const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
      const i = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${i * 70}ms`;
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function initReveal() {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}
function triggerReveal() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
}

/* ══════════════════════════════
   Typewriter – Hero
   ══════════════════════════════ */
const typeWords = ['Networking.', 'dein Instagram.', 'WLAN teilen.', 'Google Bewertungen.', 'deine Visitenkarte.', 'Events & Messen.'];
let twIdx = 0, twChar = 0, twDeleting = false;

function initTypewriter() {
  const el = document.getElementById('typewriter-word');
  if (!el) return;
  tick();

  function tick() {
    const word = typeWords[twIdx];
    if (!twDeleting) {
      el.textContent = word.slice(0, ++twChar);
      if (twChar === word.length) { twDeleting = true; setTimeout(tick, 1600); return; }
    } else {
      el.textContent = word.slice(0, --twChar);
      if (twChar === 0) { twDeleting = false; twIdx = (twIdx + 1) % typeWords.length; }
    }
    setTimeout(tick, twDeleting ? 48 : 72);
  }
}

/* ══════════════════════════════
   Hero product – 3D tilt on mousemove
   ══════════════════════════════ */
function initHeroTilt() {
  const tilt = document.getElementById('hero-tilt');
  if (!tilt) return;

  tilt.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = tilt.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - .5) * 18;
    const y = ((e.clientY - top)  / height - .5) * -18;
    tilt.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) scale(1.04)`;
    tilt.style.transition = 'transform .08s linear';
  });
  tilt.addEventListener('mouseleave', () => {
    tilt.style.transform = '';
    tilt.style.transition = 'transform .5s cubic-bezier(0.22,1,0.36,1)';
  });
}

/* ══════════════════════════════
   Produkt – 3D tilt
   ══════════════════════════════ */
function initProduktTilt() {
  const stage = document.getElementById('produkt-tilt');
  if (!stage) return;

  stage.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = stage.getBoundingClientRect();
    const x = ((e.clientX - left) / width  - .5) * 14;
    const y = ((e.clientY - top)  / height - .5) * -14;
    stage.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${y}deg)`;
    stage.style.transition = 'transform .08s linear';
  });
  stage.addEventListener('mouseleave', () => {
    stage.style.transform = '';
    stage.style.transition = 'transform .55s cubic-bezier(0.22,1,0.36,1)';
  });
}

/* ══════════════════════════════
   Wie es funktioniert – Interactive Steps
   ══════════════════════════════ */
function initHowSteps() {
  const steps = document.querySelectorAll('.how-step');
  if (!steps.length) return;

  let active = -1;
  steps.forEach((step, i) => {
    step.addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
      active = i;
    });
    step.addEventListener('mouseenter', () => step.classList.add('active'));
    step.addEventListener('mouseleave', () => {
      if (active !== i) step.classList.remove('active');
    });
  });
}

/* ══════════════════════════════
   NFC-Tap Demo
   ══════════════════════════════ */
const tapMessages = [
  'Chip erkannt … ✓',
  'Öffne digitale Visitenkarte …',
  'Cunnected! 🔗',
];

function initTapDemo() {
  const btn  = document.getElementById('tap-demo');
  const hint = document.getElementById('tap-hint');
  if (!btn || !hint) return;

  let running = false;
  btn.addEventListener('click', async () => {
    if (running) return;
    running = true;
    btn.classList.add('tapping');

    for (const msg of tapMessages) {
      hint.textContent = msg;
      await delay(900);
    }

    await delay(1200);
    hint.textContent = '';
    btn.classList.remove('tapping');
    running = false;
  });
}
const delay = ms => new Promise(r => setTimeout(r, ms));

/* ══════════════════════════════
   Thumbnail-Galerie (Produktseite)
   ══════════════════════════════ */
function initThumbs() {
  const thumbs  = document.querySelectorAll('.thumb');
  const mainImg = document.getElementById('produkt-main');
  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const newSrc = thumb.dataset.img;
      if (mainImg.getAttribute('src') === newSrc) return;

      mainImg.style.opacity = '0';
      const swap = () => {
        mainImg.src = newSrc;
        mainImg.style.opacity = '1';
        mainImg.removeEventListener('transitionend', swap);
      };
      mainImg.addEventListener('transitionend', swap, { once: true });
      setTimeout(() => { if (mainImg.style.opacity === '0') swap(); }, 240);

      thumbs.forEach(t => t.classList.remove('thumb--active'));
      thumb.classList.add('thumb--active');
    });
  });
}

/* ══════════════════════════════
   Zähler-Animation
   ══════════════════════════════ */
let countersStarted = false;
function initCountUp() {}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('.stat__num[data-target]').forEach(countUp);
}
function countUp(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start    = performance.now();
  const run = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(easeOut(t) * target);
    if (t < 1) requestAnimationFrame(run);
  };
  requestAnimationFrame(run);
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ══════════════════════════════
   Kontaktformular – Web3Forms
   ══════════════════════════════ */
function initKontakt() {
  const form    = document.getElementById('kontakt-form');
  const status  = document.getElementById('kontakt-status');
  const counter = document.getElementById('char-count');
  const textarea = document.getElementById('k-nachricht');
  if (!form) return;

  // Zeichenzähler
  if (textarea && counter) {
    textarea.addEventListener('input', () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / 500`;
      counter.style.color = len > 450 ? 'var(--ember)' : '';
    });
  }

  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.className = 'form-status';

    const name      = document.getElementById('k-name').value.trim();
    const email     = document.getElementById('k-email').value.trim();
    const betreff   = document.getElementById('k-betreff').value.trim() || 'Kontaktanfrage NFCunnect';
    const nachricht = textarea.value.trim();

    if (!name || !email || !nachricht) {
      status.textContent = 'Bitte fülle alle Pflichtfelder aus.';
      status.className   = 'form-status err';
      return;
    }

    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === 'DEIN-ACCESS-KEY') {
      const body = `Name: ${name}\nE-Mail: ${email}\n\n${nachricht}`;
      window.location.href = `mailto:${MAIL}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Dein E-Mail-Programm öffnet sich.';
      status.className   = 'form-status ok';
      return;
    }

    const origText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Senden …';

    try {
      const res  = await fetch('https://api.web3forms.com/submit', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject:    `[NFCunnect] ${betreff}`,
          from_name:  name,
          name, email,
          replyto:    email,
          message:    nachricht,
          botcheck:   form.botcheck.checked,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        status.textContent = 'Danke! Wir melden uns bald.';
        status.className   = 'form-status ok';
        form.reset();
        if (counter) counter.textContent = '0 / 500';
      } else throw new Error(data.message);
    } catch {
      status.textContent = `Senden hat nicht geklappt. Schreib uns direkt: ${MAIL}`;
      status.className   = 'form-status err';
    } finally {
      submitBtn.disabled    = false;
      submitBtn.textContent = origText;
      lucide.createIcons(); // restore icon in button
    }
  });
}
