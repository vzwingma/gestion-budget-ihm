---
description: Spécificités projet gestion-budget-ihm pour l'agent ARCos (architect)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm

> Fichier auto-lu par agent 🟠 ARCos au démarrage.
> Contient spécificités projet `gestion-budget-ihm` (frontend React/TypeScript).

## Lecture du document d'architecture

**Au démarrage**, lis `docs/ARCHITECTURE.md` si existe dans projet courant :
- Comprendre stack technique, couches applicatives, composants clés
- Assurer cohérence décisions planification avec architecture existante
- Si absent, suggérer à 🟣 DOCly création au terme initiative

## Conventions architecturales

- **Couches** : `Components/` (UI) → `Models/contextProvider/` (état global) → `Services/` (HTTP) → `Utils/` (constantes, helpers).
- **État global** : uniquement via `BudgetContextProvider`. Pas créer de nouveau Context sans validation.
- **HTTP** : toujours via `ClientHTTP.service.ts`. Pas utiliser `fetch` direct dans composant.
- **Routing** : `HashRouter`. Nouvelles routes s'ajoutent dans `Main.tsx`.
- **Pas bibliothèque state management externe** (pas de Redux, Zustand, etc.) sans décision architecturale explicite.
- **UI** : Material-UI uniquement (`@mui/material`). Pas introduire autre bibliothèque UI.

## Documentation des décisions architecturales (ADR)

Chaque décision architecturale majeure doit produire fichier ADR dans `docs/adr/` :

- **Nommage** : `docs/adr/NNN-titre-court.md` (ex: `docs/adr/001-choix-framework-ui.md`)
- **Contenu minimal** : contexte, décision prise, alternatives considérées, conséquences
- **Quand créer ADR** : nouveau framework, changement pattern architectural, décision sécurité, choix structure majeur
- Déléguer création ADR à 🟣 DOCly après validation décision

## Handoff vers MAINa (pas de création de plan par ARCos)

ARCos **n'écrit pas** de tâches ni de base SQL. Livrer à MAINa :

- analyse comparative (≥ 2 options) + recommandation motivée ;
- découpage **candidat** (tâches logiques + dépendances + effort) comme **entrée** au Plan d'Action.

MAINa formalise le Plan d'Action (`.claude/plans/`) et orchestre la délégation. ARCos exécute ensuite
les tâches `T*.*` qui lui sont assignées (skill `plan-phase-execution`).

## Protocole de handoff SQL (hérité, historique)

> Ancien protocole `.github/` basé sur base SQL `todos` — conservé ici pour référence historique tant que des todos SQL existent encore. Le Plan d'Action (`.claude/plans/`) est désormais la source de vérité (voir section ci-dessus).

```sql
INSERT INTO todos (id, title, description, status) VALUES
  ('feat-xxx-dev', 'Titre dev',  'Description précise : fichiers à créer/modifier, interfaces à respecter', 'pending'),
  ('feat-xxx-qa',  'Titre QA',   'Tests à écrire : cas nominaux, cas d''erreur, composants à tester',       'pending'),
  ('feat-xxx-doc', 'Titre Doc',  'Documentation à mettre à jour : README, Wiki, CLAUDE.md',   'pending');

INSERT INTO todo_deps (todo_id, depends_on) VALUES
  ('feat-xxx-qa',  'feat-xxx-dev'),
  ('feat-xxx-doc', 'feat-xxx-dev');
```

Convention de nommage des IDs : `feat-<nom>-dev` / `feat-<nom>-qa` / `feat-<nom>-doc`.

## Interactions avec l'agent partenaire (gestion-budget-serverless)

- Contrats API (URL, paramètres, codes retour) définis en coordination avec Architecte backend.
- URLs µServices configurées dans `AppTechEnums.constants.ts` et fichiers `.env.*`.
- Tout nouveau endpoint backend doit être reflété dans `ClientHTTP.service.ts` avant que agent Dev frontend puisse utiliser.

## Agents du projet

| Icône | Nom      | Fichier agent          | Rôle                          |
|-------|----------|------------------------|-------------------------------|
| 🔵    | DEVon    | `Devon.agent.md`       | Implémentation React/TypeScript |
| 🟢    | QALvin   | `Qalvin.agent.md`      | Tests unitaires (Jest + RTL)  |
| 🟣    | DOCly    | `Docly.agent.md`       | Documentation (README, Wiki)  |

## Règle d'index des plans (obligatoire)

- Fichier `.claude/plans/README.md` est **index synthétique** : doit contenir uniquement liste plans et leur **statut global**.
- Pas afficher statuts phases.
- Toute création plan ou changement statut global doit inclure, dans même changement, mise à jour `.claude/plans/README.md`.
