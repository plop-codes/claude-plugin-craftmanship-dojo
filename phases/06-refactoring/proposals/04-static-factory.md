# Proposition 4 : Static Factory (`Entity.create()`)

## References necessaires

- `entity` : exemple d'entite avec factory statique

## Instructions

**Inspecter** : est-ce que l'entite a un constructeur public, ou utilise-t-elle `private constructor` + `static create()` ?

**Skip si** : l'entite utilise deja le pattern factory.

**Pourquoi** :
- **Langage metier** : `Order.create(...)` est plus expressif que `new Order(...)`. Le nom de la methode peut refleter l'intention metier.
- **Validation a la creation** : la factory peut valider les donnees et retourner un `CommandResult` avec une erreur typee au lieu de lancer une exception.
- **Immutabilite** : le constructeur prive empeche la creation d'entites dans un etat invalide.

**Exemple** : lis et montre le fichier de reference `entity` — noter `static create()` qui valide chaque Value Object et retourne `CommandResult`. Montrer aussi comment `static reconstitute()` permet de recreer depuis la base (sans validation).

**STOP** — attendre decision
