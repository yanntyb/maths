# right_id depuis sous-ensembles de {assoc, left_id, left_inv} : contre-modèle quand on retire chacun ?
import importlib.util, sys, pathlib
sys.argv = [sys.argv[0], sys.argv[1]]
src = pathlib.Path(__file__).with_name("harness.py").read_text().split("rows = []")[0]
ns = {"__file__": str(pathlib.Path(__file__).with_name("harness.py"))}
exec(src, ns)
AX, THM = ns["AX"], ns["THM"]
del AX["right_id"]
for removed in list(AX):
    m = ns["search_model"]("right_id", removed)
    ok = ns["check_model"]("right_id", removed, m)[0] if m else None
    print(f"right_id depuis {{assoc,left_id,left_inv}} sans {removed}: modèle={m} lean_ok={ok}")
