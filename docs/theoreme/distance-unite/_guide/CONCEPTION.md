# Guide « distance unité » — conception

Document de travail : il décrit ce qu'on construit et pourquoi. Il ne fait pas partie du guide publié.

## 1. Objectif

Un guide pas à pas, lisible entièrement dans un navigateur mobile. Il mène un non-mathématicien qui comprend vite jusqu'à la compréhension du théorème (Erdős refuté : `ν(n) ≥ n^{1+δ}` pour une infinité de `n`) et de sa preuve.

**Lecteur** : le propriétaire du repo. Il comprend vite, mais le vocabulaire technique ne lui est pas familier.

**Critère de réussite** : après lecture, le lecteur peut expliquer la résolution avec ses propres mots, des schémas ou des animations.

## 2. Décisions prises

| Sujet | Décision |
|-------|----------|
| Forme | petit site statique HTML : 14 chapitres, un sommaire, un lexique, des widgets interactifs intégrés dans les chapitres |
| Langue | français non technique, avec accents (le reste du repo n'est pas modifié) |
| Formules | absentes du fil principal ; encadrés facultatifs « Pour les curieux » (formule + traduction mot à mot), repliés par défaut |
| Profondeur arithmétique | une intuition par brique (ce qu'elle garantit, une analogie, pourquoi la preuve en a besoin) ; aucune démonstration des briques |
| Ordre du récit | par l'échec : le défi, la recette d'Erdős, pourquoi elle s'essouffle, le changement de point de vue, la géométrie, le bilan, puis la fabrication des mondes |
| Support | mobile d'abord ; fonctionne aussi sur ordinateur |
| Hébergement | `https://tyb-tech.fr/unit-distance/`, site Laravel / FrankenPHP dans `/Users/yanntyb/Desktop/tyb-tech/sites/tyb_tech` |
| Source | `docs/theoreme/distance-unite/_guide/` (repo maths) ; copie publiée dans `public/unit-distance/` du site |

## 3. Arborescence

```
_guide/
  index.html                  sommaire, carte du parcours, mode d'emploi
  01-le-defi.html
  02-petit-grand-tres-grand.html
  03-la-recette-d-erdos.html
  04-pourquoi-elle-s-essouffle.html
  05-changer-de-point-de-vue.html
  06-les-pas-magiques.html
  07-les-tiroirs.html
  08-la-fenetre-et-le-coup-de-des.html
  09-pas-trop-de-points.html
  10-le-bilan.html
  11-le-cahier-des-charges.html
  12-construire-la-tour.html
  13-les-tiroirs-restent-peu-nombreux.html
  14-toute-la-preuve-en-une-page.html
  lexique.html
  assets/
    guide.css                 mise en page mobile, mode sombre
    guide.js                  navigation, outils canvas et tactile partagés par les widgets
    widgets/
      cyclo.js                calcul dans Q(ζ_m), partagé par ombre et pas-magiques
      allumettes.js  croissances.js  deux-carres.js  ombre.js  pas-magiques.js
      tiroirs.js  fenetre.js  bilan.js  budget.js
  tests/                      vérificateur Chrome sans fenêtre (non publié)
  publier.sh                  copie le guide vers le site (hors CONCEPTION.md, PLAN.md, publier.sh, tests/)
  CONCEPTION.md               ce document
  PLAN.md                     plan d'exécution
```

## 4. Gabarit d'un chapitre

Chaque chapitre tient en un à deux écrans de téléphone. Sections, dans l'ordre :

1. **En une phrase** : l'idée du chapitre.
2. **Ce qui coince** : le manque laissé par le chapitre précédent.
3. **L'idée** : en mots simples.
4. **Image du monde réel** : une analogie, suivie de sa **limite** (où l'image trompe).
5. **Autre point de vue** : la même idée vue autrement.
6. **À manipuler** : le widget intégré, avec une consigne « fais X, regarde Y ».
7. **Pour les curieux** : `<details>` replié ; formule + traduction mot à mot.
8. **Tu peux maintenant expliquer** : une à trois phrases à redire avec ses mots.
9. **Pour aller plus loin** : liens vers les docs techniques sur GitHub (`https://github.com/yanntyb/maths/blob/main/docs/theoreme/distance-unite/...`). Le repo est public ; les liens marchent une fois le dossier poussé.

Fil rouge concret : **des allumettes sur une table**. Les points sont des clous ; une distance de 1 est une allumette qui tient pile entre deux clous.

## 5. Parcours

| # | Chapitre | Idée | Analogie / point de vue | Widget |
|---|----------|------|-------------------------|--------|
| 01 | Le défi | n clous, combien d'allumettes au maximum ? Erdős pensait : à peine plus que n | allumettes | allumettes |
| 02 | Petit, grand, très grand | une puissance, même minuscule, finit par battre le « bonus lent » d'Erdős | tortue et lièvre, placements bancaires | croissances |
| 03 | La recette d'Erdős | une grille ; certains nombres sont des sommes de deux carrés de beaucoup de façons ; chaque bon premier double ce nombre | cadenas : chaque bon premier ajoute un interrupteur | deux-carres (cercle) |
| 04 | Pourquoi elle s'essouffle | le bouton qui ajoute des chemins fait aussi grossir la grille | chaque nouvelle machine exige un entrepôt plus grand | deux-carres (coût) |
| 05 | Changer de point de vue | travailler sur f écrans à la fois, puis ne regarder que le premier | plusieurs caméras filment la même scène ; ombre chinoise | ombre |
| 06 | Les pas magiques | « nombre ÷ son reflet » a une longueur 1 sur chaque écran | boussole : on garde le cap, on oublie la distance | pas-magiques |
| 07 | Les tiroirs | combiner les bons premiers donne énormément d'essais ; ils se rangent dans h tiroirs ; un tiroir est forcément bien rempli | chaussettes et tiroirs | tiroirs |
| 08 | La fenêtre et le coup de dés | on garde les points d'un pavage infini qui tombent dans une fenêtre ; une position au moins fait mieux que la moyenne | filet lancé sur un banc de poissons | fenetre |
| 09 | Pas trop de points | deux points ne peuvent pas être proches sur tous les écrans à la fois (un entier non nul vaut au moins 1) | oranges dans une caisse | ombre (fenêtre sur les écrans cachés) |
| 10 | Le bilan | trois croissances ; le découplage, comparé au chapitre 04 ; δ minuscule mais fixe | course entre deux exponentielles | bilan (bilan) |
| 11 | Le cahier des charges | des mondes de plus en plus grands, où (1) les mêmes clés ouvrent toutes les portes et (2) le nombre de tiroirs reste maîtrisé ; pourquoi les familles naïves échouent | un immeuble infini aux clés universelles | — |
| 12 | Construire la tour | cubes collés = directions libres ; Chebotarev fournit les clés ; Golod–Shafarevich fait le budget des règles ; pourquoi 3 | LEGO : pièces libres contre règles ; un immeuble sans fissure | budget |
| 13 | Les tiroirs restent peu nombreux | prix par étage constant, donc tiroirs au plus exponentiels ; les clés gagnent la course | loyer au m² constant | bilan (course) |
| 14 | Toute la preuve en une page | le récit en 10 phrases, un schéma, des idées pour dessiner ou animer, un auto-test | — | — |

Plus `index.html` (sommaire, carte, mode d'emploi) et `lexique.html` (mot simple → mot technique → chapitre → doc technique).

## 6. Widgets

Chaque widget est un fichier JS qui s'attache à un `<div data-widget="nom">` du chapitre. Il dessine dans un canvas de la largeur de la colonne, réagit au toucher et à la souris, et affiche ses compteurs sous le dessin.

| Widget | Contenu | Ce qu'il faut remarquer | Contrôle chiffré |
|--------|---------|-------------------------|------------------|
| allumettes | poser et déplacer des clous ; les allumettes de longueur 1 (tolérance 1e-6) apparaissent seules ; compteurs points, allumettes, ratio. Modèles : triangle, hexagone + centre, grille triangulaire, grille d'Erdős | même bien placés, les clous gagnent peu d'allumettes chacun | hexagone + centre : 7 points, 12 allumettes |
| croissances | courbes `n · n^{C/log log n}` et `n^{1+δ}` en échelle logarithmique ; curseurs C et δ ; croisement affiché `n* = e^{e^{C/δ}}` (en puissance de 10) | la puissance gagne toujours, parfois très tard | `n*` conforme à la formule |
| deux-carres | **cercle** : choix de bons premiers (5, 13, 17, 29, 37) ; `N` = leur produit ; points entiers du cercle de rayon `√N` ; compteur. **Coût** : curseur t (jusqu'à 30) ; chemins `2^t`, taille de grille nécessaire, exposant gagné `t log 2 / log n` (calcul en logarithmes) | chaque bon premier double les chemins, mais la grille grossit plus vite | nombre de points = `4·2^t` pour t ≤ 5 |
| ombre | vrais nombres de `Q(ζ_8)` (2 écrans) ou `Q(ζ_7)` (3 écrans). Quelques pas `u_j = α_j / c(α_j)` ; points = sommes `Σ n_j u_j` (petits entiers `n_j`) ; chaque écran affiche son plongement ; l'écran 1 est le plan final ; arêtes entre points qui diffèrent d'un pas ; bouton « fenêtre aussi sur les écrans cachés » | (05) un pas fait 1 sur chaque écran ; (09) sans fenêtre sur les écrans cachés, les points s'entassent sur l'écran 1 quand on augmente les `n_j` ; avec elle, leur nombre reste borné | `|σ_k(u_j)| = 1` à 1e-9 près pour tout k, j |
| pas-magiques | on déplace z ; on voit son reflet `z̄`, `z·z̄` (lien Pythagore) et `z/z̄` sur le cercle unité (angle doublé). Puis version 3 écrans : α de `Q(ζ_7)` réglé par petits curseurs entiers | « nombre ÷ son reflet » : on garde le cap, la longueur devient 1 partout | `|z/z̄| = 1` à 1e-12 près |
| tiroirs | m interrupteurs donnent `2^m` tickets, qui tombent dans h tiroirs (animation, rangement pseudo-aléatoire ou adverse) ; curseurs m ≤ 10 et h | le tiroir le plus plein a toujours au moins `2^m/h` tickets | max ≥ `⌈2^m/h⌉` sur 1000 tirages |
| fenetre | pavage `Z²` mis à l'échelle ; pas unité de type Erdős ; disque fenêtre de rayon R ; bouton « lancer » ; compteurs points et paires ; histogramme des lancers avec la ligne de moyenne ; dessin du chevauchement de deux disques (`ρ_R`) | au moins un lancer fait mieux que la moyenne | moyenne empirique de E_a proche de `\|U\| ρ_R E[N_a]` (écart < 5 % sur 2000 lancers) |
| bilan | **bilan** : curseurs γ, B, f ; barres pas `e^{γf}`, points `e^{Bf}`, paires `½ n e^{γf/2}` ; `δ = γ/4B` ; mode grille d'Erdős (f = 1, t varie). **course** : curseur ℓ ; `t log 2` contre `log H_ℓ = c·ℓ log ℓ`, avec c illustratif et signalé comme tel | l'exposant reste fixe dans la preuve, il s'écrase dans la grille | δ affiché = γ/4B |
| budget | curseur ℓ (et t) ; jauge : départ `d + 2`, coût des clés `3t`, plafond `d²/4`, avec `d = ℓ − 1` ; verdict « tour infinie garantie » ou « on ne sait pas » | peu de règles face à beaucoup de pièces libres : la tour ne s'arrête jamais | verdict = `[d + 2 + 3t ≤ d²/4]` |

`ombre` et `pas-magiques` calculent sur de vrais nombres algébriques. Dans `Q(ζ_m)`, `c` est la conjugaison complexe sous chaque plongement, donc le module 1 est exact. Les autres widgets sont des modèles fidèles mais simplifiés ; tout réglage arbitraire est signalé à l'écran.

## 7. Conventions techniques

- **Aucune dépendance, aucun CDN.** HTML + CSS + JS pur, canvas 2D. Scripts classiques (pas de modules ES, bloqués en `file://`). Liens relatifs uniquement : le site marche sous `/unit-distance/`, en local et hors ligne.
- **Mobile d'abord.** Une colonne, texte ≥ 17 px, interligne 1,6, marges latérales de 16 px, aucun défilement horizontal, cibles tactiles d'au moins 44 px. `<meta name="viewport" content="width=device-width, initial-scale=1">`.
- **Navigation.** Barre fixe en bas : `← précédent · sommaire · suivant →`, avec la progression (« 05 / 14 »).
- **Schémas.** SVG intégré, dessiné à la verticale pour un écran étroit. Pas de mermaid.
- **Couleurs.** Palette du projet (bleu `#3B82F6`, vert `#10B981`, rouge `#EF4444`, ambre `#F59E0B`, indigo `#6366F1`, sarcelle `#0F766E`), définie en variables CSS, avec un mode sombre via `prefers-color-scheme`.
- **Formules** en texte Unicode simple, uniquement dans les encadrés.
- **Accessibilité.** Chaque canvas a un texte alternatif. Les compteurs sont du texte HTML, pas dessinés dans le canvas.

## 8. Publication

- `publier.sh` copie `_guide/` vers `/Users/yanntyb/Desktop/tyb-tech/sites/tyb_tech/public/unit-distance/` (rsync, sans `CONCEPTION.md`, `PLAN.md`, `publier.sh` ni `tests/`).
- Le site sert `public/` avec FrankenPHP (`php-server --root /app/public`) : les fichiers statiques passent avant Laravel.
- **Risque : `/unit-distance` sans barre finale.** `try_files {path}` ne reconnaît un dossier que si le chemin finit par `/`. Sans barre finale, la requête peut tomber sur Laravel et renvoyer 404. À vérifier en local avec l'image du site. Si 404 : ajouter `Route::redirect('/unit-distance', '/unit-distance/')` dans `routes/web.php`, avec un test Pest, comme l'exige le `CLAUDE.md` du site.
- Le build Docker copie tout `public/` : le guide part avec l'image. Le `.dockerignore` n'exclut pas `public/unit-distance`.
- Aucun commit ni push dans l'un ou l'autre repo sans demande explicite.

## 9. Vérification

- **Pages** : chacune chargée dans Chrome sans fenêtre (puppeteer, déjà installé dans le scratchpad), en 390×844 et en 360 px de large. Contrôles : zéro erreur JS, `document.documentElement.scrollWidth ≤ innerWidth`, liens internes valides, capture d'écran examinée.
- **Widgets** : les contrôles chiffrés du tableau 6 sont lancés par script dans la page ; le toucher est simulé (exemple : un toucher ajoute un clou).
- **Texte** : un relecteur indépendant vérifie l'exactitude mathématique de chaque chapitre et repère tout mot technique utilisé avant d'être expliqué.
- **Publication** : en local, avec l'image FrankenPHP du site : `/unit-distance/` renvoie 200 et `index.html`, `/unit-distance` renvoie 200 ou une redirection, les assets renvoient 200.

## 10. Hors périmètre

- Démontrer les briques arithmétiques (Chebotarev, Golod–Shafarevich, Shafarevich, Minkowski).
- Modifier les docs techniques existantes, sauf un lien vers le guide dans le README du théorème.
- Toute modification du site autre que `public/unit-distance/`, et éventuellement la redirection de la section 8.
