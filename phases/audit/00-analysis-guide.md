# Phase 1 : Analyse de la codebase

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

## Section 2 : Grille d'analyse — 7 dimensions

Pour chaque dimension active dans `config.audit.default-levels`, inspecter la codebase selon les heuristiques ci-dessous. Si `config.audit` n'existe pas, toutes les dimensions sont actives par defaut.

### Dimension 1 : Separation en couches

**Objectif** : le code est-il organise en couches distinctes (presentation, logique metier, acces donnees) ?

**Quoi chercher** :
- Fichiers qui gerent les requetes HTTP :
  - TypeScript/NestJS : `@Controller`, `@Get`, `@Post`, `@Put`, `@Delete`
  - Express/Fastify : `router.get`, `router.post`, `app.get`, `app.post`
  - Java/Spring : `@RestController`, `@RequestMapping`, `@GetMapping`
  - C#/ASP.NET : `[ApiController]`, `[HttpGet]`, `[HttpPost]`
  - Python/FastAPI : `@app.get`, `@router.get`
  - Go : `http.HandleFunc`, `router.GET`, `e.GET`

**Signaux positifs** (ACQUIS) :
- Les fichiers HTTP **ne contiennent pas** d'appels ORM/DB directs
- Il existe une couche intermediaire (services, use cases, handlers)
- Il existe des fichiers d'acces donnees dedies (repositories, DAOs)

**Signaux negatifs** (NON ATTEINT) :
- Les handlers/controllers contiennent des imports ORM (`Repository`, `DataSource`, `PrismaClient`, `EntityManager`, `Session`, `DbContext`)
- Pas de couche service/use case — le controller appelle directement la DB
- Logique metier (conditionnels complexes, validations, transformations) dans les controllers

**Sous-etapes possibles** :
- Extraire un controller pur (adaptateur HTTP)
- Creer un service/use case pour la logique metier
- Creer un repository pour l'acces donnees

**Prerequis** : Aucun
**Enable** : Dimensions 2, 3

---

### Dimension 2 : Use cases + screaming architecture

**Objectif** : la structure du code rend-elle visible les besoins metier ?

**Quoi chercher** :
- Organisation des dossiers sous le chemin source principal
- Nommage des fichiers et des classes

**Signaux positifs** (ACQUIS) :
- Fichiers nommes explicitement d'apres l'action metier (`*.useCase.*`, `Create*.ts`, `Register*.java`, `handle_*.py`)
- Structure par domaine/feature : `src/{domaine}/{feature}/` ou `src/modules/{domaine}/`
- Chaque dossier de feature contient tout ce qu'il faut (controller, use case, repo)

**Signaux negatifs** (NON ATTEINT) :
- Structure par couche technique : `src/controllers/`, `src/services/`, `src/repositories/`, `src/models/`
- Noms generiques : `UserService` qui fait 500 lignes avec 15 methodes
- Impossible de comprendre ce que fait l'application en lisant les noms de dossiers

**Sous-etapes possibles** :
- Creer des fichiers use case explicites
- Reorganiser en vertical slices
- Adopter un nommage qui revele l'intention metier

**Prerequis** : Dimension 1
**Enable** : Dimensions 4, 5

---

### Dimension 3 : Tests E2E

**Objectif** : le projet a-t-il des tests de bout en bout qui valident le comportement ?

**Quoi chercher** :
- Fichiers de test E2E : `*.e2e-spec.*`, `*.e2e.*`, `*.e2e.test.*`, `*.integration.*`, `*.acceptance.*`
- Infrastructure de test :
  - TypeScript : testcontainers, supertest, TestApp
  - Java : `@SpringBootTest`, TestRestTemplate, MockMvc, Testcontainers
  - C# : `WebApplicationFactory`, TestServer
  - Go : `httptest.NewServer`
  - Python : TestClient (FastAPI), Client (Django)

**Signaux positifs** (ACQUIS) :
- Tests E2E existent et couvrent les features principales
- Infrastructure de test avec base de donnees reelle (testcontainers, docker-compose)
- Pattern structure de test (DSL/Driver ou equivalent)

**Signaux negatifs** (NON ATTEINT) :
- Aucun test E2E
- Seuls des tests avec mocks existent (pas de vrai DB)
- Tests fragiles qui ne valident que des details d'implementation

**Sous-etapes possibles** :
- Mettre en place l'infrastructure de test (TestApp, testcontainers)
- Ecrire les premiers tests E2E
- Adopter un pattern de test structure (DSL/Driver/Spec)

**Prerequis** : Dimension 1
**Enable** : Dimension 5

---

### Dimension 4 : Rich domain model

