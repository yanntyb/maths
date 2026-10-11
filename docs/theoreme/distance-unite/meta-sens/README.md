# Meta-sens — distance unite

> [Retour a Distance unite](../README.md) | [Sens locaux](../sens/) | [Meta-sens globaux](../../../meta-sens/README.md)

Un meta-sens ne calcule pas une **valeur**. Il decide une **condition de possibilite** : ici, l'existence d'une tour infinie.

## Distinction avec les sens locaux

| | Sens local | Meta-sens |
|---|---|---|
| **Entree** | valeurs (`K`, `V`, `R`...) | proprietes d'une structure (generateurs, relations) |
| **Sortie** | valeur | verdict |
| **Question** | « quelle valeur ? » | « la construction peut-elle continuer indefiniment ? » |

## Catalogue

| Meta-sens | Contrat | Ce qu'il determine |
|-----------|---------|-------------------|
| [Seuil](seuil.md) | `(d, r) -> {infini, indetermine}` | si le quotient `Ḡ` de la tour pro-3 reste infini |

## Cablages

| Cablage | Ce qu'il prepare |
|---------|------------------|
| [Quotient de Frattini](seuil/quotient-frattini.md) | `(d, r)` apres avoir impose les decompositions des `q_b` |

---

[<- Meta-objets](../meta-objets/) | [Vocabulaire ->](../vocabulaire/)
