# Plan d'Action 006 — Revue qualité/architecture React IHM

**Statut** : ✅ Lot 1 livré (Gate #4 validé 👤, 2026-10-25) · ✅ Lot 2 livré (Gate #4 validé 👤) · 🟡 Lot 3 livré (découpage `OperationDetailPage`, régression T10 corrigée), Gate #4 en attente 👤 (reste : T16, T20 partiel, T12, sécurité `processEquation`)
**Date** : 2026-10-23

## Context

Demande 👤 : évaluer qualité/pertinence de l'architecture et de l'implémentation React du frontend `gestion-budget-ihm`, identifier composants à modifier/améliorer/mutualiser, et opportunités d'intégrer des fonctions React avancées (mémoïsation, lazy loading, hooks custom) pour gagner en efficacité.

## Gate #0 — Analyse (constats)

Deux explorations factuelles (structure composants + data flow/hooks/optimisation) ont cartographié le repo :

- React 19.1.1, react-router-dom 7.9.1 (HashRouter), react-oidc-context 3.3.0, MUI 9.0.0, recharts 3.2.1, Vite 8.1.4, Vitest 5.0.0.
- 58 composants `.tsx`. `Components.props.ts` unique (222 lignes) centralise tous les types Props — pas de co-location malgré convention documentée.
- Duplication majeure `Budget.component.tsx` (170L) / `Recurrents.component.tsx` (134L) : même pattern complet, y compris 2 `console.log` strictement identiques dupliqués.
- `OperationDetailPage.component.tsx` (433L, plus gros fichier du repo) importe directement des éléments du module "recurrentes" (couplage croisé).
- 3 composants Tooltip recharts quasi redondants sans factorisation.
- `BudgetContextProvider.tsx` : contexte unique à **19 consumers**, `useMemo` du `contextValue` dépend de 6 states → tout changement re-render tous les consumers. Un `useMemo` est un simple alias inutile.
- 2 `useEffect` vides (`useEffect(() => {}, [refresh])`) — anti-pattern force-update.
- State dérivé stocké (groupements) au lieu de calculé via `useMemo`.
- 51 `console.log` de debug laissés en production.
- Tests : 31 fichiers test / 111 fichiers source, mais seulement **3 fichiers `.component.test.tsx`** sur 51 composants (37 composants sans aucun test).
- `ClientHTTP.service.ts` : fetch natif seul point d'entrée, pas de retry/cache/timeout, `throw new Error(e)` perd la stack d'origine.
- Pattern `.then().catch()` dupliqué dans 7 fichiers `*.extservices.ts`.
- Token OIDC → localStorage synchronisé uniquement par `Profile.component.tsx` au montage — pas de resync automatique lors de l'`automaticSilentRenew` (risque fonctionnel).
- 7 composants fetchent directement en `useEffect` (triplet useState+useEffect+callback répété), aucun hook custom, aucun dossier `hooks/`.
- **0 occurrence** `React.memo` et **0 occurrence** `React.lazy`/`Suspense` dans tout le repo. Seulement 7 fichiers `useMemo`, 3 fichiers `useCallback`.

## Gate #1 — Plan détaillé (T1-T20)

### 1. Mutualisation / Duplication

**T1 — Factoriser `Budget.component.tsx` / `Recurrents.component.tsx`**
- Constat : pattern complet dupliqué (useBudgetContext + useState liste groupée + useCallback handleBudgetUpdate + layout Backdrop/BudgetPageHeader/Divider/Grid), incl. 2 `console.log` identiques (Budget:72/Recurrents:54, Budget:79/Recurrents:63).
- Action : extraire un composant générique paramétré (type de données, fonction de regroupement, libellés d'en-tête) ; les 2 composants deviennent des wrappers de configuration.
- Fichiers : `Budget.component.tsx`, `Recurrents.component.tsx`
- Effort : M · Risque : Moyen · **Priorité : Haute**

**T2 — Découpler `OperationDetailPage.component.tsx` du module "récurrentes"**
- Constat : import direct (l.45, l.47) de `OperationRecurrenteDetailDateFin.component.tsx` et `OPERATION_RECURRENTE_EDITION_FORM` depuis le module "courantes" (433 lignes, plus gros fichier du repo).
- Action : déplacer ces éléments partagés vers `shared/` ; évaluer un découpage de `OperationDetailPage.component.tsx` en sous-composants plus petits.
- Fichiers : `OperationDetailPage.component.tsx`, `OperationRecurrenteDetailDateFin.component.tsx`, `OperationRecurrenteDetailPage.component.tsx`
- Effort : M · Risque : Moyen · Priorité : Moyenne

**T3 — Composant Tooltip recharts générique**
- Constat : `AnalyseEvolutionTooltip`, `AnalyseSyntheseTooltip`, `AnalyseTreeMapTooltip` quasi redondants.
- Action : extraire `AnalyseTooltip.component.tsx` générique paramétré (formatteurs), chaque tooltip spécifique ne garde que son formatage propre.
- Fichiers : les 3 fichiers tooltip sous `Components/analyses/syntheses/`
- Effort : S · Risque : Faible · Priorité : Moyenne

**T4 — Factoriser le pattern d'appel extservices**
- Constat : pattern `call(...).then(data => setX(data)).catch(e => { console.log(...); toast.error(...) })` répété dans 7 fichiers `*.extservices.ts`.
- Action : créer `callAndNotify(promise, onSuccess, errorMessage)` centralisant then/catch/toast/log.
- Fichiers : 7 fichiers `*.extservices.ts`
- Effort : S · Risque : Faible · **Priorité : Haute** (prérequis T11/T12)

### 2. Gestion d'état

**T5 — Dériver les regroupements via `useMemo`**
- Constat : `operationsGroupedByDateOperation` (Budget:46,71) et `operationsRecurrentesGroupedByPeriodicity` (Recurrents:43,53) stockés en state, recalculés manuellement dans `handleBudgetUpdate` au lieu d'être dérivés de `currentBudget`.
- Action : remplacer par `useMemo(() => groupBy(currentBudget...), [currentBudget])`.
- Fichiers : `Budget.component.tsx`, `Recurrents.component.tsx`
- Effort : S · Risque : Faible-Moyen · **Priorité : Haute**

**T6 — Splitter `BudgetContextProvider`**
- Constat : contexte unique à 19 consumers, `useMemo contextValue` (l.60-73) dépend de 6 states → re-render global à chaque changement d'un seul champ ; `useMemo` ligne 54 inutile (alias sans calcul).
- Action : scinder en contextes plus fins selon domaines réellement consommés indépendamment ; supprimer l'alias inutile. **À faire après T19** (tests de rendu posés).
- Fichiers : `BudgetContextProvider.tsx`
- Effort : L · Risque : Élevé · Priorité : Moyenne

### 3. Performance / Mémoïsation

**T7 — `React.lazy`/`Suspense` sur les routes**
- Constat : 0 occurrence dans le repo ; 5 routes de `Main.tsx` toutes importées statiquement.
- Action : convertir les imports de pages en `React.lazy(() => import(...))`, englober `<Routes>` dans `<Suspense fallback={...}>`.
- Fichiers : `Main.tsx`
- Effort : S · Risque : Faible · **Priorité : Haute**

**T8 — `React.memo` sur composants de liste/items répétés**
- Constat : 0 occurrence `React.memo` dans tout le repo.
- Action : identifier composants rendus en boucle (items d'opérations, `CompteItem`) et les envelopper avec `React.memo` (props stables requis, cf. T9).
- Fichiers : `CompteItem.component.tsx`, composants de ligne Budget/Recurrents
- Effort : M · Risque : Faible-Moyen · Priorité : Moyenne

**T9 — Stabiliser les callbacks via `useCallback`**
- Constat : seulement 3 fichiers `useCallback` dans tout le repo ; memo (T8) inefficace sans callbacks stables.
- Action : envelopper les callbacks passés aux composants ciblés en T8 avec `useCallback` (dépendances correctes).
- Fichiers : parents des listes ciblées T8, `Budget.component.tsx`, `Recurrents.component.tsx`
- Effort : S (dépend T8) · Risque : Faible · Priorité : Moyenne

**T10 — Supprimer les `useEffect` vides "force-update"**
- Constat : `useEffect(() => {}, [refresh])` dans `OperationDetailPage.component.tsx:84` et `OperationRecurrenteDetailPage.component.tsx:46`.
- Action : identifier l'intention réelle, remplacer par un `useMemo`/update explicite basé sur la vraie dépendance.
- Fichiers : `OperationDetailPage.component.tsx`, `OperationRecurrenteDetailPage.component.tsx`
- Effort : S · Risque : Moyen · **Priorité : Haute**

### 4. Data fetching

**T11 — Hook custom `useFetch` + extraction `useBudgetContext`**
- Constat : 7 composants (Budget, Recurrents, AnalysesFiltrePeriode, Infos, MainPage, ProfileInfos, CompteItem) répètent useState+useEffect+callback extservices ; aucun dossier `hooks/`.
- Action : créer `src/main/hooks/useFetch.ts` (loading/data/error + appel extservice) ; extraire `useBudgetContext` dans `hooks/useBudgetContext.ts`.
- Fichiers : les 7 composants, nouveau `hooks/useFetch.ts`, `BudgetContextProvider.tsx`
- Effort : M · Risque : Moyen · **Priorité : Haute**

**T12 — ADR : introduction TanStack Query (arbitrage)**
- Constat : aucun cache/dedup/retry actuel ; T11 résout la duplication mais pas le cache.
- Action : voir `docs/adr/002-tanstack-query-data-fetching.md` (statut Proposée). Décision différée à 👤, après T11, si besoin cache/dedup confirmé.
- Fichiers : `ClientHTTP.service.ts`, les 7 extservices
- Effort : L · Risque : Élevé · Priorité : Basse

**T13 — Fix perte de stack trace `ClientHTTP.service.ts`**
- Constat : `throw new Error(e)` (l.106-109) perd la stack/type d'erreur d'origine.
- Action : `throw e` si déjà Error, ou `new Error(message, { cause: e })`.
- Fichiers : `ClientHTTP.service.ts:106-109`
- Effort : S · Risque : Faible · Priorité : Moyenne

**T14 — Fiabiliser la resynchronisation du token OIDC**
- Constat : `Auth.service.ts` découplé de `react-oidc-context` ; seul `Profile.component.tsx:43` fait le pont `putTokenInStorage`. Pas de resync lors de l'`automaticSilentRenew` → risque de token périmé si `Profile` non monté.
- Action : déplacer la synchronisation dans un hook global monté une fois au niveau racine (écoute événements de renouvellement oidc), indépendant du cycle de vie d'un composant de page.
- Fichiers : `Auth.service.ts`, `Profile.component.tsx`, point d'entrée app (`Main.tsx`)
- Effort : M · Risque : Élevé · **Priorité : Haute** (risque fonctionnel réel)

### 5. Dette technique

**T15 — Supprimer les 51 `console.log` de debug**
- Constat : 51 occurrences dans `src/main`, incl. doublons Budget/Recurrents (cf. T1).
- Action : suppression ; remplacer les logs utiles par un wrapper conditionnel (désactivé en prod) ; ajouter règle ESLint `no-console`.
- **Réalisé (révisé sur demande 👤)** : logs de debug conservés sous mode debug `VITE_CONFIG_DEBUG` via `debug()` (`Utils/Debug.utils.ts`, seul `console.log` autorisé par ESLint) ; seuls les logs d'erreur/alerte convertis en `console.error`/`console.warn` ; règle `no-console` (allow warn/error) active ailleurs ; test `Debug.utils.test.ts`.
- Fichiers : ~51 occurrences `src/main`, config ESLint
- Effort : S · Risque : Faible · **Priorité : Haute**

**T16 — Co-location des types Props selon convention documentée**
- Constat : `Components.props.ts` unique (222 lignes) centralise tout, alors que la convention documentée prône la co-location.
- Action : clarifier la convention réelle visée (`conventions-dev`), migrer progressivement par lot (en commençant par Budget/Recurrents après T1).
- Fichiers : `Components.props.ts`, composants concernés
- Effort : L · Risque : Faible (effort élevé) · Priorité : Basse

**T17 — Harmoniser `React.FC` sur 4 composants recharts**
- Constat : 4 fichiers tooltip/content recharts n'utilisent pas `React.FC<Props>`.
- Action : typer avec `React.FC<Props>`, à mutualiser avec T3.
- Fichiers : les 4 composants recharts concernés
- Effort : S · Risque : Faible · Priorité : Basse

### 6. Tests / Couverture

**T18 — Baseline de couverture**
- Constat : aucun rapport de coverage généré actuellement.
- Action : exécuter/publier `npm run test:coverage` comme référence avant tout refactoring de ce plan.
- Fichiers : `vite.config.ts`, `package.json`
- Effort : S · Risque : Faible · **Priorité : Haute** (prérequis, avant T1/T6)

**T19 — Tests de rendu des composants à refactorer**
- Constat : seulement 3/51 composants testés en rendu ; Budget, Recurrents, BudgetContextProvider, OperationDetailPage (ciblés T1/T2/T6) sans filet de sécurité.
- Action : écrire tests React Testing Library (rendu initial, mise à jour opération, regroupement) avant T1, T2, T6.
- Fichiers : nouveaux `Budget.component.test.tsx`, `Recurrents.component.test.tsx`, `BudgetContextProvider.test.tsx`, `OperationDetailPage.component.test.tsx`
- Effort : M · Risque : Faible · **Priorité : Haute** (bloquant pour T1/T2/T6)

**T20 — Couverture continue des 37 composants non testés**
- Constat : 37/51 composants sans test de rendu.
- Action : ajouter les tests du composant touché à chaque refacto (T1-T17) plutôt qu'en chantier séparé ; cible 70-80% sur composants page/métier.
- Fichiers : ensemble des `.component.tsx` sans test
- Effort : L · Risque : Faible · Priorité : Moyenne

## Séquencement recommandé

1. **Mesure/sécurité** : T18 → T19
2. **Dette rapide, faible risque** : T15, T4, T7, T13
3. **Corrections d'état** : T5, T10, T1
4. **Risque fonctionnel** : T14
5. **Mutualisation secondaire** : T3, T2, T11
6. **Performance avancée** : T8, T9, T6 (T6 après T19 impérativement)
7. **Arbitrage** : T12 (ADR)
8. **Dette de fond continue** : T16, T17, T20

## Journal des gates

| Gate | Date | Décision | Détail |
|---|---|---|---|
| #0 | 2026-10-23 | GO | Constats validés via synthèse ci-dessus (2 agents Explore + 1 agent Plan) |
| #1 | 2026-10-25 | GO | Plan validé 👤, DEVon lancé |
| #2 | 2026-10-25 | GO 👤 (logs debug conservés via `debug()`) | DEVon livré : T18,T19,T15,T4,T7,T13,T5,T10,T14,T3,T17,T11(infra),T8,T9 faits ; T1,T6 portée réduite ; T2,T16,T20 reportés ; T12 exclu. 135 tests verts, lint 0 erreur, build OK |
| #3 | 2026-10-25 | GO 👤 | QALvin : +60 tests (197 verts), couverture 87.3% stmt / 73.7% branch, 0 bug prod. Non couverts : Main.tsx lazy/Suspense, branche isMobile BudgetPageShell |
| #4 | 2026-10-25 | GO 👤 | DOCly : `docs/ARCHITECTURE.md`, `README.md`, `.claude/CLAUDE.md`, plan 006 + index + wiki (ConceptionIHM, Historique, schémas C2/C3, label React 19.3.1) mis à jour ; ADR 002 laissé `Proposée` |

## Résultats (lot 1)

### Fait
- T18 baseline couverture, T19 tests de rendu préalables.
- T15 : logs de debug conservés sous `debug()` (`VITE_CONFIG_DEBUG`), erreurs/alertes en `console.error`/`console.warn`, règle ESLint `no-console` (dérogation sur `Utils/Debug.utils.ts` seul).
- T4 : `callAndNotify` (`Services/CallAndNotify.service.ts`) dans les `*.extservices.ts`.
- T7 : `React.lazy` + `Suspense` sur les routes `MainPage` et `Infos` (`Main.tsx`).
- T13 : erreurs `ClientHTTP.service.ts` relancées avec `cause`.
- T5 : regroupements dérivés via `useMemo`. T10 : `useEffect` vides supprimés.
- T14 : `AuthTokenSync` + `useAuthTokenSync` à la racine (événements `addUserLoaded` / `addUserUnloaded`), pont retiré de `Profile.component.tsx`.
- T3 : `AnalyseTooltip.component.tsx` générique. T17 : `React.FC` sur les composants recharts.
- T8/T9 : `React.memo` sur `OperationItem`, `OperationRecurrenteItem`, `CompteItem` ; `useCallback` sur les handlers de sélection.
- T11 (infra) : dossier `hooks/` avec `useFetch`, `useBudgetContext` (extrait ; `BudgetContextProvider` ré-exporte), `useAuthTokenSync`.

### Portée réduite
- **T1** : seul le squelette commun est factorisé (`budgets/shared/BudgetPageShell.component.tsx`) ; `Budget` et `Recurrents` gardent leur logique propre.
- **T6** : seule l'extraction de `BudgetContext` / `useBudgetContext` vers `hooks/` est faite ; contexte toujours unique.
- **T11** : infra livrée (`useFetch` fourni), adoption par les 7 composants restante (reste de T11, pas rattachée à T20).

### Reporté
T2, T6 (scission), T11 (adoption), T16, T20, T12 (voir ci-dessous).

### Preuves
- Lint : 0 erreur. Build : OK (Gate #2).
- Tests : 197 verts (135 à Gate #2, +60 QALvin à Gate #3). Couverture 87.3 % stmt / 73.7 % branch (cible ≥ 80 % stmt atteinte).
- Non couverts : `Main.tsx` lazy/Suspense, branche `isMobile` de `BudgetPageShell`.

## Lot 2 (2026-10-25) — branche `claude/react-ui-architecture-lot2`

Périmètre validé 👤 ("go pour le lot suivant") : **T2, T11 (adoption `useFetch`), T6, T20 (composants touchés)**. Hors lot : T12 (décision ADR 👤), T16 (migration massive des Props).

Ordre : T11 (adoption, composant par composant, tests de rendu avant) → T2 (déplacement `OperationRecurrenteDetailDateFin` vers `shared/`, découpage `OperationDetailPage` si sûr ; QALvin met à jour les `vi.mock` de chemins) → T6 (scission `BudgetContext`, après T11/T2) → T20 (tests des composants touchés).

### Journal des gates lot 2

| Gate | Date | Décision | Détail |
|---|---|---|---|
| #1 | 2026-10-25 | GO | Périmètre lot 2 validé 👤 |
| #2 | 2026-10-25 | GO 👤 | DEVon : T11 adoption, T2 partiel, T6, correctifs UX/bug |
| #3 | 2026-10-25 | GO 👤 | QALvin : 365 tests verts (58 fichiers), lint 0 erreur, ~91 % stmt |
| #4 | — | GO 👤 (validé avant le lot 3) | DOCly : plan, index, CLAUDE.md, ARCHITECTURE.md, ADR 002 (note), wiki (ConceptionIHM, Historique, C3) mis à jour |

### Résultats (lot 2)

#### Fait
- **T11 (adoption)** : 7 composants (`Budget`, `Recurrents`, `AnalysesFiltrePeriode`, `Infos`, `MainPage`, `ProfileInfos`, `CompteItem`) utilisent `useFetch`. Les `*.extservices.ts` exposent des variantes Promise `fetch*` (`fetchCategories`, `fetchBudget`, `fetchPreferenceUtilisateur`, `fetchLibellesOperationsCompte`, `fetchInfosFromMicroServices`, `fetchLastAccessDateUtilisateur`, `fetchComptes`, `fetchSoldesBudget`) ; anciennes fonctions callback supprimées. `callWithNotify` (`Services/CallAndNotify.service.ts`) : log + toast + relance l'erreur (pour `useFetch`) ; `callAndNotify` conservé (`BudgetActionsButtonGroup`, `saveOperation*`). Reset du contexte Budget/Recurrents dans un effet sur `[selectedCompte, selectedDate]` ; `useFetch` ignore les réponses périmées.
- **T2 (partiel)** : `OperationRecurrenteDetailDateFin.component.tsx` déplacé vers `Components/budgets/operations/shared/`. Enum `OPERATION_RECURRENTE_EDITION_FORM` conservée dans `recurrentes/details/`.
- **T6** : `hooks/useBudgetContext.ts` expose `BudgetSelectionContext` (comptes, compte/date sélectionnés, catégories + setters) et `CurrentBudgetContext` (budget/opération courants + setters), hooks `useBudgetSelection()` / `useCurrentBudget()` (lèvent hors provider) ; `useBudgetContext()` = agrégat des 12 champs. 12 consumers migrés vers les hooks ciblés ; `Budget`, `Recurrents`, `OperationDetailPage`, `OperationDetailCategories`, `OperationDetailLibelle`, `OperationRecurrenteDetailPage` restent sur l'agrégat.
- **T20 (partiel)** : tests ajoutés/mis à jour sur les composants touchés.
- **UX/bug** : spinner dans `CompteItem` à chaque rechargement du solde ; spinner + bornes périmées ignorées dans `AnalysesFiltrePeriode` pendant le chargement des périodes ; bug de prod corrigé dans `BudgetSoldes` (Fragment comme enfant de `Tooltip` MUI → `TypeError`).

#### Preuves
- Tests : 365 verts (58 fichiers). Lint : 0 erreur. Couverture ~91 % stmt (QALvin).

#### Point connu
- Sans compte sélectionné, le spinner de `AnalysesFiltrePeriode` apparaît brièvement (`useFetch` en `loading` avec `Promise.resolve(undefined)`) ; ajustement possible plus tard.

## Lot 3 (2026-10-26) — branche `claude/react-ui-architecture-lot3`

Périmètre validé 👤 ("lance la suite") : **découpage de `OperationDetailPage`** (état d'édition immuable + hook `useOperationEditForm`, sous-composants) et **couverture T20** des composants concernés (`OperationDetailPage` ~69 %, `OperationDetailPage.controller` ~66 %, `OperationDetailActions`, `BudgetActionsButtonGroup`, sous-composants `OperationDetail*`, `AnalyseOperationItem`). Hors lot : T12 (décision 👤), T16 (co-location des Props).

Ordre : 1) QALvin pose les tests de caractérisation (filet) AVANT tout refactor ; 2) DEVon refactore sans changer le comportement ; 3) QALvin ajuste les tests ; 4) DOCly.

### Journal des gates lot 3

| Gate | Date | Décision | Détail |
|---|---|---|---|
| #1 | 2026-10-26 | GO 👤 | Périmètre lot 3 validé |
| #2 | 2026-10-26 | GO 👤 | DEVon : correctif régression T10 (PR #704), refactor `OperationDetailPage` (429 → 106 lignes), état d'édition immuable, défauts (3)–(7) corrigés |
| #3 | 2026-10-26 | GO 👤 | QALvin : 837 tests verts (92 fichiers), lint 0 erreur, build OK, ~100 % lignes page/hook/controller/actions/sections |
| #4 | — | ⏳ En attente 👤 | DOCly : plan, index, CLAUDE.md, ARCHITECTURE.md, wiki (ConceptionIHM, Historique, C3) mis à jour ; ADR 002 inchangé (`Proposée`) |

**Phase 1 (filet QALvin) — résultats** : +231 tests, `OperationDetailPage` 68,9 → 98,9 % lignes, controller 65,9 → 100 %. Le filet a révélé une **régression du lot 1 (T10)** : retirer `setRefresh` a supprimé le re-rendu au clic sur un champ (`openEditForm` réécrivait la même référence `editForm` mutée en place) → corrigée par copie (`setEditForm({ ...editForm })`), PR dédiée. Le même correctif règle l'affichage de l'état REALISEE après « Valider l'opération » en création.

**Défauts identifiés par le filet** (tests `test.fails`, tous corrigés en phase 2) : (3) création + « Valider l'opération » envoyait `dateOperation = null` ; (4) montant non contrôlé : ancienne saisie affichée d'une création à l'autre ; (5) libellé purement numérique (« 2024 ») perdu ; (6) montant « abc » accepté comme 0 (`processEquation`) ; (7) `OperationDetailValeur` : `budgetActif = currentBudget` (objet) au lieu de `currentBudget.actif`.

### Résultats (lot 3)

#### Fait
- **Régression T10 corrigée** (PR #704, contenue dans la branche) : `openEditForm` copie `editForm` (`{ ...editForm }`) ⇒ re-rendu au clic sur un champ ; filet de tests de caractérisation (+231 tests en phase 1).
- **T2 (reste) : découpage de `OperationDetailPage`** (429 → 106 lignes) :
  - hook `hooks/useOperationEditForm.ts` : `editForm`, `editOperation`, `errors`, `resetKey` ; initialisation à la sélection pendant le rendu ; `handleClick`, `validate`, `setEtatInCreation`, `commitOperation` ;
  - sous-composants `detail/subcomponents/OperationDetail{Header,CategoriesSection,MensualiteSection,EtatSection,ActionsSection}` ;
  - `OperationDetailPage.controller.ts` : fonctions pures exportées (`fillOperationField`, `fillCategorieForm`, `applyCategorieParente`, `applyRentreeArgent`, `applyActifInvest`, `applyDefaut`, `applyEtatInCreation`, `openField`) ; `cloneOperation` copie `mensualite` en profondeur, + `cloneOperationEdition` / `cloneOperationModel`.
- **État d'édition immuable** : l'opération du contexte (`currentOperation`) n'est plus jamais mutée ; la validation porte sur un brouillon, qui devient `currentOperation` au succès. Actions d'état en édition : `saveOperation(updated, budget, wrapper)`, le wrapper appelle `onOperationChange` puis `onOperationCommit` **uniquement au succès** (échec : ni commit ni changement d'écran). En création : `handleDateOperationFromAction(date, etat)`.
- **Défauts corrigés** : date du jour transmise en création + « Valider l'opération » ; montant remis à zéro entre deux créations (`resetKey`) ; libellé numérique « 2024 » conservé ; montant « abc » refusé (« Le champ Montant est incorrect ») et montants ambigus (« 2 3 ») refusés au lieu d'être enregistrés comme 0 ; `OperationDetailValeur` désactivé sur budget clos (`currentBudget?.actif`) ; erreurs effacées après correction.

#### Preuves
- Tests : 837 verts (92 fichiers). Lint : 0 erreur. Build : OK.
- Couverture ~100 % lignes sur page / hook / controller / actions / sections (branches page 70 %).
- Mutations de vérification : le filet a été éprouvé par mutations (cassure volontaire du comportement ⇒ tests rouges) avant/après refactor.
- Non couvert : `Main.tsx` lazy/Suspense, branches `isMobile`.

#### Leçon (régression T10)
Le lot 1 a supprimé le `useEffect(() => {}, [refresh])` « vide » et `setRefresh`. Or `refresh` forçait le re-rendu alors que l'état d'édition était **muté en place** et réaffecté avec la **même référence** : React ne voit aucun changement ⇒ pas de rendu. Règles retenues : (1) ne jamais muter un état en place, toujours copier (`{ ...x }`) ; (2) supprimer un `useEffect` ou un state « vide » exige de vérifier ce que son déclenchement provoquait (re-rendu forcé) et de le couvrir par un test avant retrait. Le refactor lot 3 supprime la cause racine (état immuable).

#### Points d'attention / dette issue du lot 3
- **Sécurité** : `processEquation` évalue la saisie via `new Function` (malgré la mention « sans eval ») ⇒ tâche dédiée : remplacer par un parseur arithmétique.
- Le hook `useOperationEditForm` (dans `hooks/`) importe des modules de `Components/` (dépendance inversée) : déplaçable dans `detail/`.
- La date d'opération reste non contrôlée (`defaultValue`) : n'affiche pas la date du jour en création + « Valider l'opération » (elle est correctement envoyée à la sauvegarde).

## Dette restante / prochain lot (après lot 3)

| Tâche | Reste à faire | Prérequis / blocage |
|---|---|---|
| ~~T2 (reste)~~ | ✅ Fait (lot 3) : `OperationDetailPage` découpée | — |
| T6 (reste) | Migrer vers les hooks ciblés les consumers restés sur l'agrégat (`Budget`, `Recurrents`, `OperationDetailPage`, `OperationDetailCategories`, `OperationDetailLibelle`, `OperationRecurrenteDetailPage`) | Lisent des champs des deux moitiés ; à vérifier après le découpage lot 3 |
| Sécurité | Remplacer l'évaluation `new Function` de `processEquation` par un parseur arithmétique | Tâche dédiée à planifier |
| Dette | Déplacer `useOperationEditForm` dans `detail/` (dépendance `hooks/` → `Components/`) ; contrôler la date d'opération | Mineur |
| T16 | Co-location des Props (`Components.props.ts` reste centralisé) | Par lots |
| T20 (reste) | Couverture de composants hors lot : `OperationDetailCategories` (l.83), `OperationDetailStatus.renderer` (67 %) | Au fil des refactos |
| T12 | ADR 002 TanStack Query : statut `Proposée`, décision 👤 | `useFetch` adopté → réévaluation cache/dedup possible (voir note de l'ADR) |
| Ajustement | Spinner `AnalysesFiltrePeriode` sans compte sélectionné | Mineur |

## Fichiers critiques
- `src/main/Components/budgets/budget/Budget.component.tsx`
- `src/main/Components/budgets/recurrents/Recurrents.component.tsx`
- `src/main/Models/contextProvider/BudgetContextProvider.tsx`
- `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.component.tsx`
- `src/main/Services/ClientHTTP.service.ts`

## ADR associé

[`docs/adr/002-tanstack-query-data-fetching.md`](../../docs/adr/002-tanstack-query-data-fetching.md) (Proposée — décision T12 uniquement)
