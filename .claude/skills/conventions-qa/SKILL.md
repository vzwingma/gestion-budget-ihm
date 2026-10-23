---
name: conventions-qa
description: "Conventions de test du projet gestion-budget-ihm pour 🟢 QALvin : framework, commandes, emplacement des tests, mocks, seuil de couverture, cas à couvrir. Prioritaire sur le générique."
user-invocable: false
---

# Conventions projet — gestion-budget-ihm (tests)

> Projet : `gestion-budget-ihm` — frontend React 19 / TypeScript / Vite de l'application de gestion de budget
> personnel (comptes, budgets mensuels, opérations, analyses). Backend : `gestion-budget-serverless`.

## Stack de test

- **Vitest 5** (environnement `jsdom`, `globals: true`, config dans `vite.config.ts`) + **React Testing Library**
  (`@testing-library/react` 16, `@testing-library/user-event` 14) + **jest-dom** 7
  (`@testing-library/jest-dom/vitest`, chargé par `src/setupTests.ts`). Pas de Jest : utiliser `vi.*`, pas `jest.*`.
- Fichiers de test : `*.test.ts` / `*.test.tsx`, co-localisés avec le fichier testé dans `src/main/`.

## Commandes

```bash
npm run test                                   # tous les tests (watch)
npm run test:coverage                          # mode CI avec couverture (vitest run --coverage)
npx vitest run src/main/Services/ClientHTTP.service.test.ts   # un fichier
npx vitest run -t "charge le budget"           # un test par nom
```

Rapport de couverture : `coverage/lcov.info` (provider v8, lu par SonarCloud — `sonar-project.properties`).
**Seuil de couverture** : ≥ 80 % sur le code modifié.

## Mocks

- Dépendances externes : `vi.mock()` sur le module (`ClientHTTP.service.ts`, `*.extservices.ts`,
  `react-toastify`), `vi.fn()` / `(fn as Mock).mockResolvedValue(...)` ; `vi.clearAllMocks()` en `beforeEach`.
  `fetch` global : `vi.stubGlobal` / `vi.spyOn` pour tester `ClientHTTP.service.ts` lui-même.
- État partagé injecté : envelopper le composant dans `<BudgetContext.Provider value={mockContext}>`.
- Responsive : mocker `useMediaQuery` / `useTheme` si le composant les utilise.

```typescript
vi.mock('../../Services/ClientHTTP.service.ts', () => ({ call: vi.fn() }));

test('charge le budget pour un compte et une date', async () => {
    (call as Mock).mockResolvedValue({id: 'b1'});
    await expect(loadBudget({id: 'c1', libelle: 'Compte'} as any, new Date('2026-01-10'))).resolves.toEqual({id: 'b1'});
});
```

## Cas à couvrir systématiquement

- **Nominal** : comportement correct avec données valides
- **Vide / null** : données absentes ou partielles (ex. aucun compte sélectionné)
- **Erreurs** : HTTP 403 (→ `logOut()`), 404, 500 (→ `toast.error`) et comportement attendu
- **Interactions** : clics, saisies via `userEvent` ; appels `call()` attendus (méthode, URL, paramètres)
- **Régression** : casser volontairement le code doit faire échouer au moins un test

## Ce que QALvin ne fait PAS

- Modifier le code de production (hors fichiers de test et `src/setupTests.ts`).
- Mettre à jour la documentation (rôle 🟣 DOCly).
- Changer la stratégie de test globale sans validation 🟠 ARCos + 👤.
