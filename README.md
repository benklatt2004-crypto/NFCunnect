NFCunnect ist eine Juniorfirma von uns. 
Sie erstellt Kupferschlüsselanhänger mit beklebtem, individuell programmierbarem NFC-Chip. 
Die Unternehmensfarben sind der CI zu entnehmen.
Fokus beim Programmierung auf Neuwertigkeit, Bewegung und Interaktion legen.

---

# Website

Dieses Repository enthält die Website der Juniorfirma NFCunnect mit einem
Kontaktformular und einem Bewertungssystem.

## Funktionen

- **Startseite** im CI-Design (Orange `#E87018` / Schwarz) mit Logo und Produktbild
- **Kontaktformular** – öffnet das E-Mail-Programm vorausgefüllt an
  `nfcunnect@outlook.com` (mailto)
- **Bewertungsformular** mit Sterne-Eingabe – Bewertungen werden in
  `data/bewertungen.json` gespeichert
- **Auswertung** der Bewertungen in der separaten Datei `auswertung.js`
  (Anzahl, Durchschnitt, Sterne-Verteilung) und Darstellung direkt auf der Website

## Voraussetzungen

- [Node.js](https://nodejs.org/) (Version 16 oder neuer)

## Installation & Start

```bash
npm install      # Abhängigkeiten installieren
npm start        # Server starten
```

Anschließend die Website im Browser öffnen: <http://localhost:3000>

## Auswertung der Bewertungen

Die Bewertungen können jederzeit separat im Terminal ausgewertet werden:

```bash
node auswertung.js
```

Das gibt einen Report mit Anzahl, Durchschnittsnote und Sterne-Verteilung aus.

## Projektstruktur

```
.
├── server.js              # Express-Server (Auslieferung + API)
├── auswertung.js          # Separate Auswertung der Bewertungen (Modul + CLI)
├── data/bewertungen.json  # Gespeicherte Bewertungen
└── public/                # Website (HTML, CSS, JS, Assets)
```
