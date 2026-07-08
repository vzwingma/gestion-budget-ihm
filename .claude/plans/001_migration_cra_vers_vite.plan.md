# Plan d'Action 001 — Migration technique modernisation frontend `gestion-budget-ihm`

**Statut :** ✅ Complété — toutes phases (1-8) terminées, validé QUA + PROD
**Date de création :** 2026-07-08
**ADR associé :** [`docs/adr/001-migration-cra-vers-vite.md`](../../docs/adr/001-migration-cra-vers-vite.md)

---

## Contexte

Frontend (`gestion-budget-ihm`, React 19) tourne encore sur Create React App (`react-scripts` 5.0.1) — non maintenu depuis 2023, dernière release majeure mars 2022. Symptômes concrets de dette :

- **Double stack de build** : `react-scripts` pilote `start`/`build`/`test`, ET un `webpack.config.js` custom séparé (script `prod`) coexiste — deux pipelines divergents, aucun réellement complet.
- **Versions non déclarées** : pas de `engines`/`.nvmrc` → Node dérive silencieusement (CI utilise `node-version: latest`). TypeScript tiré en 4.9.5 via dépendance transitive de `react-scripts`, jamais déclaré en direct.
- **Incohérence config** : `package.json` déclare `"type": "module"` + `"exports": "./src/index.js"` alors que le point d'entrée réel est `src/index.tsx` (CRA/webpack, pas ESM natif).
- **CI/CD fragile** : job `tests` du workflow de release PROD (`build-on-tags.yml`) ne lance jamais réellement les tests (juste `npm ci`) — un build cassé peut partir en prod sans détection test.
- **Résidus** : dépendances `workbox-*` (PWA) héritées du template CRA, jamais utilisées dans `src/`.

Objectif : moderniser le socle build (Vite), déclarer explicitement toutes les versions, mettre à jour les dépendances majeures en retard, et fiabiliser le pipeline CI/CD — sans changer le modèle de déploiement (S3 + CloudFront reste inchangé), en validant à chaque étape (QUA avant PROD).

## Décisions validées avec l'utilisateur

- **Build tool cible : Vite** (rejeté Next.js — SSR/routing file-based non nécessaire pour cette SPA derrière S3+CloudFront ; rejeté webpack unifié — reviendrait à réinventer CRA en pire).
- **Tests : migration Vitest immédiate** (pas de palier intermédiaire Jest — accepté le risque combiné pour éviter une double transition).
- **TypeScript : bump direct vers 5.x**, déclaré en devDependency (était 4.9.5 transitif, non piloté).
- **ADR obligatoire** avant clôture — rédigé dans `docs/adr/001-migration-cra-vers-vite.md`.
- **Bug latent MUI Stack/Grid (props CSS hors `sx`)** découvert par `tsc --noEmit` pendant Phase 4, jugé hors périmètre migration outillage → traité en tâche séparée (finalement résolu de facto, `tsc --noEmit` repasse propre après ajustements Phase 4).

## Fichiers modifiés (résumé — détail dans les rapports de phase ci-dessous)

- `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts` (créé), `eslint.config.mjs` (créé), `src/vite-env.d.ts` (créé)
- `webpack.config.js` (supprimé), `public/index.html` → `index.html` (racine)
- `.nvmrc` (créé), `src/setupTests.ts` (créé)
- `src/main/**` — références `process.env.REACT_APP_*` → `import.meta.env.VITE_*`, correction casse import `SsCategorieOperation.model.ts`
- 17 fichiers de test — `jest.*` → `vi.*`
- `.github/workflows/{build-on-all,build-on-master,build-on-tags}.yml`
- `external-ressources/conf/.env.{dev,staging,production}` — préfixe `VITE_*`
- `docs/adr/001-migration-cra-vers-vite.md` (créé), `.claude/CLAUDE.md`, `docs/ARCHITECTURE.md`, `README.md`, `.github/copilot-instructions.md`, `.claude/instructions/{dev,qa,orchestrator}.instructions.md`, `.github/instructions/{dev,qa}.instructions.md`

