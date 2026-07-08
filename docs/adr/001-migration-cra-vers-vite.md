# ADR 001 — Migration du socle build Create React App vers Vite

---

**Date :** 2026-07-07
**Statut :** Acceptée
**Décideurs :** 🟠 ARCos + 👤 Développeur humain

---

## Contexte

Le frontend `gestion-budget-ihm` (React 19) repose sur Create React App (`react-scripts` 5.0.1), non maintenu par la communauté depuis 2023 (dernière release majeure : mars 2022). Cette dette technique se manifeste concrètement par :

- **Double stack de build coexistante** : `react-scripts` pilote `start`/`build`/`test`, tandis qu'un `webpack.config.js` custom séparé (script `prod`) existe en parallèle — deux pipelines divergents, aucun complet à lui seul (le webpack custom ne gère ni les assets `public/`, ni le HTML, ni le mode développement).
- **Versions non déclarées** : absence de `engines`/`.nvmrc` — Node dérive silencieusement en CI (`node-version: latest`). TypeScript est tiré en 4.9.5 via une dépendance transitive de `react-scripts`, jamais déclaré explicitement.
- **Incohérence de configuration** : `package.json` déclare `"type": "module"` + `"exports": "./src/index.js"` alors que le point d'entrée réel du bundle est `src/index.tsx`, piloté par CRA/webpack (pas d'ESM natif).
- **Résidus** : dépendances `workbox-*` (PWA) héritées du template CRA, jamais utilisées dans `src/`.
- **Absence de test runner moderne** : `react-scripts test` embarque Jest via une configuration opaque, difficile à faire évoluer indépendamment.

Une décision de modernisation du socle build est nécessaire pour retrouver un outillage maintenu, un pipeline de build unique et cohérent, et des versions explicitement pilotées.

---

## Décision

**Nous avons décidé de** migrer le socle build de Create React App vers **Vite**, avec migration simultanée du test runner vers **Vitest** et mise à niveau directe de TypeScript vers la version 5.x.

---

## Alternatives Considérées

### Option 1 : Vite ✅ Retenue

- **Avantages** : build rapide (esbuild en dev, Rollup en prod), maintenu activement, migration CRA→Vite bien documentée par la communauté, conserve le modèle SPA existant (`public/`, variables d'environnement via préfixe, ici `VITE_*` en remplacement de `REACT_APP_*`), compatible React 19 + TypeScript + `react-router-dom` 7, élimine la double stack de build en remplaçant à la fois `react-scripts` et le `webpack.config.js` custom.
- **Inconvénients** : nécessite de porter toutes les références `process.env.REACT_APP_*` vers `import.meta.env.VITE_*` dans le code source ; migration du test runner (Jest → Vitest) à mener de pair.

### Option 2 : Next.js

- **Avantages** : écosystème riche, SSR/SSG natif, routing file-based intégré.
- **Inconvénients** : SSR et routing file-based ne sont pas nécessaires ici — l'application est une SPA pure, hébergée en statique derrière S3 + CloudFront, avec authentification OIDC côté client. Adopter Next.js impliquerait de réécrire le routing `react-router-dom` 7 existant vers l'App Router, pour un bénéfice nul dans ce contexte de déploiement.
- **Raison du rejet** : sur-ingénierie par rapport au besoin réel (SPA statique).

### Option 3 : Unifier sur le webpack custom existant

- **Avantages** : pas de nouvel outil à introduire, capitalise sur `webpack.config.js` déjà présent.
- **Inconvénients** : le fichier existant est minimal — il faudrait lui ajouter la gestion du HTML (`HtmlWebpackPlugin`), la copie des assets `public/`, le serveur de développement, l'injection des variables d'environnement, le code splitting et la minification, soit reconstruire manuellement l'équivalent de ce que Vite fournit prêt à l'emploi.
- **Raison du rejet** : revient à réinventer Create React App avec une maintenance intégralement à la charge de l'équipe, sans bénéfice par rapport à l'adoption de Vite.

---

## Conséquences

### Positives
- Pipeline de build unique (suppression du `webpack.config.js` custom et de la double stack).
- Build et démarrage en développement significativement plus rapides.
- Outillage activement maintenu, réduisant la dette technique.
- Versions explicitement déclarées et pilotées (Node via `engines`/`.nvmrc`, TypeScript en devDependency directe).

### Négatives / Compromis
- Migration combinée Vite + Vitest en une seule initiative (risque accepté par le développeur pour éviter une double transition ultérieure).
- Toutes les références `process.env.REACT_APP_*` doivent être recherchées et portées vers `import.meta.env.VITE_*` dans `src/`.
- Le saut de TypeScript 4.9 → 5.x peut révéler des erreurs de typage strict jusque-là masquées.
- Les 3 workflows CI/CD (`build-on-all.yml`, `build-on-master.yml`, `build-on-tags.yml`) doivent être adaptés (dossier de sortie `build/` → `dist/`, préfixe des variables d'environnement, version Node épinglée).

### Neutres
- Mise à jour de `gestion-budget-ihm/.claude/CLAUDE.md` (section Build/Test/Lint) et de `docs/ARCHITECTURE.md` si référencé.
- Le modèle de déploiement (AWS S3 + CloudFront, hébergement statique) reste inchangé.

---

## Mise en œuvre

- **Fichiers impactés** : `package.json`, `webpack.config.js` (supprimé), `tsconfig.json`, `public/index.html` → `index.html` (racine), `vite.config.ts` (créé), `.nvmrc` (créé), `src/index.tsx`, `src/main/**` (références `process.env.REACT_APP_*`), `external-ressources/conf/.env.*`, `.github/workflows/build-on-all.yml`, `.github/workflows/build-on-master.yml`, `.github/workflows/build-on-tags.yml`.
- **Tâches de suivi** : DEVon — implémenter Phases 1 à 5 du plan (socle Vite, migration Vitest, déclarations de versions, mise à jour des dépendances, refonte CI/CD) ; QALvin — valider la couverture de tests après migration Vitest ; DOCly — mettre à jour la documentation.
- **Date d'effet** : à partir de la Phase 1 du plan d'action associé.

---

## Références

- Plan d'Action associé : `C:\Users\vzwingma\.claude\plans\maina-planifie-une-bright-brook.md`
