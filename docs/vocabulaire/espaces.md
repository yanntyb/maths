# Espaces

> [Retour au vocabulaire](README.md)

```mermaid
graph LR
    E["E\nespace vectoriel"]:::blue
    Es["E*\ndual de E"]:::violet
    R["R\nscalaires"]:::green
    O["Omega\ndomaine geometrique"]:::red

    E x--x|incompatible| Es
    E x--x|incompatible| O
    E x--x|incompatible| R

    classDef blue fill:#3B82F6,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
```

| Espace  | Couleur          | Role                |
|---------|------------------|---------------------|
| `E`     | bleu `#3B82F6`   | espace vectoriel    |
| `E*`    | violet `#8B5CF6` | dual de E           |
| `R`     | vert `#10B981`   | scalaires           |
| `Omega` | rouge `#EF4444`  | domaine geometrique |

Deux ports se connectent seulement si leurs espaces sont identiques. L'incompatibilite est un **refus de typage** en [Agda](../architecture.md#backend--agda), pas un check runtime.

---

[← Concentrer](../sens/concentrer/)
