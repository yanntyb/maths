import Mathlib

/-!
# Les cinq câblages de Pythagore dans mathlib

Un théorème par câblage de `docs/theoreme/pythagore/README.md`, prouvé avec ce que
mathlib fournit. La preuve suit mathlib, pas forcément l'idée du câblage : voir
`Derivabilite/Deps.lean` pour ce que chaque preuve utilise réellement.
-/

open Real

namespace Cablages

/-- 0. Scalaire : orthogonalité dans un espace préhilbertien réel. -/
theorem scalaire {F : Type*} [NormedAddCommGroup F] [InnerProductSpace ℝ F] {x y : F}
    (h : inner ℝ x y = 0) : ‖x + y‖ ^ 2 = ‖x‖ ^ 2 + ‖y‖ ^ 2 := by
  simpa [sq] using norm_add_sq_eq_norm_sq_add_norm_sq_real h

/-- 1. Complexe : module de a + ib. -/
theorem complexe (a b : ℝ) : ‖(⟨a, b⟩ : ℂ)‖ ^ 2 = a ^ 2 + b ^ 2 := by
  rw [Complex.sq_norm, Complex.normSq_apply]; ring

/-- 2. Trigonométrique : cos² + sin² = 1, côtés c cos θ et c sin θ. -/
theorem trigonometrique (c θ : ℝ) : (c * cos θ) ^ 2 + (c * sin θ) ^ 2 = c ^ 2 := by
  linear_combination c ^ 2 * cos_sq_add_sin_sq θ

/-- 3. Cosinus : loi des cosinus, cas θ = π/2. -/
theorem cosinus {V : Type*} [NormedAddCommGroup V] [InnerProductSpace ℝ V] (x y : V)
    (h : InnerProductGeometry.angle x y = π / 2) : ‖x - y‖ ^ 2 = ‖x‖ ^ 2 + ‖y‖ ^ 2 := by
  have := InnerProductGeometry.norm_sub_sq_eq_norm_sq_add_norm_sq_sub_two_mul_norm_mul_norm_mul_cos_angle x y
  rw [h, cos_pi_div_two] at this
  linear_combination this

/-- 4. Groupes : une forme quadratique Q(x,y) = αx² + βxy + γy², invariante par la rotation
d'un quart de tour (x, y) ↦ (-y, x) et normalisée (α = 1), vaut x² + y².
Il suffit du sous-groupe C₄ ⊂ SO(2) engendré par cette rotation. -/
theorem groupes (α β γ : ℝ)
    (inv : ∀ x y : ℝ, α * x ^ 2 + β * x * y + γ * y ^ 2 = α * (-y) ^ 2 + β * (-y) * x + γ * x ^ 2)
    (norm1 : α = 1) (x y : ℝ) : α * x ^ 2 + β * x * y + γ * y ^ 2 = x ^ 2 + y ^ 2 := by
  have h1 := inv 1 0
  have h2 := inv 1 1
  have hγ : γ = 1 := by linarith
  have hβ : β = 0 := by linarith
  subst norm1 hγ hβ; ring

end Cablages
