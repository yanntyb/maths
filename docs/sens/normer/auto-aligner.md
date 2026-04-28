# Normer -- cablage

> [Retour au sens Normer](README.md)

## Comment ca marche

On branche le meme vecteur `v` sur les deux ports de [Aligner](../aligner/). Le produit scalaire `<v,v>` mesure le carre de la taille. La racine carree donne la norme.

```mermaid
graph LR
    v["v : E\nvecteur"]:::blue --> fork["fork"]
    fork --> p1["port 1"]
    fork --> p2["port 2"]
    p1 --> AL["Aligner\n< . , . >"]:::blue
    p2 --> AL
    AL --> sqrt["sqrt"]:::curry
    sqrt --> r["||v|| : R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Blocs reutilises

| Bloc | Contrat | Role |
|------|---------|------|
| [Aligner](../aligner/) | `E x E -> R` | `<v,v>` par auto-application |
| sqrt | `R_+ -> R_+` | racine carree |

## Triple distinction

| Dimension | Normer |
|-----------|--------|
| **Sens** | taille d'un vecteur par auto-application |
| **Contrat** | `E -> R` |
| **Cablage** | fork -> Aligner -> sqrt |
