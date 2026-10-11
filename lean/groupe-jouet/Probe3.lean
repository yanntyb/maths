section
variable (G : Type) (mul : G → G → G) (one : G) (inv : G → G)
  (assoc : ∀ a b c, mul (mul a b) c = mul a (mul b c))
  (left_id : ∀ a, mul one a = a)
  (left_inv : ∀ a, mul (inv a) a = one)
include assoc left_id left_inv

-- indice 1 : instancier left_inv sur le bon terme
theorem idem (b : G) (h : mul b b = b) : b = one := by
  have := left_inv b; grind

-- indice 2 : x = a·a⁻¹ est idempotent, puis idem
theorem rinv_hint (a : G) : mul a (inv a) = one := by
  have hx : mul (mul a (inv a)) (mul a (inv a)) = mul a (inv a) := by grind
  have := left_inv (mul a (inv a)); grind

theorem rid_hint (a : G) : mul a one = a := by
  have := rinv_hint G mul one inv assoc left_id left_inv a
  grind
end
