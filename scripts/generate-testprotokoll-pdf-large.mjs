import PDFDocument from 'pdfkit';
import { createWriteStream } from 'node:fs';
import { resolve } from 'node:path';

const outputPath = resolve(process.cwd(), 'Testprotokoll_F1ClashCompanion_Gross.pdf');
const doc = new PDFDocument({
  size: 'A4',
  margin: 46,
  info: {
    Title: 'F1 Clash Companion - Testprotokoll (Gross)',
    Author: 'F1 Clash Companion',
    Subject: 'Testprotokoll-Template Gross',
    Keywords: 'Test, Protokoll, F1 Clash, Gross'
  }
});

const stream = createWriteStream(outputPath);
doc.pipe(stream);

function heading(text) {
  doc.moveDown(0.45);
  doc.font('Helvetica-Bold').fontSize(14).text(text);
  doc.moveDown(0.2);
}

function check(text) {
  doc.font('Helvetica').fontSize(12.5).text(`[ ] ${text}`, { lineGap: 7 });
}

function noteLine() {
  doc.font('Helvetica').fontSize(12.5).text('__________________________________________________________________________');
}

doc.font('Helvetica-Bold').fontSize(20).text('F1 Clash Companion - Testprotokoll (Gross)');
doc.moveDown(0.35);
doc.font('Helvetica').fontSize(12.5).text('Datum: ____________    Tester: ____________');
doc.moveDown(0.5);

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

heading('3. Streckenubernahme');
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

doc.addPage();

heading('5. Testmodus-Sperren');
check('Save-Action gesperrt');
check('Sync-Action gesperrt');
check('Push/Notification-Action gesperrt');
check('Leaderboard-Refresh (produktiv) gesperrt');

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
for (let i = 0; i < 11; i += 1) noteLine();

heading('9. Priorisierte Fix-Liste fur nachste Session');
doc.font('Helvetica').fontSize(12.5).text('1. ________________________________________________');
doc.font('Helvetica').fontSize(12.5).text('2. ________________________________________________');
doc.font('Helvetica').fontSize(12.5).text('3. ________________________________________________');
doc.font('Helvetica').fontSize(12.5).text('4. ________________________________________________');
doc.font('Helvetica').fontSize(12.5).text('5. ________________________________________________');

doc.end();

stream.on('finish', () => {
  console.log(`PDF erstellt: ${outputPath}`);
});
