# Rapport Phase 1 — Plan 008 (Versioning IHM 27.0.0 + version DEV/QUA en CI)

**Agent :** 🔵 DEVon — **Tâches :** T1.1, T1.2, T1.3

## Fichiers modifiés
| Fichier | Modification |
|---|---|
| `package.json` | l.3 `"version": "27.0.0"` |
| `package-lock.json` | l.3 et l.9 `"version": "27.0.0"` |
| `.env.model` | l.1 `VITE_BUDGET_VERSION=DEV.27.yyyyMMdd-HHmm` |
| `external-ressources/conf/.env.staging` | l.2 `VITE_BUDGET_VERSION=QUA.__BUDGET_IHM_VERSION__` |
| `external-ressources/conf/.env.dev` | l.2 `VITE_BUDGET_VERSION=DEV.__BUDGET_IHM_VERSION__` (rien d'autre lu/modifié) |
| `.github/workflows/build-on-master.yml` | étape « Update config in .env.staging » : calcul `VERSION_MAJEURE`, `BUILD_DATE` (Europe/Paris) + `sed` du placeholder, avant l'étape `mv` |
| `.github/workflows/build-on-all.yml` | étape « Update config in .env » : idem sur `.env.dev` |

`build-on-tags.yml` et `.env.production` : non modifiés.

## Vérifications
| Commande | Résultat |
|---|---|
| Recherche `24.0-SNAPSHOT` / `26.current` dans `package*.json` | 0 occurrence ✅ |
| Parse YAML (python `yaml.safe_load`) des 2 workflows | OK ✅ |
| `npm run lint` | exit 0 — 0 erreur, 437 warnings (préexistants) ✅ |
| `npm run typecheck` | exit 2 — 12 erreurs TS dans `OperationDetailPage.component.tsx` et `OperationDetailCategorieType.component.tsx` (`categorieParente`, `type` absents de `CategorieOperationModel`, etc.) ❌ non lié à Phase 1 (aucun fichier TS touché) |
| `npx vitest run` | 278/279 fichiers OK ; 5 tests en échec, tous dans `OperationsListItem.shared.tooltip.test.tsx` (2097 passés) ❌ non lié à Phase 1 |
| `npm run build` (avec `.env` temporaire sans secret, supprimé ensuite) | exit 0 ✅ (warning taille de chunk habituel) |

## Résidus
`.env` temporaire et `.env.tmpbuild` supprimés. `dist/` et `coverage/` existaient déjà ; `dist/` régénéré par le build ; `public/styles/application.min.css` régénéré par `minify-css` (script du build).

## Risques
- typecheck et 5 tests rouges préexistants (travaux en cours sur le modèle catégorie / infobulle) : critère « verts » de la Phase 1 non atteint pour ces raisons étrangères au plan ; à arbitrer à Gate #2.
- Non vérifié : comportement réel CI (simulation prévue T2.1).
