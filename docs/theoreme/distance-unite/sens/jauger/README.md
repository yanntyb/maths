# Jauger

> [Retour aux sens](../README.md) | [Distance unite](../../README.md)

`rd(F) = |D_F|^{1/[F:Q]}`

- **Sens** -- taille arithmetique d'un corps par unite de degre
- **Contrat** -- `corps de nombres -> R_+`
- **Ports** -- `F` (entree), `R_+` (sortie)
- **Origine** -- derive : discriminant normalise par le degre ([formule de tour](formule-de-tour.md)) ; sortie convertie en nombre de classes par la [borne de Minkowski](borne-minkowski.md)

## Comment ca marche

Le discriminant `D_F` mesure la complexite arithmetique de `F` : quels premiers ramifient, et combien. Il croit en general exponentiellement avec le degre. Prendre la racine `[F:Q]`-ieme donne une quantite comparable entre corps de degres differents. C'est le meme geste que [Comparer](../../../../sens/comparer/), qui normalise un produit scalaire par les normes.

```mermaid
graph LR
    F["F : corps"]:::indigo --> JAU["Jauger"]
    JAU --> rd["rd(F) : R_+"]:::green

    classDef green fill:#10B981,color:#fff
    classDef indigo fill:#6366F1,color:#fff
```

Ce que deviennent `rd` et le degre sous les operations de la preuve :

| Operation | Effet sur `rd` | Effet sur le degre |
|-----------|----------------|--------------------|
| extension partout non ramifiee `M/F` | conserve : `rd(M) = rd(F)` | multiplie par `[M:F]` |
| adjoindre `i` | au plus double : `rd(F(i)) ≤ 2 rd(F)` | double |
| corps cubique coupe par `χ_1⋯χ_ℓ` | `rd(F) = D^{2/3}` | 3 |

La tour pro-3 exploite la premiere ligne : degre `→ ∞`, `rd` constant. La [borne de Minkowski](borne-minkowski.md) convertit ensuite `rd` borne en nombre de classes au plus exponentiel :

```
h(K) ≤ max{2, rd(K)}^{C_class · [K:Q]}
```

## Etages

### Corps de base
[etages/corps-de-base.md](../../etages/corps-de-base.md)

- `F` coupe par `χ_1⋯χ_ℓ` → `log rd(F) = (2/3) Σ log r_i = O(ℓ log ℓ)`
- `|D_M| = |D_F|^{[M:F]}` est exactement `rd(M) = rd(F)` → `M/F` non ramifiee aux places finies ; `M` et `F` totalement reels reglent les places infinies

### Tour pro-3
[etages/tour-pro-3.md](../../etages/tour-pro-3.md)

- `F_j/F` non ramifiee → `rd(F_j) = rd(F)` a chaque couche

### Nombre de classes
[etages/nombre-classes.md](../../etages/nombre-classes.md)

- `K_j = F_j(i)` → `rd(K_j) ≤ 2 rd(F)` → `h(K_j) ≤ H_ℓ^{f_j}`

---

[<- Descendre](../descendre/) | [Plonger ->](../plonger/)
