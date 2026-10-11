# Distance unite — grille d'Erdős (le meme circuit en dimension 1)

> [Retour a Distance unite](README.md) | Source : Section 1 du PDF (analogie), Erdős 1946

## Le probleme

Comprendre la construction classique d'Erdős, qui donne `ν(n) ≥ n^{1+c/log log n}`, puis la relire comme le circuit de la preuve avec `f = 1`. Le but est de voir **ou** elle plafonne, et donc ce que la tour de corps doit apporter.

## La demarche classique

```
Arithmetique de Z[i] :
  N(a + bi) = a² + b²                                [Descendre dans Q(i)]
  q ≡ 1 (mod 4)  =>  q = π · π̄,  π ∈ Z[i] premier   [q se decompose dans Q(i)]
  exemples : 5 = (2+i)(2−i),  13 = (3+2i)(3−2i)

Beaucoup de representations :
  N := q_1 ⋯ q_t,  premiers distincts ≡ 1 (mod 4)
  α_ε := ∏_{ε_b = 1} π_b · ∏_{ε_b = 0} π̄_b,   ε ∈ {0,1}^t
  N(α_ε) = N pour tout ε                              [2^t choix]
  r_2(N) := card{(a, b) ∈ Z² : a² + b² = N} = 4 · 2^t   [4 = unites ±1, ±i]

Grille :
  P_0 := {1, ..., k}²,  n = k² points
  P := P_0 / √N   (on divise toutes les coordonnees par √N)
  deux points de P_0 a distance √N  <->  deux points de P a distance 1
  si √N ≤ k/2 : chaque vecteur (a, b) avec a² + b² = N relie une proportion fixe des points
  => ν(P) ≥ c · n · r_2(N) = c · n · 2^t

Choix de t :
  prendre les t plus petits premiers ≡ 1 (mod 4) :  log N ≍ t log t
  contrainte √N ≤ k/2, soit N ≤ n/4  =>  t log t ≲ log n
  prendre t maximal : le premier suivant n'ajoute que O(log t) a log N
  =>  t log t ≍ log n  =>  t ≍ log n / log log n
  2^t = exp(t log 2) = n^{c / log log n}
  => ν(n) ≥ n^{1 + c/log log n}
```

## Relecture : le circuit de la preuve avec `f = 1`

| Etage | Preuve (`f → ∞`) | Grille (`f = 1`) |
|-------|------------------|------------------|
| corps | `K_j = F_j(i)`, `L_j` totalement reel de degre `f_j` | `K = Q(i)`, `L = Q`, `f = 1` |
| [norme un](etages/norme-un.md) | `m = tf` paires, pigeonhole sur `Cl(K)` | `m = t` paires `{π_b, π̄_b}`, `h(Q(i)) = 1` : pas de perte |
| translations | `u_ε = α_ε / c(α_ε)`, `\|U\| ≥ e^{γf}` | `u_ε = α_ε / ᾱ_ε = α_ε² / N`, `\|U\| = 2^t` |
| [fenetre](etages/fenetre.md) | reseau de `C^f`, polydisque, projection | reseau de `C`, disque, pas de projection |
| [taille](etages/taille.md) | `n ≤ e^{Bf}`, `B = 2 log(4R𝒟)` **fixe** | `n ≤ (4R𝒟)²`, `𝒟 = N` ou `N²` **croit avec t** |

Deux normalisations possibles. Sans torsion, `u_ε = α_ε²/N` a des poles d'ordre 1 : `U ⊂ N⁻¹Z[i]`, `𝒟 = N`. Avec la torsion par `A_η⁻¹` du PDF, `𝒟 = Q² = N²`. Dans les deux cas `B ≍ log N ≍ t log t`. La version classique divise par `√N` : c'est encore moins couteux, et le constat est le meme.

## Pourquoi ca plafonne

En dimension 1, le seul bouton pour avoir plus de translations est `t`, le nombre de premiers. Or `t` fait aussi grossir le denominateur `𝒟`, donc la taille de la fenetre.

| | Grille (`f = 1`) | Preuve (`f → ∞`) |
|---|---|---|
| **Bouton** | `t` | `f` |
| **Translations** | `2^t` | `e^{γf}` |
| **Denominateur** `𝒟 = Q²` | croit avec `t` | fixe (les memes `q_b` dans toute la tour) |
| **Exposant gagne** | `t log 2 / log n ≍ 1 / log log n → 0` | `γ / 2B`, fixe |
| **Resultat** | `n^{1 + c/log log n}` | `n^{1+δ}` |

