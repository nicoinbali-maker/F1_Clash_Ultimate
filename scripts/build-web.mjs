import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');

const files = [
  'index.html',
  'optimizer.html',
  'registration.html',
  'hall-of-fame.html',
  'hallOfFame.js',
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