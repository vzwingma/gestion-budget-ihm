# Rapport Phase 4 — @vitejs/plugin-react v4 → v5 → v6

**Plan :** `.claude/plans/003_migration_dependances_ts_vite.plan.md`
**Agent :** DEVon 🔵
**Date :** 2026-07-10

---

## Vérification registre npm (préalable)

- `npm view @vitejs/plugin-react versions --json` : v5 stable existe (`5.0.0` → `5.2.0`), v6 stable existe (`6.0.0` → `6.0.3`, `dist-tags.latest = 6.0.3`). Contrairement à `typescript-eslint`, les deux paliers sont publiés en stable — pas de blocage d'existence.
- PeerDependencies vérifiées avant chaque install :
  - `@vitejs/plugin-react@5.2.0` → `vite: "^4.2.0 || ^5.0.0 || ^6.0.0 || ^7.0.0 || ^8.0.0"`
  - `@vitejs/plugin-react@6.0.0` à `6.0.3` → `vite: "^8.0.0"` (strict, aucune plage `^7`)

---

## T4.1 — Bump v4 → v5 : ✅ RÉUSSI

- `npm install @vitejs/plugin-react@^5.0.0 --save-dev` → résolu `5.2.0`
- Vite installé au moment de l'install : `7.3.6` — couvert par peerDep v5.2.0 (`^7.0.0`)
- Vérifications :
  - `npm run build` : vert (Vite 7.3.6, 12370 modules, aucun warning)
  - `npm run start:dev` : démarre proprement, `ready in 1321 ms`, aucun warning esbuild/oxc
  - `npm run test:coverage` : **109/109 tests passés** (28 fichiers), couverture stable (~91% stmts)
  - `npm run lint` : **0 erreur / 312 warnings** — identique baseline
- **Commit :** `f733966` — "chore: bump @vitejs/plugin-react to v5" (package.json + package-lock.json uniquement)

---

## T4.2 — Bump v5 → v6 : ⏸️ Bloqué initialement, puis ✅ RÉUSSI après T4.3

**Première tentative (avant T4.3)** :
- Vérification peerDep **avant** toute tentative d'install (`npm view @vitejs/plugin-react@^6.0.0 peerDependencies` sur 6.0.0/6.0.1/6.0.2/6.0.3) : toutes exigent `vite: "^8.0.0"` strict.
- Vite installé à ce stade du palier : `7.3.6` (Vite v8 pas encore retenté — T4.3 vient après dans la séquence demandée). Ne satisfait pas `^8.0.0`.
- Conformément à la consigne ("si bloqué à ce palier : rester sur v5, documenter"), **aucun `npm install` tenté** — pas de conflit peerDep généré, pas de `--legacy-peer-deps`/`--force`.
- Repo reste sur `@vitejs/plugin-react@5.2.0` à l'issue de cette première tentative.

**Reprise sur décision humaine (2026-07-10, après T4.3)** :
- Vite désormais en v8.1.4 (voir T4.3) → peerDep `vite: "^8.0.0"` de plugin-react v6.0.3 satisfaite. Re-confirmé via `npm view @vitejs/plugin-react@6.0.3 peerDependencies` juste avant install.
- `npm install @vitejs/plugin-react@^6.0.0 --save-dev` → résolu `6.0.3`. `npm ls vite @vitejs/plugin-react vitest` : arbre propre, aucun `UNMET PEER DEPENDENCY`.
- Vérifications :
  - `npm run build` : vert (Vite 8.1.4, 12335 modules, aucun warning)
  - `npm run start:dev` : démarre proprement, `ready in 1134 ms`, **aucun warning esbuild/oxc** (type "Invalid key jsx")
  - `npm run test:coverage` : **109/109 tests passés** (28 fichiers), couverture stable (~91% stmts)
  - `npm run lint` : **0 erreur / 312 warnings** — identique baseline
- **Commit :** `4ce1961` — "chore: bump @vitejs/plugin-react to v6" (package.json + package-lock.json uniquement)

---

## T4.3 — Retenter Vite v7 → v8 (plugin-react à jour) : ✅ RÉUSSI

- Précondition : T4.1 réussi (peerDep plugin-react v5.2.0 couvre `vite ^8.0.0`).
- Vérifications complémentaires avant install :
  - `vitest@4.1.10` (déjà installé) : peerDep `vite: "^6.0.0 || ^7.0.0 || ^8.0.0"` — compatible nativement, pas de bump vitest nécessaire.
  - `vite@8.0.0` engine requis : `node: "^20.19.0 || >=22.12.0"` — `.nvmrc` pin `24.18.0`, satisfait.
- `npm install vite@^8.0.0 --save-dev` → résolu `8.1.4`. Install propre, `npm ls vite @vitejs/plugin-react vitest` : aucun `UNMET PEER DEPENDENCY`.
- Vérifications :
  - `npm run build` : vert (Vite 8.1.4, moteur rolldown, 12335 modules, aucun warning peerDep)
  - `npm run start:dev` : démarre proprement, `ready in 1743 ms`, **aucun warning esbuild/oxc** (contrairement à la Phase 3 où ce warning avait bloqué le palier)
  - `npm run test:coverage` : **109/109 tests passés** (28 fichiers)
  - `npm run lint` : **0 erreur / 312 warnings** — identique baseline
- **Commit :** `47dd829` — "chore: bump vite to v8" (package.json + package-lock.json uniquement)

---

## Résumé versions npm réelles vérifiées

| Package | Registre — dist-tags/versions vérifiées | Résultat |
|---|---|---|
| `@vitejs/plugin-react` | v5 stable (5.0.0-5.2.0), v6 stable (6.0.0-6.0.3, latest) | v5 installé puis v6 installé (6.0.3) après Vite v8 |
| `vite` | v8 stable (`latest: 8.1.4`, engine `node ^20.19.0 \|\| >=22.12.0`) | v8 installé (8.1.4) |
| `vitest` | déjà `4.1.10`, peerDep couvre `vite ^8.0.0` nativement | aucun changement requis |

---

## État final

- **Vite :** v8 (`8.1.4`) — commit `47dd829`
- **@vitejs/plugin-react :** v6 (`6.0.3`) — commits `f733966` (v5) puis `4ce1961` (v6) — **Phase 4 complète, v4→v5→v6 atteint intégralement**
- **Build :** vert
- **Lint :** 0 erreur / 312 warnings (stable, aucune régression)
- **Tests :** 109/109 passés (28 fichiers), couverture ~91% stmts (stable)
- **Aucun `--force`/`--legacy-peer-deps` utilisé**
- Fichiers modifiés hors périmètre (refactor `useContext`→hook dans plusieurs `.tsx`) détectés dans l'arbre de travail au moment de chaque commit — **jamais commités**, pré-existants et sans lien avec cette phase.

## Dépendances / prérequis pour suite

- **QALvin 🟢 (Phase 5)** : vérification transverse couverture/lint sur l'ensemble Phase 0+3+4 (diff avant/après par règle lint).
- **DOCly 🟣 (Phase 6)** : MAJ `docs/ARCHITECTURE.md` (Vite → 8.x, plugin-react → 6.x) + changelog, note limitation Phase 1/2 (typescript-eslint).
- Commits à considérer pour Phase 5/6 : `f733966` (plugin-react v5), `47dd829` (vite v8), `4ce1961` (plugin-react v6).
