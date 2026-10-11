# Visualiseur V10 — statuts de dérivabilité issus de Lean

> Spec de conception, 2026-10-11. Premier sous-projet du visualiseur décrit au §3.3 de la note *Deux directions de simplicité* (`docs/notes/deux_directions_simplicite-revise-v2.docx`).

## 1. Intention

### Ce qui a été demandé

Brancher le visualiseur sur les résultats Lean de `lean/` (« option B »), après le constat que V9 tourne sans erreur mais n'affiche ni statut de dérivabilité, ni lien vers une preuve, et que ses listes d'axiomes divergent des docs et de Lean.

Décisions prises pendant la conception :

| Question | Choix |
|---|---|
| Périmètre | statuts seuls : matrice énoncé × axiome, statut, lien vers le théorème Lean, axiomes alignés |
| Garantie des statuts | forme canonique vérifiée par le noyau Lean |
| Lignes de la matrice | axiomes Lean regroupés sous leur code README ; codes README non formalisés affichés à part avec un motif |
| Intégration | nouvelle version `app/10_statuts/`, dérivée de V9 |
| Lien vers la preuve | panneau intégré : le JSON embarque la source du théorème |
| Tuyauterie | exécutable `lake exe statuts`, JSON déterministe commité |
| Vocabulaire | triple distinction des docs : Sens, Contrat ; nature structurelle ou numérique des axiomes |
| Blocs de sens (Aligner, Normer…) | hors périmètre, sous-projet suivant |

### Hypothèses

- Lean est la seule source des statuts. Aucun statut n'est écrit à la main côté appli.
- L'ancien modèle de poids (taille des cercles ∝ contribution) disparaît de V10.
- Les docs `docs/theoreme/pythagore/cablages/*.md` ne sont pas modifiées ; elles servent de référence pour la couverture des codes README.

### Critère de réussite

Pour chaque câblage, la matrice affichée reproduit exactement le tableau de `lean/README.md` (mis à jour par ce sous-projet), sans aucune saisie à la main entre Lean et l'appli.

## 2. Hors périmètre

- Blocs de sens, graphe de dépendances (`#graphe`), L(axiome), étymologie, densité, reformulations (autres items du §3.3).
- Interaction « retirer un axiome » en direct.
- Recherche automatique de contre-modèles.
- Mise à jour des docs `cablages/*.md` et `pythagore/README.md`.
- Nouveaux statuts au-delà de ceux revendiqués par `lean/README.md`, sauf ceux qu'exige la forme canonique (voir §3.4).
- Lignes V8 et V9 manquantes dans `app/README.md`.

## 3. Forme canonique en Lean

### 3.1 Vocabulaire commun

Nouveau fichier `lean/Derivabilite/Cadre.lean` :

```lean
inductive Nature | structurel | numerique

inductive Motif | definition | etape | amont | derivable | cache | horsPreuve

structure Theoreme where       -- Pythagore
  sens : String                -- ce qu'il EST
  contrat : String             -- contrat commun : "(a, b) ∈ ℝ₊² → c ∈ ℝ₊"

structure Note where           -- code README qui n'est pas un axiome du modèle
  code : String
  nature : Nature
  motif : Motif
  texte : String
  theoreme : Option String := none  -- pour `derivable` : nom complet du lemme

structure Cablage where
  id titre espace : String     -- espace : E, C, R, ℝ² + SO(2)
  notes : List Note

structure Axiome (M : Type 1) where
  nom : String                 -- identifiant Lean : "addL"
  code : String                -- code README : "S1"
  nature : Nature
  libelle : String
  prop : M → Prop

structure Enonce where         -- une colonne : un câblage vu sous un contrat
  cablage id : String
  sens : String
  contrat : String
  Modele : Type 1
  axiomes : List (Axiome Modele)
  conclusion : Modele → Prop

/-- Récursive : `simp` ne déplie pas un `∀ a ∈ [littéral]` dont le type dépend de `Modele`. -/
def tient {M : Type 1} (retires : List String) (m : M) : List (Axiome M) → Prop
  | [] => True
  | a :: as => (a.nom ∈ retires ∨ a.prop m) ∧ tient retires m as

def Enonce.sans (E : Enonce) (retires : List String) (m : E.Modele) : Prop :=
  tient retires m E.axiomes

def Superflu  (E : Enonce) (r : List String) : Prop := ∀ m, E.sans r m → E.conclusion m
def Essentiel (E : Enonce) (r : List String) : Prop := ∃ m, E.sans r m ∧ ¬ E.conclusion m

theorem pas_les_deux {E r} : Superflu E r → Essentiel E r → False
```

