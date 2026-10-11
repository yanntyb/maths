# Prerequis — distance unite

> [Retour au vocabulaire](README.md) | [Espaces](espaces.md) | [Distance unite](../README.md)

Chaque objet en quelques lignes, avec un exemple dans `Q(i)`. Quand `Q(i)` est trop simple pour montrer le phenomene, l'exemple passe a `Q(√−5)`. L'ordre suit les dependances : chaque entree n'utilise que les precedentes.

## Corps et nombres

### Corps de nombres `K`

Extension finie de `Q`, de degre `n = [K:Q]` (dimension de `K` comme `Q`-espace vectoriel).

Exemple : `Q(i) = {a + bi : a, b ∈ Q}`, degre 2.

Sert dans : partout ; espace `K` de [espaces](espaces.md).

### Plongements, totalement reel, CM

Un plongement est un morphisme de corps `σ : K -> C` ; il y en a exactement `n`. `K` est **totalement reel** si tous tombent dans `R`. `K` est **CM** s'il est une extension quadratique totalement imaginaire d'un corps totalement reel ; on note `c` l'automorphisme non trivial.

Exemple : `Q(√2)` est totalement reel (`√2 ↦ ±√2`). `Q(i)` est CM sur `Q`, avec `c` = conjugaison complexe.

Sert dans : [Plonger](../sens/plonger/), [Unitariser](../sens/unitariser/), [norme un](../etages/norme-un.md).

### Anneau des entiers `O_K`

Les elements de `K` racines d'un polynome unitaire a coefficients entiers. C'est l'analogue de `Z` dans `Q`.

Exemple : `O_{Q(i)} = Z[i]` (entiers de Gauss). `O_{Q(√−5)} = Z[√−5]`.

Sert dans : [Descendre](../sens/descendre/) (ecart entier), [taille](../etages/taille.md).

### Norme `N_{K/Q}`

Produit des `n` images `σ(x)`. Elle est multiplicative, et entiere sur `O_K`.

Exemple : `N(a + bi) = (a + bi)(a − bi) = a² + b²`.

Sert dans : [Descendre](../sens/descendre/).

## Ideaux et classes

### Ideaux : pourquoi on en a besoin

Dans `O_K`, la factorisation des **elements** en irreductibles peut ne pas etre unique. Celle des **ideaux** en ideaux premiers l'est toujours. Un ideal premier joue le role d'un nombre premier.

Exemple : dans `Z[√−5]`, `6 = 2 · 3 = (1 + √−5)(1 − √−5)`, deux factorisations distinctes. En ideaux : `(6) = 𝔭_2² 𝔭_3 𝔭_3'`, une seule.

Sert dans : [norme un](../etages/norme-un.md) (ideaux `A_ε`).

### Ideal principal, groupe de classes `Cl(K)`, `h(K)`

Un ideal est principal s'il est engendre par un seul element, `(α)`. `Cl(K)` = ideaux fractionnaires modulo principaux ; c'est un groupe fini d'ordre `h(K)`. `h(K) = 1` signifie : factorisation unique des elements.

Exemple : `h(Q(i)) = 1` (`Z[i]` est principal). `h(Q(√−5)) = 2` : `𝔭_2 = (2, 1 + √−5)` n'est pas principal.

Sert dans : [norme un](../etages/norme-un.md) (pigeonhole), [nombre de classes](../etages/nombre-classes.md).

### Decomposition d'un premier

Un premier rationnel `q` engendre dans `O_K` un ideal `q O_K = ∏ 𝔓^e`. En degre 2, trois comportements : **decompose** (deux facteurs), **inerte** (reste premier), **ramifie** (exposant `e > 1`). En degre plus grand, les cas se melangent (ex. `q O_K = 𝔓_1² 𝔓_2` dans un corps cubique). **Totalement decompose** : `n` facteurs distincts.

Exemple dans `Z[i]` : `5 = (2 + i)(2 − i)` decompose ; `3` inerte ; `2 = −i(1 + i)²` ramifie. Regle : `q ≡ 1 (mod 4)` decompose, `q ≡ 3 (mod 4)` inerte.

Sert dans : [Signer](../sens/signer/), [norme un](../etages/norme-un.md), [tour pro-3](../etages/tour-pro-3.md).

### Discriminant `D_K`, discriminant racine `rd(K)`

