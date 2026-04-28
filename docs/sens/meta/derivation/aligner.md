# Derivation — Aligner

> [Retour au sens](../../aligner/)

Aligner engendre deux sens derives par le meta-objet [Vecteur](../../../meta-objets/vecteur.md) :

- **Auto-application** → [Normer](../../normer/) : brancher `v` sur les deux ports donne `<v,v>`, puis `sqrt` → `||v||`
- **Quotient normalise** → [Comparer](../../comparer/) : `<v,w> / (||v|| * ||w||)` → `cos theta`

Ce ne sont pas des curryings (on ne fixe pas d'entree). Voir [la distinction](../../../meta-objets/vecteur.md#difference-avec-le-currying).
