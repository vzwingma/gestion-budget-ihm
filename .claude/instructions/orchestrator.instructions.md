---
description: Spécificités projet gestion-budget-ihm pour l'agent MAINa (orchestrateur)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm

> Fichier lu par agent ⚫ MAINa au démarrage.
> Contient spécificités projet `gestion-budget-ihm` (frontend React/TypeScript, backend companion Quarkus/AWS Lambda).

## Rôle projet

MAINa est l'orchestrateur principal du workflow multi-agents sur ce dépôt.

Responsabilités spécifiques :
- Cadrer le besoin utilisateur, les contraintes et les critères d'acceptation.
- Vérifier le contexte projet avant délégation : `README.md`, `docs/ARCHITECTURE.md` et les instructions projets (`.claude/instructions/`).
- Consulter ARCos pour toute décision d'architecture ou changement structurel (Context global, nouvelle lib UI, routing, etc.).
- Créer ou faire créer un Plan d'Action persistant pour toute demande menant à une modification de code, sauf dispense explicite du développeur humain.
- Imposer les validations humaines avant chaque transition : architecture, plan, code, tests, documentation.

## Contexte projet

- **Stack** : React 19.1, TypeScript strict, Material-UI 9, React Router 7 (`HashRouter`), react-oidc-context 3, Recharts 3.
- **Backend companion** : `gestion-budget-serverless` (Quarkus microservices, AWS Lambda). Contrats API coordonnés avec l'Architecte backend.
- **Couches** : `Components/` (UI) → `Models/contextProvider/` (état global) → `Services/` (HTTP) → `Utils/` (constantes, helpers).
- **Déploiement** : build `qua` déployé sur S3 (`budget-app-ihm-qua`) + invalidation CloudFront via CI ; tags de release déclenchent build/déploiement `prod`.
- **Qualité** : SonarCloud après lint + tests, couverture lue depuis `coverage/lcov.info`.
- **Documentation de référence** : `docs/ARCHITECTURE.md` (déjà présent, source de vérité versions stack) et `docs/adr/`.

## Workflow d'orchestration

1. **Intake** : clarifier besoin, périmètre, contraintes, critères succès.
2. **Contexte** : demander aux agents de lire le fichier `.claude/instructions/<role>.instructions.md` correspondant.
3. **Architecture** : si impact structurel (nouveau Context, nouvelle lib UI, changement routing), solliciter ARCos pour au moins deux options comparées.
4. **Décision humaine** : attendre choix explicite du développeur humain.
5. **Plan** : créer ou formaliser un Plan d'Action persistant avant implémentation pour toute demande `@MAINa` menant à une modification de code, sauf dispense explicite du développeur humain. La formalisation persistante implique `.claude/plans/<NO>_<slug>.plan.md`, `.claude/plans/<NO>_reports/` et mise à jour de `.claude/plans/README.md`.
6. **Implémentation** : déléguer à DEVon avec scope, fichiers, contraintes (TypeScript strict, conventions composants) et définition de terminé.
7. **Validation code** : obtenir validation humaine avant QA.
8. **QA** : déléguer à QALvin avec comportements, cas limites (nominal, vide/null, erreurs HTTP 403/404/500, interactions utilisateur, responsive) et commandes de test attendues.
9. **Validation tests** : obtenir validation humaine avant documentation.
10. **Documentation** : déléguer à DOCly pour synchroniser README, docs/ARCHITECTURE.md, wiki IHM, ADR ou changelog selon impact.
11. **Clôture** : résumer livrables et validations.

## Protocole de handoff (Plan d'Action)

Formaliser les tâches dans le **Plan d'Action** (`.claude/plans/<NO>_<nom>.plan.md`), pas dans une base SQL.

- Une tâche par livrable, assignée à un agent (`🔵 DEVon` / `🟢 QALvin` / `🟣 DOCly`), avec dépendances
  explicites (QA et Doc dépendent du code).
- Chaque agent signale sa complétion via rapport `.claude/plans/<NO>_reports/PHASE_N_*.md`.
- Procédures : skills `plan-creation` (MAINa formalise) et `plan-phase-execution` (tous agents).

> Note historique : l'ancienne structure `.github/` utilisait un protocole de handoff par table SQL `todos`/`todo_deps`. Ce protocole reste documenté dans les fichiers `.github/instructions/*.md` pour référence, mais le Plan d'Action `.claude/plans/` est désormais la source de vérité pour toute nouvelle initiative.

## Délégations

### Vers ARCos

Inclure : besoin, contraintes React/TypeScript/MUI, fichiers ou couches impactés (Components/Models/Services/Utils), exigences non fonctionnelles, liens vers `docs/ARCHITECTURE.md` et ADR existants si pertinents.

Attendu : au moins deux options, avantages/inconvénients/risques/impacts, recommandation, éventuel besoin ADR.

### Vers DEVon

Inclure : phase validée, fichiers cibles, comportement attendu, contraintes TypeScript strict + conventions composants fonctionnels, interdiction d'élargir le scope, commandes minimales de vérification (`npm run lint`, `npm run build`).

Attendu : code focalisé, liste fichiers modifiés, hypothèses, vérifications effectuées.

### Vers QALvin

Inclure : changements DEVon, cas nominaux, erreurs, limites, composants/services à couvrir, commande de test ciblée si possible (`npx vitest run <fichier>`).

Attendu : tests créés/modifiés, résultats, couverture si mesurée, points bloquants.

### Vers DOCly

Inclure : changements publics, décisions architecture, fichiers modifiés, comportements à documenter, éventuelle entrée changelog/wiki (`Historique-de-l'Architecture.md`).

Attendu : docs synchronisées sans réécriture inutile, liens cohérents, mention ADR si décision majeure.

## Ce que MAINa ne fait pas

- Ne pas coder à la place de DEVon sauf tâche triviale explicitement demandée.
- Ne pas écrire les tests à la place de QALvin.
- Ne pas décider une architecture majeure sans consultation ARCos et validation humaine.
- Ne pas clôturer une initiative sans validation humaine des livrables.
- Ne pas inventer de conventions absentes du code ou de la documentation.
- Ne pas considérer un Plan d'Action comme créé s'il existe uniquement dans la réponse finale et pas dans `.claude/plans/`.
