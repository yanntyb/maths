-- Graphe de dépendances par preuve : axiomes globaux, puis `#print axioms`.
axiom G : Type
axiom mul : G → G → G
axiom one : G
axiom inv : G → G
axiom assoc : ∀ a b c : G, mul (mul a b) c = mul a (mul b c)
axiom left_id : ∀ a : G, mul one a = a
axiom left_inv : ∀ a : G, mul (inv a) a = one
axiom right_id : ∀ a : G, mul a one = a

-- Preuve 1 : a·a⁻¹ est idempotent, donc égal à 1. N'utilise pas right_id.
theorem rinv_1 (a : G) : mul a (inv a) = one := by
  have := left_inv (mul a (inv a))
  have hx : mul (mul a (inv a)) (mul a (inv a)) = mul a (inv a) := by
    rw [assoc, ← assoc (inv a), left_inv, left_id]
  calc mul a (inv a) = mul one (mul a (inv a)) := (left_id _).symm
    _ = mul (mul (inv (mul a (inv a))) (mul a (inv a))) (mul a (inv a)) := by rw [this]
    _ = one := by rw [assoc, hx, this]

-- Preuve 2 : a = inv (inv a). Passe par right_id.
theorem rinv_2 (a : G) : mul a (inv a) = one := by
  have h1 : a = inv (inv a) := calc
    a = mul one a := (left_id a).symm
    _ = mul (mul (inv (inv a)) (inv a)) a := by rw [left_inv]
    _ = mul (inv (inv a)) (mul (inv a) a) := assoc _ _ _
    _ = inv (inv a) := by rw [left_inv, right_id]
  calc mul a (inv a) = mul (inv (inv a)) (inv a) := by rw [← h1]
    _ = one := left_inv _

#print axioms rinv_1
#print axioms rinv_2
