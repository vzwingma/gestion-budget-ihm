# Plan d'Action 004 — Remédiation SonarCloud

**Statut** : ✅ Complété (Gate #4 clôturé)
**Date** : 2026-07-21

## Context

SonarCloud remontait 8 issues OPEN sur `vzwingma_gestion-budget-ihm` (https://sonarcloud.io/project/issues?issueStatuses=OPEN&id=vzwingma_gestion-budget-ihm). 3 catégories : 1 complexité cognitive (CRITICAL), 5 logs données non fiables (MINOR/VULNERABILITY), 2 composants React définis en ligne (MAJOR). Objectif : lever ces 8 issues sans régression fonctionnelle.

## Issue A — S3776 CRITICAL — Complexité cognitive 16/15

**Fichier** : `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.component.tsx:158` — fonction `fillCategorieForm(ssCatId)`

Cause : chaîne `if/else if/else` (branches CAT_RENTREE_ARGENT / CAT_ACTIFS_INVEST / défaut) chacune dupliquant un bloc `if (operation) {...}`, plus usage `&&` comme assignation conditionnelle.

**Fix appliqué** : éclatée en helpers locaux `applyCategorieParente`, `applyRentreeArgent`, `applyActifInvest`, `applyDefaut`. `cond && (x = y)` remplacé par `if(cond){ x = y; }`. Comportement fonctionnel identique sur les 3 branches.

## Issue B — S5145 MINOR x5 — Log données non fiables (API-controlled)

5 sites exacts flagués : `Analyses.controller.ts:39`, `Recurrents.component.tsx:52`, `Budget.component.tsx:55` et `:67`, `MainPage.extservices.ts:27`.

**Fix appliqué** : suppression pure des 5 `console.log` loggant données API brutes (budget.id, .length, libelle). Logique métier autour intacte.

## Issue C — S6478 MAJOR x2 — Composant défini dans composant parent

Fichiers : `AnalyseCategoriesTreeMap.component.tsx:135`, `AnalyseTreeMap.component.tsx:83`.

**Fix appliqué** : composant top-level `TreemapContentRenderer` extrait hors du parent, props explicites (`selectedCategoryName`/`selectedCategory`, `onCategoryClick`, `analyseCategoriesData`) au lieu de closure sur variables parent.

## Fichiers modifiés

- `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.component.tsx`
- `src/main/Components/analyses/Analyses.controller.ts`
- `src/main/Components/budgets/recurrents/Recurrents.component.tsx`
- `src/main/Components/budgets/budget/Budget.component.tsx`
- `src/main/Components/mainpages/MainPage.extservices.ts`
- `src/main/Components/analyses/syntheses/AnalyseCategoriesTreeMap.component.tsx`
- `src/main/Components/analyses/syntheses/AnalyseTreeMap.component.tsx`

## Orchestration exécutée

1. DEVon : implémenté A, B, C en lot unique (7 fichiers) — commit `e3d7385 remediation sonar`
2. Gate #2 : validé (diff scope conforme)
3. QALvin : 14 tests ajoutés (3 fichiers test) — commit `8f31f56 test: couverture remédiation SonarCloud`
   - `OperationDetailPage.component.test.tsx` (5 tests, 3 branches + cas limites)
   - `AnalyseTreeMap.component.test.tsx` (4 tests)
   - `AnalyseCategoriesTreeMap.component.test.tsx` (5 tests)
4. Gate #3 : validé
5. DOCly : skip (refacto interne, pas décision archi majeure, pas d'ADR requis)
6. Gate #4 : clôturé

## Résultats

- `npm run lint` : 0 erreur sur fichiers touchés
- Tests : 119/123 passent (4 échecs préexistants dans `Auth.service.test.ts`, sans rapport — cassés par upgrade Vitest 4, chip `task_f7087d54` créée séparément)
- Push effectué sur `feat/qa_deploy` (2 commits : `e3d7385`, `8f31f56`)

## Vérification restante (hors périmètre agent)

- Re-scan SonarCloud après merge/déploiement → confirmer 8 issues passées à CLOSED/RESOLVED
- Test manuel navigateur : détail opération (3 branches catégorie) + TreeMap analyses (clic cellule)
