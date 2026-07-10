# Plan d'Action : Montée de version 5 dépendances (TypeScript, typescript-eslint, Vite, @vitejs/plugin-react, Babel plugin)

**Document :** `.claude/plans/003_migration_dependances_ts_vite.plan.md`
**Date de création :** 2026-07-10
**Statut :** ✅ Lot clos (Phase 0/3/4/5/6 faites — Phase 1/2 reportées, voir note)

> ⚠️ **Blocage Phase 1/2 (2026-07-10)** : `typescript-eslint` v9/v10 n'existent pas sur npm (dernier stable `8.63.0`, canary `8.63.1-alpha.8` au moment du check). TypeScript v7 (`^7.0.2`) a été testé (commit `ab7e062`) puis **reverté** (commit `daa9df6`) car `typescript-eslint@8.63.0` crashe avec TS7 (`TypeError: Cannot read properties of undefined (reading 'Cjs')`, internals TS renommés) et aucun palier 9/10 n'est disponible pour absorber ce changement. Repo reste sur `typescript ^6.0.0` + `typescript-eslint ^8.63.0`, lint/build/tests verts (109/109). **Phases 1 et 2 reportées** — à reprendre quand `typescript-eslint` publie une release stable compatible TS7.
>
> ✅ **Phase 3 partielle (2026-07-10)** : Vite v6→v7 réussi (commit `c205be6`), build/lint/tests verts. Vite v7→v8 **bloqué** : `@vitejs/plugin-react@4.7.0` déclare peerDep `vite: "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0"` (pas `^8`), confirmé par warning runtime esbuild/oxc au démarrage dev. Palier Vite v8 à retenter **en même temps que** Phase 4 (bump plugin-react), pas isolément.
>
> ✅ **Phase 4 terminée (2026-07-10)** : `@vitejs/plugin-react` v4→v5 réussi (commit `f733966`, résolu `5.2.0`, peerDep `vite: "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"`). Palier v5→v6 initialement **bloqué** au moment de la tentative : `@vitejs/plugin-react@6.0.0-6.0.3` exigent tous `vite: "^8.0.0"` strict (pas de plage `^7`), incompatible avec Vite 7.3.6 encore installé à ce stade. Vite v7→v8 **retenté avec succès** (commit `47dd829`, `vite@8.1.4`) grâce à la plage `^8.0.0` déjà couverte par plugin-react v5.2.0 ; `vitest@4.1.10` supporte nativement `vite ^8.0.0`, Node `24.18.0` (`.nvmrc`) couvre l'engine requis `^20.19.0 || >=22.12.0`. **Décision humaine (2026-07-10)** : Vite étant désormais v8, palier v5→v6 retenté et **réussi** (commit `4ce1961`, `@vitejs/plugin-react@6.0.3`). Build/dev/tests(109/109)/lint(312 warnings/0 erreur) verts sur Vite v8.1.4 + plugin-react v6.0.3. **Phase 4 complète : v4→v5→v6 atteint intégralement.**
**Objectif Prioritaire :** MEDIUM

---

## 🎯 Objectif Global

Renovate signale 5 majors disponibles sur `gestion-budget-ihm` :
- `typescript` `^6.0.0` → v7
- `typescript-eslint` (groupe Renovate "eslint monorepo") `^8.63.0` → v10 (2 paliers : 8→9→10)
- `vite` `^6.0.7` → v8 (2 paliers : 6→7→8)
- `@vitejs/plugin-react` `^4.3.4` → v6 (2 paliers : 4→5→6, couplé peerDep à Vite)
- `@babel/plugin-transform-private-property-in-object` `^7.21.11` → v8

Objectif : rester vert sur les 3 workflows CI (`build-on-all.yml`, `build-on-master.yml`, `build-on-tags.yml`) à chaque étape, sans casser flat-config ESLint (`eslint.config.mjs`), `tsconfig.json` (`moduleResolution: bundler`, `allowImportingTsExtensions`), ni le contournement Vitest Node 22 (`poolOptions.forks.execArgv` dans `vite.config.ts`).

Décisions validées avec 👤 développeur :
- **Babel plugin** : tenter suppression complète d'abord (aucun usage direct trouvé dans le repo — probable résidu migration CRA→Vite, cf. `docs/adr/001-migration-cra-vers-vite.md`). Fallback bump `^8.0.0` si un warning Babel réapparaît.
- **Paliers majeurs doubles** (typescript-eslint, vite, plugin-react) : montée palier par palier, commit isolé + CI vert entre chaque, jamais de saut direct.

---

## 📋 Phase 0 — Babel plugin

