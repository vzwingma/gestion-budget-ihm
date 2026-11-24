# 🏗️ Architecture — gestion-budget-ihm

---

## 🎯 Vue d'ensemble

**gestion-budget-ihm** est une application web frontend de gestion budgetaire personnelle. Elle permet de visualiser et
gerer les comptes bancaires, les operations financieres et les analyses budgetaires.

| Propriété | Valeur |
|---|---|
| **Type** | frontend |
| **Stack principale** | React 19.3.1 + TypeScript |
| **Plateforme cible** | web |
| **Langue UI** | Français |
| **Statut** | En développement |

---

## 🏢 Architecture Globale

```
gestion-budget-ihm
├── Components/      # Composants React UI (TSX) — analyses/, budgets/, operations/, shared/
├── hooks/           # Hooks custom : useAuthTokenSync, useBudgetContext, useFetch, useIsTouchDevice
├── Models/          # Modèles TypeScript + React Context (BudgetContextProvider)
├── Services/        # ClientHTTP.service.ts, Auth.service.ts, CallAndNotify.service.ts
└── Utils/           # Constantes, enums (AppTechEnums, AppBusinessEnums), Debug.utils.ts, Equation.utils.ts (évaluation sûre des formules de montant)
```

### Flux de données principal

```
Utilisateur (navigateur)
    → Composant React UI (Components/)
    → ClientHTTP.service.ts (attache X-Api-Key + Bearer token)
    → Microservices AWS Lambda (gestion-budget-serverless)
    ← Réponse JSON → BudgetContext → re-render
```

### Data-fetching

