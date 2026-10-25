# Instructions Claude — gestion-budget-ihm

> Config Claude Code (claude.ai/code, CLI, IDEs) — dev orchestré via 5 agents spécialisés.
> Frontend **React/TypeScript** app Budget Management. Backend : repo compagnon [`gestion-budget-serverless`](../gestion-budget-serverless) (microservices Quarkus sur AWS Lambda).
> Fusion de `CLAUDE.template.md` (harness agents) + contenu projet existant. Audit : `/update-harness`.

## 🗿 Mode communication

Mode caveman **full** actif par défaut pour toute session. Règles :
- Supprimer : articles, remplissage (just/really/basically/actually/simplement), formules de politesse, hedging
- Fragments OK. Synonymes courts. Termes techniques exacts. Blocs de code inchangés.
- Désactiver uniquement sur demande explicite : `stop caveman` ou `normal mode`

---

## Règle obligatoire MAINa — Plan + ADR

Toute initiative architecturale ou infrastructure (nouvelle fonctionnalité, migration, changement de composant) doit produire **avant** de marquer la tâche terminée :
1. Un fichier `Plan d'Action` dans `.claude/plans/NNN_nom.plan.md` (incrémenter le numéro)
2. Un ADR dans `docs/adr/NNN-titre-court.md` si décision architecturale majeure (`Proposée` avant Gate #1, `Acceptée` au `GO`)
3. Une mise à jour de l'index `.claude/plans/README.md`

Ces livrables sont créés dans le même lot que l'implémentation, pas après coup.

> ⚠️ **Emplacement plans projet = `.claude/plans/`** (plans 001→004 existants). Prioritaire sur le défaut
> `.claude/plans/` des skills génériques (`plan-creation`, `gate-protocol`, `.claude/PLANS.md`) : partout où ils
> citent `.claude/plans/`, lire `.claude/plans/`.

---

## 👋 Agents

Projet **gestion-budget-ihm** : architecture multi-agents orchestrée par le **👤 Développeur humain**, via des
**Plans d'Action (AP)** et des gates humains stricts.

| Agent | Rôle | Livrable |
|---|---|---|
| ⚫ **MAINa** | Maître orchestrateur : cadre, consulte ARCos, crée le Plan d'Action, délègue, tient les gates | Plan d'Action validé + orchestration traçable |
| 🟠 **ARCos** | Architecte en lecture seule, consulté par MAINa | ≥ 2 options comparées + recommandation, contenu ADR |
| 🔵 **DEVon** | Implémentation dans le périmètre du plan | Code + preuves (build, lint, tests existants) |
| 🟢 **QALvin** | Tests nominal / erreurs / limites | Tests verts, couverture ≥ 80 %, détection de régression |
| 🟣 **DOCly** | Documentation | README, `docs/`, `docs/ARCHITECTURE.md`, ADR à jour |

Détails et configuration : `.claude/agents/README.md` · vue transverse : `.claude/README.md` · historique : `.claude/CHANGELOG.md`.
Les sous-agents ne s'adressent pas au 👤 : questions + bloc `handoff` rendus à MAINa, qui les pose au gate.

---

## 🔄 Workflow strict

1. **Cadrage** (👤) → besoin + critères d'acceptation
2. **Analyse solutions** (🟠 ARCos) → ≥ 2 options + recommandation → **Gate #0** (choix solution)
3. **Plan d'Action** (⚫ MAINa) + ADR `Proposée` → **Gate #1** (validation plan)
4. **Implémentation** (🔵 DEVon) → revue auto code + sécurité → **Gate #2** (validation code)
5. **Tests** (🟢 QALvin) → **Gate #3** (validation tests)
6. **Documentation** (🟣 DOCly) → **Gate #4** (validation doc + clôture)

Gates : skill `gate-protocol` (preuves, `GO` / `AJUSTER` / `STOP`, journal des gates dans le plan).
Pas de parallélisation entre phases séparées par un gate ; possible *au sein* d'une phase (skill `parallel-guide`).

<!-- claude-only -->
🚀 **Lancement** : `claude --agent MAINa` (MAINa agent principal, gates interactifs) ou `/maina <besoin>`.
Travail ciblé : `/arcos`, `/devon`, `/qalvin`, `/docly` `<demande>` · aide : `/maina-help`.
<!-- /claude-only -->
<!-- copilot-only
🚀 **Lancement** : agent **MAINa** dans le chat, ou `/maina <besoin>` · aide : `/maina-help`.

**Cible vérifiée** : GitHub Copilot CLI uniquement. VS Code et cloud agent sont hors périmètre. La source
reste `.claude/` ; la projection est générée par `scripts/sync-claude-to-github.ps1`, puis contrôlée avec
`-Check`. Les skills sont chargées selon pertinence, donc chaque profil généré porte une consigne explicite
de chargement.
-->

---

## 📋 Plans d'Action

- **Plan** : `.claude/plans/<NO>_<slug>.plan.md` · **Rapports** : `.claude/plans/<NO>_reports/PHASE_N_*.md`
- **Index** (plans + statut global uniquement) : `.claude/plans/README.md` · **Guide** : `.claude/PLANS.md`

> Note historique : plan `002_documentation_architecture` archivé dans `.github/plans/` (ancienne structure, non migré — voir `.claude/plans/README.md`).

---

## 📐 Conventions par rôle

Conventions détaillées projet (stack, commandes, nommage, tests, doc) : skills **`conventions-<rôle>`**
(`.claude/skills/conventions-{orchestrator,architect,dev,qa,doc}/SKILL.md`), préchargés par chaque agent —
remplis pour `gestion-budget-ihm` (`/init-harness`, 2026-10-23), **source de vérité**.

Anciens fichiers `.claude/instructions/<rôle>.instructions.md` : repris dans les skills (ancien format, retrait
possible sur décision 👤). En cas d'écart, les skills `conventions-<rôle>` priment.

Ce fichier ne garde que le contexte global.

---

## Présentation du Projet

Frontend web **React 19 / TypeScript / Vite** de l'application de gestion de budget personnel (comptes, budgets
mensuels, opérations, analyses). Authentification Google OIDC ; consomme les microservices Quarkus du backend
`gestion-budget-serverless` via AWS API Gateway. Hébergement statique S3 + CloudFront. Interface en français.

