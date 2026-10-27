# ADR 002 — Introduction (conditionnelle) de TanStack Query pour le data-fetching

---

**Date :** 2026-10-23 (proposée) · 2026-10-27 (décision 👤)
**Statut :** Rejetée — TanStack Query non retenu (décision 👤 du 2026-10-27)
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

**Décision 👤 du 2026-10-27 : nous avons décidé de ne pas introduire TanStack Query (T12 non retenu).** Le hook `useFetch` et les variantes Promise `fetch*` (T11) couvrent le besoin ; aucun besoin de cache/déduplication/retry n'est confirmé en usage réel, et une dépendance structurante est évitée. Statut : **Rejetée**.

*Position initiale (2026-10-23, conservée pour l'historique) : ne pas introduire TanStack Query immédiatement ; traiter d'abord T11 (hook `useFetch` custom, sans dépendance externe) et réévaluer seulement si un besoin concret de cache/déduplication/retry était confirmé (ex. re-fetch redondants entre les pages Budget/Recurrents/Analyses pour un même compte/période).*

---

## Alternatives Considérées

### Option 1 : Hook custom `useFetch` seul (T11) — ✅ Retenue

- **Avantages** : aucune nouvelle dépendance, migration mécanique des 7 composants, résout la duplication du triplet useState/useEffect/callback immédiatement, risque faible, effort M.
- **Inconvénients** : ne fournit ni cache, ni déduplication de requêtes concurrentes, ni retry automatique, ni invalidation croisée entre composants consommant la même donnée (ex. `selectedCompte`/`selectedDate` rechargés indépendamment dans Budget et Recurrents).

### Option 2 : TanStack Query (`@tanstack/react-query`)

- **Avantages** : cache par clé de requête, déduplication automatique des appels concurrents, retry configurable, invalidation fine, états loading/error/stale standardisés, bien outillé pour React 19.
- **Inconvénients** : nouvelle dépendance structurante touchant toute la couche data (7 extservices + `ClientHTTP.service.ts`) ; nécessite une migration progressive du pattern `then/catch/setState` existant vers `useQuery`/`useMutation` ; courbe d'apprentissage ; risque de régression sur la gestion actuelle du logout forcé en 403 (`ClientHTTP.service.ts:98-100`) si mal intégré avec les retries de la lib.
- **Raison du rejet** : le besoin de cache/dedup n'est pas confirmé par un symptôme observé (ex. re-fetch mesurés comme redondants) — introduire la lib serait une sur-ingénierie au regard de la taille de l'app (7 extservices, pas de data partagée massivement entre écrans hors `BudgetContext`) et ajouterait une dépendance structurante. *(Formulation initiale : « report » ; devenu rejet par décision 👤 du 2026-10-27.)*

### Option 3 : SWR

- **Avantages** : plus légère que TanStack Query, API simple, cache + revalidation.
- **Inconvénients** : écosystème plus restreint, moins de primitives pour mutations complexes (sauvegarde opération, validation budget) que TanStack Query `useMutation`.
- **Raison du rejet** : si une lib de cache devient nécessaire, TanStack Query offre une couverture plus complète (queries + mutations) adaptée aux besoins CRUD du projet (opérations, budgets), pour un coût d'adoption comparable.

---

## Conséquences

### Positives (`useFetch` seul)
- Pas de nouvelle dépendance, pas de risque de migration structurante.
- Duplication du triplet fetch résolue.

### Négatives / Compromis
- Le besoin de cache/dedup/retry reste non couvert ; réévaluation possible si un besoin de cache/déduplication apparaît (nouvel ADR ou révision de celui-ci, sur décision 👤).
- Si TanStack Query était introduit plus tard, la migration toucherait les 7 `*.extservices.ts` et potentiellement `ClientHTTP.service.ts` (adapter le wrapper fetch en `queryFn`/`mutationFn`).

### Neutres
- `ClientHTTP.service.ts` reste inchangé par cette décision (T13 — fix stack trace — est indépendant de T12).

---

## Mise en œuvre

- **Décision (2026-10-27)** : option 2 non retenue, aucun changement de code ni de dépendance ; `useFetch` + `fetch*` restent le pattern de lecture de données.
- **Fichiers impactés si Option 2 était retenue ultérieurement** : `package.json` (ajout dépendance), `ClientHTTP.service.ts`, les 7 fichiers `*.extservices.ts`, les 7 composants consommateurs (Budget, Recurrents, AnalysesFiltrePeriode, Infos, MainPage, ProfileInfos, CompteItem).
- **État d'avancement T11 (2026-10-25, lot 2)** : le hook `useFetch` (`src/main/hooks/useFetch.ts`) est désormais **adopté** par les 7 composants (`Budget`, `Recurrents`, `AnalysesFiltrePeriode`, `Infos`, `MainPage`, `ProfileInfos`, `CompteItem`), via les variantes Promise `fetch*` des extservices + `callWithNotify`. La réévaluation « après T11 » était donc possible ; 👤 a tranché le 2026-10-27 : **Rejetée**.
- **Éléments d'aide à la décision (sans recommandation)** :
  - *Acquis par `useFetch`* : suppression du triplet répété, états `loading`/`error`/`data`/`refetch` uniformes, annulation des réponses périmées (race conditions) lors d'un changement de dépendances.
  - *Toujours non couvert* : cache entre écrans/remontages, déduplication de requêtes concurrentes identiques, retry automatique, invalidation croisée, timeout/`AbortController` (le `fetch` en vol n'est pas annulé, seule sa réponse est ignorée).
  - *Signaux à observer pour confirmer le besoin* : rechargements redondants d'une même donnée (ex. catégories, comptes, solde par `CompteItem`) lors de la navigation entre Budget / Recurrents / Analyses pour un même compte/période ; lenteur ressentie au retour sur une page déjà visitée ; besoin d'invalidation après `saveOperation*`.
  - *Éléments de coût* : migration de 8 variantes `fetch*` et des mutations `callAndNotify` vers `useQuery`/`useMutation`, adaptation de `ClientHTTP.service.ts`, précaution sur le logout forcé en 403 avec les retries ; `callWithNotify` (toast + relance) à repositionner (callbacks globaux `onError` de la lib).
  - *Alternative intermédiaire possible* : cache léger dans `useFetch` (clé + TTL) sans nouvelle dépendance, si seul le cas « retour sur page visitée » est gênant.
- **Condition de réévaluation** : si un besoin concret de cache/déduplication apparaît (signaux ci-dessus), 👤/ARCos peuvent rouvrir la question via un nouvel ADR.
- **Tâche de suivi** : aucune (T12 non retenu).

---

## Références

- Plan d'Action associé : [`006_revue_architecture_react.plan.md`](../../.claude/plans/006_revue_architecture_react.plan.md) (item T12, et T11 pour l'alternative immédiate)
