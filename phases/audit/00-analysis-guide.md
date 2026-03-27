# Phase 1 : Analyse des pratiques existantes

L'objectif est d'identifier les pratiques, patterns et conventions deja en place dans la codebase, puis de proposer des etapes de refactoring qui les enseignent progressivement a un developpeur qui ne les maitrise pas encore.

**On ne cherche pas ce qui manque. On cherche ce qui existe pour l'enseigner.**

---

## Section 1 : Detection de l'environnement

Avant toute analyse, identifier l'ecosysteme technique du projet.

### Instructions

1. **Lister la racine du projet** : `ls` sur le dossier racine du projet cible (pas le plugin)
2. **Detecter le langage et le framework** en lisant les fichiers de configuration :

| Fichier | Indique |
|---------|---------|
| `package.json` | Node.js / TypeScript — lire `dependencies` pour le framework (NestJS, Express, Fastify, Koa...) |
| `tsconfig.json` | TypeScript confirme |
| `pom.xml` | Java / Maven — chercher Spring Boot, Quarkus, Micronaut dans les dependances |
| `build.gradle` / `build.gradle.kts` | Java/Kotlin / Gradle |
| `go.mod` | Go — chercher le framework (Gin, Echo, Fiber, Chi...) |
| `requirements.txt` / `pyproject.toml` / `Pipfile` | Python — chercher Django, Flask, FastAPI |
| `*.csproj` / `*.sln` | C# / .NET — chercher ASP.NET Core |
| `Cargo.toml` | Rust — chercher Actix, Axum, Rocket |
| `Gemfile` | Ruby — chercher Rails, Sinatra |

3. **Detecter l'ORM / acces donnees** :
   - TypeScript : TypeORM, Prisma, Sequelize, Knex, Drizzle, MikroORM
   - Java : Hibernate, JPA, MyBatis, jOOQ
   - C# : Entity Framework, Dapper, NHibernate
   - Go : GORM, sqlx, ent
   - Python : SQLAlchemy, Django ORM, Tortoise

4. **Detecter le framework de test** :
   - TypeScript : Vitest, Jest, Mocha
   - Java : JUnit, TestNG, Spock
   - C# : xUnit, NUnit, MSTest
   - Go : testing (builtin), testify
   - Python : pytest, unittest

5. **Identifier la structure des dossiers** : lister les dossiers sous le chemin source principal (`src/`, `app/`, `lib/`, `internal/`, `cmd/`...)

Presenter un resume :
> **Environnement detecte** : {langage} / {framework} / {ORM} / {test framework}
> **Structure source** : {chemin principal} avec {description rapide}

---

## Section 2 : Identification des pratiques existantes

Scanner la codebase pour reperer **les pratiques et conventions que l'equipe utilise deja et applique de maniere coherente**. Ne lister que ce qui est effectivement en place — pas ce qui est absent, incomplet, ou "a faire".

**Regle** : une pratique n'est retenue que si elle est illustree par **au moins un fichier existant** qui l'applique correctement. "Les entites n'ont pas de factory method" n'est PAS une pratique — c'est une absence. Ne pas la lister.

### Quoi chercher

Pour chaque categorie ci-dessous, inspecter la codebase et noter **uniquement** les pratiques effectivement trouvees, avec des exemples concrets (noms de fichiers, extraits de code).

#### Organisation du code
- Comment les dossiers sont-ils structures ? (par feature, par couche technique, par domaine ?)
- Comment les fichiers sont-ils nommes ? (conventions de nommage)
- Y a-t-il une separation controller / service / repository ?
- Y a-t-il des modules / bounded contexts / packages ?

#### Patterns de code
- Comment les entites/modeles sont-ils construits ? (constructeurs publics, factory methods, builders ?)
- Comment la logique metier est-elle organisee ? (dans les services, dans les entites, dans des use cases ?)
- Comment les erreurs sont-elles gerees ? (exceptions, result types, error codes ?)
- Comment les validations sont-elles faites ? (dans les controllers, dans les entites, avec des value objects, avec des DTOs ?)
- Comment les dependances sont-elles injectees ? (constructeur, framework DI, imports directs ?)

#### Patterns de test
- Quels types de tests existent ? (E2E, integration, unitaires ?)
- Comment les tests sont-ils structures ? (DSL/Driver, arrange/act/assert, given/when/then ?)
- Comment les dependances sont-elles remplacees dans les tests ? (mocks, stubs, in-memory implementations ?)
- Y a-t-il une infrastructure de test partagee ? (TestApp, fixtures, helpers ?)

