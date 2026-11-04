# Plan d'Action 009 — IHM : impacts des changements de comportement du backend (plan serverless 004, Phase 1)

**Date création :** 2026-10-29 · **Mise à jour :** 2026-11-04 (Gate #0 GO, cadrage ARCos)
**Statut :** ⏳ Planifié — Gate #0 GO ; **démarre après le merge du plan 008** (dépend du socle `HttpError`)
**Porteur :** ⚫ MAINa
**Origine :** plan serverless `004_revue_architecture_backend`, tâche T1.5. Décisions 👤 aux Gates #1 et #2 de la Phase 1 (2026-10-26 / 2026-10-29) et au Gate #0 IHM (2026-11-04).
**Branche (proposée) :** `feat/ihm-009-impacts-backend` depuis `origin/master`, **après le merge du plan 008**
**Ordre PROD :** la **Phase 1 (F3 + Analyses)** passe **avant** la PROD backend. La Phase 2 (erreurs) peut suivre.

---

## Objectif global

La Phase 1 du plan serverless 004 modifie des comportements et des codes HTTP visibles par l'IHM. Le contrat d'API (chemins, DTO) ne change pas. Tout le backend est mergé et déployé en QUA (PR serverless #224, #225, #226).

| # | Cas | Avant | Après (backend, en QUA) | Effet IHM aujourd'hui (ARCos, 2026-11-04) | Action IHM |
|---|---|---|---|---|---|
| I1 | **Compte inactif**, budget du mois M absent (F3) | 404 | **200** + **dernier budget ≤ M**, `actif=false` | En-tête « mois M », mais opérations du mois M'. « Réouvrir » rouvrirait le vieux budget. **Trompeur.** L'id utilisé pour les écritures est déjà le bon (id reçu) | Bandeau C2 + masquer « Réouvrir » |
| I1-bis | **Analyses** sur un compte inactif / des mois sans budget | — | idem F3 | `Analyses.controller.ts:32-63` agrège chaque mois demandé. Le dernier budget revient pour chaque mois → **opérations dupliquées, totaux faux**. **Régression** | Écarter les budgets dont (annee, mois) ≠ mois demandé |
| I2 | Compte actif **neuf** (F4) | timeout | **200** budget vierge | OK | Test de non-régression |
| I2b | Écart > 24 mois (F4) | timeout | **200**, solde repris | OK | Test |
| I2c | Lecture de budget en **erreur Mongo** | 404 | **503** (absence → 404) | `useBudgetPageData.ts:58` ignore l'`error`. Le Backdrop (`BudgetPageShell.component.tsx:56-60`) reste affiché : **écran bloqué** (à confirmer en QUA) | État d'erreur + « Réessayer », message 503 ≠ 404 |
| I2c bis | `/soldes`, `/intervalles` en erreur Mongo / autre | 404 | **503** / **500** (absence → 200 + `[]`) | `/soldes` : **spinner infini** dans le menu (`CompteItem.component.tsx:44,53`). `/intervalles` : toast, sans borne | `CompteItem` : état « indisponible » |
| I2d | Erreur sur M-1 à l'affichage de M | — | **200**, M servi avec le solde stocké | OK | Aucune |
| I3 | Virement vers un **compte clos** | accepté | **406** | Message générique (l'UI filtre déjà les cibles inactives, donc le cas ne survient qu'avec une liste périmée) | « Le compte destinataire est clos » |
| I4 | Virement **vers le même compte** | accepté | **400** | idem | « Virement vers le même compte impossible » |
| I5 | Virement vers un **compte destination inconnu** | 500 | **404** | idem | « Compte destinataire introuvable » |
| I6 | Dernier accès d'un **utilisateur inconnu** | 500 | **404** | Erreur avalée (`ProfileInfos.component.tsx:11`) : OK | Aucune (test optionnel) |
| — | Erreur Mongo sur le virement (M-1 destination) | — | **503** | Message générique | « Service momentanément indisponible, réessayez » (socle 008) |

### Décisions 👤 (Gate #0, 2026-11-04)
- **C2 :** le mois demandé reste affiché, avec un bandeau **« Compte inactif — dernier budget disponible : MM/AAAA »** quand le budget reçu ne correspond pas au mois demandé. On ne recale pas la date sélectionnée (option C1 rejetée : `selectedDate` est global et la navigation se bloquerait).
- **Masquer « Réouvrir »** sur un compte inactif.
- **Filtre Analyses (I1-bis).**
- **Messages** (B1, via `messagesParStatut` du plan 008) : 406 « Le compte destinataire est clos », 400 « Virement vers le même compte impossible », 404 « Compte destinataire introuvable », 503 « Service momentanément indisponible, réessayez ».
- **Solde du compte inactif dans le menu** (`/soldes` du mois M vide, alors que le panneau principal affiche le solde du dernier budget) : **à aligner si c'est simple**, sinon accepté et documenté. Décision prise en T1.2.

---

## Phase 1 — F3 et Analyses (avant la PROD backend)

### Critères de réussite
- Un budget reçu d'un autre mois est **détecté**, et le bandeau C2 s'affiche dans Budget et Récurrents.
- « Réouvrir » est masqué sur un compte inactif.
- Analyses : aucune opération en double ; les budgets hors mois demandé sont écartés.
- Comportement **inerte** sur l'ancien backend : aucun bandeau quand le mois reçu égale le mois demandé.
- lint, typecheck, build et `test:coverage` verts ; couverture ≥ 80 % sur les fichiers modifiés.

### Tâches
#### T1.1 — Modèle et utilitaire (DEVon)
- **Fichier(s) :** `src/main/Models/budgets/BudgetMensuel.model.ts` (ajout de `mois`, `annee`) ; utilitaire `estBudgetDuMois(budget, date)` dans `Utils/`.
- **Implémenter :** comparer (annee, mois) au mois demandé, avec **repli** sur le suffixe de l'id `_AAAA_MM`.
- **À vérifier en QUA :** la sérialisation de `Month` côté backend (`"MARCH"` ou numéro). L'utilitaire doit gérer les deux formes.

#### T1.2 — Bandeau et « Réouvrir » (DEVon)
- **Fichier(s) :** `Components/budgets/shared/CompteTitre.component.tsx` (couvre Budget et Récurrents) ; `BudgetActionsButtonGroup.component.tsx` (« Réouvrir » masqué si `selectedCompte.actif === false`) ; `CompteItem` (alignement du solde du compte inactif, si c'est simple).
- **Acceptation :** bandeau MUI conforme aux conventions ; libellé exact « Compte inactif — dernier budget disponible : MM/AAAA ».

#### T1.3 — Analyses (DEVon)
- **Fichier(s) :** `Components/analyses/Analyses.controller.ts`.
- **Implémenter :** ignorer tout budget dont (annee, mois) ≠ mois de la boucle.

#### T1.4 — Tests (QALvin)
- Utilitaire (champs, repli id, deux formes de `Month`) ; `CompteTitre` (bandeau présent ou absent) ; « Réouvrir » masqué ; `Analyses.controller.test.ts` (pas de doublon) ; non-régression I2/I2b (budget vierge, solde repris).

---

## Phase 2 — Erreurs (après la Phase 1, peut suivre la PROD backend)

### Critères de réussite
- Une erreur de budget (404/503) **ne bloque plus l'écran** : Backdrop fermé, état d'erreur et bouton « Réessayer ».
- Le message du 503 diffère de celui du 404.
- Le menu affiche « indisponible » au lieu d'un spinner infini sur une erreur `/soldes`.
- Le virement affiche les messages dédiés pour 406, 400, 404 et 503, sans déconnexion, et le brouillon est conservé.

### Tâches
#### T2.1 — Page budget (DEVon)
- **Fichier(s) :** `hooks/useBudgetPageData.ts` (exposer `error` et `refetch`), `Budget.component.tsx`, `BudgetPageShell.component.tsx`, `Budget.extservices.ts`, `Analyses.extservices.ts`.

#### T2.2 — Menu des comptes (DEVon)
- **Fichier(s) :** `CompteItem.component.tsx` : état « indisponible ».

#### T2.3 — Virement (DEVon)
- **Fichier(s) :** `OperationDetailPage.extservices.ts` : `messagesParStatut` (406, 400, 404, 503).

#### T2.4 — Tests (QALvin)
- `useBudgetPageData.test.tsx`, `CompteItem.component.test.tsx`, `OperationDetailPage.extservices.test.ts` (406, 400, 404, 503 : message dédié, pas de déconnexion, brouillon conservé).

---

## Phase 3 — Documentation (DOCly)
- `docs/ARCHITECTURE.md` : table statut HTTP → message, bandeau F3, filtre Analyses ; wiki IHM `Historique-de-l'Architecture.md`. Pas d'ADR : C2 est une décision d'interface locale.

---

## Dépendances
```
Plan 008 mergé → Gate #1 (009) → Phase 1 → Gates #2/#3 → [PROD IHM] → PROD backend
                                        → Phase 2 → Gates #2/#3 → Phase 3 → Gate #4
```

## Critères de succès globaux
1. Aucun budget affiché comme s'il était du mois demandé alors qu'il est d'un autre mois (bandeau).
2. Analyses justes avec F3 (pas de doublons).
3. Plus d'écran bloqué ni de spinner infini sur une erreur backend.
4. Messages métier du virement corrects.
5. Tests verts, couverture ≥ 80 %, SonarCloud OK.

---

## 🚦 Journal des gates

| Gate | Date | Objet | Décision | Notes |
|---|---|---|---|---|
| — | 2026-10-29 | Création (T1.5 du plan serverless 004) | ℹ️ | Plan créé, non commité |
| #0 | 2026-11-04 | Choix de solution (cadrage ARCos) | ✅ GO | C2 bandeau + « Réouvrir » masqué + filtre Analyses (I1-bis) ; libellés virement / 503 ; alignement du solde du menu si simple ; Phase 1 avant la PROD backend |
| #1 | — | Validation du plan | ⏳ Après le merge du plan 008 | |