## Phases d'exécution

### Phase 0 — ADR + cadrage (gate humain) ✅
ADR rédigé et plan validé par le développeur avant implémentation.

### Phase 1 — Socle build Vite ✅
Vite + `@vitejs/plugin-react` installés, `vite.config.ts` créé, `index.html` migré, `webpack.config.js` et stack webpack custom supprimés, toutes les références `REACT_APP_*` portées vers `VITE_*`. Build local `dist/` fonctionnel.

### Phase 2 — Migration Vitest ✅
Jest → Vitest, `coverage-v8` configuré (`lcov` pour SonarCloud), 17 fichiers de test adaptés (`jest.*` → `vi.*`). **109/109 tests verts**, aucune régression. Bug Node 22+/jsdom (`localStorage.clear`) découvert et corrigé (`--no-experimental-webstorage`).

### Phase 3 — Déclarations versions ✅
`engines.node`, `.nvmrc` (`22.12.0`), `packageManager` (`npm@10.8.3`), retrait `type:module`/`exports` incohérents, retrait `env-cmd`, retrait `overrides.autoprefixer` (redondant). `react-scripts` conservé temporairement (encore référencé par `eject`/`eslintConfig`) → traité en Phase 4.

### Phase 4 — Dépendances applicatives ✅
`react-scripts` et script `eject` retirés définitivement. Config ESLint migrée vers flat config autonome (`eslint.config.mjs`, ESLint 9.39.4). TypeScript bumpé à **5.9.3** (devDependency directe). Correction casse import (`SsCategorieOperation.model.ts`, bug latent cassant sur filesystem sensible à la casse). `npm audit` : 0 vulnérabilité. Build/test/lint verts, `tsc --noEmit` propre.

### Phase 5 — CI/CD ✅
`node-version: latest` → `node-version-file: '.nvmrc'` dans les 3 workflows. **Bug critique corrigé** : job `tests` de `build-on-tags.yml` n'exécutait jamais réellement les tests, maintenant `npm run test:coverage`. Chemins `build/` → `dist/` (zip + `s3-deploy`). Flag `--runInBand` (Jest, incompatible Vitest) retiré. `external-ressources/conf/.env.*` migrés vers préfixe `VITE_*`.

### Phase 6 — Validation QUA ✅
Merge sur `master` → déploiement bucket QUA (`budget-app-ihm-qua`) → recette fonctionnelle manuelle validée par le développeur.

### Phase 7 — Release PROD ✅
Tag → déploiement bucket PROD (`budget-app-ihm`) → validation développeur ok.

### Phase 8 — Documentation + clôture ✅
`.claude/CLAUDE.md`, `docs/ARCHITECTURE.md`, `README.md`, instructions agents mis à jour (commandes Vite/Vitest, préfixe env `VITE_*`, `.nvmrc`). Ce plan et son index créés.

## Risques principaux

- **Double transition Vite+Vitest simultanée** : risque accepté, aucune régression constatée (109/109 tests, couverture stable ~94.8%/76%/80%).
- **Bump TS 4.9→5.x** : géré en Phase 4, aucune erreur bloquante résiduelle.
- **CI silencieuse corrigée** : `node-version` épinglé, job tests PROD répare désormais réellement les tests.
- **Déploiement réel (Phases 6-7)** : hors capacité d'automatisation — nécessite merge/tag/validation humaine explicite.

## Vérification effectuée

1. ✅ Build local (`npm run build`) → `dist/` fonctionnel.
2. ✅ Tests (`npm run test:coverage`) verts — 109/109, couverture stable.
3. ✅ Lint (`npm run lint`) — 0 erreur.
4. ✅ `tsc --noEmit` — 0 erreur.
5. ✅ `npm audit` — 0 vulnérabilité.
6. ✅ YAML des 3 workflows validé syntaxiquement.
7. ✅ CI branche réelle, déploiement QUA + recette manuelle, déploiement PROD — validés par le développeur.
