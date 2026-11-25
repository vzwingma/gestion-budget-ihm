# Plan d'Action 012 — Correctif doublon de création d'opération (issue #759)

**Document :** `.claude/plans/012_correctif_doublon_creation_operation.plan.md`
**Date de création :** 2026-11-24
**Statut :** ✅ Complété (2026-11-24, Gate #4 validé)
**Objectif Prioritaire :** HIGH
**ADR associé :** aucun (correctif local, sans changement de contrat ni de pattern)

---

## 🎯 Objectif Global

Issue #759 : créer une opération « prévue », puis cliquer « réaliser » sans changer d'écran crée une 2e opération au lieu de mettre à jour la 1re.

**Cause racine :** le backend (`BudgetsResource.createOperation`) écrase l'id généré par l'IHM (`uuid()`) et renvoie le `BudgetMensuel` complet. L'IHM promeut son brouillon (id client, inconnu du backend) en `currentOperation`. « Réaliser » envoie alors un UPDATE sur un id inexistant → insertion d'une nouvelle ligne. Même défaut pour le virement intercompte (`saveOperationIntercompte`).

### Solution retenue (Gate #0)

**Option A** : IHM seule. Après création, identifier l'opération réelle (id backend) dans le budget retourné par diff d'ids avec le budget précédent ; repli (0 ou plusieurs candidats, correspondance par champs impossible) : fermer le détail + toast. Intercompte : même correctif. **Ticket serverless B** (backend respecte l'id client) à ouvrir séparément, hors plan.

---

## 🛠️ Phases

### Phase 1 — Implémentation — ⏳ Planifié
**Contexte :** `useOperationEditForm.onOperationUpdate` reçoit le budget retourné mais promeut `pendingDraft` tel quel.
**Critères de réussite :**
- ✅ Après création, `currentOperation.id` = id attribué par le backend
- ✅ Immutabilité respectée ; commit uniquement au succès
- ✅ `npm run lint` + tests existants verts

#### T1.1 - Créer la fonction pure `resolveCreatedOperation`
- **Agent :** 🔵 DEVon
- **Fichier(s) :** `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.controller.ts`
- **Implémenter :** `resolveCreatedOperation(budgetAvant, budgetMaj, draft)` → opération backend (clone) | `null`. 1 seul id nouveau → retenu ; plusieurs → correspondance libellé/montant/catégorie/date ; sinon `null`. Vérifier le format des opérations du budget retourné (préparation `prepareBudgetOperations`) avant résolution.
- **Acceptation :** fonction pure, sans mutation, typée.

#### T1.2 - Intégrer dans `onOperationUpdate` (création simple)
- **Agent :** 🔵 DEVon
- **Fichier(s) :** `…/detail/useOperationEditForm.ts` (+ commentaire dans `OperationDetailPage.extservices.ts` : id client écrasé par le backend)
- **Implémenter :** capturer les ids du budget courant avant l'appel ; remplacer `saved` par l'opération résolue dans `setEditOperation`, `setCurrentOperation`, propagation. Résultat `null` → fermer le détail + toast explicite.
- **Acceptation :** « réaliser » après création envoie `UPDATE /{budget}/operations/{idBackend}`.

#### T1.3 - Appliquer au virement intercompte
- **Agent :** 🔵 DEVon
- **Fichier(s) :** flux `saveOperationIntercompte` (extservices/hook associés)
- **Implémenter :** même résolution de l'opération source ; repli identique.
- **Acceptation :** pas de doublon après création intercompte puis modification.

### Phase 2 — Tests — ⏳ Planifié
#### T2.1 - Tests unitaires et non-régression
- **Agent :** 🟢 QALvin
- **Fichier(s) :** tests du controller et de `useOperationEditForm`
- **Couvrir :** 1 id nouveau ; 0 candidat ; plusieurs candidats (repli champs) ; budget `null`/liste vide ; flux non-création inchangé ; création puis « réaliser » = 1 UPDATE (id backend), 0 second CREATE ; échec sauvegarde = `currentOperation` inchangé ; intercompte.
- **Acceptation :** tests verts, couverture ≥ 80 % fichiers touchés.

### Phase 3 — Documentation — ⏳ Planifié
#### T3.1 - Documenter l'id attribué par le backend
- **Agent :** 🟣 DOCly
- **Fichier(s) :** `docs/ARCHITECTURE.md` (si section flux de sauvegarde), index plans
- **Acceptation :** note « id opération attribué par le backend, résolu côté IHM » ; ticket B référencé.

---

## 📊 Résumé par Agent

| Agent | Tâches | Livrable |
|---|---|---|
| 🔵 DEVon | T1.1 – T1.3 | Correctif code + preuves lint/tests |
| 🟢 QALvin | T2.1 | Tests + couverture |
| 🟣 DOCly | T3.1 | Doc synchronisée |

---

## 📍 Dépendances entre Phases

```
Phase 1 (code)  → Gate #2
    ↓
Phase 2 (tests) → Gate #3
    ↓
Phase 3 (docs)  → Gate #4
```

---

## ✅ Critères de Succès Globaux

1. Création « prévue » puis « réaliser » sans changer d'écran : 1 seule opération, statut réalisé.
2. 2e appel HTTP = UPDATE sur id backend, jamais CREATE.
3. Échec de sauvegarde : `currentOperation` inchangé.
4. Opération introuvable : détail fermé + toast, aucun doublon.
5. Intercompte couvert.
6. Lint + tests verts, couverture ≥ 80 %.

---

## 🚦 Journal des gates

| Gate | Date | Objet | Décision 👤 | Notes |
|---|---|---|---|---|
| #0 | 2026-11-24 | Choix de solution | ✅ GO | Option A puis ticket B ; intercompte = même correctif ; repli = fermer détail + toast |
| #1 | 2026-11-24 | Validation plan | ✅ GO | Plan validé, pas d'ADR |
| #2 | 2026-11-24 | Validation code | ✅ GO | lint 0 err, tsc OK, vitest 628/628, revue auto OK |
| #3 | 2026-11-24 | Validation tests | ✅ GO | vitest detail/ 393/393, couverture 100 %/98,4 %, lint 0 err, tsc OK |
| #4 | 2026-11-24 | Validation doc + clôture | ✅ GO | Plan clos ; ticket serverless B à ouvrir par 👤 |
