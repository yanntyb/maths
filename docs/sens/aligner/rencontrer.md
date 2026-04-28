# Rencontrer

> [Retour au sens Aligner](README.md)

## Le probleme

Deux spheres de rayon `r`, positions initiales `x_1(0)` et `x_2(0)`, vitesses constantes `v_1` et `v_2`. Trajectoires lineaires :

```
x_i(t) = x_i(0) + t * v_i
```

Questions :
1. Se rapprochent-elles ?
2. A quel instant sont-elles le plus proches ?
3. Y a-t-il collision ?

## Phases du circuit

| Phase | Bloc | Contrat | Sens |
|-------|------|---------|------|
| 1 - Trajectoires | [Ponderer](../ponderer/) x2 | `R x R -> R` | `t * v_i` avancement |
| 2 - Separation | Soustraction + [Normer](../normer/) | `E -> R` | `d(t) = \|\|delta(t)\|\|` |
| 3 - Diagnostic | [Comparer](../comparer/) | `E x E -> R` | approche ou eloignement |
| 4 - Taux | [Aligner](README.md) | `E x E -> R` | `<v_rel, delta>` signe |
| 5 - Instant critique | [Aligner](README.md) + [Ponderer](../ponderer/) | | `t* = -<v_rel, delta(0)> / <v_rel, v_rel>` |
| 6 - Collision | [Normer](../normer/) + test | | `\|\|delta(t*)\|\| <= 2r` |

## Detail des phases

### Phase 1 — Trajectoires

Chaque position evolue lineairement. [Ponderer](../ponderer/) fait le produit `t * v_i`, puis on ajoute a la position initiale.

### Phase 2 — Separation

Le vecteur de separation `delta(t) = x_2(t) - x_1(t)` est lui-meme lineaire :

```
delta(t) = delta(0) + t * v_rel    ou    v_rel = v_2 - v_1
```

[Normer](../normer/) donne la distance `d(t) = ||delta(t)||`.

### Phase 3 — Diagnostic

[Comparer](../comparer/) entre `v_rel` et `delta(0)` :
- `cos theta < 0` → les spheres se rapprochent (la vitesse relative va vers la separation)
- `cos theta > 0` → elles s'eloignent
- `cos theta = 0` → mouvement perpendiculaire a la separation

### Phase 4 — Taux

[Aligner](README.md) donne le produit scalaire `<v_rel, delta(0)>`. Son signe confirme le diagnostic. Sa valeur donne le taux de rapprochement.

### Phase 5 — Instant critique

L'instant ou la distance est minimale :

```
t* = -<v_rel, delta(0)> / <v_rel, v_rel>
```

