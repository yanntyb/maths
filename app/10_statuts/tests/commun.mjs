// Outils partagés par les vérifications : chemins, bilan, serveur HTTP, navigateur.
import { createServer } from 'node:http';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

export const ICI = dirname(fileURLToPath(import.meta.url));
export const V10 = resolve(ICI, '..');
export const APP = resolve(V10, '..');
export const RACINE = resolve(APP, '..');
export const LEAN = join(RACINE, 'lean');
export const DOCS = join(RACINE, 'docs/theoreme/pythagore/cablages');
export const CAPTURES = join(ICI, 'captures');
export const STATUTS_JSON = join(V10, 'data/statuts.json');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export const FORMATS = [
  { nom: '1400', width: 1400, height: 850, mobile: false },
  { nom: '390', width: 390, height: 844, mobile: true },
  { nom: 'paysage', width: 844, height: 390, mobile: true },
];

let echecs = 0;
export const echec = (msg) => { echecs++; console.log('  ✗ ' + msg); };
export const ok = (msg) => console.log('  ✓ ' + msg);
export const nbEchecs = () => echecs;

export const lireStatuts = () => JSON.parse(readFileSync(STATUTS_JSON, 'utf8'));
export const cleRetrait = (r) => [...r].sort().join('+');

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8',
};

/** Sert app/ sur un port libre ; retourne { url, fermer }. */
export async function demarrerServeur() {
  const serveur = createServer((req, res) => {
    const chemin = join(APP, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!chemin.startsWith(APP) || !existsSync(chemin)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[extname(chemin)] ?? 'application/octet-stream' });
    res.end(readFileSync(chemin));
  });
  await new Promise((r) => serveur.listen(0, '127.0.0.1', r));
  return {
    url: `http://127.0.0.1:${serveur.address().port}/10_statuts/pythagore.html`,
    fermer: () => serveur.close(),
  };
}

export const lancerNavigateur = () => {
  mkdirSync(CAPTURES, { recursive: true });
  return puppeteer.launch({ executablePath: CHROME, headless: true });
};

/** Ouvre `url` au format donné ; collecte erreurs JS, erreurs console et requêtes échouées. */
export async function ouvrirPage(navigateur, format, url, intercepter = null) {
  const page = await navigateur.newPage();
  const problemes = [];
  page.on('pageerror', (e) => problemes.push('erreur JS : ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') problemes.push('console : ' + m.text()); });
  page.on('requestfailed', (r) => problemes.push('requête échouée : ' + r.url()));
  if (intercepter) {
    await page.setRequestInterception(true);
    page.on('request', intercepter);
  }
  await page.setViewport({ width: format.width, height: format.height, isMobile: format.mobile, hasTouch: format.mobile });
  await page.goto(url, { waitUntil: 'networkidle0' });
  return { page, problemes };
}
