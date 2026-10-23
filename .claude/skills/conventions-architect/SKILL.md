---
name: conventions-architect
description: "Conventions architecturales du projet gestion-budget-ihm pour 🟠 ARCos : couches, état, accès réseau, routage, bibliothèques autorisées, intégrations externes. Prioritaire sur le générique."
user-invocable: false
---

# Conventions projet — gestion-budget-ihm (architecture)

> Projet : `gestion-budget-ihm` — frontend React 19 / TypeScript / Vite de l'application de gestion de budget
> personnel (comptes, budgets mensuels, opérations, analyses). Backend : `gestion-budget-serverless`.

## Document d'architecture

Lire `docs/ARCHITECTURE.md` : stack, couches, composants clés (source de vérité des versions). Toute
proposition doit rester cohérente avec l'existant et les ADR de `docs/adr/`.

## Conventions architecturales

- **Couches** : `src/main/Components/` (UI) → `src/main/Models/contextProvider/` (état global) →
  `src/main/Services/` (HTTP + auth) → `src/main/Utils/` (constantes, enums, helpers).
- **État partagé** : uniquement via `BudgetContextProvider.tsx` (React Context) ; pas de nouveau Context ni de
  state manager externe (Redux, Zustand…) sans décision explicite (ADR).
- **Accès réseau / données** : toujours via `call()` de `src/main/Services/ClientHTTP.service.ts` (headers
  `X-Api-Key` + `Authorization: Bearer`), appelé depuis les `*.extservices.ts` de chaque feature ; chemins dans
  `SERVICES_URL` (`AppTechEnums.constants.ts`) ; pas de `fetch` direct depuis un composant.
- **Routage / points d'entrée** : `HashRouter` (`react-router-dom` 7), routes déclarées dans `src/main/Main.tsx`.
- **Bibliothèques autorisées** : React 19, Material-UI 9 (`@mui/material`, `@mui/icons-material`, seule lib UI),
  `react-router-dom` 7, `react-oidc-context` 3 (auth Google OIDC), Recharts 3 (graphiques), `react-toastify`
  (notifications), `uuid`. Toute nouvelle dépendance structurante = décision d'architecture (ADR).
  Mises à jour de dépendances pilotées par Renovate (`renovate.json`).

## Décisions d'architecture (ADR)

- Fichier `docs/adr/NNN-titre-court.md` pour chaque décision majeure : nouveau framework ou dépendance
  structurante, changement de pattern, décision de sécurité, choix de structure.
- ARCos prépare le contenu ; 🟣 DOCly rédige le fichier (skill `adr-writing`).

## Intégrations externes

- **API backend `gestion-budget-serverless`** (microservices Quarkus sur AWS Lambda, via AWS API Gateway) :
  contrat (URL, paramètres, codes retour, rôles) défini en coordination avec l'architecte backend ; toute
  évolution de modèle → vérifier côté backend.
- **Google OIDC** via `react-oidc-context` ; jeton stocké/récupéré par `Auth.service.ts`.
- Configuration des URLs / clés : `src/main/Utils/AppTechEnums.constants.ts` et variables `VITE_*` des fichiers
  `external-ressources/conf/.env.{dev,staging,production}` (copiés en `.env` racine par la CI).
- Hébergement : statique S3 + CloudFront (CI GitHub Actions, `.github/workflows/`).

## Handoff vers ⚫ MAINa

ARCos ne crée ni tâches ni plan. Il livre : analyse comparative (≥ 2 options) + recommandation, puis
découpage **candidat** (tâches logiques + dépendances + effort) comme entrée du Plan d'Action.
