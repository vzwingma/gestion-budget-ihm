# 📋 Plans d'Action (Action Plans)

Bienvenue dans le répertoire des Plans d'Action (AP) du projet `gestion-budget-ihm`.

Chaque plan orchestre une initiative multi-phases coordonnée entre plusieurs agents (DEVon 🔵, QALvin 🟢, ARCos 🟠, DOCly 🟣, MAINa ⚫) et produit des rapports de suivi documentant l'exécution.

---

## 📂 Plans Actifs / En Cours

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 001 | Migration CRA → Vite | 🟡 Phases 1-5+8 complétées, 6-7 (déploiement QUA/PROD) en attente d'action humaine | [`001_migration_cra_vers_vite.plan.md`](./001_migration_cra_vers_vite.plan.md) |

ADR associé : [`docs/adr/001-migration-cra-vers-vite.md`](../../docs/adr/001-migration-cra-vers-vite.md)

---

## 📋 Plans Archivés / Complétés

_(Aucun plan complété pour l'instant dans `.claude/plans/`)_

---

## 📜 Plan historique (ancienne structure `.github/`)

> Non migré dans le cadre de cette initiative (Plan d'Action `005_migration_claude_sous_projets`). Conservé tel quel, en lecture seule, dans l'ancienne arborescence.

| # | Plan | Statut | Emplacement |
|---|---|---|---|
| 002 | Documentation Architecture | ✅ Complété | [`.github/plans/002_documentation_architecture.plan.md`](../../.github/plans/002_documentation_architecture.plan.md) |

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

**Dernière mise à jour :** 2026-07-06
**Gestionnaire des Plans :** ARCos (🟠) & 👤 Développeur humain
