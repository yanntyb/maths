// Vues canvas : arbre et cercle dessinés sans erreur, canvas contenu dans #vue, y compris
// après un passage du format bureau au format mobile.
import { join } from 'node:path';
import { CAPTURES, FORMATS, echec, ok, ouvrirPage } from './commun.mjs';

const tailles = (page) => page.evaluate(() => {
  const canvas = document.querySelector('#vue canvas');
  return { canvas: canvas ? canvas.clientWidth : -1, vue: document.getElementById('vue').clientWidth };
});

export async function verifierVues(navigateur, url) {
  console.log('vues canvas');
  for (const format of FORMATS) {
    const { page, problemes } = await ouvrirPage(navigateur, format, url);
    let ecarts = 0;
    const fail = (msg) => { ecarts++; echec(`${format.nom} : ${msg}`); };
    await page.waitForSelector('#vue canvas');
    for (const vue of ['tree', 'sphere']) {
      await page.click(`.tab[data-view="${vue}"]`);
      await new Promise((r) => setTimeout(r, 300));
      await page.screenshot({ path: join(CAPTURES, `${format.nom}-vue-${vue}.png`) });
    }
    let t = await tailles(page);
    if (t.canvas < 0) fail('canvas absent');
    else if (t.canvas > t.vue + 1) fail(`canvas de ${t.canvas} px dans une vue de ${t.vue} px`);
    if (!format.mobile) {
      await page.setViewport({ width: 390, height: 844 });
      await new Promise((r) => setTimeout(r, 300));
      t = await tailles(page);
      if (t.canvas > t.vue + 1) fail(`après passage en 390 px : canvas de ${t.canvas} px dans ${t.vue} px`);
    }
    for (const p of problemes) fail(p);
    if (!ecarts) ok(`${format.nom} : arbre, cercle, canvas contenu`);
    await page.close();
  }
}
