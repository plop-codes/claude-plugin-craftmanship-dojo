# Phase 1 : Recuperation du scenario

## 1.1 Demander le scenario

Demande a l'utilisateur son scenario avec `AskUserQuestion` :

> "Comment veux-tu me fournir le scenario ?\n- Donne-moi un **numero de ticket GitHub** (ex: `42` ou `#42`)\n- Ou **colle directement le scenario** ici (Gherkin, texte libre, specs...)"

## 1.2 Recuperer le scenario

### Option A : Ticket GitHub

Si l'utilisateur donne un numero de ticket :

**Ticket unique :**
```bash
gh issue view <id> --json title,body,labels
```

**User Story (avec sub-issues) :**
Recupere le owner et repo :
```bash
gh repo view --json owner,name --jq '.owner.login + " " + .name'
```

Puis recupere les sub-issues :
```bash
gh api graphql -f query='query {
  repository(owner: "{owner}", name: "{repo}") {
    issue(number: {NUM}) {
      title
      body
      subIssues(first: 50) {
        nodes {
          number
          title
          state
          body
          issueType { name }
          labels(first: 10) {
            nodes { name }
          }
        }
      }
    }
  }
}' --jq '.data.repository.issue'
```

**Selection du scenario :**
- Si ticket unique → utilise ce scenario
- Si User Story → filtre les sub-issues `state: OPEN` avec `issueType.name == "Scenario / critere d'acceptation"`, puis prend le **premier** scenario trouve

### Option B : Scenario colle en texte

Si l'utilisateur colle directement le scenario (Gherkin, specs, texte libre), l'utiliser tel quel. Pas besoin de `gh`.

## 1.4 Verifier le perimetre

**Regle critique** : ce skill genere **TOUJOURS** un test e2e backend.

Si le scenario provient d'un ticket GitHub avec le label `ui-test`, ou si le scenario colle decrit clairement un test UI (interactions navigateur, clics, formulaires...), **REFUSE** :
> "Ce skill est reserve au backend. Les tests UI ne sont pas supportes par le skill onboarding. Choisis un scenario backend."

## 1.5 Extraire le contexte

Extrais du body du ticket (et de la US parente si applicable) :
- **Scenario Gherkin** (Given/When/Then)
- **Regles metier** : validations, formats, contraintes
- **API** : endpoints, methodes HTTP, codes de retour, formats requete/reponse
- **Noms de domaine** : entites, proprietes, tables, colonnes
- **Contraintes techniques** : types, structures, relations

## 1.6 Confirmer avec l'utilisateur

Affiche le scenario extrait et le contexte. Demande confirmation avant de generer le test :
> "Voici le scenario que je vais utiliser : ..."
> "C'est bien ce scenario ? (oui/non)"

**STOP** — attendre confirmation.
