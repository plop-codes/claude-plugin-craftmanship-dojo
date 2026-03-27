# Phase 2 : Generation des fichiers de propositions

Les etapes ont ete validees par le tech lead. Generer les fichiers de propositions et mettre a jour la configuration.

---

## Etape 1 : Supprimer les anciennes propositions

Si des fichiers de propositions existent deja dans `phases/06-refactoring/proposals/`, les supprimer **apres confirmation du tech lead** :

> "Des propositions existantes ont ete detectees dans `phases/06-refactoring/proposals/`. Je vais les remplacer par les nouvelles etapes validees. Confirmes-tu ?"

Si le tech lead confirme, supprimer tous les fichiers `*.md` dans ce dossier.
Si le tech lead refuse, conserver les anciens fichiers et ajouter les nouveaux a la suite (numerotation continue).

---

## Etape 2 : Generer les fichiers de propositions

Pour chaque etape validee, creer un fichier dans `phases/06-refactoring/proposals/`.

### Nommage des fichiers

Format : `{numero sur 2 chiffres}-{slug}.md`

Exemples :
- `01-vertical-slices.md`
- `02-entity-encapsulation.md`
- `03-value-objects.md`
- `04-in-memory-repositories.md`

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

**Skip si** : {conditions ou cette proposition ne s'applique pas — par exemple si le dev a deja applique cette pratique}

**Pratique enseignee** : {explication pedagogique — quelle convention de la codebase le dev apprend ici, pourquoi l'equipe fait comme ca, avec des exemples de fichiers existants dans le projet qui illustrent cette pratique}

**Exemple** : {quoi montrer — fichiers existants de la codebase qui servent de modele. Privilegier les fichiers reels du projet plutot que les fichiers de reference embarques, puisque l'objectif est d'enseigner les pratiques de CETTE codebase.}

**STOP** — attendre decision
```

### Regles de generation

1. **Chaque fichier doit etre autonome** : lisible et comprehensible sans contexte exterieur
2. **Les instructions doivent etre concretes** : citer des patterns de fichiers specifiques au langage/framework detecte
3. **La "Pratique enseignee" doit etre pedagogique** : expliquer la convention comme a un developpeur qui decouvre la codebase pour la premiere fois
4. **Privilegier les exemples du projet** : les fichiers existants de la codebase sont les meilleurs exemples puisqu'ils montrent exactement comment l'equipe fait. Les fichiers de reference embarques du plugin ne sont utiles que si la codebase n'a pas d'exemple suffisant.
5. **Le "Inspecter" doit etre adapte au framework** : utiliser les patterns de detection du framework identifie dans la phase d'analyse

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

### Section `audit`

Mettre a jour la section `audit` avec les paths scannes :

```json
{
  "audit": {
    "scan-paths": ["{paths scannes}"]
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
> **{N} etapes creees** dans `phases/06-refactoring/proposals/` :
> - `01-{slug}.md` — {titre}
> - `02-{slug}.md` — {titre}
> - ...
>
> **`config.json` mis a jour** avec les nouvelles cles de propositions.
>
> **`skills/onboarding/SKILL.md` mis a jour** avec la table de mapping Phase 6.
>
> Les developpeurs peuvent maintenant utiliser `/onboarding` pour etre guides a travers ces etapes de refactoring.
