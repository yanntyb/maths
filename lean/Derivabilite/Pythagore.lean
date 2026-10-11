import Derivabilite.Cadre

namespace Derivabilite

/-- Sens et contrat communs aux cinq câblages (`docs/theoreme/pythagore/README.md`). -/
def pythagore : Theoreme where
  sens := "la longueur de l'hypoténuse d'un triangle rectangle se déduit des deux autres côtés"
  contrat := "(a, b) ∈ ℝ₊² → c ∈ ℝ₊"

end Derivabilite