Les translations et le denominateur sont **couples** par `t`. La preuve les **decouple** : `t` reste fixe (donc `𝒟` aussi), et c'est le degre `f` qui multiplie les translations. C'est une [competition d'exposants](vocabulaire/patterns.md#competition-dexposants) que la grille perd et que la tour gagne.

## Pourquoi pas une famille naive de degre croissant

Pour faire croitre `f`, on pourrait essayer des corps cyclotomiques `Q(ζ_m)⁺` avec `m → ∞`. Deux hypotheses du Theoreme 2.3, que le README regroupe dans la donnee admissible, echouent :

| Contrainte | Pourquoi elle echoue en cyclotomique |
|------------|--------------------------------------|
| les **memes** `q_b` totalement decomposes pour tout `m` | `q` est totalement decompose dans `Q(ζ_m)⁺` seulement si `q ≡ ±1 (mod m)` : impossible des que `m > q + 1` |
| `h(K) ≤ H^f` avec `H` fixe | le corps utile est `K = Q(ζ_m)⁺(i)`, egal a `Q(ζ_m)` si `4 \| m`. Son `rd` n'est pas borne, donc la [borne de Minkowski](sens/jauger/borne-minkowski.md) ne donne plus de `H` fixe. Et la contrainte echoue vraiment : le nombre de classes des corps cyclotomiques croit plus vite que toute exponentielle en le degre (deja `log h⁻(Q(ζ_p)) ~ (p/4) log p`) |

Toute la Section 3 du PDF existe pour satisfaire ces deux contraintes a la fois : une tour **non ramifiee** garde `rd` constant ([Jauger](sens/jauger/)), et le quotient par les Frobenius garde les `q_b` decomposes ([Signer](sens/signer/), [Seuil](meta-sens/seuil.md)).

## Circuit

```mermaid
graph LR
    qb["q_1..q_t ≡ 1 mod 4"]:::pink --> SIG["Signer<br/>q = π π̄"]:::curry
    SIG --> pairs["t paires<br/>π_b et π̄_b"]:::pink
    pairs --> CHOIX["Choisir un premier<br/>par paire"]:::curry
    CHOIX --> alpha["2^t elements α_ε<br/>norme N"]:::indigo
    alpha --> UNI["Unitariser<br/>α / ᾱ"]:::curry
    UNI --> U["2^t translations<br/>module 1"]:::indigo
    U --> GRID["Grille k × k<br/>echelle 1/√N"]:::curry
    GRID --> nu["ν ≥ c n 2^t"]:::red
    nu --> COUPLE["t ≍ log n / log log n<br/>car N ≤ n/4"]:::curry
    COUPLE --> out["ν(n) ≥ n^(1 + c/log log n)"]:::green

    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
    classDef indigo fill:#6366F1,color:#fff
    classDef pink fill:#EC4899,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens dans ce contexte |
|-------|------|---------|----------------------|
| 1 | Decomposition | `premier ≡ 1 mod 4 -> π π̄` | Frobenius trivial dans `Q(i)` |
| 2 | Choix | `{0,1}^t -> Z[i]` | `2^t` elements de meme norme `N` |
| 3 | Unitariser | `Z[i] \ {0} -> module 1` | translations unite apres mise a l'echelle |
| 4 | Grille | `(k, N) -> P ⊂ R²` | `n = k²` points, `ν ≥ c n 2^t` |
| 5 | Couplage | `n -> t` | `N ≤ n/4` force `t ≍ log n / log log n` |

## Axiomes mobilises

| Code | Role | Type |
|------|------|------|
| GE1 | `Z[i]` est principal : `h(Q(i)) = 1` | structurel |
| GE2 | `q ≡ 1 (mod 4)` => `q = π π̄` dans `Z[i]` | structurel |
| GE3 | `r_2(N) = 4 · 2^t` pour `N` produit de `t` premiers distincts `≡ 1 (mod 4)` | numerique |
| GE4 | produit des `t` premiers `≡ 1 (mod 4)` : `log N ≍ t log t` | numerique |

## Triple distinction

| Dimension | Grille d'Erdős |
|-----------|----------------|
| **Sens** | beaucoup de vecteurs entiers de meme longueur, issus des factorisations dans `Z[i]` ; limites par le couplage entre leur nombre et la taille de la grille |
| **Contrat** | `n -> P, ν(P) ≥ n^{1 + c/log log n}` |
| **Cablage** | Signer + choisir un premier par paire + Unitariser + grille + couplage `t ↔ n` |

## Blocs reutilises

| Bloc | Role |
|------|------|
| [Signer](sens/signer/) | `q ≡ 1 (mod 4)` <=> `q` decompose dans `Q(i)` |
| [Descendre](sens/descendre/) | `N(a + bi) = a² + b²` |
| [Unitariser](sens/unitariser/) | `α / ᾱ`, module 1 |
| [Pythagore complexe](../pythagore/cablages/complexe.md) | `\|z\|² = z · z̄` : la longueur d'un vecteur de `Z²` est la norme dans `Z[i]` |
