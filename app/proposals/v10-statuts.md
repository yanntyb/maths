# Proposition V10 — Statuts de dérivabilité issus de Lean

> [Retour aux propositions](README.md) | [Spec](../../docs/superpowers/specs/2026-10-11-visualiseur-statuts-design.md) | [V10](../10_statuts/)

## Diagnostic de V9

V9 tourne sans erreur, mais n'est pas le visualiseur décrit au §3.3 de la note *Deux directions de simplicité* :

| Dimension | V9 |
|-----------|-----|
| **Sens** | « poids » des axiomes (taille ∝ contribution numérique), pas de statut de dérivabilité |
| **Contrat** | axiomes écrits à la main dans `cablages/*/axiomes.js`, divergents des docs et de Lean (trigonométrique pose le théorème lui-même en axiome A3) |
| **Câblage** | tout le panneau gauche dessiné en canvas : liste tronquée sous ~1 000 px de haut, « trois axiomatiques » écrit en dur, mise en page mobile inutilisable |

**Résumé** : ce que montre V9 n'est vérifié par rien.

## Vision V10

Lean devient la seule source. Chaque statut (superflu, essentiel) est un théorème de forme imposée, `Superflu E r` ou `Essentiel E r`, vérifié par le noyau. `lake exe statuts` exporte un JSON déterministe ; V10 le lit et affiche :

- la matrice énoncé × axiome de chaque câblage, en HTML ;
- pour chaque énoncé, son Sens et son Contrat, marqués « contrat commun » ou « contrat propre » ;
- pour chaque case, la preuve Lean ou le contre-modèle, avec sa source ;
- les codes README hors modèle, marqués « texte non vérifié » ;
- l'arbre et le cercle des axiomes, colorés par statut.

### Triple distinction

| Dimension | V10 |
|-----------|-----|
| **Sens** | ce que chaque axiome apporte vraiment : essentiel, superflu, non testé |
| **Contrat** | `data/statuts.json`, produit par Lean ; aucune donnée mathématique écrite à la main côté appli |
| **Câblage** | statuts-store → cablage-registry (fusion JSON + rendus) → matrice, panneau (DOM) et vues (canvas) |

## Hors périmètre

Blocs de sens, graphe de dépendances, L(axiome), étymologie, densité, reformulations, retrait d'axiome en direct : sous-projets suivants.
