import Mathlib
import Derivabilite.Cadre

/-!
# Câblage groupes : test de dérivabilité axiome par axiome

Énoncé : Q(x, y) = x² + y². Rotations : matrices [[c, −s], [s, c]] avec c² + s² = 1 ;
cette condition est la structure euclidienne elle-même (G2 contient déjà le cercle unité).
L'invariance par SO(2) (`inv`) entraîne celle par le quart de tour (`c4`).

Deux énoncés, selon la lecture de A1 :
* `homogene` : Q quelconque, A1 = homogénéité Q(λv) = λ²Q(v). Le quart de tour ne suffit
  pas : `inv` est essentiel même en gardant `c4` ;
* `polynomial` : Q = αx² + βxy + γy², A1 renforcé fixé par le modèle. Le quart de tour
  suffit : `inv` est superflu.
-/

namespace Groupes
open Derivabilite

def cablage : Cablage where
  id := "groupes"
  titre := "Groupes de Lie — SO(2) invariant"
  espace := "ℝ² + SO(2)"
  notes := [
    ⟨"G1", .structurel, .horsPreuve, "lois de groupe : seule compte l'invariance, la preuve ne compose pas de rotations", none⟩,
    ⟨"G3", .structurel, .horsPreuve, "dérivation en l'identité : la preuve n'utilise pas d'équation différentielle", none⟩,
    ⟨"N1", .numerique, .horsPreuve, "équations différentielles : remplacées par la transitivité des rotations", none⟩,
    ⟨"N2", .numerique, .horsPreuve, "espace des solutions : non utilisé", none⟩,
    ⟨"N4", .numerique, .etape, "unicité à scalaire près : c'est la conclusion, obtenue par calcul", none⟩]

/-- Rotation de matrice [[c, −s], [s, c]]. -/
def rot (c s : ℝ) (v : ℝ × ℝ) : ℝ × ℝ := (c * v.1 - s * v.2, s * v.1 + c * v.2)

/-! ## Énoncé `homogene` -/

structure ModeleH : Type 1 where
  Q : ℝ × ℝ → ℝ

def axiomesH : List (Axiome ModeleH) := [
  ⟨"inv", "G2", .structurel, "invariance par SO(2)",
    fun m => ∀ c s v, c ^ 2 + s ^ 2 = 1 → m.Q (rot c s v) = m.Q v⟩,
  ⟨"c4", "G2", .structurel, "invariance par le quart de tour (conséquence de inv)",
    fun m => ∀ v, m.Q (rot 0 1 v) = m.Q v⟩,
  ⟨"homog", "A1", .structurel, "homogénéité Q(λv) = λ²Q(v)",
    fun m => ∀ (l : ℝ) (v : ℝ × ℝ), m.Q (l • v) = l ^ 2 * m.Q v⟩,
  ⟨"norm", "N3", .numerique, "normalisation Q(1, 0) = 1", fun m => m.Q (1, 0) = 1⟩]

def homogene : Enonce where
  cablage := "groupes"
  id := "homogene"
  sens := "la seule forme homogène de degré 2, invariante et normalisée, est x² + y²"
  contrat := "R² → R"
  Modele := ModeleH
  axiomes := axiomesH
  conclusion := fun m => ∀ x y, m.Q (x, y) = x ^ 2 + y ^ 2

/-- Preuve par transitivité des rotations sur le cercle : (x, y) = r · rot(x/r, y/r)(1, 0). -/
theorem lemme_homogene (Q : ℝ × ℝ → ℝ) (homog : ∀ (l : ℝ) (v : ℝ × ℝ), Q (l • v) = l ^ 2 * Q v)
    (inv : ∀ c s v, c ^ 2 + s ^ 2 = 1 → Q (rot c s v) = Q v) (norm : Q (1, 0) = 1) (x y : ℝ) :
    Q (x, y) = x ^ 2 + y ^ 2 := by
  by_cases h : x ^ 2 + y ^ 2 = 0
  · have hx : x = 0 := by nlinarith [sq_nonneg x, sq_nonneg y]
    have hy : y = 0 := by nlinarith [sq_nonneg x, sq_nonneg y]
    subst hx hy
    have h0 : Q 0 = 0 := by simpa using homog 0 (1, 0)
    show Q 0 = _
    rw [h0]; norm_num
  · have hpos : 0 < x ^ 2 + y ^ 2 := lt_of_le_of_ne (by positivity) (Ne.symm h)
    set r := √(x ^ 2 + y ^ 2) with hr
    have r0 : r ≠ 0 := (Real.sqrt_pos.mpr hpos).ne'
    have r2 : r ^ 2 = x ^ 2 + y ^ 2 := Real.sq_sqrt hpos.le
    have hcs : (x / r) ^ 2 + (y / r) ^ 2 = 1 := by
      rw [div_pow, div_pow, ← add_div, ← r2, div_self (pow_ne_zero 2 r0)]
    have hv : ((x, y) : ℝ × ℝ) = r • rot (x / r) (y / r) (1, 0) := by
      ext <;> simp [rot] <;> field_simp
    rw [hv, homog, inv _ _ _ hcs, norm, r2]; ring

