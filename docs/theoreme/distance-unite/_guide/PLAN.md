# Guide « distance unité » — plan d'exécution

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal :** construire le guide web mobile qui mène un non-mathématicien jusqu'à la compréhension de la preuve, puis le publier sous `tyb-tech.fr/unit-distance/`.

**Architecture :** site statique sans dépendance. 16 pages HTML (sommaire, 14 chapitres, lexique), une feuille de style et un socle JS partagés (`window.Guide`), 9 widgets canvas qui s'attachent à des `<div data-widget>`. Chaque widget expose un modèle pur et un contrôle chiffré, que lance un vérificateur Chrome sans fenêtre au format mobile.

**Tech Stack :** HTML5, CSS, JavaScript ES5/ES2015 en scripts classiques, canvas 2D. Tests : Node + `puppeteer-core@23.11.1` avec le Chrome du système. Publication : rsync vers le site Laravel / FrankenPHP.

**Spec :** `docs/theoreme/distance-unite/_guide/CONCEPTION.md`

Tous les chemins relatifs ci-dessous partent de `docs/theoreme/distance-unite/_guide/`.

## Global Constraints

- Aucune dépendance, aucun CDN : HTML + CSS + JS pur, canvas 2D, scripts classiques (pas de modules ES), liens relatifs uniquement.
- Mobile d'abord : texte ≥ 17 px, interligne 1,6, marges latérales de 16 px, aucun défilement horizontal, cibles tactiles ≥ 44 px, `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- Français non technique, avec accents, uniquement dans `_guide/`.
- Formules uniquement dans les encadrés `<details class="curieux">`, en texte Unicode simple.
- Chaque analogie est suivie de sa limite (`<p class="limite">`).
- Palette : bleu `#3B82F6`, vert `#10B981`, rouge `#EF4444`, ambre `#F59E0B`, indigo `#6366F1`, sarcelle `#0F766E` ; mode sombre via `prefers-color-scheme`.
- Schémas en SVG intégré, dessinés à la verticale ; pas de mermaid.
- Liens « pour aller plus loin » : `https://github.com/yanntyb/maths/blob/main/docs/theoreme/distance-unite/...`
- Aucun commit ni push, dans le repo maths comme dans le site, sans demande explicite. Les étapes « Point de contrôle » remplacent les commits.
- Site : ne modifier que `public/unit-distance/`, plus éventuellement la redirection de la tâche 13, avec son test Pest.
- Publication : exclure `CONCEPTION.md`, `PLAN.md`, `publier.sh`, `tests/`.

## Review Focus

1. **Rotation du téléphone** : passer en paysage puis revenir doit redimensionner les canvas sans défilement horizontal. Le vérificateur teste un format paysage 844×390 (tâche 1).
2. **Mode sombre** : les dessins doivent rester lisibles sur fond sombre, avec les couleurs relues à chaque dessin. Le vérificateur charge chaque page en mode sombre et contrôle `--fond` (tâche 1).
3. **Défilement bloqué** : un canvas en `touch-action: none` empêche de faire défiler la page avec le doigt. Seuls `allumettes` et `pas-magiques` y ont droit ; le vérificateur le contrôle (tâche 1).
4. **Curseurs aux extrêmes** : aucune valeur `NaN`, `Infinity` ou `undefined` ne doit apparaître quand un curseur est poussé au minimum puis au maximum. Le vérificateur balaie tous les curseurs (tâche 1).
5. **Hors ligne** : aucune requête réseau. Le vérificateur échoue sur toute requête non `file://` (tâche 1).

---

### Task 1 : socle, pages squelettes, vérificateur

**Files :**
- Create : `tests/package.json`, `tests/.gitignore`, `tests/verifier.mjs`
- Create : `assets/guide.css`, `assets/guide.js`
- Create : `index.html`, `lexique.html`, les 14 pages `NN-*.html` (squelettes)

**Interfaces :**
- Consumes : rien.
- Produces :
  - `window.Guide.CHAPITRES` : `[{ num: '01', fichier: '01-le-defi.html', titre: 'Le défi' }, …]` (14 entrées)
  - `Guide.enregistrerWidget(nom, fabrique)` avec `fabrique(zone: HTMLElement, options: DOMStringMap) -> instance`
  - `Guide.enregistrerControle(nom, fn)` avec `fn() -> { ok: boolean, message: string }`
  - `Guide.lancerControles() -> [{ nom, ok, message }]`
  - `Guide.instances[nom] -> instance[]`
  - `Guide.couleurs() -> { bleu, vert, rouge, ambre, indigo, sarcelle, texte, discret, fond, surface, trait }`
  - `Guide.toile(zone, { rapport, alt }) -> { canvas, ctx, largeur, hauteur, ajuster(), quandRedimensionne(fn) }`
  - `Guide.pointeur(canvas, { appui, deplacement, relache })` : chaque rappel reçoit `({ x, y }, evenement)` en pixels CSS du canvas
  - `Guide.barre(zone) -> HTMLElement` (conteneur de contrôles)
  - `Guide.curseur(parent, { nom, min, max, pas, valeur, format, change }) -> { entree, valeur(), fixer(v) }`
  - `Guide.bouton(parent, texte, action, { bascule, actif }) -> HTMLButtonElement`
  - `Guide.compteurs(parent) -> { fixer(cle, nom, texte) }`
  - `Guide.hasard(graine) -> () -> nombre dans [0, 1)`
  - `Guide.nombre(x, decimales) -> chaîne au format français`
  - `Guide.chiffres(log10) -> « un nombre de N chiffres »`
  - Page de chapitre : `<body data-chapitre="NN">` ; zone de widget : `<div class="widget-zone" data-widget="nom" data-…>` dans une `<section class="widget">`

- [ ] **Step 1 : installer l'outil de test**

`tests/package.json` :

```json
{
  "name": "guide-distance-unite-tests",
  "private": true,
  "type": "module",
  "scripts": {
    "verifier": "node verifier.mjs",
    "final": "node verifier.mjs --final"
  },
  "devDependencies": {
    "puppeteer-core": "23.11.1"
  }
}
```

`tests/.gitignore` :

```
node_modules/
captures/
```

Run : `cd tests && npm install`
Expected : `added … packages`, pas d'erreur.

- [ ] **Step 2 : écrire le vérificateur (le test qui doit échouer)**

`tests/verifier.mjs` :

```js
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
      const resultat = {
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
      // Balayage des curseurs : minimum, maximum, puis valeur initiale.
      for (const entree of document.querySelectorAll('input[type=range]')) {
        const initiale = entree.value;
        for (const v of [entree.min, entree.max, initiale]) {
          entree.value = v;
          entree.dispatchEvent(new Event('input', { bubbles: true }));
        }
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
    if (/\bNaN\b|Infinity|undefined/.test(mesure.texte)) problemes.push('valeur invalide affichée (NaN, Infinity ou undefined)');
    if (final) {
      if (/en cours de rédaction/i.test(mesure.texte)) problemes.push('texte provisoire restant');
      if (/^(0\d|1[0-3])-/.test(page)) {
        for (const s of SECTIONS_CHAPITRE) if (!mesure.titres.includes(s)) problemes.push('section manquante : ' + s);
        if (mesure.widgets && !mesure.titres.includes('À manipuler')) problemes.push('section manquante : À manipuler');
        for (const c of mesure.classes) problemes.push('élément manquant : .' + c);
      }
    }

    await onglet.screenshot({ path: join(CAPTURES, `${page.replace('.html', '')}-${format.nom}.png`), fullPage: true });
    console.log(`${problemes.length ? 'ÉCHEC' : 'OK   '} ${page} @${format.nom} (${mesure.controles.length} contrôle(s))`);
    for (const p of problemes) console.log('        - ' + p);
    if (problemes.length) echecs++;
    await onglet.close();
  }
}

await navigateur.close();
console.log(echecs ? `${echecs} échec(s)` : 'Tout est vert.');
process.exit(echecs ? 1 : 0);
```

- [ ] **Step 3 : lancer le vérificateur pour le voir échouer**

Run : `cd tests && node verifier.mjs index.html`
Expected : la page n'existe pas encore ; le script s'arrête sur `net::ERR_FILE_NOT_FOUND` avec un code de sortie non nul.

- [ ] **Step 4 : écrire `assets/guide.css`**

```css
/* Guide « distance unité » : mise en page mobile d'abord, mode sombre automatique. */
:root {
  --bleu: #3B82F6; --vert: #10B981; --rouge: #EF4444; --ambre: #F59E0B; --indigo: #6366F1; --sarcelle: #0F766E;
  --fond: #FAFAF7; --surface: #FFFFFF; --texte: #1F2937; --discret: #6B7280; --trait: #E5E7EB;
  --accent: #0F766E; --encadre: #F0FDFA;
}
@media (prefers-color-scheme: dark) {
  :root {
    --fond: #0F1115; --surface: #171A21; --texte: #E5E7EB; --discret: #9CA3AF; --trait: #2A2F3A;
    --accent: #2DD4BF; --sarcelle: #2DD4BF; --encadre: #10201E;
  }
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0; background: var(--fond); color: var(--texte);
  font: 17px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  padding-bottom: calc(72px + env(safe-area-inset-bottom));
}
main { max-width: 40rem; margin: 0 auto; padding: 16px; }
h1 { font-size: 1.6rem; line-height: 1.25; margin: 0.25rem 0 1rem; }
h2 { font-size: 1.15rem; line-height: 1.3; margin: 2rem 0 0.5rem; color: var(--accent); }
p, li, dd { overflow-wrap: break-word; }
a { color: var(--accent); }
.numero { font-size: 0.85rem; color: var(--discret); letter-spacing: 0.08em; text-transform: uppercase; margin: 0; }
.une-phrase { font-size: 1.1rem; border-left: 4px solid var(--accent); padding: 0.25rem 0 0.25rem 0.75rem; margin: 1rem 0; }
.limite { font-size: 0.95rem; color: var(--discret); border-left: 3px solid var(--ambre); padding-left: 0.75rem; }
details.curieux { background: var(--encadre); border-radius: 10px; padding: 0 1rem; margin: 1.5rem 0; }
details.curieux summary { cursor: pointer; font-weight: 600; min-height: 44px; display: flex; align-items: center; }
details.curieux[open] { padding-bottom: 0.75rem; }
.formule { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.95rem; white-space: pre-wrap; overflow-wrap: anywhere; }
.expliquer { background: var(--surface); border: 1px solid var(--trait); border-radius: 10px; padding: 0.25rem 1rem; }
.plus-loin { font-size: 0.9rem; color: var(--discret); margin-top: 2rem; }
figure { margin: 1.5rem 0; }
figure svg { width: 100%; height: auto; display: block; }
figcaption { font-size: 0.9rem; color: var(--discret); margin-top: 0.5rem; }
.widget { background: var(--surface); border: 1px solid var(--trait); border-radius: 12px; padding: 12px; margin: 1.5rem 0; }
.widget-titre { font-weight: 600; margin: 0 0 0.25rem; }
.widget-consigne { font-size: 0.95rem; color: var(--discret); margin: 0 0 0.75rem; }
.widget-zone { width: 100%; }
.widget-canvas { display: block; border-radius: 8px; background: var(--fond); max-width: 100%; }
.widget-barre { display: flex; flex-wrap: wrap; gap: 8px 10px; margin-top: 10px; }
.curseur { display: grid; grid-template-columns: 1fr auto; align-items: center; width: 100%; gap: 0 8px; font-size: 0.95rem; }
.curseur input { grid-column: 1 / -1; width: 100%; min-height: 44px; accent-color: var(--accent); }
.curseur-valeur { font-variant-numeric: tabular-nums; font-weight: 600; }
.bouton {
  font: inherit; font-size: 0.95rem; min-height: 44px; padding: 0 14px; border-radius: 8px;
  border: 1.5px solid var(--accent); background: transparent; color: var(--accent); cursor: pointer;
}
.bouton[aria-pressed="true"] { background: var(--accent); color: var(--surface); }
.compteurs { display: grid; grid-template-columns: auto 1fr; gap: 2px 12px; margin: 10px 0 0; font-size: 0.95rem; }
.compteurs dt { color: var(--discret); }
.compteurs dd { margin: 0; font-weight: 600; font-variant-numeric: tabular-nums; }
.widget-erreur { color: var(--rouge); }
.barre-nav {
  position: fixed; left: 0; right: 0; bottom: 0; z-index: 10;
  display: flex; align-items: center; justify-content: space-between; gap: 4px;
  padding: 4px 8px calc(4px + env(safe-area-inset-bottom));
  background: var(--surface); border-top: 1px solid var(--trait); font-size: 0.95rem;
}
.barre-nav a, .barre-nav span { min-height: 44px; display: flex; align-items: center; padding: 0 8px; text-decoration: none; }
.barre-nav .inactif { color: var(--discret); opacity: 0.4; }
.progression { color: var(--discret); font-variant-numeric: tabular-nums; }
.sommaire { list-style: none; padding: 0; margin: 0; }
.sommaire a { display: flex; gap: 12px; min-height: 48px; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--trait); text-decoration: none; color: var(--texte); }
.sommaire .num { color: var(--accent); font-variant-numeric: tabular-nums; font-weight: 600; }
.terme { border-bottom: 1px solid var(--trait); padding: 0.75rem 0; }
.terme h3 { font-size: 1.05rem; margin: 0; }
.terme p { margin: 0.25rem 0 0; }
.terme .technique { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 0.9rem; color: var(--discret); }
```

- [ ] **Step 5 : écrire `assets/guide.js`**

