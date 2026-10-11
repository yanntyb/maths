section
variable (G : Type) (mul : G → G → G) (one : G) (inv : G → G)
  (assoc : ∀ a b c, mul (mul a b) c = mul a (mul b c))
  (left_id : ∀ a, mul one a = a)
  (left_inv : ∀ a, mul (inv a) a = one)
include assoc left_id left_inv

theorem rinv_grind (a : G) : mul a (inv a) = one := by
  grind

theorem rid_grind (a : G) : mul a one = a := by
  grind
end
