---
name: conventions-orchestrator
description: "Conventions projet gestion-budget-ihm pour ⚫ MAINa : orchestration, gates humains, contenu des délégations. Prioritaire sur le générique."
user-invocable: false
---

# Conventions projet — gestion-budget-ihm (orchestration)

> Projet : `gestion-budget-ihm` — frontend React 19 / TypeScript / Vite de l'application de gestion de budget
> personnel (comptes, budgets mensuels, opérations, analyses). Backend : `gestion-budget-serverless`.

## Contexte à vérifier avant délégation

- `README.md`, `docs/ARCHITECTURE.md` (source de vérité des versions), ADR existants (`docs/adr/`)
- Plans précédents `.claude/plans/` (index `README.md`) ; contrats API côté `gestion-budget-serverless`

## Règles d'orchestration propres au projet

- Plan d'Action persistant (`.claude/plans/`) obligatoire pour toute demande menant à une modification de
  code, sauf dispense explicite du 👤.
- Consulter 🟠 ARCos pour toute décision d'architecture ou changement structurel (nouveau Context, nouvelle lib
  UI, routage, nouvelle dépendance structurante).
- Gates #0 → #4 obligatoires ; décisions consignées dans le journal des gates du plan.
- Évolution d'un modèle / contrat API → vérifier l'impact côté backend `gestion-budget-serverless`.
- Qualité : gate SonarCloud (lint + tests + couverture `coverage/lcov.info`) doit rester vert.
- **Post-déploiement** : après merge + déploiement CI (S3/CloudFront), proposer au 👤 la validation visuelle
  (`.claude/prompts/qa-deploy/validate-staging.md` + `visual-checklist.md`, via Claude in Chrome) en demandant
  l'environnement : **QUA**, **PROD** ou **les deux**. Jamais lancée sans confirmation.

## Contenu des délégations

### Vers 🟠 ARCos
Inclure : besoin, contraintes React 19 / TypeScript / MUI 9, couches impactées (`Components/`, `Models/`,
`Services/`, `Utils/`), exigences non fonctionnelles, liens `docs/ARCHITECTURE.md` et ADR pertinents.
Attendu : ≥ 2 options, avantages/inconvénients/risques/impacts, recommandation, besoin d'ADR éventuel.

### Vers 🔵 DEVon
Inclure : phase validée, fichiers cibles, comportement attendu, contraintes (composants fonctionnels typés,
appels HTTP via `ClientHTTP.service.ts`, MUI seule lib UI), interdiction d'élargir le scope, commandes de
vérification (`npm run build`, `npm run lint`, `npm run typecheck`, `npx vitest run`).
Attendu : code focalisé, liste des fichiers modifiés, hypothèses, preuves de vérification.

### Vers 🟢 QALvin
Inclure : changements DEVon, cas nominaux, erreurs (HTTP 403/404/500), limites (vide/null), interactions,
responsive, composants/services à couvrir, commande de test ciblée (`npx vitest run <fichier>`).
Attendu : tests créés/modifiés, résultats, couverture, points bloquants.

### Vers 🟣 DOCly
Inclure : changements publics, décisions d'architecture, fichiers modifiés, comportements à documenter, entrée
de changelog wiki (`Historique-de-l'Architecture.md`) éventuelle.
Attendu : docs synchronisées sans réécriture inutile, liens cohérents, ADR si décision majeure.

## Ce que MAINa ne fait pas

- Coder, tester ou documenter à la place des agents (sauf tâche triviale explicitement demandée).
- Décider une architecture majeure sans ARCos ni validation 👤.
- Clôturer une initiative sans validation 👤 des livrables.
- Inventer des conventions absentes du code ou de la documentation.
- Considérer un Plan d'Action comme créé s'il n'existe pas dans `.claude/plans/`.
