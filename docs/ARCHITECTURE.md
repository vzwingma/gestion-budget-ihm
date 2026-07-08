# 🏗️ Architecture — gestion-budget-ihm

---

## 🎯 Vue d'ensemble

**gestion-budget-ihm** est une application web frontend de gestion budgetaire personnelle. Elle permet de visualiser et
gerer les comptes bancaires, les operations financieres et les analyses budgetaires.

| Propriété | Valeur |
|---|---|
| **Type** | frontend |
| **Stack principale** | React 19.1.1 + TypeScript |
| **Plateforme cible** | web |
| **Langue UI** | Français |
| **Statut** | En développement |

---

## 🏢 Architecture Globale

```
gestion-budget-ihm
├── Components/      # Composants React UI (TSX) — analyses/, budgets/, operations/, shared/
├── Models/          # Modèles TypeScript + React Context (BudgetContextProvider)
├── Services/        # ClientHTTP.service.ts, Auth.service.ts
└── Utils/           # Constantes, enums (AppTechEnums, AppBusinessEnums)
```

### Flux de données principal

```
Utilisateur (navigateur)
    → Composant React UI (Components/)
    → ClientHTTP.service.ts (attache X-Api-Key + Bearer token)
    → Microservices AWS Lambda (gestion-budget-serverless)
    ← Réponse JSON → BudgetContext → re-render
```

---

## 📂 Structure des Dossiers

```
gestion-budget-ihm/
├── src/
│   ├── index.tsx                         # Point d'entrée React
│   └── main/
│       ├── Main.tsx                      # Router principal (HashRouter)
│       ├── Components/                   # Composants React UI
│       │   ├── Components.props.ts       # Toutes les interfaces de props
│       │   ├── analyses/                 # Composants analyses budgétaires
│       │   ├── budgets/                  # Composants gestion budgets
│       │   ├── infos/                    # Composants informatifs
│       │   ├── mainpages/                # Pages principales
│       │   ├── menuTopBar/               # Barre de navigation
│       │   └── shared/                   # Composants partagés
│       ├── Models/                       # Modèles TypeScript + Context
│       │   ├── contextProvider/          # BudgetContextProvider.tsx
│       │   ├── analyses/                 # Modèles analyses
│       │   ├── budgets/                  # Modèles budgets
│       │   ├── infos/                    # Modèles infos
│       │   └── profiles/                 # Modèles profils utilisateur
│       ├── Services/                     # Couche HTTP et Auth
│       └── Utils/                        # Constantes et utilitaires
├── docs/                                 # Documentation versionnée
│   ├── ARCHITECTURE.md                   # Ce fichier
│   └── adr/                              # Architecture Decision Records
├── public/                               # Assets statiques
├── .github/                              # CI/CD, instructions Copilot
└── package.json                          # Dépendances npm
```

---

## 🔧 Stack Technique

### Dépendances principales

| Catégorie | Librairie / Framework | Version | Rôle |
|---|---|---|---|
| Framework UI | React | 19.1.1 | Rendu composants |
| Langage | TypeScript | strict | Typage statique |
| Composants UI | @mui/material | 9.x | Bibliothèque UI (seule autorisée) |
| Icônes | @mui/icons-material | 9.x | Icônes Material |
| Routage | react-router-dom | 7.9.1 | HashRouter, navigation SPA |
| Auth / OIDC | react-oidc-context | 3.3.0 | Google OAuth2/OIDC |
| Visualisation | recharts | 3.2.1 | Graphiques (AreaChart, TreeMap) |
| Notifications | react-toastify | 11.0.5 | Toasts utilisateur |
| UUID | uuid | 14.0.0 | Génération identifiants |
| Tests | Vitest + @testing-library/react | 16.3 | Tests unitaires + composants |
| Jest DOM | @testing-library/jest-dom | 6.8 | Assertions DOM |
| User events | @testing-library/user-event | 14.6 | Simulation interactions |
| Build | Vite | 6.x | Bundler (esbuild dev, Rollup prod) |
| CSS minify | css-minify | 2.x | Minification CSS pré-build |

> ⚠️ Maintenir ce tableau à jour à chaque montée de version majeure.

### Variables d'environnement

> Préfixe `VITE_*` (migré depuis `REACT_APP_*` lors de la migration Vite — voir `docs/adr/001-migration-cra-vers-vite.md`). Accès via `import.meta.env.VITE_*`.

| Variable | Description | Exemple |
|---|---|---|
| `VITE_BUDGET_VERSION` | Version de l'application affichée | `24.0-SNAPSHOT` |
| `VITE_CONFIG_API_KEY` | Clé API Gateway AWS (header `X-Api-Key`) | `AWS_API_KEY` |
| `VITE_CONFIG_DEBUG` | Mode debug activé | `true` |
| `VITE_CONFIG_OIDC_AUTHORITY` | URL autorité OIDC Google | `https://accounts.google.com/` |
| `VITE_CONFIG_OIDC_CLIENT_ID` | Client ID Google OAuth | `0000.apps.googleusercontent.com` |
| `VITE_CONFIG_OIDC_CLIENT_SECRET` | Secret Google OAuth | `FFFF` |
| `VITE_CONFIG_URL_COMPTES` | URL µService gestion des comptes | `http://localhost:8092` |
| `VITE_CONFIG_URL_OPERATIONS` | URL µService gestion des opérations | `http://localhost:8094` |
| `VITE_CONFIG_URL_PARAMS` | URL µService paramètres | `http://localhost:8091` |
| `VITE_CONFIG_URL_UTILISATEURS` | URL µService utilisateurs | `http://localhost:8093` |

