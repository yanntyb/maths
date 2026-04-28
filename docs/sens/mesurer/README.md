# Mesurer

> [Retour aux sens](../README.md)

`phi(_)`

- **Sens** -- lire tout vecteur selon un instrument fixe
- **Contrat** -- `E -> R`
- **Ports** -- `v in E` en entree ; `R` en sortie
- **Origine** -- [currying](../../meta-objets/currying.md) de [observer](../observer/), entree `phi` fixee

## Comment ca marche

```mermaid
graph LR
    phi["phi : E*"]:::curry --> MES["Mesurer"]
    v["v : E"]:::blue --> MES
    MES --> r["R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

Fixer `phi` dans [observer](../observer/) produit une **forme lineaire** `E -> R` : un instrument de mesure qui lit tout vecteur selon une direction fixee.

```
curry(observer)(phi) = phi(_) : E -> R
```

| | Observer | Mesurer |
|---|---|---|
| **Contrat** | `E* x E -> R` | `E -> R` |
| **Entrees** | `phi : E*`, `v : E` | `v : E` |
| **Sortie** | `R` | `R` |

---

[← Lire](../lire/) | [Espaces →](../../vocabulaire/espaces.md)
