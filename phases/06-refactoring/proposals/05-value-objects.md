# Proposition 5 : Validations dans des Value Objects

## References necessaires

- `valueObject` : exemple de Value Object avec validation
- `entity` : exemple d'entite qui agregre des VOs

## Instructions

**Inspecter** : est-ce que les validations (format email, longueur min/max, valeurs autorisees) sont inline dans l'entite ou le use case, ou dans des Value Objects dedies ?

**Skip si** : les validations sont deja dans des VOs.

**Pourquoi** :
- Chaque regle de validation a un **nom** (c'est un concept metier, pas juste un `if`)
- Chaque VO a son propre **enum d'erreur** — le type d'erreur de l'entite est un type union des erreurs de chaque VO
- Les VOs sont **testables en isolation** et **reutilisables** entre entites
- `VO.create()` retourne `CommandResult<VoError>`, `VO.from()` reconstruit sans validation (donnees de confiance, ex: depuis la DB)

**Exemple** : lis et montre le fichier de reference `valueObject` — noter le `private constructor`, `static create()` avec validation, `static from()` sans validation, et l'enum d'erreur de validation.

Montrer aussi le fichier de reference `entity` pour voir comment l'entite agregre les VOs et propage les erreurs.

**STOP** — attendre decision
