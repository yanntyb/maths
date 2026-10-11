/-!
# Forme canonique du test de dérivabilité

Un **énoncé** est un câblage vu sous un contrat : un type de modèles, une liste d'axiomes
sur ces modèles, une conclusion. Un **statut** est un théorème de type `Superflu E r` ou
`Essentiel E r` : le noyau vérifie qu'il établit bien ce statut. Un couple (énoncé, axiome)
sans théorème est **non testé**. Vocabulaire des docs : sens, contrat ; nature structurelle
ou numérique des axiomes.
-/

namespace Derivabilite

inductive Nature | structurel | numerique

/-- Pourquoi un code README n'est pas un axiome du modèle. -/
inductive Motif | definition | etape | amont | derivable | cache | horsPreuve

/-- Le théorème commun aux câblages (Pythagore). -/
structure Theoreme where
  sens : String
  contrat : String

/-- Code README qui n'est pas un axiome du modèle. Texte relu à la main, non vérifié. -/
structure Note where
  code : String
  nature : Nature
  motif : Motif
  texte : String
  /-- Pour `derivable` : nom complet du lemme Lean qui le démontre. -/
  theoreme : Option String := none

structure Cablage where
  id : String
  titre : String
  espace : String
  notes : List Note

structure Axiome (M : Type 1) where
  nom : String
  code : String
  nature : Nature
  libelle : String
  prop : M → Prop

/-- Une colonne de la matrice : un câblage vu sous un contrat. -/
structure Enonce where
  cablage : String
  id : String
  sens : String
  contrat : String
  Modele : Type 1
  axiomes : List (Axiome Modele)
  conclusion : Modele → Prop

/-- Tous les axiomes de la liste tiennent dans `m`, sauf ceux dont le nom est retiré. -/
def tient {M : Type 1} (retires : List String) (m : M) : List (Axiome M) → Prop
  | [] => True
  | a :: as => (a.nom ∈ retires ∨ a.prop m) ∧ tient retires m as

def Enonce.sans (E : Enonce) (retires : List String) (m : E.Modele) : Prop :=
  tient retires m E.axiomes

def Superflu (E : Enonce) (r : List String) : Prop := ∀ m, E.sans r m → E.conclusion m

def Essentiel (E : Enonce) (r : List String) : Prop := ∃ m, E.sans r m ∧ ¬ E.conclusion m

/-- Témoin de cohérence : un modèle satisfait tous les axiomes de l'énoncé. Sans témoin, des
axiomes contradictoires rendraient tout retrait vacuement superflu ; l'exporteur en exige un
par énoncé. -/
def Coherent (E : Enonce) : Prop := ∃ m, E.sans [] m

theorem pas_les_deux {E : Enonce} {r : List String} : Superflu E r → Essentiel E r → False :=
  fun hs ⟨m, hm, hc⟩ => hc (hs m hm)

/-- `deplier [E, axs] at h ⊢` : déplie `Enonce.sans` et la conclusion en hypothèses, une
par axiome conservé ; les axiomes retirés disparaissent. -/
syntax "deplier" " [" ident,* "]" (Lean.Parser.Tactic.location)? : tactic
macro_rules
  | `(tactic| deplier [$ids,*] $[$loc]?) => `(tactic| (
      simp only [Enonce.sans, $[$ids:ident],*, tient, List.mem_cons, List.mem_singleton,
        List.not_mem_nil, String.reduceEq, or_false, false_or, or_true, true_or, true_and,
        and_true] $[$loc]?))

end Derivabilite
