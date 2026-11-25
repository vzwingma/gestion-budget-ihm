# 📋 Plans d'Action (Action Plans)

Bienvenue dans le répertoire des Plans d'Action (AP) du projet `gestion-budget-ihm`.

Chaque plan orchestre une initiative multi-phases coordonnée entre plusieurs agents (DEVon 🔵, QALvin 🟢, ARCos 🟠, DOCly 🟣, MAINa ⚫) et produit des rapports de suivi documentant l'exécution.

---

## 📂 Plans Actifs / En Cours

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 010 | Gestion des erreurs HTTP et de la session (401/403 → déconnexion unique, `HttpError`, messages centralisés) | 🔵 **En cours** — Gate #2 2e passage ✅ ; T1.4 (tests) livré 2026-11-15, Gate #3 en attente 👤 | [`010_gestion_401_auth_oidc_backend.plan.md`](./010_gestion_401_auth_oidc_backend.plan.md) |

ADR associé (plan 010) : [`docs/adr/008-gestion-erreurs-http-et-session.md`](../../docs/adr/008-gestion-erreurs-http-et-session.md) (Acceptée le 2026-11-04)

---

## 📋 Plans Archivés / Complétés

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 001 | Migration CRA → Vite | ✅ Complété (validé QUA + PROD) | [`001_migration_cra_vers_vite.plan.md`](./001_migration_cra_vers_vite.plan.md) |
| 003 | Migration dépendances TypeScript/Vite (5 majors) | ✅ Lot clos (Phase 0/3/4/5/6 faites ; Phase 1/2 reportées — TS v7/typescript-eslint v9-10 bloqués npm) | [`003_migration_dependances_ts_vite.plan.md`](./003_migration_dependances_ts_vite.plan.md) |
| 004 | Remédiation SonarCloud (8 issues : S3776, S5145 x5, S6478 x2) | ✅ Complété (DEVon+QALvin, pushé `feat/qa_deploy`) | [`004_remediation_sonarcloud.plan.md`](./004_remediation_sonarcloud.plan.md) |
| 005 | Refonte panneau gauche écran Opérations (5 phases : correctifs, lisibilité lignes, repérage « À valider », filtre puces, en-tête) | ✅ Complété (5 phases, Gate #4 validé 👤 ; backlog B1 non planifié) | [`005_refonte_liste_operations.plan.md`](./005_refonte_liste_operations.plan.md) |
| 006 | Revue qualité/architecture React (mutualisation, état, perf, data-fetching, tests) | ✅ Clos (2026-10-27) — lots 1, 2, 3, 4a (sécurité `evaluateEquation`), 4b (Props co-localisées), 5 (finitions) et 6 (`useBudgetPageData`, T6, T20) livrés et mergés ; T12 non retenu (décision 👤, ADR 002 Rejetée) ; dette mineure résiduelle dans « Dette restante » du plan | [`006_revue_architecture_react.plan.md`](./006_revue_architecture_react.plan.md) |
| 007 | Migration déploiement S3 `reggionick/s3-deploy` → AWS CLI natif (warning Node 20 déprécié) | ✅ Complété | [`007_migration_s3_deploy_aws_cli.plan.md`](./007_migration_s3_deploy_aws_cli.plan.md) |
| 008 | Versioning IHM 27.0.0 + version horodatée DEV/QUA calculée en CI | ✅ Complété (3 phases, Gate #4 validé 👤) | [`008_versioning_ihm_ci.plan.md`](./008_versioning_ihm_ci.plan.md) |
| 011 | Impacts IHM de la Phase 1 backend (bandeau F3, filtre Analyses, codes métier, écrans d'erreur) | ✅ Clos (2026-11-20) — Phases 1, 2 et 3 livrées et mergées (PR #743, #749, #755) ; dette restante (2 items acceptés) dans le plan | [`011_impacts_ihm_phase1_backend.plan.md`](./011_impacts_ihm_phase1_backend.plan.md) |

| 012 | Correctif doublon de création d'opération (issue #759 : id backend écrasé → « réaliser » insère un doublon) | ✅ Clos (2026-11-24) — Gates #0–#4 ✅ ; code mergé (PR #766) ; B livré (serverless #238/#239) | [`012_correctif_doublon_creation_operation.plan.md`](./012_correctif_doublon_creation_operation.plan.md) |

ADR associé (001) : [`docs/adr/001-migration-cra-vers-vite.md`](../../docs/adr/001-migration-cra-vers-vite.md)
ADR associé (006) : [`docs/adr/002-tanstack-query-data-fetching.md`](../../docs/adr/002-tanstack-query-data-fetching.md) (Rejetée le 2026-10-27 — item T12 non retenu)
ADR associé (007) : [`docs/adr/007-migration-s3-deploy-aws-cli.md`](../../docs/adr/007-migration-s3-deploy-aws-cli.md)

---

## 📜 Plan historique (ancienne structure `.github/`)

> Non migré dans le cadre de cette initiative (Plan d'Action `005_migration_claude_sous_projets`). Conservé tel quel, en lecture seule, dans l'ancienne arborescence.

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 001 | Migration CRA → Vite | ✅ Complété | [`001_migration_cra_vers_vite.plan.md`](./001_migration_cra_vers_vite.plan.md) |
| 002 | Documentation Architecture | ✅ Complété | [`.github/plans/002_documentation_architecture.plan.md`](../../.github/plans/002_documentation_architecture.plan.md) |

ADR associé : [`docs/adr/001-migration-cra-vers-vite.md`](../../docs/adr/001-migration-cra-vers-vite.md)

Guide historique associé : [`.github/PLANS.md`](../../.github/PLANS.md).

---

## 🚀 Comment Créer un Nouveau Plan

1. **Créer le fichier plan** : `.claude/plans/<NO>_<nom>.plan.md`
   - Utiliser le numéro séquentiel suivant
   - Suivre le format défini dans [`.claude/PLANS.md`](../PLANS.md)

2. **Créer le dossier reporting** : `.claude/plans/<NO>_reports/`
   - Contiendra les rapports de phase complétées

3. **Soumettre pour validation** au 👤 Développeur humain

**Guide complet :** 📖 [`.claude/PLANS.md`](../PLANS.md)

---

## 📚 Documentation Associée

- **Guide complet des Plans d'Action** : [`.claude/PLANS.md`](../PLANS.md)
- **Instructions agent DEVon (🔵)** : [`.claude/agents/Devon.agent.md`](../agents/Devon.agent.md)
- **Instructions agent QALvin (🟢)** : [`.claude/agents/Qalvin.agent.md`](../agents/Qalvin.agent.md)
- **Instructions agent DOCly (🟣)** : [`.claude/agents/Docly.agent.md`](../agents/Docly.agent.md)
- **Instructions agent ARCos (🟠)** : [`.claude/agents/Arcos.agent.md`](../agents/Arcos.agent.md)
- **Instructions agent MAINa (⚫)** : [`.claude/agents/Maina.agent.md`](../agents/Maina.agent.md)
- **Instructions Claude globales** : [`.claude/CLAUDE.md`](../CLAUDE.md)

---

## ✅ Checklist pour un Plan Bien Structuré

Avant de créer un nouveau plan, vérifier :

- [ ] Titre explicite et objectif global clair
- [ ] Phases bien séparées (3-6 phases généralement)
- [ ] Chaque phase a contexte, critères de réussite, tâches
- [ ] Chaque tâche est numérotée T<N>.<M> avec :
  - [ ] Verbe d'action + objet
  - [ ] Fichiers précis
  - [ ] Scope explicite
  - [ ] Critères d'acceptation mesurables
  - [ ] Agent assigné
- [ ] Dépendances explicites et diagramme
- [ ] Critères de succès globaux (5-7 items)
- [ ] Plan d'exécution avec triggers

---

## 🤝 Contribution aux Plans

Pour contribuer ou modifier un plan existant :

1. **Ne pas modifier le fichier plan après son lancement** — créer un nouveau plan pour les changements majeurs
2. **Documenter dans le rapport** : Tout changement de scope ou nouvelle tâche découverte
3. **Notifier l'équipe** : Si un bloqueur ou risque est identifié
4. **Mettre à jour ce README** : Refléter le statut actuel des phases

---

**Dernière mise à jour :** 2026-11-25 (plans 006 et 012 déplacés vers « Archivés / Complétés » ; seul le plan 010 reste actif)
**Gestionnaire des Plans :** ARCos (🟠) & 👤 Développeur humain