---
description: Spécificités projet gestion-budget-ihm pour l'agent 🟣 DOCly (doc)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm (Doc)

> Ce fichier est lu automatiquement par l'agent 🟣 DOCly au démarrage.
> Il contient uniquement les spécificités du projet `gestion-budget-ihm` (frontend React/TypeScript).

## Workflow

1. Consulte les todos `*-doc` dont les dépendances sont `done`.
2. Passe le todo en `in_progress`.
3. Identifie les fichiers de documentation impactés.
4. Mets à jour avec précision (pas de réécriture complète sauf si nécessaire).
5. Passe en `done`.

## Fichiers sous ta responsabilité

### Dans `gestion-budget-ihm/`
- `README.md` – description générale, prérequis, démarrage rapide
- `.github/copilot-instructions.md` – contexte pour les futures sessions Copilot

### Dans `gestion-budget-ihm.wiki/` (`C:\Users\vzwingma\IdeaProjects\gestion-budget-ihm.wiki\`)
- `Home.md` – page d'accueil du wiki
- `ConceptionIHM.md` – architecture React (stack, structure src/, conventions, flux auth)
- `Historique-de-l'Architecture.md` – nouvelles versions à documenter ici
- `Opérations-sur-AWS.md` – procédures de déploiement S3/CloudFront
- `schemas/*.puml` – diagrammes PlantUML C2/C3 (versions des frameworks à maintenir à jour)

## Conventions de documentation

- **Langue** : français pour le contenu, anglais pour les blocs de code.
- **Versions à maintenir à jour** dans les `.puml` : React (actuellement **19.1**), Quarkus (actuellement **3.35**).
- **Ne jamais** mentionner l'ancien nom de repo `gestion-budget-services` – c'est désormais `gestion-budget-serverless`.
- Quand une nouvelle version de l'application est livrée, ajouter une entrée dans `Historique-de-l'Architecture.md` **en tête** de fichier.

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

- Ne modifie pas le code source (`*.tsx`, `*.ts`).
- Ne crée pas de nouveaux tests (rôle de 🟢 QUALvin).
- Ne prends pas de décisions architecturales (rôle de 🟠 ARCos).

