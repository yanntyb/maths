import Mathlib
import Derivabilite.Cadre

/-!
# Câblage trigonométrique : test de dérivabilité axiome par axiome

Énoncé : C(θ)² + S(θ)² = 1 pour deux fonctions C, S : ℝ → ℝ. A1–A3 (séries, dérivation
terme à terme) ne servent qu'à établir A4, A5 et N3 : ils sont « en amont ». N2 (dérivée
nulle ⇒ constante) est un théorème de mathlib qui repose sur la complétude de ℝ.
-/

open Real

namespace Trigonometrique
open Derivabilite

def cablage : Cablage where
  id := "trigonometrique"
  titre := "Trigonométrie — cos²θ + sin²θ = 1"
  espace := "R"
  notes := [
    ⟨"A1", .structurel, .amont, "série de cos : sert seulement à établir A4, A5 et N3", none⟩,
    ⟨"A2", .structurel, .amont, "série de sin : sert seulement à établir A4, A5 et N3", none⟩,
    ⟨"A3", .structurel, .amont, "dérivation terme à terme : sert seulement à établir A4 et A5", none⟩,
    ⟨"N1", .numerique, .etape, "dérivation de cos² + sin² : étape de calcul", none⟩,
    ⟨"N2", .numerique, .cache, "dérivée nulle ⇒ constante : théorème de mathlib, repose sur la complétude de ℝ", none⟩,
    ⟨"N4", .numerique, .horsPreuve, "rapports trigonométriques dans le triangle : n'intervient pas dans la preuve", none⟩]

structure Modele : Type 1 where
  C : ℝ → ℝ
  S : ℝ → ℝ

def axiomes : List (Axiome Modele) := [
  ⟨"derivC", "A4", .structurel, "cos' = −sin", fun m => ∀ x, HasDerivAt m.C (-m.S x) x⟩,
  ⟨"derivS", "A5", .structurel, "sin' = cos", fun m => ∀ x, HasDerivAt m.S (m.C x) x⟩,
  ⟨"C0", "N3", .numerique, "cos 0 = 1", fun m => m.C 0 = 1⟩,
  ⟨"S0", "N3", .numerique, "sin 0 = 0", fun m => m.S 0 = 0⟩]

def identite : Enonce where
  cablage := "trigonometrique"
  id := "identite"
  sens := "cos² + sin² vaut 1 en tout point"
  contrat := "R → R"
  Modele := Modele
  axiomes := axiomes
  conclusion := fun m => ∀ θ, m.C θ ^ 2 + m.S θ ^ 2 = 1

/-- La preuve complète, utilisée pour vérifier que les quatre axiomes suffisent. -/
theorem complet (m : Modele) (h : identite.sans [] m) : identite.conclusion m := by
  deplier [identite, axiomes] at h ⊢
  obtain ⟨a4, a5, C0, S0⟩ := h
  intro θ
  have hf : ∀ x, HasDerivAt (fun t => m.C t ^ 2 + m.S t ^ 2) 0 x := by
    intro x
    convert ((a4 x).pow 2).add ((a5 x).pow 2) using 1
    norm_num; ring
  have hc : m.C θ ^ 2 + m.S θ ^ 2 = m.C 0 ^ 2 + m.S 0 ^ 2 :=
    is_const_of_deriv_eq_zero (f := fun t => m.C t ^ 2 + m.S t ^ 2)
      (fun x => (hf x).differentiableAt) (fun x => (hf x).deriv) θ 0
  rw [hc, C0, S0]; norm_num

/-- Sans A4 : C = 1, S = id. -/
theorem sans_derivC : Essentiel identite ["derivC"] := by
  refine ⟨⟨fun _ => 1, fun t => t⟩, ?_, ?_⟩
  · deplier [identite, axiomes]
    exact fun x => hasDerivAt_id' x
  · simp only [identite, not_forall]; exact ⟨1, by norm_num⟩

/-- Sans A5 : C(t) = 1 − t²/2, S = id. -/
theorem sans_derivS : Essentiel identite ["derivS"] := by
  refine ⟨⟨fun t => 1 - t ^ 2 / 2, fun t => t⟩, ?_, ?_⟩
  · deplier [identite, axiomes]
    refine ⟨fun x => ?_, by norm_num⟩
    convert (((hasDerivAt_id' x).pow 2).div_const 2).const_sub 1 using 1
    norm_num
  · simp only [identite, not_forall]; exact ⟨1, by norm_num⟩

/-- Sans `C0` : C = S = 0. -/
theorem sans_C0 : Essentiel identite ["C0"] := by
  refine ⟨⟨fun _ => 0, fun _ => 0⟩, ?_, ?_⟩
  · deplier [identite, axiomes]
    exact ⟨fun x => by simpa using hasDerivAt_const x (0 : ℝ), fun x => hasDerivAt_const x (0 : ℝ)⟩
  · simp only [identite, not_forall]; exact ⟨0, by norm_num⟩

/-- Sans `S0` : C = cos − sin, S = sin + cos. -/
theorem sans_S0 : Essentiel identite ["S0"] := by
  refine ⟨⟨fun t => cos t - sin t, fun t => sin t + cos t⟩, ?_, ?_⟩
  · deplier [identite, axiomes]
    refine ⟨fun x => ?_, fun x => ?_, by simp⟩
    · convert (hasDerivAt_cos x).sub (hasDerivAt_sin x) using 1
      ring
    · convert (hasDerivAt_sin x).add (hasDerivAt_cos x) using 1
  · simp only [identite, not_forall]; exact ⟨0, by norm_num⟩

/-- Témoin de cohérence : cos et sin. -/
theorem identite_coherent : Coherent identite := by
  refine ⟨⟨cos, sin⟩, ?_⟩
  deplier [identite, axiomes]
  exact ⟨hasDerivAt_cos, hasDerivAt_sin, cos_zero, sin_zero⟩

end Trigonometrique