### Contexte
- `@babel/plugin-transform-private-property-in-object ^7.21.11` en devDependency directe. Aucune référence trouvée dans `vite.config.ts`, pas de `babel.config.*`/`.babelrc` custom, aucun usage explicite ailleurs dans le repo.
- Probable résidu de la migration CRA (le plugin corrigeait un warning connu de `@babel/preset-env` sous `react-scripts`). Vite + `@vitejs/plugin-react` gèrent JSX/Fast Refresh via presets Babel internes, sans dépendre de ce plugin.
- Aucune dépendance amont — peut démarrer immédiatement.

### Critères de Réussite
✅ Vérification effectuée : absence de champs privés de classe (`#champ`) nécessitant la transform
✅ Plugin retiré du `package.json` (ou bump v8 documenté si suppression impossible)
✅ `npm run build` + `npm run test:coverage` verts, aucun warning Babel

### Tâches (Agent : DEVon 🔵)

#### T0.1 - Auditer usage réel du plugin
- **Fichiers :** recherche globale repo
- **Implémenter :** `grep -rn "private-property-in-object"` (config/README) + `grep -rn "#[a-zA-Z_]" src` (champs privés classe TS/JS)
- **Acceptation :** rapport clair — usage confirmé ou absent

#### T0.2 - Retirer ou bumper le plugin
- **Fichier :** `package.json`
- **Implémenter :**
  - Si absence confirmée (T0.1) : retirer la ligne devDependency, `npm install`, `npm run build && npm run test:coverage`
  - Si warning Babel réapparaît à la suppression : remettre la ligne, bump `^8.0.0` à la place
- **Acceptation :** build + tests verts, aucun warning Babel en sortie

---

## 📋 Phase 1 — TypeScript v6 → v7

### Contexte
- `tsconfig.json` : `target: esnext`, `moduleResolution: bundler`, `allowImportingTsExtensions: true`, `noEmit: true`. Pas de `strict` explicite.
- Aucun script `typecheck` dédié — `npm run build` passe par Vite/esbuild qui ne fait pas de vérification de type complète.
- Dépend de Phase 0 terminée (isolation du diff, pas de dépendance technique réelle).

### Critères de Réussite
✅ `typescript@^7.0.0` installé
✅ `npx tsc --noEmit` sans erreur
✅ `moduleResolution: bundler` + `allowImportingTsExtensions` toujours valides
✅ Build, lint, tests verts

### Tâches (Agent : DEVon 🔵)

#### T1.1 - Bump TypeScript et typecheck
- **Fichier :** `package.json`, `tsconfig.json` (si ajustement requis)
- **Implémenter :**
  - `npm install typescript@^7.0.0 --save-dev`
  - `npx tsc --noEmit` — lister/corriger erreurs de compilation introduites
  - Vérifier compat `@types/node@^24.0.0`, `@types/react@^19.1.13`, `@types/react-dom@^19.1.9`
- **Acceptation :** `tsc --noEmit` propre, `npm run build`, `npm run lint`, `npm run test:coverage` verts

---

## 📋 Phase 2 — typescript-eslint v8 → v9 → v10

### Contexte
- `eslint.config.mjs` : flat config via `tseslint.config(...)`, plusieurs règles volontairement en `warn` (dette ~259 occurrences héritée CRA→Vite).
- Dépend de Phase 1 (peerDependency TypeScript).

### Critères de Réussite
✅ Palier 8→9 puis 9→10, commit séparé chacun
✅ Aucune règle ne bascule silencieusement de `warn` à `error` (diff comptage avant/après)
✅ `eslint.config.mjs` reste syntaxiquement valide, ESLint core `^9.39.4` compatible

### Tâches (Agent : DEVon 🔵)

#### T2.1 - Bump typescript-eslint v8 → v9
- **Fichier :** `package.json`, `eslint.config.mjs` (si renommage de règles)
- **Implémenter :** `npm install typescript-eslint@^9.0.0 --save-dev`, `npm run lint` avec comptage warnings/erreurs par règle avant/après
- **Acceptation :** aucune règle basculée en erreur non prévue ; build + tests verts

#### T2.2 - Bump typescript-eslint v9 → v10
- **Fichier :** `package.json`, `eslint.config.mjs` (si renommage de règles)
- **Implémenter :** `npm install typescript-eslint@^10.0.0 --save-dev`, même vérif que T2.1
- **Acceptation :** identique T2.1 ; rollback isolé possible vers palier v9 (T2.1) en cas d'échec

---

## 📋 Phase 3 — Vite v6 → v7 → v8

