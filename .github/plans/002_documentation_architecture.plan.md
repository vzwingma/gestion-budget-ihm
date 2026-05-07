# Plan d'Action : Créer la documentation Architecture

**Document :** `.github/plans/002_documentation_architecture.plan.md`  
**Date de création :** 2026-05-07  
**Statut :** ✅ Complété  
**Objectif Prioritaire :** MEDIUM

---

## 🎯 Objectif Global

Le projet `gestion-budget-ihm` ne dispose d'aucune documentation d'architecture formelle dans le répertoire `docs/`. Un template est disponible (`docs/ARCHITECTURE.template.md`) mais n'a jamais été instancié.

L'objectif est de créer `docs/ARCHITECTURE.md` en remplaçant tous les placeholders du template par les données réelles du projet, afin de disposer d'un document de référence architecture à jour, cohérent avec le codebase et les instructions Copilot.

---

## 📋 Phase 1 — Création de docs/ARCHITECTURE.md

### Contexte
- `docs/ARCHITECTURE.template.md` existe et définit la structure attendue
- `docs/ARCHITECTURE.md` n'existe pas encore
- Toutes les données nécessaires sont disponibles dans le codebase (`package.json`, `copilot-instructions.md`, `.env.model`, workflows CI/CD)
- Aucune dépendance sur d'autres phases

### Critères de Réussite
✅ `docs/ARCHITECTURE.md` est créé et versionné  
✅ Aucun placeholder `[...]` ni mention `⚠️ À COMPLÉTER` dans le fichier final  
✅ Toutes les sections du template sont remplies avec des données réelles  
✅ Le fichier est cohérent avec `.github/copilot-instructions.md`  
✅ Les versions de stack (React 19.1, MUI 9, etc.) sont exactes et à jour

### Tâches (Agent : Docly 🟣 DOC)

#### T1.1 - Créer docs/ARCHITECTURE.md à partir du template

- **Fichier :** `docs/ARCHITECTURE.md` (à créer)
- **Source :** `docs/ARCHITECTURE.template.md`
- **Implémenter :**
  - Section Vue d'ensemble : React 19.1 + TypeScript, frontend web, langue FR, statut En développement
  - Section Architecture Globale : 4 couches (Components / Models / Services / Utils) + flux de données
  - Section Structure des dossiers : arborescence réelle de `src/main/` + `docs/` + `public/`
  - Section Stack Technique : toutes les dépendances avec versions exactes issues de `package.json`
  - Section Variables d'environnement : 10 variables issues de `.env.model`
  - Section Intégrations Externes : 4 µServices AWS Lambda + Google OAuth2
  - Section Sécurité : Google OAuth2, Bearer token, X-Api-Key header
  - Section Tests : Jest + RTL, `npm run test:coverage`, `coverage/lcov.info`, cible ≥80%
  - Section Conventions : FC<Props>, ClientHTTP.service.ts, BudgetContext, patterns composants
  - Section ADR : tableau vide (aucun ADR formalisé)
  - Section Performance : useMemo, useCallback, css-minify
  - Section Déploiement : GitHub Actions → S3 QUA (master) + S3 PROD (tags)
  - Section Historique : entrée `v24.0-SNAPSHOT` (version courante)
  - Supprimer la note template en tête de fichier
- **Acceptation :**
  - ✓ Aucun placeholder `[...]` restant
  - ✓ Aucune section `⚠️ À COMPLÉTER` restante
  - ✓ Versions de stack conformes à `package.json`

---

## 📊 Résumé des Tâches par Agent

### Docly (🟣 DOC) Agent
- T1.1 : Créer `docs/ARCHITECTURE.md`
- **Livrable :** Fichier `docs/ARCHITECTURE.md` complet, sans placeholder
- **Complexité :** Faible (instanciation d'un template)

---

## 📍 Dépendances entre Phases

```
Phase 1 (Créer ARCHITECTURE.md) — aucune dépendance, démarrage immédiat
```

---

## ✅ Critères de Succès Globaux

1. **`docs/ARCHITECTURE.md` existe** dans le dépôt
2. **Aucun placeholder** `[...]` dans le fichier
3. **Versions à jour** : React 19.1, MUI 9, react-router-dom 7, recharts 3
4. **Cohérence** avec `.github/copilot-instructions.md`
5. **Déploiement documenté** : environnements QUA et PROD avec triggers corrects

---

## 🚀 Plan d'Exécution

1. **Phase 1 :** Lancer Docly (🟣 DOC) — création de `docs/ARCHITECTURE.md`

**Trigger pour clore le plan :**
- `docs/ARCHITECTURE.md` présent et validé par le 👤 Développeur humain
- Rapport de phase complété : `.github/plans/002_reports/PHASE_1_COMPLETION_REPORT.md`
