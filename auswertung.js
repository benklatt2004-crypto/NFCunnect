/**
 * auswertung.js – Separate Auswertungsdatei für NFCunnect-Bewertungen.
 *
 * Liest die gespeicherten Bewertungen aus data/bewertungen.json und berechnet
 * eine Auswertung: Anzahl, Durchschnittsnote und Sterne-Verteilung (1–5).
 *
 * Verwendung:
 *   - Als Modul:  const { auswerten } = require('./auswertung');
 *   - Als CLI:    node auswertung.js   → gibt einen Report im Terminal aus
 */

const fs = require('fs');
const path = require('path');

const DATEN_PFAD = path.join(__dirname, 'data', 'bewertungen.json');

/**
 * Liest die Bewertungen robust aus der Datei.
 * Liefert bei fehlender oder kaputter Datei ein leeres Array.
 * @returns {Array<{id:string, name:string, sterne:number, text:string, datum:string}>}
 */
function lesen() {
  try {
    const inhalt = fs.readFileSync(DATEN_PFAD, 'utf8').trim();
    if (!inhalt) return [];
    const daten = JSON.parse(inhalt);
    return Array.isArray(daten) ? daten : [];
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Konnte Bewertungen nicht lesen:', err.message);
    }
    return [];
  }
}

/**
 * Schreibt die Bewertungen zurück in die Datei.
 * @param {Array} bewertungen
 */
function speichern(bewertungen) {
  fs.mkdirSync(path.dirname(DATEN_PFAD), { recursive: true });
  fs.writeFileSync(DATEN_PFAD, JSON.stringify(bewertungen, null, 2) + '\n', 'utf8');
}

/**
 * Wertet die übergebenen (oder gelesenen) Bewertungen aus.
 * @param {Array} [bewertungen] – optionale Liste, sonst wird gelesen
 * @returns {{
 *   anzahl:number,
 *   durchschnitt:number,
 *   verteilung:{1:number,2:number,3:number,4:number,5:number},
 *   bewertungen:Array
 * }}
 */
function auswerten(bewertungen = lesen()) {
  const verteilung = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let summe = 0;

  for (const b of bewertungen) {
    const s = Number(b.sterne);
    if (Number.isInteger(s) && s >= 1 && s <= 5) {
      verteilung[s] += 1;
      summe += s;
    }
  }

  const anzahl = bewertungen.length;
  const durchschnitt = anzahl > 0 ? Math.round((summe / anzahl) * 10) / 10 : 0;

  // Neueste Bewertungen zuerst.
  const sortiert = [...bewertungen].sort(
    (a, b) => new Date(b.datum) - new Date(a.datum)
  );

  return { anzahl, durchschnitt, verteilung, bewertungen: sortiert };
}

/**
 * Gibt einen lesbaren Auswertungs-Report im Terminal aus.
 */
function reportAusgeben() {
  const { anzahl, durchschnitt, verteilung } = auswerten();

  console.log('============================================');
  console.log('   NFCunnect – Auswertung der Bewertungen');
  console.log('============================================');
  console.log(`Anzahl Bewertungen:   ${anzahl}`);
  console.log(`Durchschnittsnote:    ${durchschnitt} / 5 Sterne`);
  console.log('--------------------------------------------');
  console.log('Verteilung:');
  for (let s = 5; s >= 1; s--) {
    const n = verteilung[s];
    const anteil = anzahl > 0 ? Math.round((n / anzahl) * 100) : 0;
    const balken = '█'.repeat(Math.round(anteil / 5));
    console.log(`  ${s} ★ | ${String(n).padStart(3)} | ${balken} ${anteil}%`);
  }
  console.log('============================================');
}

module.exports = { lesen, speichern, auswerten, DATEN_PFAD };

// Direkter Aufruf via "node auswertung.js" → Report ausgeben.
if (require.main === module) {
  reportAusgeben();
}
