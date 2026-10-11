import Derivabilite.Cablages

/-!
# Graphe de dépendances des cinq câblages

`#print axioms` ne distingue pas les câblages : ils reposent tous sur les mêmes axiomes
de fondation. On descend donc au niveau des constantes : pour chaque théorème, la
fermeture des constantes atteintes en suivant types et valeurs (définitions et preuves).

`#graphe t₁ … tₙ` affiche, pour chaque théorème, ses axiomes, la taille de sa fermeture,
la part qui lui est propre (hors socle commun à tous), le recouvrement de ces parts
propres deux à deux, et la présence de quelques constantes repères.
-/

open Lean Elab Command

/-- Constantes atteintes depuis `n` en suivant types et valeurs. -/
def fermeture (env : Environment) (n : Name) : Std.HashSet Name := Id.run do
  let mut vus : Std.HashSet Name := {}
  let mut pile : Array Name := #[n]
  while h : pile.size > 0 do
    let c := pile[pile.size - 1]
    pile := pile.pop
    if vus.contains c then continue
    vus := vus.insert c
    if let some ci := env.find? c then
      let mut cs := ci.type.getUsedConstants
      if let some v := ci.value? (allowOpaque := true) then cs := cs ++ v.getUsedConstants
      for d in cs do
        unless vus.contains d do pile := pile.push d
  return vus

/-- Constantes repères : de quoi chaque preuve dépend vraiment. -/
def reperes : List Name :=
  [``Inner.inner, ``InnerProductGeometry.angle, ``Real.arccos, ``Complex.normSq,
   ``Complex.exp, ``Real.exp, ``Real.cos, ``Real.pi, ``Real.sqrt, ``HasDerivAt,
   ``Filter.Tendsto, ``Matrix]

def pct (a b : Nat) : String := if b = 0 then "-" else s!"{(100 * a + b / 2) / b}%"

elab "#graphe " ids:ident+ : command => do
  let env ← getEnv
  let noms ← ids.mapM fun i => liftCoreM <| realizeGlobalConstNoOverload i
  let fs := noms.map fun n => (n, fermeture env n)
  let socle := fs.foldl (init := (fs[0]!).2) fun acc (_, s) => acc.filter s.contains
  let propres := fs.map fun (n, s) => (n, s.filter (!socle.contains ·))
  let mut out := s!"socle commun : {socle.size} constantes\n"
  for (n, s) in fs, (_, p) in propres do
    let axs ← collectAxioms n
    let directes := ((env.find? n).bind (·.value? (allowOpaque := true))).map
      (·.getUsedConstants) |>.getD #[]
    -- seuls les lemmes mathématiques : on écarte la plomberie des classes et des tactiques
    let directes := directes.filter fun c =>
      (env.find? c).any (·.isTheorem) && !(`Mathlib.Tactic).isPrefixOf c &&
        !(`Eq).isPrefixOf c && c != ``congrArg && c != ``id
    out := out ++ s!"{n.getString!} : axiomes {axs.toList} ; fermeture {s.size} ; " ++
      s!"propres {p.size}\n  directes : {directes.toList}\n"
  out := out ++ "\nrecouvrement des parts propres (Jaccard)\n"
  for (a, pa) in propres do
    let cells := propres.map fun (_, pb) =>
      let inter := pa.fold (fun k x => if pb.contains x then k + 1 else k) 0
      pct inter (pa.size + pb.size - inter)
    out := out ++ s!"{a.getString!} : {cells.toList}\n"
  out := out ++ "\nrepères présents\n"
  for (n, s) in fs do
    let pres := reperes.filter s.contains
    out := out ++ s!"{n.getString!} : {pres}\n"
  logInfo out

#graphe Cablages.scalaire Cablages.complexe Cablages.trigonometrique Cablages.cosinus
  Cablages.groupes
