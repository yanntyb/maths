import Lean

/-!
# Export des statuts de dérivabilité en JSON

`exporterChamps racine prefixe` parcourt l'environnement : la constante `Theoreme`, les
constantes `Cablage` et `Enonce`, et les théorèmes de type `Superflu E r` ou
`Essentiel E r`. Les valeurs sont lues par réduction (`whnfD`) : chaînes littérales,
listes littérales de `Axiome.mk` et de `Note.mk`. Seules les constantes dont le nom
commence par `prefixe` sont considérées (`.anonymous` : toutes). Toute incohérence lève
une erreur qui commence par « statuts : ».

Ce module n'importe que `Lean` : l'exécutable `statuts` charge les `.olean` de
`Derivabilite` à l'exécution, sans compiler mathlib en code natif.
-/

open Lean Meta

namespace Derivabilite.Export

def nTheoreme : Name := `Derivabilite.Theoreme
def nCablage : Name := `Derivabilite.Cablage
def nEnonce : Name := `Derivabilite.Enonce
def nSuperflu : Name := `Derivabilite.Superflu
def nEssentiel : Name := `Derivabilite.Essentiel
def nCoherent : Name := `Derivabilite.Coherent

/-- Axiomes de fondation admis : ceux de mathlib. `sorryAx` ou un axiome maison rendraient un
statut non démontré. -/
def axiomesAdmis : List Name := [``propext, ``Classical.choice, ``Quot.sound]

def erreur {α} (msg : String) : MetaM α := throwError s!"statuts : {msg}"

def chaine (e : Expr) : MetaM String := do
  match ← whnfD e with
  | .lit (.strVal s) => return s
  | e => erreur s!"chaîne littérale attendue, trouvé {← ppExpr e}"

