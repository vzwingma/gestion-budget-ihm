# Plan d'Action 006 — Migration déploiement S3 vers AWS CLI natif

**Statut :** ✅ Complété
**Date :** 2026-10-25
**Agent orchestrateur :** ⚫ MAINa (session directe, hors workflow interactif gates)

---

## Contexte

CI `Deploy CI/CD - Snapshot IHM` remonte un warning sur le job `deploy to S3 QUA` :
> Node.js 20 is deprecated. The following actions target Node.js 20 but are being forced to
> run on Node.js 24: `reggionick/s3-deploy@v4`.

`reggionick/s3-deploy` figé à `v4.0.0` (dernier tag, non maintenu depuis ~2022), pas de version
compatible Node 24. Utilisé dans `build-on-master.yml` (déploiement QUA) et `build-on-tags.yml`
(déploiement PROD).

## Décision

Remplacer `reggionick/s3-deploy@v4` par `aws-actions/configure-aws-credentials@v4` +
commandes `aws s3 sync` / `aws cloudfront create-invalidation` natives (AWS CLI préinstallé sur
les runners `ubuntu-latest`). Détail comparatif options : voir ADR
[`006-migration-s3-deploy-aws-cli.md`](../../docs/adr/006-migration-s3-deploy-aws-cli.md).

## Périmètre

- `.github/workflows/build-on-master.yml` (job `deploy`, déploiement QUA)
- `.github/workflows/build-on-tags.yml` (job `deploy`, déploiement PROD)

## Mise en œuvre

| Option `s3-deploy` | Équivalent AWS CLI |
|---|---|
| `folder` / `bucket` / `bucket-region` | `aws s3 sync <folder> s3://<bucket>` + `aws-region` sur `configure-aws-credentials` |
| `invalidation: /` + `dist-id` | `aws cloudfront create-invalidation --distribution-id <id> --paths "/*"` |
| `no-cache: true` | `--cache-control no-cache` sur `aws s3 sync` |
| `delete-removed: true` (PROD only) | `--delete` sur `aws s3 sync` |
| `private: true` | Pas d'équivalent nécessaire : `aws s3 sync` ne pose pas d'ACL publique par défaut |

Secrets `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` repris à l'identique, passés en `with:`
de `configure-aws-credentials` au lieu de variables d'environnement du job.

## Preuves

- Diff workflows : suppression `env:` job-level `AWS_*`, ajout step `Configure AWS credentials`
  + remplacement step `Deploy` par `Deploy to S3` + `Invalidate CloudFront`.
- Vérification manuelle syntaxe YAML (pas de lint YAML dédié dans le projet).
- ⚠️ Validation runtime réelle du déploiement AWS seulement au prochain run CI (push sur
  `master` / tag) — pas testable localement (credentials AWS non disponibles en session).

## Suivi / Risques

- Premier déploiement QUA après merge à surveiller (job `deploy to S3 QUA`) : vérifier succès
  sync + invalidation CloudFront.
- Si échec : rollback trivial (revert commit, `reggionick/s3-deploy@v4` encore fonctionnel malgré
  warning).