theorem homogene_sans_c4 : Superflu homogene ["c4"] := by
  intro m h
  deplier [homogene, axiomesH] at h ⊢
  obtain ⟨inv, homog, norm⟩ := h
  exact lemme_homogene m.Q homog inv norm

/-- Avec A1 réduit à l'homogénéité, C₄ ne suffit pas : Q = (x⁴ + y⁴)/(x² + y²). -/
noncomputable def Qc4 (v : ℝ × ℝ) : ℝ := (v.1 ^ 4 + v.2 ^ 4) / (v.1 ^ 2 + v.2 ^ 2)

theorem homogene_sans_inv : Essentiel homogene ["inv"] := by
  refine ⟨⟨Qc4⟩, ?_, ?_⟩
  · deplier [homogene, axiomesH]
    refine ⟨fun v => ?_, fun l v => ?_, by norm_num [Qc4]⟩
    · simp only [Qc4, rot]; ring_nf
    · simp only [Qc4, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]
      rcases eq_or_ne l 0 with rfl | hl
      · simp
      rw [show (l * v.1) ^ 4 + (l * v.2) ^ 4 = l ^ 2 * (l ^ 2 * (v.1 ^ 4 + v.2 ^ 4)) by ring,
        show (l * v.1) ^ 2 + (l * v.2) ^ 2 = l ^ 2 * (v.1 ^ 2 + v.2 ^ 2) by ring,
        mul_div_mul_left _ _ (pow_ne_zero 2 hl), mul_div_assoc]
  · simp only [homogene, not_forall]; exact ⟨1, 1, by norm_num [Qc4]⟩

/-- Invariance de x² + y² par une rotation. -/
theorem rot_norme (c s : ℝ) (v : ℝ × ℝ) (hcs : c ^ 2 + s ^ 2 = 1) :
    (rot c s v).1 ^ 2 + (rot c s v).2 ^ 2 = v.1 ^ 2 + v.2 ^ 2 := by
  simp only [rot]; linear_combination (v.1 ^ 2 + v.2 ^ 2) * hcs

/-- Sans A1 : Q = (x² + y²)². -/
theorem homogene_sans_homog : Essentiel homogene ["homog"] := by
  refine ⟨⟨fun v => (v.1 ^ 2 + v.2 ^ 2) ^ 2⟩, ?_, ?_⟩
  · deplier [homogene, axiomesH]
    refine ⟨fun c s v hcs => ?_, fun v => ?_, by norm_num⟩
    · rw [rot_norme c s v hcs]
    · rw [rot_norme 0 1 v (by norm_num)]
  · simp only [homogene, not_forall]; exact ⟨2, 0, by norm_num⟩

