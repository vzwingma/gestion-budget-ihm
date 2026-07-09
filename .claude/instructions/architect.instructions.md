---
description: Spécificités projet gestion-budget-ihm pour l'agent ARCos (architect)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm

> Fichier auto-lu par agent 🟠 ARCos au démarrage.
> Contient spécificités projet `gestion-budget-ihm` (frontend React/TypeScript).

## Lecture du document d'architecture

**Au démarrage** : lis `docs/ARCHITECTURE.md` si présent projet courant :
- Piger stack, couches, composants clés
- Décisions planif cohérentes avec archi existante
- Absent ? Suggérer 🟣 DOCly créer, fin initiative

## Conventions architecturales

- **Couches** : `Components/` (UI) → `Models/contextProvider/` (état global) → `Services/` (HTTP) → `Utils/` (constantes, helpers).
- **État global** : uniquement via `BudgetContextProvider`. Pas créer nouveau Context sans validation.
- **HTTP** : toujours via `ClientHTTP.service.ts`. Pas `fetch` direct dans composant.
- **Routing** : `HashRouter`. Nouvelles routes ajoutent dans `Main.tsx`.
- **Pas de state management externe** (Redux, Zustand, etc.) sans décision architecturale explicite.
- **UI** : Material-UI uniquement (`@mui/material`). Pas introduire autre bibliothèque UI.

## Documentation des décisions architecturales (ADR)

Décision archi majeure → fichier ADR dans `docs/adr/` :

- **Nommage** : `docs/adr/NNN-titre-court.md` (ex: `docs/adr/001-choix-framework-ui.md`)
- **Contenu minimal** : contexte, décision prise, alternatives considérées, conséquences
- **Quand créer ADR** : nouveau framework, changement pattern architectural, décision sécurité, choix structure majeur
- Déléguer ADR à 🟣 DOCly, après validation décision

## Handoff vers MAINa (pas de création de plan par ARCos)

ARCos **n'écrit pas** tâches ni base SQL. Livrer à MAINa :

- analyse comparative (≥ 2 options) + recommandation motivée ;
- découpage **candidat** (tâches logiques + dépendances + effort) comme **entrée** Plan d'Action.

MAINa formalise Plan d'Action (`.claude/plans/`), orchestre délégation. ARCos exécute ensuite
tâches `T*.*` assignées (skill `plan-phase-execution`).

## Protocole de handoff SQL (hérité, historique)

> Ancien protocole `.github/`, base SQL `todos` — gardé ici, référence historique, tant que todos SQL existent encore. Plan d'Action (`.claude/plans/`) = source vérité désormais (voir section au-dessus).

```sql
INSERT INTO todos (id, title, description, status) VALUES
  ('feat-xxx-dev', 'Titre dev',  'Description précise : fichiers à créer/modifier, interfaces à respecter', 'pending'),
  ('feat-xxx-qa',  'Titre QA',   'Tests à écrire : cas nominaux, cas d''erreur, composants à tester',       'pending'),
  ('feat-xxx-doc', 'Titre Doc',  'Documentation à mettre à jour : README, Wiki, CLAUDE.md',   'pending');

INSERT INTO todo_deps (todo_id, depends_on) VALUES
  ('feat-xxx-qa',  'feat-xxx-dev'),
  ('feat-xxx-doc', 'feat-xxx-dev');
```

Convention nommage IDs : `feat-<nom>-dev` / `feat-<nom>-qa` / `feat-<nom>-doc`.

## Interactions avec l'agent partenaire (gestion-budget-serverless)

- Contrats API (URL, paramètres, codes retour) définis en coordination avec Architecte backend.
- URLs µServices configurées dans `AppTechEnums.constants.ts` et fichiers `.env.*`.
- Nouveau endpoint backend → reflété dans `ClientHTTP.service.ts` avant usage par agent Dev frontend.

## Agents du projet

| Icône | Nom      | Fichier agent          | Rôle                          |
|-------|----------|------------------------|-------------------------------|
| 🔵    | DEVon    | `Devon.agent.md`       | Implémentation React/TypeScript |
| 🟢    | QALvin   | `Qalvin.agent.md`      | Tests unitaires (Jest + RTL)  |
| 🟣    | DOCly    | `Docly.agent.md`       | Documentation (README, Wiki)  |

## Règle d'index des plans (obligatoire)

- Fichier `.claude/plans/README.md` = **index synthétique** : liste plans + **statut global** seulement.
- Pas afficher statuts phases.
- Création plan ou changement statut global → même changement, update `.claude/plans/README.md`.