# Descendre

> [Retour aux sens](../README.md) | [Distance unite](../../README.md)

`N_{K/Q}(x) = ∏_σ σ(x)`

- **Sens** -- ramener un element de `K` a un nombre rationnel en multipliant tous ses conjugues
- **Contrat** -- `K -> Q` ; restreint aux entiers : `O_K \ {0} -> Z \ {0}`
- **Ports** -- `x in K` (entree), `Q` (sortie)
- **Origine** -- derive : [Ponderer](../../../../sens/ponderer/) itere sur tous les plongements `σ : K -> C` ([detail](produit-conjugues.md))

## Comment ca marche

Un element `x` de `K` a autant de « copies » complexes que de plongements `σ_1, ..., σ_n`. Leur produit est invariant par Galois : il tombe dans `Q`. Si `x` est un entier algebrique, il tombe dans `Z`.

```mermaid
graph LR
    x["x : K"]:::indigo --> DESC["Descendre"]
    DESC --> q["N(x) : Q"]:::green

    classDef green fill:#10B981,color:#fff
    classDef indigo fill:#6366F1,color:#fff
```

Deux proprietes portent toute la preuve :

| Propriete | Enonce | Consequence |
|-----------|--------|-------------|
| **Multiplicativite** | `N(xy) = N(x) N(y)` | se transporte aux ideaux : `N(𝔞𝔟) = N(𝔞) N(𝔟)`, `N(𝔞) = card(O_K/𝔞)` |
| **Ecart entier** | `x ∈ O_K \ {0}  =>  \|N(x)\| ≥ 1` | les conjugues de `x` ne peuvent pas etre **tous** petits |

L'ecart entier est le moteur geometrique. Si toutes les coordonnees `|σ_r(x)|` etaient `< ε ≤ 1`, leur produit serait `< 1`, impossible pour un entier non nul. Donc deux points distincts d'un reseau arithmetique sont separes dans au moins une coordonnee.

Variantes :

| Variante | Contrat | Forme |
|----------|---------|-------|
| norme relative | `K -> L` | `N_{K/L}(u) = u · c(u)` pour `K = L(i)` |
| norme d'ideal | `I(K) -> Q_+` | `N(𝔞) = card(O_K/𝔞)` pour `𝔞` entier |

## Etages

### Taille
[etages/taille.md](../../etages/taille.md)

- `x = β = 𝒟·(x − x')`, difference de deux points → `|N(β)| ≥ 1` → `X` est `𝒟⁻¹`-separe

### Corps de base, formule de tour
[etages/corps-de-base.md](../../etages/corps-de-base.md) | [Jauger](../jauger/formule-de-tour.md)

- norme d'ideal `N_{F/Q}(d_{M/F})` → vaut 1 exactement quand `M/F` est non ramifiee aux places finies

### Nombre de classes
[etages/nombre-classes.md](../../etages/nombre-classes.md)

- norme d'ideal `N(𝔞) ≤ X` → compter les ideaux de petite norme (`d_n(m)` ideaux de norme `m`)

### Norme un
[etages/norme-un.md](../../etages/norme-un.md)

- norme relative `N_{K/L}(u) = u · c(u) = 1` → elements de module 1

---

[<- Sens](../README.md) | [Jauger ->](../jauger/)
