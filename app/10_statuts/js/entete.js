'use strict';

/**
 * entete.js — en-tête HTML : Sens et Contrat du théorème (lus dans le JSON) et
 * application numérique a, b → c du câblage courant.
 */

function ligne(conteneur, classe, etiquette, texte) {
  const div = document.createElement('div');
  div.className = classe;
  const span = document.createElement('span');
  span.className = 'etiquette';
  span.textContent = etiquette + ' · ';
  div.append(span, document.createTextNode(texte));
  conteneur.append(div);
  return div;
}

export function rendreEntete(conteneur, theoreme, nbCablages) {
  conteneur.innerHTML = '';
  ligne(conteneur, 'sens', 'SENS', `« ${theoreme.sens} »`);
  ligne(conteneur, 'contrat', 'CONTRAT', `${theoreme.contrat} (contrat annoncé pour les ${nbCablages} câblages)`);
  ligne(conteneur, 'application', 'APPLICATION', '').id = 'application';
}

let dernier = '';

/** Met à jour la ligne APPLICATION, seulement quand le texte change. */
export function majApplication(cablage, tri) {
  const el = document.getElementById('application');
  if (!el) return;
  const { a, b, c } = tri;
  const texte = `a=${a.toFixed(2)}, b=${b.toFixed(2)} ⟶ c=${c.toFixed(2)} · ${cablage.formula} · ${cablage.format(tri)}`;
  if (texte === dernier) return;
  dernier = texte;
  el.lastChild.textContent = texte;
}
