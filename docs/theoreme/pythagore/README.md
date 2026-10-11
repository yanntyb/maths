# Pythagore — cinq cablages algebriques

> [Retour a Aligner](../README.md) | [Triple distinction](../../../vocabulaire/triple-distinction.md)

## Sens

> « la longueur de l'hypotenuse d'un triangle rectangle se deduit des deux autres cotes »

L'invariant `a² + b² = c²` precede ses formalisations. Cinq axiomatiques independantes — **sans aucune decomposition geometrique** — produisent le meme scalaire. Chacune evite le dessin et repose sur une structure algebrique ou analytique: produit scalaire, complexes, series, loi des cosinus, symetries de groupe.

Lean nuance « independantes » : cosinus se ramene au scalaire, et chaque liste d'axiomes contient des axiomes superflus. Voir [Ce que Lean etablit](#ce-que-lean-etablit).

## Contrat

```
(a, b) ∈ R_+²  -->  c ∈ R_+
```

Signature annoncee commune aux cinq cablages. Deux longueurs entrent, une longueur sort. Parmi les enonces formalises en Lean, seul `scalaire.norme` la respecte ; les autres ont leur propre contrat (`E x E -> R`, `K x K -> K`, `R -> R`, `R² -> R`). Le contrat ne dit rien sur *comment* — il garantit seulement le type.

## Cinq cablages

Tous operent **dans** des espaces algebriques ou analytiques : corps des complexes, espaces prehilbertiens, anneaux de polynomes, corps de rotations. Aucun n'invoque la geometrie ordinaire (Omega) ni les formes discretes (N).

### 0. Scalaire — cablage par produit scalaire (espace prehilbertien)

| | |
|---|---|
| Espace | `E` — espace vectoriel prehilbertien |
| Methode | developper `‖u+v‖² = (u+v, u+v)` et annuler le terme croise par orthogonalite |
| Formule | `‖u+v‖² = ‖u‖² + 2(u,v) + ‖v‖²  si  (u,v)=0  alors  c² = a² + b²` |
| Axiomes structurels | S1 (bilinearite), S2 (symetrie), S3 (positivite), N1 (definition norme) |
| Axiomes numeriques | N2 (orthogonalite → (u,v)=0), N3 (developpement bilineaire) |
| Statuts (Lean) | S2, N2 essentiels ; S3 essentiel pour la norme seulement ; S1 superflu en partie (un cote d'additivite et l'homogeneite suffisent a retirer un a un) |

Montage pur : deux vecteurs orthogonaux, leur somme a pour norme carree la somme des carres des normes. [Details](cablages/scalaire.md)

### 1. Complexe — cablage par module d'un complexe (corps C)

| | |
|---|---|
| Espace | `C` — corps des nombres complexes |
| Methode | definir |z|² = z · z̄, developper (a+ib)(a-ib), simplifier i² = -1 |
| Formule | `|z|² = z·z̄ = (a+ib)(a-ib) = a² + b²` |
| Axiomes structurels | C1 (structure corps), C2 (conjugaison), C3 (i²=-1), N1 (definition module) |
| Axiomes numeriques | N2 (identite remarquable), N3 (simplification i²) |
| Statuts (Lean) | C2, C3 essentiels ; C1 se reduit a un anneau commutatif (inverses superflus, commutativite non testee) |

Pont algebrique : les complexes transportent Pythagore au coeur de leur definition du module. [Details](cablages/complexe.md)

### 2. Trigonometrique — cablage par series entieres (analyse reelle)

| | |
|---|---|
| Espace | `R` — scalaires definis par series |
| Methode | developper cos, sin par series entieres, deriver terme a terme, montrer que f(θ)=cos²θ+sin²θ est constante |
| Formule | `cos'(θ)=-sin(θ), sin'(θ)=cos(θ) => f'=0 => f(θ)=f(0)=1` |
| Axiomes structurels | A1 (series de cos,sin), A3 (derivation terme-a-terme), A4 (cos'=-sin), A5 (sin'=cos) |
| Axiomes numeriques | N1 (derivation f), N2 (f constante), N3 (evaluation), N4 (triangles rectangles) |
| Statuts (Lean) | A4, A5, N3 essentiels ; A1-A3 en amont ; N2 repose sur la completude de R |

Fondement analytique : Pythagore emerge de l'analyse plutot que de la geometrie. [Details](cablages/trigonometrique.md)

### 3. Cosinus — cablage par loi des cosinus (geometrie algebrisee)

| | |
|---|---|
| Espace | `E` — espace vectoriel prehilbertien |
| Methode | derivation generale ‖u-v‖² = ‖u‖² + ‖v‖² - 2‖u‖‖v‖cos(θ), cas particulier θ=π/2 |
| Formule | `cos(π/2)=0  =>  ‖u-v‖² = ‖u‖² + ‖v‖²` |
| Axiomes structurels | S1 (definition angle), S2 (bilinearite), S3 (symetrie) |
| Axiomes numeriques | N1 (loi cosinus), N2 (angle droit), N3 (cos(π/2)=0) |
| Statuts (Lean) | S1, S3, N3 essentiels ; S2 un cote superflu ; N1 derivable ; se ramene au cablage scalaire |

