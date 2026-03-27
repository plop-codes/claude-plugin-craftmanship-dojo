# Phase 2 : Generation des fichiers de propositions

La roadmap a ete validee par le tech lead. Generer les fichiers de propositions et mettre a jour la configuration.

---

## Etape 1 : Supprimer les anciennes propositions

Si des fichiers de propositions existent deja dans `phases/06-refactoring/proposals/`, les supprimer **apres confirmation du tech lead** :

> "Des propositions existantes ont ete detectees dans `phases/06-refactoring/proposals/`. Je vais les remplacer par les nouvelles etapes validees. Confirmes-tu ?"

Si le tech lead confirme, supprimer tous les fichiers `*.md` dans ce dossier.
Si le tech lead refuse, conserver les anciens fichiers et ajouter les nouveaux a la suite (numerotation continue).

---

## Etape 2 : Generer les fichiers de propositions

Pour chaque etape de la roadmap validee, creer un fichier dans `phases/06-refactoring/proposals/`.

### Nommage des fichiers

Format : `{numero sur 2 chiffres}-{slug}.md`

Exemples :
- `01-controller-purity.md`
- `02-use-case-extraction.md`
- `03-vertical-slices.md`
- `04-e2e-test-infrastructure.md`
- `05-encapsulation.md`

### Format de chaque fichier

Chaque fichier DOIT suivre exactement ce format (compatible avec le skill onboarding) :

```markdown
# Proposition {N} : {Titre}

## References necessaires

{Liste des references pertinentes, si applicable}
- Skill : `{skill-key}`
- Exemple : `{example-key}`

{Si aucune reference n'est pertinente, ecrire : "Aucune reference embarquee. Se baser sur le code existant du projet."}

## Instructions

**Inspecter** : {description precise de ce qu'il faut verifier dans le code du developpeur en onboarding — quels fichiers regarder, quels patterns chercher}

**Skip si** : {conditions ou cette proposition ne s'applique pas — par exemple si le dev a deja bien fait}

**Pourquoi** : {explication pedagogique — pourquoi ce refactoring est utile, ce qu'il apporte, ce qu'il debloque. Ecrire comme si on s'adressait a un developpeur qui decouvre le concept.}

**Exemple** : {quoi montrer — fichiers de reference a lire et montrer, ou extraits de code du projet a utiliser comme modele. Privilegier les fichiers de reference embarques quand ils existent.}

**STOP** — attendre decision
```

### Regles de generation

1. **Chaque fichier doit etre autonome** : lisible et comprehensible sans contexte exterieur
2. **Les instructions doivent etre concretes** : citer des patterns de fichiers specifiques au langage/framework detecte, pas des instructions generiques
3. **Le "Pourquoi" doit etre pedagogique** : expliquer le concept comme a un developpeur qui le decouvre pour la premiere fois
4. **Les references doivent pointer vers les fichiers existants** du plugin quand c'est pertinent :
   - Skills : `vertical-slice`, `ddd-patterns`, `architecture`
   - Exemples : `testApp`, `commandResult`, `dsl`, `e2eDriver`, `e2eSpec`, `useCase`, `controller`, `entity`, `valueObject`, `inMemoryRepository`, `useCaseDriver`
5. **Pour les etapes sans reference embarquee** (specifiques a la codebase ou au framework), decrire clairement le pattern attendu dans le fichier lui-meme
6. **Le "Inspecter" doit etre adapte au framework** : utiliser les patterns de detection du framework identifie dans la phase d'analyse

---

## Etape 3 : Mettre a jour config.json

Mettre a jour le fichier `config.json` a la racine du plugin :

### Section `proposals`

Remplacer le contenu de `proposals` par les nouvelles cles, une par etape validee :

```json
{
  "proposals": {
    "{slug-etape-1}": true,
    "{slug-etape-2}": true,
    ...
  }
}
```

Les slugs doivent correspondre exactement aux noms de fichiers (sans numero ni extension).
Exemple : fichier `03-vertical-slices.md` → cle `vertical-slices`.

### Section `audit` (ajouter si absente)

Ajouter ou mettre a jour la section `audit` avec les paths scannes et les niveaux evalues :

```json
{
  "audit": {
    "scan-paths": ["{paths scannes}"],
    "default-levels": {
      "layer-separation": true,
      "usecases-screaming-archi": true,
      "e2e-tests": true,
      "rich-domain-model": true,
      "unit-tests-clean-archi": true,
      "tdd": true,
      "ddd": true
    }
  }
}
```

---

## Etape 4 : Mettre a jour la table de mapping Phase 6 dans le skill onboarding

Lire le fichier `skills/onboarding/SKILL.md` et mettre a jour la table de mapping Phase 6 (section "Phase 6 : Refactoring") pour refleter les nouvelles propositions.

Format de la table :

```markdown
| Cle config | Fichier |
|------------|---------|
| `{slug}` | `phases/06-refactoring/proposals/{numero}-{slug}.md` |
```

Une ligne par proposition generee.

---

## Etape 5 : Resume final

Presenter un resume au tech lead :

> **Generation terminee.**
>
> **{N} propositions creees** dans `phases/06-refactoring/proposals/` :
> - `01-{slug}.md` — {titre}
> - `02-{slug}.md` — {titre}
> - ...
>
> **`config.json` mis a jour** avec les nouvelles cles de propositions.
>
> **`skills/onboarding/SKILL.md` mis a jour** avec la table de mapping Phase 6.
>
> Les developpeurs peuvent maintenant utiliser `/onboarding` pour etre guides a travers ces etapes de refactoring.
