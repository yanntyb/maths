# Meta-sens

> [Retour aux sens](../sens/README.md) | [Architecture](../architecture.md) | [Meta-cablages](../meta-cablages/)

Les meta-sens ne calculent pas des **valeurs** -- ils calculent des proprietes **du circuit lui-meme**. Ils portent sur les conditions de possibilite du calcul, pas sur son resultat.

## Distinction avec les sens ordinaires

| | Sens ordinaire | Meta-sens |
|---|---|---|
| **Entree** | valeurs (`E`, `R`, `Omega`...) | encodage du circuit (`N`) |
| **Sortie** | valeur dans `R` | propriete du circuit |
| **Question** | "quelle valeur ?" | "jusqu'ou peut-on calculer ?" |

## Catalogue

| Meta-sens | Contrat | Ce qu'il determine |
|-----------|---------|-------------------|
| [Peser](peser.md) | `N x R -> [0,1]` | champ de probabilite de convergence |
| [Frontiere](frontiere.md) | `N -> R` | `sigma_c` -- ou s'arrete l'acces constructif |

## Cablages

Les cablages meta-sens assemblent des blocs pour realiser les meta-sens. Voir [peser/](peser/) et [frontiere/](frontiere/).

---

[<- Sens](../sens/README.md)
