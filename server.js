/**
 * server.js – Express-Server für die NFCunnect-Website.
 *
 * Liefert die statische Website aus public/ aus und stellt eine kleine API
 * für die Bewertungen bereit. Die eigentliche Auswertung der Bewertungen
 * erfolgt in der separaten Datei auswertung.js.
 */

const express = require('express');
const path = require('path');
const { lesen, speichern, auswerten } = require('./auswertung');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * GET /api/bewertungen
 * Liefert die ausgewerteten Bewertungen (Anzahl, Durchschnitt, Verteilung, Liste).
 */
app.get('/api/bewertungen', (req, res) => {
  res.json(auswerten());
});

/**
 * POST /api/bewertung
 * Nimmt eine neue Bewertung entgegen, validiert sie, speichert sie und
 * liefert die aktualisierte Auswertung zurück.
 * Body: { name: string, sterne: number (1-5), text: string }
 */
app.post('/api/bewertung', (req, res) => {
  const { name, sterne, text } = req.body || {};

  const sterneZahl = Number(sterne);
  const nameClean = typeof name === 'string' ? name.trim() : '';
  const textClean = typeof text === 'string' ? text.trim() : '';

  // Validierung
  if (!nameClean || nameClean.length > 60) {
    return res.status(400).json({ fehler: 'Bitte einen gültigen Namen angeben (max. 60 Zeichen).' });
  }
  if (!Number.isInteger(sterneZahl) || sterneZahl < 1 || sterneZahl > 5) {
    return res.status(400).json({ fehler: 'Bitte eine Sterne-Bewertung zwischen 1 und 5 wählen.' });
  }
  if (!textClean || textClean.length > 1000) {
    return res.status(400).json({ fehler: 'Bitte einen Bewertungstext angeben (max. 1000 Zeichen).' });
  }

  const bewertungen = lesen();
  const neueBewertung = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    name: nameClean,
    sterne: sterneZahl,
    text: textClean,
    datum: new Date().toISOString()
  };

  bewertungen.push(neueBewertung);
  speichern(bewertungen);

  res.status(201).json(auswerten(bewertungen));
});

app.listen(PORT, () => {
  console.log(`NFCunnect-Website läuft auf http://localhost:${PORT}`);
});