partial def liste (e : Expr) : MetaM (List Expr) := do
  let e ← whnfD e
  match e.getAppFnArgs with
  | (``List.cons, #[_, x, xs]) => return x :: (← liste xs)
  | (``List.nil, #[_]) => return []
  | _ => erreur s!"liste littérale attendue, trouvé {← ppExpr e}"

/-- Arguments du constructeur `c`, après réduction de `e`. -/
def champs (c : Name) (e : Expr) : MetaM (Array Expr) := do
  let e ← whnfD e
  unless e.isAppOf c do erreur s!"{c} attendu, trouvé {← ppExpr e}"
  return e.getAppArgs

/-- Constructeur sans argument : `Nature.structurel` donne "structurel". -/
def etiquette (e : Expr) : MetaM String := do
  match ← whnfD e with
  | .const (.str _ s) _ => return s
  | e => erreur s!"constructeur attendu, trouvé {← ppExpr e}"

def optChaine (e : Expr) : MetaM (Option String) := do
  let e ← whnfD e
  if e.isAppOf ``Option.none then return none
  if e.isAppOfArity ``Option.some 2 then return some (← chaine e.appArg!)
  erreur s!"option attendue, trouvé {← ppExpr e}"

/-- Corps d'une proposition `fun m => …`, affiché par le délaborateur. -/
def ppProp (e : Expr) : MetaM String :=
  lambdaTelescope e fun _ b => return (← ppExpr b).pretty 100

structure AxiomeLu where
  nom : String
  code : String
  nature : String
  libelle : String
  lean : String

structure NoteLue where
  code : String
  nature : String
  motif : String
  texte : String
  theoreme : Option String

structure CablageLu where
  id : String
  titre : String
  espace : String
  notes : List NoteLue

structure EnonceLu where
  constante : Name
  cablage : String
  id : String
  sens : String
  contrat : String
  axiomes : List AxiomeLu
  conclusion : String

structure StatutLu where
  theoreme : Name
  enonce : Name
  retires : List String
  statut : String
  fichier : String
  lignes : Nat × Nat
  source : String
  definitions : List (Name × String)

def lireAxiome (e : Expr) : MetaM AxiomeLu := do
  let a ← champs `Derivabilite.Axiome.mk e
  return { nom := ← chaine a[1]!, code := ← chaine a[2]!, nature := ← etiquette a[3]!,
           libelle := ← chaine a[4]!, lean := ← ppProp a[5]! }

def lireNote (e : Expr) : MetaM NoteLue := do
  let a ← champs `Derivabilite.Note.mk e
  return { code := ← chaine a[0]!, nature := ← etiquette a[1]!, motif := ← etiquette a[2]!,
           texte := ← chaine a[3]!, theoreme := ← optChaine a[4]! }

def lireCablage (n : Name) : MetaM CablageLu := do
  let a ← champs `Derivabilite.Cablage.mk (mkConst n)
  return { id := ← chaine a[0]!, titre := ← chaine a[1]!, espace := ← chaine a[2]!,
           notes := ← (← liste a[3]!).mapM lireNote }

def lireEnonce (n : Name) : MetaM EnonceLu := do
  let a ← champs `Derivabilite.Enonce.mk (mkConst n)
  return { constante := n, cablage := ← chaine a[0]!, id := ← chaine a[1]!,
           sens := ← chaine a[2]!, contrat := ← chaine a[3]!,
           axiomes := ← (← liste a[5]!).mapM lireAxiome, conclusion := ← ppProp a[6]! }

/-- Fichier source d'une constante importée, relatif à la racine du projet Lean. -/
def fichierDe (n : Name) : MetaM (Option String) := do
  let env ← getEnv
  let some i := env.getModuleIdxFor? n | return none
  let m := env.header.moduleNames[i.toNat]!
  return some (m.toString.replace "." "/" ++ ".lean")

def extrait (racine : System.FilePath) (fichier : String) (l₁ l₂ : Nat) : IO String := do
  let lignes ← IO.FS.lines (racine / fichier)
  return "\n".intercalate ((lignes.toList.drop (l₁ - 1)).take (l₂ - l₁ + 1))

/-- Fichier, lignes et texte source d'une déclaration ; vides pour une déclaration locale. -/
def sourceDe (racine : System.FilePath) (n : Name) : MetaM (String × (Nat × Nat) × String) := do
  let some f ← fichierDe n | return ("", (0, 0), "")
  let some r ← findDeclarationRanges? n | return (f, (0, 0), "")
  let (l₁, l₂) := (r.range.pos.line, r.range.endPos.line)
  return (f, (l₁, l₂), ← extrait racine f l₁ l₂)

/-- Définitions et lemmes des modules `Derivabilite.*` (hors `Cadre`) utilisés directement
par `ci` : contre-modèles, formes, lemmes communs. Les statuts eux-mêmes sont exclus. -/
def definitionsLocales (racine : System.FilePath) (ci : ConstantInfo) :
    MetaM (List (Name × String)) := do
  let env ← getEnv
  let utilisees := (ci.type.getUsedConstants ++ ((ci.value? (allowOpaque := true)).map (·.getUsedConstants)).getD #[])
  let mut vues : List Name := []
  for d in utilisees do
    if vues.contains d || d.isInternal || env.isProjectionFn d then continue
    -- le vocabulaire commun (`Derivabilite.*`, y compris ses lemmes d'équation) est exclu
    if (`Derivabilite).isPrefixOf d then continue
    let some dci := env.find? d | continue
    unless dci matches .defnInfo _ | .thmInfo _ do continue
    let tete := dci.type.getAppFn.constName
    if [nEnonce, nCablage, nTheoreme, nSuperflu, nEssentiel, ``List].contains tete then continue
    let some f ← fichierDe d | continue
    unless f.startsWith "Derivabilite/" do continue
    vues := vues ++ [d]
  vues.mapM fun d => return (d, (← sourceDe racine d).2.2)

def constantes (prefixe : Name) : MetaM (Array (Name × ConstantInfo)) := do
  let env ← getEnv
  let cs := env.constants.fold (init := #[]) fun acc n ci =>
    if prefixe.isPrefixOf n && !n.isInternal then acc.push (n, ci) else acc
  return cs.qsort (fun a b => a.1.toString < b.1.toString)

/-- Erreur si la preuve de `n` repose sur un axiome hors de `axiomesAdmis`. -/
def verifierAxiomes (n : Name) : MetaM Unit := do
  let interdits := (← collectAxioms n).filter (!axiomesAdmis.contains ·)
  unless interdits.isEmpty do
    erreur s!"{n} repose sur {", ".intercalate (interdits.toList.map toString)} : seuls propext, Classical.choice et Quot.sound sont admis"

def lireStatut (racine : System.FilePath) (n : Name) (ci : ConstantInfo) :
    MetaM (Option StatutLu) := do
  let .thmInfo t := ci | return none
  let (f, #[.const e _, r]) := t.type.getAppFnArgs | return none
  unless f == nSuperflu || f == nEssentiel do return none
  verifierAxiomes n
  let retires ← (← liste r).mapM chaine
  let (fichier, lignes, source) ← sourceDe racine n
  return some { theoreme := n, enonce := e, retires,
                statut := if f == nSuperflu then "superflu" else "essentiel",
                fichier, lignes, source, definitions := ← definitionsLocales racine ci }

/-! ## Vérifications -/

/-- Témoins de cohérence : (énoncé, théorème de type `Coherent E`), axiomes vérifiés. -/
def lireTemoins (cs : Array (Name × ConstantInfo)) : MetaM (List (Name × Name)) :=
  cs.toList.filterMapM fun (n, ci) => do
    let .thmInfo t := ci | return none
    let (f, #[.const e _]) := t.type.getAppFnArgs | return none
    unless f == nCoherent do return none
    verifierAxiomes n
    return some (e, n)

def cleRetrait (r : List String) : String :=
  "+".intercalate (r.toArray.qsort (· < ·)).toList

def verifier (cabs : List CablageLu) (ens : List EnonceLu) (sts : List StatutLu)
    (temoins : List (Name × Name)) : MetaM Unit := do
  let env ← getEnv
  for c in cabs do
    if (cabs.filter (·.id == c.id)).length > 1 then erreur s!"câblage « {c.id} » déclaré deux fois"
    for n in c.notes do
      if n.motif == "derivable" then
        match n.theoreme with
        | none => erreur s!"note {c.id}.{n.code} : motif derivable sans théorème"
        | some t => unless env.contains t.toName do
            erreur s!"note {c.id}.{n.code} : théorème {t} introuvable"
  for e in ens do
    unless cabs.any (·.id == e.cablage) do
      erreur s!"énoncé {e.constante} : câblage « {e.cablage} » inexistant"
    if (ens.filter (fun f => f.cablage == e.cablage && f.id == e.id)).length > 1 then
      erreur s!"énoncé {e.cablage}.{e.id} déclaré deux fois"
  for c in cabs do
    let axs := (ens.filter (·.cablage == c.id)).flatMap (·.axiomes)
    for a in axs do
      for b in axs do
        if a.nom == b.nom && (a.code != b.code || a.nature != b.nature || a.libelle != b.libelle) then
          erreur s!"câblage {c.id} : axiome « {a.nom} » décrit de deux façons"
    let codes := axs.map (fun a => (a.code, a.nature)) ++ c.notes.map (fun n => (n.code, n.nature))
    for (k, v) in codes do
      for (k', v') in codes do
        if k == k' && v != v' then erreur s!"câblage {c.id} : code {k} à la fois {v} et {v'}"
  for s in sts do
    let some e := ens.find? (·.constante == s.enonce)
      | erreur s!"{s.theoreme} : énoncé {s.enonce} inconnu"
    if s.retires.isEmpty then erreur s!"{s.theoreme} : aucun axiome retiré"
    for r in s.retires do
      unless e.axiomes.any (·.nom == r) do
        erreur s!"{s.theoreme} : « {r} » n'est pas un axiome de {e.cablage}.{e.id}"
      if (s.retires.filter (· == r)).length > 1 then erreur s!"{s.theoreme} : « {r} » retiré deux fois"
    for s' in sts do
      if s'.enonce == s.enonce && s'.theoreme != s.theoreme && cleRetrait s'.retires == cleRetrait s.retires then
        erreur s!"retrait {cleRetrait s.retires} de {e.cablage}.{e.id} établi deux fois ({s.theoreme}, {s'.theoreme})"
  for e in ens do
    unless temoins.any (·.1 == e.constante) do
      erreur s!"énoncé {e.cablage}.{e.id} sans témoin de cohérence (théorème de type Coherent {e.constante})"

/-! ## JSON -/

def jAxiome (a : AxiomeLu) : Json :=
  Json.mkObj [("nom", a.nom), ("code", a.code), ("nature", a.nature),
              ("libelle", a.libelle), ("lean", a.lean)]

def jNote (n : NoteLue) : Json :=
  Json.mkObj [("code", n.code), ("nature", n.nature), ("motif", n.motif), ("texte", n.texte),
              ("theoreme", match n.theoreme with | some t => toJson t | none => Json.null)]

def jStatut (s : StatutLu) : Json :=
  Json.mkObj [("retires", toJson s.retires), ("statut", s.statut),
              ("theoreme", s.theoreme.toString), ("fichier", s.fichier),
              ("lignes", toJson [s.lignes.1, s.lignes.2]), ("source", s.source),
              ("definitions", Json.arr (s.definitions.map fun (d, src) =>
                 Json.mkObj [("nom", d.toString), ("source", src)]).toArray)]

def jEnonce (e : EnonceLu) (sts : List StatutLu) (temoins : List (Name × Name)) : Json :=
  let miens := (sts.filter (·.enonce == e.constante)).toArray.qsort
    (fun a b => toString a.retires < toString b.retires) |>.toList
  let testes := miens.filterMap fun s => match s.retires with | [r] => some r | _ => none
  let nonTestes := (e.axiomes.map (·.nom)).filter (!testes.contains ·)
  let temoin := (temoins.find? (·.1 == e.constante)).map (·.2.toString)
  Json.mkObj [("id", e.id), ("sens", e.sens), ("contrat", e.contrat), ("conclusion", e.conclusion),
              ("temoin", match temoin with | some t => toJson t | none => Json.null),
              ("axiomes", Json.arr (e.axiomes.map jAxiome).toArray),
              ("statuts", Json.arr (miens.map jStatut).toArray),
              ("nonTestes", toJson nonTestes)]

/-- Champs du JSON (sans versions). Ordre fixe : câblages et énoncés triés par id, axiomes
et notes dans l'ordre de déclaration, statuts triés par axiomes retirés. -/
def exporterChamps (racine : System.FilePath) (prefixe : Name := .anonymous) :
    MetaM (List (String × Json)) := do
  let cs ← constantes prefixe
  let thms := cs.filter fun (_, ci) => ci.type == mkConst nTheoreme
  unless thms.size == 1 do erreur s!"une constante Theoreme attendue, {thms.size} trouvée(s)"
  let t ← champs `Derivabilite.Theoreme.mk (mkConst thms[0]!.1)
  let cabs ← (cs.filter fun (_, ci) => ci.type == mkConst nCablage).toList.mapM (lireCablage ·.1)
  let ens ← (cs.filter fun (_, ci) => ci.type == mkConst nEnonce).toList.mapM (lireEnonce ·.1)
  let sts ← cs.toList.filterMapM fun (n, ci) => lireStatut racine n ci
  let temoins ← lireTemoins cs
  verifier cabs ens sts temoins
  let cabsTries := cabs.toArray.qsort (fun a b => a.id < b.id) |>.toList
  let jCab (c : CablageLu) : Json :=
    let siens := (ens.filter (·.cablage == c.id)).toArray.qsort (fun a b => a.id < b.id) |>.toList
    Json.mkObj [("id", c.id), ("titre", c.titre), ("espace", c.espace),
                ("notes", Json.arr (c.notes.map jNote).toArray),
                ("enonces", Json.arr (siens.map (jEnonce · sts temoins)).toArray)]
  return [("theoreme", Json.mkObj [("sens", ← chaine t[0]!), ("contrat", ← chaine t[1]!)]),
          ("cablages", Json.arr (cabsTries.map jCab).toArray)]

end Derivabilite.Export
