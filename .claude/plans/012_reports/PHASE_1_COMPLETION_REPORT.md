# Phase 1 : Implémentation

**Plan :** `.claude/plans/012_correctif_doublon_creation_operation.plan.md`
**Responsable Agent :** 🔵 DEVon
**Date Début :** 2026-11-24
**Date Fin :** 2026-11-24
**Statut :** 🔄 Code livré — preuves lint/tests NON exécutées (outil bash indisponible) ; validation 👤 en attente

---

## 📝 Tâches

### T1.1 - `resolveCreatedOperation`

**Statut :** ✅ DONE (code)

**Fichiers modifiés :**
- `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.controller.ts` — ajout `resolveCreatedOperation(budgetAvant, budgetMaj, draft)` + helpers privés `toDayKey`, `matchesDraft`.

**Notes :**
- Pure, sans mutation, retourne un clone (`cloneOperationModel`) ou `null`.
- 1 id nouveau → retenu ; plusieurs → correspondance unique libellé / |montant| / catégorie / sous-catégorie / jour de date ; sinon `null`. Budget `null` ou liste vide → `null`.
- Format : `prepareBudgetOperations` (Budget.component) = `updateOperationsStatus`, mute en place (`statuts`, retrait marqueur « en retard » du libellé). Le parent l'applique dans `onOperationChange(budgetMaj)` → la résolution est faite APRÈS cet appel pour cloner une opération déjà préparée. Dates comparées au jour via `new Date()` (Date/ISO/timestamp). Montant comparé en valeur absolue (signe selon typeOperation).

### T1.2 - Intégration `onOperationUpdate` (création simple)

**Statut :** ✅ DONE (code)

**Fichiers modifiés :**
- `.../detail/useOperationEditForm.ts` — ref `budgetBeforeCreation` renseignée via `onDraft` (création = `draft.id === "-1"` avant que `saveOperation` ne pose l'uuid) ; `onOperationUpdate` : `onOperationChange` d'abord, puis résolution ; opération résolue remplace `saved` dans `setEditOperation`/`setCurrentOperation`/`propagated`. `null` → `setCurrentOperation(null)` (détail fermé) + `toast.warn`. Flux non-création inchangé (brouillon promu). Commit uniquement au succès (callback de succès).
- `.../detail/OperationDetailPage.extservices.ts` — commentaire : id client uuid écrasé par le backend.

### T1.3 - Intercompte

**Statut :** ✅ DONE (code)

**Notes :** `saveOperationIntercompte` passe par le même `onOperationUpdate` (draft id `-1` → création) : même résolution/repli, aucun changement dans l'extservice. Hypothèse : le budget retourné est celui du compte source, avec 1 seule opération nouvelle.

---

## ⚠️ Preuves

- `npm run lint` : ❌ NON EXÉCUTÉ (aucun outil d'exécution shell disponible dans cette session).
- `npx vitest run src/main/Components/budgets` : ❌ NON EXÉCUTÉ.
- À lancer par MAINa/👤. Risque : tests existants de `useOperationEditForm` supposant l'ordre `setCurrentOperation` puis `onOperationChange`, ou la promotion du brouillon en création (à adapter par QALvin, phase 2).

## 📊 Synthèse de Phase

**Tâches complétées :** 3/3 (code), preuves en attente
**Critères de réussite :**
- ✅ Après création, `currentOperation.id` = id backend (par conception)
- ✅ Immutabilité, commit au succès
- ❌ Lint + tests verts — non vérifiés

**Bloqueurs :** pas d'exécution de commandes
**❓ Questions pour 👤 :** (1) Accepter toast `warn` au repli ? (2) Confirmer que le backend intercompte renvoie le budget source avec une seule nouvelle opération.
**Prochaine phase :** Phase 2 après validation 👤 (Gate #2)
