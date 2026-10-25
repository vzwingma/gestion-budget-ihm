# ADR 006 — Migration déploiement S3 de `reggionick/s3-deploy` vers AWS CLI natif

**Date :** 2026-10-25
**Statut :** Acceptée
**Décideurs :** 👤 Développeur humain

---

## Contexte

Les jobs de déploiement CI (`build-on-master.yml`, `build-on-tags.yml`) utilisent l'action
GitHub `reggionick/s3-deploy@v4` pour synchroniser `dist/` vers S3 et invalider CloudFront.

La CI remonte un warning :
> Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to
> run on Node.js 24: `reggionick/s3-deploy@v4`.

Vérification : dernier tag publié `v4.0.0`, aucune mise à jour runtime Node 24. Action non
maintenue activement. Le warning est aujourd'hui sans impact (runner force Node 24
automatiquement), mais deviendra bloquant à la suppression définitive de Node 20 sur les
runners GitHub (pas de date officielle annoncée à ce jour).

## Décision

**Nous avons décidé de** remplacer `reggionick/s3-deploy@v4` par des commandes AWS CLI natives
(`aws s3 sync`, `aws cloudfront create-invalidation`), précédées d'un step
`aws-actions/configure-aws-credentials@v4` pour l'authentification.

## Alternatives Considérées

### Option 1 : AWS CLI natif (`aws s3 sync` + `aws cloudfront create-invalidation`) ✅ Retenue

- **Avantages** :
  - AWS CLI préinstallé sur runners `ubuntu-latest` GitHub-hosted — aucune dépendance externe.
  - `aws-actions/configure-aws-credentials` activement maintenue par AWS, runtime Node à jour.
  - Contrôle total des flags (`--delete`, `--cache-control`), pas de couche d'abstraction tierce.
  - Pas de risque futur de dépréciation identique (dépendance tierce non maintenue).
- **Inconvénients** :
  - Perte de la syntaxe déclarative courte de `s3-deploy` (légèrement plus verbeux).
  - Pas de vérification automatique locale possible (credentials AWS absents en session dev) ;
    validation reportée au premier run CI post-merge.

### Option 2 : Ignorer le warning (statu quo)

- **Avantages** : aucun changement, aucun risque de régression immédiat.
- **Inconvénients** : dette technique qui deviendra bloquante à la suppression de Node 20 sur
  les runners GitHub ; action non maintenue, pas de garantie de compatibilité future.
- **Raison du rejet** : ne fait que déplacer le problème, sans échéance de résolution garantie.

### Option 3 : Forker/vendoriser `reggionick/s3-deploy` avec runtime Node 24

- **Avantages** : conserve la syntaxe d'appel existante.
- **Inconvénients** : charge de maintenance d'un fork pour une action, alors qu'une alternative
  officielle AWS existe nativement sur les runners ; aucune valeur ajoutée.
- **Raison du rejet** : effort disproportionné par rapport au gain (Option 1 répond au besoin
  avec des outils officiels déjà présents).

## Conséquences

### Positives
- Supprime la dépendance à une action GitHub tierce non maintenue.
- Supprime le warning CI lié à la dépréciation Node 20.
- Alignement sur outils officiels AWS (`aws-actions/*`), maintenance long terme assurée.

### Négatives / Compromis
- Steps CI légèrement plus nombreux (3 steps au lieu de 1) par job de déploiement.
- Validation runtime réelle (upload S3 + invalidation CloudFront) seulement vérifiable au
  prochain déploiement effectif (push `master` / tag), pas en session de développement.

### Neutres
- Secrets AWS (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) inchangés, seule leur méthode de
  passage change (input d'action au lieu de variable d'environnement de job).

## Mise en œuvre

- **Fichiers impactés** : `.github/workflows/build-on-master.yml`, `.github/workflows/build-on-tags.yml`
- **Tâches de suivi** : surveiller le premier run CI post-merge sur `master` (job
  `deploy to S3 QUA`) pour confirmer succès sync + invalidation.
- **Date d'effet** : prochain push sur `master` après merge de la PR associée.

## Références

- Changelog GitHub : https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
- Action retenue : https://github.com/aws-actions/configure-aws-credentials
- Plan d'Action associé : [`.claude/plans/006_migration_s3_deploy_aws_cli.plan.md`](../../.claude/plans/006_migration_s3_deploy_aws_cli.plan.md)
