import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const dist = resolve(root, 'dist');
const androidAssetsRoot = resolve(root, 'android/app/src/main/assets');
const androidPublic = resolve(androidAssetsRoot, 'public');

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

if (!existsSync(dist)) {
  throw new Error('dist folder missing. Run npm run build:web first.');
}

if (existsSync(androidPublic)) rmSync(androidPublic, { recursive: true, force: true });
mkdirSync(androidPublic, { recursive: true });

copyTreeAsRegular(dist, androidPublic);
copyAsRegularFile(resolve(root, 'capacitor.config.json'), resolve(androidAssetsRoot, 'capacitor.config.json'));
