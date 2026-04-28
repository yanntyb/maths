# Pythagore — quatre cablages

> [Retour a Aligner](../README.md) | [Triple distinction](../../../vocabulaire/triple-distinction.md)

## Sens

> « la longueur de l'hypotenuse d'un triangle rectangle se deduit des deux autres cotes »

L'invariant `a² + b² = c²` precede ses formalisations. Quatre axiomatiques independantes produisent le meme scalaire — le sens est ce qui survit au changement de cablage.

## Contrat

```
(a, b) ∈ R_+²  -->  c ∈ R_+
```

Signature commune aux quatre cablages. Deux longueurs entrent, une longueur sort. Le contrat ne dit rien sur *comment* — il garantit seulement le type.

## Cinq cablages

Quatre operent **dans** un espace (sens ordinaires). Le cinquieme opere **sur** l'espace (meta-sens).

### 0. Algebre — cablage par identites algebriques (R[a,b,c])

| | |
|---|---|
| Espace | `R[a,b,c]` — polynomes en trois variables |
| Methode | developper `(a+b)²`, regrouper terms, annuler `2ab` |
| Formule | `(a+b)² = a² + 2ab + b² = c² + 2ab  ==>  a² + b² = c²` |
| Axiomes structurels | A1 (identite binome), A2 (commutativite), A3 (associativite), A4 (annulation) |
| Axiomes numeriques | N1 (identite `(a+b)² = c² + 2ab`), N2 (egalite des formes) |

Ce cablage est le plus **synthetique** : il montre Pythagore comme une pure rearrangement de termes algebriques, sans invoquer ni geometrie ni analyse fonctionnelle. [Details](cablages/algebre.md)

### 1. Euclide — cablage geometrique (Omega)

| | |
|---|---|
| Espace | `Omega` — domaine geometrique |
| Methode | decouper `(a+b)²` en 4 triangles + carre central `c²` |
| Formule | `(a+b)² = 4·½ab + c²  ==>  a² + b² = c²` |
| Axiomes structurels | P1 (droite unique), P2 (prolongement), P3 (cercle), CN1 (transitivite), CN5 (tout > partie) |
| Axiomes numeriques | P4 (angles droits → triangles ½ab), P5 (paralleles → carre c²), CN2 (additivite des aires), CN4 (congruence) |

### 2. Mesure — cablage par sigma-additivite (R)

| | |
|---|---|
| Espace | `R` — scalaires (mesure de Lebesgue) |
| Methode | recomposer les carres `a²` et `b²` en `c²` par isometries |
| Formule | `mu(a²) + mu(b²) = mu(c²)` |
| Axiomes structurels | M1 (positivite), M2 (vide), M5 (normalisation), M6 (existence) |
| Axiomes numeriques | M3 (sigma-additivite → decompose les aires), M4 (invariance par translation → recompose) |

### 3. Hilbert — cablage prehilbertien (E)

| | |
|---|---|
| Espace | `E` — espace vectoriel |
| Methode | developper `<v+w, v+w>` et annuler le terme croise par orthogonalite |
| Formule | `||v+w||² = ||v||² + ||w||²  si  <v,w> = 0` |
| Axiomes structurels | E1 (R-EV), E2 (produit scalaire), E4 (symetrie), E6 (definie) |
| Axiomes numeriques | E3 (bilinearite → developpe), E5 (positivite → norme), D1 (norme induite), D2 (orthogonalite → annule 2ab) |

