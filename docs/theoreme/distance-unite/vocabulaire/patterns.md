# Patterns — distance unite

> [Retour au vocabulaire](README.md) | [Patterns globaux](../../../vocabulaire/patterns.md)

Structures reconnaissables dans l'assemblage des [etages](../etages/). Reconnaitre un pattern, c'est le **nommer** pour pouvoir le dezoomer en bloc opaque.

## Competition d'exposants

| Signal | Pattern | Dans la preuve |
|--------|---------|----------------|
| deux quantites qui croissent avec le meme parametre (`f` ou `ℓ`), de part et d'autre d'une inegalite | comparer les exposants ; le gagnant fixe une constante | 4 occurrences, une par choix de constante |

Forme commune : `g(p)` contre `h(p)`, avec `p → ∞`. L'ordre de croissance de `g` doit dominer celui de `h`. Les constantes libres sont choisies pour que l'ecart ne depende pas de `p`.

| Occurrence | Parametre | Gagnant | Perdant | Constante fixee | Etage |
|------------|-----------|---------|---------|-----------------|---------|
| relations vs seuil | `d ≥ ℓ − 1` | `d²/4` | `3t ≤ 3d²/100` | `t = ⌊(ℓ−1)²/100⌋` (borne haute) | [tour pro-3](../etages/tour-pro-3.md), [Seuil](../meta-sens/seuil.md) |
| ideaux vs classes | `ℓ` | `t log 2 ≍ ℓ²` | `log H_ℓ = O(ℓ log ℓ)` | ℓ grand (borne basse sur `t`) | [nombre de classes](../etages/nombre-classes.md) |
| translations vs aire perdue | `f` | `e^{γf}` | `ρ_R^f > e^{−γf/2}` | `R` | [fenetre](../etages/fenetre.md) |
| distances vs taille | `f` | `e^{γf/2}` | `n ≤ e^{Bf}` | `δ = γ/4B` | [taille](../etages/taille.md) |

Les deux premieres lignes comparent des fonctions de ℓ (les exposants eux-memes). Elles encadrent `t` : `ℓ log ℓ ≪ t < d²/12` en gros. Le PDF choisit `t ≍ ℓ²`, pres du bord haut.

## Ecart arithmetique

| Signal | Pattern | Dans la preuve |
|--------|---------|----------------|
| [Plonger](../sens/plonger/) suivi de [Descendre](../sens/descendre/) sur une difference de points | integralite => separation | [taille](../etages/taille.md) |

```mermaid
graph LR
    xx["x, x' : points de Λ"]:::blue --> DIFF["difference"]
    DIFF --> beta["β = 𝒟·(x − x') : O_K \ 0"]:::indigo
    beta --> DESC["Descendre"]
    DESC --> N["|N(β)| ≥ 1"]:::green
    N --> PROD["produit des<br/>coordonnees ≥ 𝒟^−f"]
    PROD --> SEP["une coordonnee<br/>≥ 𝒟⁻¹"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef indigo fill:#6366F1,color:#fff
```

Contrat du pattern une fois dezoome : `Λ = Φ(𝒟⁻¹O_K) -> Λ est 𝒟⁻¹-separe en norme sup`. La sortie alimente [Tasser](../sens/tasser/), qui la convertit en `n ≤ e^{Bf}`. Un entier non nul vaut au moins 1 : cette contrainte arithmetique interdit aux points d'etre proches dans toutes les coordonnees a la fois.

Forme degeneree dans [fenetre](../etages/fenetre.md) : `σ_1(β) = 0 => β = 0`. C'est l'ecart arithmetique reduit a une seule coordonnee, et il donne l'injectivite de la projection.