Cas particulier d'une formule universelle : Pythagore est le cas θ=π/2 d'une identite valable pour tous les angles. [Details](cablages/cosinus.md)

### 4. Groupes — cablage par invariants de SO(2) (theorie des groupes)

| | |
|---|---|
| Espace | `ℝ²` avec action du groupe SO(2) |
| Methode | montrer que l'unique forme quadratique invariante sous SO(2) (normalisee) est Q(x,y)=x²+y² |
| Formule | `Dim(Inv_{SO(2)}(Q))=1, engendre par x²+y²  =>  ‖(a,b)‖²=a²+b²` |
| Axiomes structurels | G1 (groupe SO(2)), G2 (action lineaire), A1 (forme quadratique), A2 (invariance) |
| Axiomes numeriques | N1 (derivation groupe), N2 (resolution EDP), N3 (normalisation), N4 (unicite) |
| Statuts (Lean) | A1, N3 essentiels ; G2 essentiel ou superflu selon la lecture de A1 ; G1, G3, N1, N2 hors preuve |

Profondeur abstraite : Pythagore comme necesssite logique d'une symetrie fondamentale. [Details](cablages/groupes.md)

## Cinq niveaux algebriques

| Niveau | Cablages | Question |
|--------|----------|----------|
| **Vectoriel** (espace prehilbertien) | Scalaire | l'orthogonalite annule-t-elle le terme croise ? |
| **Corpique** (nombres complexes) | Complexe | le module preserve-t-il le produit ? |
| **Analytique** (series entieres) | Trigonometrique | l'identite trigonometrique s'en deduit-elle ? |
| **Universelle** (tous les angles) | Cosinus | Pythagore est-il le cas droit d'une formule generale ? |
| **Symetrique** (groupe SO(2)) | Groupes | quelle forme est invariante sous rotations ? |

## Axiomes : structurels vs numeriques

Chaque axiome a un **poids** qui varie avec `(a, b)`. Les axiomes se classent en deux categories :

| Categorie | Comportement | Exemple |
|-----------|-------------|---------|
| **Structurel** | poids constant — toujours present en fond | S1 (bilinearite), C1 (structure corps), A1 (series) |
| **Numerique** | poids variable — croit avec les valeurs | N2 (orthogonalite), N3 (simplification i²), N1 (derivation) |

Le poids est une forme de **cout d'evaluation** : le cablage determine le cout, et le cout change quand les entrees changent.

Le poids ordonne les axiomes, il ne dit pas si un axiome sert : c'est le test de derivabilite qui tranche (section suivante). Le visualiseur V9 affiche les poids, V10 les statuts.

## Ce que Lean etablit

Chaque cablage est formalise dans `lean/` : axiomes du tableau en hypotheses, un statut par axiome. Un axiome est **essentiel** si un contre-modele satisfait tous les autres et contredit la conclusion, **superflu** si une preuve s'en passe. Les statuts sont des theoremes verifies par le noyau ; le [visualiseur V10](../../../app/10_statuts/) les affiche, le detail est dans [lean/README.md](../../../lean/README.md).

- **Chaque liste contient des axiomes superflus.** Les cablages demandent moins qu'ils n'annoncent : un cote d'additivite (scalaire, cosinus), un anneau commutatif au lieu d'un corps (complexe), le quart de tour au lieu de SO(2) quand la forme est polynomiale (groupes).
- **Le statut depend du contrat.** La positivite S3 est superflue pour `B(u+v, u+v) = B(u,u) + B(v,v)` (`E x E -> R`), essentielle pour `‖u+v‖² = ‖u‖² + ‖v‖²` avec `‖x‖ = √B(x,x)` (contrat commun).
- **Cosinus se ramene au scalaire.** L'angle, θ et π n'interviennent pas : S1 et N3 servent seulement a obtenir B(x, y) = 0.
- **Hypotheses cachees.** Trigonometrique : « derivee nulle => constante » repose sur la completude de R. Complexe : la commutativite. Groupes : SO(2) est defini par c² + s² = 1, c'est-a-dire par le cercle euclidien ; le cablage risque de presupposer ce qu'il demontre.
- **Les numeriques sont souvent des etapes.** N2, N3 (complexe), N3 (scalaire), N4 (cosinus, groupes) sont des etapes de calcul faites par la tactique, pas des axiomes.

## Invariant

Les cinq cablages cristallisent le meme nombre, issu de cinq univers algebriques distincts :
- **Scalaire** : par bilinearite
- **Complexe** : par conjugaison
- **Trigonometrique** : par derivation de series
- **Cosinus** : par angle particulier
- **Groupes** : par symetrie rotationnelle

Le bandeau affiche ce resultat unique :

```
a² + b² = c²  -->  9.00 + 16.00 = 25.00
```

C'est l'invariant qui survit a tous les changements de formalisme. **Les cinq preuves ne sont pas des variations : ce sont cinq visions orthogonales du meme fait.** Lean tempere « orthogonales » : cosinus se ramene au scalaire (`Cosinus.via_scalaire`), et les quatre premiers cablages partagent 40 a 66 % de leurs dependances mathlib propres ; seul groupes en est presque disjoint (0 a 1 %).
