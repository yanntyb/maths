import Derivabilite.Cadre
import Derivabilite.Export

/-!
# Tests de l'exporteur

Chaque espace de noms `Fixture.*` est un petit environnement, valide ou volontairement
cassé. `exporterChamps "." prefixe` ne regarde que les constantes sous `prefixe`.
`#guard_msgs` fige le JSON produit ou le message d'erreur.
-/

open Lean Meta Derivabilite Derivabilite.Export

/-- Lance l'exporteur sur un préfixe et affiche le JSON compact. -/
def essayer (prefixe : Name) : MetaM Unit := do
  let champs ← exporterChamps "." prefixe
  logInfo (Json.mkObj champs).compress

structure M : Type 1 where
  p : Prop
  q : Prop

namespace Fixture.Valide
def t : Theoreme := ⟨"sens commun", "contrat commun"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", [⟨"N1", .numerique, .etape, "calcul", none⟩]⟩
def e : Enonce := ⟨"jouet", "e", "s", "contrat commun", M,
  [⟨"a", "S1", .structurel, "p", fun m => m.p⟩, ⟨"b", "S2", .structurel, "q", fun m => m.q⟩],
  fun m => m.p⟩
theorem sans_b : Superflu e ["b"] := by
  intro m h
  simp only [Enonce.sans, e, tient, List.mem_cons, List.not_mem_nil,
    String.reduceEq, or_false, false_or, and_true] at h ⊢
  exact h.1
theorem sans_a : Essentiel e ["a"] :=
  ⟨⟨False, True⟩, by simp [Enonce.sans, e, tient], by simp [e]⟩
theorem coherent : Coherent e := ⟨⟨True, True⟩, by simp [Enonce.sans, e, tient]⟩
end Fixture.Valide

/-- info: {"cablages":[{"enonces":[{"axiomes":[{"code":"S1","lean":"m.p","libelle":"p","nature":"structurel","nom":"a"},{"code":"S2","lean":"m.q","libelle":"q","nature":"structurel","nom":"b"}],"conclusion":"m.p","contrat":"contrat commun","id":"e","nonTestes":[],"sens":"s","statuts":[{"definitions":[],"fichier":"","lignes":[0,0],"retires":["a"],"source":"","statut":"essentiel","theoreme":"Fixture.Valide.sans_a"},{"definitions":[],"fichier":"","lignes":[0,0],"retires":["b"],"source":"","statut":"superflu","theoreme":"Fixture.Valide.sans_b"}],"temoin":"Fixture.Valide.coherent"}],"espace":"P","id":"jouet","notes":[{"code":"N1","motif":"etape","nature":"numerique","texte":"calcul","theoreme":null}],"titre":"Jouet"}],"theoreme":{"contrat":"contrat commun","sens":"sens commun"}} -/
#guard_msgs in
#eval essayer `Fixture.Valide

namespace Fixture.NomInconnu
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
theorem faux : Superflu e ["z"] := fun _ h => by simp [Enonce.sans, e, tient] at h; exact h
end Fixture.NomInconnu

/-- error: statuts : Fixture.NomInconnu.faux : « z » n'est pas un axiome de jouet.e -/
#guard_msgs in
#eval essayer `Fixture.NomInconnu

namespace Fixture.SansCablage
def t : Theoreme := ⟨"s", "c"⟩
def e : Enonce := ⟨"absent", "e", "s", "c", M, [], fun m => m.p⟩
end Fixture.SansCablage

/-- error: statuts : énoncé Fixture.SansCablage.e : câblage « absent » inexistant -/
#guard_msgs in
#eval essayer `Fixture.SansCablage

namespace Fixture.DeuxTheoremes
def t1 : Theoreme := ⟨"s", "c"⟩
def t2 : Theoreme := ⟨"s", "c"⟩
end Fixture.DeuxTheoremes

/-- error: statuts : une constante Theoreme attendue, 2 trouvée(s) -/
#guard_msgs in
#eval essayer `Fixture.DeuxTheoremes

