---
description: Valide visuellement le déploiement staging selon la checklist QA
---

# Validation visuelle de l'environnement

Tu vas valider le dernier déploiement sur l'environnement à l'aide du navigateur Chrome connecté.

## Contexte

- Environnements : 
  - QUA : https://d3to0u2plor2c.cloudfront.net
  - PROD : https://d3txnz1gxk5lrd.cloudfront.net
- Checklist de référence : @visual-checklist.md
- Si le navigateur Chrome n'est pas connecté, demande-moi de lancer `/chrome` avant de continuer.

## Déroulé

1. **Vérifier que le déploiement est bien terminé** : ouvre la page d'accueil de l'environnement et vérifie qu'elle répond (pas de page d'erreur 502/503 du déploiement en cours).
2. **Dérouler chaque scénario** de la checklist, dans l'ordre, en respectant les étapes et les résultats attendus décrits.
3. **Pour chaque page visitée** : vérifie la console en filtrant sur les patterns `error`, `failed`, `404`, `500`. Ne me remonte que les messages qui matchent, pas tous les logs.
4. **En cas de login ou CAPTCHA** : mets-toi en pause et demande-moi de le gérer manuellement. N'essaie jamais de saisir des identifiants toi-même.
5. **En cas d'anomalie visuelle** : prends une capture d'écran de la zone concernée avant de passer au scénario suivant.

## Règles

- Ne clique sur aucune action irréversible (suppression, envoi d'email, paiement) sans me demander confirmation.
- Si un scénario est bloqué (page inaccessible, données de test absentes), note-le comme BLOQUÉ et continue avec le suivant.
- Reste sur le domaine de l'environnement en cours de validation ; ne navigue pas vers un autre environnement.

## Rapport final

À la fin, rédige un rapport dans `.claude/plans/qa_reports/validation-{env}-{date du jour au format YYYY-MM-DD}.md` (`{env}` = `qua` ou `prod`) avec :

- **Résumé** : nombre de scénarios OK / KO / BLOQUÉ
- **Tableau par scénario** : nom, statut, observations
- **Anomalies** : description, page concernée, capture d'écran ou étapes de reproduction, erreurs console associées
- **Verdict** : GO / NO-GO pour considérer le déploiement comme validé

Affiche-moi ensuite le résumé et le verdict directement dans le terminal.
