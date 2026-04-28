# Expérience 1 — Décompression de phrase

> [Retour aux expériences](../README.md) | [Triple distinction](../../vocabulaire/triple-distinction.md)

## Phrase source

*« Modifier les axiomes d'un système formel modifie la densité de ses formules-entiers via Gödel, ce qui modifie l'abscisse de convergence de sa zêta arithmétique ; cette variation Δσ_c mesure rigoureusement combien chaque axiome contribue à la richesse arithmétique du système — donnant un test différentiel de solidité. »*

Cette phrase comprime **cinq mouvements mathématiques distincts**. Chacun a un sens propre. Ensemble, ils forment un **programme de recherche**.

---

## Les cinq mouvements

### Mouvement 1 — La répartition des nombres premiers

| Aspect | Contenu |
|--------|---------|
| **Constat** | Les nombres premiers sont distribués selon une loi gouvernée par ζ(s) (zêta de Riemann) |
| **Modification** | Remplacer la zêta de Riemann par une variante ζ_T(s) qui dépend d'un système formel T |
| **Effet** | ζ_T(s) déforme la distribution des premiers : certains entiers deviennent "premiers virtuels", d'autres perdent leur statut |

**Intuition** : La zêta encode la distribution. Paramétrer la zêta par T, c'est encoder comment T voit la distribution des nombres.

---

### Mouvement 2 — L'encodage de Gödel

| Objet | Encodage |
|-------|----------|
| Chaque axiome de T | ⌜axiome⌝ ∈ ℕ |
| Chaque preuve dans T | ⌜preuve⌝ ∈ ℕ |
| Chaque théorème de T | ⌜théorème⌝ ∈ ℕ |
| T tout entier | **S_T** = ensemble d'entiers codant ses formules valides |

**Propriété clé** : S_T ⊂ ℕ a une **densité** dans ℕ. Cette densité reflète la richesse de T.

---

### Mouvement 3 — La zêta de T

On construit la zêta associée à S_T :

```
ζ_T(s) = Σ_{n ∈ S_T} 1/n^s
```

C'est une **fonction génératrice** qui encode la densité des entiers issus de T dans ℕ.

| T | Implication |
|---|-------------|
| **T riche** | S_T dense dans ℕ → ζ_T converge tard (σ_c haut) |
| **T pauvre** | S_T rare dans ℕ → ζ_T converge tôt (σ_c bas) |

---

### Mouvement 4 — La frontière de constructibilité

L'**abscisse de convergence** :

```
σ_c(T) = inf { s : ζ_T(s) converge }
```

Cette grandeur mesure la **frontière entre ce qui est constructible et ce qui ne l'est pas** dans T.

| σ_c(T) | Sens |
|--------|------|
| **HAUT** | S_T très dense, T encode beaucoup d'arithmétique, T a beaucoup de structure |
| **BAS** | S_T rare, T encode peu d'arithmétique, T est faible |

---

### Mouvement 5 — Tester la solidité d'un théorème

Soit Φ un théorème de T. On regarde comment σ_c(T) varie quand on retire ou ajoute les axiomes liés à Φ.

**Test différentiel** :

```
Δσ_c = σ_c(T) - σ_c(T - {axiomes_de_Φ})
```

| Cas | Interprétation |
|-----|-----------------|
| **Δσ_c grand** | Φ est structurellement essentiel — retirer Φ → perte massive de structure |
| **Δσ_c petit** | Φ est marginal ou redondant — retirer Φ → peu de changement |

---

## Formalisation rigoureuse

### Définitions précises

| Objet | Définition |
|-------|-----------|
| **T** | Système formel cohérent contenant PA |
| **Φ** | Théorème de T |
| **T_Φ** | T privé des axiomes nécessaires à Φ |
| **S_T** | {⌜formula⌝ : formula est valide dans T} ⊂ ℕ |
| **ζ_T(s)** | Σ_{n ∈ S_T} 1/n^s |
| **σ_c(T)** | inf { s ∈ ℝ : ζ_T(s) converge absolument } |
| **Δσ_c(Φ)** | σ_c(T) - σ_c(T_Φ) |

### Théorème / Programme (à développer)

**Entrée** : T (cohérent), Φ (théorème de T)

**Processus** :
1. Encoder T et T_Φ par numéros de Gödel
2. Construire ζ_T(s) et ζ_{T_Φ}(s)
3. Calculer σ_c(T) et σ_c(T_Φ)
4. Δσ_c(Φ) = σ_c(T) - σ_c(T_Φ)

