import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');

const files = [
  'index.html',
  'garage.html',
  'optimizer.html',
  'sync.html',
  'team.html',
  'leaderboard.html',
  'personal.html',
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

function copyAsRegularFile(source, target) {
  const data = readFileSync(source);
  mkdirSync(resolve(target, '..'), { recursive: true });
  writeFileSync(target, data);
}

function copyTreeAsRegular(source, target) {
  const stat = lstatSync(source);
  if (stat.isDirectory()) {
    mkdirSync(target, { recursive: true });
    for (const name of readdirSync(source)) {
      copyTreeAsRegular(resolve(source, name), resolve(target, name));
    }
    return;
  }
  copyAsRegularFile(source, target);
}

for (const file of files) {
  copyTreeAsRegular(resolve(root, file), resolve(dist, file));
}

copyTreeAsRegular(resolve(root, 'assets'), resolve(dist, 'assets'));

mkdirSync(resolve(dist, 'vendor'), { recursive: true });
copyAsRegularFile(resolve(root, 'node_modules/chart.js/dist/chart.umd.min.js'), resolve(dist, 'vendor/chart.umd.min.js'));
copyAsRegularFile(resolve(root, 'node_modules/tesseract.js/dist/tesseract.min.js'), resolve(dist, 'vendor/tesseract.min.js'));
copyAsRegularFile(resolve(root, 'node_modules/tesseract.js/dist/worker.min.js'), resolve(dist, 'vendor/worker.min.js'));