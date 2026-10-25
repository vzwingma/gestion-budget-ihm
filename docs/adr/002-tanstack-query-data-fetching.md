# ADR 002 — Introduction (conditionnelle) de TanStack Query pour le data-fetching

---

**Date :** 2026-10-23
**Statut :** Proposée
**Décideurs :** 🟠 ARCos + 👤 Développeur humain

---

## Contexte

La revue d'architecture React (Plan d'Action `006_revue_architecture_react.plan.md`, item T12) a constaté :

- `ClientHTTP.service.ts` est un wrapper `fetch` natif minimal : pas de retry, pas de cache, pas de déduplication de requêtes, pas d'`AbortController`/timeout, pas d'intercepteur centralisé de refresh de token.
- 7 composants (`Budget`, `Recurrents`, `AnalysesFiltrePeriode`, `Infos`, `MainPage`, `ProfileInfos`, `CompteItem`) répètent le même triplet `useState` + `useEffect` + callback `*.extservices.ts`, chacun gérant manuellement ses propres états loading/error/data.
- Aucun dossier `hooks/` custom n'existait lors de la revue (créé depuis, lot 1 du plan 006 ; `useFetch` adopté au lot 2).
- Le Plan d'Action 006 (item T11) prévoit déjà un hook custom `useFetch` pour factoriser ce triplet répété — une extension du pattern existant, pas une décision d'architecture majeure.

La question posée par cet ADR est distincte de T11 : faut-il, au-delà de la factorisation du triplet, introduire une librairie de data-fetching dédiée (cache, déduplication, retry, invalidation) ?

---

## Décision

**Proposée** (non actée) : ne pas introduire TanStack Query immédiatement. Traiter d'abord T11 (hook `useFetch` custom, sans dépendance externe). Réévaluer l'introduction de TanStack Query **seulement si**, après T11, un besoin concret de cache/déduplication/retry est confirmé en usage réel (ex. re-fetch redondants observés entre les pages Budget/Recurrents/Analyses pour un même compte/période).

---

## Alternatives Considérées

### Option 1 : Hook custom `useFetch` seul (T11) — ✅ Retenue à ce stade

- **Avantages** : aucune nouvelle dépendance, migration mécanique des 7 composants, résout la duplication du triplet useState/useEffect/callback immédiatement, risque faible, effort M.
- **Inconvénients** : ne fournit ni cache, ni déduplication de requêtes concurrentes, ni retry automatique, ni invalidation croisée entre composants consommant la même donnée (ex. `selectedCompte`/`selectedDate` rechargés indépendamment dans Budget et Recurrents).

### Option 2 : TanStack Query (`@tanstack/react-query`)

- **Avantages** : cache par clé de requête, déduplication automatique des appels concurrents, retry configurable, invalidation fine, états loading/error/stale standardisés, bien outillé pour React 19.
- **Inconvénients** : nouvelle dépendance structurante touchant toute la couche data (7 extservices + `ClientHTTP.service.ts`) ; nécessite une migration progressive du pattern `then/catch/setState` existant vers `useQuery`/`useMutation` ; courbe d'apprentissage ; risque de régression sur la gestion actuelle du logout forcé en 403 (`ClientHTTP.service.ts:98-100`) si mal intégré avec les retries de la lib.
- **Raison du report** : le besoin de cache/dedup n'est pas encore confirmé par un symptôme observé (ex. re-fetch mesurés comme redondants) — introduire la lib avant ce signal serait une sur-ingénierie potentielle au regard de la taille actuelle de l'app (7 extservices, pas de data partagée massivement entre écrans hors `BudgetContext`).

### Option 3 : SWR

- **Avantages** : plus légère que TanStack Query, API simple, cache + revalidation.
- **Inconvénients** : écosystème plus restreint, moins de primitives pour mutations complexes (sauvegarde opération, validation budget) que TanStack Query `useMutation`.
- **Raison du rejet** : si une lib de cache devient nécessaire, TanStack Query offre une couverture plus complète (queries + mutations) adaptée aux besoins CRUD du projet (opérations, budgets), pour un coût d'adoption comparable.

---

## Conséquences

### Positives (si T11 seul, à ce stade)
- Pas de nouvelle dépendance, pas de risque de migration structurante.
- Duplication du triplet fetch résolue dans l'immédiat.

### Négatives / Compromis
- Le besoin de cache/dedup reste non couvert tant que T12 n'est pas réévalué.
- Si TanStack Query est introduit plus tard, la migration touchera les 7 `*.extservices.ts` et potentiellement `ClientHTTP.service.ts` (adapter le wrapper fetch en `queryFn`/`mutationFn`).

### Neutres
- `ClientHTTP.service.ts` reste inchangé par cette décision (T13 — fix stack trace — est indépendant et peut être traité quel que soit le sort de T12).

---

## Mise en œuvre

- **Fichiers impactés si Option 2 retenue ultérieurement** : `package.json` (ajout dépendance), `ClientHTTP.service.ts`, les 7 fichiers `*.extservices.ts`, les 7 composants consommateurs (Budget, Recurrents, AnalysesFiltrePeriode, Infos, MainPage, ProfileInfos, CompteItem).
- **État d'avancement T11 (2026-10-25, lot 2)** : le hook `useFetch` (`src/main/hooks/useFetch.ts`) est désormais **adopté** par les 7 composants (`Budget`, `Recurrents`, `AnalysesFiltrePeriode`, `Infos`, `MainPage`, `ProfileInfos`, `CompteItem`), via les variantes Promise `fetch*` des extservices + `callWithNotify`. La réévaluation « après T11 » est donc **possible**. Statut inchangé : `Proposée` (décision 👤).
- **Éléments d'aide à la décision (sans recommandation)** :
  - *Acquis par `useFetch`* : suppression du triplet répété, états `loading`/`error`/`data`/`refetch` uniformes, annulation des réponses périmées (race conditions) lors d'un changement de dépendances.
  - *Toujours non couvert* : cache entre écrans/remontages, déduplication de requêtes concurrentes identiques, retry automatique, invalidation croisée, timeout/`AbortController` (le `fetch` en vol n'est pas annulé, seule sa réponse est ignorée).
  - *Signaux à observer pour confirmer le besoin* : rechargements redondants d'une même donnée (ex. catégories, comptes, solde par `CompteItem`) lors de la navigation entre Budget / Recurrents / Analyses pour un même compte/période ; lenteur ressentie au retour sur une page déjà visitée ; besoin d'invalidation après `saveOperation*`.
  - *Éléments de coût* : migration de 8 variantes `fetch*` et des mutations `callAndNotify` vers `useQuery`/`useMutation`, adaptation de `ClientHTTP.service.ts`, précaution sur le logout forcé en 403 avec les retries ; `callWithNotify` (toast + relance) à repositionner (callbacks globaux `onError` de la lib).
  - *Alternative intermédiaire possible* : cache léger dans `useFetch` (clé + TTL) sans nouvelle dépendance, si seul le cas « retour sur page visitée » est gênant.
- **Condition de déclenchement** : réévaluation par 👤/ARCos après exécution de T11, sur signal concret de besoin cache/dedup.
- **Tâche de suivi** : aucune tant que le statut reste `Proposée`. Si validé : ARCos formalise le passage à `Acceptée` et MAINa planifie T12 dans un nouveau lot du Plan d'Action 006.

---

## Références

- Plan d'Action associé : [`006_revue_architecture_react.plan.md`](../../.claude/plans/006_revue_architecture_react.plan.md) (item T12, et T11 pour l'alternative immédiate)
