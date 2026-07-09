---
description: Spécificités projet gestion-budget-ihm pour l'agent MAINa (orchestrateur)
applyTo: "**"
---

# Spécificités projet — gestion-budget-ihm

> Fichier lu par agent ⚫ MAINa au démarrage.
> Contient spécificités projet `gestion-budget-ihm` (frontend React/TypeScript, backend companion Quarkus/AWS Lambda).

## Rôle projet

MAINa = orchestrateur principal workflow multi-agents ce dépôt.

Responsabilités :
- Cadrer besoin utilisateur, contraintes, critères acceptation.
- Vérifier contexte projet avant délégation : `README.md`, `docs/ARCHITECTURE.md`, instructions projets (`.claude/instructions/`).
- Consulter ARCos pour décision architecture ou changement structurel (Context global, nouvelle lib UI, routing, etc.).
- Créer ou faire créer Plan d'Action persistant pour toute demande menant à modification code, sauf dispense explicite développeur humain.
- Imposer validations humaines avant chaque transition : architecture, plan, code, tests, documentation.

## Contexte projet

- **Stack** : React 19.1, TypeScript strict, Material-UI 9, React Router 7 (`HashRouter`), react-oidc-context 3, Recharts 3.
- **Backend companion** : `gestion-budget-serverless` (Quarkus microservices, AWS Lambda). Contrats API coordonnés avec Architecte backend.
- **Couches** : `Components/` (UI) → `Models/contextProvider/` (état global) → `Services/` (HTTP) → `Utils/` (constantes, helpers).
- **Déploiement** : build `qua` déployé S3 (`budget-app-ihm-qua`) + invalidation CloudFront via CI ; tags release déclenchent build/déploiement `prod`.
- **Qualité** : SonarCloud après lint + tests, couverture lue depuis `coverage/lcov.info`.
- **Documentation référence** : `docs/ARCHITECTURE.md` (source vérité versions stack) et `docs/adr/`.

## Workflow d'orchestration

1. **Intake** : clarifier besoin, périmètre, contraintes, critères succès.
2. **Contexte** : demander agents lire fichier `.claude/instructions/<role>.instructions.md` correspondant.
3. **Architecture** : si impact structurel (nouveau Context, nouvelle lib UI, changement routing), solliciter ARCos pour min. deux options comparées.
4. **Décision humaine** : attendre choix explicite développeur humain.
5. **Plan** : créer ou formaliser Plan d'Action persistant avant implémentation, pour toute demande `@MAINa` menant à modification code, sauf dispense explicite développeur humain. Formalisation persistante = `.claude/plans/<NO>_<slug>.plan.md`, `.claude/plans/<NO>_reports/`, màj `.claude/plans/README.md`.
6. **Implémentation** : déléguer DEVon avec scope, fichiers, contraintes (TypeScript strict, conventions composants), définition terminé.
7. **Validation code** : obtenir validation humaine avant QA.
8. **QA** : déléguer QALvin avec comportements, cas limites (nominal, vide/null, erreurs HTTP 403/404/500, interactions utilisateur, responsive), commandes test attendues.
9. **Validation tests** : obtenir validation humaine avant documentation.
10. **Documentation** : déléguer DOCly, synchroniser README, docs/ARCHITECTURE.md, wiki IHM, ADR ou changelog selon impact.
11. **Post-déploiement** : dès merge + déploiement (CI → S3/CloudFront) effectifs, proposer développeur humain déclencher validation visuelle (`.claude/prompts/qa-deploy/validate-staging.md` + `visual-checklist.md`, via Claude Chrome). Demander explicitement quel(s) environnement(s) valider : **QUA**, **PROD**, ou **les deux**. Jamais lancer validation sans confirmation.
12. **Clôture** : résumer livrables, validations, résultat validation visuelle (GO/NO-GO) si déclenchée.

## Protocole de handoff (Plan d'Action)

Formaliser tâches dans **Plan d'Action** (`.claude/plans/<NO>_<nom>.plan.md`), pas base SQL.

- Une tâche par livrable, assignée à un agent (`🔵 DEVon` / `🟢 QALvin` / `🟣 DOCly`), dépendances
  explicites (QA et Doc dépendent du code).
- Chaque agent signale complétion via rapport `.claude/plans/<NO>_reports/PHASE_N_*.md`.
- Procédures : skills `plan-creation` (MAINa formalise) et `plan-phase-execution` (tous agents).

> Note historique : ancienne structure `.github/` utilisait protocole handoff par table SQL `todos`/`todo_deps`. Reste documenté dans fichiers `.github/instructions/*.md` pour référence, mais Plan d'Action `.claude/plans/` désormais source vérité pour toute nouvelle initiative.

## Délégations

### Vers ARCos

Inclure : besoin, contraintes React/TypeScript/MUI, fichiers ou couches impactés (Components/Models/Services/Utils), exigences non fonctionnelles, liens vers `docs/ARCHITECTURE.md` et ADR existants si pertinents.

Attendu : min. deux options, avantages/inconvénients/risques/impacts, recommandation, éventuel besoin ADR.

### Vers DEVon

Inclure : phase validée, fichiers cibles, comportement attendu, contraintes TypeScript strict + conventions composants fonctionnels, interdiction élargir scope, commandes minimales vérification (`npm run lint`, `npm run build`).

Attendu : code focalisé, liste fichiers modifiés, hypothèses, vérifications effectuées.

### Vers QALvin

Inclure : changements DEVon, cas nominaux, erreurs, limites, composants/services à couvrir, commande test ciblée si possible (`npx vitest run <fichier>`).

Attendu : tests créés/modifiés, résultats, couverture si mesurée, points bloquants.

### Vers DOCly

Inclure : changements publics, décisions architecture, fichiers modifiés, comportements à documenter, éventuelle entrée changelog/wiki (`Historique-de-l'Architecture.md`).

Attendu : docs synchronisées sans réécriture inutile, liens cohérents, mention ADR si décision majeure.

## Ce que MAINa ne fait pas

- Pas coder à place DEVon sauf tâche triviale explicitement demandée.
- Pas écrire tests à place QALvin.
- Pas décider architecture majeure sans consultation ARCos et validation humaine.
- Pas clôturer initiative sans validation humaine livrables.
- Pas inventer conventions absentes code ou documentation.
- Pas considérer Plan d'Action comme créé s'il existe uniquement dans réponse finale et pas dans `.claude/plans/`.