// Vérifie chaque page du guide dans Chrome sans fenêtre, au format mobile.
// Usage : node verifier.mjs [--final] [page.html …]   (sans page : toutes les pages)
import { readdirSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import puppeteer from 'puppeteer-core';

const ICI = dirname(fileURLToPath(import.meta.url));
const GUIDE = resolve(ICI, '..');
const CAPTURES = join(ICI, 'captures');
const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const FORMATS = [
  { nom: '390', width: 390, height: 844, sombre: false },
  { nom: '360', width: 360, height: 740, sombre: false },
  { nom: 'paysage', width: 844, height: 390, sombre: false },
  { nom: '390-sombre', width: 390, height: 844, sombre: true }
];
const TACTILES_AUTORISES = ['allumettes', 'pas-magiques'];
const SECTIONS_CHAPITRE = ['Ce qui coince', "L'idée", 'Image du monde réel', 'Autre point de vue', 'Tu peux maintenant expliquer'];

const args = process.argv.slice(2);
const final = args.includes('--final');
const demandees = args.filter((a) => a.endsWith('.html'));
const pages = demandees.length ? demandees : readdirSync(GUIDE).filter((f) => f.endsWith('.html')).sort();

mkdirSync(CAPTURES, { recursive: true });
const navigateur = await puppeteer.launch({ executablePath: CHROME, headless: true });
let echecs = 0;

for (const page of pages) {
  for (const format of FORMATS) {
    const onglet = await navigateur.newPage();
    const problemes = [];
    onglet.on('pageerror', (e) => problemes.push('erreur JS : ' + e.message));
    onglet.on('console', (m) => { if (m.type() === 'error') problemes.push('console : ' + m.text()); });
    onglet.on('requestfailed', (r) => problemes.push('ressource introuvable : ' + r.url()));
    onglet.on('request', (r) => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) problemes.push('requête réseau : ' + r.url()); });
    await onglet.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: format.sombre ? 'dark' : 'light' }]);
    await onglet.setViewport({ width: format.width, height: format.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await onglet.goto(pathToFileURL(join(GUIDE, page)).href, { waitUntil: 'load' });
    await new Promise((r) => setTimeout(r, 300));

    const mesure = await onglet.evaluate((tactilesAutorises) => {
      const motifInvalide = /\bNaN\b|Infinity|undefined|∞/;
      const resultat = {
        tactilesHauts: Array.from(document.querySelectorAll('canvas'))
          .filter((c) => c.style.touchAction === 'none' && c.getBoundingClientRect().height > 0.7 * window.innerHeight)
          .map((c) => (c.closest('[data-widget]') || {}).dataset?.widget || '?'),
        ciblesPetites: Array.from(document.querySelectorAll('summary, button, .barre-nav a'))
          .filter((e) => e.offsetParent !== null && e.getBoundingClientRect().height < 44)
          .map((e) => e.textContent.trim().slice(0, 30)),
        compteursCoupes: Array.from(document.querySelectorAll('.compteurs dd'))
          .filter((dd) => {
            if (dd.textContent.trim().length > 12) return false;
            const plage = document.createRange();
            plage.selectNodeContents(dd);
            return new Set(Array.from(plage.getClientRects()).map((r) => Math.round(r.top))).size > 1;
          })
          .map((dd) => dd.textContent.trim()),
        scrollWidth: document.documentElement.scrollWidth,
        largeur: window.innerWidth,
        liens: Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')),
        nav: Boolean(document.querySelector('.barre-nav')),
        widgetsErreur: document.querySelectorAll('.widget-erreur').length,
        widgets: document.querySelectorAll('[data-widget]').length,
        fond: getComputedStyle(document.documentElement).getPropertyValue('--fond').trim(),
        titres: Array.from(document.querySelectorAll('h2')).map((h) => h.textContent.trim()),
        classes: ['une-phrase', 'limite', 'curieux', 'plus-loin'].filter((c) => !document.querySelector('.' + c)),
        tactilesInterdits: Array.from(document.querySelectorAll('canvas'))
          .filter((c) => c.style.touchAction === 'none')
          .map((c) => (c.closest('[data-widget]') || {}).dataset?.widget || '?')
          .filter((w) => !tactilesAutorises.includes(w)),
        controles: window.Guide ? window.Guide.lancerControles() : [{ nom: 'socle', ok: false, message: 'window.Guide absent' }]
      };
      // Balayage des curseurs : on lit le texte au minimum et au maximum de chacun, puis on remet la valeur initiale.
      resultat.extremesInvalides = [];
      for (const entree of document.querySelectorAll('input[type=range]')) {
        const initiale = entree.value;
        for (const v of [entree.min, entree.max]) {
          entree.value = v;
          entree.dispatchEvent(new Event('input', { bubbles: true }));
          if (motifInvalide.test(document.body.innerText)) resultat.extremesInvalides.push((entree.closest('label')?.textContent || 'curseur').slice(0, 40) + ' = ' + v);
        }
        entree.value = initiale;
        entree.dispatchEvent(new Event('input', { bubbles: true }));
      }
      resultat.texte = document.body.innerText;
      return resultat;
    }, TACTILES_AUTORISES);

    if (mesure.scrollWidth > mesure.largeur) problemes.push(`défilement horizontal : ${mesure.scrollWidth} > ${mesure.largeur}`);
    if (!mesure.nav) problemes.push('barre de navigation absente');
    if (mesure.widgetsErreur) problemes.push(`${mesure.widgetsErreur} widget(s) introuvable(s)`);
    if (format.sombre && mesure.fond.toUpperCase() !== '#0F1115') problemes.push('mode sombre non appliqué : --fond = ' + mesure.fond);
    for (const w of mesure.tactilesInterdits) problemes.push('canvas qui bloque le défilement : ' + w);
    for (const lien of mesure.liens) {
      if (/^(https?:|mailto:|#)/.test(lien)) continue;
      if (!existsSync(join(GUIDE, lien.split('#')[0]))) problemes.push('lien cassé : ' + lien);
    }
    for (const c of mesure.controles) if (!c.ok) problemes.push(`contrôle ${c.nom} : ${c.message}`);
    if (/\bNaN\b|Infinity|undefined|∞/.test(mesure.texte)) problemes.push('valeur invalide affichée (NaN, Infinity, ∞ ou undefined)');
    for (const e of mesure.extremesInvalides) problemes.push('valeur invalide affichée au curseur extrême : ' + e);
    for (const w of mesure.tactilesHauts) problemes.push('canvas tactile plus haut que 70 % de l\'écran : ' + w);
    for (const t of mesure.ciblesPetites) problemes.push('cible tactile de moins de 44 px : ' + t);
    for (const t of mesure.compteursCoupes) problemes.push('compteur coupé sur plusieurs lignes : ' + t);
    if (!format.sombre && format.width < format.height) {
      // Redimensionnement en hauteur seule (barre d'outils mobile qui se replie) : rien ne doit être réalloué ni recadré.
      const avant = await onglet.evaluate(() => ({
        largeurs: Array.from(document.querySelectorAll('canvas')).map((c) => c.width + 'x' + c.height),
        origine: JSON.stringify((window.Guide.instances.allumettes || [])[0]?.etat.origine || null)
      }));
      await onglet.setViewport({ width: format.width, height: format.height - 100, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await new Promise((r) => setTimeout(r, 200));
      const apres = await onglet.evaluate(() => ({
        largeurs: Array.from(document.querySelectorAll('canvas')).map((c) => c.width + 'x' + c.height),
        origine: JSON.stringify((window.Guide.instances.allumettes || [])[0]?.etat.origine || null)
      }));
      if (avant.largeurs.join() !== apres.largeurs.join()) problemes.push('canvas réalloué sur un redimensionnement en hauteur seule');
      if (avant.origine !== apres.origine) problemes.push('construction recadrée sur un redimensionnement en hauteur seule');
      await onglet.setViewport({ width: format.width, height: format.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    }
    if (final) {
      if (/en cours de rédaction/i.test(mesure.texte)) problemes.push('texte provisoire restant');
      if (/^(0\d|1[0-3])-/.test(page)) {
        for (const s of SECTIONS_CHAPITRE) if (!mesure.titres.includes(s)) problemes.push('section manquante : ' + s);
        if (mesure.widgets && !mesure.titres.includes('À manipuler')) problemes.push('section manquante : À manipuler');
        for (const c of mesure.classes) problemes.push('élément manquant : .' + c);
      }
    }

    await onglet.screenshot({ path: join(CAPTURES, `${page.replace('.html', '').replace(/\//g, '_')}-${format.nom}.png`), fullPage: true });
    console.log(`${problemes.length ? 'ÉCHEC' : 'OK   '} ${page} @${format.nom} (${mesure.controles.length} contrôle(s))`);
    for (const p of problemes) console.log('        - ' + p);
    if (problemes.length) echecs++;
    await onglet.close();
  }
}

await navigateur.close();
console.log(echecs ? `${echecs} échec(s)` : 'Tout est vert.');
process.exit(echecs ? 1 : 0);
