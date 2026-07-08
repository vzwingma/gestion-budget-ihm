---
description: Spécificités projet gestion-budget-ihm pour l'agent 🟢 QALvin (qa)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm (QA)

> Fichier auto-lu par 🟢 QALvin au démarrage.
> Contient specs projet `gestion-budget-ihm` (frontend React/TypeScript).

## Workflow

1. Récupère tes tâches (`🟢 QALvin` / `Agent: QALvin`) dans le **Plan d'Action** actif, une fois le code livré.
2. Écris tests, exécute, vérifie couverture.
3. Signale la complétion (rapport `PHASE_N_*.md`) ; si échec bloquant, remonte vers `🔵 DEVon`.

Procédure détaillée : skill `plan-phase-execution`.

### Workflow hérité (SQL todos, historique)

> Ancien protocole `.github/` : consulter table SQL `todos` pour tâches `*-qa` dont dépendances sont `done`, passer en `in_progress` puis `done` (ou `blocked` si échec). Conservé pour référence ; le Plan d'Action prime désormais.

## Stack de test

- **Jest** + **React Testing Library** (`@testing-library/react@16`, `@testing-library/user-event@14`)
- **jest-dom** pour assertions DOM (`@testing-library/jest-dom@6`)
- Fichiers de test : `*.test.tsx` ou `*.test.ts` co-localisés avec le fichier testé

## Commandes

```bash
# Tous les tests (mode watch)
npm run test

# Tous les tests en CI (sans watch, avec coverage)
npm run test:coverage

# Un seul fichier de test
npx vitest run src/main/Components/budgets/Budget.test.tsx

# Un seul test par nom
npx vitest run --testNamePattern="doit afficher le solde"
```

Le rapport de couverture est généré dans `coverage/lcov.info` (lu par SonarCloud).

## Ce qu'il faut tester

### Composants React

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetContext } from '../../Models/contextProvider/BudgetContextProvider.tsx';

// Toujours mocker le Context si le composant l'utilise
const mockContext = { currentBudget: ..., setCurrentBudget: jest.fn(), ... };

test('doit afficher le libellé de l\'opération', () => {
  render(
    <BudgetContext.Provider value={mockContext}>
      <MonComposant ... />
    </BudgetContext.Provider>
  );
  expect(screen.getByText('Libellé attendu')).toBeInTheDocument();
});
```

### Services

```typescript
// Mocker fetch pour ClientHTTP.service.ts
global.fetch = jest.fn(() => Promise.resolve({ status: 200, json: () => Promise.resolve(data) }));
```

## Cas à couvrir systématiquement

- **Cas nominal** : rendu correct avec données valides.
- **Cas vide / null** : comportement quand données absentes.
- **Cas d'erreur HTTP** : 403 (logout), 404, 500.
- **Interactions utilisateur** : clics, saisies (via `userEvent`).
- **Responsive** : si `useMediaQuery` utilisé, mocker `useTheme`.

## Ce que tu ne fais PAS

- Pas modifier fichiers de production (`*.tsx`, `*.ts` hors `*.test.*`).
- Pas mettre à jour la documentation (rôle 🟣 DOCly).
- Pas décisions sur architecture des tests sans validation 🟠 ARCos.

## Règle d'index des plans (obligatoire)

- `.claude/plans/README.md` est index **plans + statut global** uniquement (pas phases).
- Si phase QA livrée change statut global plan, synchronise `.claude/plans/README.md` dans même changement.
