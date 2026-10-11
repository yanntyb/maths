import Derivabilite.Export

/-!
# `lake exe statuts <sortie.json>`

Charge les `.olean` de `Derivabilite` à l'exécution (lancer `lake build` avant), exporte
les statuts et écrit le JSON. Code de sortie 1, avec un message « statuts : … » sur la
sortie d'erreur, à la première incohérence ; code 2 sans argument.
-/

open Lean Meta

/-- Révision de mathlib demandée dans `lake-manifest.json` (champ `inputRev`). -/
def revisionMathlib : IO String := do
  let .ok j := Json.parse (← IO.FS.readFile "lake-manifest.json") | return "?"
  let .ok (.arr paquets) := j.getObjVal? "packages" | return "?"
  for p in paquets do
    match p.getObjValAs? String "name", p.getObjValAs? String "inputRev" with
    | .ok "mathlib", .ok r => return r
    | _, _ => pure ()
  return "?"

unsafe def main (args : List String) : IO UInt32 := do
  let [sortie] := args | IO.eprintln "usage : lake exe statuts <sortie.json>"; return 2
  initSearchPath (← findSysroot)
  enableInitializersExecution
  let env ← importModules #[{ module := `Derivabilite }] {} (loadExts := true)
  let ctx : Core.Context := { fileName := "<statuts>", fileMap := default, maxHeartbeats := 0 }
  try
    let (champs, _) ← ((Derivabilite.Export.exporterChamps ".").run' {}).toIO ctx { env }
    let versions := [("lean", toJson Lean.versionString), ("mathlib", toJson (← revisionMathlib))]
    IO.FS.writeFile sortie ((Json.mkObj (versions ++ champs)).pretty ++ "\n")
    IO.println s!"statuts : {sortie} écrit"
    return 0
  catch e =>
    IO.eprintln (toString e)
    return 1
