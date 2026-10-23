---
name: conventions-doc
description: "Conventions documentaires du projet gestion-budget-ihm pour 🟣 DOCly : fichiers sous sa responsabilité, langue, ADR, changelog, diagrammes. Prioritaire sur le générique."
user-invocable: false
---

# Conventions projet — gestion-budget-ihm (documentation)

> Projet : `gestion-budget-ihm` — frontend React 19 / TypeScript / Vite de l'application de gestion de budget
> personnel (comptes, budgets mensuels, opérations, analyses). Backend : `gestion-budget-serverless`.

## Fichiers sous la responsabilité de DOCly

### Racine
- `README.md` — présentation, prérequis, démarrage rapide
- `.claude/CLAUDE.md` — contexte des futures sessions (sections projet uniquement)

### `docs/`
- `docs/ARCHITECTURE.md` (**obligatoire**, déjà présent) — stack, structure, couches, flux de données ;
  **source de vérité des versions** de stack
- `docs/adr/` — ADR rédigés sur contenu 🟠 ARCos (skill `adr-writing`, modèle `docs/adr/ADR-TEMPLATE.md`)

### Wiki `gestion-budget-ihm.wiki/` (dépôt séparé, `C:\Users\vzwingma\IdeaProjects\gestion-budget-ihm.wiki\`)
- `Home.md`, `ConceptionIHM.md` (architecture React), `Opérations-sur-AWS.md` (déploiement S3/CloudFront)
- `Historique-de-l'Architecture.md` — changelog : nouvelle version ajoutée **en tête**
- `schemas/*.puml` — diagrammes C4 (C2/C3) PlantUML, partagés avec le wiki serverless ; versions à maintenir :
  React (**19.1**), Quarkus (**3.35**) — référence = `docs/ARCHITECTURE.md`

### `.claude/skills/` (procédures partagées)
Mettre à jour si les procédures changent (cohérence avec `.claude/PLANS.md`) :
`plan-creation`, `plan-phase-execution`, `parallel-guide`, `adr-writing`.

## Conventions

- **Langue** : français pour le texte, anglais pour les blocs de code.
- **`docs/ARCHITECTURE.md` obligatoire** dans tout projet.
- **ADR** : un fichier `docs/adr/NNN-titre.md` par décision majeure.
- **Index des plans** `.claude/plans/README.md` : plans + statut global uniquement.
- **Terminologie** : ne jamais mentionner l'ancien nom de dépôt `gestion-budget-services` → `gestion-budget-serverless`.
- **Cohérence wiki + C4** (dès qu'un changement touche l'archi IHM, un flux API consommé ou un diagramme partagé) :
  versions alignées entre `README.md`, `docs/ARCHITECTURE.md`, wiki IHM et `schemas/*.puml` ; endpoints
  (méthode + chemin + rôle) alignés avec `gestion-budget-serverless.wiki/Conception-globale.md` (source de vérité
  côté serverless : `*APIEnum` + annotations JAX-RS / `@RolesAllowed`) ; aucun lien C4 cassé avant clôture.

## Ce que DOCly ne fait PAS

- Modifier le code source (`*.ts`, `*.tsx`) ou les tests.
- Prendre des décisions d'architecture (rôle 🟠 ARCos).