namespace Fixture.Nature
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", [⟨"S1", .numerique, .etape, "calcul", none⟩]⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
end Fixture.Nature

/-- error: statuts : câblage jouet : code S1 à la fois structurel et numerique -/
#guard_msgs in
#eval essayer `Fixture.Nature

namespace Fixture.AxiomeIncoherent
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e1 : Enonce := ⟨"jouet", "e1", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
def e2 : Enonce := ⟨"jouet", "e2", "s", "c", M, [⟨"a", "S1", .structurel, "autre", fun m => m.p⟩], fun m => m.p⟩
end Fixture.AxiomeIncoherent

/-- error: statuts : câblage jouet : axiome « a » décrit de deux façons -/
#guard_msgs in
#eval essayer `Fixture.AxiomeIncoherent

namespace Fixture.Derivable
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", [⟨"N1", .numerique, .derivable, "lemme", some "Fixture.absent"⟩]⟩
end Fixture.Derivable

/-- error: statuts : note jouet.N1 : théorème Fixture.absent introuvable -/
#guard_msgs in
#eval essayer `Fixture.Derivable

/-! ## Garantie des statuts : axiomes admis, retraits bien formés, témoin de cohérence -/

namespace Fixture.Sorry
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
#guard_msgs (drop warning) in
theorem faux : Superflu e ["a"] := sorry
end Fixture.Sorry

/-- error: statuts : Fixture.Sorry.faux repose sur sorryAx : seuls propext, Classical.choice et Quot.sound sont admis -/
#guard_msgs in
#eval essayer `Fixture.Sorry

namespace Fixture.Triche
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
axiom triche : False
theorem faux : Superflu e ["a"] := triche.elim
end Fixture.Triche

/-- error: statuts : Fixture.Triche.faux repose sur Fixture.Triche.triche : seuls propext, Classical.choice et Quot.sound sont admis -/
#guard_msgs in
#eval essayer `Fixture.Triche

namespace Fixture.Doublon
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M,
  [⟨"a", "S1", .structurel, "p", fun m => m.p⟩, ⟨"b", "S2", .structurel, "q", fun m => m.q⟩], fun m => m.p⟩
theorem s1 : Essentiel e ["a", "b"] := ⟨⟨False, False⟩, by simp [Enonce.sans, e, tient], by simp [e]⟩
theorem s2 : Essentiel e ["b", "a"] := ⟨⟨False, False⟩, by simp [Enonce.sans, e, tient], by simp [e]⟩
end Fixture.Doublon

/-- error: statuts : retrait a+b de jouet.e établi deux fois (Fixture.Doublon.s1, Fixture.Doublon.s2) -/
#guard_msgs in
#eval essayer `Fixture.Doublon

namespace Fixture.Vide
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
theorem s : Superflu e [] := fun _ h => by simpa [Enonce.sans, e, tient] using h
end Fixture.Vide

/-- error: statuts : Fixture.Vide.s : aucun axiome retiré -/
#guard_msgs in
#eval essayer `Fixture.Vide

namespace Fixture.Repete
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
theorem s : Essentiel e ["a", "a"] := ⟨⟨False, True⟩, by simp [Enonce.sans, e, tient], by simp [e]⟩
end Fixture.Repete

/-- error: statuts : Fixture.Repete.s : « a » retiré deux fois -/
#guard_msgs in
#eval essayer `Fixture.Repete

namespace Fixture.SansTemoin
def t : Theoreme := ⟨"s", "c"⟩
def c : Cablage := ⟨"jouet", "Jouet", "P", []⟩
def e : Enonce := ⟨"jouet", "e", "s", "c", M, [⟨"a", "S1", .structurel, "p", fun m => m.p⟩], fun m => m.p⟩
end Fixture.SansTemoin

/-- error: statuts : énoncé jouet.e sans témoin de cohérence (théorème de type Coherent Fixture.SansTemoin.e) -/
#guard_msgs in
#eval essayer `Fixture.SansTemoin