**Objectif** : la logique metier est-elle dans les entites du domaine (pas dans les services) ?

**Quoi chercher** :
- Fichiers entite/modele du domaine
- Methodes sur les entites vs setters publics
- Value Objects

**Signaux positifs** (ACQUIS) :
- Entites avec `private constructor` (ou equivalent) et factory methods (`create`, `from`, `reconstitute`)
- Methodes metier sur les entites (pas juste des getters/setters)
- Value Objects pour les champs valides (email, montant, etc.)
- Les use cases appellent des methodes de l'entite plutot que de manipuler ses proprietes

**Signaux negatifs** (NON ATTEINT) :
- Entites anemiques : classes avec uniquement des proprietes publiques ou getters/setters
- Logique metier dans les services/use cases qui manipulent directement les champs des entites
- Setters publics sur les entites (`entity.status = 'active'` au lieu de `entity.activate()`)
- Validations dans les services plutot que dans les entites/VOs
- Constructeurs publics sans validation

**Sous-etapes possibles** :
- Encapsuler les proprietes des entites (methodes metier au lieu de setters)
- Introduire le pattern static factory (`Entity.create(...)`)
- Extraire les Value Objects pour les champs avec validation
- Deplacer la logique metier des services vers les entites

**Prerequis** : Dimension 2
**Enable** : Dimensions 5, 6, 7

---

### Dimension 5 : Tests unitaires + clean architecture

**Objectif** : le code est-il testable unitairement grace a l'inversion de dependances ?

**Quoi chercher** :
- Interfaces/ports pour les dependances externes
- Implementations de test (in-memory, fake, stub)
- Tests unitaires sur les use cases
- Constructeurs des use cases (interface vs concrete)

