---
name: conventions-dev
description: "Conventions de développement du projet gestion-budget-ihm pour 🔵 DEVon : stack et versions, structure, conventions de code, accès réseau, modèles, commandes de vérification. Prioritaire sur le générique."
user-invocable: false
---

# Conventions projet — gestion-budget-ihm (développement)

> Projet : `gestion-budget-ihm` — frontend React 19 / TypeScript / Vite de l'application de gestion de budget
> personnel (comptes, budgets mensuels, opérations, analyses). Backend : `gestion-budget-serverless`.

## Stack technique

- **TypeScript 6** — `tsconfig.json` sans `strict` activé : typer explicitement props et retours ; `npm run typecheck` (`tsc --noEmit`)
- **React 19.1** + **Vite 8** — composants fonctionnels uniquement
- **Material-UI 9** (`@mui/material`) — seule bibliothèque UI autorisée
- **react-oidc-context 3** — ne jamais manipuler les jetons OAuth directement (passer par `Auth.service.ts`)
- **React Router 7** (`HashRouter`, routes dans `src/main/Main.tsx`) ; **Recharts 3** pour les graphiques
- Node : version épinglée dans `.nvmrc` (`nvm use`)

## Commandes de vérification (preuves avant handoff)

```bash
npm run build       # minify CSS + vite build (dist/)
npm run lint        # eslint src/**/*.ts src/**/*.tsx
npm run typecheck   # tsc --noEmit
npx vitest run      # tests existants (non-régression)
```

## Structure et nommage

- Code source : `src/main/` ; organisation par couche (`Components/`, `Models/`, `Services/`, `Utils/`) puis par
  domaine (`analyses/`, `budgets/`, `infos/`, `mainpages/`…), sous-composants dans `subcomponents/`, boutons
  d'action dans `actions/`.
- Nommage fichiers : `PascalCase.component.tsx` (composants), `*.extservices.ts` (appels backend d'une feature),
  `*.controller.ts` (logique de page), `*.service.ts`, `*.utils.ts`, `*.constants.ts`, `*.props.ts` ; identifiants : `PascalCase` composants/classes, `camelCase` fonctions/variables,
  `UPPER_SNAKE_CASE` enums de constantes.

## Conventions de code

- Composants fonctionnels typés `React.FC<Props>` ; interfaces de props dans `src/main/Components/Components.props.ts`.
- `useMemo` pour calculs dérivés coûteux, `useCallback` pour handlers passés en props ; responsive via
  `useMediaQuery(useTheme().breakpoints.down('lg'))`.
- Gestion d'erreurs : `ClientHTTP.service.ts` lève une `Error` sur statut non 2xx (403 → `logOut()`) ; les
  `*.extservices.ts` traitent la promesse rejetée (`.catch`) et notifient via `toast.error(...)` (`react-toastify`).
- Accès réseau / données : toujours via `call()` de `src/main/Services/ClientHTTP.service.ts`, depuis un
  `*.extservices.ts` (`call(METHODE_HTTP.GET, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.ETAT, [idBudget, 'true'])`
  — `{{}}` dans le chemin = paramètre positionnel ; URLs dans `SERVICES_URL`).
- Modèles / types de données : `src/main/Models/` ; état global via `useContext(BudgetContext)`.
- Constantes techniques : `src/main/Utils/AppTechEnums.constants.ts` ; énumérations métier :
  `src/main/Utils/AppBusinessEnums.constants.ts`.
- Jamais d'URL, clé ou secret en dur dans le code (variables `VITE_*`).

## Ce que DEVon ne fait PAS

- Modifier les fichiers de test `*.test.ts`, `*.test.tsx` ni `src/setupTests.ts` (rôle 🟢 QALvin).
- Mettre à jour `README.md`, `docs/` ou les instructions d'agents (rôle 🟣 DOCly).
- Introduire une dépendance ou un pattern structurant sans tâche 🟠 ARCos dans le Plan d'Action.
