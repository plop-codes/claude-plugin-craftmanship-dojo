# Proposition 1 : Vertical Slices

## References necessaires

- Skill : `vertical-slice`

## Instructions

**Inspecter** : est-ce que tout le code de la feature est dans le bon dossier `src/{domain}/{boundedContext}/{feature}/` ?

**Ce qui peut etre partage** (et donc vivre en dehors du vertical slice) :
- Les entites de domaine (`shared/` dans le bounded context)
- Les Value Objects
- Les modules NestJS partages

**Tout le reste** (controller, use case, repository interface, repository implementation) doit etre dans le vertical slice.

**Pourquoi** : la co-location permet de comprendre une feature en regardant un seul dossier. Pas besoin de naviguer entre `controllers/`, `services/`, `repositories/` — tout est au meme endroit.

**Exemple** : montre la structure du dossier de la feature du developpeur. Lis le skill de reference `vertical-slice` pour les principes.

**STOP** — attendre decision
