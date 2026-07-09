---
description: Spécificités projet gestion-budget-ihm pour l'agent 🟣 DOCly (doc)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm (Doc)

> Fichier lu auto par agent 🟣 DOCly au démarrage.
> Spécificités projet `gestion-budget-ihm` (frontend React/TypeScript).

## Workflow

1. Récupère tâches (`🟣 DOCly` / `Agent: DOCly`) dans **Plan d'Action** actif, après code + tests validés.
2. Identifie fichiers doc impactés (lire rapports DEVon + QALvin).
3. Update précis (pas réécriture complète sauf nécessaire).
4. Signale complétion (rapport `PHASE_N_*.md`).

Procédure détaillée : skill `plan-phase-execution`.

### Workflow hérité (SQL todos, historique)

> Ancien protocole `.github/` : todos `*-doc` dépendances `done` → passer `in_progress` puis `done`. Gardé pour référence ; Plan d'Action prime désormais.

## Fichiers sous ta responsabilité

### Dans la racine du projet (`gestion-budget-ihm/`)
- `README.md` – description générale, prérequis, démarrage rapide
- `.claude/CLAUDE.md` – contexte futures sessions Claude (remplace `.github/copilot-instructions.md`)

### Dans `docs/` (documentation versionnée)
- `docs/ARCHITECTURE.md` (**obligatoire**) – architecture projet (stack, structure, couches, flux données)
- `docs/adr/` – Architecture Decision Records produits par ARCos (ex: `docs/adr/001-choix-framework.md`)

### Dans `gestion-budget-ihm.wiki/` (`C:\Users\vzwingma\IdeaProjects\gestion-budget-ihm.wiki\`)
- `Home.md` – page d'accueil wiki
- `ConceptionIHM.md` – architecture React (stack, structure src/, conventions, flux auth)
- `Historique-de-l'Architecture.md` – nouvelles versions à documenter ici
- `Opérations-sur-AWS.md` – procédures déploiement S3/CloudFront
- `schemas/*.puml` – diagrammes PlantUML C2/C3 (versions frameworks à jour)

### Dans `.claude/skills/` (procédures partagées)
- `plan-phase-execution/SKILL.md` – procédure d'exécution de phase AP
- `plan-creation/SKILL.md` – procédure de création de plan
- `fleet-guide/SKILL.md` – guide /fleet

> Update fichiers si procédures AP ou /fleet changent (cohérence avec `.claude/PLANS.md`).

## Conventions de documentation

- **Langue** : français pour contenu, anglais pour blocs de code.
- **`docs/ARCHITECTURE.md` obligatoire** : déjà présent, pas de recréation.
- **ADRs** : chaque décision archi majeure → fichier `docs/adr/NNN-titre.md`.
- **Versions à jour** dans `.puml` : React (actuellement **19.1**), Quarkus (actuellement **3.35**).
- **Jamais** mentionner ancien nom repo `gestion-budget-services` – désormais `gestion-budget-serverless`.
- Nouvelle version app livrée → entrée dans `Historique-de-l'Architecture.md` **en tête** de fichier.
- Index `.claude/plans/README.md` : synthétique, **plans + statut global seulement** (sans phases).

## Coordination avec le wiki serverless

Repo IHM héberge **images et schémas C4 partagés** (`schemas/`) référencés aussi par wiki serverless. Modif diagramme → cohérence avec `gestion-budget-serverless.wiki/Conception-globale.md`.

## Checklist de conformité wiki + C4 (obligatoire)

### Trigger de MAJ docs/wiki/C4
- Déclencher checklist dès changement touchant archi IHM, flux API consommé, ou diagramme C4 partagé.

### Contrôle des versions stack
- Vérifier alignement versions entre `README.md`, `docs/ARCHITECTURE.md`, pages wiki IHM, `schemas/*.puml`.
- Divergence → référence = `docs/ARCHITECTURE.md`.

### Contrôle des endpoints (méthode / chemin / rôle)
- Vérifier endpoints backend consommés par IHM (méthode + chemin + rôle attendu) alignés entre wiki IHM et wiki serverless.
- Écart → remonter source vérité serverless (`*APIEnum` + annotations JAX-RS / `@RolesAllowed`).

### Contrôle des liens wiki et rendus C4
- Vérifier liens pages IHM vers schémas C4.
- Vérifier chaque rendu référencé existe, correspond à source `*.puml` courante.
- Aucun lien C4 cassé avant clôture tâche.

## Ce que tu ne fais PAS

- Pas modifier code source (`*.tsx`, `*.ts`).
- Pas créer nouveaux tests (rôle 🟢 QALvin).
- Pas décisions architecturales (rôle 🟠 ARCos).