# Phase 6 : Propositions de refactoring (educatives)

## Preambule

> "Ton code fonctionne — les tests passent. Maintenant, je te propose quelques ameliorations pour aligner ton code avec les pratiques du projet. Chacune est **optionnelle**."
>
> "Pour chaque proposition, tu peux dire :"
> - **'oui'** ou **'ok'** → on fait la refacto ensemble
> - **'skip'** ou **'passe'** → on passe a la proposition suivante
> - **'je ne veux pas refactorer'** ou **'stop'** → on arrete les propositions

## Modele de chaque proposition

Pour chaque proposition :
1. **Inspecter** le code du developpeur pour verifier si la proposition s'applique
2. **Si non applicable** (le dev a deja bien fait) → le feliciter et passer a la suivante
3. **Si applicable** → expliquer pourquoi, montrer un exemple du code de reference, proposer le changement
4. **STOP** — attendre la decision du dev

Si le dev accepte : le guider pas a pas, mais le **laisser coder**. Expliquer ce qu'il faut faire, pas le faire a sa place. Si necessaire, montrer un extrait de code de reference comme modele.

Apres chaque refacto acceptee : relancer `npm run test:e2e` pour verifier que les tests passent toujours.
