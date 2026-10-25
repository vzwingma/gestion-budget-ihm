# 📋 Plans d'Action (Action Plans)

Bienvenue dans le répertoire des Plans d'Action (AP) du projet `gestion-budget-ihm`.

Chaque plan orchestre une initiative multi-phases coordonnée entre plusieurs agents (DEVon 🔵, QALvin 🟢, ARCos 🟠, DOCly 🟣, MAINa ⚫) et produit des rapports de suivi documentant l'exécution.

---

## 📂 Plans Actifs / En Cours

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 005 | Refonte panneau gauche écran Opérations (5 phases : correctifs, lisibilité lignes, repérage « À valider », filtre puces, en-tête) | 🟡 En cours — Phases 1–4/5 terminées, 5 à venir | [`005_refonte_liste_operations.plan.md`](./005_refonte_liste_operations.plan.md) |
| 006 | Revue qualité/architecture React (mutualisation, état, perf, data-fetching, tests) | ✅ Lot 1 livré (Gate #4 validé 👤) · 🟡 Lot 2 livré (T11 adoption, T6, T2 partiel), Gate #4 validé 👤 — reste : découpage `OperationDetailPage`, T16, T20, T12 | [`006_revue_architecture_react.plan.md`](./006_revue_architecture_react.plan.md) |

ADR associé (plan 006) : [`docs/adr/002-tanstack-query-data-fetching.md`](../../docs/adr/002-tanstack-query-data-fetching.md) (Proposée — item T12 uniquement)

---

## 📋 Plans Archivés / Complétés

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 001 | Migration CRA → Vite | ✅ Complété (validé QUA + PROD) | [`001_migration_cra_vers_vite.plan.md`](./001_migration_cra_vers_vite.plan.md) |
| 003 | Migration dépendances TypeScript/Vite (5 majors) | ✅ Lot clos (Phase 0/3/4/5/6 faites ; Phase 1/2 reportées — TS v7/typescript-eslint v9-10 bloqués npm) | [`003_migration_dependances_ts_vite.plan.md`](./003_migration_dependances_ts_vite.plan.md) |
| 004 | Remédiation SonarCloud (8 issues : S3776, S5145 x5, S6478 x2) | ✅ Complété (DEVon+QALvin, pushé `feat/qa_deploy`) | [`004_remediation_sonarcloud.plan.md`](./004_remediation_sonarcloud.plan.md) |
| 007 | Migration déploiement S3 `reggionick/s3-deploy` → AWS CLI natif (warning Node 20 déprécié) | ✅ Complété | [`007_migration_s3_deploy_aws_cli.plan.md`](./007_migration_s3_deploy_aws_cli.plan.md) |

ADR associé (001) : [`docs/adr/001-migration-cra-vers-vite.md`](../../docs/adr/001-migration-cra-vers-vite.md)
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

**Dernière mise à jour :** 2026-10-25 (plan 005 : Phases 1–4/5 terminées ; plan 006 : lots 1 et 2 livrés, Gate #4 validé)
**Gestionnaire des Plans :** ARCos (🟠) & 👤 Développeur humain