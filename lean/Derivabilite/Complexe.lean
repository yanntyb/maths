import Mathlib
import Derivabilite.Cadre

/-!
# Câblage complexe : test de dérivabilité axiome par axiome

Énoncé : N(a + ib) = a² + b² avec N(z) = z · z̄. Le modèle est un anneau commutatif `K`
muni de `i`, `a`, `b` et d'une conjugaison quelconque. L'axiome C1 (structure de corps)
se réduit à l'existence des inverses : la commutativité est fixée par le modèle (note
« hypothèse cachée »).
-/

namespace Complexe
open Derivabilite

def cablage : Cablage where
  id := "complexe"
  titre := "Nombres complexes — |z|² = a² + b²"
  espace := "C"
  notes := [
    ⟨"C1", .structurel, .cache, "commutativité : fixée par le modèle (anneau commutatif), non testée", none⟩,
    ⟨"N1", .structurel, .definition, "|z|² = z · z̄ : définition intégrée à l'énoncé", none⟩,
    ⟨"N2", .numerique, .etape, "identité remarquable : étape de calcul faite par la tactique", none⟩,
    ⟨"N3", .numerique, .etape, "simplification de i² : étape de calcul faite par la tactique", none⟩,
    ⟨"N4", .numerique, .horsPreuve, "interprétation géométrique du module : n'intervient pas dans la preuve", none⟩]

structure Modele : Type 1 where
  K : Type
  [anneau : CommRing K]
  i : K
  a : K
  b : K
  conj : K → K

attribute [instance] Modele.anneau

def axiomes : List (Axiome Modele) := [
  ⟨"inverses", "C1", .structurel, "inverses (structure de corps)",
    fun m => ∀ x : m.K, x ≠ 0 → ∃ y, x * y = 1⟩,
  ⟨"conj", "C2", .structurel, "conjugaison", fun m => m.conj (m.a + m.i * m.b) = m.a - m.i * m.b⟩,
  ⟨"isq", "C3", .structurel, "i² = −1", fun m => m.i ^ 2 = -1⟩]

def module : Enonce where
  cablage := "complexe"
  id := "module"
  sens := "le module carré de a + ib vaut a² + b²"
  contrat := "K × K → K"
  Modele := Modele
  axiomes := axiomes
  conclusion := fun m => (m.a + m.i * m.b) * m.conj (m.a + m.i * m.b) = m.a ^ 2 + m.b ^ 2

/-- Un anneau commutatif suffit : les inverses ne servent pas. -/
theorem sans_inverses : Superflu module ["inverses"] := by
  intro (m : Modele) h
  deplier [module, axiomes] at h ⊢
  obtain ⟨conj, isq⟩ := h
  rw [conj]; linear_combination (-m.b ^ 2) * isq

/-- Sans C2 : ℂ, i = I, a = 0, b = 1, conjugaison identité. -/
theorem sans_conj : Essentiel module ["conj"] := by
  refine ⟨⟨ℂ, Complex.I, 0, 1, id⟩, ?_, ?_⟩
  · deplier [module, axiomes]
    exact ⟨fun x hx => ⟨x⁻¹, mul_inv_cancel₀ hx⟩, Complex.I_sq⟩
  · simp only [module, id, zero_add, mul_one, Complex.I_mul_I]
    norm_num

/-- Sans C3 : ℝ, i = 0, a = b = 1, conjugaison identité. -/
theorem sans_isq : Essentiel module ["isq"] := by
  refine ⟨⟨ℝ, 0, 1, 1, id⟩, ?_, ?_⟩
  · deplier [module, axiomes]
    exact ⟨fun x hx => ⟨x⁻¹, mul_inv_cancel₀ hx⟩, by norm_num⟩
  · simp only [module, id]; norm_num

/-- Témoin de cohérence : ℂ, i = I, a = 1, b = 0, conjugaison identité. -/
theorem module_coherent : Coherent module := by
  refine ⟨⟨ℂ, Complex.I, 1, 0, id⟩, ?_⟩
  deplier [module, axiomes]
  exact ⟨fun x hx => ⟨x⁻¹, mul_inv_cancel₀ hx⟩, by simp, Complex.I_sq⟩

end Complexe