```js
/* Guide « distance unité » : socle partagé par toutes les pages.
   Scripts classiques, aucune dépendance. Expose window.Guide. */
(function () {
  'use strict';

  var CHAPITRES = [
    { num: '01', fichier: '01-le-defi.html', titre: 'Le défi' },
    { num: '02', fichier: '02-petit-grand-tres-grand.html', titre: 'Petit, grand, très grand' },
    { num: '03', fichier: '03-la-recette-d-erdos.html', titre: "La recette d'Erdős" },
    { num: '04', fichier: '04-pourquoi-elle-s-essouffle.html', titre: "Pourquoi elle s'essouffle" },
    { num: '05', fichier: '05-changer-de-point-de-vue.html', titre: 'Changer de point de vue' },
    { num: '06', fichier: '06-les-pas-magiques.html', titre: 'Les pas magiques' },
    { num: '07', fichier: '07-les-tiroirs.html', titre: 'Les tiroirs' },
    { num: '08', fichier: '08-la-fenetre-et-le-coup-de-des.html', titre: 'La fenêtre et le coup de dés' },
    { num: '09', fichier: '09-pas-trop-de-points.html', titre: 'Pas trop de points' },
    { num: '10', fichier: '10-le-bilan.html', titre: 'Le bilan' },
    { num: '11', fichier: '11-le-cahier-des-charges.html', titre: 'Le cahier des charges' },
    { num: '12', fichier: '12-construire-la-tour.html', titre: 'Construire la tour' },
    { num: '13', fichier: '13-les-tiroirs-restent-peu-nombreux.html', titre: 'Les tiroirs restent peu nombreux' },
    { num: '14', fichier: '14-toute-la-preuve-en-une-page.html', titre: 'Toute la preuve en une page' }
  ];

  var fabriques = {};
  var controles = {};
  var instances = {};
  var toiles = [];

  function enregistrerWidget(nom, fabrique) { fabriques[nom] = fabrique; }
  function enregistrerControle(nom, fn) { controles[nom] = fn; }

  function lancerControles() {
    return Object.keys(controles).map(function (nom) {
      try {
        var r = controles[nom]();
        return { nom: nom, ok: Boolean(r && r.ok), message: (r && r.message) || '' };
      } catch (e) {
        return { nom: nom, ok: false, message: String((e && e.message) || e) };
      }
    });
  }

  function variable(nom) { return getComputedStyle(document.documentElement).getPropertyValue(nom).trim(); }

  function couleurs() {
    return {
      bleu: variable('--bleu'), vert: variable('--vert'), rouge: variable('--rouge'), ambre: variable('--ambre'),
      indigo: variable('--indigo'), sarcelle: variable('--sarcelle'), texte: variable('--texte'),
      discret: variable('--discret'), fond: variable('--fond'), surface: variable('--surface'), trait: variable('--trait')
    };
  }

  /** Canvas à la largeur du conteneur, net sur écran haute densité. rapport = hauteur / largeur. */
  function toile(zone, options) {
    var rapport = (options && options.rapport) || 0.75;
    var el = document.createElement('canvas');
    el.className = 'widget-canvas';
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', (options && options.alt) || '');
    zone.appendChild(el);
    var t = { canvas: el, ctx: el.getContext('2d'), largeur: 0, hauteur: 0, rappels: [] };
    t.ajuster = function () {
      var largeur = Math.max(200, Math.floor(zone.clientWidth || 320));
      var hauteur = Math.floor(largeur * rapport);
      var dpr = window.devicePixelRatio || 1;
      el.width = Math.floor(largeur * dpr);
      el.height = Math.floor(hauteur * dpr);
      el.style.width = largeur + 'px';
      el.style.height = hauteur + 'px';
      t.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      t.largeur = largeur;
      t.hauteur = hauteur;
      t.rappels.forEach(function (fn) { fn(); });
    };
    t.quandRedimensionne = function (fn) { t.rappels.push(fn); };
    t.ajuster();
    toiles.push(t);
    return t;
  }

  /** Pointeur unifié (souris, toucher, stylet). Bloque le défilement sur ce canvas : à réserver aux widgets à glisser. */
  function pointeur(el, rappels) {
    function position(e) { var r = el.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', function (e) {
      try { el.setPointerCapture(e.pointerId); } catch (ignore) { /* évènement synthétique */ }
      if (rappels.appui) rappels.appui(position(e), e);
    });
    el.addEventListener('pointermove', function (e) { if (rappels.deplacement) rappels.deplacement(position(e), e); });
    ['pointerup', 'pointercancel'].forEach(function (type) {
      el.addEventListener(type, function (e) { if (rappels.relache) rappels.relache(position(e), e); });
    });
  }

  function barre(zone) { var d = document.createElement('div'); d.className = 'widget-barre'; zone.appendChild(d); return d; }

  function curseur(parent, o) {
    var etiquette = document.createElement('label');
    etiquette.className = 'curseur';
    var nom = document.createElement('span');
    nom.textContent = o.nom;
    var sortie = document.createElement('output');
    sortie.className = 'curseur-valeur';
    var entree = document.createElement('input');
    entree.type = 'range';
    entree.min = o.min; entree.max = o.max; entree.step = o.pas || 1; entree.value = o.valeur;
    function afficher() { var v = Number(entree.value); sortie.textContent = o.format ? o.format(v) : String(v); }
    entree.addEventListener('input', function () { afficher(); if (o.change) o.change(Number(entree.value)); });
    afficher();
    etiquette.appendChild(nom); etiquette.appendChild(sortie); etiquette.appendChild(entree);
    parent.appendChild(etiquette);
    return {
      entree: entree,
      valeur: function () { return Number(entree.value); },
      fixer: function (v) { entree.value = v; afficher(); if (o.change) o.change(Number(entree.value)); }
    };
  }

  function bouton(parent, texte, action, options) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'bouton';
    b.textContent = texte;
    if (options && options.bascule) b.setAttribute('aria-pressed', options.actif ? 'true' : 'false');
    b.addEventListener('click', function () {
      if (options && options.bascule) b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      action(b.getAttribute('aria-pressed') === 'true');
    });
    parent.appendChild(b);
    return b;
  }

  function compteurs(parent) {
    var dl = document.createElement('dl');
    dl.className = 'compteurs';
    parent.appendChild(dl);
    var lignes = {};
    return {
      fixer: function (cle, nom, texte) {
        if (!lignes[cle]) {
          var dt = document.createElement('dt'); dt.textContent = nom;
          var dd = document.createElement('dd');
          dl.appendChild(dt); dl.appendChild(dd);
          lignes[cle] = dd;
        }
        lignes[cle].textContent = texte;
      }
    };
  }

  /** Générateur pseudo-aléatoire reproductible (mulberry32). */
  function hasard(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function nombre(x, decimales) {
    return Number(x).toLocaleString('fr-FR', { minimumFractionDigits: decimales || 0, maximumFractionDigits: decimales || 0 });
  }

  function chiffres(log10) {
    var n = Math.floor(log10) + 1;
    return 'un nombre de ' + nombre(n) + ' chiffre' + (n > 1 ? 's' : '');
  }

  function monterWidgets() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-widget]'), function (zone) {
      var nom = zone.getAttribute('data-widget');
      if (!fabriques[nom]) {
        zone.textContent = 'Widget introuvable : ' + nom;
        zone.classList.add('widget-erreur');
        return;
      }
      (instances[nom] = instances[nom] || []).push(fabriques[nom](zone, zone.dataset));
    });
  }

  function lien(chapitre, texte) {
    var a = document.createElement('a');
    a.href = chapitre.fichier;
    a.textContent = texte;
    return a;
  }

  function inactif(texte) { var s = document.createElement('span'); s.className = 'inactif'; s.textContent = texte; return s; }

  function construireNavigation() {
    var num = document.body.getAttribute('data-chapitre');
    var i = -1;
    CHAPITRES.forEach(function (c, k) { if (c.num === num) i = k; });
    var nav = document.createElement('nav');
    nav.className = 'barre-nav';
    nav.setAttribute('aria-label', 'Navigation entre les chapitres');
    var gauche, droite, milieu = document.createElement('a');
    milieu.href = 'index.html';
    milieu.textContent = 'Sommaire';
    if (num === 'lexique') {
      gauche = lien(CHAPITRES[CHAPITRES.length - 1], '← 14');
      droite = inactif('—');
    } else if (i < 0) {
      gauche = inactif('—');
      droite = lien(CHAPITRES[0], 'Commencer →');
    } else {
      gauche = i > 0 ? lien(CHAPITRES[i - 1], '← ' + CHAPITRES[i - 1].num) : lien({ fichier: 'index.html' }, '← Accueil');
      droite = i < CHAPITRES.length - 1 ? lien(CHAPITRES[i + 1], CHAPITRES[i + 1].num + ' →') : lien({ fichier: 'lexique.html' }, 'Lexique →');
      var progression = document.createElement('span');
      progression.className = 'progression';
      progression.textContent = CHAPITRES[i].num + ' / ' + CHAPITRES.length;
      nav.appendChild(gauche); nav.appendChild(milieu); nav.appendChild(progression); nav.appendChild(droite);
      document.body.appendChild(nav);
      return;
    }
    nav.appendChild(gauche); nav.appendChild(milieu); nav.appendChild(droite);
    document.body.appendChild(nav);
  }

  function redessinerTout() { toiles.forEach(function (t) { t.ajuster(); }); }

  window.addEventListener('resize', redessinerTout);
  if (window.matchMedia) {
    var requete = window.matchMedia('(prefers-color-scheme: dark)');
    if (requete.addEventListener) requete.addEventListener('change', redessinerTout);
  }
  document.addEventListener('DOMContentLoaded', function () { construireNavigation(); monterWidgets(); });

  window.Guide = {
    CHAPITRES: CHAPITRES, instances: instances,
    enregistrerWidget: enregistrerWidget, enregistrerControle: enregistrerControle, lancerControles: lancerControles,
    couleurs: couleurs, toile: toile, pointeur: pointeur, barre: barre, curseur: curseur, bouton: bouton,
    compteurs: compteurs, hasard: hasard, nombre: nombre, chiffres: chiffres
  };
})();
```

- [ ] **Step 6 : écrire les 16 pages squelettes**

Gabarit d'un chapitre (exemple `05-changer-de-point-de-vue.html` ; même modèle pour les 14 chapitres, avec `NN`, le titre et le fichier tirés de `Guide.CHAPITRES`) :

```html
<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>05 · Changer de point de vue — Distance unité</title>
<link rel="stylesheet" href="assets/guide.css">
</head>
<body data-chapitre="05">
<main>
  <p class="numero">Chapitre 05 / 14</p>
  <h1>Changer de point de vue</h1>
  <p>Chapitre en cours de rédaction.</p>
</main>
<script src="assets/guide.js"></script>
</body>
</html>
```

`index.html` (`<body>` sans `data-chapitre`) : titre « Le grand guide de la distance unité », un paragraphe d'accroche provisoire et le sommaire complet :

```html
<ol class="sommaire">
  <li><a href="01-le-defi.html"><span class="num">01</span><span>Le défi</span></a></li>
  <!-- … une ligne par chapitre, 01 à 14, mêmes fichiers et titres que Guide.CHAPITRES … -->
  <li><a href="lexique.html"><span class="num">≡</span><span>Lexique</span></a></li>
</ol>
```

`lexique.html` : `<body data-chapitre="lexique">`, titre « Lexique », paragraphe « Chapitre en cours de rédaction. »

- [ ] **Step 7 : lancer le vérificateur pour le voir passer**

Run : `cd tests && node verifier.mjs`
Expected : 64 lignes `OK` (16 pages × 4 formats), puis `Tout est vert.`. Ouvrir `tests/captures/05-changer-de-point-de-vue-390.png` et `…-390-sombre.png` : barre du bas `← 04 · Sommaire · 05 / 14 · 06 →`, fond sombre dans la seconde capture.

- [ ] **Step 8 : point de contrôle**

Montrer à l'utilisateur deux captures (clair et sombre). Pas de commit sans demande.

---

### Task 2 : widget `allumettes` + chapitre 01

**Files :**
- Create : `assets/widgets/allumettes.js`
- Modify : `01-le-defi.html` (contenu complet + zone de widget + script)

**Interfaces :**
- Consumes : `Guide.enregistrerWidget`, `Guide.enregistrerControle`, `Guide.toile`, `Guide.pointeur`, `Guide.barre`, `Guide.bouton`, `Guide.compteurs`, `Guide.couleurs`, `Guide.instances`
- Produces : `window.Allumettes = { compter(points) -> [[i, j]], modeles: { triangle, hexagone, triangulaire, erdos } -> [{x, y}], aimanter(pos, points, ignorer) -> {x, y}, intersections(a, b) -> [{x, y}] }` ; instance `{ etat: { points }, toile, vider(), charger(nomModele) }`

- [ ] **Step 1 : écrire le contrôle (test) en tête de `assets/widgets/allumettes.js`**

```js
/* Widget « allumettes » : poser des clous, voir les paires à distance exactement 1. */
Guide.enregistrerControle('allumettes', function () {
  var hex = Allumettes.modeles.hexagone();
  var nHex = Allumettes.compter(hex).length;
  if (hex.length !== 7 || nHex !== 12) return { ok: false, message: 'hexagone + centre : ' + hex.length + ' clous, ' + nHex + ' allumettes (attendu 7 et 12)' };
  var nTri = Allumettes.compter(Allumettes.modeles.triangulaire()).length;
  if (nTri !== 18) return { ok: false, message: 'grille triangulaire : ' + nTri + ' allumettes (attendu 18)' };
  var nErd = Allumettes.compter(Allumettes.modeles.erdos()).length;
  if (nErd !== 36) return { ok: false, message: "grille d'Erdős : " + nErd + ' allumettes (attendu 36)' };
  var inter = Allumettes.intersections({ x: 0, y: 0 }, { x: 1, y: 0 });
  if (inter.length !== 2 || Math.abs(Math.hypot(inter[0].x, inter[0].y) - 1) > 1e-12) return { ok: false, message: 'intersections de cercles fausses' };
  var inst = (Guide.instances.allumettes || [])[0];
  if (inst) {
    inst.vider();
    var r = inst.toile.canvas.getBoundingClientRect();
    ['pointerdown', 'pointerup'].forEach(function (type) {
      inst.toile.canvas.dispatchEvent(new PointerEvent(type, { clientX: r.left + r.width / 2, clientY: r.top + r.height / 2, pointerId: 1, pointerType: 'touch', bubbles: true }));
    });
    var n = inst.etat.points.length;
    inst.charger('hexagone');
    if (n !== 1) return { ok: false, message: 'un toucher devrait poser 1 clou, il en pose ' + n };
  }
  return { ok: true, message: '' };
});
```

Ajouter dans `01-le-defi.html`, avant `</body>` : `<script src="assets/widgets/allumettes.js"></script>`, et dans `<main>` :

```html
<h2>À manipuler</h2>
<section class="widget">
  <p class="widget-titre">Allumettes sur une table</p>
  <p class="widget-consigne">Touche pour poser un clou, glisse pour le déplacer, touche un clou pour l'enlever. L'aimant colle les clous à distance 1.</p>
  <div class="widget-zone" data-widget="allumettes"></div>
</section>
```

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `cd tests && node verifier.mjs 01-le-defi.html`
Expected : ÉCHEC, avec `contrôle allumettes : Allumettes is not defined` et `widget(s) introuvable(s)`.

- [ ] **Step 3 : écrire le modèle (après le contrôle, même fichier)**

```js
var Allumettes = (function () {
  'use strict';
  var TOLERANCE = 1e-6;
  var R3 = Math.sqrt(3);

  function compter(points) {
    var aretes = [];
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
        if (Math.abs(d - 1) < TOLERANCE) aretes.push([i, j]);
      }
    }
    return aretes;
  }

  var modeles = {
    triangle: function () { return [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0.5, y: R3 / 2 }]; },
    hexagone: function () {
      var pts = [{ x: 0, y: 0 }];
      for (var k = 0; k < 6; k++) pts.push({ x: Math.cos(k * Math.PI / 3), y: Math.sin(k * Math.PI / 3) });
      return pts;
    },
    triangulaire: function () {
      var pts = [];
      for (var j = 0; j <= 3; j++) for (var i = 0; i <= 3 - j; i++) pts.push({ x: i + j / 2, y: j * R3 / 2 });
      return pts;
    },
    erdos: function () {
      var pts = [];
      for (var a = 0; a <= 5; a++) for (var b = 0; b <= 5; b++) pts.push({ x: a / 5, y: b / 5 });
      return pts;
    }
  };

  function intersections(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy);
    if (d === 0 || d > 2) return [];
    var h = Math.sqrt(Math.max(0, 1 - d * d / 4)), mx = a.x + dx / 2, my = a.y + dy / 2;
    return [{ x: mx - dy / d * h, y: my + dx / d * h }, { x: mx + dy / d * h, y: my - dx / d * h }];
  }

  function aimanter(pos, points, ignorer) {
    var proches = [];
    points.forEach(function (p, i) {
      if (i === ignorer) return;
      var d = Math.hypot(pos.x - p.x, pos.y - p.y);
      if (d > 0 && Math.abs(d - 1) < 0.12) proches.push({ p: p, ecart: Math.abs(d - 1) });
    });
    proches.sort(function (a, b) { return a.ecart - b.ecart; });
    if (proches.length >= 2) {
      var meilleur = null, dmin = 0.15;
      intersections(proches[0].p, proches[1].p).forEach(function (q) {
        var d = Math.hypot(q.x - pos.x, q.y - pos.y);
        if (d < dmin) { dmin = d; meilleur = q; }
      });
      if (meilleur) return meilleur;
    }
    if (proches.length >= 1) {
      var c = proches[0].p, dx = pos.x - c.x, dy = pos.y - c.y, n = Math.hypot(dx, dy);
      return { x: c.x + dx / n, y: c.y + dy / n };
    }
    return pos;
  }

  return { compter: compter, modeles: modeles, aimanter: aimanter, intersections: intersections };
})();
```

- [ ] **Step 4 : écrire la vue (fin du fichier)**

```js
Guide.enregistrerWidget('allumettes', function (zone) {
  var etat = { points: Allumettes.modeles.hexagone(), aimant: true, echelle: 60, origine: { x: 0, y: 0 } };
  var toile = Guide.toile(zone, { rapport: 0.8, alt: 'Plan où l\'on pose des clous ; chaque paire à distance 1 est reliée par une allumette.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var prise = null;

  function cadrer() {
    var l = toile.largeur, h = toile.hauteur;
    if (!etat.points.length) { etat.echelle = l / 6; etat.origine = { x: l / 2, y: h / 2 }; return; }
    var xs = etat.points.map(function (p) { return p.x; }), ys = etat.points.map(function (p) { return p.y; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    etat.echelle = Math.min((l - 60) / Math.max(maxx - minx, 1), (h - 60) / Math.max(maxy - miny, 1), l / 3);
    etat.origine = { x: l / 2 - (minx + maxx) / 2 * etat.echelle, y: h / 2 + (miny + maxy) / 2 * etat.echelle };
  }
  function versEcran(p) { return { x: etat.origine.x + p.x * etat.echelle, y: etat.origine.y - p.y * etat.echelle }; }
  function versPlan(e) { return { x: (e.x - etat.origine.x) / etat.echelle, y: (etat.origine.y - e.y) / etat.echelle }; }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx;
    ctx.clearRect(0, 0, toile.largeur, toile.hauteur);
    var aretes = Allumettes.compter(etat.points);
    ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = c.ambre;
    aretes.forEach(function (a) {
      var p = versEcran(etat.points[a[0]]), q = versEcran(etat.points[a[1]]);
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
    });
    etat.points.forEach(function (pt) {
      var p = versEcran(pt);
      ctx.beginPath(); ctx.arc(p.x, p.y, 7, 0, 2 * Math.PI); ctx.fillStyle = c.bleu; ctx.fill();
    });
    var n = etat.points.length;
    compteurs.fixer('clous', 'Clous', String(n));
    compteurs.fixer('allumettes', 'Allumettes', String(aretes.length));
    compteurs.fixer('ratio', 'Allumettes par clou', n ? Guide.nombre(aretes.length / n, 2) : '0');
  }

  function charger(nom) { etat.points = Allumettes.modeles[nom](); cadrer(); dessiner(); }
  function vider() { etat.points = []; cadrer(); dessiner(); }

  Guide.pointeur(toile.canvas, {
    appui: function (e) {
      var proche = -1;
      etat.points.forEach(function (pt, i) { var p = versEcran(pt); if (Math.hypot(p.x - e.x, p.y - e.y) < 22) proche = i; });
      if (proche >= 0) { prise = { indice: proche, bouge: false, nouveau: false }; return; }
      var pos = versPlan(e);
      if (etat.aimant) pos = Allumettes.aimanter(pos, etat.points, -1);
      etat.points.push(pos);
      prise = { indice: etat.points.length - 1, bouge: false, nouveau: true };
      dessiner();
    },
    deplacement: function (e) {
      if (!prise) return;
      var pos = versPlan(e);
      if (etat.aimant) pos = Allumettes.aimanter(pos, etat.points, prise.indice);
      etat.points[prise.indice] = pos;
      prise.bouge = true;
      dessiner();
    },
    relache: function () {
      if (prise && !prise.bouge && !prise.nouveau) etat.points.splice(prise.indice, 1);
      prise = null;
      dessiner();
    }
  });

  Guide.bouton(barre, 'Triangle', function () { charger('triangle'); });
  Guide.bouton(barre, 'Hexagone + centre', function () { charger('hexagone'); });
  Guide.bouton(barre, 'Grille triangulaire', function () { charger('triangulaire'); });
  Guide.bouton(barre, "Grille d'Erdős", function () { charger('erdos'); });
  Guide.bouton(barre, 'Tout effacer', vider);
  Guide.bouton(barre, 'Aimant', function (actif) { etat.aimant = actif; }, { bascule: true, actif: true });

  toile.quandRedimensionne(function () { cadrer(); dessiner(); });
  cadrer();
  dessiner();
  return { etat: etat, toile: toile, vider: vider, charger: charger };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 01-le-defi.html`
