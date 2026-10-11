"""Spike jetable : test de dérivabilité automatique, groupe jouet, Lean 4.

Pour chaque théorème T et chaque axiome X retiré :
  1. recherche de preuve sans X (grind pur, puis script indicé)  -> superflu
  2. sinon recherche de contre-modèle fini (n <= NMAX), vérifié par `decide` -> essentiel
  3. sinon -> non testé
"""
import itertools, pathlib, re, subprocess, sys, time

LEAN = str(pathlib.Path.home() / ".elan/bin/lean")
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "out")
OUT.mkdir(exist_ok=True)
NMAX = 3
R = range

AX = {
    "assoc":    ("∀ a b c, mul (mul a b) c = mul a (mul b c)",
                 lambda n, m, o, i: all(m[m[a][b]][c] == m[a][m[b][c]] for a in R(n) for b in R(n) for c in R(n))),
    "left_id":  ("∀ a, mul one a = a", lambda n, m, o, i: all(m[o][a] == a for a in R(n))),
    "right_id": ("∀ a, mul a one = a", lambda n, m, o, i: all(m[a][o] == a for a in R(n))),
    "left_inv": ("∀ a, mul (inv a) a = one", lambda n, m, o, i: all(m[i[a]][a] == o for a in R(n))),
}

HINT_RINV = """have hx : mul (mul a (inv a)) (mul a (inv a)) = mul a (inv a) := by grind
  have := left_inv (mul a (inv a))
  grind"""
HINT_RID = HINT_RINV.replace("\n  grind", "\n  have hr : mul a (inv a) = one := by grind\n  grind")

THM = {
    "right_inv": ("mul a (inv a) = one", lambda n, m, o, i, a: m[a][i[a]] == o,
                  [("grind", "grind"), ("indicé", HINT_RINV)]),
    "right_id":  ("mul a one = a", lambda n, m, o, i, a: m[a][o] == a,
                  [("grind", "grind"), ("indicé", HINT_RID)]),
}

SIG = "(G : Type) (mul : G → G → G) (one : G) (inv : G → G)"


def lean(path):
    t = time.time()
    p = subprocess.run([LEAN, str(path)], capture_output=True, text=True)
    out = p.stdout + p.stderr
    return ("error" not in out), out, time.time() - t


def try_proof(thm, removed, label, script):
    kept = [k for k in AX if k != removed]
    binders = " ".join(f"({k} : {AX[k][0]})" for k in kept)
    stmt = THM[thm][0]
    f = OUT / f"proof_{thm}_sans_{removed}_{label}.lean"
    f.write_text(f"theorem t {SIG}\n  {binders} (a : G) :\n  {stmt} := by\n  {script}\n")
    ok, out, dt = lean(f)
    unused = sorted(set(re.findall(r"Variable name `(\w+)` is not explicitly referenced", out)) & set(AX))
    return ok, unused, dt


def search_model(thm, removed):
    kept = [k for k in AX if k != removed]
    holds, negated = THM[thm][1], None
    for n in range(1, NMAX + 1):
        for o in R(n):
            for inv in itertools.product(R(n), repeat=n):
                for flat in itertools.product(R(n), repeat=n * n):
                    m = [flat[r * n:(r + 1) * n] for r in R(n)]
                    if all(holds(n, m, o, inv, a) for a in R(n)):
                        continue
                    if all(AX[k][1](n, m, o, inv) for k in kept):
                        return n, m, o, inv
    return None


def check_model(thm, removed, model):
    n, m, o, inv = model
    kept = [k for k in AX if k != removed]

    def inst(s):
        s = re.sub(r"\bmul\b", "mulT", s)
        s = re.sub(r"\binv\b", "invT", s)
        s = re.sub(r"\bone\b", "oneT", s)
        return re.sub(r"∀ ([a-z ]+),", lambda g: f"∀ {g.group(1)} : Fin {n},", s)

    table = "[" + ",".join("[" + ",".join(map(str, row)) + "]" for row in m) + "]"
    conj = " ∧ ".join(f"({inst(AX[k][0])})" for k in kept)
    f = OUT / f"model_{thm}_sans_{removed}.lean"
    f.write_text(
        f"def mulT (a b : Fin {n}) : Fin {n} := (({table} : List (List (Fin {n}))).getD a.val []).getD b.val 0\n"
        f"def invT (a : Fin {n}) : Fin {n} := ([{','.join(map(str, inv))}] : List (Fin {n})).getD a.val 0\n"
        f"def oneT : Fin {n} := {o}\n"
        f"theorem contre_modele : {conj} ∧ ¬ (∀ a : Fin {n}, {inst(THM[thm][0])}) := by decide\n")
    ok, out, dt = lean(f)
    return ok, dt, out


if "pur" in sys.argv: THM = {k: (s, h, [p for p in ps if p[0] == "grind"]) for k, (s, h, ps) in THM.items()}
rows = []
for thm in THM:
    for removed in AX:
        status, detail = "non testé", ""
        for label, script in THM[thm][2]:
            ok, unused, dt = try_proof(thm, removed, label, script)
            if ok:
                status = "superflu"
                detail = f"preuve {label} ({dt:.1f}s)" + (f", non utilisés: {unused}" if unused else "")
                break
        if status == "non testé":
            t = time.time()
            model = search_model(thm, removed)
            ts = time.time() - t
            if model:
                ok, dt, out = check_model(thm, removed, model)
                n, m, o, inv = model
                if ok:
                    status = "essentiel"
                    detail = f"contre-modèle n={n} mul={m} one={o} inv={list(inv)} (recherche {ts:.1f}s, decide {dt:.1f}s)"
                else:
                    detail = f"contre-modèle Python rejeté par Lean: {out[:200]}"
            else:
                detail = f"ni preuve ni contre-modèle n<={NMAX} (recherche {ts:.1f}s)"
        rows.append((thm, removed, status, detail))
        print(f"{thm:10} sans {removed:9} -> {status:10} {detail}", flush=True)
