# Phase 1 : Recuperation du scenario

## 1.1 Demander le numero du ticket

Demande a l'utilisateur le numero du ticket GitHub avec `AskUserQuestion`.

## 1.2 Recuperer le ticket

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

## 1.3 Selectionner le scenario

- Si ticket unique → utilise ce scenario
- Si User Story → filtre les sub-issues `state: OPEN` avec `issueType.name == "Scenario / critere d'acceptation"`, puis prend le **premier** scenario trouve

## 1.4 Verifier le label

**Regle critique** : quel que soit le label du scenario (`backend-usecase-test`, `backend-e2e-test`), ce skill genere **TOUJOURS** un test e2e backend.

**Exception** : si le label est `ui-test`, **REFUSE** :
> "Ce skill est reserve au backend. Les tests UI ne sont pas supportes par le skill onboarding. Choisis un scenario avec un label backend."

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
