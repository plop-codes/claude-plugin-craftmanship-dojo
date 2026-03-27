# Craftmanship Dojo

Claude Code plugin that coaches developers in real time while they code, instead of correcting them after the fact in code review.

**The principle**: an e2e test is generated in test-first as a safety rail, the developer implements freely, then refactoring proposals teach them best practices — all without leaving their terminal.

## The problem

Code reviews via pull requests don't work well:

- Feedback arrives too late — the developer has already context-switched
- Reviews are superficial — nobody wants to block the team
- Conventions are learned at review time, when it's too late
- Asynchronous back-and-forth on a design detail takes days

**This plugin replaces that cycle with real-time coaching.** The developer learns by doing, guided by Claude, and can push directly to trunk with confidence.

## Installation

Clone the plugin:

```bash
git clone https://github.com/plop-codes/claude-plugin-craftmanship-dojo.git
```

Launch Claude Code with the plugin:

```bash
claude --plugin-dir /path/to/claude-plugin-craftmanship-dojo
```

## The 2 skills

### `/craftmanship-dojo:audit` — Adapt onboarding to your codebase

Analyzes the practices and conventions already in place in your codebase, then generates refactoring steps that progressively teach them to a developer who doesn't master them yet. Works on any backend language (TypeScript, Java, C#, Go, Python...).

1. Scans the codebase to identify patterns and conventions used by the team
2. Proposes refactoring steps that teach these practices, in pedagogical order
3. The tech lead validates or adjusts the steps
4. The generated steps replace the default ones in the onboarding

This is the starting point: the tech lead runs the audit once, and the onboarding is calibrated to the project's actual practices.

### `/craftmanship-dojo:onboarding` — Developer coaching

Interactive guide in 6 phases to implement a backend feature:

| Phase | What | Who |
|-------|------|-----|
| 1. Scenario | Retrieves the scenario (GitHub ticket or pasted text) | Claude |
| 2. E2E test | Generates the DSL / Driver / Spec files | Claude |
| 3. Explanation | Explains each component of the generated test | Discussion |
| 4. Free dev | The developer implements the feature | Developer |
| 5. Validation | Runs the e2e tests to verify | Claude |
| 6. Refactoring | Proposes educational improvements | Developer (guided) |

## Refactoring steps

Phase 6 of the onboarding proposes progressive refactoring steps. The goal: teach the developer the codebase practices by guiding them step by step.

By default, the plugin ships with 8 steps designed for a NestJS project (vertical slices, encapsulation, value objects, etc.). To make these steps reflect your team's actual practices, run `/craftmanship-dojo:audit` — the default steps will be replaced by steps generated from your codebase.

## Plugin structure

```
craftmanship-dojo/
├── .claude-plugin/
│   └── plugin.json               # Plugin manifest
├── config.json                   # Configuration
├── skills/
│   ├── onboarding/SKILL.md       # Onboarding skill (6 phases)
│   └── audit/SKILL.md            # Audit skill (practice analysis)
├── phases/
│   ├── 01 to 05                  # Coaching phases
│   ├── 06-refactoring/
│   │   ├── preambule.md
│   │   ├── closure.md
│   │   └── proposals/            # 8 refactoring proposals
│   └── audit/                    # Analysis guide + generation
└── references/
    ├── skills/                   # 3 bundled skills
    └── examples/                 # 11 example TypeScript files
```

## License

MIT
