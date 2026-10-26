# Rapport Phase 2 — Vérification (T2.1) — Plan 008

**Agent :** 🟢 QALvin | **Date :** 2026-10-26 | **Statut :** ✅ T2.1 validée (sous réserve des 5 échecs préexistants)

## Méthode
- Les lignes shell ajoutées sont **extraites dynamiquement** des workflows (`grep`), pas recopiées, puis exécutées en bash (WSL Ubuntu, node v18.19.1, sed GNU) sur des **copies** de `.env.staging` / `.env.dev` avec un `package.json` factice.
- Dossier de travail : `qa-tmp-008/` à la racine du workspace (hors dépôt `gestion-budget-ihm`), **supprimé** en fin de run. Aucun fichier versionné créé/modifié. Seule la ligne `VITE_BUDGET_VERSION` a été lue (jamais le reste de `.env.dev` / `.env.oidc`).
- Les placeholders secrets (`__OIDC_*__`, etc.) ne sont pas traités par la simulation (hors périmètre T2.1).

## Résultats

| # | Vérification | Résultat |
|---|---|---|
| 1 | QUA (`build-on-master.yml`, `.env.staging`, pkg `27.0.0`) | `QUA.27.20261026-1042` ✅ regex `^(DEV\|QUA)\.27\.[0-9]{8}-[0-9]{4}$` |
| 1 | DEV (`build-on-all.yml`, `.env.dev`, pkg `27.0.0`) | `DEV.27.20261026-1042` ✅ |
| 2 | Résiduels `__BUDGET_IHM_VERSION__` dans les copies | 0 (QUA), 0 (DEV), 0 (cas 100) ✅ |
| 3 | Fuseau Paris : `TZ=Europe/Paris date +%H` = 10 vs `date -u +%H` = 09 | écart 1 h (CET +0100) ✅ ; contrôle DST : 2026-01-15 12:00 UTC → 13 CET, 2026-07-15 12:00 UTC → 14 CEST ✅ |
| 4 | pkg `100.1.2` | `QUA.100.20261026-1042` ✅ (majeure seule, ni mineure ni patch) |
| 5 | `build-on-tags.yml` | inchangé : seule occurrence l.64 `sed -i "s#__BUDGET_IHM_VERSION__#$VERSION#g" …/.env.production` ; pas de `VERSION_MAJEURE`/`BUILD_DATE` ✅ |
| 5 | `.env.production` | l.3 `VITE_BUDGET_VERSION=__BUDGET_IHM_VERSION__` ✅ (mtime 08/07, non touché) |
| 5 | Sources `.env.staging` / `.env.dev` | l.2 `QUA.__BUDGET_IHM_VERSION__` / `DEV.__BUDGET_IHM_VERSION__` ✅ |

Acceptation : 2/2 formats conformes, 0 placeholder résiduel.

## Non-régression — `npx vitest run`
`Test Files 1 failed | 278 passed (279)` ; `Tests 5 failed | 2097 passed | 5 expected fail (2107)` ; durée 461 s.
Les 5 échecs sont tous dans `OperationsListItem.shared.tooltip.test.tsx` (préexistants, déjà identifiés Gate #2). **Aucun autre échec.**

## Limites / risques
- Simulation sous WSL (Linux, node 18) ; le runner CI (`ubuntu`, node de `.nvmrc`) est équivalent pour `sed`/`date`/`node -p`. tzdata présente dans l'environnement bash.
- Scripts créés avec CRLF côté Windows : sans effet, workflows en LF (ASCII).
- Le `sed` utilise `#` comme délimiteur : sûr car `VERSION_MAJEURE`/`BUILD_DATE` ne contiennent que chiffres, `.` et `-`.
- Préexistance des 5 échecs tooltip toujours non prouvée (pas de git) ; hors scope.
- Pas de couverture de code mesurée : aucun code TS modifié (N/A).

## Handoff
```yaml
handoff:
  from: QALvin
  to: MAINa
  phase: 2
  task: T2.1
  status: done
  evidence:
    - cmd: "bash run2.sh (extraction grep des lignes des workflows + exécution sur copies)"
      output: "QUA.27.20261026-1042 FORMAT OK, résiduels 0 | DEV.27.20261026-1042 FORMAT OK, résiduels 0"
    - cmd: "TZ=Europe/Paris date +%H ; date -u +%H"
      output: "Paris=10 UTC=09 écart=1h (CET +0100) ; hiver 13 CET / été 14 CEST"
    - cmd: "pkg 100.1.2 sur build-on-master"
      output: "QUA.100.20261026-1042"
    - cmd: "grep build-on-tags.yml / .env.production"
      output: "l.64 sed $VERSION inchangé ; VITE_BUDGET_VERSION=__BUDGET_IHM_VERSION__"
    - cmd: "npx vitest run"
      output: "1 file failed | 278 passed ; 5 failed | 2097 passed | 5 expected fail ; échecs uniquement OperationsListItem.shared.tooltip.test.tsx"
  files_changed: ["PHASE_2_COMPLETION_REPORT.md (rapport uniquement)"]
  temp_files: "qa-tmp-008 supprimé"
  coverage: "N/A (aucun code TS modifié)"
  risks:
    - "Simulation WSL node 18 vs runner CI (équivalent attendu)"
    - "5 échecs tooltip préexistants non prouvés faute de git"
  questions: []
