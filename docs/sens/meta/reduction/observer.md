# Reduction de l'espace — Observer

> [Retour au sens](../../observer/)

Le produit de dualite est une **reduction** : il projette un vecteur `v in E` (plusieurs composantes) sur un scalaire `R` (une seule valeur). L'information perdue est controlee par `phi` : c'est `phi` qui decide quoi garder de `v`.

| | Avant | Apres |
|---|---|---|
| **Espace** | `E` (dim n) | `R` (dim 1) |
| **Information** | toutes les composantes de `v` | uniquement "combien `v` va dans la direction `phi`" |
| **Perdu** | les composantes de `v` orthogonales a `phi` |

Dans l'[exemple de la sphere](../../observer/projeter.md), `phi` reduit la normale `n(x) in E` a l'intensite `|<phi|n(x)>| in R` : de 3 composantes directionnelles a un seul scalaire de contribution.