Entier qui mesure la ramification : un premier ramifie dans `K` si et seulement s'il divise `D_K`. `rd(K) = |D_K|^{1/n}` le normalise par le degre.

Exemple : `D_{Q(i)} = −4`, donc seul 2 ramifie ; `rd(Q(i)) = 2`.

Sert dans : [Jauger](../sens/jauger/).

### Extension non ramifiee

`M/F` est non ramifiee si aucun premier de `F` ne ramifie dans `M` (et, aux places infinies, aucune place reelle ne devient complexe). Elle garde `rd` constant.

Exemple : `Q(√−5, i) / Q(√−5)` est non ramifiee, de degre `2 = h(Q(√−5))` (corps de classes de Hilbert).

Sert dans : [corps de base](../etages/corps-de-base.md), [tour pro-3](../etages/tour-pro-3.md).

## Galois

### Groupe de Galois

Automorphismes de `M` qui fixent `F`. Si `M/F` est galoisienne, leur nombre vaut `[M:F]`.

Exemple : `Gal(Q(i)/Q) = {id, c}`.

Sert dans : [Galois](../meta-objets/galois.md).

### Frobenius

Pour `q` non ramifie, l'automorphisme qui agit comme `x ↦ x^q` modulo un premier au-dessus de `q`. Il est trivial si et seulement si `q` est totalement decompose.

Exemple dans `Q(i)`, `q` impair : `Frob_q = id` si `q ≡ 1 (mod 4)`, `Frob_q = c` si `q ≡ 3 (mod 4)`.

Sert dans : [Signer](../sens/signer/).

### Caracteres de Dirichlet, conducteur

Morphisme `χ : (Z/mZ)^× -> C^×`. Le conducteur est le plus petit module qui definit `χ`. Par Galois, un groupe de caracteres correspond a un corps abelien (« corps coupe par `χ` »).

Exemple : le caractere non trivial modulo 4 (`χ(1) = 1`, `χ(3) = −1`) coupe `Q(i)` ; conducteur 4 = `|D_{Q(i)}|`.

Sert dans : [corps de base](../etages/corps-de-base.md).

## Groupes pro-p

### Groupe pro-p

Limite projective de `p`-groupes finis : un groupe profini dont tous les quotients par des sous-groupes ouverts distingues sont des `p`-groupes finis. C'est le langage des tours infinies : chaque quotient fini est une couche de la tour.

Exemple : `Z_p` (entiers p-adiques), limite des `Z/p^kZ`.

Sert dans : [tour pro-3](../etages/tour-pro-3.md).

### Generateurs `d(G)` et relations `r(G)`

`d` = nombre minimal de generateurs ; `r` = nombre minimal de relations dans une presentation pro-p.

Exemples : `Z_p` : `d = 1`, `r = 0`. `Z/pZ` : `d = 1`, `r = 1` (la relation `x^p = 1`). Pro-p libre a `d` generateurs : `r = 0`.

Controle avec [Seuil](../meta-sens/seuil.md) : `Z/pZ` est fini et `r = 1 > d²/4 = 1/4`, conforme. Le pro-p libre a `r = 0 ≤ d²/4`, donc il est infini.

### Sous-groupe de Frattini `Φ(G)`

Intersection des sous-groupes maximaux ouverts ; pour un pro-p, `Φ(G) = closure(G^p [G, G])`. Ses elements sont des « non-generateurs ». `G/Φ(G) ≅ (Z/pZ)^d`.

Exemple : `G = Z/p²Z`, `Φ(G) = pZ/p²Z`, `G/Φ(G) = Z/pZ`, donc `d = 1`.

Sert dans : [Seuil](../meta-sens/seuil/quotient-frattini.md).

## Geometrie

### Reseau, covolume

Sous-groupe discret de `R^k` engendre par une base de `R^k`. Le covolume est le volume d'une maille.

Exemple : `Z[i] ⊂ C ≅ R²`, covolume 1. `N⁻² Z[i]` : covolume `N⁻⁴`.

Sert dans : [Plonger](../sens/plonger/), [fenetre](../etages/fenetre.md), [Moyenner](../sens/moyenner/).

### Norme sup, polydisque

Sur `C^f` : `‖z‖_∞ = max |z_r|`. La boule de rayon `R` est un produit de `f` disques, de volume `(πR²)^f`.

Exemple : pour `f = 1`, un disque ordinaire.

Sert dans : [fenetre](../etages/fenetre.md), [Tasser](../sens/tasser/).
