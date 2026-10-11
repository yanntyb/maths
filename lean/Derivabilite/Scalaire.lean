import Mathlib
import Derivabilite.Cadre

/-!
# Câblage scalaire : test de dérivabilité axiome par axiome

Forme abstraite `B : V → V → ℝ` sur un module réel `V`. L'axiome S1 du README
(bilinéarité) est découpé en `addL`, `addR` et `homog`.

Deux énoncés, deux contrats :
* `carre` : B(u+v, u+v) = B(u,u) + B(v,v), contrat `E × E → R` ;
* `norme` : ‖u+v‖² = ‖u‖² + ‖v‖² avec ‖x‖ = √B(x,x), contrat commun `(a, b) ∈ ℝ₊² → c ∈ ℝ₊`.

La positivité S3 est superflue pour le premier, essentielle pour le second : le statut
dépend du contrat.
-/

namespace Scalaire
open Derivabilite

def cablage : Cablage where
  id := "scalaire"
  titre := "Produit scalaire — ‖u+v‖² = a² + b²"
  espace := "E"
  notes := [
    ⟨"N1", .structurel, .definition, "‖x‖² = (x, x) : définition intégrée à l'énoncé `norme`", none⟩,
    ⟨"N3", .numerique, .etape, "développement bilinéaire : étape de calcul faite par la tactique", none⟩]

structure Modele : Type 1 where
  V : Type
  [grp : AddCommGroup V]
  [mod : Module ℝ V]
  B : V → V → ℝ
  u : V
  v : V

attribute [instance] Modele.grp Modele.mod

def axiomes : List (Axiome Modele) := [
  ⟨"addL", "S1", .structurel, "additivité à gauche",
    fun m => ∀ x y z : m.V, m.B (x + y) z = m.B x z + m.B y z⟩,
  ⟨"addR", "S1", .structurel, "additivité à droite",
    fun m => ∀ x y z : m.V, m.B x (y + z) = m.B x y + m.B x z⟩,
  ⟨"homog", "S1", .structurel, "homogénéité",
    fun m => ∀ (r : ℝ) (x y : m.V), m.B (r • x) y = r * m.B x y⟩,
  ⟨"symm", "S2", .structurel, "symétrie", fun m => ∀ x y : m.V, m.B x y = m.B y x⟩,
  ⟨"pos", "S3", .structurel, "positivité", fun m => ∀ x : m.V, 0 ≤ m.B x x⟩,
  ⟨"orth", "N2", .numerique, "orthogonalité de u et v", fun m => m.B m.u m.v = 0⟩]

def carre : Enonce where
  cablage := "scalaire"
  id := "carre"
  sens := "deux vecteurs orthogonaux : la forme de leur somme est la somme de leurs formes"
  contrat := "E × E → R"
  Modele := Modele
  axiomes := axiomes
  conclusion := fun m => m.B (m.u + m.v) (m.u + m.v) = m.B m.u m.u + m.B m.v m.v

def norme : Enonce where
  cablage := "scalaire"
  id := "norme"
  sens := "deux vecteurs orthogonaux : le carré de la longueur de leur somme est la somme des carrés des longueurs"
  contrat := "(a, b) ∈ ℝ₊² → c ∈ ℝ₊"
  Modele := Modele
  axiomes := axiomes
  conclusion := fun m =>
    √(m.B (m.u + m.v) (m.u + m.v)) ^ 2 = √(m.B m.u m.u) ^ 2 + √(m.B m.v m.v) ^ 2

/-- Lemme commun : additivité des deux côtés, symétrie et orthogonalité suffisent ; un
groupe abélien suffit, sans structure de module. Réutilisé par le câblage cosinus. -/
theorem lemme_carre {V : Type*} [AddCommGroup V] (B : V → V → ℝ)
    (addL : ∀ u v w, B (u + v) w = B u w + B v w)
    (addR : ∀ u v w, B u (v + w) = B u v + B u w)
    (symm : ∀ u v, B u v = B v u)
    (u v : V) (h : B u v = 0) : B (u + v) (u + v) = B u u + B v v := by
  grind

/-! ## Énoncé `carre` -/

theorem carre_sans_addL : Superflu carre ["addL"] := by
  intro m h
  deplier [carre, axiomes] at h ⊢
  obtain ⟨addR, homog, symm, pos, orth⟩ := h
  grind