Cet instant est le quotient de deux produits scalaires : un [Aligner](README.md) au numerateur, un autre au denominateur (auto-application de `v_rel`, c'est-a-dire [Normer](../normer/) au carre). [Ponderer](../ponderer/) fait la division.

### Phase 6 — Collision

On injecte `t*` dans `delta(t)`, puis [Normer](../normer/) donne la distance minimale. Si `||delta(t*)|| <= 2r`, collision.

## Diagramme

```mermaid
graph TD
    subgraph Entrees
        x1["x_1(0)"]:::blue
        x2["x_2(0)"]:::blue
        v1["v_1"]:::blue
        v2["v_2"]:::blue
        r["r"]:::green
    end

    v2 --> SUB_V["-"]
    v1 --> SUB_V
    SUB_V --> vrel["v_rel = v_2 - v_1"]:::blue

    x2 --> SUB_X["-"]
    x1 --> SUB_X
    SUB_X --> delta0["delta(0) = x_2(0) - x_1(0)"]:::blue

    vrel --> CMP["Comparer\ncos theta"]:::violet
    delta0 --> CMP
    CMP --> diag["approche / eloignement"]:::green

    vrel --> AL1["Aligner\n< v_rel, delta(0) >"]:::blue
    delta0 --> AL1

    vrel --> AL2["Aligner\n< v_rel, v_rel >"]:::blue

    AL1 --> NEG["neg"]:::curry
    NEG --> DIV["Ponderer\n/"]:::curry
    AL2 --> DIV
    DIV --> tstar["t*"]:::green

    tstar --> POND["Ponderer\nt* * v_rel"]:::curry
    vrel --> POND
    POND --> ADD["+"]
    delta0 --> ADD
    ADD --> delta_t["delta(t*)"]:::blue

    delta_t --> NORM["Normer\n||delta(t*)||"]:::violet
    NORM --> dmin["d_min"]:::green

    dmin --> TEST["<= 2r ?"]:::curry
    r --> DEUX["2r"]:::green
    DEUX --> TEST
    TEST --> result["collision : oui / non"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
```

## Exemple concret

Deux spheres de rayon `r = 1`, en 3D :

```
Sphere A : x_1(0) = (0, 0, 0),   v_1 = (1, 2, 0)
Sphere B : x_2(0) = (10, 0, 0),  v_2 = (-1, 1, 0)
```

### Phase 2 — Separation et vitesse relative

```mermaid
graph LR
    v2["v_2 = (-1, 1, 0)"]:::blue --> SUB_V["-"]
    v1["v_1 = (1, 2, 0)"]:::blue --> SUB_V
    SUB_V --> vrel["v_rel = (-2, -1, 0)"]:::green

    x2["x_2(0) = (10, 0, 0)"]:::blue --> SUB_X["-"]
    x1["x_1(0) = (0, 0, 0)"]:::blue --> SUB_X
    SUB_X --> delta0["delta(0) = (10, 0, 0)"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
```

```
v_rel   = v_2 - v_1         = (-2, -1, 0)
delta(0) = x_2(0) - x_1(0)  = (10, 0, 0)
```

### Phase 3 — Diagnostic

```mermaid
graph LR
    vrel["v_rel = (-2, -1, 0)"]:::blue --> AL["Aligner\n(-2)*10 + (-1)*0 + 0*0"]:::blue
    delta0["delta(0) = (10, 0, 0)"]:::blue --> AL
    AL --> num["-20"]:::green

    vrel2["v_rel"]:::blue --> N1["Normer\nsqrt(4+1+0)"]:::violet
    delta02["delta(0)"]:::blue --> N2["Normer\nsqrt(100)"]:::violet
    N1 --> nv["sqrt(5)"]:::green
    N2 --> nd["10"]:::green

    nv --> MUL["*"]:::curry
    nd --> MUL
    MUL --> denom["22.36"]:::green

    num --> DIV["/"]:::curry
    denom --> DIV
    DIV --> cos["cos theta = -0.894"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

```
Comparer(v_rel, delta(0)) :

  Aligner(v_rel, delta(0)) = (-2)*10 + (-1)*0 + 0*0 = -20
  Normer(v_rel)   = sqrt(4 + 1 + 0)   = sqrt(5)
  Normer(delta(0)) = sqrt(100 + 0 + 0) = 10

  cos theta = -20 / (sqrt(5) * 10) = -20 / 22.36 ≈ -0.894
```

`cos theta < 0` → les spheres se rapprochent.

### Phase 5 — Instant critique

```mermaid
graph LR
    vrel["v_rel = (-2, -1, 0)"]:::blue --> AL1["Aligner\n< v_rel, delta(0) >"]:::blue
    delta0["delta(0) = (10, 0, 0)"]:::blue --> AL1
    AL1 --> num["-20"]:::green

    vrel2["v_rel"]:::blue --> AL2["Aligner\n< v_rel, v_rel >"]:::blue
    AL2 --> denom["5"]:::green

    num --> NEG["neg"]:::curry
    NEG --> num2["20"]:::green
    num2 --> DIV["Ponderer\n/"]:::curry
    denom --> DIV
    DIV --> tstar["t* = 4"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

```
Aligner(v_rel, delta(0)) = -20
Aligner(v_rel, v_rel)    = (-2)^2 + (-1)^2 + 0^2 = 5

t* = -(-20) / 5 = 4
```

Les spheres sont au plus proche a `t* = 4`.

### Phase 6 — Collision

```mermaid
graph LR
    tstar["t* = 4"]:::green --> POND["Ponderer\n4 * (-2,-1,0)"]:::curry
    vrel["v_rel = (-2, -1, 0)"]:::blue --> POND
    POND --> tvrel["(-8, -4, 0)"]:::green

    tvrel --> ADD["+"]
    delta0["delta(0) = (10, 0, 0)"]:::blue --> ADD
    ADD --> delta_t["delta(t*) = (2, -4, 0)"]:::blue

    delta_t --> NORM["Normer\nsqrt(4+16+0)"]:::violet
    NORM --> dmin["d_min = 4.47"]:::green

    r["r = 1"]:::green --> DEUX["* 2"]:::curry
    DEUX --> seuil["2r = 2"]:::green

    dmin --> TEST["4.47 > 2\npas de collision"]:::red
    seuil --> TEST

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef red fill:#EF4444,color:#fff
```

```
delta(t*) = delta(0) + t* * v_rel
          = (10, 0, 0) + 4 * (-2, -1, 0)
          = (10 - 8, 0 - 4, 0)
          = (2, -4, 0)

Normer(delta(t*)) = sqrt(4 + 16 + 0) = sqrt(20) ≈ 4.47

2r = 2

4.47 > 2 → pas de collision
```

### Variante 1 — Tir oblique (pas de collision)

Memes donnees, mais `v_2 = (-2, 0, 0)` (frontale) :

```mermaid
graph TD
    subgraph Entrees
        v1b["v_1 = (1, 2, 0)"]:::blue
        v2b["v_2 = (-2, 0, 0)"]:::blue
        delta0b["delta(0) = (10, 0, 0)"]:::blue
    end

    v2b --> SUB["-"] --> vrelb["v_rel = (-3, -2, 0)"]:::blue
    v1b --> SUB

    vrelb --> AL1b["Aligner\n(-3)*10 = -30"]:::blue
    delta0b --> AL1b
    AL1b --> NEGb["neg"]:::curry --> num30["30"]:::green

    vrelb --> AL2b["Aligner\n9+4 = 13"]:::blue
    AL2b --> denom13["13"]:::green

    num30 --> DIVb["/ "]:::curry
    denom13 --> DIVb
    DIVb --> tstarb["t* = 2.31"]:::green

    tstarb --> PONDb["Ponderer\n2.31 * (-3,-2,0)"]:::curry
    vrelb --> PONDb
    PONDb --> ADDb["+"]
    delta0b --> ADDb
    ADDb --> deltab["delta(t*) = (3.08, -4.62, 0)"]:::blue

    deltab --> NORMb["Normer\nsqrt(30.83)"]:::violet
    NORMb --> dminb["d_min = 5.55"]:::green

    dminb --> TESTb["5.55 > 2\npas de collision"]:::red

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef red fill:#EF4444,color:#fff
```

```
v_rel    = (-3, -2, 0)
delta(0) = (10, 0, 0)

Aligner(v_rel, delta(0)) = -30
Aligner(v_rel, v_rel)    = 9 + 4 = 13

t* = 30 / 13 ≈ 2.31

delta(t*) = (10, 0, 0) + 2.31 * (-3, -2, 0)
          = (10 - 6.92, -4.62, 0)
          = (3.08, -4.62, 0)

Normer(delta(t*)) = sqrt(9.49 + 21.34) = sqrt(30.83) ≈ 5.55

5.55 > 2 → toujours pas de collision
```

### Variante 2 — Collision frontale

Pour une vraie collision, il faut un tir plus direct. Avec `v_2 = (-2, 0, 0)` et `v_1 = (0, 0, 0)` (sphere A immobile) :

```mermaid
graph TD
    subgraph Entrees
        v1c["v_1 = (0, 0, 0)"]:::blue
        v2c["v_2 = (-2, 0, 0)"]:::blue
        delta0c["delta(0) = (10, 0, 0)"]:::blue
    end

    v2c --> SUBc["-"] --> vrelc["v_rel = (-2, 0, 0)"]:::blue
    v1c --> SUBc

    vrelc --> AL1c["Aligner\n(-2)*10 = -20"]:::blue
    delta0c --> AL1c
    AL1c --> NEGc["neg"]:::curry --> num20["20"]:::green

    vrelc --> AL2c["Aligner\n4"]:::blue
    AL2c --> denom4["4"]:::green

    num20 --> DIVc["/"]:::curry
    denom4 --> DIVc
    DIVc --> tstarc["t* = 5"]:::green

    tstarc --> PONDc["Ponderer\n5 * (-2,0,0)"]:::curry
    vrelc --> PONDc
    PONDc --> ADDc["+"]
    delta0c --> ADDc
    ADDc --> deltac["delta(t*) = (0, 0, 0)"]:::blue

    deltac --> NORMc["Normer\n0"]:::violet
    NORMc --> dminc["d_min = 0"]:::green

    dminc --> TESTc["0 <= 2\ncollision !"]:::done

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef violet fill:#8B5CF6,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef done fill:#10B981,color:#fff,stroke:#065F46,stroke-width:3px
```

```
v_rel    = (-2, 0, 0)
delta(0) = (10, 0, 0)

Aligner(v_rel, delta(0)) = -20
Aligner(v_rel, v_rel)    = 4

t* = 20 / 4 = 5

delta(t*) = (10, 0, 0) + 5 * (-2, 0, 0) = (0, 0, 0)

Normer(delta(t*)) = 0

0 <= 2 → collision a t* = 5 (frontale parfaite)
```

## Triple distinction

| Dimension | Rencontrer |
|-----------|------------|
| **Sens** | deux spheres se rencontrent-elles ? |
| **Contrat** | `(E x E x E x E x R) -> {oui, non}` (positions, vitesses, rayon → verdict) |
| **Cablage** | 6 phases : trajectoires, separation, diagnostic, taux, instant critique, collision |

## Extension

Pour le cas avec acceleration constante, voir [Rencontrer Accelere](../equilibrer/rencontrer-accelere.md). L'instant critique `t*` passe d'une division simple a une equation cubique.

## Objets reutilises

| Bloc | Occurrences | Role |
|------|-------------|------|
| [Ponderer](../ponderer/) | x4+ | `t * v_i`, division, `2r` |
| [Aligner](README.md) | x2 | `<v_rel, delta>`, `<v_rel, v_rel>` |
| [Normer](../normer/) | x2 | `\|\|delta(0)\|\|`, `\|\|delta(t*)\|\|` |
| [Comparer](../comparer/) | x1 | diagnostic approche/eloignement |
