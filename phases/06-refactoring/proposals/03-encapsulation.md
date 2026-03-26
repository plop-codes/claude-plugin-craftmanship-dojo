# Proposition 3 : Encapsulation / Oriente objet

## References necessaires

- `entity` : exemple d'entite avec methodes metier
- Skill : `ddd-patterns`

## Instructions

**Inspecter** : est-ce que le use case modifie directement les proprietes d'une entite, ou est-ce qu'il passe par des methodes metier de l'entite ?

**Skip si** : l'entite expose des methodes metier et le use case les utilise.

**Pourquoi** : l'aggregate root est le **gardien des invariants metier**. Si le use case modifie directement `entity.name = 'foo'`, n'importe quel code peut casser les regles. En passant par `entity.rename('foo')`, l'entite peut valider, verifier les contraintes, et garantir la coherence.

**Exemple** : lis et montre le fichier de reference `entity` — noter les methodes metier qui encapsulent les mutations. Lire aussi le skill de reference `ddd-patterns` pour les principes d'aggregate root.

**STOP** — attendre decision
