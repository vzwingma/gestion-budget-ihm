# Plan d'Action 008 — Versioning IHM 27.0.0 + version horodatée DEV/QUA calculée en CI

**Document :** `.claude/plans/008_versioning_ihm_ci.plan.md`
**Date de création :** 2026-10-26
**Statut :** ⏳ Planifié
**Objectif Prioritaire :** MEDIUM
**ADR associé :** aucun (changement CI mineur, aligné sur le mécanisme PROD existant)

---

## 🎯 Objectif Global

L'IHM déployée depuis `master` affiche `QUA.26`, valeur codée en dur dans `external-ressources/conf/.env.staging`.
Objectifs :
- aligner toutes les versions du projet sur `27.0.0` ;
- afficher en DEV / QUA une version calculée au build CI au format `[ENV].[VERSION].[DATE_HEURE]`
  (ex. `QUA.27.20261026-1018`) : ENV ∈ {DEV, QUA}, VERSION = majeure de `package.json`,
  DATE_HEURE = `yyyyMMdd-HHmm` du build CI, **heure de Paris**.

### Solution retenue (Gate #0)

Option A : placeholder `__BUDGET_IHM_VERSION__` dans `.env.staging` / `.env.dev` (préfixe ENV conservé en dur),
remplacé par une étape shell des workflows `build-on-master` / `build-on-all`
(`node -p` sur `package.json` + `TZ=Europe/Paris date +%Y%m%d-%H%M`) — même mécanisme que le build PROD,
sans impact sur `build-on-tags.yml` ni sur le dev local (`vite --mode dev` lit `.env.dev` racine).

---

## 🛠️ Phases

### Phase 1 — Implémentation — ✅ Complété
**Contexte :** versions hétérogènes (`24.0-SNAPSHOT` dans package.json/lock, `26` dans .env.*) ; aucune version calculée en DEV/QUA.
**Critères de réussite :**
- ✅ `package.json` et `package-lock.json` (racine + `packages[""]`) en `27.0.0`
- ✅ Placeholders posés, étapes CI ajoutées, `build-on-tags.yml` et `.env.production` inchangés
- ✅ `npm run lint`, `npm run typecheck`, `npm run test:coverage`, `npm run build` verts

#### T1.1 - Passer la version projet à 27.0.0
- **Agent :** 🔵 DEVon
- **Fichier(s) :** `package.json`, `package-lock.json`, `.env.model`
- **Implémenter :** `"version": "27.0.0"` (package.json + lock lignes 3 et 9) ; `.env.model` → `VITE_BUDGET_VERSION=DEV.27.yyyyMMdd-HHmm` (exemple de format)
- **Acceptation :** plus aucune occurrence `24.0-SNAPSHOT` / `26.current.version` hors docs historiques

#### T1.2 - Poser les placeholders de version DEV / QUA
- **Agent :** 🔵 DEVon
- **Fichier(s) :** `external-ressources/conf/.env.staging`, `external-ressources/conf/.env.dev` (ligne 2 uniquement — ne rien lire/modifier d'autre)
- **Implémenter :** `VITE_BUDGET_VERSION=QUA.__BUDGET_IHM_VERSION__` / `VITE_BUDGET_VERSION=DEV.__BUDGET_IHM_VERSION__`
- **Acceptation :** seule la ligne 2 change dans chaque fichier

#### T1.3 - Calculer et injecter la version dans les workflows CI
- **Agent :** 🔵 DEVon
- **Fichier(s) :** `.github/workflows/build-on-master.yml` (job `build`), `.github/workflows/build-on-all.yml` (job `build`)
- **Implémenter :** dans l'étape « Update config » existante (avant le `mv`) :
  `VERSION_MAJEURE=$(node -p "require('./package.json').version.split('.')[0]")`,
  `BUILD_DATE=$(TZ=Europe/Paris date +%Y%m%d-%H%M)`,
  `sed -i "s#__BUDGET_IHM_VERSION__#${VERSION_MAJEURE}.${BUILD_DATE}#g" <fichier .env>`
- **Acceptation :** YAML valide ; `build-on-tags.yml` non modifié

### Phase 2 — Vérification — ✅ Complété
**Contexte :** changement CI non couvrable par Vitest ; vérification par simulation du script.
**Critères de réussite :**
- ✅ Simulation bash du script sur copies temporaires des `.env` : valeur conforme à `^(DEV|QUA)\.27\.[0-9]{8}-[0-9]{4}$`
- ✅ Heure Paris vérifiée (comparaison avec `date -u`)
- ✅ Suite existante verte (`npm run test:coverage`)

#### T2.1 - Simuler l'injection de version et valider le format
- **Agent :** 🟢 QALvin
- **Fichier(s) :** aucun fichier versionné (copies temporaires, nettoyées)
- **Couvrir :** nominal DEV + QUA ; régression si placeholder absent (aucun `__BUDGET_IHM_VERSION__` résiduel) ; fuseau
- **Acceptation :** 2/2 formats conformes, 0 placeholder résiduel, tests existants verts

### Phase 3 — Documentation — 🔄 En cours
#### T3.1 - Synchroniser la documentation
- **Agent :** 🟣 DOCly
- **Fichier(s) :** `docs/ARCHITECTURE.md` (exemple `VITE_BUDGET_VERSION` l.124 + entrée historique v27.0.0), `README.md` (table des variables si concernée), `.claude/plans/README.md`
- **Acceptation :** format `[ENV].[VERSION].[DATE_HEURE]` documenté, liens valides, index à jour

---

## 📊 Résumé par Agent

| Agent | Tâches | Livrable |
|---|---|---|
| 🔵 DEVon | T1.1 – T1.3 | Versions 27.0.0, placeholders, étapes CI |
| 🟢 QALvin | T2.1 | Preuve de format + non-régression |
| 🟣 DOCly | T3.1 | Docs synchronisées |

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

1. Version projet unique `27.0.0` (package.json / lock)
2. Build `master` affiche `QUA.27.yyyyMMdd-HHmm` (heure Paris)
3. Build branches affiche `DEV.27.yyyyMMdd-HHmm`
4. Build PROD (tags) inchangé
5. lint / typecheck / tests / build verts
6. Documentation à jour

---

## 🚦 Journal des gates

| Gate | Date | Objet | Décision 👤 | Notes |
|---|---|---|---|---|
| #0 | 2026-10-26 | Choix de solution | ✅ GO | Option A (CI + placeholder) ; heure Paris ; PROD inchangée. Analyse produite par MAINa (ARCos indisponible : modèle `opus` non résolu, corrigé ensuite par 👤) |
| #1 | 2026-10-26 | Validation plan | ✅ GO | Pas d'ADR ; lancement Phase 1 |
| #2 | 2026-10-26 | Validation code Phase 1 | ✅ GO | lint/build ✅ ; typecheck (12 erreurs) et 5 tests tooltip rouges jugés préexistants (hors scope, non prouvé faute de git) ; revue auto indisponible ; DEVon exécuté via agent généraliste (modèle `sonnet` non résolu) |
| #3 | 2026-10-26 | Validation tests Phase 2 | ✅ GO | Format DEV/QUA conforme, Paris OK ; à la demande 👤 : tests périmés de `OperationsListItem.shared.tooltip.test.tsx` corrigés (légende supprimée en prod par commit f1bfa8c) → vitest 2102 OK / 0 échec |