### Contexte
- `vite.config.ts` : plugin unique `react()`, config test fusionnée via `vitest/config`, contournement Node 22 `poolOptions.forks.execArgv: ['--no-experimental-webstorage']`.
- Risque clé : peerDependency `vitest ^4.0.0` avec Vite 7/8 — vitest est **hors périmètre** de ce plan. Si incompatible à un palier, s'arrêter au dernier palier compatible et documenter (Phase 5 DOCly), ne jamais forcer `--legacy-peer-deps`.
- Dépend de Phase 1/2 terminées (isolation, pas de couplage technique direct).

### Critères de Réussite
✅ Palier 6→7 puis 7→8, commit séparé chacun
✅ Compat `vitest ^4.0.0` vérifiée à chaque palier avant de poursuivre
✅ `npm run start:dev` (port 3000, HMR) et `test:coverage` (jsdom localStorage/sessionStorage) verts

### Tâches (Agent : DEVon 🔵)

#### T3.1 - Bump Vite v6 → v7
- **Fichier :** `package.json`, `vite.config.ts` (si API changée)
- **Implémenter :** vérifier peerDep `vitest` avant install, `npm install vite@^7.0.0 --save-dev`, vérifier Node min requis vs `.nvmrc`/`engines`
- **Acceptation :** build, `npm run start:dev` smoke, `test:coverage` verts

#### T3.2 - Bump Vite v7 → v8
- **Fichier :** `package.json`, `vite.config.ts` (si API changée)
- **Implémenter :** même vérif peerDep `vitest` avant install ; si non supporté, **s'arrêter à T3.1** et documenter le blocage (Phase 5)
- **Acceptation :** identique T3.1, ou arrêt documenté si blocage compat vitest confirmé

---

## 📋 Phase 4 — @vitejs/plugin-react v4 → v5 → v6

### Contexte
- Plugin appelé sans options (`react()`) dans `vite.config.ts` — risque API faible.
- PeerDependency stricte sur version majeure de Vite — **dépend de Phase 3 terminée** (version Vite finale retenue).

### Critères de Réussite
✅ Palier 4→5 puis 5→6, chaque palier resynchronisé avec la version Vite retenue en Phase 3
✅ Fast Refresh dev fonctionnel, aucune régression JSX
✅ Smoke navigation 2-3 écrans clés au palier final

### Tâches (Agent : DEVon 🔵)

#### T4.1 - Bump @vitejs/plugin-react v4 → v5
- **Fichier :** `package.json`
- **Implémenter :** vérifier peerDep `vite` du plugin couvre version Phase 3, `npm install @vitejs/plugin-react@^5.0.0 --save-dev`
- **Acceptation :** `npm run start:dev` smoke (Fast Refresh), build, tests verts

#### T4.2 - Bump @vitejs/plugin-react v5 → v6
- **Fichier :** `package.json`
- **Implémenter :** même vérif peerDep Vite finale
- **Acceptation :** identique T4.1 + smoke navigation 2-3 écrans clés

---

## 📋 Phase 5 — Vérification transverse

### Contexte
- Après chaque groupe de phases (0-1, 2, 3, 4), validation croisée couverture + lint + CI.

### Critères de Réussite
✅ Couverture (`coverage/lcov.info`) non régressée
✅ Comptage warnings lint par règle stable ou justifié
✅ `sonarcloud` lit correctement le rapport de couverture

### Tâches (Agent : QALvin 🟢)

#### T5.1 - Vérification couverture et lint transverse
- **Fichier :** `coverage/lcov.info`, sortie `npm run lint`
- **Implémenter :** diff couverture avant/après chaque groupe de phases ; diff comptage warnings par règle (`no-explicit-any`, `no-unsafe-function-type`, `prefer-const`, `react/no-unescaped-entities`, `react-hooks/exhaustive-deps`)
- **Acceptation :** aucune régression silencieuse ; proposer script `typecheck` (`tsc --noEmit`) si jugé utile (hors périmètre strict, recommandation seulement)

---

## 📋 Phase 6 — Documentation

### Contexte
- `docs/ARCHITECTURE.md` référence des versions obsolètes (Vite "6.x" ligne 94, TypeScript "5.9.3" ligne 215 déjà obsolète avant ce chantier).

### Critères de Réussite
✅ `docs/ARCHITECTURE.md` reflète versions finales retenues
✅ Changelog documente la décision Babel plugin (suppression ou bump + raison)
✅ Note de limitation documentée si arrêt anticipé Vite (blocage vitest)

### Tâches (Agent : DOCly 🟣)

