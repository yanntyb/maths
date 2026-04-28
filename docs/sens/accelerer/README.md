# Accelerer

> [Retour aux sens](../README.md)

`1/2 * a * t^2`

- **Sens** -- avancement quadratique d'un objet sous acceleration constante
- **Contrat** -- `R x R -> R` (asymetrique : `a` est l'acceleration, `t` est le temps)
- **Ports** -- `a in R`, `t in R` (entrees), `R` (sortie)

## Comment ca marche

```mermaid
graph LR
    a["a : R"]:::blue --> ACC["Accelerer"]
    t["t : R"]:::blue --> ACC
    ACC --> r["1/2 * a * t² : R"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
```

## Cablages

### Triple ponderation
[accelerer/triple-ponderation.md](triple-ponderation.md)

- `a=acceleration, t=temps` → `1/2*a*t²`

### Rencontrer Accelere
[equilibrer/rencontrer-accelere.md](../equilibrer/rencontrer-accelere.md)

- acceleration dans les trajectoires

### Viser
[equilibrer/viser.md](../equilibrer/viser.md)

- acceleration balistique

---

[<- Normer](../normer/) | [Comparer ->](../comparer/)
