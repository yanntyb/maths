# Meta-objets

> [Retour au sommaire](../../README.md)

## Idee

Les objets des [sens](../sens/) ont un sens, un contrat, un cablage. La numerotation de Godel encode un objet (ou un circuit entier) comme un **nombre**. C'est un meta-objet : son entree est un objet, sa sortie est `N`.

## Triple distinction du meta-objet

| Dimension | Numerotation de Godel |
|-----------|----------------------|
| **Sens** | encoder un circuit comme un nombre, pour pouvoir raisonner *sur* les circuits |
| **Contrat** | `Circuit -> N` |
| **Cablage** | chaque bloc -> un code, chaque connexion -> une puissance de premier, le circuit entier -> un produit |

## Qu'est-ce qu'un meta-objet ?

Un meta-objet ne transforme pas des **valeurs** (nombres, vecteurs, spheres). Il transforme des **objets** ou des **circuits**. Il vit un niveau au-dessus.

| Niveau | Entree | Sortie | Exemple |
|--------|--------|--------|---------|
| 0 -- objet | valeur | valeur | `<phi\|v>` prend un vecteur, rend un scalaire |
| 1 -- meta-objet | objet | valeur ou objet | Godel prend un circuit, rend un nombre |

### Exemples de meta-objets

**1. Numerotation de Godel** — `Circuit -> N`
Encode un circuit comme un nombre. Permet de raisonner *sur* les circuits avec les memes outils qu'on utilise *dans* les circuits.

**2. Compilateur** — `Circuit -> Circuit`
Le pipeline `Agda --js` du VPA est un meta-objet : il prend un circuit (code Agda avec types/preuves) et produit un autre circuit (JS executable). Le sens est conserve, l'implementation change.

**3. Currying** — `(A x B -> C) -> (A -> (B -> C))`
Le [currying](currying.md) est un meta-objet : il prend un objet a deux entrees et produit un nouvel objet a une entree. Il ne touche pas aux valeurs, il reorganise les ports.

**4. Composition** — `(A -> B) x (B -> C) -> (A -> C)`
Prend deux objets et produit un troisieme en connectant la sortie du premier a l'entree du second. C'est le cablage lui-meme, vu comme objet.

**5. Type-checker** — `Circuit -> {ok, erreur}`
Verifie qu'un assemblage respecte les [incompatibilites](../sens/espaces.md). Entree : un circuit. Sortie : verdict. C'est ce qu'Agda fait quand il verifie les types.

**6. Dual** — `(A x B -> C) -> (B x A -> C)`
Echange les entrees d'un objet asymetrique. Ne change pas le sens, seulement la convention de branchement.

### Le point commun

Tous ces meta-objets partagent la meme structure : leur **entree est un contrat**, pas une valeur. Ils operent sur la forme des objets, pas sur leur contenu.

## Ce que ca ouvre

- **Auto-reference** : un circuit peut prendre son propre numero de Godel comme entree
- **Incompletude** : il existe des proprietes de circuits qu'aucun circuit ne peut decider
- **Quine** : un circuit dont la sortie est son propre encodage

## Experiences

- [x] [Encodage](encodage.md) -- encoder types, objets et le circuit projeter comme un nombre de Godel
- [ ] Auto-reference -- construire un circuit qui prend son propre encodage comme entree
- [ ] Lien Agda -- un type dependant qui parle de ses propres termes