Fichiers d'environnement : `external-ressources/conf/.env.{dev,staging,production,oidc}`

---

## 🔄 Intégrations Externes

| Système | Type | URL / Endpoint | Authentification |
|---|---|---|---|
| µService Comptes | REST (AWS Lambda) | `VITE_CONFIG_URL_COMPTES` | JWT Bearer + `X-Api-Key` |
| µService Opérations | REST (AWS Lambda) | `VITE_CONFIG_URL_OPERATIONS` | JWT Bearer + `X-Api-Key` |
| µService Paramètres | REST (AWS Lambda) | `VITE_CONFIG_URL_PARAMS` | JWT Bearer + `X-Api-Key` |
| µService Utilisateurs | REST (AWS Lambda) | `VITE_CONFIG_URL_UTILISATEURS` | JWT Bearer + `X-Api-Key` |
| Google OAuth2 | OIDC | `https://accounts.google.com/` | Client ID + Secret |

Le backend est le repo [`gestion-budget-serverless`](https://github.com/vzwingma/gestion-budget-serverless) (Quarkus microservices sur AWS Lambda).

---

## 🔐 Sécurité

- **Authentification** : Google OAuth2 via `react-oidc-context`. Tokens gérés par `Auth.service.ts`
- **Autorisation** : Token Bearer attaché à chaque requête HTTP sortante
- **API Key AWS** : Header `X-Api-Key` injecté automatiquement par `ClientHTTP.service.ts`
- **Données sensibles** : Jamais de secrets dans le code source. Toujours dans les fichiers `.env.*` (gitignorés). En CI, via GitHub Secrets/Variables.
- **Validation des entrées** : Typage TypeScript strict côté frontend

---

## 🧪 Tests

| Type | Framework | Emplacement | Couverture cible |
|---|---|---|---|
| Unitaires | Vitest + React Testing Library | `src/**/*.test.tsx` / `*.test.ts` | ≥80% |

Commande pour lancer les tests : `npm run test:coverage`  
Rapport de couverture : `coverage/lcov.info`  
Qualité : SonarCloud (organisation `vzwingma-github`, projet `vzwingma_gestion-budget-ihm`)

---

## 📐 Conventions et Patterns

> Résumé des conventions clés — pour le détail, voir `.github/copilot-instructions.md`.

- **Nommage fichiers** : `PascalCase.tsx` pour composants, `camelCase.service.ts` pour services, `camelCase.constants.ts` pour constantes
- **Nommage variables** : camelCase pour variables/fonctions, PascalCase pour composants et interfaces
- **Composants** : Toujours `React.FC<Props>`, fonctionnels uniquement. Props interfaces dans `Components.props.ts`
- **Sous-composants** : Dans `subcomponents/`, boutons d'action dans `actions/`
- **Gestion d'état** : BudgetContext pour l'état global, `useState` pour l'état UI local
- **Appels HTTP** : Toujours via `ClientHTTP.service.ts`. URLs avec `{{}}` comme marqueur positionnel. Jamais `fetch` directement dans un composant
- **Layout** : `Box`/`Grid` MUI pour la mise en page, `useMediaQuery`/`useTheme` pour le responsive
- **Optimisation** : `useMemo` pour les calculs dérivés coûteux, `useCallback` pour les handlers passés en props
- **Gestion erreurs** : Codes HTTP 403 → logout, autres erreurs → toast via react-toastify

---

## 🗺️ Décisions Architecturales (ADR)

> Les décisions architecturales majeures sont documentées dans `docs/adr/`.  
> Format : `docs/adr/NNN-titre-court.md`

| # | Décision | Statut | Date |
|---|---|---|---|
| 001 | [Migration du socle build Create React App vers Vite](./adr/001-migration-cra-vers-vite.md) | ✅ Acceptée | 2026-07-07 |

> 💡 Chaque nouvelle décision architecturale majeure doit faire l'objet d'un ADR. Voir `docs/adr/` pour les détails.

---

## 📈 Performance

- `useMemo` pour les calculs dérivés coûteux dans les composants (ex : totaux budgétaires, agrégations)
- `useCallback` pour les handlers passés en props afin d'éviter les re-renders inutiles
- Minification CSS pré-build via `css-minify` sur `public/styles/application.css`
- Pagination des listes volumineuses côté API (gérée par les µServices)

---

## 🚀 Déploiement

| Environnement | URL | Déclencheur |
|---|---|---|
| Développement | `http://localhost:3000` | `npm run start:dev` |
| QUA (staging) | CloudFront `E1PBK2ENEPNHGV` | Push sur `master` |
| Production | CloudFront prod | Tag `v*` |

Pipeline CI/CD : GitHub Actions — `.github/workflows/`
- `build-on-master.yml` : build QUA → lint → tests → SonarCloud → deploy S3 `budget-app-ihm-qua` (eu-west-3)
- `build-on-tags.yml` : build PROD → deploy S3 prod
- `build-on-all.yml` : build/lint/tests sur toutes les PRs

---

## 📝 Historique des Versions

> Ajouter une entrée à chaque version livrée (en tête de liste).

| Version | Date | Changements majeurs |
|---|---|---|
| v24.0-SNAPSHOT | En cours | Migration socle build CRA → Vite + Vitest + TypeScript 5.9.3 (voir [ADR 001](./adr/001-migration-cra-vers-vite.md)) |

---

## 🔗 Ressources

- **README** : [`README.md`](../README.md)
- **Instructions Copilot** : [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
- **Plans d'Action** : [`.github/plans/`](../.github/plans/)
- **ADRs** : [`docs/adr/`](./adr/)
- **Backend** : [`gestion-budget-serverless`](https://github.com/vzwingma/gestion-budget-serverless)