**Signaux positifs** (ACQUIS) :
- Interfaces definies pour les repositories et services externes (ports)
- Implementations in-memory pour les tests (`*InMemory*`, `*Fake*`, `*Stub*`, `*Mock*`)
- Tests unitaires rapides qui n'utilisent pas de conteneurs Docker ni de vraie DB
- Use cases qui dependent d'interfaces, pas d'implementations concretes (DI par constructeur)
- Pattern CommandResult ou equivalent (gestion d'erreurs typee sans exceptions)

**Signaux negatifs** (NON ATTEINT) :
- Use cases importent directement les implementations concretes (TypeORM Repository, PrismaClient...)
- Pas d'interfaces pour les dependances externes
- Tous les tests sont des tests E2E/integration (lents)
- Gestion d'erreurs par exceptions uniquement

**Sous-etapes possibles** :
- Creer des interfaces (ports) pour les repositories
- Implementer des adaptateurs in-memory pour les tests
- Ecrire les premiers tests unitaires sur les use cases
- Introduire l'inversion de dependances (DI par constructeur)
- Introduire le pattern CommandResult pour la gestion d'erreurs typee

**Prerequis** : Dimensions 2, 3
**Enable** : Dimension 6

---

### Dimension 6 : TDD

**Objectif** : les tests guident-ils le developpement et le design du code ?

**Quoi chercher** :
- Historique git : les tests sont-ils ecrits avant l'implementation ?
- Qualite et structure des tests

**Signaux positifs** (ACQUIS) :
- Commits de test precèdent les commits d'implementation (pattern RED → GREEN → REFACTOR visible dans `git log`)
- Nommage BDD dans les tests : `should`, `Given...When...Then`, noms de scenarios metier
- Bonne couverture des cas limites et des erreurs
- Tests lisibles qui servent de documentation

**Signaux negatifs** (NON ATTEINT) :
- Tests ecrits apres l'implementation (ou absents)
- Tests qui testent l'implementation plutot que le comportement
- Faible couverture des cas d'erreur
- Tests fragiles qui cassent a chaque refactoring

**Sous-etapes possibles** :
- Adopter le cycle RED → GREEN → REFACTOR
- Pratiquer le TDD sur les use cases (orientation BDD)
- Pratiquer le TDD sur les algorithmes complexes
- Nommer les tests en termes de comportement metier

**Note** : cette dimension est difficilement detectable par analyse statique seule. Demander au tech lead son evaluation.

**Prerequis** : Dimension 5
**Enable** : Dimension 7

---

### Dimension 7 : DDD (strategique puis tactique)

**Objectif** : le code est-il aligne avec le domaine metier, avec un langage commun ?

**Quoi chercher** :
- Organisation en bounded contexts
- Langage ubiquitaire dans le code
- Patterns tactiques (aggregats, domain events)

**Signaux positifs** (ACQUIS) :
- Structure en bounded contexts clairs (`src/{context}/`)
- Nommage des classes et methodes aligne avec le vocabulaire metier (ubiquitous language)
- Aggregats comme points d'entree pour les mutations
- Domain events pour la communication inter-contextes
- Pas d'imports directs entre bounded contexts (communication par events ou DTOs)

**Signaux negatifs** (NON ATTEINT) :
- Noms techniques generiques (`DataProcessor`, `Handler`, `Manager`, `Helper`, `Utils`)
- Pas de separation en bounded contexts
- Imports directs entre domaines non lies
- Pas de domain events — communication synchrone entre contextes

**Sous-etapes possibles** :
- Identifier les bounded contexts du domaine
- Adopter le langage ubiquitaire (renommer classes et methodes)
- Introduire les aggregats comme points d'entree
- Introduire les domain events pour la communication inter-contextes
- Eliminer les imports croises entre contextes

**Prerequis** : Dimensions 4, 5
**Enable** : —

---

## Section 3 : Opportunites supplementaires

Au-dela des 7 dimensions par defaut, chercher des opportunites specifiques a la codebase analysee :

- **SQL brut pour les lectures** : si l'ORM est utilise pour des queries de lecture complexes (joins, projections), proposer du SQL brut ou un query builder
- **Gestion d'erreurs typee** : si les erreurs sont gerees par exceptions ou codes magiques, proposer un pattern Result/Either
- **Logging structure** : si les logs sont des `console.log` / `System.out.println`, proposer un logger structure
- **Configuration** : si la config est en dur dans le code, proposer l'injection de configuration
- **Autres patterns specifiques** detectable dans la codebase

Ces opportunites doivent etre inserees dans la roadmap au niveau de prerequis adequat.

---

## Section 4 : Construction de la roadmap

Apres avoir analyse toutes les dimensions, construire la roadmap en suivant cet algorithme :

1. **Classer chaque dimension** : ACQUIS / PARTIEL / NON ATTEINT
2. **Identifier le front de progression** : les dimensions dont tous les prerequis sont ACQUIS mais qui sont elles-memes PARTIEL ou NON ATTEINT
3. **Ordonner le front** par impact pedagogique :
   - Les etapes fondamentales d'abord (celles qui debloquent le plus de dimensions suivantes)
   - A impact egal, les etapes les plus concretes et realisables d'abord
4. **Decouper en sous-etapes** : une dimension NON ATTEINTE peut contenir 2-4 sous-etapes independantes
5. **Numerotation continue** : les etapes sont numerotees de 1 a N, chaque sous-etape est une etape a part entiere

Pour chaque etape de la roadmap, preparer :
- **Titre court** (ex: "Extraire les controllers purs")
- **Description en 1 ligne**
- **Pourquoi maintenant** : quel prerequis est satisfait, qu'est-ce que ca debloque
- **Ce qu'il faut faire** : actions concretes avec noms de fichiers de la codebase
- **References** : quels fichiers de reference du plugin sont pertinents (skills, examples)

---

## Section 5 : Presentation du diagnostic

Presenter le diagnostic au tech lead dans ce format :

```
=== Diagnostic Architecture ===

Environnement detecte : {langage} / {framework} / {ORM} / {test framework}
Chemin source : {scan-path}

| # | Dimension | Statut | Details |
|---|-----------|--------|---------|
| 1 | Separation en couches | {ACQUIS/PARTIEL/NON ATTEINT} | {details concrets, fichiers cites} |
| 2 | Use cases + screaming archi | {statut} | {details} |
| 3 | Tests E2E | {statut} | {details} |
| 4 | Rich domain model | {statut} | {details} |
| 5 | Tests unitaires + clean archi | {statut} | {details} |
| 6 | TDD | {statut} | {details} |
| 7 | DDD | {statut} | {details} |
```

Puis la roadmap proposee :

```
=== Roadmap proposee ===

Les etapes suivantes sont ordonnees pour etre realisables independamment,
chacune preparant le terrain pour les suivantes.

Etape 1 : {titre}
  → {pourquoi maintenant}
  → {ce que ca debloque}

Etape 2 : {titre}
  → {pourquoi maintenant}
  → {ce que ca debloque}

...
```

Puis le detail de chaque etape avec :
- Les fichiers concrets de la codebase impactes
- Les references du plugin pertinentes
- Ce que le dev devra faire pendant l'onboarding

---

**STOP** — Attendre la reaction du tech lead.

Le tech lead peut :
- **Valider** tel quel → passer a la phase de generation
- **Retirer** des etapes → les exclure
- **Reordonner** des etapes → ajuster l'ordre
- **Ajouter** des etapes custom → les integrer dans la roadmap
- **Modifier** les details d'une etape → ajuster

Une fois la roadmap validee, passer a la phase de generation (`01-generation.md`).
