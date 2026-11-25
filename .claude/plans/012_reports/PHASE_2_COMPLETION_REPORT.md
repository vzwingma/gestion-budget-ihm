# Phase 2 : Tests

**Plan :** `.claude/plans/012_correctif_doublon_creation_operation.plan.md`
**Responsable Agent :** 🟢 QALvin
**Date :** 2026-11-24
**Statut :** 🔄 Tests écrits — NON EXÉCUTÉS (outil bash indisponible) ; Gate #3 impossible sans exécution

---

## 📝 Tâches

### T2.1 - Tests unitaires et non-régression

**Statut :** 🔄 Écrit, non vérifié

**Fichiers (tests uniquement, code de production inchangé) :**
- `src/main/Components/budgets/operations/courantes/detail/OperationDetailPage.controller.resolve.test.ts` (NOUVEAU, 16 cas avec `test.each` = 18 exécutions) — `resolveCreatedOperation` :
  1 seul id nouveau (champs divergents tolérés) ; copie sans mutation ; plusieurs candidats → correspondance unique (libellé, |montant|, catégorie, sous-catégorie, jour de date ; ISO ; heure ignorée) ; 0 candidat ; ambigu (doublons) ; aucune correspondance → `null` ; budget retourné `null`/`undefined` ; liste vide/absente ; budget précédent `null`/sans liste.
- `.../detail/useOperationEditForm.test.tsx` (MODIFIÉ : imports `toast`, `saveOperationIntercompte`, `BUSINESS_GUID`, `vi.mock('react-toastify')` ; nouveau `describe` « création : promotion de l'opération backend », 11 cas) :
  promotion id backend (copie de travail + contexte) ; `onOperationChange` avant résolution ; plusieurs candidats ; création puis « réaliser » = 2 appels `[-1, idBackend]`, 1 seul CREATE, UPDATE avec id backend et état réalisé ; repli 0 candidat (détail fermé + `toast.warn` + parent notifié) ; repli ambigu ; sélection après repli ; échec sauvegarde = `currentOperation` inchangé (id `-1`, pas de toast) ; flux non-création inchangé (id `op-1`, pas de toast) ; intercompte nominal + repli.
- Tests existants de `useOperationEditForm` : aucun changement nécessaire détecté par lecture (ils utilisent des opérations non-création → brouillon promu ; `onOperationChange` toujours vérifié via `toHaveBeenCalledWith`). À confirmer à l'exécution.

## ⚠️ Preuves — NON FOURNIES

Aucun outil d'exécution shell disponible dans cette session (comme en phase 1). Rien n'a été lancé :
- `npx vitest run src/main/Components/budgets/operations/courantes/detail/ --coverage …` : ❌ NON EXÉCUTÉ
- Couverture `OperationDetailPage.controller.ts` / `useOperationEditForm.ts` ≥ 80 % : ❌ NON MESURÉE (par lecture : toutes les branches de `resolveCreatedOperation` et de `onOperationUpdate` sont ciblées)
- `npm run lint` : ❌ NON EXÉCUTÉ
- Détection de régression : ❌ NON DÉMONTRÉE. À faire : dans `onOperationUpdate`, remplacer `saved = resolveCreatedOperation(...)` par `saved = draft` → doit faire échouer « id backend », « réaliser » (idsAppel) et « repli » ; puis rétablir.
- Tests ignorés/désactivés : aucun.

## Risques (vérifiés par lecture seulement)
1. Helper `preparerCreation` : suppose qu'une création valide s'obtient avec LIBELLE + VALUE + CATEGORIE `ss-resto` (+ INTERCOMPTES `compte-2`) sans date ni autre champ ; si `validateFormDateFinPeriode` / `validateFormTransfertIntercompte` exigent autre chose, `validate` ne sauvegardera pas → `callbackSucces` indéfini (échec des tests de création). Ajuster alors le helper.
2. Test « réaliser » : `setEtatInCreation(date, REALISEE)` appliqué à une copie d'opération existante (hors mode création) ; si `validateForm` exige autre chose, ajuster.
3. Typage `vi.mocked(saveOperation).mockImplementation` / `callbackSucces` : lint/tsc à vérifier.
4. Test « ordre onOperationChange » : faible (ne prouve pas l'ordre relatif avec `setCurrentOperation`) ; l'ordre est couvert indirectement (ops préparées avant clone). Peut être retiré.

## 📊 Synthèse de Phase

**Tâches :** 1/1 écrite, 0/1 vérifiée
**Critères :** ✅ cas requis couverts par écriture ; ❌ tests verts, couverture, lint, régression — non vérifiés
**Bloqueurs :** pas d'exécution de commandes
**❓ Questions pour 👤 :** exécuter les commandes ci-dessus (ou autoriser un agent avec shell) et renvoyer la sortie ; suppression du test « ordre » acceptable ?