#### T6.1 - Mettre à jour docs/ARCHITECTURE.md
- **Fichier :** `docs/ARCHITECTURE.md`
- **Implémenter :** MAJ ligne version Vite, ligne version TypeScript, clarifier ligne "TypeScript strict" (tsconfig n'active pas `strict` explicitement)
- **Acceptation :** aucune version obsolète restante

#### T6.2 - Changelog + note limitation éventuelle
- **Fichier :** `CHANGELOG.md` (ou équivalent projet)
- **Implémenter :** entrée décrivant montée 5 (ou 4) deps + décision Babel ; si arrêt anticipé Vite/vitest, ajouter note limitation connue dans `docs/ARCHITECTURE.md`
- **Acceptation :** entrée changelog présente, cohérente avec versions réellement installées

**✅ Phase 6 terminée (2026-07-10, DOCly 🟣)** : Aucun `CHANGELOG.md` à la racine `gestion-budget-ihm/` (seul `.claude/CHANGELOG.md` existe, dédié à l'historique des instructions agents — pas une convention changelog applicatif). Pas de convention changelog projet identifiée ailleurs → décision : pas de création d'un nouveau fichier, entrée versionnée ajoutée dans `docs/ARCHITECTURE.md` § « Historique des Versions » à la place (voir T6.1). `docs/ARCHITECTURE.md` mis à jour : versions Vite (8.1.4), `@vitejs/plugin-react` (6.0.3) ajouté au tableau stack, TypeScript clarifié (`^6.0.0`, mot « strict » désambiguïsé de l'option compilateur), note limitation TS7/typescript-eslint 9-10 reportée ajoutée, entrée historique 2026-07-10 ajoutée. `README.md`/`README-react.md` vérifiés — aucune mention de version Vite/TypeScript/plugin-react obsolète trouvée (seule mention générique "TypeScript strict" dans la description, hors scope table de versions).

Pas d'ADR formel requis — pas une décision d'architecture, déjà couvert par `docs/adr/001-migration-cra-vers-vite.md`. Sauf si blocage Vite8/vitest force un arrêt : note courte limitation suffit, pas d'ADR complet.

---

## 📊 Résumé des Tâches par Agent

### DEVon (🔵)
- T0.1, T0.2, T1.1, T2.1, T2.2, T3.1, T3.2, T4.1, T4.2
- **Livrable :** 5 dépendances mises à jour (ou 4 + suppression Babel), commits isolés par palier, CI verte
- **Complexité :** Élevée (9 sous-tâches séquentielles, paliers multiples)

### QALvin (🟢)
- T5.1
- **Livrable :** Rapport vérification couverture/lint transverse
- **Complexité :** Moyenne

### DOCly (🟣)
- T6.1, T6.2
- **Livrable :** `docs/ARCHITECTURE.md` à jour + changelog
- **Complexité :** Faible

---

## 📍 Dépendances entre Phases

```
Phase 0 (Babel) — aucune dépendance, démarrage immédiat
   ↓
Phase 1 (TypeScript v7)
   ↓
Phase 2 (typescript-eslint 8→9→10) — dépend peerDep TS de Phase 1
   ↓
Phase 3 (Vite 6→7→8)
   ↓
Phase 4 (@vitejs/plugin-react 4→5→6) — dépend version Vite finale Phase 3
   ↓
Phase 5 (QA transverse) — après chaque groupe, formalisée en fin de chantier
   ↓
Phase 6 (Documentation) — après validation finale QA
```

Rollback : commit Git isolé par palier. Échec CI → `git revert` du commit du palier concerné uniquement, paliers précédents conservés. Jamais de `--force`/`--legacy-peer-deps` pour masquer une incompatibilité peerDep réelle.

---

## ✅ Critères de Succès Globaux

1. **5 dépendances migrées** (ou 4 + suppression justifiée du plugin Babel) vers leurs versions cibles (ou dernier palier compatible documenté)
2. **3 workflows CI verts** (`build-on-all`, `build-on-master`, `build-on-tags`) sur le commit final
3. **Aucune régression** de couverture de tests ni de comptage lint non justifiée
4. **`docs/ARCHITECTURE.md` à jour** avec versions réelles installées
5. **Aucun contournement forcé** (`--force`/`--legacy-peer-deps`) — tout blocage de compatibilité documenté plutôt que masqué

---

## 🚀 Plan d'Exécution

1. **Phase 0-4 :** DEVon exécute paliers séquentiels, commit + CI vert entre chaque
2. **Gate #2 :** Validation humaine code avant QA
3. **Phase 5 :** QALvin vérification transverse
4. **Gate #3 :** Validation humaine tests avant doc
5. **Phase 6 :** DOCly mise à jour documentation
6. **Gate #4 :** Validation humaine + clôture initiative

**Trigger pour clore le plan :**
- Les 5 (ou 4) dépendances au dernier palier atteint et documenté
- 3 workflows CI verts sur commit final
- `docs/ARCHITECTURE.md` et changelog à jour
- Rapport de phase final : `.claude/plans/003_reports/PHASE_FINAL_COMPLETION_REPORT.md`