Expected : 4 × `OK … (1 contrôle(s))`, puis `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 01 (remplace « Chapitre en cours de rédaction. »)**

Gabarit de la spec, section 4, dans cet ordre : `.une-phrase`, `h2` « Ce qui coince », « L'idée », « Image du monde réel » (+ `.limite`), « Autre point de vue », « À manipuler » (le widget déjà inséré), `details.curieux`, « Tu peux maintenant expliquer » (`.expliquer`), `.plus-loin`. Contenu obligatoire :

- **En une phrase** : on pose n clous sur une table et on compte les paires de clous séparées d'exactement une longueur d'allumette ; jusqu'où ce nombre peut-il monter ?
- **Ce qui coince** (premier chapitre : le point de départ) : la question d'Erdős, posée en 1946. Exemples : 3 clous en triangle donnent 3 allumettes ; un hexagone avec son centre donne 7 clous et 12 allumettes. Chaque clou est limité : deux cercles se croisent en au plus deux points.
- **L'idée** : on regarde le nombre moyen d'allumettes par clou. Erdős pensait que ce nombre grandit, mais terriblement lentement, plus lentement que n'importe quelle petite puissance de n. On sait aussi qu'on ne dépasse jamais à peu près n^{4/3} allumettes. La preuve étudiée montre qu'Erdős se trompait : on peut obtenir n fois une vraie puissance de n, pour une infinité de n.
- **Image** : un réseau social où « être amis » veut dire « être à distance exactement 1 ». **Limite** : dans un vrai réseau, tout le monde peut être ami avec tout le monde ; ici la géométrie l'interdit.
- **Autre point de vue** : chaque clou est le centre d'un cercle de rayon 1 ; une allumette, c'est un clou posé sur le cercle d'un autre. La question devient : combien de fois des cercles passent-ils par des clous ?
- **Pour les curieux** : `ν(P) = nombre de paires {x, y} de P avec |x − y| = 1` ; `ν(n) = le maximum sur tous les ensembles de n points` ; conjecture d'Erdős : `ν(n) ≤ n^{1 + C/log log n}` ; résultat : `ν(n) ≥ n^{1+δ}` pour une infinité de n, avec un δ > 0 fixe. Chaque formule est suivie de sa traduction mot à mot.
- **Tu peux maintenant expliquer** : « Le problème : poser n points pour avoir le plus possible de paires à distance exactement 1. Erdős pensait qu'on ne dépasse jamais n multiplié par un bonus minuscule. La preuve montre qu'on peut obtenir n multiplié par une vraie puissance de n. »
- **Pour aller plus loin** : `README.md` du théorème (sections Sens et Contrat).

- [ ] **Step 7 : vérifier et regarder**

Run : `cd tests && node verifier.mjs 01-le-defi.html`
Expected : `Tout est vert.` Ouvrir `captures/01-le-defi-390.png` : texte lisible, widget à pleine largeur, aucun débordement.

- [ ] **Step 8 : point de contrôle** (pas de commit sans demande)

---

### Task 3 : widget `croissances` + chapitre 02

**Files :**
- Create : `assets/widgets/croissances.js`
- Modify : `02-petit-grand-tres-grand.html`

**Interfaces :**
- Consumes : socle (tâche 1)
- Produces : `window.Croissances = { lnn(x), exposantErdos(x, C), log10log10Croisement(C, delta), chiffresCroisement(C, delta) }`, avec `x = log10(log10 n)`

- [ ] **Step 1 : écrire le contrôle en tête de `assets/widgets/croissances.js`**

```js
/* Widget « croissances » : le bonus lent d'Erdős contre une petite puissance fixe. */
Guide.enregistrerControle('croissances', function () {
  var chiffres = Croissances.chiffresCroisement(1, 0.1);
  if (Math.abs(chiffres - 9565.97) > 0.1) return { ok: false, message: 'croisement pour C = 1, δ = 0,1 : ' + chiffres + ' chiffres (attendu ≈ 9 565,97)' };
  var x = Croissances.log10log10Croisement(1.7, 0.03);
  var e = Croissances.exposantErdos(x, 1.7);
  if (Math.abs(e - 1.03) > 1e-9) return { ok: false, message: 'au croisement, l\'exposant d\'Erdős vaut ' + e + ' au lieu de 1,03' };
  if (!isFinite(Croissances.log10log10Croisement(3, 0.01))) return { ok: false, message: 'débordement pour C/δ = 300' };
  return { ok: true, message: '' };
});
```

Ajouter dans `02-petit-grand-tres-grand.html` la section « À manipuler » (titre « La tortue et le lièvre », consigne « Baisse δ : le croisement s'éloigne, mais ne disparaît jamais. »), `<div class="widget-zone" data-widget="croissances"></div>` et `<script src="assets/widgets/croissances.js"></script>`.

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `cd tests && node verifier.mjs 02-petit-grand-tres-grand.html`
Expected : ÉCHEC, `Croissances is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Croissances = (function () {
  'use strict';
  /** x = log10(log10 n) : le nombre de chiffres de n, en échelle logarithmique. */
  function lnn(x) { return Math.pow(10, x) * Math.LN10; }
  /** Exposant du bonus d'Erdős : n · n^{C / ln ln n} = n^{1 + C / ln ln n}. */
  function exposantErdos(x, C) { return 1 + C / Math.log(lnn(x)); }
  /** n* = e^{e^{C/δ}} ; renvoie log10(log10 n*) sans débordement. */
  function log10log10Croisement(C, delta) { return (C / delta) * Math.LOG10E - Math.log10(Math.LN10); }
  /** Nombre approximatif de chiffres de n*. */
  function chiffresCroisement(C, delta) { return Math.pow(10, log10log10Croisement(C, delta)); }
  return { lnn: lnn, exposantErdos: exposantErdos, log10log10Croisement: log10log10Croisement, chiffresCroisement: chiffresCroisement };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('croissances', function (zone) {
  var p = { C: 1, delta: 0.1 };
  var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Courbe de l\'exposant d\'Erdős qui baisse lentement, et droite horizontale de l\'exposant fixe 1 + δ.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function texteChiffres(log10Chiffres) {
    if (log10Chiffres < 6) return Guide.nombre(Math.pow(10, log10Chiffres), 0) + ' chiffres';
    return 'environ 10^' + Guide.nombre(log10Chiffres, 1) + ' chiffres';
  }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 36;
    var xc = Croissances.log10log10Croisement(p.C, p.delta);
    var xmax = Math.max(3, Math.min(xc + 1, 140));
    var ymax = 1 + Math.max(4 * p.delta, 0.6);
    function X(x) { return m + (x / xmax) * (L - 2 * m); }
    function Y(y) { return H - m - ((y - 1) / (ymax - 1)) * (H - 2 * m); }
    ctx.clearRect(0, 0, L, H);
    ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(m, Y(1)); ctx.lineTo(L - m, Y(1)); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
    ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('exposant', 4, 14);
    ctx.fillText('taille de n →', L - m - 80, H - 10);
    ctx.strokeStyle = c.ambre; ctx.lineWidth = 3; ctx.beginPath();
    for (var k = 0; k <= 200; k++) {
      var x = (k / 200) * xmax, y = Math.min(Croissances.exposantErdos(Math.max(x, 0.05), p.C), ymax);
      if (k === 0) ctx.moveTo(X(x), Y(y)); else ctx.lineTo(X(x), Y(y));
    }
    ctx.stroke();
    ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.moveTo(X(0), Y(1 + p.delta)); ctx.lineTo(X(xmax), Y(1 + p.delta)); ctx.stroke();
    ctx.fillStyle = c.ambre; ctx.fillText('bonus d\'Erdős (lièvre)', X(0.1), Y(Math.min(Croissances.exposantErdos(0.3, p.C), ymax)) - 6);
    ctx.fillStyle = c.sarcelle; ctx.fillText('puissance fixe 1 + δ (tortue)', X(xmax * 0.45), Y(1 + p.delta) - 6);
    if (xc <= xmax) {
      ctx.setLineDash([4, 4]); ctx.strokeStyle = c.rouge; ctx.beginPath(); ctx.moveTo(X(xc), m / 2); ctx.lineTo(X(xc), H - m); ctx.stroke(); ctx.setLineDash([]);
    }
    compteurs.fixer('croisement', 'La tortue passe devant quand n a', texteChiffres(xc));
    compteurs.fixer('univers', 'Bonus d\'Erdős pour un n de 80 chiffres', 'n^' + Guide.nombre(p.C / Math.log(80 * Math.LN10), 3));
    compteurs.fixer('fixe', 'Puissance fixe', 'n^' + Guide.nombre(p.delta, 2));
  }

  Guide.curseur(barre, { nom: 'Taille du bonus d\'Erdős (C)', min: 0.2, max: 3, pas: 0.1, valeur: 1, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { p.C = v; dessiner(); } });
  Guide.curseur(barre, { nom: 'Petite puissance (δ)', min: 0.01, max: 0.5, pas: 0.01, valeur: 0.1, format: function (v) { return Guide.nombre(v, 2); }, change: function (v) { p.delta = v; dessiner(); } });
  toile.quandRedimensionne(dessiner);
  dessiner();
  return { parametres: p };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 02-petit-grand-tres-grand.html`
Expected : `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 02**

- **En une phrase** : une puissance de n, même minuscule comme n^{0,01}, finit toujours par dépasser le bonus d'Erdős ; c'est pour ça que le résultat renverse la conjecture.
- **Ce qui coince** : « bien plus que n allumettes », mais combien exactement ? Il faut comparer des vitesses de croissance.
- **L'idée** : le bonus d'Erdős est une puissance de n dont l'exposant fond quand n grandit, au rythme de « log log n », qui grandit extraordinairement lentement : pour un nombre de 80 chiffres (le nombre d'atomes de l'univers), log log n ne vaut qu'environ 5,2. Une puissance fixe garde son exposant. Un exposant fixe finit toujours par battre un exposant qui fond, même si le croisement arrive après un nombre astronomique.
- **Image** : la tortue et le lièvre. Le lièvre (le bonus d'Erdős) part vite mais ralentit sans cesse ; la tortue (la puissance fixe) garde son pas. **Limite** : ici la tortue ne gagne qu'après un temps astronomique ; pour des n « raisonnables », le bonus d'Erdős peut rester devant.
- **Autre point de vue** : deux placements, l'un à taux qui baisse chaque année, l'autre à taux fixe minuscule. Le taux fixe finit par l'emporter. L'exposant joue le rôle du taux.
- **Pour les curieux** : `n^{1 + C/log log n}` contre `n^{1+δ}` ; égalité quand `log log n = C/δ`, soit `n = e^{e^{C/δ}}`.
- **Tu peux maintenant expliquer** : « Erdős prédisait un exposant qui fond quand n grandit. La preuve trouve un exposant qui ne fond pas. Un exposant fixe finit toujours par gagner, même minuscule. »
- **Pour aller plus loin** : `README.md`, sections Contrat et Invariant.

- [ ] **Step 7 : vérifier et regarder** — `node verifier.mjs 02-petit-grand-tres-grand.html`, puis captures 390 et sombre.

- [ ] **Step 8 : point de contrôle**

---

### Task 4 : widget `deux-carres` + chapitres 03 et 04

**Files :**
- Create : `assets/widgets/deux-carres.js`
- Modify : `03-la-recette-d-erdos.html`, `04-pourquoi-elle-s-essouffle.html`

**Interfaces :**
- Consumes : socle
- Produces : `window.DeuxCarres = { BONS_PREMIERS: number[30], estPremier(p), pointsSurCercle(N) -> [[a, b]], cout(t) -> { t, logN, logChemins, logn, exposant } }` (logarithmes naturels). Options de zone : `data-mode="cercle"` ou `data-mode="cout"`.

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « deux carrés » : les nombres qui sont somme de deux carrés de beaucoup de façons. */
Guide.enregistrerControle('deux-carres', function () {
  var P = DeuxCarres.BONS_PREMIERS;
  if (P.length !== 30) return { ok: false, message: '30 bons premiers attendus' };
  for (var p = 2; p <= P[P.length - 1]; p++) {
    var attendu = DeuxCarres.estPremier(p) && p % 4 === 1;
    if (attendu !== (P.indexOf(p) >= 0)) return { ok: false, message: 'liste des bons premiers incorrecte autour de ' + p };
  }
  var N = 1;
  for (var t = 0; t <= 5; t++) {
    if (t > 0) N *= P[t - 1];
    var n = DeuxCarres.pointsSurCercle(N).length;
    if (n !== 4 * Math.pow(2, t)) return { ok: false, message: 'N = ' + N + ' : ' + n + ' points sur le cercle (attendu ' + 4 * Math.pow(2, t) + ')' };
  }
  for (t = 2; t <= 30; t++) {
    if (!(DeuxCarres.cout(t).exposant < DeuxCarres.cout(t - 1).exposant)) return { ok: false, message: 'l\'exposant gagné devrait baisser à t = ' + t };
  }
  return { ok: true, message: '' };
});
```

Chapitre 03 : section « À manipuler » (titre « Le cercle des façons », consigne « Allume 5, puis 13, puis 17 : le nombre de points sur le cercle double à chaque fois. »), `<div class="widget-zone" data-widget="deux-carres" data-mode="cercle"></div>`. Chapitre 04 : titre « Ce que coûte un interrupteur », consigne « Monte t jusqu'à 30 : les chemins explosent, mais l'exposant gagné descend vers 0. », `data-mode="cout"`. Les deux pages chargent `assets/widgets/deux-carres.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `cd tests && node verifier.mjs 03-la-recette-d-erdos.html 04-pourquoi-elle-s-essouffle.html`
Expected : ÉCHEC, `DeuxCarres is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var DeuxCarres = (function () {
  'use strict';
  var BONS_PREMIERS = [5, 13, 17, 29, 37, 41, 53, 61, 73, 89, 97, 101, 109, 113, 137, 149, 157, 173, 181, 193, 197, 229, 233, 241, 257, 269, 277, 281, 293, 313];
  function estPremier(p) { if (p < 2) return false; for (var d = 2; d * d <= p; d++) if (p % d === 0) return false; return true; }
  function pointsSurCercle(N) {
    var res = [], r = Math.floor(Math.sqrt(N));
    for (var a = -r; a <= r; a++) {
      var b2 = N - a * a, b = Math.round(Math.sqrt(b2));
      if (b * b === b2) { res.push([a, b]); if (b !== 0) res.push([a, -b]); }
    }
    return res;
  }
  /** Recette d'Erdős avec les t plus petits bons premiers ; logarithmes naturels. */
  function cout(t) {
    var logN = 0;
    for (var i = 0; i < t; i++) logN += Math.log(BONS_PREMIERS[i]);
    var logChemins = Math.log(4) + t * Math.LN2;   // 4 · 2^t façons
    var logn = Math.log(4) + logN;                   // au moins 4N clous (√N ≤ côté / 2)
    return { t: t, logN: logN, logChemins: logChemins, logn: logn, exposant: logChemins / logn };
  }
  return { BONS_PREMIERS: BONS_PREMIERS, estPremier: estPremier, pointsSurCercle: pointsSurCercle, cout: cout };
})();
```

- [ ] **Step 4 : écrire la vue (deux modes)**

```js
Guide.enregistrerWidget('deux-carres', function (zone, options) {
  return options.mode === 'cout' ? monterCout(zone) : monterCercle(zone);

  function monterCercle(zone) {
    var choisis = [5];
    var toile = Guide.toile(zone, { rapport: 1, alt: 'Cercle de rayon racine de N et ses points à coordonnées entières.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
      var N = choisis.reduce(function (a, b) { return a * b; }, 1), r = Math.sqrt(N), pts = DeuxCarres.pointsSurCercle(N);
      var echelle = (Math.min(L, H) / 2 - 16) / r, cx = L / 2, cy = H / 2;
      ctx.clearRect(0, 0, L, H);
      if (r <= 12) {
        ctx.fillStyle = c.trait;
        for (var a = -Math.floor(r); a <= Math.floor(r); a++) for (var b = -Math.floor(r); b <= Math.floor(r); b++) {
          ctx.beginPath(); ctx.arc(cx + a * echelle, cy - b * echelle, 1.6, 0, 2 * Math.PI); ctx.fill();
        }
      }
      ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r * echelle, 0, 2 * Math.PI); ctx.stroke();
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
      pts.forEach(function (p) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + p[0] * echelle, cy - p[1] * echelle); ctx.stroke(); });
      ctx.fillStyle = c.rouge;
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(cx + p[0] * echelle, cy - p[1] * echelle, 3.5, 0, 2 * Math.PI); ctx.fill(); });
      compteurs.fixer('N', 'N', choisis.length ? choisis.join(' × ') + ' = ' + Guide.nombre(N) : '1');
      compteurs.fixer('points', 'Façons d\'écrire N = a² + b²', Guide.nombre(pts.length));
      compteurs.fixer('formule', 'Règle', '4 × 2^' + choisis.length + ' = ' + Guide.nombre(4 * Math.pow(2, choisis.length)));
    }
    [5, 13, 17, 29, 37].forEach(function (p) {
      Guide.bouton(barre, String(p), function (actif) {
        if (actif) choisis.push(p); else choisis = choisis.filter(function (q) { return q !== p; });
        choisis.sort(function (a, b) { return a - b; });
        dessiner();
      }, { bascule: true, actif: p === 5 });
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return { choisis: choisis };
  }

  function monterCout(zone) {
    var t = 3;
    var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Exposant gagné par clou en fonction du nombre de bons premiers : il descend vers zéro.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 32;
      ctx.clearRect(0, 0, L, H);
      function X(k) { return m + ((k - 1) / 29) * (L - 2 * m); }
      function Y(e) { return H - m - (e / 0.7) * (H - 2 * m); }
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, H - m); ctx.lineTo(L - m, H - m); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
      ctx.fillText('exposant gagné par clou', 4, 14);
      ctx.fillText('bons premiers t →', L - m - 100, H - 8);
      for (var k = 1; k <= 30; k++) {
        var e = DeuxCarres.cout(k).exposant;
        ctx.fillStyle = k === t ? c.rouge : c.ambre;
        ctx.beginPath(); ctx.arc(X(k), Y(e), k === t ? 6 : 3.5, 0, 2 * Math.PI); ctx.fill();
      }
      var r = DeuxCarres.cout(t);
      var premiers = DeuxCarres.BONS_PREMIERS.slice(0, Math.min(t, 6)).join(', ') + (t > 6 ? ', …' : '');
      compteurs.fixer('premiers', 'Bons premiers utilisés', premiers);
      compteurs.fixer('chemins', 'Allumettes par clou (environ)', r.logChemins / Math.LN10 < 6 ? Guide.nombre(Math.exp(r.logChemins)) : '10^' + Guide.nombre(r.logChemins / Math.LN10, 1));
      compteurs.fixer('clous', 'Clous nécessaires', Guide.chiffres(r.logn / Math.LN10));
      compteurs.fixer('exposant', 'Exposant gagné', Guide.nombre(r.exposant, 3));
    }
    Guide.curseur(barre, { nom: 'Nombre de bons premiers (t)', min: 1, max: 30, valeur: 3, change: function (v) { t = v; dessiner(); } });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
```

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 03-la-recette-d-erdos.html 04-pourquoi-elle-s-essouffle.html`
Expected : `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 03**

- **En une phrase** : Erdős pose les clous sur une grille et choisit l'unité de longueur pour que beaucoup de paires de la grille tombent pile à la bonne distance.
- **Ce qui coince** : pour battre « n », il faut une structure où chaque clou a beaucoup d'allumettes.
- **L'idée** : dans une grille, le carré de la distance entre deux points vaut a² + b² (Pythagore). On choisit un nombre N qui s'écrit comme somme de deux carrés de beaucoup de façons, et on prend √N comme nouvelle unité. Exemple : 25 = 0² + 5² = 3² + 4², ce qui donne 12 directions. Règle : les premiers qui laissent un reste 1 quand on les divise par 4 (5, 13, 17, 29…) sont les « bons » ; chacun double le nombre de façons, soit 4 × 2^t.
- **Image** : un cadenas à interrupteurs. Chaque bon premier ajoute un interrupteur à deux positions ; t interrupteurs donnent 2^t combinaisons, et chaque combinaison donne une direction. **Limite** : l'image n'explique pas pourquoi seuls les bons premiers marchent (3, 7, 11 ne marchent pas), ni le facteur 4 (les symétries).
- **Autre point de vue** : les nombres de Gauss. Le point (a, b) devient le nombre a + bi, et 5 = (2 + i)(2 − i) : un bon premier se casse en deux morceaux qui sont le reflet l'un de l'autre. Choisir, pour chaque premier, quel morceau garder, c'est l'interrupteur. C'est exactement le mécanisme que la preuve reprend aux chapitres 06 et 07.
- **Pour les curieux** : `r₂(N) = 4 · 2^t` façons ; `5 = (2 + i)(2 − i)` ; `65 = 1² + 8² = 4² + 7²`, soit 16 façons en comptant signes et ordre.
- **Tu peux maintenant expliquer** : « Dans une grille, la longueur d'un segment vient de Pythagore. Certains nombres s'écrivent comme somme de deux carrés de beaucoup de façons : chaque bon nombre premier double ce nombre. En réglant l'unité, toutes ces façons deviennent des allumettes. »
- **Pour aller plus loin** : `grille-erdos.md`, `../pythagore/cablages/complexe.md`.

- [ ] **Step 7 : rédiger le chapitre 04**

- **En une phrase** : pour ajouter des interrupteurs, il faut un N plus grand, donc une grille plus grande ; le gain par clou grandit, mais beaucoup moins vite que la grille.
- **Ce qui coince** : pourquoi ne pas prendre t énorme pour un gain énorme ?
- **L'idée** : N est le produit de t premiers, il grandit à peu près comme t^t. La grille doit faire au moins 2√N de côté, donc au moins 4N clous. Le gain par clou (2^t) devient une puissance de n dont l'exposant tend vers 0 : c'est exactement le bonus n^{C/log log n}. Le même bouton (t) fait monter le gain et le coût.
- **Image** : une usine où chaque nouvelle machine double la production mais exige un entrepôt plus grand, dont le loyer grimpe encore plus vite ; la rentabilité au mètre carré baisse. **Limite** : ici rien ne coûte d'argent ; le coût, c'est le nombre de clous.
- **Autre point de vue** : ce qu'il faudrait, c'est un bouton qui multiplie les directions sans agrandir la grille. La preuve trouve ce bouton : le nombre d'écrans (chapitre 05).
- **Pour les curieux** : `log N ≈ t log t` ; `t ≈ log n / log log n` ; `2^t = n^{c / log log n}`.
- **Tu peux maintenant expliquer** : « Dans la recette d'Erdős, le seul moyen d'avoir plus d'allumettes par clou est d'ajouter des bons premiers. Mais chaque premier agrandit aussi la grille. Le bénéfice existe, mais il fond : c'est le bonus minuscule de la conjecture. »
- **Pour aller plus loin** : `grille-erdos.md#pourquoi-ca-plafonne`.

- [ ] **Step 8 : vérifier et regarder** — les deux pages, captures 390 et sombre.

- [ ] **Step 9 : point de contrôle**

---

### Task 5 : `cyclo.js` + widget `pas-magiques` + chapitre 06

**Files :**
- Create : `assets/widgets/cyclo.js`, `assets/widgets/pas-magiques.js`
- Modify : `06-les-pas-magiques.html`

**Interfaces :**
- Consumes : socle
- Produces :
  - `window.Cyclo = { corps(m) -> { m, f, degre, exposants, plonger(coeffs) -> [{re, im}] (longueur f), pasMagique(coeffs) -> [{re, im}] | null }, add, mul, conj, div, abs }`
  - widget `pas-magiques`, avec `data-partie="un"` (un seul plan) ou `data-partie="trois"` (trois écrans, `Q(ζ_7)`)

- [ ] **Step 1 : écrire les contrôles**

En tête de `assets/widgets/cyclo.js` :

```js
/* Calcul dans le corps cyclotomique Q(ζ_m) : un plongement complexe par paire conjuguée. */
Guide.enregistrerControle('cyclo', function () {
  var k8 = Cyclo.corps(8), k7 = Cyclo.corps(7);
  if (k8.f !== 2 || k8.degre !== 4) return { ok: false, message: 'Q(ζ_8) : f = ' + k8.f + ', degré ' + k8.degre };
  if (k7.f !== 3 || k7.degre !== 6) return { ok: false, message: 'Q(ζ_7) : f = ' + k7.f + ', degré ' + k7.degre };
  var z = k8.plonger([0, 1, 0, 0]);
  if (Math.abs(z[0].re - Math.SQRT1_2) > 1e-12 || Math.abs(z[1].re + Math.SQRT1_2) > 1e-12) return { ok: false, message: 'plongements de ζ_8 faux' };
  if (k7.pasMagique([0, 0, 0, 0, 0, 0]) !== null) return { ok: false, message: 'α = 0 devrait donner null' };
  return { ok: true, message: '' };
});
```

En tête de `assets/widgets/pas-magiques.js` :

```js
/* Widget « pas magiques » : un nombre divisé par son reflet a une longueur 1, sur chaque écran. */
Guide.enregistrerControle('pas-magiques', function () {
  var z = { re: 1.3, im: -0.7 }, u = Cyclo.div(z, Cyclo.conj(z));
  if (Math.abs(Cyclo.abs(u) - 1) > 1e-12) return { ok: false, message: '|z / reflet| = ' + Cyclo.abs(u) };
  var pas = Cyclo.corps(7).pasMagique([1, 2, 0, -1, 0, 1]);
  for (var i = 0; i < pas.length; i++) {
    if (Math.abs(Cyclo.abs(pas[i]) - 1) > 1e-9) return { ok: false, message: 'écran ' + (i + 1) + ' : longueur ' + Cyclo.abs(pas[i]) };
  }
  return { ok: true, message: '' };
});
```

Chapitre 06 : deux sections widget. « Le miroir » : `<div class="widget-zone" data-widget="pas-magiques" data-partie="un"></div>`, consigne « Déplace z : la longueur de z ÷ reflet reste 1, son angle est le double de celui de z. ». « Trois écrans » : `data-partie="trois"`, consigne « Change α : sur chaque écran, α a une longueur différente, mais le pas magique mesure toujours 1. ». Scripts : `assets/widgets/cyclo.js` puis `assets/widgets/pas-magiques.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `cd tests && node verifier.mjs 06-les-pas-magiques.html`
Expected : ÉCHEC, `Cyclo is not defined`.

- [ ] **Step 3 : écrire le modèle `Cyclo` (après le contrôle de `cyclo.js`)**

```js
var Cyclo = (function () {
  'use strict';
  function add(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
  function mul(a, b) { return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re }; }
  function conj(a) { return { re: a.re, im: -a.im }; }
  function div(a, b) { var d = b.re * b.re + b.im * b.im; return { re: (a.re * b.re + a.im * b.im) / d, im: (a.im * b.re - a.re * b.im) / d }; }
  function abs(a) { return Math.hypot(a.re, a.im); }
  function pgcd(a, b) { while (b) { var r = a % b; a = b; b = r; } return a; }

  /** Q(ζ_m) : plongements σ_k(ζ) = e^{2iπk/m}, un exposant k par paire conjuguée (k premier à m, k < m/2). */
  function corps(m) {
    var exposants = [], degre = 0;
    for (var k = 1; k < m; k++) {
      if (pgcd(k, m) !== 1) continue;
      degre++;
      if (2 * k < m) exposants.push(k);
    }
    function plonger(coeffs) {
      return exposants.map(function (k) {
        var s = { re: 0, im: 0 };
        coeffs.forEach(function (a, j) { var t = 2 * Math.PI * j * k / m; s.re += a * Math.cos(t); s.im += a * Math.sin(t); });
        return s;
      });
    }
    /** u = α / c(α) : sur chaque écran σ(α) / conj(σ(α)), car c agit comme la conjugaison complexe. */
    function pasMagique(coeffs) {
      if (coeffs.every(function (a) { return a === 0; })) return null;
      return plonger(coeffs).map(function (z) { return div(z, conj(z)); });
    }
    return { m: m, f: exposants.length, degre: degre, exposants: exposants, plonger: plonger, pasMagique: pasMagique };
  }
  return { corps: corps, add: add, mul: mul, conj: conj, div: div, abs: abs };
})();
```

- [ ] **Step 4 : écrire la vue `pas-magiques` (après le contrôle de `pas-magiques.js`)**

```js
Guide.enregistrerWidget('pas-magiques', function (zone, options) {
  return options.partie === 'trois' ? monterTrois(zone) : monterUn(zone);

  function fleche(ctx, x0, y0, x1, y1, couleur, epaisseur) {
    ctx.strokeStyle = couleur; ctx.fillStyle = couleur; ctx.lineWidth = epaisseur || 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    var a = Math.atan2(y1 - y0, x1 - x0);
    ctx.beginPath(); ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - 9 * Math.cos(a - 0.4), y1 - 9 * Math.sin(a - 0.4));
    ctx.lineTo(x1 - 9 * Math.cos(a + 0.4), y1 - 9 * Math.sin(a + 0.4));
    ctx.closePath(); ctx.fill();
  }

  function monterUn(zone) {
    var z = { re: 1.6, im: 0.9 };
    var toile = Guide.toile(zone, { rapport: 1, alt: 'Plan complexe : z, son reflet, z fois son reflet sur l\'axe, et z divisé par son reflet sur le cercle unité.' });
    var compteurs = Guide.compteurs(zone);
    function unite() { return toile.largeur / 8; }
    function versEcran(w) { return { x: toile.largeur / 2 + w.re * unite(), y: toile.hauteur / 2 - w.im * unite() }; }
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, o = versEcran({ re: 0, im: 0 });
      ctx.clearRect(0, 0, L, H);
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, o.y); ctx.lineTo(L, o.y); ctx.moveTo(o.x, 0); ctx.lineTo(o.x, H); ctx.stroke();
      ctx.setLineDash([5, 5]); ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.arc(o.x, o.y, unite(), 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      var reflet = Cyclo.conj(z), produit = Cyclo.mul(z, reflet), pas = Cyclo.div(z, reflet);
      var pz = versEcran(z), pr = versEcran(reflet), pp = versEcran(produit), pu = versEcran(pas);
      fleche(ctx, o.x, o.y, pz.x, pz.y, c.bleu, 3);
      ctx.setLineDash([4, 4]); fleche(ctx, o.x, o.y, pr.x, pr.y, c.indigo, 2); ctx.setLineDash([]);
      fleche(ctx, o.x, o.y, pp.x, pp.y, c.vert, 3);
      fleche(ctx, o.x, o.y, pu.x, pu.y, c.rouge, 3);
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillStyle = c.bleu; ctx.fillText('z', pz.x + 8, pz.y - 6);
      ctx.fillStyle = c.indigo; ctx.fillText('reflet', pr.x + 8, pr.y + 14);
      ctx.fillStyle = c.vert; ctx.fillText('z × reflet', pp.x - 30, pp.y - 10);
      ctx.fillStyle = c.rouge; ctx.fillText('z ÷ reflet', pu.x + 8, pu.y - 6);
      var deg = 180 / Math.PI;
      compteurs.fixer('lz', 'Longueur de z', Guide.nombre(Cyclo.abs(z), 3));
      compteurs.fixer('lp', 'Longueur de z × reflet', Guide.nombre(Cyclo.abs(produit), 3) + ' (= longueur² de z)');
      compteurs.fixer('lu', 'Longueur de z ÷ reflet', Guide.nombre(Cyclo.abs(pas), 4));
      compteurs.fixer('az', 'Angle de z', Guide.nombre(Math.atan2(z.im, z.re) * deg, 0) + '°');
      compteurs.fixer('au', 'Angle de z ÷ reflet', Guide.nombre(Math.atan2(pas.im, pas.re) * deg, 0) + '°');
    }
    function placer(e) {
      var w = { re: (e.x - toile.largeur / 2) / unite(), im: (toile.hauteur / 2 - e.y) / unite() };
      var n = Cyclo.abs(w);
      if (n < 0.2) return;
      if (n > 1.9) w = { re: w.re * 1.9 / n, im: w.im * 1.9 / n };
      z = w; dessiner();
    }
    var tenu = false;
    Guide.pointeur(toile.canvas, {
      appui: function (e) { tenu = true; placer(e); },
      deplacement: function (e) { if (tenu) placer(e); },
      relache: function () { tenu = false; }
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }

  function monterTrois(zone) {
    var corps = Cyclo.corps(7), coeffs = [1, 2, 0, -1, 0, 1], graine = 1;
    var toile = Guide.toile(zone, { rapport: 0.42, alt: 'Trois écrans : sur chacun, α et le pas magique α ÷ reflet, toujours sur le cercle de rayon 1.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    var reglages = document.createElement('details');
    var resume = document.createElement('summary');
    resume.textContent = 'Régler α à la main';
    reglages.appendChild(resume);
    zone.appendChild(reglages);
    var curseurs = coeffs.map(function (v, j) {
      return Guide.curseur(reglages, { nom: 'coefficient de ζ^' + j, min: -3, max: 3, valeur: v, change: function (x) { coeffs[j] = x; dessiner(); } });
    });
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
      ctx.clearRect(0, 0, L, H);
      var images = corps.plonger(coeffs), pas = corps.pasMagique(coeffs);
      var cote = L / 3;
      images.forEach(function (a, k) {
        var cx = cote * k + cote / 2, cy = H / 2, rayon = Math.min(cote, H) / 2 - 10;
        var echelle = rayon / Math.max(Cyclo.abs(a), 1) / 1.05;
        ctx.strokeStyle = c.trait; ctx.lineWidth = 1; ctx.strokeRect(cote * k + 2, 2, cote - 4, H - 4);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = c.sarcelle; ctx.beginPath(); ctx.arc(cx, cy, echelle, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
        if (pas) {
          fleche(ctx, cx, cy, cx + a.re * echelle, cy - a.im * echelle, c.bleu, 2);
          fleche(ctx, cx, cy, cx + pas[k].re * echelle, cy - pas[k].im * echelle, c.rouge, 3);
        }
        ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif'; ctx.fillText('écran ' + (k + 1), cote * k + 8, 16);
        compteurs.fixer('e' + k, 'Écran ' + (k + 1) + ' : longueur de α / du pas', pas ? Guide.nombre(Cyclo.abs(a), 2) + ' / ' + Guide.nombre(Cyclo.abs(pas[k]), 3) : 'α = 0');
      });
    }
    Guide.bouton(barre, 'α au hasard', function () {
      var r = Guide.hasard(++graine);
      do { coeffs = coeffs.map(function () { return Math.floor(r() * 7) - 3; }); } while (coeffs.every(function (a) { return a === 0; }));
      curseurs.forEach(function (cur, j) { cur.entree.value = coeffs[j]; });
      dessiner();
    });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
```

Dans `monterTrois`, le cercle pointillé a pour rayon `echelle` : c'est le cercle de longueur 1 à l'échelle de l'écran. Le pas rouge tombe dessus.

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 06-les-pas-magiques.html`
Expected : `Tout est vert.` (2 contrôles : `cyclo`, `pas-magiques`).

- [ ] **Step 6 : rédiger le chapitre 06**

- **En une phrase** : diviser un nombre par son reflet dans un miroir donne un nombre de longueur exactement 1 ; dans les bons mondes, ça marche sur tous les écrans à la fois.
- **Ce qui coince** : d'où viennent des pas qui mesurent 1 sur chaque écran ?
- **L'idée** : dans le plan, z ÷ (reflet de z) a une longueur 1 : les longueurs s'annulent, la direction est doublée. Dans les mondes utilisés par la preuve, un nombre a f visages, un par écran, et le miroir agit de la même façon sur chaque visage. Donc z ÷ reflet mesure 1 sur tous les écrans. Lien avec Pythagore : z × reflet = a² + b², la longueur au carré.
- **Pourquoi des mondes « réels » auxquels on ajoute i** : c'est ce qui garantit que le reflet est le vrai miroir sur chaque écran (le chapitre 12 y revient avec le choix de 3).
- **Image** : une boussole. On garde le cap, on jette la distance. **Limite** : le cap n'est pas gardé tel quel, il est doublé.
- **Autre point de vue** : multiplier par le reflet donne Pythagore (la longueur au carré) ; diviser par le reflet ne garde que l'angle. Exemple : (2 + i) ÷ (2 − i) = (3 + 4i) / 5, le triangle 3-4-5 de la grille d'Erdős.
- **Pour les curieux** : `u = α / c(α)` ; `u · c(u) = 1` ; `|σ(u)| = 1` pour chaque écran σ ; `(2 + i) / (2 − i) = (3 + 4i) / 5`.
- **Tu peux maintenant expliquer** : « Un pas magique, c'est un nombre divisé par son reflet. Il mesure 1 sur chaque écran, parce que le miroir agit pareil partout. (2 + i) ÷ (2 − i) = (3 + 4i)/5 : c'est le triangle 3-4-5. »
- **Pour aller plus loin** : `sens/unitariser/README.md`.

- [ ] **Step 7 : vérifier et regarder** — captures 390, paysage et sombre.

- [ ] **Step 8 : point de contrôle**

---

### Task 6 : widget `ombre` + chapitres 05 et 09

**Files :**
- Create : `assets/widgets/ombre.js`
- Modify : `05-changer-de-point-de-vue.html`, `09-pas-trop-de-points.html`

**Interfaces :**
- Consumes : `Cyclo` (tâche 5), socle
- Produces : `window.Ombre = { PAS: { 8: number[][], 7: number[][] }, pasMagiques(m) -> [[{re, im}]] (pas × écran), points(pas, K, R, fenetreCachee) -> { points: [{ x: [{re, im}], coeffs }], aretes: [[i, j, indicePas]] } }`. Options de zone : `data-ecrans="2"` ou `"3"`, `data-mode="pas"` ou `"fenetre"`.

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « ombre » : des points sur plusieurs écrans, des pas de longueur 1 partout, un seul écran publié. */
Guide.enregistrerControle('ombre', function () {
  [8, 7].forEach(function (m) {
    Ombre.pasMagiques(m).forEach(function (u, j) {
      u.forEach(function (z, e) { if (Math.abs(Cyclo.abs(z) - 1) > 1e-9) throw new Error('pas ' + j + ', écran ' + (e + 1) + ' : longueur ' + Cyclo.abs(z)); });
    });
  });
  var pas8 = Ombre.pasMagiques(8);
  var sans = [1, 2, 3, 4].map(function (K) { return Ombre.points(pas8, K, 2, false).points.length; });
  for (var i = 1; i < sans.length; i++) if (!(sans[i] > sans[i - 1])) return { ok: false, message: 'sans fenêtre cachée, les points devraient s\'entasser : ' + sans.join(', ') };
  var a = Ombre.points(pas8, 5, 1.5, true).points.length, b = Ombre.points(pas8, 6, 1.5, true).points.length;
  if (a !== b) return { ok: false, message: 'avec fenêtre cachée, le nombre de points devrait se stabiliser : ' + a + ' puis ' + b };
  var res = Ombre.points(pas8, 3, 2, true);
  for (i = 0; i < res.aretes.length; i++) {
    var p = res.points[res.aretes[i][0]].x[0], q = res.points[res.aretes[i][1]].x[0];
    if (Math.abs(Math.hypot(p.re - q.re, p.im - q.im) - 1) > 1e-9) return { ok: false, message: 'une allumette de l\'écran 1 ne mesure pas 1' };
  }
  var t0 = performance.now();
  Ombre.points(Ombre.pasMagiques(7), 6, 2.5, false);
  if (performance.now() - t0 > 300) return { ok: false, message: 'calcul trop lent pour un téléphone' };
  return { ok: true, message: '' };
});
```

Si le contrôle de stabilisation échoue alors que le modèle est juste, réduire le rayon du contrôle à 1,2 ou monter K à 7 et 8. Puis figer ces valeurs dans le contrôle et dans le texte du chapitre 09.

Chapitre 05 : « Deux écrans, un seul publié », `<div class="widget-zone" data-widget="ombre" data-ecrans="2" data-mode="pas"></div>`, consigne « Touche “un autre point” : sur chaque écran, ses voisins sont à distance 1, dans des directions différentes. ». Chapitre 09 : « Les écrans cachés font la police », `data-ecrans="2" data-mode="fenetre"`, consigne « Fenêtre cachée coupée, monte la taille des sommes : les points s'entassent sur l'écran 1. Rallume-la : leur nombre se stabilise. ». Les deux pages chargent `cyclo.js` puis `ombre.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer**

Run : `cd tests && node verifier.mjs 05-changer-de-point-de-vue.html 09-pas-trop-de-points.html`
Expected : ÉCHEC, `Ombre is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Ombre = (function () {
  'use strict';
  /** Coefficients des α_j dans la base 1, ζ, ζ², … ; pas u_j = α_j / c(α_j). */
  var PAS = {
    8: [[1, 1, 0, 0], [2, 0, 1, 0], [1, 0, 0, 1]],
    7: [[1, 1, 0, 0, 0, 0], [2, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0]]
  };
  function pasMagiques(m) { var k = Cyclo.corps(m); return PAS[m].map(function (a) { return k.pasMagique(a); }); }
  function cle(x) { return x.map(function (z) { return Math.round(z.re * 1e6) + ',' + Math.round(z.im * 1e6); }).join(';'); }

  /** Points x = Σ n_j u_j (|n_j| ≤ K) gardés si |x₁| ≤ R et, si fenetreCachee, |x_k| ≤ R sur chaque écran. */
  function points(pas, K, R, fenetreCachee) {
    var nb = pas.length, f = pas[0].length, base = 2 * K + 1, total = Math.pow(base, nb);
    var index = {}, liste = [];
    for (var idx = 0; idx < total; idx++) {
      var reste = idx, coeffs = [];
      for (var j = 0; j < nb; j++) { coeffs.push((reste % base) - K); reste = Math.floor(reste / base); }
      var x = [];
      for (var e = 0; e < f; e++) {
        var s = { re: 0, im: 0 };
        for (j = 0; j < nb; j++) { s.re += coeffs[j] * pas[j][e].re; s.im += coeffs[j] * pas[j][e].im; }
        x.push(s);
      }
      if (Cyclo.abs(x[0]) > R) continue;
      if (fenetreCachee && x.some(function (z) { return Cyclo.abs(z) > R; })) continue;
      var k = cle(x);
      if (index[k] !== undefined) continue;
      index[k] = liste.length;
      liste.push({ x: x, coeffs: coeffs });
    }
    var aretes = [];
    liste.forEach(function (p, i) {
      for (var j2 = 0; j2 < nb; j2++) {
        var y = p.x.map(function (z, e2) { return { re: z.re + pas[j2][e2].re, im: z.im + pas[j2][e2].im }; });
        var cible = index[cle(y)];
        if (cible !== undefined) aretes.push([i, cible, j2]);
      }
    });
    return { points: liste, aretes: aretes };
  }
  return { PAS: PAS, pasMagiques: pasMagiques, points: points };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('ombre', function (zone, options) {
  var m = options.ecrans === '3' ? 7 : 8, pas = Ombre.pasMagiques(m), f = pas[0].length;
  var etat = { K: 3, R: 2, fenetreCachee: options.mode !== 'fenetre', choisi: 0, graine: 3, res: null };
  var toile = Guide.toile(zone, { rapport: 1.55, alt: 'Grand écran 1 (le plan publié) et petits écrans cachés ; les mêmes points vus sur chaque écran.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function calculer() {
    etat.res = Ombre.points(pas, etat.K, etat.R, etat.fenetreCachee);
    var voisins = etat.res.aretes.map(function (a) { return a[0]; });
    if (voisins.indexOf(etat.choisi) < 0) etat.choisi = voisins.length ? voisins[0] : 0;
  }

  function cadre(k) {
    var L = toile.largeur;
    if (k === 0) return { x: 0, y: 0, cote: L };
    var petit = L / 2, n = f - 1, debut = (L - n * petit) / 2;
    return { x: debut + (k - 1) * petit, y: L + 8, cote: petit };
  }

  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, res = etat.res;
    ctx.clearRect(0, 0, toile.largeur, toile.hauteur);
    for (var k = 0; k < f; k++) {
      var b = cadre(k), cx = b.x + b.cote / 2, cy = b.y + b.cote / 2;
      var portee = etat.R;
      if (k > 0 && !etat.fenetreCachee) res.points.forEach(function (p) { portee = Math.max(portee, Cyclo.abs(p.x[k])); });
      var e = (b.cote / 2 - 8) / (portee * 1.05);
      ctx.strokeStyle = c.trait; ctx.lineWidth = 1; ctx.strokeRect(b.x + 2, b.y + 2, b.cote - 4, b.cote - 4);
      ctx.setLineDash(k > 0 && !etat.fenetreCachee ? [4, 4] : []);
      ctx.strokeStyle = k > 0 && !etat.fenetreCachee ? c.discret : c.sarcelle;
      ctx.beginPath(); ctx.arc(cx, cy, etat.R * e, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      if (k === 0) {
        ctx.strokeStyle = c.ambre; ctx.globalAlpha = 0.5; ctx.lineWidth = 1;
        res.aretes.forEach(function (a) {
          var p = res.points[a[0]].x[0], q = res.points[a[1]].x[0];
          ctx.beginPath(); ctx.moveTo(cx + p.re * e, cy - p.im * e); ctx.lineTo(cx + q.re * e, cy - q.im * e); ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = c.bleu;
      res.points.forEach(function (p) { ctx.beginPath(); ctx.arc(cx + p.x[k].re * e, cy - p.x[k].im * e, k === 0 ? 2.6 : 2, 0, 2 * Math.PI); ctx.fill(); });
      var centre = res.points[etat.choisi];
      if (centre) {
        res.aretes.forEach(function (a) {
          if (a[0] !== etat.choisi) return;
          var p = centre.x[k], q = res.points[a[1]].x[k];
          ctx.strokeStyle = c.rouge; ctx.lineWidth = 2.5;
          ctx.beginPath(); ctx.moveTo(cx + p.re * e, cy - p.im * e); ctx.lineTo(cx + q.re * e, cy - q.im * e); ctx.stroke();
        });
        ctx.fillStyle = c.rouge; ctx.beginPath(); ctx.arc(cx + centre.x[k].re * e, cy - centre.x[k].im * e, 4.5, 0, 2 * Math.PI); ctx.fill();
      }
      ctx.fillStyle = c.discret; ctx.font = '12px system-ui, sans-serif';
      ctx.fillText(k === 0 ? 'écran 1 : le plan publié' : 'écran caché ' + (k + 1), b.x + 8, b.y + 18);
    }
    var n = res.points.length, ecart = Infinity;
    for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      var p1 = res.points[i].x[0], p2 = res.points[j].x[0];
      ecart = Math.min(ecart, Math.hypot(p1.re - p2.re, p1.im - p2.im));
    }
    compteurs.fixer('points', 'Clous sur l\'écran 1', Guide.nombre(n));
    compteurs.fixer('allumettes', 'Allumettes', Guide.nombre(res.aretes.length));
    compteurs.fixer('ecart', 'Plus petit écart entre deux clous', n > 1 ? Guide.nombre(ecart, 4) : '—');
  }

  function maj() { calculer(); dessiner(); }

  Guide.curseur(barre, { nom: 'Taille des sommes de pas', min: 1, max: 6, valeur: etat.K, change: function (v) { etat.K = v; maj(); } });
  Guide.curseur(barre, { nom: 'Rayon de la fenêtre', min: 1, max: 2.5, pas: 0.1, valeur: etat.R, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { etat.R = v; maj(); } });
  Guide.bouton(barre, 'Fenêtre sur les écrans cachés', function (actif) { etat.fenetreCachee = actif; maj(); }, { bascule: true, actif: etat.fenetreCachee });
  Guide.bouton(barre, 'Un autre point', function () {
    var avecVoisins = etat.res.aretes.map(function (a) { return a[0]; });
    if (avecVoisins.length) etat.choisi = avecVoisins[Math.floor(Guide.hasard(++etat.graine)() * avecVoisins.length)];
    dessiner();
  });
  toile.quandRedimensionne(dessiner);
  maj();
  return { etat: etat };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 05-changer-de-point-de-vue.html 09-pas-trop-de-points.html`
Expected : `Tout est vert.` (contrôles `cyclo` et `ombre`). Regarder `captures/09-pas-trop-de-points-390.png` : grand écran en haut, écran caché en dessous, rien ne déborde.

- [ ] **Step 6 : rédiger le chapitre 05**

- **En une phrase** : au lieu d'une seule table, on joue sur f tables à la fois, avec des pas qui mesurent exactement 1 sur chacune ; à la fin, on ne regarde qu'une table.
- **Ce qui coince** : il faut un bouton qui multiplie les directions sans agrandir la grille (fin du chapitre 04).
- **L'idée** : un « point » est fait de f positions, une par écran. Un pas magique déplace le point d'exactement 1 sur chaque écran. Des points proches sur tous les écrans à la fois sont rares : une fenêtre en contient peu. Le nombre de pas magiques grandit de façon exponentielle avec f. À la fin, on publie l'écran 1 : les distances 1 restent des distances 1, et deux points distincts ne tombent jamais au même endroit (chapitre 09).
- **Image** : plusieurs caméras filment la même scène sous des angles différents ; à chaque pas, chaque caméra voit l'acteur avancer d'exactement 1 mètre, dans des directions différentes. On ne publie que le film de la caméra 1. **Limite** : de vraies caméras montrent une seule scène en 3D ; ici les écrans ne sont pas des vues d'un même espace, ce sont f copies liées par l'arithmétique.
- **Autre point de vue** : une ombre chinoise. D'habitude une ombre raccourcit les longueurs ; ici on a fabriqué des pas dont l'ombre mesure exactement 1.
- **Pour les curieux** : `Φ(x) = (σ₁(x), …, σ_f(x))` dans `C^f` ; la projection sur le premier écran est `π₁`.
- **Tu peux maintenant expliquer** : « La preuve travaille avec des points à f coordonnées, une par écran. Elle fabrique des pas qui mesurent 1 sur tous les écrans à la fois. Le dessin final est l'écran 1 : il garde toutes les allumettes. »
- **Pour aller plus loin** : `sens/plonger/README.md`, `etages/fenetre.md`.

- [ ] **Step 7 : rédiger le chapitre 09**

- **En une phrase** : deux points du pavage ne peuvent pas être proches sur tous les écrans à la fois ; la fenêtre ne contient donc qu'un nombre limité de points, et l'écran 1 n'en superpose jamais deux.
- **Ce qui coince** : beaucoup d'allumettes par clou ne sert à rien si les clous sont trop nombreux ; et la projection pourrait fusionner des points.
- **L'idée** : l'écart entier. Entre deux points, le produit des distances sur tous les écrans (multiplié par une constante fixe) est un nombre entier non nul, donc au moins 1. Sur un écran au moins, la distance dépasse donc 1/𝒟. Des petites boules autour des points ne se chevauchent pas, et leur nombre est limité par le volume de la fenêtre : au plus e^{Bf}. Pour la projection : un nombre qui vaut 0 sur un écran vaut 0 partout, donc deux points distincts restent distincts sur l'écran 1.
- **Image** : des oranges dans une caisse. Chaque orange prend sa place ; leur nombre est limité par le volume de la caisse. **Limite** : ici la place occupée par un point se mesure sur tous les écrans à la fois ; sur l'écran 1 seul, deux points peuvent être très proches (le widget le montre).
- **Autre point de vue** : sans les écrans cachés, les points s'entassent sans limite sur l'écran 1. Ce sont les dimensions cachées qui font la police.
- **Pour les curieux** : `∏_r |σ_r(x − x')| = 𝒟^{−f} |N(β)|^{1/2} ≥ 𝒟^{−f}` ; `n ≤ (4R𝒟)^{2f} = e^{Bf}`.
- **Tu peux maintenant expliquer** : « Un nombre entier non nul vaut au moins 1. Traduit sur les écrans, cela empêche deux points d'être proches partout à la fois. La fenêtre ne contient donc qu'un nombre limité de points, et l'écran 1 n'en superpose aucun. »
- **Pour aller plus loin** : `etages/taille.md`, `sens/tasser/README.md`, `vocabulaire/patterns.md#ecart-arithmetique`.

- [ ] **Step 8 : vérifier et regarder** — les deux pages, captures 390, paysage et sombre.

- [ ] **Step 9 : point de contrôle**

---

### Task 7 : widget `tiroirs` + chapitre 07

**Files :**
- Create : `assets/widgets/tiroirs.js`
- Modify : `07-les-tiroirs.html`

**Interfaces :**
- Consumes : socle (`Guide.hasard`)
- Produces : `window.Tiroirs = { ranger(m, h, graine, equitable) -> number[h], garanti(m, h) -> number }`

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « tiroirs » : 2^m tickets dans h tiroirs ; un tiroir en a toujours au moins 2^m / h. */
Guide.enregistrerControle('tiroirs', function () {
  var r = Guide.hasard(11);
  for (var essai = 0; essai < 500; essai++) {
    var m = 1 + Math.floor(r() * 10), h = 1 + Math.floor(r() * 12);
    [false, true].forEach(function (equitable) {
      var tas = Tiroirs.ranger(m, h, essai + 1, equitable);
      var somme = tas.reduce(function (a, b) { return a + b; }, 0), max = Math.max.apply(null, tas);
      if (somme !== Math.pow(2, m)) throw new Error('tickets perdus : ' + somme + ' au lieu de ' + Math.pow(2, m));
      if (max < Tiroirs.garanti(m, h)) throw new Error('tiroir le plus plein ' + max + ' < garanti ' + Tiroirs.garanti(m, h));
      if (equitable && max !== Tiroirs.garanti(m, h)) throw new Error('rangement équitable : ' + max + ' au lieu de ' + Tiroirs.garanti(m, h));
    });
  }
  return { ok: true, message: '' };
});
```

Chapitre 07 : « Chaussettes et tiroirs », `<div class="widget-zone" data-widget="tiroirs"></div>`, consigne « Monte m, puis range le plus équitablement possible : même là, un tiroir atteint la moyenne. ». Script `assets/widgets/tiroirs.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer** — `node verifier.mjs 07-les-tiroirs.html` → `Tiroirs is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Tiroirs = (function () {
  'use strict';
  /** Range 2^m tickets dans h tiroirs : au hasard, ou de la façon la plus équitable possible. */
  function ranger(m, h, graine, equitable) {
    var total = Math.pow(2, m), tas = [];
    for (var i = 0; i < h; i++) tas.push(0);
    var r = Guide.hasard(graine);
    for (i = 0; i < total; i++) tas[equitable ? i % h : Math.floor(r() * h)]++;
    return tas;
  }
  function garanti(m, h) { return Math.ceil(Math.pow(2, m) / h); }
  return { ranger: ranger, garanti: garanti };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('tiroirs', function (zone) {
  var etat = { m: 6, h: 5, graine: 1, equitable: false, tas: null, affiche: null, debut: 0 };
  var toile = Guide.toile(zone, { rapport: 0.65, alt: 'Des colonnes, une par tiroir, remplies de tickets ; une ligne pointillée marque la moyenne.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);

  function ranger() {
    etat.tas = Tiroirs.ranger(etat.m, etat.h, etat.graine, etat.equitable);
    etat.debut = performance.now();
    requestAnimationFrame(animer);
  }
  function animer(t) {
    var p = Math.min(1, (t - etat.debut) / 600);
    etat.affiche = etat.tas.map(function (v) { return Math.round(v * p); });
    dessiner();
    if (p < 1) requestAnimationFrame(animer);
  }
  function dessiner() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 28;
    var tas = etat.affiche || etat.tas, total = Math.pow(2, etat.m), moyenne = total / etat.h;
    var max = Math.max.apply(null, etat.tas), haut = Math.max(max, Tiroirs.garanti(etat.m, etat.h)) * 1.15;
    var largeurCol = (L - 2 * m) / etat.h;
    ctx.clearRect(0, 0, L, H);
    tas.forEach(function (v, i) {
      var hpx = (v / haut) * (H - 2 * m);
      ctx.fillStyle = etat.tas[i] === max ? c.vert : c.bleu;
      ctx.fillRect(m + i * largeurCol + 3, H - m - hpx, largeurCol - 6, hpx);
      ctx.fillStyle = c.discret; ctx.font = '11px system-ui, sans-serif';
      ctx.fillText(String(v), m + i * largeurCol + 4, H - m - hpx - 4);
    });
    var ym = H - m - (moyenne / haut) * (H - 2 * m);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = c.rouge; ctx.beginPath(); ctx.moveTo(m, ym); ctx.lineTo(L - m, ym); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = c.rouge; ctx.fillText('moyenne', L - m - 56, ym - 4);
    compteurs.fixer('tickets', 'Tickets (2^m)', Guide.nombre(total));
    compteurs.fixer('tiroirs', 'Tiroirs (h)', String(etat.h));
    compteurs.fixer('moyenne', 'Moyenne par tiroir', Guide.nombre(moyenne, 1));
    compteurs.fixer('garanti', 'Garanti dans le plus plein', Guide.nombre(Tiroirs.garanti(etat.m, etat.h)));
    compteurs.fixer('max', 'Tiroir le plus plein ici', Guide.nombre(max));
  }

  Guide.curseur(barre, { nom: 'Interrupteurs (m)', min: 1, max: 10, valeur: etat.m, change: function (v) { etat.m = v; ranger(); } });
  Guide.curseur(barre, { nom: 'Tiroirs (h)', min: 1, max: 12, valeur: etat.h, change: function (v) { etat.h = v; ranger(); } });
  Guide.bouton(barre, 'Ranger au hasard', function () { etat.equitable = false; etat.graine++; ranger(); });
  Guide.bouton(barre, 'Ranger le plus équitablement', function () { etat.equitable = true; ranger(); });
  toile.quandRedimensionne(dessiner);
  etat.tas = Tiroirs.ranger(etat.m, etat.h, etat.graine, false);
  dessiner();
  return { etat: etat };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer** — `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 07**

- **En une phrase** : on fabrique énormément de candidats ; ils se rangent dans un petit nombre de tiroirs, et tout tiroir bien rempli fournit des pas magiques.
- **Ce qui coince** : il faut énormément de pas magiques, exponentiellement en f.
- **L'idée** : dans les grands mondes, chaque bon premier se casse en f paires de morceaux reflets (comme 2 + i et 2 − i), soit m = t × f paires en tout. On choisit un morceau par paire : 2^{tf} combinaisons. Mais dans ces mondes, une combinaison n'est pas toujours un vrai nombre ; c'est parfois seulement un « idéal », un produit abstrait qui n'a pas de valeur. Les combinaisons se rangent en h tiroirs (les « classes »). Deux combinaisons du même tiroir se divisent en un vrai nombre, qui donne un pas magique. Le tiroir le plus plein en contient au moins 2^{tf}/h. Si h reste inférieur à H^f, on obtient au moins (2^t/H)^f = e^{γf} pas : une exponentielle en f, dès que 2^t > H.
- **Image** : des chaussettes dans des tiroirs. 1 000 chaussettes et 10 tiroirs : un tiroir en contient au moins 100. **Limite** : ici, « même tiroir » veut dire « le rapport est un vrai nombre », une notion abstraite.
- **Autre point de vue** : des montants dans différentes monnaies. On ne divise un montant par un autre que s'ils sont dans la même monnaie ; le tiroir, c'est la monnaie.
- **Pour les curieux** : `|U| ≥ 2^{tf} / h(K) ≥ e^{γf}`, avec `γ = t log 2 − log H`.
- **Tu peux maintenant expliquer** : « On combine les morceaux des bons premiers : deux choix par paire, donc 2^{tf} combinaisons. Elles tombent dans h tiroirs. Le tiroir le plus plein donne au moins 2^{tf}/h pas magiques ; si h ne grandit pas trop vite, c'est exponentiel en f. »
- **Pour aller plus loin** : `etages/norme-un.md`, `sens/moyenner/README.md`.

- [ ] **Step 7 : vérifier et regarder**

- [ ] **Step 8 : point de contrôle**

---

### Task 8 : widget `fenetre` + chapitre 08

**Files :**
- Create : `assets/widgets/fenetre.js`
- Modify : `08-la-fenetre-et-le-coup-de-des.html`

**Interfaces :**
- Consumes : socle
- Produces : `window.Fenetre = { S: 5, PAS: [[a, b]] (12), aireChevauchement(R), rho(R), lancer(R, ax, ay) -> { points, paires, N, E }, moyennes(R) -> { N, E } }`

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « fenêtre » : un disque lancé au hasard sur un pavage ; une position au moins bat la moyenne. */
Guide.enregistrerControle('fenetre', function () {
  if (Fenetre.aireChevauchement(0.5) !== 0) return { ok: false, message: 'chevauchement non nul à R = 0,5' };
  if (!(Fenetre.rho(1000) > 0.999)) return { ok: false, message: 'ρ devrait tendre vers 1' };
  var R = 1.5, r = Guide.hasard(7), sN = 0, sE = 0, meilleur = -Infinity, cible = Fenetre.PAS.length * Fenetre.rho(R);
  for (var i = 0; i < 2000; i++) {
    var l = Fenetre.lancer(R, r(), r());
    sN += l.N; sE += l.E;
    meilleur = Math.max(meilleur, l.E - cible * l.N);
  }
  var moy = Fenetre.moyennes(R);
  if (Math.abs(sN / 2000 - moy.N) / moy.N > 0.03) return { ok: false, message: 'moyenne des clous ' + sN / 2000 + ' au lieu de ' + moy.N };
  if (Math.abs(sE / 2000 - moy.E) / moy.E > 0.05) return { ok: false, message: 'moyenne des paires ' + sE / 2000 + ' au lieu de ' + moy.E };
  if (meilleur < 0) return { ok: false, message: 'aucun lancer n\'atteint la moyenne' };
  return { ok: true, message: '' };
});
```

Chapitre 08 : « Le filet », `<div class="widget-zone" data-widget="fenetre"></div>`, consigne « Lance la fenêtre 200 fois : l'histogramme se répartit autour de la moyenne, et des lancers la dépassent. ». Script `assets/widgets/fenetre.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer** — `Fenetre is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Fenetre = (function () {
  'use strict';
  var S = 5;   // pavage (1/5)·Z² ; les 12 pas viennent de 25 = 0² + 5² = 3² + 4²
  var PAS = [[5, 0], [-5, 0], [0, 5], [0, -5], [3, 4], [3, -4], [-3, 4], [-3, -4], [4, 3], [4, -3], [-4, 3], [-4, -3]];
  /** Aire commune à deux disques de rayon R dont les centres sont à distance 1. */
  function aireChevauchement(R) { if (R <= 0.5) return 0; return 2 * R * R * Math.acos(1 / (2 * R)) - 0.5 * Math.sqrt(4 * R * R - 1); }
  function rho(R) { return aireChevauchement(R) / (Math.PI * R * R); }
  /** Pavage décalé de (ax, ay)/S, coupé par le disque de rayon R ; paires orientées (x, x + pas). */
  function lancer(R, ax, ay) {
    var r = Math.ceil(R * S) + 1, dedans = {}, points = [];
    for (var i = -r; i <= r; i++) for (var j = -r; j <= r; j++) {
      var x = (i + ax) / S, y = (j + ay) / S;
      if (x * x + y * y <= R * R) { dedans[i + ',' + j] = true; points.push([i, j]); }
    }
    var paires = [];
    points.forEach(function (p) { PAS.forEach(function (u) { if (dedans[(p[0] + u[0]) + ',' + (p[1] + u[1])]) paires.push([p, u]); }); });
    return { points: points, paires: paires, N: points.length, E: paires.length };
  }
  function moyennes(R) { return { N: Math.PI * R * R * S * S, E: PAS.length * aireChevauchement(R) * S * S }; }
  return { S: S, PAS: PAS, aireChevauchement: aireChevauchement, rho: rho, lancer: lancer, moyennes: moyennes };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('fenetre', function (zone) {
  var etat = { R: 1.5, a: [0.3, 0.6], graine: 5, rapports: [] };
  var toile = Guide.toile(zone, { rapport: 1, alt: 'Pavage de points ; un disque fenêtre ; les allumettes entre clous de la fenêtre.' });
  var histo = Guide.toile(zone, { rapport: 0.45, alt: 'Histogramme des allumettes par clou sur tous les lancers, avec la moyenne attendue.' });
  var lentille = Guide.toile(zone, { rapport: 0.35, alt: 'Deux disques décalés de 1 : leur partie commune.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var hasard = Guide.hasard(etat.graine);

  function attendu() { return Fenetre.PAS.length * Fenetre.rho(etat.R) / 2; }
  function dessinerPavage() {
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur;
    var l = Fenetre.lancer(etat.R, etat.a[0], etat.a[1]), e = (L / 2 - 10) / (etat.R + 0.3), S = Fenetre.S;
    function X(i) { return L / 2 + ((i + etat.a[0]) / S) * e; }
    function Y(j) { return H / 2 - ((j + etat.a[1]) / S) * e; }
    ctx.clearRect(0, 0, L, H);
    var r = Math.ceil((etat.R + 0.3) * S);
    ctx.fillStyle = c.trait;
    for (var i = -r; i <= r; i++) for (var j = -r; j <= r; j++) { ctx.beginPath(); ctx.arc(X(i), Y(j), 1.5, 0, 2 * Math.PI); ctx.fill(); }
    ctx.strokeStyle = c.ambre; ctx.globalAlpha = 0.6; ctx.lineWidth = 1;
    l.paires.forEach(function (p) {
      var u = p[1];
      if (u[0] < 0 || (u[0] === 0 && u[1] < 0)) return;
      ctx.beginPath(); ctx.moveTo(X(p[0][0]), Y(p[0][1])); ctx.lineTo(X(p[0][0] + u[0]), Y(p[0][1] + u[1])); ctx.stroke();
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = c.bleu;
    l.points.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 2.6, 0, 2 * Math.PI); ctx.fill(); });
    ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(L / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.stroke();
    compteurs.fixer('clous', 'Clous dans la fenêtre', Guide.nombre(l.N));
    compteurs.fixer('allumettes', 'Allumettes', Guide.nombre(l.E / 2));
    compteurs.fixer('parclou', 'Allumettes par clou (ce lancer)', l.N ? Guide.nombre(l.E / 2 / l.N, 2) : '0');
    compteurs.fixer('attendu', 'Moyenne attendue par clou', Guide.nombre(attendu(), 2));
    return l;
  }
  function dessinerHisto() {
    var c = Guide.couleurs(), ctx = histo.ctx, L = histo.largeur, H = histo.hauteur, m = 20;
    ctx.clearRect(0, 0, L, H);
    var a = attendu(), bas = a * 0.8, haut = a * 1.2, cases = 24, compte = [];
    for (var k = 0; k < cases; k++) compte.push(0);
    etat.rapports.forEach(function (v) { var k2 = Math.floor((v - bas) / (haut - bas) * cases); if (k2 >= 0 && k2 < cases) compte[k2]++; });
    var max = Math.max(1, Math.max.apply(null, compte)), w = (L - 2 * m) / cases;
    ctx.fillStyle = c.bleu;
    compte.forEach(function (n, k3) { var h = (n / max) * (H - 2 * m); ctx.fillRect(m + k3 * w + 1, H - m - h, w - 2, h); });
    var xa = m + ((a - bas) / (haut - bas)) * (L - 2 * m);
    ctx.strokeStyle = c.rouge; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(xa, 4); ctx.lineTo(xa, H - m); ctx.stroke(); ctx.setLineDash([]);
    var dessus = etat.rapports.filter(function (v) { return v >= a; }).length;
    compteurs.fixer('lancers', 'Lancers au-dessus de la moyenne', etat.rapports.length ? dessus + ' sur ' + etat.rapports.length : 'aucun lancer');
  }
  function dessinerLentille() {
    var c = Guide.couleurs(), ctx = lentille.ctx, L = lentille.largeur, H = lentille.hauteur;
    var e = (H / 2 - 6) / etat.R, cx = L / 2;
    ctx.clearRect(0, 0, L, H);
    ctx.globalAlpha = 0.25; ctx.fillStyle = c.sarcelle;
    ctx.beginPath(); ctx.arc(cx - e / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.fill();
    ctx.beginPath(); ctx.arc(cx + e / 2, H / 2, etat.R * e, 0, 2 * Math.PI); ctx.fill();
    ctx.globalAlpha = 1;
    compteurs.fixer('rho', 'Part commune de deux fenêtres décalées de 1', Guide.nombre(Fenetre.rho(etat.R) * 100, 1) + ' %');
  }
  function lancerUneFois() {
    etat.a = [hasard(), hasard()];
    var l = Fenetre.lancer(etat.R, etat.a[0], etat.a[1]);
    if (l.N) etat.rapports.push(l.E / 2 / l.N);
  }
  function toutDessiner() { dessinerPavage(); dessinerHisto(); dessinerLentille(); }

  Guide.curseur(barre, { nom: 'Rayon de la fenêtre', min: 0.8, max: 2.5, pas: 0.1, valeur: etat.R, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { etat.R = v; etat.rapports = []; toutDessiner(); } });
  Guide.bouton(barre, 'Lancer la fenêtre', function () { lancerUneFois(); toutDessiner(); });
  Guide.bouton(barre, 'Lancer 200 fois', function () { for (var i = 0; i < 200; i++) lancerUneFois(); toutDessiner(); });
  Guide.bouton(barre, 'Effacer l\'histogramme', function () { etat.rapports = []; toutDessiner(); });
  toile.quandRedimensionne(dessinerPavage);
  histo.quandRedimensionne(dessinerHisto);
  lentille.quandRedimensionne(dessinerLentille);
  toutDessiner();
  return { etat: etat };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer** — `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 08**

- **En une phrase** : on garde seulement les points d'un pavage infini qui tombent dans une fenêtre, et un argument de moyenne garantit une position de fenêtre très riche en allumettes.
- **Ce qui coince** : les pas magiques vivent dans un pavage infini ; il faut un ensemble fini de clous où beaucoup de paires diffèrent d'un pas.
- **L'idée** : le pavage est un quadrillage régulier, vu sur tous les écrans. La fenêtre est un disque sur chaque écran. On la place au hasard. En moyenne, le nombre de clous dedans vaut volume ÷ taille d'une case. Pour un pas donné, le nombre moyen de paires dépend de la partie commune entre la fenêtre et sa copie décalée de ce pas ; comme le pas mesure 1 sur chaque écran, on perd une fraction ρ par écran. Une position au moins fait aussi bien que la moyenne. En prenant la fenêtre assez grande, ρ est proche de 1 et on perd au plus la moitié de l'exposant : chaque clou garde au moins e^{γf/2} allumettes.
- **Image** : un filet lancé sur un banc de poissons régulièrement espacés. En moyenne, le filet en prend un certain nombre ; certains lancers en prennent au moins autant. Autre image : si la moyenne d'une classe est 12, au moins un élève a 12 ou plus. **Limite** : l'argument ne dit pas où est la bonne position ; il prouve seulement qu'elle existe.
- **Autre point de vue** : ρ est la part commune de deux disques décalés de 1. Plus le disque est grand, plus cette part s'approche de 100 %.
- **Pour les curieux** : `E[E_a] = |U| · ρ_R^f · E[N_a]` ; `ρ_R → 1` quand `R` grandit ; on choisit `R` tel que `ρ_R^f ≥ e^{−γf/2}`.
- **Tu peux maintenant expliquer** : « On découpe une fenêtre dans le pavage infini. En moyenne sur les positions, chaque clou a beaucoup de voisins par un pas magique, à une petite perte près au bord. Une position au moins atteint cette moyenne : on la garde. »
- **Pour aller plus loin** : `etages/fenetre.md`, `sens/moyenner/README.md`.

- [ ] **Step 7 : vérifier et regarder**

- [ ] **Step 8 : point de contrôle**

---

### Task 9 : widget `bilan` + chapitres 10 et 13

**Files :**
- Create : `assets/widgets/bilan.js`
- Modify : `10-le-bilan.html`, `13-les-tiroirs-restent-peu-nombreux.html`

**Interfaces :**
- Consumes : `DeuxCarres.cout` (tâche 4), socle
- Produces : `window.Bilan = { etat(gamma, B, f) -> { logPas, logn, logAllumettes, exposant, delta, exposantLimite }, grille(t) -> { logn, exposant }, course(l, c) -> { t, cles, tiroirs, gamma }, C_ILLUSTRATIF: 2 }`. Options de zone : `data-mode="bilan"` ou `data-mode="course"`.

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « bilan » : trois croissances exponentielles et la course clés / tiroirs. */
Guide.enregistrerControle('bilan', function () {
  var e = Bilan.etat(0.5, 8, 50);
  if (Math.abs(e.delta - 0.015625) > 1e-12) return { ok: false, message: 'δ = ' + e.delta + ' au lieu de 0,015625' };
  if (Math.abs(Bilan.etat(0.5, 8, 2000).exposant - 1.03125) > 1e-3) return { ok: false, message: 'l\'exposant devrait tendre vers 1 + γ/2B' };
  for (var t = 2; t <= 30; t++) if (!(Bilan.grille(t).exposant < Bilan.grille(t - 1).exposant)) return { ok: false, message: 'l\'exposant de la grille devrait baisser à t = ' + t };
  if (!(Bilan.course(100, 2).gamma < 0) || !(Bilan.course(5000, 2).gamma > 0)) return { ok: false, message: 'la course clés / tiroirs devrait changer de signe entre ℓ = 100 et ℓ = 5000' };
  return { ok: true, message: '' };
});
```

`grille(t)` s'appuie sur `DeuxCarres.cout(t)`, dont la liste vérifiée s'arrête à 30 bons premiers : t reste donc ≤ 30.

Chapitre 10 : « Le tableau de bord », `<div class="widget-zone" data-widget="bilan" data-mode="bilan"></div>`, consigne « Monte f : tout grandit, mais l'exposant reste fixe. Active “grille d'Erdős” : son exposant s'écrase. ». Chapitre 13 : « La course », `data-mode="course"`, consigne « Monte ℓ : la courbe des clés finit par passer au-dessus de celle des tiroirs. ». Les deux pages chargent `deux-carres.js` puis `bilan.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer** — `Bilan is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Bilan = (function () {
  'use strict';
  /** En log10 : pas e^{γf}, clous au plus e^{Bf} (pire cas retenu), allumettes au moins ½ · n · e^{γf/2}. */
  function etat(gamma, B, f) {
    var L = Math.LOG10E;
    var logPas = gamma * f * L, logn = B * f * L;
    var logAllumettes = logn + (gamma * f / 2) * L - Math.log10(2);
    return { logPas: logPas, logn: logn, logAllumettes: logAllumettes, exposant: logAllumettes / logn, delta: gamma / (4 * B), exposantLimite: 1 + gamma / (2 * B) };
  }
  /** Recette d'Erdős avec t bons premiers (t ≤ 30) : taille log10 n et exposant 1 + log chemins / log n. */
  function grille(t) { var c = DeuxCarres.cout(Math.min(t, 30)); return { logn: c.logn * Math.LOG10E, exposant: 1 + c.exposant }; }
  /** Course : clés t·log 2 contre tiroirs c·ℓ·log ℓ (c illustratif : la vraie constante n'est pas connue). */
  function course(l, c) {
    var t = Math.floor((l - 1) * (l - 1) / 100);
    var cles = t * Math.LN2, tiroirs = c * l * Math.log(l);
    return { t: t, cles: cles, tiroirs: tiroirs, gamma: cles - tiroirs };
  }
  return { etat: etat, grille: grille, course: course, C_ILLUSTRATIF: 2 };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('bilan', function (zone, options) {
  return options.mode === 'course' ? monterCourse(zone) : monterBilan(zone);

  function monterBilan(zone) {
    var p = { gamma: 0.5, B: 8, f: 40, grille: false };
    var toile = Guide.toile(zone, { rapport: 0.55, alt: 'Trois barres : pas magiques, clous, allumettes, en nombre de chiffres.' });
    var courbe = Guide.toile(zone, { rapport: 0.6, alt: 'Exposant obtenu en fonction de la taille : constant pour la preuve, qui s\'écrase vers 1 pour la grille d\'Erdős.' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, e = Bilan.etat(p.gamma, p.B, p.f);
      ctx.clearRect(0, 0, L, H);
      var lignes = [['pas magiques', e.logPas, c.rouge], ['clous (au plus)', e.logn, c.bleu], ['allumettes (au moins)', e.logAllumettes, c.ambre]];
      var max = Math.max(e.logAllumettes, 1), h = H / 3;
      lignes.forEach(function (ligne, i) {
        var w = (ligne[1] / max) * (L - 16);
        ctx.fillStyle = ligne[2]; ctx.fillRect(8, i * h + h * 0.45, Math.max(w, 2), h * 0.4);
        ctx.fillStyle = c.texte; ctx.font = '13px system-ui, sans-serif';
        ctx.fillText(ligne[0] + ' : ' + Guide.chiffres(ligne[1]), 8, i * h + h * 0.38);
      });
      dessinerCourbe(e);
      compteurs.fixer('exposant', 'Exposant obtenu', '1 + ' + Guide.nombre(e.exposant - 1, 4));
      compteurs.fixer('limite', 'Exposant visé (f très grand)', '1 + γ/2B = 1 + ' + Guide.nombre(p.gamma / (2 * p.B), 4));
      compteurs.fixer('delta', 'δ garanti par la preuve', Guide.nombre(e.delta, 4));
    }
    function dessinerCourbe(e) {
      var c = Guide.couleurs(), ctx = courbe.ctx, L = courbe.largeur, H = courbe.hauteur, m = 30;
      ctx.clearRect(0, 0, L, H);
      if (!p.grille) { ctx.fillStyle = c.discret; ctx.font = '13px system-ui, sans-serif'; ctx.fillText('Active « grille d\'Erdős » pour comparer.', m, H / 2); return; }
      var xmax = 60, ymax = 1.8;
      function X(v) { return m + (v / xmax) * (L - 2 * m); }
      function Y(v) { return H - m - ((v - 1) / (ymax - 1)) * (H - 2 * m); }
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, Y(1)); ctx.lineTo(L - m, Y(1)); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      ctx.strokeStyle = c.sarcelle; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(0), Y(e.exposantLimite)); ctx.lineTo(X(xmax), Y(e.exposantLimite)); ctx.stroke();
      ctx.fillStyle = c.ambre;
      for (var t = 1; t <= 30; t++) { var g = Bilan.grille(t); if (g.logn <= xmax) { ctx.beginPath(); ctx.arc(X(g.logn), Y(Math.min(g.exposant, ymax)), 3.5, 0, 2 * Math.PI); ctx.fill(); } }
      ctx.font = '12px system-ui, sans-serif';
      ctx.fillStyle = c.sarcelle; ctx.fillText('preuve', X(xmax) - 50, Y(e.exposantLimite) - 6);
      ctx.fillStyle = c.ambre; ctx.fillText('grille d\'Erdős', X(4), Y(1.6));
      ctx.fillStyle = c.discret; ctx.fillText('chiffres de n →', L - m - 90, H - 8);
    }
    Guide.curseur(barre, { nom: 'Gain net des clés (γ)', min: 0.1, max: 2, pas: 0.05, valeur: p.gamma, format: function (v) { return Guide.nombre(v, 2); }, change: function (v) { p.gamma = v; dessiner(); } });
    Guide.curseur(barre, { nom: 'Coût de la fenêtre (B)', min: 2, max: 20, pas: 0.5, valeur: p.B, format: function (v) { return Guide.nombre(v, 1); }, change: function (v) { p.B = v; dessiner(); } });
    Guide.curseur(barre, { nom: 'Nombre d\'écrans (f)', min: 1, max: 300, valeur: p.f, change: function (v) { p.f = v; dessiner(); } });
    Guide.bouton(barre, 'Grille d\'Erdős', function (actif) { p.grille = actif; dessiner(); }, { bascule: true, actif: false });
    toile.quandRedimensionne(dessiner);
    courbe.quandRedimensionne(dessiner);
    dessiner();
    return { parametres: p };
  }

  function monterCourse(zone) {
    var l = 1000, c0 = Bilan.C_ILLUSTRATIF;
    var toile = Guide.toile(zone, { rapport: 0.7, alt: 'Deux courbes en fonction de ℓ : les clés (environ ℓ²) finissent par dépasser les tiroirs (environ ℓ log ℓ).' });
    var barre = Guide.barre(zone);
    var compteurs = Guide.compteurs(zone);
    function dessiner() {
      var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, m = 30, lmax = 5000;
      var ymax = Math.log10(Bilan.course(lmax, c0).cles);
      function X(v) { return m + (v / lmax) * (L - 2 * m); }
      function Y(v) { return H - m - (Math.log10(Math.max(v, 1)) / ymax) * (H - 2 * m); }
      ctx.clearRect(0, 0, L, H);
      ctx.strokeStyle = c.trait; ctx.beginPath(); ctx.moveTo(m, H - m); ctx.lineTo(L - m, H - m); ctx.moveTo(m, m / 2); ctx.lineTo(m, H - m); ctx.stroke();
      [['cles', c.vert, 'clés'], ['tiroirs', c.rouge, 'tiroirs']].forEach(function (s) {
        ctx.strokeStyle = s[1]; ctx.lineWidth = 3; ctx.beginPath();
        for (var v = 10; v <= lmax; v += 20) { var y = Y(Bilan.course(v, c0)[s[0]]); if (v === 10) ctx.moveTo(X(v), y); else ctx.lineTo(X(v), y); }
        ctx.stroke();
        ctx.fillStyle = s[1]; ctx.font = '12px system-ui, sans-serif'; ctx.fillText(s[2], L - m - 50, Y(Bilan.course(lmax, c0)[s[0]]) - 6);
      });
      ctx.setLineDash([4, 4]); ctx.strokeStyle = c.discret; ctx.beginPath(); ctx.moveTo(X(l), m / 2); ctx.lineTo(X(l), H - m); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = c.discret; ctx.fillText('c = ' + c0 + ' : valeur d\'illustration', m + 6, m);
      var r = Bilan.course(l, c0);
      compteurs.fixer('t', 'Clés (t)', Guide.nombre(r.t));
      compteurs.fixer('cles', 'Gain des clés (t × log 2)', Guide.nombre(r.cles, 0));
      compteurs.fixer('tiroirs', 'Perte des tiroirs (c × ℓ × log ℓ)', Guide.nombre(r.tiroirs, 0));
      compteurs.fixer('verdict', 'Verdict', r.gamma > 0 ? 'les clés gagnent : γ > 0' : 'les tiroirs gagnent encore');
    }
    Guide.curseur(barre, { nom: 'ℓ (corps cubiques collés)', min: 10, max: 5000, pas: 10, valeur: l, change: function (v) { l = v; dessiner(); } });
    toile.quandRedimensionne(dessiner);
    dessiner();
    return {};
  }
});
```

- [ ] **Step 5 : lancer le test pour le voir passer**

Run : `cd tests && node verifier.mjs 10-le-bilan.html 13-les-tiroirs-restent-peu-nombreux.html`
Expected : `Tout est vert.` (contrôles `deux-carres` et `bilan`).

- [ ] **Step 6 : rédiger le chapitre 10**

- **En une phrase** : les pas magiques grandissent comme e^{γf}, les clous au plus comme e^{Bf} ; chaque clou gagne donc une vraie puissance de n, qui ne fond pas, contrairement à la recette d'Erdős.
- **Ce qui coince** : assembler les morceaux.
- **L'idée** : trois comptes. f ≥ log n / B ; les allumettes valent au moins ½ · n · e^{γf/2}, donc au moins ½ · n^{1 + γ/2B} ; on en tire δ = γ/4B. Cet exposant est fixe parce que γ (clés contre tiroirs) et B (fenêtre et dénominateur) ne dépendent pas de f. Au chapitre 04, le bouton t gonflait le dénominateur ; ici, le bouton f n'y touche pas.
- **Image** : deux coureurs qui accélèrent sans cesse, l'un allant toujours à une fraction fixe de la vitesse de l'autre. Cette fraction, c'est l'exposant. **Limite** : δ est minuscule et sa valeur n'est pas connue ; c'est une victoire théorique.
- **Autre point de vue** : la dimension est le nouveau bouton. Bouton d'Erdős : t ; bouton de la preuve : f.
- **Pour les curieux** : `ν(P) ≥ ½ n e^{γf/2}` et `n ≤ e^{Bf}`, donc `ν(P) ≥ ½ n^{1 + γ/2B} ≥ n^{1+δ}`.
- **Tu peux maintenant expliquer** : « Les pas magiques croissent comme une exponentielle de f, et le nombre de clous au plus comme une autre exponentielle de f. Le gain par clou est donc une puissance fixe du nombre de clous. Il ne reste qu'à trouver des mondes de dimension aussi grande qu'on veut, avec γ et B fixes. »
- **Pour aller plus loin** : `README.md#pourquoi-ca-marche`.

- [ ] **Step 7 : rédiger le chapitre 13**

- **En une phrase** : un prix par étage constant force un nombre de tiroirs au plus exponentiel, et les clés grandissent plus vite que ce prix quand ℓ est grand.
- **Ce qui coince** : la condition (2) du cahier des charges (chapitre 11).
- **L'idée** : le « prix par étage » (le discriminant racine : la taille arithmétique par dimension) reste constant le long de la tour, et double au plus quand on ajoute i. Minkowski : chaque tiroir contient un représentant de petite taille, et il y a peu de petites choses, donc h ≤ H^f, avec H qui ne dépend que du prix. La course : t × log 2 ≈ 0,007 × ℓ² contre log H ≈ c × ℓ × log ℓ. Les clés gagnent quand ℓ est grand : γ > 0.
- **Image** : chaque famille compte un enfant de moins de 10 ans ; s'il y a peu d'enfants, il y a peu de familles. **Limite** : le « petit représentant » est un idéal de petite norme, pas un objet familier.
- **Autre point de vue** : une compétition d'exposants entre un carré (ℓ²) et un « presque linéaire » (ℓ log ℓ) ; le carré finit toujours devant.
- **Pour les curieux** : `h(K) ≤ max{2, rd(K)}^{C · [K:Q]}` ; `rd(K_j) ≤ 2 rd(F)` ; `log H_ℓ = O(ℓ log ℓ)` ; `t log 2 ≥ (ℓ − 1)² log 2 / 200`.
- **Tu peux maintenant expliquer** : « Comme le prix par étage ne bouge pas, le nombre de tiroirs ne peut pas exploser. Et avec ℓ assez grand, les clés (environ ℓ²) battent les tiroirs (environ ℓ log ℓ). Le cahier des charges est rempli : la preuve est complète. »
- **Pour aller plus loin** : `etages/nombre-classes.md`, `sens/jauger/borne-minkowski.md`.

- [ ] **Step 8 : vérifier et regarder**

- [ ] **Step 9 : point de contrôle**

---

### Task 10 : widget `budget` + chapitres 11 et 12

**Files :**
- Create : `assets/widgets/budget.js`
- Modify : `11-le-cahier-des-charges.html`, `12-construire-la-tour.html`

**Interfaces :**
- Consumes : socle
- Produces : `window.Budget = { etat(l, t) -> { d, depart, cles, total, plafond, infini }, tAuto(l) -> number }`

- [ ] **Step 1 : écrire le contrôle**

```js
/* Widget « budget » : pièces libres, règles, et le plafond de Golod–Shafarevich. */
Guide.enregistrerControle('budget', function () {
  var a = Budget.etat(100, Budget.tAuto(100));
  if (a.d !== 99 || a.total !== 101 + 3 * 96 || Math.abs(a.plafond - 2450.25) > 1e-9 || !a.infini) return { ok: false, message: 'ℓ = 100 : état incorrect ' + JSON.stringify(a) };
  var b = Budget.etat(20, 50);
  if (b.infini) return { ok: false, message: 'ℓ = 20, t = 50 devrait dépasser le plafond' };
  for (var l = 5; l <= 200; l++) {
    var e = Budget.etat(l, Budget.tAuto(l));
    if (e.infini !== (e.total <= e.plafond)) return { ok: false, message: 'verdict incohérent à ℓ = ' + l };
  }
  return { ok: true, message: '' };
});
```

Chapitre 11 : pas de widget ; un schéma SVG (voir step 6). Chapitre 12 : « Le budget des règles », `<div class="widget-zone" data-widget="budget"></div>`, consigne « Monte ℓ : la jauge reste sous le plafond. Coupe “t automatique” et force t jusqu'à dépasser : le verdict devient “on ne sait pas”. ». Script `assets/widgets/budget.js`.

- [ ] **Step 2 : lancer le test pour le voir échouer** — `Budget is not defined`.

- [ ] **Step 3 : écrire le modèle**

```js
var Budget = (function () {
  'use strict';
  /** d = ℓ − 1 pièces libres (borne basse, prise comme valeur d'illustration) ; règles d + 2 + 3t ; plafond d²/4. */
  function etat(l, t) {
    var d = l - 1, depart = d + 2, cles = 3 * t, total = depart + cles, plafond = d * d / 4;
    return { d: d, depart: depart, cles: cles, total: total, plafond: plafond, infini: total <= plafond };
  }
  function tAuto(l) { return Math.floor((l - 1) * (l - 1) / 100); }
  return { etat: etat, tAuto: tAuto };
})();
```

- [ ] **Step 4 : écrire la vue**

```js
Guide.enregistrerWidget('budget', function (zone) {
  var p = { l: 60, t: Budget.tAuto(60), auto: true };
  var toile = Guide.toile(zone, { rapport: 0.5, alt: 'Jauge des règles : règles de départ, règles ajoutées pour les clés, et le plafond.' });
  var barre = Guide.barre(zone);
  var compteurs = Guide.compteurs(zone);
  var curseurT;
  function dessiner() {
    if (p.auto) { p.t = Budget.tAuto(p.l); if (curseurT) curseurT.entree.value = p.t; }
    var c = Guide.couleurs(), ctx = toile.ctx, L = toile.largeur, H = toile.hauteur, e = Budget.etat(p.l, p.t);
    var echelle = (L - 24) / Math.max(e.total, e.plafond) / 1.05, y = H * 0.35, h = H * 0.3;
    ctx.clearRect(0, 0, L, H);
    ctx.fillStyle = c.discret; ctx.fillRect(12, y, e.depart * echelle, h);
    ctx.fillStyle = e.infini ? c.ambre : c.rouge; ctx.fillRect(12 + e.depart * echelle, y, e.cles * echelle, h);
    var xp = 12 + e.plafond * echelle;
    ctx.strokeStyle = c.vert; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xp, y - 14); ctx.lineTo(xp, y + h + 14); ctx.stroke();
    ctx.fillStyle = c.vert; ctx.font = '12px system-ui, sans-serif'; ctx.fillText('plafond d²/4', Math.min(xp - 40, L - 90), y - 18);
    ctx.fillStyle = c.texte; ctx.fillText('règles', 12, y + h + 18);
    compteurs.fixer('d', 'Pièces libres (d = ℓ − 1, au moins)', Guide.nombre(e.d));
    compteurs.fixer('depart', 'Règles de départ (d + 2)', Guide.nombre(e.depart));
    compteurs.fixer('cles', 'Règles pour les clés (3t)', Guide.nombre(e.cles));
    compteurs.fixer('plafond', 'Plafond (d²/4)', Guide.nombre(e.plafond, 2));
    compteurs.fixer('verdict', 'Verdict', e.infini ? 'tour infinie garantie' : 'on ne sait pas : trop de règles');
  }
  Guide.curseur(barre, { nom: 'ℓ (corps cubiques collés)', min: 5, max: 200, valeur: p.l, change: function (v) { p.l = v; dessiner(); } });
  curseurT = Guide.curseur(barre, { nom: 'Clés imposées (t)', min: 0, max: 2000, valeur: p.t, change: function (v) { p.auto = false; boutonAuto.setAttribute('aria-pressed', 'false'); p.t = v; dessiner(); } });
  var boutonAuto = Guide.bouton(barre, 't automatique', function (actif) { p.auto = actif; dessiner(); }, { bascule: true, actif: true });
  toile.quandRedimensionne(dessiner);
  dessiner();
  return { parametres: p };
});
```

- [ ] **Step 5 : lancer le test pour le voir passer** — `Tout est vert.`

- [ ] **Step 6 : rédiger le chapitre 11 (sans widget)**

- **En une phrase** : il faut une suite infinie de mondes de plus en plus grands, où les mêmes bons premiers marchent partout et où le nombre de tiroirs ne grossit pas plus vite qu'une exponentielle.
- **Ce qui coince** : tout repose sur de « bons mondes » de dimension f aussi grande qu'on veut.
- **L'idée** : le cahier des charges.
  - (0) Un monde « réel » auquel on ajoute i, pour que le miroir marche sur chaque écran.
  - (1) Les mêmes t bons premiers se cassent en f morceaux dans chaque monde, ce qui fixe 𝒟, donc B.
  - (2) h ≤ H^f avec H fixe, ce qui fixe γ, et 2^t > H.
  Les familles naïves échouent : dans les mondes cyclotomiques, un premier fixé ne se casse complètement que dans un nombre fini d'entre eux, et le nombre de tiroirs explose.
- **Image** : un immeuble infini, chaque étage plus grand que le précédent ; (1) les mêmes clés ouvrent toutes les portes à chaque étage ; (2) le nombre de boîtes aux lettres par appartement reste raisonnable. **Limite** : ici les « étages » sont des mondes qui contiennent les précédents, et les « clés » sont des nombres premiers.
- **Autre point de vue** : ce cahier des charges est l'interface entre les deux moitiés de la preuve. La géométrie ne s'intéresse pas à la façon dont les mondes sont fabriqués.
- **Schéma** (à la place du widget, `<figure>` SVG vertical, viewBox 320 × 420) : trois cases empilées « (0) réel + i », « (1) mêmes clés partout », « (2) peu de tiroirs », chacune reliée par une flèche à « chapitre 12 » ou « chapitre 13 », et en bas « → géométrie (chapitres 05 à 10) ». Couleurs via `currentColor` et les variables CSS, texte ≥ 14 px.
- **Pour les curieux** : donnée admissible : `L_j` totalement réel, `f_j → ∞`, `q_b ≡ 1 (mod 4)` totalement décomposés, `h(K_j) ≤ H^{f_j}`, `γ = t log 2 − log H > 0`.
- **Tu peux maintenant expliquer** : « La géométrie marche dès qu'on dispose de mondes aussi grands qu'on veut, avec les mêmes clés partout et peu de tiroirs. Les familles évidentes ratent l'une ou l'autre condition : il faut les construire. »
- **Pour aller plus loin** : `README.md#deux-niveaux`, `grille-erdos.md#pourquoi-pas-une-famille-naive-de-degre-croissant`.

- [ ] **Step 7 : rédiger le chapitre 12**

- **En une phrase** : on part d'un monde de base avec beaucoup de directions libres, on empile des étages sans fissure, et un budget de règles garantit que l'empilement ne s'arrête jamais, même en imposant que les clés marchent à chaque étage.
- **Ce qui coince** : fabriquer des mondes qui remplissent (0), (1) et (2).
- **L'idée** :
  - **base** : coller ℓ mondes cubiques (issus des premiers r ≡ 1 mod 3) donne un monde F avec au moins ℓ − 1 directions libres pour s'agrandir sans fissure (sans ramification) ;
  - **étages** : une extension sans fissure garde le prix par étage constant ;
  - **clés** : Chebotarev garantit qu'il existe toujours des premiers qui se comportent parfaitement dans un monde fini donné ; on en choisit t, puis on impose qu'ils se cassent complètement à chaque étage, et chaque imposition coûte une règle ;
  - **budget** (Golod–Shafarevich) : avec d directions libres et r règles, si r ≤ d²/4, la tour est infinie. Au départ, r ≤ d + 2 ; les clés coûtent 3t ; avec t ≈ ℓ²/100, on reste sous d²/4 ;
  - **pourquoi 3** : un nombre impair empêche un écran réel de devenir complexe, donc le monde reste « réel » et le miroir marche (condition 0). Tout autre premier impair marcherait aussi ; 3 est le plus petit.
- **Image** : des LEGO. d pièces libres, r règles d'assemblage ; avec peu de règles, on peut construire indéfiniment. Un immeuble sans fissure : chaque étage garde le même prix au mètre carré. **Limite** : Golod–Shafarevich ne conclut que dans un sens. Avec beaucoup de règles, on ne sait pas, ce qui ne veut pas dire que c'est fini.
- **Autre point de vue** : on construit du côté des symétries (on ajoute des règles à un groupe), puis on lit du côté des mondes : plus le groupe de symétries est petit, plus le monde est grand.
- **Pour les curieux** : `d(G) ≥ ℓ − 1` ; `r(G) ≤ d + 2` ; `r(Ḡ) ≤ d + 2 + 3t < d²/4`, donc Ḡ est infini ; `t = ⌊(ℓ − 1)²/100⌋`.
- **Tu peux maintenant expliquer** : « On colle des mondes cubiques pour avoir beaucoup de directions libres. On empile des étages sans fissure, ce qui garde le prix par étage constant. Imposer que les clés marchent partout coûte des règles, mais le budget de Golod–Shafarevich reste positif : la tour est infinie. »
- **Pour aller plus loin** : `etages/corps-de-base.md`, `etages/tour-pro-3.md`, `meta-sens/seuil.md`, `sens/signer/README.md`, `README.md#pourquoi-p--3`.

- [ ] **Step 8 : vérifier et regarder**

- [ ] **Step 9 : point de contrôle**

---

### Task 11 : chapitre 14, sommaire final, lexique, lien depuis le README du théorème

**Files :**
- Modify : `14-toute-la-preuve-en-une-page.html`, `index.html`, `lexique.html`
- Modify : `../README.md` (section « Parcours de lecture »)

**Interfaces :**
- Consumes : tous les chapitres
- Produces : rien de neuf

- [ ] **Step 1 : rédiger le chapitre 14** (gabarit propre, exempté du contrôle de sections)

- `h2` « Le récit en 10 phrases » : `<ol>` de 10 phrases, une par grande étape (défi, recette d'Erdős, pourquoi elle plafonne, écrans, pas magiques, tiroirs, fenêtre, pas trop de points, bilan, construction des mondes).
- `h2` « Le schéma » : `<figure>` SVG vertical (viewBox 320 × 760) : 11 cases empilées reliées par des flèches, de « Allumettes » à « n^{1+δ} », la case « Recette d'Erdős » barrée en ambre avec « s'essouffle », couleurs par variables CSS.
- `h2` « Pour le dessiner ou l'animer » : 5 idées de storyboard, par exemple (1) clous et allumettes, (2) le cercle qui s'allume premier par premier, (3) deux écrans côte à côte avec le même pas, (4) le filet lancé sur le pavage, (5) la jauge du budget de règles.
- `h2` « Auto-test » : 8 questions, chacune dans un `<details>` avec sa réponse (exemples : « Pourquoi la recette d'Erdős plafonne-t-elle ? », « Pourquoi le dessin final ne superpose-t-il jamais deux clous ? », « Que garantit Golod–Shafarevich, et que ne garantit-il pas ? »).
- `.plus-loin` : lien vers le README du théorème.

- [ ] **Step 2 : finaliser `index.html`**

Accroche (3 phrases : le problème, le renversement, ce que le guide permet), « Comment lire » (environ 2 h ; les encadrés « Pour les curieux » sont facultatifs ; les widgets se manipulent au doigt), carte du parcours en SVG vertical (les 14 chapitres en 4 groupes : le problème 01-04, la géométrie 05-10, les mondes 11-13, la synthèse 14), le sommaire de la tâche 1, et « Sources » (le PDF *Planar Point Sets with Many Unit Distances* ; lien GitHub vers le README du théorème).

- [ ] **Step 3 : écrire `lexique.html`**

Une `<div class="terme">` par entrée : `<h3>` mot simple, `<p>` explication en une phrase, `<p class="technique">` mot technique, lien vers le chapitre, lien GitHub vers la doc technique. Entrées obligatoires :

| Mot simple | Mot technique | Chapitre | Doc technique |
|---|---|---|---|
| clou, allumette | point, paire à distance unité, ν(P) | 01 | `README.md` |
| bonus lent | n^{C / log log n} | 02 | `README.md` |
| bon premier | premier q ≡ 1 (mod 4), totalement décomposé | 03 | `sens/signer/README.md` |
| morceaux d'un premier | idéaux premiers | 03, 07 | `vocabulaire/prerequis.md` |
| écran | plongement complexe σ | 05 | `sens/plonger/README.md` |
| monde | corps de nombres K | 05 | `vocabulaire/prerequis.md` |
| monde réel + i | corps totalement réel, corps CM | 06 | `vocabulaire/prerequis.md` |
| reflet, miroir | conjugaison c | 06 | `sens/unitariser/README.md` |
| pas magique | élément de norme relative 1, u = α/c(α) | 06 | `sens/unitariser/README.md` |
| combinaison | idéal A_ε | 07 | `etages/norme-un.md` |
| tiroir | classe d'idéaux ; h = nombre de classes | 07 | `etages/norme-un.md` |
| pavage | réseau Λ, plongement de Minkowski | 08 | `etages/fenetre.md` |
| fenêtre | polydisque B_R | 08 | `etages/fenetre.md` |
| coup de dés | moyenne sur le tore V/Λ | 08 | `sens/moyenner/README.md` |
| part commune | ρ_R | 08 | `etages/fenetre.md` |
| écart entier | norme d'un entier algébrique non nul ≥ 1 | 09 | `vocabulaire/patterns.md` |
| oranges dans la caisse | empilement (packing) | 09 | `sens/tasser/README.md` |
| prix par étage | discriminant racine rd | 13 | `sens/jauger/README.md` |
| étage sans fissure | extension non ramifiée | 12 | `vocabulaire/prerequis.md` |
| tour | tour pro-3 non ramifiée | 12 | `etages/tour-pro-3.md` |
| directions libres | générateurs d(G) | 12 | `meta-sens/seuil.md` |
| règles | relations r(G) | 12 | `meta-sens/seuil.md` |
| budget de règles | inégalité de Golod–Shafarevich | 12 | `meta-sens/seuil.md` |
| clés universelles | premiers totalement décomposés (Chebotarev, Frobenius) | 12 | `sens/signer/README.md` |
| cubes collés | corps cubiques cycliques, compositum | 12 | `etages/corps-de-base.md` |

- [ ] **Step 4 : ajouter le guide au README du théorème**

Dans `../README.md`, juste sous `## Parcours de lecture`, insérer :

```markdown
**Guide grand public** : [`_guide/`](_guide/index.html), en ligne sur [tyb-tech.fr/unit-distance](https://tyb-tech.fr/unit-distance/). Mêmes étapes, sans vocabulaire technique, avec des widgets à manipuler.
```

- [ ] **Step 5 : vérifier**

Run : `cd tests && node verifier.mjs`
Expected : `Tout est vert.` (64 lignes). Regarder `captures/index-390.png`, `captures/14-…-390.png`, `captures/lexique-390.png`.

- [ ] **Step 6 : point de contrôle**

---

### Task 12 : relecture indépendante et passage final

**Files :**
- Modify : n'importe quelle page selon les remarques

- [ ] **Step 1 : lancer un relecteur indépendant**

Agent `general-purpose`, en lecture seule. Consigne : lire le PDF `/Users/yanntyb/Downloads/unit-distance-proof.pdf` et les 16 pages HTML. Signaler, avec la page et la phrase citée : (a) toute affirmation mathématique fausse ou trompeuse, analogies comprises ; (b) tout mot technique employé avant d'être expliqué dans le guide ; (c) toute limite d'analogie absente ou fausse ; (d) toute incohérence entre chapitres. Classer par gravité.

- [ ] **Step 2 : corriger chaque remarque fondée**, en notant celles écartées et pourquoi.

- [ ] **Step 3 : passage final**

Run : `cd tests && node verifier.mjs --final`
Expected : `Tout est vert.` : plus de texte provisoire, toutes les sections présentes.

- [ ] **Step 4 : point de contrôle** : résumé des corrections à l'utilisateur.

---

### Task 13 : publication sous `tyb-tech.fr/unit-distance/`

**Files :**
- Create : `publier.sh`
- Create (site) : `public/unit-distance/` (copie)
- Éventuellement modify (site) : `routes/web.php` ; create : `tests/Feature/UnitDistanceRedirectTest.php`

**Interfaces :**
- Consumes : le guide complet
- Produces : `./publier.sh [dossier-du-site]`

- [ ] **Step 1 : écrire `publier.sh`**

```sh
#!/bin/sh
# Copie le guide vers le site tyb-tech, servi sous /unit-distance/.
# Usage : ./publier.sh [dossier-du-site]   (par défaut : ~/Desktop/tyb-tech/sites/tyb_tech)
set -eu
ICI="$(cd "$(dirname "$0")" && pwd)"
SITE="${1:-$HOME/Desktop/tyb-tech/sites/tyb_tech}"
CIBLE="$SITE/public/unit-distance"
[ -d "$SITE/public" ] || { echo "Dossier public introuvable : $SITE/public" >&2; exit 1; }
mkdir -p "$CIBLE"
rsync -a --delete \
  --exclude 'CONCEPTION.md' --exclude 'PLAN.md' --exclude 'publier.sh' --exclude 'tests/' --exclude '.DS_Store' \
  "$ICI/" "$CIBLE/"
echo "Guide copié dans $CIBLE"
```

`--delete` n'agit que dans `public/unit-distance/`. Avant le premier lancement, vérifier que ce dossier n'existe pas ou ne contient que le guide.

Run : `chmod +x publier.sh && ls ~/Desktop/tyb-tech/sites/tyb_tech/public/unit-distance 2>/dev/null; ./publier.sh`
Expected : `Guide copié dans …/public/unit-distance`. Le dossier contient `index.html`, les 15 autres pages et `assets/`, mais ni `tests/` ni `PLAN.md`.

- [ ] **Step 2 : tester le service des fichiers avec l'image FrankenPHP du site**

Run :

```bash
docker run --rm -d --name guide-test -p 8089:8080 \
  -v ~/Desktop/tyb-tech/sites/tyb_tech/public:/app/public:ro \
  dunglas/frankenphp:1-php8.5-bookworm frankenphp php-server --listen :8080 --root /app/public
sleep 2
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8089/unit-distance/
curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:8089/unit-distance
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:8089/unit-distance/assets/guide.css
docker stop guide-test
```

Expected : `200` pour `/unit-distance/` et pour le CSS. Pour `/unit-distance` : `200`, ou une redirection vers `/unit-distance/`. Une autre réponse (404, ou 500 parce que `index.php` n'a pas de `vendor/` dans ce conteneur) veut dire que la requête tombe sur Laravel : passer à l'étape 3. Si Docker n'est pas disponible, le dire à l'utilisateur et passer à l'étape 3 par précaution.

- [ ] **Step 3 (si nécessaire) : redirection Laravel, avec son test**

Dans le site, lire `CLAUDE.md` et activer le skill `laravel-best-practices`. Utiliser `search-docs` (Laravel Boost) sur `routing redirect`. Écrire d'abord le test `tests/Feature/UnitDistanceRedirectTest.php` :

```php
<?php

declare(strict_types=1);

it('redirige /unit-distance vers le guide avec une barre finale', function (): void {
    $response = $this->get('/unit-distance');

    $response->assertRedirect();
    expect($response->headers->get('Location'))->toEndWith('/unit-distance/');
});
```

Run : `php artisan test --compact --filter=UnitDistanceRedirect`
Expected : FAIL (404).

Puis ajouter dans `routes/web.php` : `Route::redirect('/unit-distance', '/unit-distance/', 301);`

Run : `php artisan test --compact --filter=UnitDistanceRedirect`
Expected : PASS. Vérifier que l'en-tête `Location` garde bien la barre finale ; sinon, utiliser `Route::get('/unit-distance', fn () => redirect()->to(url('/unit-distance').'/', 301))` et relancer. Lancer ensuite `vendor/bin/pint --dirty` si le projet l'utilise.

- [ ] **Step 4 : point de contrôle**

Résumer à l'utilisateur ce qui a été copié et modifié dans le site. Rappeler que la mise en ligne passe par un commit et un push dans le repo du site, puis par son pipeline CI, et ne pas les faire sans sa demande explicite.