theorem carre_sans_addR : Superflu carre ["addR"] := by
  intro m h
  deplier [carre, axiomes] at h ⊢
  obtain ⟨addL, homog, symm, pos, orth⟩ := h
  grind

theorem carre_sans_homog : Superflu carre ["homog"] := by
  intro (m : Modele) h
  deplier [carre, axiomes] at h ⊢
  obtain ⟨addL, addR, symm, pos, orth⟩ := h
  exact lemme_carre m.B addL addR symm m.u m.v orth

theorem carre_sans_pos : Superflu carre ["pos"] := by
  intro (m : Modele) h
  deplier [carre, axiomes] at h ⊢
  obtain ⟨addL, addR, homog, symm, orth⟩ := h
  exact lemme_carre m.B addL addR symm m.u m.v orth

/-- Forme bilinéaire de matrice [[1,0],[1,1]] : positive, pas symétrique. -/
def Bnonsym (u v : ℝ × ℝ) : ℝ := u.1 * v.1 + u.2 * v.1 + u.2 * v.2


theorem carre_sans_symm : Essentiel carre ["symm"] := by
  refine ⟨⟨ℝ × ℝ, Bnonsym, (1, 0), (0, 1)⟩, ?_, ?_⟩
  · deplier [carre, axiomes]
    refine ⟨?_, ?_, ?_, ?_, ?_⟩
    · intro x y z; simp only [Bnonsym, Prod.fst_add, Prod.snd_add]; ring
    · intro x y z; simp only [Bnonsym, Prod.fst_add, Prod.snd_add]; ring
    · intro r x y; simp only [Bnonsym, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
    · intro x; simp only [Bnonsym]
      nlinarith [sq_nonneg (x.1 + x.2), sq_nonneg x.1, sq_nonneg x.2]
    · norm_num [Bnonsym]
  · simp only [carre]; norm_num [Bnonsym]

/-- Carré du produit scalaire usuel : symétrique et positif, ni additif ni homogène. -/
def Bcarre (u v : ℝ × ℝ) : ℝ := (u.1 * v.1 + u.2 * v.2) ^ 2

theorem carre_sans_addL_addR_homog : Essentiel carre ["addL", "addR", "homog"] := by
  refine ⟨⟨ℝ × ℝ, Bcarre, (1, 0), (0, 1)⟩, ?_, ?_⟩
  · deplier [carre, axiomes]
    refine ⟨?_, ?_, ?_⟩
    · intro x y; simp only [Bcarre]; ring
    · intro x; simp only [Bcarre]; positivity
    · norm_num [Bcarre]
  · simp only [carre]; norm_num [Bcarre]

/-! ## Énoncé `norme` -/

theorem norme_sans_addL : Superflu norme ["addL"] := by
  intro (m : Modele) h
  deplier [norme, axiomes] at h ⊢
  obtain ⟨addR, homog, symm, pos, orth⟩ := h
  have addL : ∀ x y z : m.V, m.B (x + y) z = m.B x z + m.B y z := fun x y z => by
    rw [symm, addR, symm z x, symm z y]
  rw [Real.sq_sqrt (pos _), Real.sq_sqrt (pos _), Real.sq_sqrt (pos _)]
  exact lemme_carre m.B addL addR symm m.u m.v orth

theorem norme_sans_addR : Superflu norme ["addR"] := by
  intro (m : Modele) h
  deplier [norme, axiomes] at h ⊢
  obtain ⟨addL, homog, symm, pos, orth⟩ := h
  have addR : ∀ x y z : m.V, m.B x (y + z) = m.B x y + m.B x z := fun x y z => by
    rw [symm, addL, symm y x, symm z x]
  rw [Real.sq_sqrt (pos _), Real.sq_sqrt (pos _), Real.sq_sqrt (pos _)]
  exact lemme_carre m.B addL addR symm m.u m.v orth

theorem norme_sans_homog : Superflu norme ["homog"] := by
  intro (m : Modele) h
  deplier [norme, axiomes] at h ⊢
  obtain ⟨addL, addR, symm, pos, orth⟩ := h
  rw [Real.sq_sqrt (pos _), Real.sq_sqrt (pos _), Real.sq_sqrt (pos _)]
  exact lemme_carre m.B addL addR symm m.u m.v orth

/-- Forme de Minkowski : bilinéaire et symétrique, pas positive. -/
def Bmink (u v : ℝ × ℝ) : ℝ := u.1 * v.1 - u.2 * v.2

theorem norme_sans_pos : Essentiel norme ["pos"] := by
  refine ⟨⟨ℝ × ℝ, Bmink, (1, 0), (0, 1)⟩, ?_, ?_⟩
  · deplier [norme, axiomes]
    refine ⟨?_, ?_, ?_, ?_, ?_⟩
    · intro x y z; simp only [Bmink, Prod.fst_add, Prod.snd_add]; ring
    · intro x y z; simp only [Bmink, Prod.fst_add, Prod.snd_add]; ring
    · intro r x y; simp only [Bmink, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
    · intro x y; simp only [Bmink]; ring
    · norm_num [Bmink]
  · simp only [norme]; norm_num [Bmink, Real.sqrt_eq_zero']

theorem norme_sans_symm : Essentiel norme ["symm"] := by
  refine ⟨⟨ℝ × ℝ, Bnonsym, (1, 0), (0, 1)⟩, ?_, ?_⟩
  · deplier [norme, axiomes]
    refine ⟨?_, ?_, ?_, ?_, ?_⟩
    · intro x y z; simp only [Bnonsym, Prod.fst_add, Prod.snd_add]; ring
    · intro x y z; simp only [Bnonsym, Prod.fst_add, Prod.snd_add]; ring
    · intro r x y; simp only [Bnonsym, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
    · intro x; simp only [Bnonsym]
      nlinarith [sq_nonneg (x.1 + x.2), sq_nonneg x.1, sq_nonneg x.2]
    · norm_num [Bnonsym]
  · simp only [norme]; norm_num [Bnonsym]

/-! ## Témoins de cohérence -/

/-- Produit scalaire usuel sur ℝ². -/
def Bstd (u v : ℝ × ℝ) : ℝ := u.1 * v.1 + u.2 * v.2

/-- Le produit usuel, avec u = (1,0) et v = (0,1), satisfait les six axiomes. -/
theorem carre_coherent : Coherent carre := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (0, 1)⟩, ?_⟩
  deplier [carre, axiomes]
  refine ⟨?_, ?_, ?_, ?_, ?_, ?_⟩
  · intro x y z; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro x y z; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro r x y; simp only [Bstd, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
  · intro x y; simp only [Bstd]; ring
  · intro x; simp only [Bstd]; nlinarith [sq_nonneg x.1, sq_nonneg x.2]
  · norm_num [Bstd]

/-- Mêmes modèles et mêmes axiomes que `carre`. -/
theorem norme_coherent : Coherent norme := carre_coherent

/-! ## Sans orthogonalité -/

/-- Le produit usuel avec u = v = (1,0) satisfait tout sauf l'orthogonalité. -/
theorem axiomes_sans_orth : carre.sans ["orth"] ⟨ℝ × ℝ, Bstd, (1, 0), (1, 0)⟩ := by
  deplier [carre, axiomes]
  refine ⟨?_, ?_, ?_, ?_, ?_⟩
  · intro x y z; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro x y z; simp only [Bstd, Prod.fst_add, Prod.snd_add]; ring
  · intro r x y; simp only [Bstd, Prod.smul_fst, Prod.smul_snd, smul_eq_mul]; ring
  · intro x y; simp only [Bstd]; ring
  · intro x; simp only [Bstd]; nlinarith [sq_nonneg x.1, sq_nonneg x.2]

/-- Sans N2 : B(2u, 2u) = 4 ≠ 2 = B(u,u) + B(v,v). -/
theorem carre_sans_orth : Essentiel carre ["orth"] := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (1, 0)⟩, axiomes_sans_orth, ?_⟩
  simp only [carre]; norm_num [Bstd]

/-- Sans N2, même modèle : √4² = 4 ≠ 2. -/
theorem norme_sans_orth : Essentiel norme ["orth"] := by
  refine ⟨⟨ℝ × ℝ, Bstd, (1, 0), (1, 0)⟩, axiomes_sans_orth, ?_⟩
  simp only [norme]
  rw [Real.sq_sqrt (by norm_num [Bstd]), Real.sq_sqrt (by norm_num [Bstd])]
  norm_num [Bstd]

end Scalaire
