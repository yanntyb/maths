import Derivabilite.Scalaire

/-!
# Câblage cosinus : test de dérivabilité axiome par axiome

Énoncé : B(x − y, x − y) = B(x,x) + B(y,y). Les normes `nx`, `ny` et le cosinus `c` sont
des réels quelconques : ni θ ni π n'interviennent. N1 (loi des cosinus) est un lemme
dérivable (`loi_cos`), et `via_scalaire` montre que le câblage se ramène au scalaire.
-/

namespace Cosinus
open Derivabilite

def cablage : Cablage where
  id := "cosinus"
  titre := "Théorème du cosinus — cas orthogonal"
  espace := "E"
  notes := [
    ⟨"N1", .numerique, .derivable, "loi des cosinus : conséquence de S1, S2, S3", some "Cosinus.loi_cos"⟩,
    ⟨"N2", .numerique, .horsPreuve, "θ = π/2 : θ n'intervient pas, l'énoncé pose directement cos θ = 0", none⟩,
    ⟨"N4", .numerique, .etape, "identité remarquable : étape de calcul faite par la tactique", none⟩]

structure Modele : Type 1 where
  V : Type
  [grp : AddCommGroup V]
  B : V → V → ℝ
  x : V
  y : V
  nx : ℝ
  ny : ℝ
  c : ℝ

attribute [instance] Modele.grp

def axiomes : List (Axiome Modele) := [
  ⟨"angle", "S1", .structurel, "B(x, y) = ‖x‖ ‖y‖ cos θ", fun m => m.B m.x m.y = m.nx * m.ny * m.c⟩,
  ⟨"addL", "S2", .structurel, "additivité à gauche",
    fun m => ∀ u v w : m.V, m.B (u + v) w = m.B u w + m.B v w⟩,
  ⟨"addR", "S2", .structurel, "additivité à droite",
    fun m => ∀ u v w : m.V, m.B u (v + w) = m.B u v + m.B u w⟩,
  ⟨"symm", "S3", .structurel, "symétrie", fun m => ∀ u v : m.V, m.B u v = m.B v u⟩,
  ⟨"droit", "N3", .numerique, "cos(π/2) = 0", fun m => m.c = 0⟩]

def orthogonal : Enonce where
  cablage := "cosinus"
  id := "orthogonal"
  sens := "pour un angle droit, la loi des cosinus perd son terme croisé"
  contrat := "E × E → R"
  Modele := Modele
  axiomes := axiomes
  conclusion := fun m => m.B (m.x - m.y) (m.x - m.y) = m.B m.x m.x + m.B m.y m.y

variable {V : Type*} [AddCommGroup V]

/-- N1 : loi des cosinus, conséquence de S1, S2, S3. -/
theorem loi_cos (B : V → V → ℝ)
    (addL : ∀ u v w, B (u + v) w = B u w + B v w)
    (addR : ∀ u v w, B u (v + w) = B u v + B u w)
    (symm : ∀ u v, B u v = B v u)
    (x y : V) (nx ny c : ℝ) (S1 : B x y = nx * ny * c) :
    B (x - y) (x - y) = B x x + B y y - 2 * nx * ny * c := by
  have negL : ∀ u w, B (-u) w = -B u w := fun u w => by
    have h0 := addL 0 0 w; have h1 := addL u (-u) w; simp at h0 h1; linarith
  have negR : ∀ u w, B w (-u) = -B w u := fun u w => by rw [symm, negL, symm]
  rw [sub_eq_add_neg, addL, addR, addR, negL, negL, negR, negR, neg_neg, symm y x]
  linarith

