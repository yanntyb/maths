'use strict';

import { STATUTS, cleRetrait, statutDe } from './statut-style.js';

/**
 * matrice.js — matrice énoncé × axiome d'un câblage, en HTML.
 *
 * Colonnes : les énoncés (Sens, Contrat, marque « contrat commun » ou « contrat propre »,
 * conclusion Lean).
 * Lignes : les codes README et leurs axiomes Lean, puis les retraits groupés.
 * Sous le tableau : les codes README hors modèle (notes, texte non vérifié).
 */

const MOTIFS = {
  definition: 'définition', etape: 'étape de calcul', amont: 'en amont',
  derivable: 'lemme dérivable', cache: 'hypothèse cachée', horsPreuve: 'hors preuve',
};
const NATURES = { structurel: 'structurel', numerique: 'numérique' };

const normaliser = (s) => s.replace(/\s+/g, ' ').trim();

function el(balise, classe, texte) {
  const n = document.createElement(balise);
  if (classe) n.className = classe;
  if (texte !== undefined) n.textContent = texte;
  return n;
}

/** Axiomes du câblage (union des énoncés, ordre de première apparition), groupés par code. */
function groupesParCode(enonces) {
  const axiomes = [];
  for (const e of enonces) {
    for (const a of e.axiomes) if (!axiomes.some((x) => x.nom === a.nom)) axiomes.push(a);
  }
  const parCode = new Map();
  for (const a of axiomes) {
    if (!parCode.has(a.code)) parCode.set(a.code, { code: a.code, nature: a.nature, axiomes: [] });
    parCode.get(a.code).axiomes.push(a);
  }
  return [...parCode.values()];
}

/** Retraits groupés (plus d'un axiome) déclarés dans au moins un énoncé. */
function retraitsGroupes(enonces) {
  const vus = new Map();
  for (const e of enonces) {
    for (const s of e.statuts) if (s.retires.length > 1) vus.set(cleRetrait(s.retires), s.retires);
  }
  return [...vus.values()];
}

function caseStatut(enonce, retires, rappels) {
  const { cle, preuve } = statutDe(enonce, retires);
  const st = STATUTS[cle];
  if (!preuve) return el('span', `case ${st.classe}`, st.mot);
  const bouton = el('button', `case ${st.classe}`, st.mot);
  bouton.type = 'button';
  bouton.dataset.enonce = enonce.id;
  bouton.dataset.retires = cleRetrait(retires);
  bouton.dataset.theoreme = preuve.theoreme;
  bouton.title = preuve.theoreme;
  bouton.addEventListener('click', () => rappels.onOuvrirPreuve(preuve, enonce, bouton));
  return bouton;
}

function ligneGroupe(corps, texte, largeur) {
  const tr = corps.insertRow();
  tr.className = 'groupe';
  const th = el('th', null, texte);
  th.colSpan = largeur;
  tr.append(th);
}

/**
 * Remplit `conteneur` avec la matrice de `cablage` (rendu fusionné, avec .fiche).
 * `rappels.onChoisirEnonce(id)` : clic sur un en-tête de colonne.
 * `rappels.onOuvrirPreuve(preuve, enonce, bouton)` : clic sur une case essentielle ou superflue.
 */
export function rendreMatrice(conteneur, cablage, theoreme, enonceChoisi, rappels) {
  const enonces = cablage.fiche.enonces;
  conteneur.innerHTML = '';
  conteneur.append(el('h2', null, `${cablage.title} · espace ${cablage.fiche.espace}`));

  const table = el('table', 'matrice');
  const tete = table.createTHead().insertRow();
  tete.append(el('th', null, 'axiome'));
  for (const e of enonces) {
    const th = el('th', `colonne${e.id === enonceChoisi ? ' choisie' : ''}`);
    th.dataset.enonce = e.id;
    const bouton = el('button', null, e.id);
    bouton.type = 'button';
    bouton.setAttribute('aria-pressed', String(e.id === enonceChoisi));
    bouton.addEventListener('click', () => rappels.onChoisirEnonce(e.id));
    const commun = normaliser(e.contrat) === normaliser(theoreme.contrat);
    th.append(bouton, el('div', 'sens', e.sens), el('div', 'contrat', e.contrat),
      el('span', `marque ${commun ? 'commun' : 'propre'}`, commun ? 'contrat commun' : 'contrat propre'),
      el('code', 'conclusion', e.conclusion));
    tete.append(th);
  }

  const corps = table.createTBody();
  for (const g of groupesParCode(enonces)) {
    ligneGroupe(corps, `${g.code} · ${NATURES[g.nature] ?? g.nature}`, enonces.length + 1);
    for (const a of g.axiomes) {
      const tr = corps.insertRow();
      tr.className = 'axiome';
      tr.dataset.nom = a.nom;
      const td = el('td');
      td.append(el('span', 'nom', a.nom), document.createTextNode(' '), el('span', 'libelle', a.libelle),
        el('code', null, a.lean));
      tr.append(td);
      for (const e of enonces) {
        const cellule = el('td');
        const present = e.axiomes.some((x) => x.nom === a.nom);
        cellule.append(present ? caseStatut(e, [a.nom], rappels)
          : el('span', `case ${STATUTS.absent.classe}`, STATUTS.absent.mot));
        tr.append(cellule);
      }
    }
  }
  const groupes = retraitsGroupes(enonces);
  if (groupes.length) {
    ligneGroupe(corps, 'retraits groupés', enonces.length + 1);
    for (const r of groupes) {
      const tr = corps.insertRow();
      tr.className = 'axiome groupe-retrait';
      tr.append(el('td', 'nom', r.join(' + ')));
      for (const e of enonces) {
        const cellule = el('td');
        cellule.append(caseStatut(e, r, rappels));
        tr.append(cellule);
      }
    }
  }
  conteneur.append(table);

  const notes = cablage.fiche.notes;
  if (notes.length) {
    const section = el('section', 'notes');
    const titre = el('h3', null, 'Codes README hors modèle ');
    titre.append(el('small', null, 'texte non vérifié par Lean'));
    const liste = el('ul');
    for (const n of notes) {
      const li = el('li');
      li.append(el('b', null, n.code), document.createTextNode(` ${NATURES[n.nature] ?? n.nature} · `),
        el('em', null, MOTIFS[n.motif] ?? n.motif), document.createTextNode(` — ${n.texte}`));
      if (n.theoreme) li.append(document.createTextNode(' — démontré par '), el('code', null, n.theoreme));
      liste.append(li);
    }
    section.append(titre, liste);
    conteneur.append(section);
  }
}
