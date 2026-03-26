# Phase 3 : Explication pedagogique (interactive)

## References necessaires

- `dsl` : exemple de fichier DSL
- `e2eDriver` : exemple de driver e2e
- `testApp` : infrastructure de test (TestApp)

## Preambule

> "Maintenant que le test est en place, je vais t'expliquer comment chaque partie fonctionne. Dis **'j'ai compris'** (ou 'ok', 'suivant', 'next') apres chaque explication pour passer a la suite."

6 points d'explication. Chacun est suivi d'un **STOP** — attendre que l'utilisateur confirme avant de continuer.

---

### 3.1 — Le DSL (l'interface)

Explique :
- Le DSL est un **contrat** ecrit en langage metier. C'est une interface TypeScript pure, sans implementation.
- Il decrit **ce que** le test verifie, pas **comment** il le verifie.
- Avantage : le meme DSL peut avoir un driver e2e (avec base de donnees) ET un driver unitaire (in-memory). Le spec ne change pas.
- Montre le DSL genere, puis lis et montre un extrait du fichier de reference `dsl` comme exemple mature avec plusieurs interfaces.

**STOP** — attendre "j'ai compris"

---

### 3.2 — Le Driver (l'implementation du contrat)

Explique :
- Le driver **implemente** le DSL. Tout le code specifique au framework (HTTP, SQL, containers) vit ici.
- Chaque scenario a son propre driver. Un driver = une classe qui implemente une interface DSL.
- Les champs prives : `testApp` (l'application NestJS + containers) et `response` (la reponse HTTP).
- `given...()` = setup du contexte (insertion de donnees, configuration)
- `when...()` = action (appel HTTP)
- `then...()` = verification (statut HTTP + etat en base)
- Montre le driver genere, puis lis et montre un extrait du fichier de reference `e2eDriver`.

**STOP** — attendre "j'ai compris"

---

### 3.3 — Le Spec (l'orchestrateur simple)

Explique :
- Le spec est le fichier le plus simple : il instancie le driver et appelle les methodes dans l'ordre.
- **Aucune logique**, aucun `expect`, aucun import de framework de test (sauf vitest describe/test).
- Avantage : en lisant le spec, on comprend le scenario metier en 5 secondes. C'est de la documentation vivante.
- Montre le spec genere.

**STOP** — attendre "j'ai compris"

---

### 3.4 — TestApp (l'infrastructure de test)

Explique :
- `TestApp.start()` demarre les containers necessaires (PostgreSQL, Mailpit, etc.) puis cree l'application NestJS connectee a ces containers.
- Les variables d'environnement (`POSTGRES_HOST`, `SMTP_HOST`, etc.) sont configurees dynamiquement avec les ports des containers.
- `cleanup()` arrete tout proprement (app NestJS + containers).
- Lis et montre le contenu du fichier de reference `testApp`.

**STOP** — attendre "j'ai compris"

---

### 3.5 — Supertest (les appels HTTP)

Explique :
- `request(this.testApp.app.getHttpServer())` cree un client HTTP qui pointe vers le serveur NestJS du test.
- `.post('/api/...')` ou `.get('/api/...')` fait un vrai appel HTTP, comme le ferait un navigateur ou Postman.
- `.send({...})` envoie le body JSON.
- La reponse est stockee dans `this.response` pour les assertions `then`.
- C'est un vrai test d'integration : la requete traverse le controller, le use case, le repository, et la base.
- Montre l'exemple depuis le driver genere.

**STOP** — attendre "j'ai compris"

---

### 3.6 — Raw SQL (verification en base)

Explique :
- `this.testApp.app.get(DataSource).query('SELECT ...')` execute une requete SQL directe sur la base de test.
- Pourquoi du SQL brut et pas l'ORM ? Pour verifier ce qui est **vraiment** persiste, independamment du mapping TypeORM. Si le mapping est faux, le test SQL le detectera.
- C'est le meme principe que verifier un resultat "a la main" plutot que de faire confiance a l'outil.
- Montre l'exemple depuis le driver genere.

**STOP** — attendre "j'ai compris"

---

## Transition

> "Tu as compris comment le test e2e fonctionne. Passons au developpement !"
