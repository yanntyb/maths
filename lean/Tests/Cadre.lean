import Derivabilite.Cadre

/-!
# Tests de la forme canonique

Un énoncé jouet à deux axiomes : `deplier` retire l'axiome nommé et garde l'autre ;
`pas_les_deux` interdit qu'un retrait soit à la fois superflu et essentiel.
-/

open Derivabilite

structure Jouet : Type 1 where
  p : Prop
  q : Prop

def jouet : Enonce where
  cablage := "jouet"
  id := "e"
  sens := "s"
  contrat := "c"
  Modele := Jouet
  axiomes := [⟨"a", "S1", .structurel, "p", fun m => m.p⟩, ⟨"b", "S2", .structurel, "q", fun m => m.q⟩]
  conclusion := fun m => m.p

/-- Sans `b`, il reste exactement l'hypothèse de `a`. -/
example : Superflu jouet ["b"] := by
  intro m h
  deplier [jouet] at h ⊢
  exact h

/-- Sans `a`, le modèle p = False, q = True satisfait `b` et contredit la conclusion. -/
example : Essentiel jouet ["a"] :=
  ⟨⟨False, True⟩, by deplier [jouet], by simp [jouet]⟩

example (h : Superflu jouet ["a"]) (h' : Essentiel jouet ["a"]) : False := pas_les_deux h h'
