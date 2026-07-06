---
description: Spécificités projet gestion-budget-ihm pour l'agent 🟣 DOCly (doc)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm (Doc)

> Fichier lu automatiquement par agent 🟣 DOCly au démarrage.
> Contient spécificités projet `gestion-budget-ihm` (frontend React/TypeScript).

## Workflow

1. Récupère tes tâches (`🟣 DOCly` / `Agent: DOCly`) dans le **Plan d'Action** actif, après code + tests validés.
2. Identifie fichiers doc impactés (lire rapports DEVon + QALvin).
3. Update précis (pas réécriture complète sauf si nécessaire).
4. Signale la complétion (rapport `PHASE_N_*.md`).

Procédure détaillée : skill `plan-phase-execution`.

### Workflow hérité (SQL todos, historique)

> Ancien protocole `.github/` : consulter todos `*-doc` dont dépendances sont `done`, passer en `in_progress` puis `done`. Conservé pour référence ; le Plan d'Action prime désormais.

## Fichiers sous ta responsabilité

### Dans la racine du projet (`gestion-budget-ihm/`)
- `README.md` – description générale, prérequis, démarrage rapide
- `.claude/CLAUDE.md` – contexte futures sessions Claude (remplace `.github/copilot-instructions.md`)

### Dans `docs/` (documentation versionnée)
- `docs/ARCHITECTURE.md` (**obligatoire**) – architecture projet (stack, structure, couches, flux données)
- `docs/adr/` – Architecture Decision Records produits par ARCos (ex: `docs/adr/001-choix-framework.md`)

### Dans `gestion-budget-ihm.wiki/` (`C:\Users\vzwingma\IdeaProjects\gestion-budget-ihm.wiki\`)
- `Home.md` – page d'accueil du wiki
- `ConceptionIHM.md` – architecture React (stack, structure src/, conventions, flux auth)
- `Historique-de-l'Architecture.md` – nouvelles versions à documenter ici
- `Opérations-sur-AWS.md` – procédures de déploiement S3/CloudFront
- `schemas/*.puml` – diagrammes PlantUML C2/C3 (versions des frameworks à maintenir à jour)

### Dans `.claude/skills/` (procédures partagées)
- `plan-phase-execution/SKILL.md` – procédure d'exécution de phase AP
- `plan-creation/SKILL.md` – procédure de création de plan
- `fleet-guide/SKILL.md` – guide /fleet

> Update fichiers si procédures AP ou /fleet changent (cohérence avec `.claude/PLANS.md`).

## Conventions de documentation

- **Langue** : français pour le contenu, anglais pour les blocs de code.
- **`docs/ARCHITECTURE.md` est obligatoire** : déjà présent, pas de recréation nécessaire.
- **ADRs** : chaque décision architecturale majeure produit fichier `docs/adr/NNN-titre.md`.
- **Versions à maintenir à jour** dans les `.puml` : React (actuellement **19.1**), Quarkus (actuellement **3.35**).
- **Ne jamais** mentionner l'ancien nom de repo `gestion-budget-services` – c'est désormais `gestion-budget-serverless`.
- Quand une nouvelle version de l'application est livrée, ajouter une entrée dans `Historique-de-l'Architecture.md` **en tête** de fichier.
- Index `.claude/plans/README.md` doit rester synthétique : **plans + statut global uniquement** (sans phases).

## Coordination avec le wiki serverless

Ce repo IHM héberge les **images et schémas C4 partagés** (`schemas/`) référencés également par le wiki serverless. Toute modification de diagramme doit être cohérente avec `gestion-budget-serverless.wiki/Conception-globale.md`.

## Checklist de conformité wiki + C4 (obligatoire)

### Trigger de MAJ docs/wiki/C4
- Déclencher la checklist dès qu'un changement touche l'architecture IHM, un flux API consommé, ou un diagramme C4 partagé.

### Contrôle des versions stack
- Vérifier l'alignement des versions entre `README.md`, `docs/ARCHITECTURE.md`, pages wiki IHM et `schemas/*.puml`.
- En cas de divergence, la version de référence est celle de `docs/ARCHITECTURE.md`.

### Contrôle des endpoints (méthode / chemin / rôle)
- Vérifier que les endpoints backend consommés par l'IHM (méthode + chemin + rôle attendu) sont alignés entre wiki IHM et wiki serverless.
- En cas d'écart, remonter à la source de vérité serverless (`*APIEnum` + annotations JAX-RS / `@RolesAllowed`).

### Contrôle des liens wiki et rendus C4
- Vérifier les liens des pages IHM vers les schémas C4.
- Vérifier que chaque rendu référencé existe et correspond à la source `*.puml` courante.
- Aucun lien C4 cassé avant clôture de tâche.

## Ce que tu ne fais PAS

- Pas modifier le code source (`*.tsx`, `*.ts`).
- Pas créer de nouveaux tests (rôle de 🟢 QALvin).
- Pas prendre de décisions architecturales (rôle de 🟠 ARCos).
