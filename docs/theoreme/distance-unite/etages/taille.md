# Distance unite — etage taille (packing en norme sup)

> [Retour a Distance unite](../README.md) | Source : Section 2.2, Lemme 2.6, preuve du Theoreme 2.3, preuve du Theoreme 1.1, Remarque 3.9

## Le probleme

L'etage [fenetre](fenetre.md) donne beaucoup de distances unite **relativement au degre** `f`. Pour un enonce en `n = |P|`, il faut une borne exponentielle uniforme sur le nombre de points dans la fenetre : `n ≤ e^{Bf}`. C'est un argument de packing en norme sup. Ensuite on convertit `f` en `log n` et on conclut.

## La demarche

```
Donnees : X ⊂ B_R (etage 5),  P = π_1(X),  2 ν(P) ≥ e^{γ f/2} |P|

Separation :
  x ≠ x' dans X => x − x' = Φ(𝒟⁻¹β),  β ∈ O_K \ {0}
  ∏_{r=1}^{f} |σ_r(𝒟⁻¹β)| = 𝒟^{−f} |N_{K/Q}(β)|^{1/2} ≥ 𝒟^{−f}    [N_{K/Q}(β) entier non nul]
  => au moins une coordonnee : |σ_r(x − x')| ≥ 𝒟⁻¹
  => X est 𝒟⁻¹-separe en norme sup

Packing :
  polydisques ouverts de rayon 𝒟⁻¹/2 centres en X : disjoints, contenus dans B_{R + 𝒟⁻¹/2}
  |X| · (π (𝒟⁻¹/2)²)^f ≤ (π (R + 𝒟⁻¹/2)²)^f        [comparaison de volumes]
  => n = |P| = |X| ≤ (1 + 2R𝒟)^{2f} ≤ (4R𝒟)^{2f} = e^{B f},   B := 2 log(4R𝒟)
                                                     [2R𝒟 ≥ 1 car R > 1/2, 𝒟 ≥ 1]

n → ∞ :
  E_a ≤ n²                                          [une paire ordonnee = deux extremites]
  E_a ≥ e^{γ f/2} n                                 [etage 5]
  => n ≥ e^{γ f/2} → ∞ quand f → ∞

Conversion f -> n :
  n ≤ e^{B f} => f ≥ log n / B
  ν(P) ≥ ½ n e^{γ f/2} ≥ ½ n^{1 + γ/(2B)}

Exposant (Theoreme 2.3) :
  δ := γ / (4B) > 0
  n_j → ∞ => ½ n_j^{γ/(2B)} ≥ n_j^{δ} pour j grand    [n_j^δ ≥ 2]
  => ν(P_j) ≥ n_j^{1+δ}

Conclusion (Theoreme 1.1) :
  ν(n_j) ≥ ν(P_j) ≥ n_j^{1+δ}  pour une infinite de n_j
  pour tout C > 0 :  C / log log n_j < δ  pour j grand
  => ν(n_j) > n_j^{1 + C/log log n_j} : la conjecture d'Erdős est refutee
```

## Circuit

```mermaid
graph LR
    X["X ⊂ B_R<br/>2ν(P) ≥ e^γf/2 card P"]:::blue --> NORM["Norme algebrique<br/>entier non nul"]:::curry
    NORM --> sep["X 𝒟⁻¹-separe<br/>en norme sup"]:::red
    sep --> PACK["Comparer volumes<br/>de polydisques"]:::curry
    PACK --> nB["n ≤ e^Bf<br/>B = 2 log(4R𝒟)"]:::red

    nB --> CONV["f ≥ log n / B"]:::curry
    X --> CONV
    CONV --> expo["ν(P) ≥ ½ n^(1+γ/2B)"]:::red
    expo --> ABS["Absorber ½<br/>n → ∞"]:::curry
    ABS --> out["ν(P_j) ≥ n_j^(1+δ)<br/>δ = γ/4B"]:::green

    out --> REF["C / log log n < δ"]:::curry
    REF --> conj["conjecture d'Erdős<br/>refutee"]:::green

    classDef blue fill:#3B82F6,color:#fff
    classDef green fill:#10B981,color:#fff
    classDef red fill:#EF4444,color:#fff
    classDef curry fill:#F59E0B,color:#fff
```

## Role de chaque bloc

| Etape | Bloc | Contrat | Sens dans ce contexte |
|-------|------|---------|----------------------|
| 1 | Norme algebrique | `O_K \ {0} -> Z \ {0}` | le produit des coordonnees d'une difference est `≥ 𝒟^{−f}` |
| 2 | Separation | `ensemble -> R_+` | deux points de `X` different d'au moins `𝒟⁻¹` dans une coordonnee |
| 3 | Packing | `(separation, fenetre) -> N` | `n ≤ (4R𝒟)^{2f} = e^{Bf}` |
| 4 | Conversion | `f -> log n` | `f ≥ log n / B` transforme `e^{γf/2}` en `n^{γ/2B}` |
| 5 | Absorption | `(½, n → ∞) -> δ` | `δ = γ/4B` mange le facteur `½` |
| 6 | Refutation | `δ -> verdict` | `C / log log n → 0` passe sous tout `δ > 0` |

## Axiomes mobilises

| Code | Role | Type |
|------|------|------|
| TA1 | la norme d'un entier algebrique non nul est un entier non nul | structurel |
| TA2 | produit des conjugues : `∏_r \|σ_r(x)\|² = \|N_{K/Q}(x)\|` (un plongement par paire conjuguee) | structurel |
| TA3 | volume d'un polydisque de rayon `ρ` dans `C^f` : `(πρ²)^f` | numerique |
| TA4 | packing : boules disjointes dans un domaine => somme des volumes `≤` volume du domaine | numerique |
| TA5 | `E_a ≤ n²` et `E_a ≥ e^{γf/2} n` => `n → ∞` | numerique |
| TA6 | `n^{γ/4B} ≥ 2` pour `n` grand : absorption du `½` | numerique |

## Triple distinction

| Dimension | Taille |
|-----------|--------|
| **Sens** | l'arithmetique interdit aux points du reseau d'etre trop proches, donc la fenetre n'en contient qu'un nombre exponentiel en `f` ; le gain `e^{γf/2}` devient une puissance de `n` |
| **Contrat** | `(X ⊂ B_R, 2ν(P) ≥ e^{γf/2}\|P\|) -> ν(P_j) ≥ n_j^{1+δ}, n_j → ∞` |
| **Cablage** | norme algebrique + separation + packing + conversion `f -> log n` + absorption du `½` |

## Blocs reutilises

| Bloc | Occurrences | Role |
|------|-------------|------|
| [Plonger](../sens/plonger/) | x1 (vient de [fenetre](fenetre.md)) | ecrire `x − x' = Φ(𝒟⁻¹β)` |
| [Descendre](../sens/descendre/) | x1 | `\|N(β)\| ≥ 1`, produit des coordonnees ([cas CM](../sens/descendre/produit-conjugues.md)) |
| [Ecart arithmetique](../vocabulaire/patterns.md#ecart-arithmetique) | x1 | Plonger + Descendre => separation `𝒟⁻¹` |
| [Tasser](../sens/tasser/) | x1 | separation `𝒟⁻¹` dans `B_R` => `n ≤ (4R𝒟)^{2f} = e^{Bf}` |
| [Competition d'exposants](../vocabulaire/patterns.md#competition-dexposants) | x1 | `e^{γf/2}` contre `n ≤ e^{Bf}` fixe `δ` |
