# Propositions d'architecture — evolution du projet

> Index centralisé de toutes les propositions d'architecture pour les versions successives du Visual Proof Assistant.

Chaque proposition décrit le **diagnostic** de la version précédente et la **vision** pour la version suivante.

## 🎯 Comprendre le mouvement

Pourquoi les versions évoluent-elles de cette façon ? Quel est le **fil conducteur** ?

→ **[Lire "Le mouvement des versions"](MOUVEMENT.md)** — la logique unifiée qui guide l'évolution (V1 → V6)

---

## Index

| Version | Titre | Focus | Fichier |
|---------|-------|-------|---------|
| **V1** | Cablage compact à contrats forts | Réduire le monolithe en 13 modules ES6 avec contrats explicites | [v1-modules.md](v1-modules.md) |
| **V2** | Un sens par fichier | Réorganiser le code autour du concept de "sens" (blocs atomiques) | [v2-contrats.md](v2-contrats.md) |
| **V3** | Un cablage = un dossier | Structurer les cablages (circuits assemblant des sens) comme dossiers | [v3-contraintes.md](v3-contraintes.md) |
| **V4** | Primitives graphiques abstraites | Extraire une couche `primitives.js` pour émuler p5.js, réduire la dépendance | [v4-sens.md](v4-sens.md) |
| **V5** | Primitives graphiques abstraites (v2) | Consolider les primitives, améliorer la séparation backend/frontend | [v5-abstraites.md](v5-abstraites.md) |
| **V6** | Contrat de rendu émergent | Formaliser le pipeline 4-phases en classe abstraite RenderContract | [v6-contrats.md](v6-contrats.md) |
| **V7** | Contrat de cablage explicite | Formaliser la structure répétée des cablages en classe CablageContract | [v7-cablages.md](v7-cablages.md) |

---

## Structure générale

Chaque proposition suit le modèle :

1. **Diagnostic de la version N-1** — les problèmes identifiés
2. **Vision pour la version N** — la solution proposée
3. **Architecture** — structure de fichiers, contrats, dépendances
4. **Fichiers critiques** — quoi lire pour comprendre
5. **Bénéfices** — ce qui s'améliore
6. **Vérification** — comment tester que ça marche

---

## Fil conducteur architectural

```
V1 (Modules)
   ↓ "dupliqué la logique de layout"
V2 (Contrats)
   ↓ "sens implicite dans le code"
V3 (Contraintes)
   ↓ "pas de structure pour les cablages"
V4 (Sens)
   ↓ "dépendance trop forte à p5.js"
V5 (Abstraites)
   ↓ "pipeline implicite dans les rendus"
V6 (Contrats de rendu)
   ↓ "structure cablage implicite dans 4 cablages identiques"
V7 (Contrats de cablage)
   ✓ CablageContract = classe abstraite
```

---

## Points clés transversaux

### Contrats (Sens / Contrat / Câblage)

Chaque version renforce la visibilité des trois dimensions :

- **Sens** : ce qu'un bloc/circuit fait mathématiquement
- **Contrat** : la signature typée (entrées/sorties)
- **Câblage** : comment le sens est assemblé techniquement

### Séparation des couches

```
V1 : monolithe
V2 : modules sans structure claire
V3 : cablages = dossiers
V4 : primitives = interface p5.js
V5 : couches bien définies
V6 : pipeline = classe abstraite
```

### Réutilisabilité

```
V1 : impossible, code global
V2 : partiellement, par modules
V3 : meilleure, par cablages
V4 : bonne, via primitives abstraites
V5 : très bonne, couches propres
V6 : maximale, polmorphisme + héritage
```

---

## Comment lire ce dossier

1. **Pour comprendre V6** → lire [v6-contrats.md](v6-contrats.md)
2. **Pour voir l'évolution** → parcourir dans l'ordre V1 → V6
3. **Pour comparer deux versions** → lire les sections "Diagnostic" et "Bénéfices"
4. **Pour implémenter une version** → lire la section "Architecture" et "Fichiers critiques"

---

## Lien vers les implémentations

Chaque version a une implémentation correspondante :

- `../1_modules/` → v1-modules.md
- `../2_contrats/` → v2-contrats.md
- `../3_contraintes/` → v3-contraintes.md
- `../4_sens/` → v4-sens.md
- `../5_abstraites/` → v5-abstraites.md
- `../6_contrats/` → v6-contrats.md
- `../7_cablages/` → v7-cablages.md

---

[← Retour à l'index](../README.md)