/-- L'angle est un détour : S1 et N3 ne servent qu'à obtenir B(x,y) = 0, puis le
câblage scalaire conclut (avec −y à la place de y). -/
theorem via_scalaire (B : V → V → ℝ)
    (addL : ∀ u v w, B (u + v) w = B u w + B v w)
    (addR : ∀ u v w, B u (v + w) = B u v + B u w)
    (symm : ∀ u v, B u v = B v u)
    (x y : V) (nx ny c : ℝ) (S1 : B x y = nx * ny * c) (N3 : c = 0) :
    B (x - y) (x - y) = B x x + B y y := by
  have negL : ∀ u w, B (-u) w = -B u w := fun u w => by
    have h0 := addL 0 0 w; have h1 := addL u (-u) w; simp at h0 h1; linarith
  have negR : ∀ u w, B w (-u) = -B w u := fun u w => by rw [symm, negL, symm]
  have orth : B x (-y) = 0 := by rw [negR, S1, N3]; ring
  have := Scalaire.lemme_carre B addL addR symm x (-y) orth
  rw [sub_eq_add_neg, this, negL, negR, neg_neg]

/-- Sans `addL` : se déduit de `addR` et de la symétrie (une ligne d'indication ; `grind`
échoue seul à cause de la soustraction). -/
theorem sans_addL : Superflu orthogonal ["addL"] := by
  intro (m : Modele) h
  deplier [orthogonal, axiomes] at h ⊢
  obtain ⟨angle, addR, symm, droit⟩ := h
  have addL : ∀ u v w : m.V, m.B (u + v) w = m.B u w + m.B v w := fun u v w => by
    rw [symm, addR, symm w u, symm w v]
  exact via_scalaire m.B addL addR symm m.x m.y m.nx m.ny m.c angle droit

theorem sans_addR : Superflu orthogonal ["addR"] := by
  intro (m : Modele) h
  deplier [orthogonal, axiomes] at h ⊢
  obtain ⟨angle, addL, symm, droit⟩ := h
  have addR : ∀ u v w : m.V, m.B u (v + w) = m.B u v + m.B u w := fun u v w => by
    rw [symm, addL, symm v u, symm w u]
  exact via_scalaire m.B addL addR symm m.x m.y m.nx m.ny m.c angle droit

open Scalaire (Bstd)

/-- Sans S1 : produit usuel, x = y = (1,0), c = 0 sans lien avec B. -/
theorem sans_angle : Essentiel orthogonal ["angle"] := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (1, 0), 1, 1, 0⟩, ?_, ?_⟩
  · deplier [orthogonal, axiomes]
    refine ⟨?_, ?_, ?_⟩
    · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
    · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
    · intro u v; simp only [Bstd]; ring
  · simp only [orthogonal]; norm_num [Bstd]

/-- Sans S3 : forme non symétrique du câblage scalaire, x = (1,0), y = (0,1), c = 0. -/
theorem sans_symm : Essentiel orthogonal ["symm"] := by
  refine ⟨⟨ℝ × ℝ, Scalaire.Bnonsym, (1, 0), (0, 1), 1, 1, 0⟩, ?_, ?_⟩
  · deplier [orthogonal, axiomes]
    refine ⟨?_, ?_, ?_⟩
    · norm_num [Scalaire.Bnonsym]
    · intro u v w; simp only [Scalaire.Bnonsym, Prod.fst_add, Prod.snd_add]; ring
    · intro u v w; simp only [Scalaire.Bnonsym, Prod.fst_add, Prod.snd_add]; ring
  · simp only [orthogonal]; norm_num [Scalaire.Bnonsym]

/-- Sans N3 : produit usuel, x = y = (1,0), ‖x‖ = ‖y‖ = 1, c = 1. -/
theorem sans_droit : Essentiel orthogonal ["droit"] := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (1, 0), 1, 1, 1⟩, ?_, ?_⟩
  · deplier [orthogonal, axiomes]
    refine ⟨?_, ?_, ?_, ?_⟩
    · norm_num [Bstd]
    · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
    · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
    · intro u v; simp only [Bstd]; ring
  · simp only [orthogonal]; norm_num [Bstd]

/-- Témoin de cohérence : produit usuel, x = (1,0), y = (0,1), ‖x‖ = ‖y‖ = 1, c = 0. -/
theorem orthogonal_coherent : Coherent orthogonal := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (0, 1), 1, 1, 0⟩, ?_⟩
  deplier [orthogonal, axiomes]
  refine ⟨?_, ?_, ?_, ?_⟩
  · norm_num [Bstd]
  · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro u v w; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro u v; simp only [Bstd]; ring

end Cosinus
