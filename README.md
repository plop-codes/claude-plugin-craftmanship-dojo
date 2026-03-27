# Craftmanship Dojo

Plugin Claude Code qui coach les developpeurs en temps reel pendant qu'ils codent, au lieu de les corriger apres coup en code review.

**Le principe** : un test e2e est genere en test-first comme rail de securite, le developpeur implemente librement, puis des propositions de refactoring lui apprennent les bonnes pratiques — le tout sans quitter son terminal.

## Le probleme

Les code reviews par pull request ne marchent pas bien :

- Le feedback arrive trop tard — le developpeur a deja change de contexte
- Les reviews sont superficielles — personne ne veut bloquer l'equipe
- Les conventions s'apprennent au moment de la review, quand c'est trop tard
- Les allers-retours asynchrones sur un detail de design prennent des jours

**Ce plugin remplace ce cycle par du coaching en temps reel.** Le developpeur apprend en faisant, guide par Claude, et peut pusher directement sur trunk en confiance.

## Installation

Cloner le plugin :

```bash
git clone https://github.com/plop-codes/claude-plugin-craftmanship-dojo.git
```

Lancer Claude Code avec le plugin :

```bash
claude --plugin-dir /chemin/vers/claude-plugin-craftmanship-dojo
```

## Les 2 skills

### `/craftmanship-dojo:audit` — Adapter l'onboarding a votre codebase

Analyse les pratiques et conventions deja en place dans votre codebase, puis genere des etapes de refactoring qui les enseignent progressivement a un developpeur qui ne les maitrise pas encore. Fonctionne sur n'importe quel langage backend (TypeScript, Java, C#, Go, Python...).

1. Scanne la codebase pour identifier les patterns et conventions utilises par l'equipe
2. Propose des etapes de refactoring qui enseignent ces pratiques, dans un ordre pedagogique
3. Le tech lead valide ou ajuste les etapes
4. Les etapes generees remplacent celles par defaut dans l'onboarding

C'est le point de depart : le tech lead lance l'audit une fois, et l'onboarding est calibre sur les pratiques reelles du projet.

### `/craftmanship-dojo:onboarding` — Coaching du developpeur

Guide interactif en 6 phases pour implementer une feature backend :

| Phase | Quoi | Qui |
|-------|------|-----|
| 1. Scenario | Recupere le scenario (ticket GitHub ou texte colle) | Claude |
| 2. Test e2e | Genere les fichiers DSL / Driver / Spec | Claude |
| 3. Explication | Explique chaque composant du test genere | Discussion |
| 4. Dev libre | Le developpeur implemente la feature | Developpeur |
| 5. Validation | Lance les tests e2e pour verifier | Claude |
| 6. Refactoring | Propose des ameliorations educatives | Developpeur (guide) |

## Les etapes de refactoring

La phase 6 de l'onboarding propose des etapes de refactoring progressives. Le but : enseigner au developpeur les pratiques de la codebase en le guidant pas a pas.

Par defaut, le plugin embarque 8 etapes pensees pour un projet NestJS (vertical slices, encapsulation, value objects, etc.). Pour que ces etapes refletent les pratiques reelles de votre equipe, lancez `/craftmanship-dojo:audit` — les etapes par defaut seront remplacees par des etapes generees depuis votre codebase.

## Structure du plugin

```
craftmanship-dojo/
├── .claude-plugin/
│   └── plugin.json               # Manifeste du plugin
├── config.json                   # Configuration
├── skills/
│   ├── onboarding/SKILL.md       # Skill onboarding (6 phases)
│   └── audit/SKILL.md            # Skill audit (analyse des pratiques)
├── phases/
│   ├── 01 a 05                   # Phases du coaching
│   ├── 06-refactoring/
│   │   ├── preambule.md
│   │   ├── closure.md
│   │   └── proposals/            # 8 propositions de refactoring
│   └── audit/                    # Guide d'analyse + generation
└── references/
    ├── skills/                   # 3 skills embarques
    └── examples/                 # 11 fichiers TypeScript d'exemple
```

## Licence

MIT
