# Concentration -- du global au local

> [Retour aux cablages](README.md) | [Fiche objet : Concentrer](../sens/concentrer.md)

## Exemples

### 1. Le doigt sur le globe

Une sphere eclairee par `phi`. Chaque point recoit une intensite `|<phi|n(x)>|`.
- Main ouverte : chaleur totale sous la main (integrale sur une grande zone)
- Main fermee : chaleur sous les doigts (integrale sur une petite zone)
- Bout du doigt : intensite en un seul point `x_0`

Lien direct avec le circuit [projeter](projeter.md) : la concentration remplace l'integration par une evaluation.

### 2. Le micro qui zoome

Un micro capte le son dans une salle (integrale du bruit sur tout l'espace).
- Loin : bruit ambiant de la salle
- Plus pres d'un instrument : le son de cet instrument domine
- Colle a la corde : le son de cette corde seule

Contrat : `(Salle -> R) -> R`. Le sens passe de "volume global" a "volume de la guitare".

> Circuit detaille : [ecouter](ecouter.md)

### 3. La balance et le grain de sable

Tu peses un tas de sable.
- Tas entier : masse totale
- Poignee : masse d'une poignee
- Un grain : masse d'un grain

Contrat : `Tas -> R`. Le sens passe de "masse du tas" a "masse d'un grain". La concentration isole un element.

### 4. La carte de temperature

Une carte meteo donne la temperature.
- France entiere : temperature moyenne nationale
- Departement : temperature moyenne locale
- Point GPS : temperature ici, maintenant

Contrat : `(Terre -> R) -> R`. Meme operation, meme type, sens different a chaque echelle.

### 5. Le vote

Une election donne un resultat.
- National : somme de tous les votes
- Bureau de vote : resultat local
- Un electeur : l'opinion d'une seule personne

Contrat : `(Population -> {0,1}) -> R`. Le sens passe du collectif a l'individuel.

## Le point commun

Dans chaque exemple, le **sens** se deplace sur l'axe global <-> local tandis que le **contrat** reste le meme. La construction, la limite (delta de Dirac) et le lien avec le [produit de dualite](../sens/observer.md) sont decrits dans la [fiche concentrer](../sens/concentrer.md).
