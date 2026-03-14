import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

function getArg(name) {
  const key = `--${name}=`;
  const hit = process.argv.find((arg) => arg.startsWith(key));
  return hit ? hit.slice(key.length).trim() : '';
}

const today = new Date();
const defaultDate = `${String(today.getDate()).padStart(2, '0')}.${String(today.getMonth() + 1).padStart(2, '0')}.${today.getFullYear()}`;
const tester = getArg('tester') || '____________';
const dateText = getArg('date') || defaultDate;
const outFile = getArg('out') || 'Testprotokoll_F1ClashCompanion.pdf';

const outputPath = resolve(process.cwd(), outFile);
const doc = new PDFDocument({
  size: 'A4',
  margin: 50,
  info: {
    Title: 'F1 Clash Companion - Testprotokoll',
    Author: 'F1 Clash Companion',
    Subject: 'Testprotokoll-Template',
    Keywords: 'Test, Protokoll, F1 Clash'
  }
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

const lineGap = 6;

function heading(text) {
  doc.moveDown(0.3);
  doc.font('Helvetica-Bold').fontSize(13).text(text);
  doc.moveDown(0.2);
}

function check(text) {
  doc.font('Helvetica').fontSize(11).text(`[ ] ${text}`, { lineGap });
}

function noteLine() {
  doc.font('Helvetica').fontSize(11).text('______________________________________________________________');
}

doc.font('Helvetica-Bold').fontSize(18).text('F1 Clash Companion - Testprotokoll');
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(11).text(`Datum: ${dateText}    Tester: ${tester}`);
doc.moveDown(0.6);

heading('1. Umgebung');
check('Gerat: ____________________');
check('Android-Version: ____________________');
check('Installierte APK: F1ClashCompanion_Ultimate-debug-latest.apk');
check('APK-Zeitstempel gepruft: ____________________');

heading('2. Start & Navigation');
check('App startet ohne Crash');
check('optimizer.html offnet korrekt');
check('Button "Streckenwahl Seite offnen" funktioniert');
check('Rucksprung von track-selection.html zu Optimizer funktioniert');

heading('3. Streckenubernahme (jeweils Badge + Optimizer-Reaktion)');
check('Bahrain ubernommen');
check('Emilia Romagna ubernommen');
check('United Kingdom ubernommen');
check('United States ubernommen');
check('Abu Dhabi ubernommen');
check('5x Wechsel in Folge ohne Aussetzer');

heading('4. Optimizer-Funktionen (Testmodus)');
check('AutoSetup erstellen funktioniert');
check('Bestes Setup / Optimizer lauft');
check('Alle Strecken simulieren lauft');
check('Strategie kalkulieren lauft');
check('Race-Simulation lauft');

heading('5. Testmodus-Sperren (sollen gesperrt sein)');
check('Save-Action gesperrt');
check('Sync-Action gesperrt');
check('Push/Notification-Action gesperrt');
check('Leaderboard-Refresh (produktiv) gesperrt');

if (doc.y > 710) {
  doc.addPage();
}

heading('6. Fehlerbild / Konsole');
check('Keine roten Fehler in Konsole');
check('Falls Fehler: erste Fehlermeldung notiert');
check('Betroffene Seite notiert');
check('Betroffene Strecke notiert');

heading('7. Ergebnis');
check('Test bestanden');
check('Teilweise bestanden');
check('Nicht bestanden');

heading('8. Notizen');
noteLine();
noteLine();
noteLine();
noteLine();

heading('9. Priorisierte Fix-Liste fur nachste Session');
doc.font('Helvetica').fontSize(11).text('1. ____________________');
doc.font('Helvetica').fontSize(11).text('2. ____________________');
doc.font('Helvetica').fontSize(11).text('3. ____________________');

doc.end();

stream.on('finish', () => {
  console.log(`PDF erstellt: ${outputPath}`);
});
