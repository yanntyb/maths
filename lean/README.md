# Derivabilite — spikes Lean

> [Retour au projet](../README.md) | [Pythagore](../docs/theoreme/pythagore/README.md) | [Note « Deux directions »](../docs/notes/) | [Visualiseur V10](../app/10_statuts/)

Le test de dérivabilité de la note *Deux directions de simplicité*, en Lean 4 : un axiome est **superflu** si l'on trouve une preuve qui s'en passe, **essentiel** si l'on exhibe un contre-modèle, **non testé** sinon.

## Forme canonique

`Derivabilite/Cadre.lean` fixe le vocabulaire. Un **énoncé** (`Enonce`) est un câblage vu sous un contrat : un type de modèles, une liste d'axiomes, une conclusion. Un **statut** est un théorème de type `Superflu E r` ou `Essentiel E r` : le noyau vérifie qu'il établit bien ce statut. Un couple (énoncé, axiome) sans théorème est non testé. La tactique `deplier [E, axiomes] at h ⊢` déplie les hypothèses, une par axiome conservé.

Le noyau et l'exporteur garantissent le reste :
- chaque statut est démontré avec les seuls axiomes de fondation de mathlib (`propext`, `Classical.choice`, `Quot.sound`) : l'exporteur rejette `sorry` et tout autre axiome ;
- chaque énoncé a un témoin de cohérence (`Coherent E` : un modèle satisfait tous ses axiomes), donc aucun « superflu » n'est vacuement vrai ;
- un même retrait n'est établi qu'une fois, et jamais à la fois superflu et essentiel (`pas_les_deux`).

À relire à la main : pour chaque énoncé, le type `Modele`, la liste `axiomes` et la conclusion (affichée dans V10) ; le texte des notes (codes README qui ne sont pas des axiomes du modèle).

## Contenu

| Fichier | Rôle |
|---------|------|
| `groupe-jouet/` | Premier spike, Lean seul (sans mathlib) : axiomes de groupe, harnais Python qui produit les trois statuts. `python3 harness.py out` |
| `Derivabilite/Cadre.lean` | Forme canonique : `Theoreme`, `Cablage`, `Axiome`, `Enonce`, `Superflu`, `Essentiel`, `Coherent`, tactique `deplier` |
| `Derivabilite/Pythagore.lean` | Sens et contrat communs aux cinq câblages |
| `Derivabilite/Scalaire.lean`, `Complexe.lean`, `Trigonometrique.lean`, `Cosinus.lean`, `Groupes.lean` | Les cinq câblages en forme canonique : fiche, énoncés, statuts |
| `Derivabilite/Export.lean` | Exporteur : lit l'environnement, vérifie la cohérence, produit le JSON |
| `Statuts.lean` | Exécutable `lake exe statuts <sortie.json>` |
| `Tests/Export.lean` | Tests de l'exporteur (`lake build Tests`) |
| `Derivabilite/Cablages.lean` | Les cinq câblages de Pythagore prouvés avec mathlib |
| `Derivabilite/Deps.lean` | Commande `#graphe` : axiomes, fermeture des constantes, recouvrements, repères |

## Lancer

```bash
export PATH=$HOME/.elan/bin:$PATH
lake build          # vérifie chaque statut ; affiche aussi le graphe de dépendances (#graphe)
lake build Tests    # tests de l'exporteur
```

Le cache mathlib occupe environ 7,5 Go dans `.lake/` (ignoré par git).

## Exporter

```bash
lake build && lake exe statuts ../app/10_statuts/data/statuts.json
```

L'exécutable charge les `.olean` de `Derivabilite` à l'exécution (d'où le `lake build` avant), trouve les statuts et les témoins par leur type, vérifie la cohérence (axiome non admis, nom d'axiome inconnu, retrait vide, répété ou établi deux fois, énoncé sans témoin, câblage absent, nature contradictoire…) et écrit un JSON déterministe. Il sort en code 1, avec un message qui commence par « statuts : », à la première incohérence. Relancer l'export après chaque changement Lean ; `node app/10_statuts/tests/verifier.mjs --lean` vérifie que le JSON commité est à jour.

## Matrice des cinq câblages

Statuts établis par les théorèmes `Superflu` et `Essentiel`. Les contre-modèles sont tous concrets, trouvés à la main.