#### Acces aux donnees
- Comment les lectures sont-elles faites ? (ORM, SQL brut, query builders ?)
- Comment les ecritures sont-elles faites ? (via repository, via ORM direct, via use case ?)
- Y a-t-il des interfaces/ports pour les repositories ?

#### Autres conventions
- Toute autre pratique ou convention notable, specifique a cette codebase

**Important** : si une categorie n'a aucune pratique effective (ex: aucun test n'existe), ne rien lister pour cette categorie. Ne pas ecrire "Aucun test existant" — c'est une absence, pas une pratique.

---

## Section 3 : Construction des etapes de refactoring

A partir des pratiques identifiees, construire des etapes qui les enseignent a un nouveau developpeur.

### Regle absolue

**Ne proposer QUE des pratiques qui existent deja dans la codebase.** Si une pratique n'est pas illustree par au moins un fichier existant dans le projet, elle ne doit PAS devenir une etape de refactoring.

Exemples de violations a ne JAMAIS commettre :
- La codebase n'a pas de Value Objects → ne PAS proposer d'introduire des Value Objects
- La codebase n'a pas de CommandResult → ne PAS proposer d'introduire un CommandResult
- Les entites n'ont pas de factory method → ne PAS proposer d'encapsuler les entites
- Il n'y a pas de tests → ne PAS proposer d'ecrire des tests

Le tech lead peut ajouter des pratiques aspirationnelles s'il le souhaite — mais le skill ne doit JAMAIS les inventer lui-meme.

### Principe

Chaque etape de refactoring correspond a **une pratique deja appliquee dans la codebase** que le developpeur doit apprendre. L'etape le guide pour appliquer cette meme pratique sur le code qu'il vient d'ecrire pendant l'onboarding (phases 1-5).

### Algorithme

1. **Filtrer** : ne garder que les pratiques identifiees en section 2 qui sont **effectivement illustrees par du code existant** dans la codebase. Ecarter tout ce qui est absent, partiel, ou "a faire"
2. **Ordonner pedagogiquement** : des plus simples et fondamentales aux plus avancees
   - Les pratiques de structure/organisation en premier (facile a observer)
   - Les patterns de code ensuite (entites, erreurs, validations)
   - Les pratiques de test en dernier (necessitent de comprendre le reste)
3. **Formuler chaque pratique comme une etape de refactoring** : "voici comment on fait dans ce projet, applique-le a ton code"
4. **Citer des exemples existants** pour chaque etape : des fichiers de la codebase qui illustrent la pratique

### Pour chaque etape, preparer :
- **Titre court** (ex: "Organiser le code en vertical slices", "Separer les lectures avec un repository SQL")
- **La pratique enseignee** : quelle convention/pattern de la codebase le dev va apprendre
- **Exemples existants** : 1-3 fichiers de la codebase qui illustrent **deja** cette pratique (pas des fichiers "a refactorer")
- **Ce que le dev devra faire** : appliquer cette pratique au code ecrit pendant les phases precedentes de l'onboarding

---

## Section 4 : Presentation au tech lead

Presenter les resultats dans ce format :

```
=== Pratiques identifiees ===

Environnement detecte : {langage} / {framework} / {ORM} / {test framework}

Voici les pratiques et conventions que j'ai identifiees dans votre codebase :

1. {pratique} — ex: {fichier(s) concret(s)}
2. {pratique} — ex: {fichier(s) concret(s)}
...

=== Etapes de refactoring proposees pour l'onboarding ===

Ces etapes enseigneront progressivement ces pratiques a un nouveau developpeur :

Etape 1 : {titre}
  → Pratique enseignee : {description}
  → Exemples dans la codebase : {fichiers}

Etape 2 : {titre}
  → Pratique enseignee : {description}
  → Exemples dans la codebase : {fichiers}

...
```

---

**STOP** — Attendre la reaction du tech lead.

Le tech lead peut :
- **Valider** tel quel → passer a la phase de generation
- **Retirer** des etapes → les exclure
- **Reordonner** des etapes → ajuster l'ordre
- **Ajouter** des etapes custom → les integrer
- **Modifier** les details d'une etape → ajuster

Une fois les etapes validees, passer a la phase de generation (`01-generation.md`).
