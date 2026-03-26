# Proposition 2 : Controller sans logique metier

## References necessaires

- `controller` : exemple de controller
- `useCase` : exemple de use case

## Instructions

**Inspecter** : est-ce que le controller contient de la logique metier (validation de donnees, transformations, conditions au-dela du mapping result → status HTTP) ?

**Skip si** : le controller ne fait que deleguer au use case et mapper le `CommandResult` vers un status HTTP.

**Pourquoi** : le controller est un **adaptateur** — il traduit HTTP vers le domaine et inversement. La logique metier dans le controller empeche de la tester en isolation et cree un couplage au framework web.

**Exemple** : lis et montre le fichier de reference `controller` — noter comment il delegue tout au use case et utilise un `switch` sur `result.getError()` pour le status HTTP.

Aussi montrer le fichier de reference `useCase` comme exemple de use case qui porte la logique.

**STOP** — attendre decision
