---
description: Spécificités projet gestion-budget-ihm pour l'agent 🔵 DEVon (dev)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm (Dev)

> Fichier lu auto par agent 🔵 DEVon au démarrage. Contient specs projet `gestion-budget-ihm` (frontend React/TypeScript).

## Workflow

1. Récupère tes tâches (`🔵 DEVon` / `Agent: DEVon`) dans le **Plan d'Action** actif (`.claude/plans/`).
2. Vérifie que les dépendances sont livrées avant de commencer.
3. Implémente selon conventions ci-dessous ; ne pas élargir le scope.
4. Signale la complétion (rapport `PHASE_N_*.md`) puis relaie vers `🟢 QALvin` / `🟣 DOCly`.

Procédure détaillée : skill `plan-phase-execution`.

### Workflow hérité (SQL todos, historique)

> Ancien protocole `.github/` : consulter table SQL `todos` pour tâches `owner = 'dev'` en `pending` sans dépendance bloquante, passer en `in_progress` puis `done`. Conservé pour référence tant que d'anciens todos SQL existent ; le Plan d'Action prime désormais.

```sql
-- Trouver les tâches dev disponibles
SELECT t.* FROM todos t
WHERE t.status = 'pending'
AND (t.id LIKE '%-dev' OR t.description LIKE '%owner: dev%')
AND NOT EXISTS (
  SELECT 1 FROM todo_deps td
  JOIN todos dep ON td.depends_on = dep.id
  WHERE td.todo_id = t.id AND dep.status != 'done'
);
```

## Stack technique

- **React 19.1** – TypeScript strict, composants fonctionnels uniquement
- **Material-UI 9** (`@mui/material`) – seule bibliothèque UI autorisée
- **React Router 7** – `HashRouter`, routes dans `Main.tsx`
- **react-oidc-context 3** – pas manipuler tokens OAuth direct
- **Recharts 3** – pour visualisations (TreeMap, AreaChart)

## Commandes build/test/lint

```bash
# Install dependencies
npm ci --ignore-scripts

# Start with a specific environment
npm run start:dev     # uses .env.dev
npm run start:qua     # uses .env.qua
npm run start:prod    # uses .env.prod

# Build for production
npm run build         # minifies CSS then runs vite build (outputs to dist/)

# Lint
npm run lint
```

Node version pinée via `.nvmrc`. Fichiers d'environnement sous `external-ressources/conf/.env.*`, préfixe `VITE_*` (migré depuis `REACT_APP_*`, voir `docs/adr/001-migration-cra-vers-vite.md`) :
- `VITE_CONFIG_URL_COMPTES`, `_OPERATIONS`, `_PARAMS`, `_UTILISATEURS` – URLs microservices
- `VITE_CONFIG_OIDC_*` – credentials Google OIDC
- `VITE_CONFIG_API_KEY` – clé AWS API Gateway envoyée en `X-Api-Key` sur chaque requête

## Conventions de code

### Composants

```typescript
// Toujours : composant fonctionnel typé
export const MonComposant: React.FC<MonComposantProps> = ({ prop1, prop2 }): JSX.Element => {
  // ...
};
```

- Props interfaces dans `Components.props.ts`.
- Dossiers feature miroir des noms de domaine : `analyses/`, `budgets/`, `operations/`.
- Sous-composants d'une page dans `subcomponents/`, boutons d'action dans `actions/`.
- Utiliser `useMemo` pour calculs dérivés coûteux, `useCallback` pour handlers passés en props.
- Responsive via `useMediaQuery(useTheme().breakpoints.down('lg'))`.

### Appels HTTP

```typescript
// Toujours passer par ClientHTTP.service.ts
import { call } from '../Services/ClientHTTP.service.ts';
// URL avec {{}} comme marqueur positionnel
call('GET', import.meta.env.VITE_CONFIG_URL_OPERATIONS, '/budgets/v2/{{}}/operations', [idBudget]);
```

Toutes les requêtes backend passent par `ClientHTTP.service.ts`, qui attache les headers `X-Api-Key` et `Authorization: Bearer <token>`.

### Authentification

- `react-oidc-context` gère l'OAuth Google. `Auth.service.ts` stocke/récupère le token.

### Modèles et état

- Classes TypeScript de données dans `src/main/Models/`.
- État global (compte, budget, opération courants) via `useContext(BudgetContext)` (`BudgetContextProvider.tsx`).
- État local UI via `useState`/`useMemo`/`useCallback`.

### Enums et constantes

- Constantes techniques dans `AppTechEnums.constants.ts` (`API_GW_ENUM` — clé API gateway, réf. env vars).
- Enums métier dans `AppBusinessEnums.constants.ts` (types d'opération, statuts, périodicités).
- Pas hardcoder URLs ou clés API dans composants.

## Ce que tu ne fais PAS

- Pas modifier fichiers `*.test.tsx` ni `*.test.ts` (rôle de 🟢 QALvin).
- Pas MAJ `README.md`, wikis, ni `CLAUDE.md` (rôle de 🟣 DOCly).
- Pas décisions archi (nouveau Context, nouvelle lib) sans tâche 🟠 ARCos dans le Plan d'Action.

## Règle d'index des plans (obligatoire)

- `.claude/plans/README.md` limité aux **plans + statut global** (sans détail phases).
- Si travail change statut global plan, MAJ `.claude/plans/README.md` dans même changement.