Libellés des motifs : `definition` « définition », `etape` « étape de calcul », `amont` « en amont », `derivable` « lemme dérivable », `cache` « hypothèse cachée », `horsPreuve` « hors preuve ».

### 3.2 Règles

- Un **statut** est un théorème dont le type est `Superflu E r` ou `Essentiel E r`, avec `E` une constante de type `Enonce` et `r` une liste littérale de chaînes. Le noyau vérifie qu'il établit bien ce statut.
- `r` peut contenir plusieurs noms : c'est un **retrait groupé**.
- **Non testé** : couple (énoncé, axiome) sans théorème de statut à un seul axiome retiré. Calculé, jamais écrit.
- **Témoin de cohérence** : `Coherent E := ∃ m, E.sans [] m`. L'exporteur exige un théorème `Coherent E` par énoncé : des axiomes contradictoires rendraient tout retrait vacuement superflu.
- **Axiomes admis** : l'exporteur rejette tout statut ou témoin dont la preuve repose sur un axiome autre que `propext`, `Classical.choice`, `Quot.sound` (donc `sorry`), tout retrait vide ou répété, et tout retrait établi deux fois.
- À relire à la main : pour chaque énoncé, le type `Modele`, la liste `axiomes` et la conclusion (exportée et affichée) ; le texte des notes, que la vue signale comme texte non vérifié.
- La tactique `deplier [E, axiomes] at h ⊢` déplie `Enonce.sans` et la conclusion : une hypothèse par axiome conservé.

### 3.3 Fichiers

- `Cadre.lean` (nouveau) : §3.1.
- `Pythagore.lean` (nouveau) : la constante `theoreme : Theoreme`.
- `Scalaire.lean`, `Complexe.lean`, `Trigonometrique.lean`, `Cosinus.lean`, `Groupes.lean` : réécrits. Chacun déclare son `Cablage`, ses `Enonce` et ses statuts. Preuves et contre-modèles actuels conservés.
- `Cablages.lean`, `Deps.lean` : inchangés.

### 3.4 Contenu par câblage

