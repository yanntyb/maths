-- capacités : grind présent ? decide sur ∀ Fin n ?
def mulT (a b : Fin 2) : Fin 2 := ([[0,0],[1,1]].getD a.val []).getD b.val 0
def invT (a : Fin 2) : Fin 2 := ([0,0] : List (Fin 2)).getD a.val 0
example : (∀ a b c : Fin 2, mulT (mulT a b) c = mulT a (mulT b c))
        ∧ (∀ a, mulT a 0 = a) ∧ (∀ a, mulT (invT a) a = 0)
        ∧ ¬ (∀ a, mulT a (invT a) = 0) := by decide

example (G : Type) (mul : G → G → G) (one : G) (inv : G → G)
  (assoc : ∀ a b c, mul (mul a b) c = mul a (mul b c))
  (left_id : ∀ a, mul one a = a) (right_id : ∀ a, mul a one = a)
  (left_inv : ∀ a, mul (inv a) a = one) (a : G) : mul one (mul a one) = a := by
  grind
