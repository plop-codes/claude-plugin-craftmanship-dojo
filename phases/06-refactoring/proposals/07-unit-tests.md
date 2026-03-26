# Proposition 7 : Tests unitaires sur le UseCase

## References necessaires

- `inMemoryRepository` : exemple de repository in-memory
- `useCaseDriver` : exemple de driver de test unitaire
- Skill : `architecture`

## Instructions

**Inspecter** : la feature a-t-elle des tests unitaires sur le use case (dossier `test/usecase/`) ?

**Skip si** : des tests unitaires existent deja.

**Pourquoi** :
- Les tests e2e sont **lents** (demarrage des containers Docker, ~5-10 secondes par test). Parfait pour verifier que tout fonctionne de bout en bout, mais pas ideal pour iterer rapidement sur la logique metier.
- Les tests unitaires avec un **repository in-memory** sont **instantanes** et testent la logique en isolation.
- Pour ca, il faut une **interface** pour le repository (un **port**). Le use case depend de l'interface, pas de l'implementation TypeORM. En test, on injecte un repository in-memory. En production, on injecte le repository TypeORM.
- C'est le pattern **Ports & Adapters** : l'interface est le port, les implementations (TypeORM, in-memory) sont les adaptateurs.

**Exemple** : lis et montre :
- Le fichier de reference `inMemoryRepository` — l'adapter de test
- Le fichier de reference `useCaseDriver` — le driver unitaire qui injecte l'in-memory
- Le skill de reference `architecture` pour les principes Ports & Adapters

**Ne pas implementer** les tests unitaires dans ce skill. Juste expliquer le concept et montrer les exemples. Le developpeur pourra utiliser le skill `/atdd` (variante use case) pour ca plus tard.

**STOP** — attendre decision
