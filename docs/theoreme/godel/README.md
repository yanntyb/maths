# Godel — cinq cablages

> [Triple distinction](../../vocabulaire/triple-distinction.md)

## Sens

> « tout systeme formel coherent et suffisamment riche contient des enonces vrais mais non demontrables »

L'invariant `∃ G vrai et indemontrable` precede ses formalisations. Cinq axiomatiques independantes produisent le meme verdict — le sens est ce qui survit au changement de cablage.

## Contrat

```
T (systeme formel coherent, suffisamment riche) --> ∃ G ∈ L(T) : T ⊬ G ∧ T ⊬ ¬G
```

Signature commune aux cinq cablages. Un systeme formel entre, une phrase indecidable sort. Le contrat ne dit rien sur *comment* — il garantit seulement l'existence.

## Cinq cablages

Deux operent au niveau **syntaxique** (preuves), un au niveau **semantique** (verite), deux au niveau **informationnel** (meta-sens).

### 1. Godel original — auto-reference par numerotation (1931)

| | |
|---|---|
| Espace | `N` — numerotation de Godel |
| Methode | construire une phrase G qui dit "je ne suis pas demontrable dans T" |
| Formule | `G := ¬Dem(⌜G⌝)` — point fixe de la negation de demontrabilite |
| Axiomes structurels | T coherent, T contient PA, numerotation injective |
| Axiomes numeriques | recursivite primitive de Dem(x,y), lemme de point fixe (diagonalisation) |

### 2. Kleene — calculabilite et probleme de l'arret (1943)

| | |
|---|---|
| Espace | `N` — machines de Turing |
| Methode | deduire l'incompletude de l'indecidabilite du probleme de l'arret |
| Formule | `Halt(e,x) indecidable ∧ T decidable => T incomplet` |
| Axiomes structurels | T coherent, T contient PA, these de Church-Turing |
| Axiomes numeriques | simulation universelle, reduction arret → preuve |

### 3. Tarski — indefinissabilite de la verite

| | |
|---|---|
| Espace | `L(T)` — langage de T |
| Methode | montrer que la verite arithmetique n'est pas definissable dans T |
| Formule | `¬∃ Vrai(x) ∈ L(T) : Vrai(⌜phi⌝) <=> phi` |
| Axiomes structurels | T coherent, T contient PA, langage denombrable |
| Axiomes numeriques | diagonalisation sur les formules a une variable |

### 4. Chaitin — complexite de Kolmogorov (1971)

| | |
|---|---|
| Espace | `N` — programmes (complexite algorithmique) |
| Methode | T ne peut pas prouver qu'un nombre a une complexite K superieure a sa propre taille |
| Formule | `∀ n : T ⊢ "K(n) > c" => c ≤ |T| + O(1)` |
| Axiomes structurels | T coherent, machine de Turing universelle, K(n) bien definie |
| Axiomes numeriques | borne K ≤ |T| + c, incompressibilite de Omega |

### 5. Boolos — paradoxe de Berry formalise (1989)

| | |
|---|---|
| Espace | `L(T)` — formules denombrables |
| Methode | formaliser le paradoxe de Berry pour obtenir l'incompletude |
| Formule | `#{formules de < k symboles} < ∞ => ∃ n indefinissable => ∃ G indemontrable` |
| Axiomes structurels | T coherent, langage fini, formules denombrables |
| Axiomes numeriques | borne lexicale, comptage des definitions |

## Trois niveaux

| Niveau | Cablages | Question |
|--------|----------|----------|
| **Sens (syntaxique)** | Godel original, Kleene | G est-il demontrable ? |
| **Sens (semantique)** | Tarski | la verite est-elle definissable ? |
| **Meta-sens (information)** | Chaitin, Boolos | quelle quantite d'information T peut-il capturer ? |

## Poids des axiomes

Chaque axiome a un **poids** conceptuel. Les axiomes se classent en deux categories :

| Categorie | Comportement | Exemple |
|-----------|-------------|---------|
| **Structurel** | toujours present — condition de possibilite du theoreme | T coherent, T contient PA, numerotation injective |
| **Numerique** | specifique au cablage — mecanisme constructif | lemme de point fixe, reduction du halting, borne K ≤ |T| + c |

## Invariant

Les cinq cablages aboutissent au meme verdict. L'enonce invariant :

```
∃ G ∈ L(T) : G est vrai et T ⊬ G
```

C'est le sens qui reste quand on change de preuve.