| Câblage | Énoncé (contrat) | Axiome retiré (code) | Statut | Théorème, contre-modèle |
|---|---|---|---|---|
| scalaire | `carre` (`E × E → R`) | addL (S1) | superflu | `carre_sans_addL` |
| | | addR (S1) | superflu | `carre_sans_addR` |
| | | homog (S1) | superflu | `carre_sans_homog` |
| | | symm (S2) | essentiel | `carre_sans_symm` : matrice [[1,0],[1,1]] |
| | | pos (S3) | superflu | `carre_sans_pos` |
| | | orth (N2) | non testé | — |
| | | addL + addR + homog | essentiel | `carre_sans_addL_addR_homog` : (u·v)² |
| | `norme` (`(a, b) ∈ ℝ₊² → c ∈ ℝ₊`) | addL, addR, homog (S1) | superflus | `norme_sans_addL`, `norme_sans_addR`, `norme_sans_homog` |
| | | symm (S2) | essentiel | `norme_sans_symm` : matrice [[1,0],[1,1]] |
| | | pos (S3) | essentiel | `norme_sans_pos` : forme de Minkowski |
| | | orth (N2) | non testé | — |
| complexe | `module` (`K × K → K`) | inverses (C1) | superflu | `sans_inverses` : un anneau commutatif suffit |
| | | conj (C2) | essentiel | `sans_conj` : ℂ, conjugaison identité |
| | | isq (C3) | essentiel | `sans_isq` : ℝ, i = 0 |
| trigonométrique | `identite` (`R → R`) | derivC (A4) | essentiel | `sans_derivC` : C = 1, S = id |
| | | derivS (A5) | essentiel | `sans_derivS` : C = 1 − t²/2, S = id |
| | | C0 (N3) | essentiel | `sans_C0` : C = S = 0 |
| | | S0 (N3) | essentiel | `sans_S0` : C = cos − sin, S = sin + cos |
| cosinus | `orthogonal` (`E × E → R`) | angle (S1) | essentiel | `sans_angle` : produit usuel, c sans lien avec B |
| | | addL, addR (S2) | superflus | `sans_addL`, `sans_addR` |
| | | symm (S3) | essentiel | `sans_symm` : matrice [[1,0],[1,1]] |
| | | droit (N3) | essentiel | `sans_droit` : produit usuel, c = 1 |
| groupes | `homogene` (`R² → R`) | inv (G2) | essentiel | `homogene_sans_inv` : Q = (x⁴+y⁴)/(x²+y²), invariant par le quart de tour |
| | | c4 (G2) | superflu | `homogene_sans_c4` |
| | | homog (A1) | essentiel | `homogene_sans_homog` : Q = (x²+y²)² |
| | | norm (N3) | essentiel | `homogene_sans_norm` : Q = 2(x²+y²) |
| | `polynomial` (`R² → R`) | inv (G2) | superflu | `polynomial_sans_inv` : le quart de tour suffit |
| | | c4 (G2) | superflu | `polynomial_sans_c4` |
| | | inv + c4 | essentiel | `polynomial_sans_inv_c4` : Q = x² |
| | | norm (N3) | essentiel | `polynomial_sans_norm` : Q = 2(x²+y²) |

Codes README hors modèle (notes, texte non vérifié) : scalaire N1 (définition), N3 (étape) ; complexe C1 commutativité (hypothèse cachée), N1 (définition), N2, N3 (étapes), N4 (hors preuve) ; trigonométrique A1, A2, A3 (en amont), N1 (étape), N2 (hypothèse cachée : complétude de ℝ), N4 (hors preuve) ; cosinus N1 (lemme dérivable `Cosinus.loi_cos`), N2 (hors preuve), N4 (étape) ; groupes G1, G3, N1, N2 (hors preuve), N4 (étape).

Constats transversaux :

- **Chaque liste du README contient des axiomes superflus.** Les câblages demandent moins que ce qu'ils annoncent.
- **Le statut dépend du contrat.** La positivité S3 est superflue pour `carre` (`E × E → R`), essentielle pour `norme` (contrat commun). Seul `scalaire.norme` formalise le contrat commun annoncé par le README.
- **Cosinus se ramène au scalaire** (`Cosinus.via_scalaire`). L'angle, θ et π n'interviennent pas : S1 et N3 servent seulement à obtenir B(x,y) = 0. Le lemme commun `Scalaire.lemme_carre` montre aussi qu'un groupe abélien suffit, sans structure de module.
- **Hypothèses cachées.** Trigonométrique : N2 repose sur la complétude de ℝ. Complexe : la commutativité est fixée par le modèle, non testée. Groupes : SO(2) est défini par c² + s² = 1, c'est-à-dire par le cercle euclidien ; le câblage risque de présupposer ce qu'il démontre.
- **Le statut dépend de l'interprétation des axiomes.** Groupes : le quart de tour suffit si A1 est une forme polynomiale, pas si A1 est la seule homogénéité.
- **G1 et G3 ne sont plus des statuts.** Formaliser G3 comme une invariance infinitésimale entraînerait G2 : ils restent des notes « hors preuve ».
- **Automatisation.** `grind` règle l'additivité et la symétrie, pas la soustraction. Aucun contre-modèle sur ℝ n'est trouvé automatiquement.

## Dépendances mathlib des cinq câblages

`#print axioms` donne `[propext, Classical.choice, Quot.sound]` pour les cinq : il ne distingue rien. `#graphe` descend au niveau des constantes :

| Câblage | Fermeture | Propre (hors socle de 7 143) | Repères |
|---|---|---|---|
| scalaire | 13 580 | 6 437 | produit scalaire, √ |
| complexe | 10 985 | 3 842 | normSq, √ |
| trigonométrique | 13 196 | 6 053 | **exp complexe**, cos, normSq, √ |
| cosinus | 16 826 | 9 683 | produit scalaire, angle, arccos, exp complexe, cos, π |
| groupes | 7 228 | 85 | aucun |

Recouvrement des parties propres : 40 à 66 % entre les quatre premiers câblages, 0 à 1 % avec groupes.