/-- Sans N3 : Q = 2(x² + y²). -/
theorem homogene_sans_norm : Essentiel homogene ["norm"] := by
  refine ⟨⟨fun v => 2 * (v.1 ^ 2 + v.2 ^ 2)⟩, ?_, ?_⟩
  · deplier [homogene, axiomesH]
    refine ⟨fun c s v hcs => ?_, fun v => ?_, fun l v => ?_⟩
    · rw [rot_norme c s v hcs]
    · rw [rot_norme 0 1 v (by norm_num)]
    · simp only [Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
  · simp only [homogene, not_forall]; exact ⟨1, 0, by norm_num⟩

/-! ## Énoncé `polynomial` -/

structure ModeleP : Type 1 where
  α : ℝ
  β : ℝ
  γ : ℝ

/-- La forme quadratique de coefficients (α, β, γ). -/
def ModeleP.Q (m : ModeleP) (v : ℝ × ℝ) : ℝ := m.α * v.1 ^ 2 + m.β * v.1 * v.2 + m.γ * v.2 ^ 2

def axiomesP : List (Axiome ModeleP) := [
  ⟨"inv", "G2", .structurel, "invariance par SO(2)",
    fun m => ∀ c s v, c ^ 2 + s ^ 2 = 1 → m.Q (rot c s v) = m.Q v⟩,
  ⟨"c4", "G2", .structurel, "invariance par le quart de tour (conséquence de inv)",
    fun m => ∀ v, m.Q (rot 0 1 v) = m.Q v⟩,
  ⟨"norm", "N3", .numerique, "normalisation Q(1, 0) = 1", fun m => m.Q (1, 0) = 1⟩]

def polynomial : Enonce where
  cablage := "groupes"
  id := "polynomial"
  sens := "la seule forme quadratique polynomiale invariante et normalisée est x² + y² (A1 fixé par le modèle)"
  contrat := "R² → R"
  Modele := ModeleP
  axiomes := axiomesP
  conclusion := fun m => ∀ x y, m.Q (x, y) = x ^ 2 + y ^ 2

/-- Le quart de tour suffit : il force β = 0 et γ = α. -/
theorem polynomial_sans_inv : Superflu polynomial ["inv"] := by
  intro m h
  deplier [polynomial, axiomesP] at h ⊢
  obtain ⟨c4, norm⟩ := h
  have h1 := c4 (1, 0)
  have h2 := c4 (1, 1)
  simp only [ModeleP.Q, rot] at h1 h2 norm ⊢
  intro x y
  have hα : m.α = 1 := by linarith
  have hγ : m.γ = 1 := by nlinarith
  have hβ : m.β = 0 := by nlinarith
  rw [hα, hβ, hγ]; ring

theorem polynomial_sans_c4 : Superflu polynomial ["c4"] := by
  intro m h
  deplier [polynomial, axiomesP] at h ⊢
  obtain ⟨inv, norm⟩ := h
  have h1 := inv 0 1 (1, 0) (by norm_num)
  have h2 := inv 0 1 (1, 1) (by norm_num)
  simp only [ModeleP.Q, rot] at h1 h2 norm ⊢
  intro x y
  have hα : m.α = 1 := by linarith
  have hγ : m.γ = 1 := by nlinarith
  have hβ : m.β = 0 := by nlinarith
  rw [hα, hβ, hγ]; ring

/-- Sans invariance du tout : Q = x². -/
theorem polynomial_sans_inv_c4 : Essentiel polynomial ["inv", "c4"] := by
  refine ⟨⟨1, 0, 0⟩, ?_, ?_⟩
  · deplier [polynomial, axiomesP]
    norm_num [ModeleP.Q]
  · simp only [polynomial, not_forall]; exact ⟨0, 1, by norm_num [ModeleP.Q]⟩

/-- Sans N3 : Q = 2(x² + y²). -/
theorem polynomial_sans_norm : Essentiel polynomial ["norm"] := by
  refine ⟨⟨2, 0, 2⟩, ?_, ?_⟩
  · deplier [polynomial, axiomesP]
    refine ⟨fun c s v hcs => ?_, fun v => ?_⟩
    · simp only [ModeleP.Q]
      have := rot_norme c s v hcs
      linear_combination 2 * this
    · simp only [ModeleP.Q, rot]; ring
  · simp only [polynomial, not_forall]; exact ⟨1, 0, by norm_num [ModeleP.Q]⟩

/-! ## Témoins de cohérence -/

/-- Q = x² + y² satisfait les quatre axiomes de `homogene`. -/
theorem homogene_coherent : Coherent homogene := by
  refine ⟨⟨fun v => v.1 ^ 2 + v.2 ^ 2⟩, ?_⟩
  deplier [homogene, axiomesH]
  refine ⟨fun c s v hcs => ?_, fun v => ?_, fun l v => ?_, by norm_num⟩
  · rw [rot_norme c s v hcs]
  · rw [rot_norme 0 1 v (by norm_num)]
  · simp only [Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring

/-- (α, β, γ) = (1, 0, 1) satisfait les trois axiomes de `polynomial`. -/
theorem polynomial_coherent : Coherent polynomial := by
  refine ⟨⟨1, 0, 1⟩, ?_⟩
  deplier [polynomial, axiomesP]
  refine ⟨fun c s v hcs => ?_, fun v => ?_, by norm_num [ModeleP.Q]⟩
  · simp only [ModeleP.Q]; linear_combination rot_norme c s v hcs
  · simp only [ModeleP.Q, rot]; ring

end Groupes
