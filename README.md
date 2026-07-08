## Application Web de gestion du budget

| Module                                                                       | Version                                                                                                                                               |
|------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| [IHM](https://github.com/vzwingma/gestion-budget-ihm)                        | [![GitHub version](https://badge.fury.io/gh/vzwingma%2Fgestion-budget-ihm.svg)](https://badge.fury.io/gh/vzwingma%2Fgestion-budget-ihm)               |
| [Services serverless](https://github.com/vzwingma/gestion-budget-serverless) | [![GitHub version](https://badge.fury.io/gh/vzwingma%2Fgestion-budget-serverless.svg)](https://badge.fury.io/gh/vzwingma%2Fgestion-budget-serverless) |

### Statut

[![CI/CD - Snapshot IHM](https://github.com/vzwingma/gestion-budget-ihm/actions/workflows/build-on-master.yml/badge.svg)](https://github.com/vzwingma/gestion-budget-ihm/actions/workflows/build-on-master.yml)
[![CI/CD - Release IHM](https://github.com/vzwingma/gestion-budget-ihm/actions/workflows/build-on-tags.yml/badge.svg)](https://github.com/vzwingma/gestion-budget-ihm/actions/workflows/build-on-tags.yml)

[![GitHub issues](https://img.shields.io/github/issues-raw/vzwingma/gestion-budget-ihm.svg?style=flat-square)](https://github.com/vzwingma/gestion-budget-ihm/issues)
[![Known Vulnerabilities](https://snyk.io/test/github/vzwingma/gestion-budget-ihm/badge.svg?targetFile=package.json)](https://snyk.io/test/github/vzwingma/gestion-budget-ihm?targetFile=package.json)
[![Dépendences](https://img.shields.io/librariesio/github/vzwingma/gestion-budget-ihm.png)](https://libraries.io/github/vzwingma/gestion-budget-ihm)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=vzwingma_gestion-budget-ihm&metric=alert_status)](https://sonarcloud.io/dashboard?id=vzwingma_gestion-budget-ihm)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=vzwingma_gestion-budget-ihm&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=vzwingma_gestion-budget-ihm)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=vzwingma_gestion-budget-ihm&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=vzwingma_gestion-budget-ihm)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=vzwingma_gestion-budget-ihm&metric=security_rating)](https://sonarcloud.io/dashboard?id=vzwingma_gestion-budget-ihm)

### Description

Frontend React/TypeScript strict de gestion du budget personnel. L'application permet de consulter les comptes,
analyser les operations, gerer les budgets et naviguer via `HashRouter`. Les echanges HTTP passent par
`ClientHTTP.service.ts`, avec etat global centralise dans `BudgetContextProvider.tsx`.

---

## Prérequis

- **Node.js** version épinglée dans `.nvmrc` et **npm 10+**
- Un fichier `.env.dev` (ou `.env.qua` / `.env.prod`) sous `external-ressources/conf/`

---

## Installation

```bash
npm ci --ignore-scripts
```

---

## Démarrage local

```bash
npm run start:dev     # utilise .env.dev (http://localhost:3000)
npm run start:qua     # utilise .env.qua
npm run start:prod    # utilise .env.prod
```

---

## Commandes

```bash
# Lancer tous les tests (mode watch)
npm run test

# Tests en CI (sans watch, avec coverage)
npm run test:coverage

# Lancer le linter
npm run lint

# Build de production
npm run build
```

---

## Variables d'environnement

Préfixe `VITE_*` (migré depuis `REACT_APP_*`, voir [ADR 001](docs/adr/001-migration-cra-vers-vite.md)). Chaque fichier `.env.*` doit définir :

| Variable | Description |
|---|---|
| `VITE_CONFIG_URL_COMPTES` | URL µService comptes |
| `VITE_CONFIG_URL_OPERATIONS` | URL µService opérations |
| `VITE_CONFIG_URL_PARAMS` | URL µService paramètres |
| `VITE_CONFIG_URL_UTILISATEURS` | URL µService utilisateurs |
| `VITE_CONFIG_OIDC_AUTHORITY` | URL autorité OIDC (Google) |
| `VITE_CONFIG_OIDC_CLIENT_ID` | Client ID Google OAuth |
| `VITE_CONFIG_OIDC_CLIENT_SECRET` | Secret Google OAuth |
| `VITE_CONFIG_API_KEY` | Clé API Gateway AWS (`X-Api-Key`) |

---

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Instructions Copilot](.github/copilot-instructions.md)
- [Wiki du projet](https://github.com/vzwingma/gestion-budget-ihm/wiki)
- [Backend (gestion-budget-serverless)](https://github.com/vzwingma/gestion-budget-serverless)