---

## Commandes

Node version pinned via `.nvmrc` (voir fichier version exacte) — `nvm use` avant toute commande.

```bash
# Install dependencies
npm ci --ignore-scripts

# Start with a specific environment
npm run start:dev     # uses .env.dev
npm run start:qua     # uses .env.qua
npm run start:prod    # uses .env.prod

# Build for production
npm run build         # minifies CSS then runs vite build (outputs to dist/)

# Run all tests (Vitest watch mode)
npm run test

# Run tests with coverage (CI mode, no watch)
npm run test:coverage   # vitest run --coverage

# Run a single test file
npx vitest run src/path/to/Component.test.tsx

# Lint
npm run lint
```

Env files sous `external-ressources/conf/.env.*` (préfixe `VITE_*`, migré depuis `REACT_APP_*` — voir `docs/adr/001-migration-cra-vers-vite.md`). Chaque `.env.*` définit :
- `VITE_CONFIG_URL_COMPTES`, `_OPERATIONS`, `_PARAMS`, `_UTILISATEURS` – URLs microservices
- `VITE_CONFIG_OIDC_*` – credentials Google OIDC
- `VITE_CONFIG_API_KEY` – clé AWS API Gateway envoyée en `X-Api-Key` chaque requête

---

## Architecture

Détail : `docs/ARCHITECTURE.md`.

### Layers
```
src/main/
├── Components/      # React UI components (TSX)
├── hooks/           # Custom hooks (useAuthTokenSync, useBudgetContext, useFetch)
├── Models/          # TypeScript data models + React Context
├── Services/        # HTTP client + auth token management + CallAndNotify
└── Utils/           # Constants, enums, utility functions, Debug.utils (debug())
```

### Data flow
1. **Auth** – `react-oidc-context` gère Google OAuth. `Auth.service.ts` stocke/récupère token. `AuthTokenSync` (monté à la racine dans `Main.tsx`) synchronise token OIDC → localStorage via `useAuthTokenSync`.
2. **HTTP** – Tous appels backend via `ClientHTTP.service.ts`, attache headers `X-Api-Key` + `Authorization: Bearer <token>`. URLs utilisent `{{}}` placeholders positionnels, remplacés via argument array `params`.
3. **State** – État global dans `BudgetContextProvider.tsx` (React Context). État local UI: `useState`/`useMemo`/`useCallback` composants fonctionnels.
4. **Routing** – `HashRouter` de `react-router-dom@7`.

### Component conventions
- Tous composants **fonctionnels**, typing `React.FC<Props>`.
- Interfaces props co-localisées dans `Components.props.ts`.
- Feature folders miroir noms domaine: `analyses/`, `budgets/`, `operations/`.
- Sub-composants page dans sous-dossier `subcomponents/`; boutons action dans `actions/`.
- Hooks custom dans `src/main/hooks/`. Appels extservices : `callAndNotify` (`Services/CallAndNotify.service.ts`).
- Pas de `console.log` (ESLint `no-console`, `warn`/`error` OK) : logs debug via `debug()` (`Utils/Debug.utils.ts`, actif si `VITE_CONFIG_DEBUG` défini).
- Items de liste en `React.memo` + handlers `useCallback`. Routes `MainPage`/`Infos` en `React.lazy` + `Suspense`.
- Material-UI 9 (`@mui/material`) seule lib UI. `Box`/`Grid` layout; `useMediaQuery`/`useTheme` responsive.