| Câblage | Énoncé (contrat) | Axiomes Lean (code, nature) | Statuts | Notes |
|---|---|---|---|---|
| scalaire | `carre` (`E × E → R`), `norme` (`(a, b) ∈ ℝ₊² → c ∈ ℝ₊`) | addL, addR, homog (S1, s) ; symm (S2, s) ; pos (S3, s) ; orth (N2, n) | carre : addL, addR, homog, pos superflus ; symm essentiel ; [addL, addR, homog] essentiel. norme : pos, symm essentiels ; addL, addR, homog superflus (preuves à écrire, voir §8) | N1 définition (norme) ; N3 étape |
| complexe | `module` (`K × K → K`) | inverses (C1, s) ; conj (C2, s) ; isq (C3, s) | inverses superflu ; conj, isq essentiels | C1 cache (commutativité, fixée par `CommRing`, non testée) ; N1 définition ; N2, N3 étapes ; N4 hors preuve |
| trigonométrique | `identite` (`R → R`) | derivC (A4, s) ; derivS (A5, s) ; C0, S0 (N3, n) | les quatre essentiels | A1, A2, A3 en amont ; N1 étape ; N2 cache (complétude de ℝ) ; N4 hors preuve |
| cosinus | `orthogonal` (`E × E → R`) | angle (S1, s) ; addL, addR (S2, s) ; symm (S3, s) ; droit (N3, n) | addL, addR superflus ; angle, symm, droit essentiels | N1 dérivable (`Cosinus.loi_cos`) ; N2 hors preuve (θ n'intervient pas) ; N4 étape |
| groupes | `homogene` (`R² → R`), `polynomial` (`R² → R`) | inv (G2, s) ; c4 (G2, s, quart de tour) ; homog (A1, s, `homogene` seulement) ; norm (N3, n) | homogene : inv essentiel (Qc4), c4 superflu, homog essentiel, norm essentiel. polynomial : inv superflu, c4 superflu, [inv, c4] essentiel, norm essentiel | G1, G3 hors preuve ; N1, N2 hors preuve ; N4 étape |

`s` = structurel, `n` = numérique. Le modèle de `polynomial` est le triplet (α, β, γ) de Q = αx² + βxy + γy² : la forme polynomiale (A1 renforcé) est fixée par le modèle, ce que dit le Sens de l'énoncé.

Conséquences sur `lean/README.md` : G1 et G3 passent de « superflue » à la note « hors preuve » (non vérifiée) ; les cases sans théorème deviennent « non testé ». Le tableau est mis à jour dans ce sous-projet et sert d'oracle (§6).

Ce qui se perd : le constat « un groupe abélien suffit pour `carre` » (issu du linter, pas d'un statut). Il reste en prose dans `lean/README.md`.

## 4. Export `lake exe statuts`

### 4.1 Mécanisme

- `lakefile.toml` : `[[lean_exe]] name = "statuts"`, `root = "Statuts"`, `supportInterpreter = true`.
- `lean/Derivabilite/Export.lean` (importe seulement `Lean`) : `exporterChamps (racine : System.FilePath) (prefixe : Name := .anonymous) : MetaM (List (String × Json))`, testable sans fichier ; toute incohérence lève une erreur « statuts : … ». L'exécutable charge les `.olean` de `Derivabilite` à l'exécution : mathlib n'est jamais compilé en code natif.
- `lean/Statuts.lean` : importe `Derivabilite`, appelle `exporter`, écrit le chemin passé en argument, sort en code 1 avec le message en cas d'erreur.
- Commande : `lake exe statuts ../app/10_statuts/data/statuts.json`.

### 4.2 Étapes

1. Trouver par leur type la constante `Theoreme`, les constantes `Cablage` et `Enonce`.
2. Lire leurs champs par réduction (`whnf`) : littéraux de chaîne, listes de `Axiome.mk` et de `Note.mk`. Chaque `prop` est rendue par `ppExpr`.
3. Trouver les statuts : théorèmes dont le type a la forme `Superflu E r` ou `Essentiel E r`.
4. Pour chaque statut : nom Lean, fichier et lignes (`findDeclarationRanges?`), texte source, et source des définitions et lemmes locaux utilisés directement (modules `Derivabilite/*`, hors vocabulaire `Derivabilite.*`, hors énoncés, fiches et autres statuts), pour que le contre-modèle et les lemmes communs se lisent dans le panneau.
5. Calculer les cases non testées.

### 4.3 Erreurs (code 1, message clair)

- Nom de `r` absent des axiomes de `E`.
- Énoncé dont le câblage n'existe pas.
- Axiome de même `nom` avec code, nature ou libellé différents entre deux énoncés d'un câblage.
- Code README utilisé avec deux natures différentes.
- Note `derivable` dont le théorème n'existe pas.
- Zéro ou plusieurs constantes `Theoreme`.

`pas_les_deux` rend impossible un couple à la fois superflu et essentiel.

### 4.4 JSON

Déterministe : ordre fixe (câblages et énoncés triés par id, axiomes et notes dans l'ordre de déclaration, statuts triés par axiomes retirés), aucun horodatage. Contient la version de Lean et la révision mathlib (`inputRev` de `lake-manifest.json`).

```json
{ "lean": "v4.35.0-rc4", "mathlib": "v4.35.0-rc4",
  "theoreme": { "sens": "…", "contrat": "(a, b) ∈ ℝ₊² → c ∈ ℝ₊" },
  "cablages": [{
    "id": "scalaire", "titre": "…", "espace": "E",
    "notes": [{ "code": "N3", "nature": "numerique", "motif": "etape", "texte": "…", "theoreme": null }],
    "enonces": [{
      "id": "norme", "sens": "…", "contrat": "(a, b) ∈ ℝ₊² → c ∈ ℝ₊",
      "axiomes": [{ "nom": "pos", "code": "S3", "nature": "structurel",
                    "libelle": "positivité", "lean": "∀ x, 0 ≤ m.B x x" }],
      "statuts": [{ "retires": ["pos"], "statut": "essentiel",
                    "theoreme": "Scalaire.norme_sans_pos",
                    "fichier": "Derivabilite/Scalaire.lean", "lignes": [105, 119],
                    "source": "…",
                    "definitions": [{ "nom": "Scalaire.Bmink", "source": "…" }] }],
      "nonTestes": ["orth"],
      "conclusion": "√(m.B (m.u + m.v) (m.u + m.v)) ^ 2 = …",
      "temoin": "Scalaire.norme_coherent" }] }] }
```

Le JSON est commité dans `app/10_statuts/data/statuts.json` : l'appli tourne sans Lean. On relance l'export après chaque changement Lean. `lean/README.md` gagne une section « Exporter ».

## 5. Appli V10 (`app/10_statuts/`)

### 5.1 Gardé de V9

Barre du haut (curseurs a et b, onglets câblages, arbre / cercle, animer, reset), `TabManager`, `cablages/*/rendu.js` réduits à id, couleur, formule et `format` (application numérique).

### 5.2 Retiré

`cablages/*/axiomes.js` (poids), `classifier.js`, panneau gauche dessiné en canvas, légende des tailles, bannière canvas.

### 5.3 Nouveau ou modifié

- `data/statuts.json` : sortie de l'export.
- `js/statuts-store.js` : `chargerStatuts()` fait le `fetch`, vérifie les clés attendues, renvoie `{ theoreme, cablages, cablage(id) }`.
- `js/cablage-registry.js` : fusionne `rendu.js` et JSON par id ; un id présent d'un seul côté affiche un bandeau d'erreur.
- **En-tête HTML** : Sens et Contrat lus dans `theoreme`, application numérique a, b → c du câblage courant.
- `js/matrice.js`, tableau HTML :
  - colonnes : énoncés du câblage ; en-tête avec id, Sens, Contrat et la marque « contrat commun » ou « contrat propre » (égalité avec le contrat de `theoreme`, espaces normalisés) ; un clic sur l'en-tête choisit l'énoncé affiché dans le canvas ;
  - lignes : codes README avec leur nature, puis leurs axiomes Lean (nom, libellé, forme Lean en petit) ; puis une ligne par retrait groupé ;
  - cases : essentiel, superflu, non testé, ou « — » si l'axiome n'est pas dans cet énoncé ; toujours un mot, pas seulement une couleur ; clic sur une case essentielle ou superflue : panneau ;
  - sous le tableau : notes hors modèle (code, motif, texte, lien vers le théorème pour `derivable`), marquées « texte non vérifié ».
- `js/panneau.js` : statut, axiomes retirés, nom Lean, fichier et lignes, source en `<pre>`, définitions locales. Fermeture par × ou Échap. Plein écran sur mobile.
- `js/scene.js` : ne dessine que la vue choisie dans le canvas. Signature `viz.draw(ctx, rect, cablage, enonce)`.
- `visualizations/tree.js` : nœuds = axiomes de l'énoncé choisi, reliés au nœud de conclusion ; essentiel plein et trait épais, superflu contour pointillé pâle, non testé gris. Plus de nœuds a et b.
- `visualizations/sphere.js` : un arc de même longueur par axiome, coloré selon le statut.

### 5.4 Mise en page

- Largeur ≥ 900 px : deux colonnes, matrice environ 55 %, canvas environ 45 %.
- Largeur < 900 px : une colonne, matrice puis canvas de 360 px de haut.
- La page défile verticalement ; `touch-action: none` ne s'applique qu'au canvas.

### 5.5 Erreurs

- JSON absent ou page en `file://` : bandeau avec la commande (`python3 -m http.server` dans `app/`, ou `lake exe statuts …`).
- Statut inconnu : case « ? » et erreur console.

### 5.6 Docs

- `app/proposals/v10-statuts.md` : diagnostic V9, vision V10.
- `app/10_statuts/README.md` : Sens / Contrat / Ports, circuit en mermaid, sur le modèle de V9.
- `app/README.md` : ligne V10.

## 6. Tests

### 6.1 Lean

- `lake build` : le noyau vérifie chaque statut.
- `lean/Tests/Cadre.lean` : `deplier` et `pas_les_deux` sur un énoncé jouet.
- `lean/Tests/Export.lean`, `lean_lib Tests` hors cibles par défaut, lancé par `lake build Tests` : énoncés volontairement cassés (nom retiré inconnu, câblage absent, deux `Theoreme`, nature incohérente, axiome incohérent entre énoncés, note `derivable` sans théorème) ; `#guard_msgs` fige chaque message d'erreur ; un cas valide minimal fige la forme exacte du JSON.

### 6.2 Appli

`app/10_statuts/tests/`, sur le modèle du guide distance-unité (`puppeteer-core` 23.11.1, `node verifier.mjs`), un module par vérification (`oracle.mjs`, `couverture.mjs`, `erreurs.mjs`, `navigateur.mjs`, `vues.mjs`, `lean.mjs`) :

1. **Oracle** : `attendu.json`, écrit à la main d'après le tableau de `lean/README.md`, liste chaque (câblage, énoncé, retirés, statut), cases non testées comprises. Égalité exacte exigée avec `data/statuts.json`.
2. **Couverture des docs** : lecture des tableaux « Axiomes mobilises » de `docs/theoreme/pythagore/cablages/*.md`. Chaque code README apparaît dans le JSON (axiome ou note) et inversement ; la nature correspond à la colonne Type.
3. **Navigateur** : serveur HTTP lancé par le script ; formats 1400×850, 390×844, 844×390. Aucune erreur JS, console ou requête échouée. Par onglet, le nombre de cases de chaque statut égale celui du JSON. Clic sur une case essentielle : panneau visible avec nom Lean et source ; Échap le ferme. Pas de défilement horizontal à 390 px. Captures dans `tests/captures/`.
4. **Chemin d'erreur** : requête du JSON interceptée en 404 ; le bandeau apparaît.
5. **Option `--lean`** : relance `lake exe statuts` vers un fichier temporaire et compare octet par octet avec `data/statuts.json` (fraîcheur et déterminisme).

`tests/node_modules` et `tests/captures` sont ignorés par git.

## 7. Critères d'acceptation

1. `lake build` et `lake build Tests` passent.
2. `lake exe statuts` produit deux fois le même JSON, identique au fichier commité.
3. `node verifier.mjs` passe (oracle, couverture, navigateur, erreur) ; `node verifier.mjs --lean` passe.
4. Chaque statut du tableau de `lean/README.md` correspond à un théorème `Superflu` ou `Essentiel` ; aucun statut n'est écrit à la main dans l'appli.

## 8. Risques

- **Ergonomie de `sans`** : décider `"addR" ∉ ["addL"]` et déplier la liste dans les preuves. Première tâche du plan : mini-spike de la tactique `deplier` sur scalaire.
- **Lecture structurelle des valeurs** : les définitions d'énoncés doivent rester réductibles par `whnf` ; pas de `irreducible_def`.
- **Colonne `norme` du README** : elle revendique addL, addR, homog superflus sans théorème aujourd'hui. Le portage écrit ces preuves (`grind [Real.sq_sqrt]` attendu) ; en cas d'échec, la case passe à non testé et le README est corrigé.
- **Contre-modèles à revérifier** : un contre-modèle doit satisfaire tous les axiomes non retirés de la nouvelle liste (par exemple c4 pour groupes `homogene`). Ceux du code actuel sont compatibles d'après l'analyse, à confirmer à la compilation.
- **Exécutable** : charger mathlib à l'exécution prend quelques secondes et plusieurs Go de mémoire.
