// Matrice et panneau dans Chrome sans fenêtre, aux trois formats : cases par statut (retraits
// groupés compris), conclusions, panneau (clic, clavier, Échap, focus, débordement interne),
// changement d'onglet (vrai clic au format bureau), choix d'énoncé conservé, pas de
// défilement horizontal.
import { join } from 'node:path';
import { CAPTURES, FORMATS, echec, ok, ouvrirPage, cleRetrait } from './commun.mjs';

const panneauCache = (page) => page.$eval('#panneau', (p) => p.hidden);
const cliquerOnglet = (page, i) => page.evaluate((i) => {
  document.querySelector(`.tabs-cablages .tab[data-index="${i}"]`).click();
}, i);
const debordement = (page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
const panneauDeborde = (page) => page.$eval('#panneau', (p) => p.scrollWidth > p.clientWidth);

/** Cases attendues par statut : statuts du JSON, axiomes non testés, et retraits groupés
 * déclarés ailleurs dont tous les axiomes figurent dans l'énoncé sans statut. */
function casesAttendues(c) {
  const attendus = { essentiel: 0, superflu: 0, 'non-teste': 0 };
  const groupes = new Map();
  for (const e of c.enonces) {
    for (const s of e.statuts) {
      attendus[s.statut]++;
      if (s.retires.length > 1) groupes.set(cleRetrait(s.retires), s.retires);
    }
    attendus['non-teste'] += e.nonTestes.length;
  }
  for (const r of groupes.values()) {
    for (const e of c.enonces) {
      const etabli = e.statuts.some((s) => cleRetrait(s.retires) === cleRetrait(r));
      if (!etabli && r.every((n) => e.axiomes.some((a) => a.nom === n))) attendus['non-teste']++;
    }
  }
  return attendus;
}

export async function verifierNavigateur(navigateur, url, statuts) {
  console.log('matrice et panneau');
  const iScalaire = statuts.cablages.findIndex((c) => c.id === 'scalaire');
  for (const format of FORMATS) {
    const avant = [];
    const { page, problemes } = await ouvrirPage(navigateur, format, url);
    const fail = (msg) => { avant.push(msg); echec(`${format.nom} : ${msg}`); };
    await page.waitForSelector('table.matrice');

    const nbOnglets = await page.$$eval('.tabs-cablages .tab', (l) => l.length);
    if (nbOnglets !== statuts.cablages.length) fail(`${nbOnglets} onglets, ${statuts.cablages.length} attendus`);

    for (const [i, c] of statuts.cablages.entries()) {
      await cliquerOnglet(page, i);
      for (const [st, n] of Object.entries(casesAttendues(c))) {
        const vu = await page.$$eval(`#matrice .case.st-${st}`, (l) => l.length);
        if (vu !== n) fail(`${c.id} : ${vu} cases ${st}, ${n} attendues`);
      }
      const conclusions = await page.$$eval('#matrice th.colonne .conclusion', (l) => l.map((x) => x.textContent));
      if (JSON.stringify(conclusions) !== JSON.stringify(c.enonces.map((e) => e.conclusion))) {
        fail(`${c.id} : conclusions affichées ${JSON.stringify(conclusions)}`);
      }
      await page.screenshot({ path: join(CAPTURES, `${format.nom}-${c.id}.png`), fullPage: true });
    }

    // Retrait groupé testable mais sans statut : « non testé », pas « — ».
    await cliquerOnglet(page, iScalaire);
    const groupe = await page.$$eval('#matrice tr.groupe-retrait td', (l) => l.map((x) => x.textContent.trim()));
    if (JSON.stringify(groupe) !== JSON.stringify(['addL + addR + homog', 'essentiel', 'non testé'])) {
      fail(`ligne addL + addR + homog : ${JSON.stringify(groupe)}`);
    }

    // Panneau : clic, contenu, pas de débordement, Échap, focus rendu à la case.
    await cliquerOnglet(page, iScalaire);
    const theoreme = await page.$eval('#matrice button.case.st-essentiel', (b) => b.dataset.theoreme);
    await page.click('#matrice button.case.st-essentiel');
    const contenu = await page.$eval('#panneau', (p) => (p.hidden ? '' : p.textContent));
    if (!contenu.includes(theoreme)) fail(`panneau absent ou sans ${theoreme}`);
    if (!(await page.$eval('#panneau pre.source', (p) => p.textContent.length))) fail('source vide dans le panneau');
    if (await debordement(page)) fail('défilement horizontal avec le panneau ouvert');
    if (await panneauDeborde(page)) fail('le panneau déborde horizontalement : la source doit défiler dans son cadre');
    await page.keyboard.press('Escape');
    if (!(await panneauCache(page))) fail('Échap ne ferme pas le panneau');
    if (!(await page.evaluate(() => document.activeElement?.classList.contains('case')))) fail('le focus ne revient pas à la case');

    // Clavier : Entrée ouvre ; changer d'onglet ferme.
    await page.focus('#matrice button.case.st-essentiel');
    await page.keyboard.press('Enter');
    if (await panneauCache(page)) fail("Entrée n'ouvre pas le panneau");
    // Au format bureau, un vrai clic sur un onglet reste possible panneau ouvert ; sur mobile le
    // panneau est plein écran (on le ferme d'abord), on vérifie seulement le rappel onSelect.
    // L'onglet groupes est sous le panneau si celui-ci couvre la barre d'outils.
    const iGroupes = statuts.cablages.findIndex((c) => c.id === 'groupes');
    if (format.mobile) await cliquerOnglet(page, iGroupes);
    else await page.click(`.tabs-cablages .tab[data-index="${iGroupes}"]`);
    if (!(await panneauCache(page))) fail("changer d'onglet ne ferme pas le panneau");
    const g = statuts.cablages[iGroupes];
    if ((await page.$eval('#matrice h2', (h) => h.textContent)) !== `${g.titre} · espace ${g.espace}`) {
      fail("le clic sur l'onglet n'a pas changé de câblage");
    }

    // Le choix d'énoncé est conservé par câblage.
    await cliquerOnglet(page, iScalaire);
    await page.click('#matrice th[data-enonce="norme"] button');
    await cliquerOnglet(page, 0);
    await cliquerOnglet(page, iScalaire);
    if (!(await page.$eval('#matrice th[data-enonce="norme"]', (t) => t.classList.contains('choisie')))) {
      fail("le choix de l'énoncé norme est perdu au changement d'onglet");
    }

    if (await debordement(page)) fail('défilement horizontal');
    for (const p of problemes) fail(p);
    if (!avant.length) ok(`${format.nom} : cases, panneau, clavier, onglets`);
    await page.close();
  }
}
