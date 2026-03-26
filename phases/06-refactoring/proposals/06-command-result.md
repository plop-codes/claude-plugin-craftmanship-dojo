# Proposition 6 : Gestion des erreurs metier avec `CommandResult` (pas d'exceptions)

## References necessaires

- `useCase` : exemple de use case avec CommandResult
- `controller` : exemple de controller avec switch sur les erreurs
- `commandResult` : implementation de CommandResult

## Instructions

**Inspecter** : est-ce que le use case utilise `throw new Error(...)` ou des exceptions pour signaler des erreurs metier (validation echouee, entite introuvable, doublon, etc.) ? Ou est-ce qu'il retourne un `CommandResult<E>` ?

**Skip si** : le use case retourne deja `CommandResult<E>` avec des erreurs typees (enum).

**Pourquoi** :
- Les **exceptions sont pour les cas exceptionnels** (panne reseau, base inaccessible) — pas pour la logique metier. Un email invalide, c'est un cas metier normal, pas une exception.
- Avec `throw`, le controller est oblige de faire un `try/catch` et de deviner le type d'erreur (string ? classe custom ?). C'est fragile, non type, et difficile a tester.
- Avec `CommandResult<E>`, le use case **declare explicitement** les erreurs possibles dans son type de retour. Le controller fait un `switch (result.getError())` avec les valeurs d'un **enum** — c'est exhaustif, type, et le compilateur peut verifier que tous les cas sont geres.
- Le flux est lineaire : pas de `try/catch`, pas de surprises. Le code se lit de haut en bas.

**Le pattern complet** :
1. Le use case retourne `Promise<CommandResult<E>>` ou `E` est un enum ou un type union d'erreurs
2. En cas de succes : `CommandResult.success()` ou `CommandResult.success(viewModel)` pour les queries
3. En cas d'erreur metier : `CommandResult.failure(ErrorEnum.VALUE)`
4. Le controller verifie `result.isSuccess()` / `result.isFailure()` et mappe vers le bon status HTTP via un `switch`
5. Le type `E` est `never` tant qu'aucun scenario d'erreur n'existe — il evolue naturellement quand on ajoute des cas d'erreur

**Exemple — le use case** : lis et montre le fichier de reference `useCase`. Noter :
- L'enum d'erreurs du use case
- Le type union qui combine les erreurs du domaine (VOs) et les erreurs du use case
- Le retour `CommandResult.failure(result.getError())` qui propage l'erreur du domaine
- Le `try/catch` uniquement pour l'erreur infra (acces DB), pas pour la logique metier

**Exemple — le controller** : lis et montre le fichier de reference `controller`. Noter :
- Le `switch (result.getError())` qui mappe chaque erreur vers un status HTTP (409, 400, 500)
- Pas de `try/catch` — le controller ne gere pas d'exceptions
- Le flux lineaire : success → 201, sinon switch sur l'erreur

**Exemple — le CommandResult lui-meme** : lis et montre le fichier de reference `commandResult`. Expliquer :
- `private constructor` — impossible de creer un resultat dans un etat incoherent
- `static success()` / `static failure()` — factories explicites
- `getValue<T>()` / `getError()` — acces securise (throw si mauvais usage, mais c'est un bug de programmation, pas une erreur metier)

**STOP** — attendre decision