- **Lecture de données** : les `*.extservices.ts` exposent des variantes Promise `fetch*` (`fetchCategories`, `fetchBudget`, `fetchPreferenceUtilisateur`, `fetchLibellesOperationsCompte`, `fetchInfosFromMicroServices`, `fetchLastAccessDateUtilisateur`, `fetchComptes`, `fetchSoldesBudget`), enveloppées par `callWithNotify` (`Services/CallAndNotify.service.ts`) : log `console.error` + toast d'erreur, puis relance de l'erreur. Les composants les consomment via `useFetch(fetcher, deps)` → `{ data, loading, error, refetch }` (les réponses périmées d'un chargement précédent sont ignorées). `useFetch` est adopté par `Budget`, `Recurrents`, `AnalysesFiltrePeriode`, `Infos`, `MainPage`, `ProfileInfos` et `CompteItem`.
- **Actions / sauvegardes** : `callAndNotify(promise, onSuccess, errorMessage, toastOptions?)` (même fichier) reste utilisé en mode callback (`BudgetActionsButtonGroup`, `saveOperation*`).
- **Pages budget** : `BudgetPage` et `RecurrentsPage` sont des wrappers fins autour du hook `useBudgetPageData({ groupOperations, prepareBudget? })` (`Components/budgets/shared/useBudgetPageData.ts`, références de paramètres stables). Le hook : charge le budget (`useFetch` sur `[selectedCompte, selectedDate]`), réinitialise le contexte (budget et opération courants) sur ce même changement, injecte le budget chargé **une seule fois par budget reçu** (ref sur le dernier budget injecté : `useFetch` conserve l'ancien `data` pendant un rechargement, il ne doit jamais être réinjecté après le reset), expose `handleBudgetUpdate`, le regroupement des opérations (`useMemo`) et `userDroits`. Le groupe d'actions reste dans chaque wrapper (droits et callback de création différents).

```
BudgetPage / RecurrentsPage → useBudgetPageData → useFetch(fetchBudget) → setCurrentBudget (contexte)
                            → groupOperations (useMemo) → listes + BudgetPageShell
```

- **Contexte budget** : les consumers lisent `useCurrentBudget()` ou `useBudgetSelection()` selon la moitié utilisée. Seuls 3 restent sur l'agrégat `useBudgetContext()` car ils lisent les deux moitiés : `OperationDetailLibelle`, `OperationDetailCategoriesSection`, `OperationRecurrenteDetailPage`. `OperationDetailCategories` reçoit `listeCategories` en prop.
- **Dates** : `getLabelISOFromDate` (`Utils/Date.utils.ts`) formate `yyyy-mm-dd` en composantes **locales** (une date API `2026-03-01T00:00:00` ne s'affiche plus la veille en France). Limite connue et acceptée : la saisie utilisateur est stockée en minuit UTC et envoyée telle quelle à l'API (ne pas passer en minuit local) ; l'affichage serait décalé d'un jour dans un fuseau à l'ouest de l'UTC (hors usage).

```
Composant → useFetch(() => fetchX(...), [deps])
          → fetchX (extservices) → callWithNotify(call(...))
          → ClientHTTP.service.ts → µService
```

### Édition d'une opération

L'état d'édition est **immuable** : l'opération du contexte (`currentOperation`) n'est jamais mutée pendant l'édition.

- Le hook `useOperationEditForm` (`Components/budgets/operations/courantes/detail/useOperationEditForm.ts`, à côté de la page : il dépend de `Components/`, donc hors de `hooks/`) porte l'état de la page `OperationDetailPage` : `editForm`, `editOperation` (brouillon), `errors`, `resetKey` (remise à zéro du montant entre deux créations). Il est initialisé à la sélection pendant le rendu et expose `handleClick`, `validate`, `setEtatInCreation`, `commitOperation`.
- La logique de modification est dans `OperationDetailPage.controller.ts` sous forme de fonctions pures (`fillOperationField`, `fillCategorieForm`, `applyCategorieParente`, `applyRentreeArgent`, `applyActifInvest`, `applyDefaut`, `applyEtatInCreation`, `openField`) et de clones (`cloneOperation`, `cloneOperationEdition`, `cloneOperationModel`).
- La validation porte sur le brouillon. Sauvegarde : `saveOperation(updated, budget, wrapper)` ; le wrapper appelle `onOperationChange` puis `onOperationCommit` **uniquement au succès** (le brouillon devient alors `currentOperation`). En cas d'échec : ni commit ni changement d'écran. En création : `handleDateOperationFromAction(date, etat)`.

```
Saisie → handleClick / fillX (fonctions pures) → editOperation (brouillon copié)
       → validate → saveOperation → [succès] onOperationChange → onOperationCommit → currentOperation
                                  → [échec]  brouillon conservé, erreur affichée
```

---

## 📂 Structure des Dossiers

```
gestion-budget-ihm/
├── src/
│   ├── index.tsx                         # Point d'entrée React
│   └── main/
│       ├── Main.tsx                      # Router principal (HashRouter), routes lazy + AuthTokenSync ; routes métier sous RequireAuth
│       ├── Components/                   # Composants React UI
│       │   ├── analyses/                 # Composants analyses budgétaires (syntheses/AnalyseTooltip = tooltip recharts générique)
│       │   ├── budgets/                  # Composants gestion budgets
│       │   │   └── shared/               # BudgetPageShell.component.tsx (squelette commun Budget / Recurrents) + useBudgetPageData.ts (hook des données communes : fetch, reset, injection, regroupement, droits) ; operations/shared/ : OperationRecurrenteDetailDateFin.component.tsx (partagé courantes / récurrentes) ; operations/courantes/detail/ : OperationDetailPage (106 lignes, orchestration) + useOperationEditForm.ts (hook d'édition) + OperationDetailPage.controller.ts (fonctions pures) + subcomponents/ (dont OperationDetail{Header,CategoriesSection,MensualiteSection,EtatSection,ActionsSection}) + actions/
│       │   ├── infos/                    # Composants informatifs
│       │   ├── mainpages/                # Pages principales
│       │   ├── menuTopBar/               # Barre de navigation
│       │   └── shared/                   # Composants partagés (dont AuthTokenSync.component.tsx, RequireAuth.component.tsx : garde des routes métier, TapTooltip.component.tsx : infobulle survol desktop / tap tactile)
│       ├── hooks/                        # Hooks custom (useAuthTokenSync, useBudgetContext [+ useBudgetSelection, useCurrentBudget], useFetch, useIsTouchDevice ; budgetContexts.testutils.tsx = harnais de test des contextes)
│       ├── Models/                       # Modèles TypeScript + Context
│       │   ├── contextProvider/          # BudgetContextProvider.tsx (3 providers imbriqués ; ré-exporte les contextes et hooks de hooks/useBudgetContext.ts)
│       │   ├── analyses/                 # Modèles analyses
│       │   ├── budgets/                  # Modèles budgets
│       │   ├── infos/                    # Modèles infos
│       │   └── profiles/                 # Modèles profils utilisateur
│       ├── Services/                     # Couche HTTP, Auth, CallAndNotify
│       └── Utils/                        # Constantes et utilitaires (Debug.utils.ts, Equation.utils.ts, Banque.utils.ts : getBanqueIconSrc)
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
| Framework UI | React | 19.3.1 | Rendu composants |
| Langage | TypeScript | ^6.0.0 | Typage statique — « strict » fait ici référence à la rigueur générale du typage, pas à l'option compilateur `strict` (non activée explicitement dans `tsconfig.json`) |
| Composants UI | @mui/material | 9.x | Bibliothèque UI (seule autorisée) |
| Icônes | @mui/icons-material | 9.x | Icônes Material |
| Routage | react-router-dom | 7.9.1 | HashRouter, navigation SPA |
| Auth / OIDC | react-oidc-context | 3.3.0 | Google OAuth2/OIDC |
| Visualisation | recharts | 3.2.1 | Graphiques (AreaChart, TreeMap) |
| Notifications | react-toastify | 11.0.5 | Toasts utilisateur |
| UUID | uuid | 14.0.0 | Génération identifiants |
| Tests | Vitest (+ `@vitest/coverage-v8`) | ^5.0.0 | Test runner + couverture |
| Tests | @testing-library/react | ^16.3.0 | Tests de composants |
| Jest DOM | @testing-library/jest-dom | ^7.0.0 | Assertions DOM |
| User events | @testing-library/user-event | 14.6 | Simulation interactions |
| Build | Vite | 8.1.4 | Bundler (esbuild dev, Rollup prod) |
| Build | @vitejs/plugin-react | 6.0.3 | Plugin React (JSX, Fast Refresh) pour Vite |
| CSS minify | css-minify | 2.x | Minification CSS pré-build |

> ⚠️ Maintenir ce tableau à jour à chaque montée de version majeure.
>
> 📌 **Montée de version reportée (2026-07-10)** : `typescript` v7 et `typescript-eslint` v9/v10 **non montés** — `typescript-eslint` n'a, au moment du chantier, publié aucune release stable compatible TS7 (v9/v10 absents de npm ; TS7 fait crasher `typescript-eslint@8.63.0` avec `TypeError: Cannot read properties of undefined (reading 'Cjs')`). Repo reste sur `typescript ^6.0.0` + `typescript-eslint ^8.63.0`. À surveiller/reprendre dès publication d'une release `typescript-eslint` compatible TS7 (voir `.claude/plans/003_migration_dependances_ts_vite.plan.md`).

### Variables d'environnement

> Préfixe `VITE_*` (migré depuis `REACT_APP_*` lors de la migration Vite — voir `docs/adr/001-migration-cra-vers-vite.md`). Accès via `import.meta.env.VITE_*`.

| Variable | Description | Exemple |
|---|---|---|
| `VITE_BUDGET_VERSION` | Version de l'application affichée, au format `[ENV].[VERSION].[DATE_HEURE]` en DEV/QUA (calculée par la CI, voir [Version affichée](#version-affichée-vite_budget_version)) | `QUA.27.20261026-1018` |
| `VITE_CONFIG_API_KEY` | Clé API Gateway AWS (header `X-Api-Key`) | `AWS_API_KEY` |
| `VITE_CONFIG_DEBUG` | Mode debug : si renseigné, active les logs `debug()` (voir [Mode debug](#-mode-debug)) ; absent en QUA/PROD | `true` |
| `VITE_CONFIG_OIDC_AUTHORITY` | URL autorité OIDC Google | `https://accounts.google.com/` |
| `VITE_CONFIG_OIDC_CLIENT_ID` | Client ID Google OAuth | `0000.apps.googleusercontent.com` |
| `VITE_CONFIG_OIDC_CLIENT_SECRET` | Secret Google OAuth | `FFFF` |
| `VITE_CONFIG_URL_COMPTES` | URL µService gestion des comptes | `http://localhost:8092` |
| `VITE_CONFIG_URL_OPERATIONS` | URL µService gestion des opérations | `http://localhost:8094` |
| `VITE_CONFIG_URL_PARAMS` | URL µService paramètres | `http://localhost:8091` |
| `VITE_CONFIG_URL_UTILISATEURS` | URL µService utilisateurs | `http://localhost:8093` |

Fichiers d'environnement : `external-ressources/conf/.env.{dev,staging,production,oidc}`

#### Version affichée (`VITE_BUDGET_VERSION`)

La version projet (`package.json`, `package-lock.json`) est `27.0.0`. En DEV et QUA, la valeur affichée est calculée par la CI au format `[ENV].[VERSION].[DATE_HEURE]` (ex. `QUA.27.20261026-1018`) :

| Segment | Valeur |
|---|---|
| `ENV` | `DEV` (`build-on-all.yml`, branches ≠ `master`, depuis `.env.dev`) ou `QUA` (`build-on-master.yml`, depuis `.env.staging`) |
| `VERSION` | Version **majeure** de `package.json` (`27` pour `27.0.0`) |
| `DATE_HEURE` | `yyyyMMdd-HHmm` du build CI, heure de Paris (`TZ=Europe/Paris`) |

- `.env.dev` / `.env.staging` contiennent le placeholder `__BUDGET_IHM_VERSION__` (ex. `VITE_BUDGET_VERSION=QUA.__BUDGET_IHM_VERSION__`), remplacé par `sed` dans l'étape « Update config » du workflow (`<VERSION>.<DATE_HEURE>`).
- **Local** (`npm run start:dev`, qui lit un `.env` à la racine ; modèle `.env.model`) : valeur saisie à la main (ex. `DEV.27.yyyyMMdd-HHmm`).
- **PROD** (`build-on-tags.yml`) : inchangée — version du tag sans préfixe `v`, injectée via `__BUDGET_IHM_VERSION__` dans `.env.production`.

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
- **Synchronisation du token** : le composant `AuthTokenSync` (`Components/shared/AuthTokenSync.component.tsx`), monté une fois à la racine dans `Main.tsx` (dans `AuthProvider`), utilise le hook `useAuthTokenSync`. Le hook écoute les événements `addUserLoaded` / `addUserUnloaded` d'oidc-client et recopie le token dans le `localStorage` via `Auth.service.ts` (y compris lors de l'`automaticSilentRenew`). Ce pont ne dépend donc plus du montage de `Profile.component.tsx`.
- **Autorisation** : Token Bearer attaché à chaque requête HTTP sortante ; requête protégée refusée localement si le jeton est expiré, routes métier protégées par `RequireAuth` — voir [Expiration de session détectée côté client](#expiration-de-session-détectée-côté-client-plan-007)
- **API Key AWS** : Header `X-Api-Key` injecté automatiquement par `ClientHTTP.service.ts`
- **Données sensibles** : Jamais de secrets dans le code source. Toujours dans les fichiers `.env.*` (gitignorés). En CI, via GitHub Secrets/Variables.
- **Validation des entrées** : Typage TypeScript strict côté frontend. Saisie du montant d'une opération : valeurs non numériques (« abc ») ou ambiguës (« 2 3 ») refusées (« Le champ Montant est incorrect »)
- **Évaluation sûre de la saisie Montant** : le champ Montant accepte une formule (ex. `12,5+3*2`). Elle est évaluée par `evaluateEquation(input): number` (`Utils/Equation.utils.ts`), parseur à descente récursive **sans** `eval` / `new Function` / `RegExp` construite depuis la saisie. Grammaire : `expression := terme (('+'|'-') terme)*` ; `terme := facteur (('*'|'/') facteur)*` ; `facteur := ('+'|'-') facteur | nombre | '(' expression ')'` ; `nombre` décimal avec `.` ou `,`. Espaces (dont insécables) ignorés. Garde-fous : 100 caractères max (`EQUATION_MAX_LENGTH`), imbrication de parenthèses max 10 (`EQUATION_MAX_DEPTH`), division par zéro et résultat non fini refusés, tout autre caractère refusé (dont `%` et `**`) ⇒ « Le champ Montant est incorrect ». Convention : toute évaluation de saisie utilisateur passe par ce parseur, jamais par `eval` / `Function`.
- **Encodage des paramètres d'URL** : `evaluateURL` (`ClientHTTP.service.ts`) encode chaque paramètre de chemin ou de requête avec `encodeURIComponent` avant de remplacer le marqueur `{{}}` ; le remplacement se fait par fonction, donc les motifs `$&` / `$1` ne sont pas interprétés.
- **Audit (lots 4a et 5)** : aucun `new Function`, `eval`, `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `dangerouslySetInnerHTML`, `setAttribute`, `document.write`, `postMessage`, `window.open`, `<a>` / `href` / `target` dans le code de production. `globalThis.location.href = "/"` est une constante ; `redirect_uri` OIDC est l'URL du navigateur (validée par le fournisseur) ; `<Avatar src={profile.picture}>` vient de l'OIDC (image).
- **Icône de banque assainie (lot 6)** : `itemIcon` (valeur de l'API) n'est plus concaténé tel quel dans `<img src>` : `getBanqueIconSrc` (`Utils/Banque.utils.ts`) n'accepte qu'un nom de fichier `/^[\w.-]+$/` sans `..`, sinon `/img/icon.webp`. Utilisé aux 5 endroits (`AnalysesTitre`, `OperationDetailIntercompte`, `CompteTitre`, `CompteItem`, `OperationItem.renderer`).
- **Points connus, non corrigés** : (1) jeton OIDC en `localStorage` : risque accepté en l'absence de sink XSS ; (2) `logAuth` écrit le jeton Bearer et la clé API dans les logs quand `VITE_CONFIG_DEBUG` est actif : **conservé volontairement** (décision 👤 2026-10-27, risque accepté et documenté) ; usage développement uniquement, ne jamais activer le debug en QUA / PROD. Détail : [plan 006](../.claude/plans/006_revue_architecture_react.plan.md)

---

## 🧯 Gestion des erreurs HTTP et de la session

> Décision : [ADR 008](./adr/008-gestion-erreurs-http-et-session.md) (`Acceptée`). Backend : ADR-005 et ADR-008 du dépôt `gestion-budget-serverless` (validation du jeton par `quarkus-oidc`, `/_info` public).

- **Erreur typée** `HttpError` (`Services/HttpError.ts`) : `status`, `statusText`, `body` (console uniquement, jamais affiché), `cause`. Toute réponse non-2xx est rejetée en `HttpError` — y compris un 2xx dont le corps n'est pas du JSON (204 compris : la règle « 204 → succès » a été retirée). Une erreur réseau donne une `HttpError` sans statut, avec `cause`.
- **Déconnexion unique sur 401/403 avec jeton** : si la requête portait un jeton et qu'il s'agit encore du jeton courant (`getOAuthToken() === token` au retour de la réponse — sinon le jeton a été renouvelé entre l'envoi et la réponse, pas de déconnexion), `ClientHTTP.service.ts` déclenche le gestionnaire de déconnexion derrière une garde anti-réentrance (`deconnexionEnCours`, jamais réarmée : une déconnexion lancée se termine par un rechargement de page). Le gestionnaire, enregistré par `useAuthTokenSync`, pose un drapeau sessionStorage, appelle `auth.removeUser()`, puis `location.href = "/"`. Au retour sur la page Infos (qui a son propre `ToastContainer`), toast « Session expirée, reconnectez-vous ». Sans jeton (visiteur anonyme), ou avec un jeton déjà renouvelé : simple `HttpError`, sans déconnexion.
- **Repli sans gestionnaire** (`logOut()`, utilisé si `useAuthTokenSync` n'est pas monté) : pose le drapeau, nettoie le storage local, redirige — mais **n'appelle pas** `removeUser` (inaccessible hors React). L'utilisateur OIDC est resynchronisé par `useAuthTokenSync` après le rechargement de page.
- **Aucun en-tête `Authorization`** n'est envoyé sans jeton (fin de `Bearer null`).
- **Notifications** (`CallAndNotify.service.ts`, `notifierErreur` exporté) :
  - aucun toast **ni log** sur 401/403 (la trace `console.warn` est déjà émise par `ClientHTTP.call`) ;
  - messages techniques centralisés : 503 « Service momentanément indisponible, réessayez », 500 « Erreur interne du serveur, réessayez plus tard », réseau « Serveur injoignable, vérifiez votre connexion » ;
  - surchargeables par appel via le paramètre optionnel `messagesParStatut` (utilisé par le plan 011) ;
  - le libellé renvoyé par le backend ne va qu'en console, jamais dans un toast ;
  - Analyses (`Analyses.extservices.ts`, `Analyses.controller.ts`) : les toasts d'erreur passent par `notifierErreur`.
- **`useFetch`** accepte l'option `{ enabled }` ; `MainPage` attend `auth.isAuthenticated` avant ses appels (cas du F5).

### Expiration de session détectée côté client (plan 007)

> Décision : [ADR 009](./adr/009-expiration-session-routes-protegees.md) (`Acceptée`). Complète la déconnexion réactive 401/403 ci-dessus : l'expiration est détectée **avant** l'effet métier, sans attendre un rejet serveur.

- **Source d'expiration** : claim `exp` du JWT `id_token` réellement envoyé aux services (`estTokenExpire`, `Auth.service.ts`), et non l'`access_token` OIDC. Décodage local, **signature non vérifiée** (contrôle de confort, pas de sécurité : le serveur reste l'autorité). Jeton absent, opaque, malformé ou sans `exp` numérique fini : expiration **indéterminée**, traitée comme non expirée (avertissement console sans jeton ni claims) ; le serveur tranche.
- **Garde commune** `verifierSessionExpiree(token)` (`ClientHTTP.service.ts`) : renvoie `true` si une déconnexion est déjà en cours ou si le jeton est expiré, et dans ce cas déclenche la déconnexion **unique** existante (`deconnexionEnCours`, gestionnaire enregistré par `useAuthTokenSync` : drapeau « session expirée », suppression du token et de l'utilisateur OIDC, puis `location.href = "/"`). Au retour sur l'accueil public, toast « Session expirée, reconnectez-vous ».
- **Contrôles événementiels** (`useAuthTokenSync`, armés une fois la restauration OIDC terminée — `auth.isLoading` et `auth.activeNavigator` faux) :
  - contrôle immédiat à l'armement, au `focus` de la fenêtre et au retour de visibilité (`visibilitychange` avec `visibilityState === "visible"`) ;
  - **première interaction** : listeners en phase de capture sur `window` pour `pointerdown`, `pointerup`, `mousedown`, `mouseup`, `click`, `dblclick`, `contextmenu`, `keydown`, `keypress`, `keyup`, `submit`. Si la session est expirée, l'événement est annulé (`preventDefault` + `stopImmediatePropagation`) avant les handlers métier React et les actions natives ; session valide : événement non modifié. `mousemove` n'est volontairement pas écouté ;
  - nettoyage de tous les listeners au démontage ; le jeton lu est celui du stockage (`getOAuthToken()`), prioritaire sur l'ancien jeton capturé par le hook, afin de ne pas déconnecter sur un jeton déjà renouvelé.
- **Refus local de requête** (`ClientHTTP.call`) : tout appel protégé avec un jeton expiré, ou pendant une déconnexion, est rejeté en `HttpError(401, "Session expirée")` **sans `fetch`** (jamais de succès factice). Seul `GET` de `SERVICES_URL.INFOS.GET_INFO` (`/_info`, public, page d'accueil) reste autorisé, sans en-tête `Authorization` si le jeton est expiré ou la déconnexion en cours.
- **Garde de routes** (`Components/shared/RequireAuth.component.tsx`, route de layout dans `Main.tsx`) : `/budgets`, `/recurrents` et `/analyses` sont sous `RequireAuth`. `/`, `/infos` et le callback OIDC restent publics. Comportement : OIDC en chargement ou navigation de callback → indicateur de chargement, aucun montage métier ; jeton expiré ou déconnexion en cours → rien n'est monté et la déconnexion est déclenchée ; non authentifié (ou sans `id_token`) → `<Navigate to="/" replace />` ; session valide → `<Outlet />`. Couvre accès direct par URL, historique et navigation interne.
- **Expiration ≠ erreur technique** : une erreur réseau, un 5xx ou un échec isolé du renouvellement silencieux (`addSilentRenewError` : simple `console.warn`) ne prouvent **pas** une expiration et ne déconnectent pas. La politique 401/403 de l'ADR 008 est inchangée (déconnexion unique si jeton courant ; réponse d'un ancien jeton renouvelé ignorée). Le renouvellement silencieux (`automaticSilentRenew`) est conservé.
- **Limites** :
  - pas de surveillance périodique (option rejetée) : une session expirée dans un onglet inactif n'est détectée qu'au focus, au retour de visibilité, à la première interaction listée, à la navigation vers une route protégée ou au prochain appel protégé ;
  - la saisie en cours est perdue à l'expiration (accepté, ADR 008) ;
  - horloge locale : un décalage de l'horloge du poste influe sur la détection ; signature du jeton non contrôlée localement ;
  - la garde de routes est une protection d'interface, pas d'autorisation : la sécurité reste côté backend ;
  - le repli `logOut()` (hors gestionnaire enregistré) n'appelle pas `removeUser` (voir ci-dessus) ;
  - validé par tests simulant OIDC (jsdom), pas par test en navigateur réel.
- **Preuves QA** (plan 007) : 11 fichiers / 118 tests Vitest verts (hooks, ClientHTTP, Main, shared) ; typecheck, lint (0 erreur) et build OK ; couverture des fichiers modifiés 93,1 % instructions / 87,6 % branches (Main 100, RequireAuth 100, useAuthTokenSync 100, ClientHTTP 91, Auth.service 81). Régression démontrée : avec le code de production antérieur au correctif, 4 fichiers de tests sur 5 échouent ; code restauré, 5/5 verts.

### Impacts IHM du plan backend 004 — Phase 1 (plan [011](../.claude/plans/011_impacts_ihm_phase1_backend.plan.md), décisions 👤 Gate #0 du 2026-11-04)

Le backend renvoie désormais, pour un compte **inactif** sans budget du mois demandé, le **dernier budget disponible** (200) au lieu d'un 404 (F3) ; des codes HTTP plus précis sur le virement intercompte et les erreurs Mongo.

- **Bandeau « Compte inactif »** (`CompteTitre.component.tsx`, Budget et Récurrents) : `Utils/Budget.utils.ts#estBudgetDuMois` compare le budget reçu au mois sélectionné (champs `mois`/`annee` du `BudgetMensuelModel`, ou repli sur le suffixe `_AAAA_MM` de l'id). Si le budget reçu est d'un autre mois : bandeau « Compte inactif — dernier budget disponible : MM/AAAA », **sans recaler** la date sélectionnée (décision C2 — `selectedDate` est global, un recalage bloquerait la navigation). Le bouton « Réouvrir » est masqué dans ce cas (`BudgetActionsButtonGroup.component.tsx`) : il rouvrirait le budget du mois reçu, pas celui affiché.
- **Analyses** (`Analyses.controller.ts`) : le même filtre écarte un budget de repli hors mois demandé **avant** consolidation — sans lui, un compte inactif dupliquerait ses opérations et son solde sur chaque mois sans budget propre (I1-bis).
- **Écran d'erreur budget** (`useBudgetPageData.ts`, `BudgetPageShell.component.tsx`) : une erreur de chargement (404/503…) ferme le Backdrop et affiche le message + un bouton « Réessayer » (`refetchBudget`), au lieu de bloquer l'écran indéfiniment.
- **Menu des comptes** (`CompteItem.component.tsx`) : une erreur sur `/soldes` affiche « Indisponible » au lieu d'un spinner infini.
- **Messages HTTP → IHM** (virement intercompte, `OperationDetailPage.extservices.ts#saveOperationIntercompte`, via `messagesParStatut` de `notifierErreur`) :

  | Code | Message IHM | Cas |
  |---|---|---|
  | 406 | « Le compte destinataire est clos » | virement vers un compte clos |
  | 400 | « Virement vers le même compte impossible » | compte source = compte cible |
  | 404 | « Compte destinataire introuvable » | compte cible inexistant |
  | 503 | « Service momentanément indisponible, réessayez » | message technique centralisé (ADR 008), inchangé |

  401/403 restent gérés par la déconnexion unique (ci-dessus), sans message dédié. Le brouillon d'opération n'est jamais perdu sur erreur : il n'est promu `currentOperation` qu'au succès (`onOperationUpdate` non appelé en erreur).
- **Alignement du solde du compte inactif dans le menu** (`/soldes` du mois demandé vide, alors que le panneau principal affiche le solde du dernier budget disponible) : **écart accepté**, non traité — le fallback F3 n'est documenté côté backend que pour la lecture de budget, pas confirmé pour `/soldes`.

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
- **Composants** : Toujours `React.FC<Props>`, fonctionnels uniquement. Props définies à côté du composant (`*.component.tsx`) ou dans un `*.props.ts` voisin si partagées dans une feature (plus de fichier centralisé)
- **Sous-composants** : Dans `subcomponents/`, boutons d'action dans `actions/`
- **Gestion d'état** : état global scindé en deux contextes (`hooks/useBudgetContext.ts`) : `BudgetSelectionContext` (comptes, compte/date sélectionnés, catégories) lu via `useBudgetSelection()`, et `CurrentBudgetContext` (budget et opération courants) lu via `useCurrentBudget()`. `useBudgetContext()` reste l'agrégat des deux (12 champs) pour les composants qui lisent les deux moitiés. Les trois hooks lèvent une erreur hors `BudgetContextProvider`. `useState` pour l'état UI local ; les regroupements dérivés (opérations par date / périodicité) sont calculés via `useMemo`, pas stockés en state
- **Hooks custom** : dans `src/main/hooks/`. `useFetch(fetcher, deps)` retourne `{ data, loading, error, refetch }` ; adopté par les 7 composants de lecture de données (voir [Data-fetching](#data-fetching)). `useOperationEditForm` (dans `detail/`, car dépendant de `Components/`) porte l'état d'édition d'une opération (voir [Édition d'une opération](#édition-dune-opération))
- **État d'édition immuable** : ne jamais muter en place un state React ni l'opération du contexte ; toujours copier (`{ ...x }`, `cloneOperation`). Le brouillon n'est promu `currentOperation` qu'au succès de la sauvegarde
- **Appels HTTP** : Toujours via `ClientHTTP.service.ts`. URLs avec `{{}}` comme marqueur positionnel. Jamais `fetch` directement dans un composant. Les erreurs sont relancées avec `cause` (stack d'origine conservée). Dans les `*.extservices.ts` : variantes Promise `fetch*` via `callWithNotify(promise, errorMessage, toastOptions?)` pour les lectures (consommées par `useFetch`) ; `callAndNotify(promise, onSuccess, errorMessage, toastOptions?)` pour les actions/sauvegardes
- **Layout** : `Box`/`Grid` MUI pour la mise en page, `useMediaQuery`/`useTheme` pour le responsive
- **Optimisation** : `useMemo` pour les calculs dérivés coûteux, `useCallback` pour les handlers passés en props, `React.memo` pour les items de liste (voir [Performance](#-performance))
- **Gestion erreurs** : `HttpError` typée sur toute réponse non-2xx, déconnexion unique sur 401/403 avec jeton courant, messages techniques centralisés via `notifierErreur` — voir [Gestion des erreurs HTTP et de la session](#-gestion-des-erreurs-http-et-de-la-session)
- **Logs** : pas de `console.log` direct (règle ESLint `no-console`, `warn` et `error` autorisés). Logs de debug via `debug()` de `Utils/Debug.utils.ts` (voir [Mode debug](#-mode-debug))

---

## 🗺️ Décisions Architecturales (ADR)

> Les décisions architecturales majeures sont documentées dans `docs/adr/`.  
> Format : `docs/adr/NNN-titre-court.md`

| # | Décision | Statut | Date |
|---|---|---|---|
| 001 | [Migration du socle build Create React App vers Vite](./adr/001-migration-cra-vers-vite.md) | ✅ Acceptée | 2026-07-07 |
| 002 | [Introduction conditionnelle de TanStack Query (data-fetching)](./adr/002-tanstack-query-data-fetching.md) | ❌ Rejetée | 2026-10-27 |
| 007 | [Migration déploiement S3 `reggionick/s3-deploy` → AWS CLI natif](./adr/007-migration-s3-deploy-aws-cli.md) | ✅ Acceptée | 2026-10-25 |
| 008 | [Gestion des erreurs HTTP et de la session](./adr/008-gestion-erreurs-http-et-session.md) | ✅ Acceptée | 2026-11-04 |
| 009 | [Expiration de session et routes protégées](./adr/009-expiration-session-routes-protegees.md) | ✅ Acceptée | 2026-11-24 |

> 💡 Chaque nouvelle décision architecturale majeure doit faire l'objet d'un ADR. Voir `docs/adr/` pour les détails.

---

## 📈 Performance

- **Code splitting** : dans `Main.tsx`, les routes `MainPage` et `Infos` sont chargées via `React.lazy` et enveloppées dans `Suspense` (chunks séparés au build Vite)
- **Mémoïsation** : `React.memo` sur les items de liste `OperationItem`, `OperationRecurrenteItem` et `CompteItem` ; handlers de sélection passés à ces items stabilisés via `useCallback` (prérequis pour que `memo` soit effectif)
- `useMemo` pour les calculs dérivés coûteux dans les composants (ex : totaux budgétaires, agrégations, regroupements d'opérations)
- `useCallback` pour les handlers passés en props afin d'éviter les re-renders inutiles
- **Contexte scindé** : `BudgetSelectionContext` et `CurrentBudgetContext` limitent les re-renders (un changement de budget/opération courants ne re-rend plus les consumers de la sélection, et inversement). 12 consumers utilisent les hooks ciblés. **Limite connue** : 6 composants (`Budget`, `Recurrents`, `OperationDetailPage`, `OperationDetailCategories`, `OperationDetailLibelle`, `OperationRecurrenteDetailPage`) restaient sur l'agrégat `useBudgetContext()` à l'issue du lot 2 et se re-rendent à tout changement (à revérifier après le découpage du lot 3 ; voir dette du [plan 006](../.claude/plans/006_revue_architecture_react.plan.md))
- Minification CSS pré-build via `css-minify` sur `public/styles/application.css`
- Pagination des listes volumineuses côté API (gérée par les µServices)

---

## 🐞 Mode debug

- `Utils/Debug.utils.ts` expose `debug(...)` (équivalent `console.log`) et `isDebugEnabled()`.
- Les logs ne sont émis que si `VITE_CONFIG_DEBUG` est défini (non vide) ; actif dans `.env.dev`.
- ESLint : règle `no-console` (autorise `console.warn` / `console.error`) ; seul `Debug.utils.ts` est dérogataire pour `console.log`.
- Erreurs et alertes : `console.error` / `console.warn` (toujours émis).

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
| v27.1.0 | 2026-11-24 | Expiration de session IHM ([ADR 009](./adr/009-expiration-session-routes-protegees.md)) : contrôle au focus / retour de visibilité et à la première interaction (capture, événement annulé), refus local des requêtes protégées avec jeton expiré (`HttpError` 401, sans `fetch`), garde `RequireAuth` sur `/budgets`, `/recurrents`, `/analyses`, retour à l'accueil par la déconnexion unique existante ; réseau / 5xx / échec de renouvellement non assimilés à une expiration ; 118 tests verts, couverture 93,1 % / 87,6 % — voir [plan 007](../../.claude/plans/007_expiration-session-ihm.plan.md) |
| v27.0.0 | 2026-10-27 | Revue architecture React (plan 006, lot 6, Gate #4 en attente 👤) : hook `useBudgetPageData` (T1, pages Budget / Recurrents) avec correction d'un bug latent (réinjection d'un budget périmé) ; consumers migrés vers `useCurrentBudget()` / `useBudgetSelection()` (T6, 3 restent sur l'agrégat par choix) ; `getLabelISOFromDate` en composantes locales ; spinner `AnalysesFiltrePeriode` masqué sans compte ; `itemIcon` assaini (`getBanqueIconSrc`) ; ~150 tests (T20) : 1121 tests, couverture 97,67 % stmt ; `testTimeout` 15 s. Reste : 3 fichiers < 85 %, fuseau UTC- accepté — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v27.0.0 | 2026-10-27 | Décisions 👤 (plan 006) : TanStack Query non retenu (T12, [ADR 002](./adr/002-tanstack-query-data-fetching.md) `Rejetée`, `useFetch` + `fetch*` conservés) ; `logAuth` conservé en mode debug (risque accepté, usage dev uniquement) ; lot 6 décidé (T1, T6, T20, `getLabelISOFromDate` UTC, spinner `AnalysesFiltrePeriode`, `itemIcon`) — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v27.0.0 | 2026-10-27 | Revue architecture React (plan 006, lot 5, finitions) : `useOperationEditForm` déplacé de `hooks/` vers `Components/budgets/operations/courantes/detail/` (fin de la dépendance `hooks/` → `Components/`) ; champ date d'opération contrôlé par le brouillon (la date du jour s'affiche en création + « Valider l'opération ») ; `evaluateURL` encode les paramètres d'URL (`encodeURIComponent`) ; `AnalyseTreeMap` : erreur `tsc` corrigée ; audit URL / `href` / `window.open` réalisé ; `Components.props.ts` supprimé ; 981 tests. Reste : T12, T20, `logAuth` en debug — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v27.0.0 | 2026-10-26 | Revue architecture React (plan 006, lot 4a, sécurité) : `new Function` du calcul de montant remplacé par `evaluateEquation` (`Utils/Equation.utils.ts`, parseur à descente récursive, garde-fous longueur 100 / imbrication 10 / division par zéro). Écarts : `%` et `**` refusés, « --5 » accepté (= 5), « 1/0 » et saisies trop longues refusées ; 951 tests. Reste : T16, T12 — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v27.0.0 | 2026-10-26 | Versioning IHM (plan 008) : version projet alignée sur `27.0.0` (`package.json`, `package-lock.json`) ; `VITE_BUDGET_VERSION` en DEV/QUA calculée par la CI au format `[ENV].[VERSION].[DATE_HEURE]` (ex. `QUA.27.20261026-1018`, heure de Paris) via le placeholder `__BUDGET_IHM_VERSION__` de `.env.dev` / `.env.staging` remplacé dans `build-on-all.yml` / `build-on-master.yml` ; PROD (`build-on-tags.yml`) inchangée. Voir [plan 008](../.claude/plans/008_versioning_ihm_ci.plan.md) |
| v24.0-SNAPSHOT | 2026-10-26 | Revue architecture React (plan 006, lot 3) : correctif de la régression T10 (plus de re-rendu au clic sur un champ, PR #704) ; `OperationDetailPage` découpée (429 → 106 lignes) : hook `useOperationEditForm`, sous-composants `OperationDetail{Header,CategoriesSection,MensualiteSection,EtatSection,ActionsSection}`, fonctions pures dans `OperationDetailPage.controller.ts` ; état d'édition immuable (brouillon promu `currentOperation` au succès de la sauvegarde) ; défauts corrigés (date du jour en création, montant remis à zéro, libellé numérique, montants « abc » / ambigus refusés, `OperationDetailValeur` désactivé sur budget clos) ; 837 tests. Dette : sécurité `processEquation` (`new Function`), T16, T12 — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v24.0-SNAPSHOT | 2026-10-25 | Revue architecture React (plan 006, lot 2) : `useFetch` adopté par 7 composants (variantes Promise `fetch*` des extservices + `callWithNotify`, `callAndNotify` conservé pour les actions), `BudgetContext` scindé (`BudgetSelectionContext` / `CurrentBudgetContext`, hooks `useBudgetSelection` / `useCurrentBudget`, agrégat `useBudgetContext`), `OperationRecurrenteDetailDateFin` déplacé vers `operations/shared/`, spinners `CompteItem` / `AnalysesFiltrePeriode`, correctif `BudgetSoldes` (Fragment sous `Tooltip` MUI). Dette restante : découpage `OperationDetailPage`, T16, T20, ADR 002 — voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v24.0-SNAPSHOT | 2026-10-25 | Revue architecture React (plan 006, lot 1) : dossier `hooks/` (`useAuthTokenSync`, `useBudgetContext`, `useFetch`), `AuthTokenSync` à la racine, `callAndNotify`, mode debug `VITE_CONFIG_DEBUG` + règle `no-console`, code splitting des routes (`React.lazy`), `React.memo` sur items de liste, `BudgetPageShell`, `AnalyseTooltip` générique, erreurs HTTP avec `cause`. Dette restante : voir [plan 006](../.claude/plans/006_revue_architecture_react.plan.md) |
| v24.0-SNAPSHOT | 2026-07-10 | Montée deps : Vite 6→8.1.4, `@vitejs/plugin-react` 4→6.0.3, suppression `@babel/plugin-transform-private-property-in-object` (résidu CRA, sans usage réel). TypeScript v7 et `typescript-eslint` v9/v10 **reportés** (bloqueur npm — voir note Stack Technique ci-dessus). Voir `.claude/plans/003_migration_dependances_ts_vite.plan.md` |
| v24.0-SNAPSHOT | En cours | Migration socle build CRA → Vite + Vitest + TypeScript ^6.0.0 (voir [ADR 001](./adr/001-migration-cra-vers-vite.md)) |

---

## 🔗 Ressources

- **README** : [`README.md`](../README.md)
- **Instructions Copilot** : [`.github/copilot-instructions.md`](../.github/copilot-instructions.md)
- **Plans d'Action** : [`.claude/plans/`](../.claude/plans/)
- **ADRs** : [`docs/adr/`](./adr/)
- **Backend** : [`gestion-budget-serverless`](https://github.com/vzwingma/gestion-budget-serverless)