Ce cablage utilise directement les sens du vocabulaire :
- **Aligner** = `<v,w>` (produit scalaire, `E x E -> R`)
- **Normer** = `||v|| = sqrt(<v,v>)` (auto-application d'Aligner, `E -> R`)
- **D2** = l'orthogonalite annule le terme croise d'Aligner

### 4. Frontiere — cablage par la zeta d'Epstein (N)

| | |
|---|---|
| Espace | `N` — encodage de Godel (meta-sens) |
| Methode | encoder la forme `Q(m,n) = m² + n²`, trouver `sigma_c = 1` via [Frontiere](../../../meta-sens/frontiere.md) |
| Formule | `sigma_c = d/2 = 1  ==>  Q est une norme sur R²  ==>  a² + b² = c²` |
| Blocs | [Encodage](../../../meta-objets/encodage.md), [Sonder](../../sonder/), [Peser](../../../meta-sens/peser.md), [Frontiere](../../../meta-sens/frontiere.md) |

Ce cablage ne prouve pas Pythagore de l'interieur (figures, mesures, vecteurs) mais de **l'exterieur** : il interroge les conditions de possibilite de la forme quadratique elle-meme.

### 4b. Arithmetique — cablage par la factorisation de la zeta de Dedekind (N)

| | |
|---|---|
| Espace | `N` — encodage de Godel (prolongement arithmetique de Frontiere) |
| Methode | factoriser `zeta_{Z[i]}(s) = zeta(s) · L(s, chi_4)`, lire quels premiers sont sommes de deux carres |
| Formule | `p ≡ 1 (mod 4)  <==>  p = a² + b²` (theoreme de Fermat) |
| Blocs | [Sonder](../../sonder/) x2, [Ponderer](../../ponderer/), [Frontiere](../../../meta-sens/frontiere.md) |

Ce cablage prolonge Frontiere : il ne dit pas seulement "la forme est valide" mais "quels nombres la voient". Les premiers qui scindent dans Z[i] sont exactement ceux qui sont sommes de deux carres.

### 4c. Entiers — cablage par filtrage discret (N² ∩ R_+²)

| | |
|---|---|
| Espace | `N² ∩ R_+²` — reseau entier positif |
| Methode | on connait `c ∈ N`, on filtre le cercle par le reseau : quels `(a, b) ∈ N²` satisfont `a² + b² = c²` ? |
| Formule | `c` est hypotenuse ssi `c` a au moins un facteur premier `p ≡ 1 (mod 4)` |
| Blocs | factoriser, chi_4, r_2, enumerer |

Ce cablage consomme le verdict de chi_4 (cablage arithmetique) et le transforme en enumeration concrete de triplets pythagoriciens. C'est le passage du continu au discret.

### 5. Parseval — cablage par frame orthonormal (E, frame)

| | |
|---|---|
| Espace | `E` — espace vectoriel + frame `{e_1, e_2}` |
| Methode | decomposer `v = a·e_1 + b·e_2` sur le frame, montrer que [Analyser](../../observer/analyser.md) conserve la norme |
| Formule | `||Phi* v||² = somme |<e_k|v>|² = a² + b² = ||v||² = c²` |
| Axiomes structurels | F1 (frame existe), F2 (linearite de Phi*), E1 (R-EV), E2 (produit scalaire) |
| Axiomes numeriques | F3 ([Gram](../gram.md) = I), F4 (resolution de l'identite), F5 (v dans V) |

Ce cablage utilise les sens du vocabulaire :
- **[Analyser](../../observer/analyser.md)** = Phi* (empiler des [Mesurer](../../mesurer/))
- **[Synthetiser](../../observer/synthetiser.md)** = Phi (sommer des kets)
- **[Gram](../gram.md)** = Phi* Phi (matrice des [Aligner](../README.md) entre elements du frame)
- **[Normer](../../normer/)** = `||v|| = sqrt(<v,v>)` (auto-application d'Aligner)
- **F3** = la Gram est I — [Analyser](../../observer/analyser.md) est une isometrie

La difference avec Hilbert : Hilbert developpe `<v+w, v+w>` et annule `2<v,w>`. Parseval decompose `v` sur le frame et somme les carres des coefficients. Le premier raisonne sur le **terme croise**, le second sur la **conservation de la norme**.

Fiche detaillee : [parseval.md](parseval.md)

## Quatre niveaux

| Niveau | Cablages | Question |
|--------|----------|----------|
| **Synthetique** (R[a,b,c], algebraique) | Algebre | comment l'identite `(a+b)²` se rearrange-t-elle ? |
| **Sens** (R_+², continu) | Euclide, Mesure, Hilbert, Parseval | `a² + b² = c²` est-il vrai ? |
| **Meta-sens** (N, encodage) | Frontiere, Arithmetique | pourquoi cette forme ? quels premiers la voient ? |
| **Filtre discret** (N², entier) | Entiers | quels entiers sont hypotenuses ? |

## Poids des axiomes

Chaque axiome a un **poids** qui varie avec `(a, b)`. Les axiomes se classent en deux categories :

| Categorie | Comportement | Exemple |
|-----------|-------------|---------|
| **Structurel** | poids constant — toujours present en fond | P1 (droite unique), M1 (positivite), E1 (R-EV) |
| **Numerique** | poids variable — croit avec les valeurs | P5 (poids = c²), M3 (poids = a² + b²), D2 (poids = 2ab) |

Le poids est une forme de **cout d'evaluation** : le cablage determine le cout, et le cout change quand les entrees changent.

## Deux vues

| Vue | Ce qu'elle montre |
|-----|-------------------|
| **Animation** | visualisation geometrique du cablage (grand carre, trois carres, vecteurs orthogonaux) |
| **Arbre** | graphe `a, b → axiomes → c²` — epaisseur des aretes proportionnelle au poids |

## Invariant

Les six cablages cristallisent le meme nombre. Le bandeau du haut affiche ce resultat unique :

```
a² + b² = c²  -->  9.00 + 16.00 = 25.00
```

C'est le sens qui reste quand on change de preuve.