### Key enums & constants
- `AppTechEnums.constants.ts` – `API_GW_ENUM` (clé API gateway, refs env var)
- `AppBusinessEnums.constants.ts` – types opération, statuts, périodicités

---

## Conventions transverses

Uniquement ce qui concerne **tous** les agents :
- Dépendances : MAJ pilotées par **Renovate** (`renovate.json`) — PR auto à valider.
- Qualité : gate **SonarCloud** obligatoire (lint + tests + coverage `coverage/lcov.info`).
- Commits / branches / revue : pas de convention formalisée à date → suivre l'historique git ; ne pas en inventer.

---

## État du Projet et Points d'Attention

### Environment & Deployment
- CI build env `qua`, deploy bucket S3 (`budget-app-ihm-qua`) + invalidation CloudFront.
- Tags release déclenchent build+deploy `prod`.
- Gate qualité SonarCloud tourne après lint+tests; coverage lu depuis `coverage/lcov.info`.

### Points d'attention
- Projet en évolution, migré CRA → Vite (AP 001, ADR-001) ; migration dépendances TS/Vite partiellement reportée (AP 003 : TS v7 / typescript-eslint bloqués npm).
- Contrats API couplés au backend `gestion-budget-serverless` : toute évolution modèle → vérifier côté backend.
- Ancienne structure `.github/` (agents v2.x, plans) conservée pour référence historique.
- AP 006 (revue architecture React) : lot 1 livré ; dette restante (T2, T6, T11 : infra `useFetch` livrée / adoption restante, T16, T20, ADR 002 Proposée) listée dans `.claude/plans/006_revue_architecture_react.plan.md`.

---

## 🗜️ Compact instructions

Lors d'un `/compact` (ou compaction automatique) en session de Plan d'Action, conserver en ≤ 200 mots :
plan courant (numéro, titre, statut), phase active + tâches restantes + agent, décisions validées (gates),
questions ouvertes, prochaine action. Supprimer : détail des tâches ✅, confirmations courtes, lectures de
fichiers et sorties de commandes sans résultat durable.

---

## 🔐 Règles absolues

Tous agents respectent, sans exception ni dérogation :

- ⛔ JAMAIS supprimer fichiers/répertoires (`rm`, `rmdir`, `del`, `Remove-Item`…)
- ⛔ JAMAIS commandes SQL destructives (`DROP`, `TRUNCATE`, `DELETE` sans `WHERE`)
- ⛔ JAMAIS commande git irréversible (`git clean`, `git reset --hard`, `push --force`, `branch -D`, `stash drop`, `checkout --`, `restore`)
- ⛔ JAMAIS modifier fichiers hors périmètre de la tâche (ni hors de son rôle)
- ⛔ **Respect ABSOLU `.copilotignore`** : jamais lire, rechercher, écrire, exécuter ni référencer les fichiers listés ; jamais contourner (chemins alternatifs, symlinks, reconstitution)

En cas de doute → demander confirmation au 👤 Développeur humain. Opération voulue mais bloquée → le 👤 l'exécute lui-même.

<!-- claude-only -->
**Application déterministe** (pas seulement déclarative) :
- `.claude/settings.json` → `permissions.deny` (commandes destructives Bash/PowerShell, fichiers sensibles, chemins `.copilotignore` en `Read()`/`Edit()`) ; `ask` pour `git rm`.
- Hook `PreToolUse` `.claude/hooks/guard.sh` → bloque les formes que les règles ne voient pas (`sh -c "rm …"`, `/bin/rm`, `git -C . reset --hard`, SQL), les écritures dans `.copilotignore`, et les **frontières de rôle** (`.claude/hooks/role-boundaries.conf`).

> État : `.claude/settings.json` créé (`/init-harness`, 2026-10-23) — deny (commandes destructives + fichiers
> `.env*` sensibles, dont `external-ressources/conf/.env.oidc`) + hook `guard.sh` câblés. Pas de `.copilotignore` à date.
<!-- /claude-only -->

---

## 📖 Références

- [MAINa](./agents/Maina.agent.md) — Orchestration + Plan d'Action
- [ARCos](./agents/Arcos.agent.md) — Architecture (analyse solutions)
- [DEVon](./agents/Devon.agent.md) — Implémentation
- [QALvin](./agents/Qalvin.agent.md) — Tests
- [DOCly](./agents/Docly.agent.md) — Documentation
- [Plans d'Action](./PLANS.md) — Guide complet