**Sortie** : Δσ_c(Φ) quantifie la **solidité informationnelle** de Φ

---

## Pourquoi cette formulation est rigoureuse

### Chaque objet est précisément défini

- T, S_T, ζ_T, σ_c(T), Δσ_c : tous sont des objets mathématiques standard
- L'abscisse de convergence d'une série de Dirichlet est calculable (en principe)

### La mesure est claire

```
Δσ_c grand   →  Φ porte de l'information arithmétique
Δσ_c petit   →  Φ est superflu ou redondant
```

### Le test est différentiel

On ne mesure pas Φ en absolu — on mesure son **impact** sur la structure de T.

---

## L'analogie avec ζ de Riemann

La zêta classique encode la distribution des nombres premiers :

```
ζ(s) = Σ_n 1/n^s
converge pour s > 1
σ_c(ζ) = 1
```

Cette valeur exprime un fait : la densité des entiers dans ℕ suffit tout juste à rendre la série convergente.

Pour ζ_T, l'idée parallèle :

```
ζ_T(s) = Σ_{n ∈ S_T} 1/n^s
σ_c(ζ_T) = quelque chose qui dépend de la richesse de T
```

Cela exprime un fait : la densité de S_T dans ℕ, qui reflète la richesse arithmétique de T.

---

## Éviter les barrières classiques

Cette approche n'est soumise à aucune barrière connue de la complexité :

| Barrière | Contournement |
|----------|-----------------|
| **Relativisation** | Pas d'oracle externe ; on observe la structure **interne** de T via Gödel |
| **Naturalité** | σ_c est une grandeur **analytique**, pas une propriété combinatoire |
| **Algébrisation** | σ_c est **dimensionnel**, pas algébrique |

---

## Ce qui reste à prouver rigoureusement

### SP1 — Bien définir ζ_T(s)

- Choisir un encodage de Gödel canonique
- Prouver l'existence d'une zêta convergente sur un domaine

### SP2 — Caractériser σ_c(T)

- En fonction des propriétés de T (cohérence, richesse)
- Lier σ_c(T) à des invariants arithmétiques connus

### SP3 — Théorème de stabilité (VERROU CENTRAL)

```
Δσ_c(Φ) grand  ⟺  Φ essentiel à la structure de T
```

C'est l'équivalence centrale à démontrer.

### SP4 — Applications concrètes

- Vérifier sur Pythagore, Gödel, Fermat
- Que Δσ_c reflète bien l'essentialité

---

## Exemple concret — Pythagore et la σ-additivité

### Cadre

- **T** = théorie des mesures + axiomes des réels
- **T_M3** = T sans M3 (σ-additivité), avec M3' seulement
- **Φ** = théorème utilisant l'intégrale de Lebesgue (qui nécessite M3)

### Calcul (en principe)

```
σ_c(T) ≈ valeur reflétant la richesse complète
σ_c(T_M3) ≈ valeur réduite (perte de σ-additivité)

Δσ_c = σ_c(T) - σ_c(T_M3)
```

### Prédictions

| Théorème | Δσ_c | Interprétation |
|----------|------|-----------------|
| **Pythagore** | Modéré | M3 marginal pour Pythagore |
| **Théorèmes d'analyse** | Grand | M3 essentiel pour l'analyse moderne |

**Diagnostic** : Δσ_c localiserait que M3 est essentiel pour l'analyse mais sur-dimensionnée pour Pythagore.

---

## Triple distinction

| Dimension | Contenu |
|-----------|---------|
| **Sens** | L'essentialité d'un axiome se manifeste dans la densité arithmétique du système ; modifions l'axiome, la densité change ; cette variation mesure l'essentialité |
| **Contrat** | (T, Φ) ∈ (Système formel, Théorème) → Δσ_c ∈ ℝ |
| **Cablage** | Encoder T par Gödel → S_T → ζ_T(s) → σ_c(T) → soustraire σ_c(T_Φ) → Δσ_c |

---

## Résumé en une phrase

Modifier les axiomes d'un système formel modifie la densité de ses formules-entiers via Gödel, ce qui modifie l'abscisse de convergence de sa zêta arithmétique ; cette variation Δσ_c mesure rigoureusement combien chaque axiome contribue à la richesse arithmétique du système — donnant un test différentiel de solidité.

---

## Circuit et cablage

Comment les 5 mouvements s'assemblent pour former un diagnostic rigoureux.

→ [Voir le cablage](cablages.md)

---

[← Expériences](../README.md)
