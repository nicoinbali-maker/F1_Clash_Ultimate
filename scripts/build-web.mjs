import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');

const files = [
  'index.html',
  'garage.html',
  'optimizer.html',
  'sync.html',
  'registration.html',
  'hall-of-fame.html',
  'hallOfFame.js',
  'i18n.js',
  'script.js',
  'advanced.js',
  'style.css',
  'manifest.json',
  'sw.js'
];

if (existsSync(dist)) rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

for (const file of files) {
  cpSync(resolve(root, file), resolve(dist, file), { recursive: true });
}

cpSync(resolve(root, 'assets'), resolve(dist, 'assets'), { recursive: true });

mkdirSync(resolve(dist, 'vendor'), { recursive: true });
cpSync(resolve(root, 'node_modules/chart.js/dist/chart.umd.min.js'), resolve(dist, 'vendor/chart.umd.min.js'));
cpSync(resolve(root, 'node_modules/tesseract.js/dist/tesseract.min.js'), resolve(dist, 'vendor/tesseract.min.js'));
cpSync(resolve(root, 'node_modules/tesseract.js/dist/worker.min.js'), resolve(dist, 'vendor/worker.min.js'));