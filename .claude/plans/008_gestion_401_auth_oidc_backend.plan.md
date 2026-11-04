# Plan d'Action 008 — IHM : session (401) et socle des erreurs HTTP

**Date création :** 2026-10-25 · **Mise à jour :** 2026-11-04 (Gate #0 GO, cadrage ARCos)
**Statut :** 🔵 En cours — Gate #1 GO (2026-11-04), Phase 1 DEVon lancée
**Porteur :** ⚫ MAINa
**Origine :** plan serverless `004_revue_architecture_backend` (ex-T0.7) et plan serverless `005_info_endpoint_public`
**ADR :** [`docs/adr/008-gestion-erreurs-http-et-session.md`](../../docs/adr/008-gestion-erreurs-http-et-session.md) (`Acceptée`)
**Branche (proposée) :** `feat/ihm-008-session-erreurs-http`, créée depuis `origin/master` ; push et merge par le 👤
**Prérequis PROD :** ce plan doit être **en PROD avant** la PROD backend (plan serverless 004 Phases 0 et 1 + plan 005)

---

## Objectif global

Le backend valide maintenant les jetons Google avec `quarkus-oidc` (ADR-005 serverless). Un jeton absent, expiré ou invalide reçoit un **401**, alors qu'avant c'était un 403. `/_info` reste lisible en 200 quel que soit le jeton (ADR-008 serverless). Les GET catégories `@PermitAll` répondent 401 si le jeton est invalide.

État constaté par ARCos le 2026-11-04 sur master 6bd7757 :
- **401 non géré.** `ClientHTTP.service.ts:100-108` ne déconnecte que sur 403. Un 401 devient une erreur générique et la session reste morte. **Bloquant pour la PROD backend.**
- **Statut HTTP perdu.** Le rejet vaut `new Error(res.statusText)` (`:107`). Aucun appelant ne peut distinguer 404, 406 ou 503. C'est un prérequis du plan 009.
- **Promesse résolue à `undefined` après un 403** (`:102-104`). Les `onSuccess` reçoivent `undefined`, ce qui donne une TypeError puis un toast d'erreur juste avant la redirection.
- **`logOut()` sans `auth.removeUser()`.** L'utilisateur OIDC reste dans le sessionStorage, avec un risque de boucle de rechargement.
- **`Bearer null` envoyé** quand aucun jeton n'est disponible (`:94`).

Ce plan pose le socle : déconnexion fiable, erreur typée `HttpError`, messages techniques centralisés. Le plan 009 s'appuie dessus.

### Décisions 👤 (Gate #0, 2026-11-04)
| # | Sujet | Décision |
|---|---|---|
| a | Gestion du 401 | **A1 durcie** : 401 ou 403 entraîne une déconnexion **en un seul passage**, via `auth.removeUser()` puis redirection. La promesse est **rejetée** avec une `HttpError`, sans toast. A2 (`signinSilent` puis nouvel essai) est **reportée** ; on journalise `addSilentRenewError` pour mesurer si le renouvellement silencieux Google fonctionne. Aucune hypothèse sur une déconnexion vers 1 h : non constaté à date. |
| — | En-tête sans jeton | **Ne plus envoyer `Authorization`** quand il n'y a pas de jeton (fin de `Bearer null`). **À vérifier en QUA** que l'API Gateway accepte un appel sans cet en-tête. |
| b | Messages d'erreur | **B1** : `HttpError {status, statusText, body?}`. Messages **techniques** centralisés dans `callAndNotify` : 503 = « Service momentanément indisponible, réessayez », 500, réseau. Une **surcharge métier par appel** (`messagesParStatut`) sera utilisée par le plan 009. Le libellé renvoyé par le backend va uniquement en console. |
| — | Toast de session | Après la redirection : toast **« Session expirée, reconnectez-vous »** (drapeau sessionStorage lu au retour sur la page d'accueil). |
| — | ADR | ADR IHM **008** « Gestion des erreurs HTTP et de la session », `Proposée` au Gate #1, passée `Acceptée` au GO. |

---

## Phase 1 — Socle session et erreurs HTTP

### Critères de réussite
- Un 401 ou un 403 entraîne une déconnexion unique (même avec plusieurs appels en parallèle) : `removeUser()`, redirection vers `/`, puis toast « Session expirée, reconnectez-vous » au retour. Aucun toast d'erreur métier en plus.
- Toute réponse non 2xx est rejetée avec une `HttpError` qui porte le **statut**. Les erreurs réseau sont aussi des `HttpError`, sans statut, avec la cause conservée.
- Aucun en-tête `Authorization` n'est envoyé sans jeton.
- Le 503 affiche « Service momentanément indisponible, réessayez ». Les messages existants des autres erreurs restent inchangés, sauf décision contraire.
- `npm run lint`, `npm run typecheck`, `npm run build` et `npm run test:coverage` verts ; couverture ≥ 80 % sur les fichiers modifiés.

### Tâches

#### T1.1 — `HttpError` et client HTTP (DEVon)
- **Fichier(s) :** `src/main/Services/ClientHTTP.service.ts`, nouvelle classe `HttpError` (dans `Services/` ou exportée par `ClientHTTP`, selon les conventions du projet).
- **Implémenter :**
  - 2xx → JSON (inchangé).
  - 401 ou 403 → `console.warn`, puis déclenchement **unique** du gestionnaire de déconnexion (drapeau `deconnexionEnCours`), puis **rejet** avec `HttpError(401|403)`.
  - Autre code → rejet avec `HttpError(status, statusText, corps texte éventuel)`.
  - Erreur réseau → `HttpError` sans statut, avec `cause`.
  - Sans jeton (`getOAuthToken()` vide ou nul) → aucun en-tête `Authorization`.
  - Gestionnaire de déconnexion **injectable** (`setGestionnaireDeconnexion(fn)`). Par défaut, le comportement actuel `logOut()` reste en repli.
- **Acceptation :** compilation et typecheck OK ; aucun appelant cassé à la compilation.

#### T1.2 — Synchronisation de l'authentification (DEVon)
- **Fichier(s) :** `src/main/hooks/useAuthTokenSync.ts`, et la page d'accueil ou le composant racine qui affiche le toast « Session expirée » (à déterminer).
- **Implémenter :**
  - Enregistrer un gestionnaire de déconnexion qui pose le drapeau sessionStorage « session expirée », appelle `auth.removeUser()` puis `location.href = "/"`.
  - Journaliser `addSilentRenewError` en `console.warn` (mesure pour A2).
  - Au chargement de la page d'accueil : si le drapeau est présent, afficher le toast puis effacer le drapeau.
- **Acceptation :** aucune boucle de rechargement. Après déconnexion, l'utilisateur OIDC est absent du sessionStorage.

#### T1.3 — Notifications (DEVon)
- **Fichier(s) :** `src/main/Services/CallAndNotify.service.ts`.
- **Implémenter :**
  - Une `HttpError` 401 ou 403 ne produit **aucun toast**.
  - Messages techniques centralisés : 503, 500, réseau.
  - Paramètre optionnel `messagesParStatut` (compatible avec les appels existants), utilisé par le plan 009.
  - Ne jamais afficher le libellé du backend (console uniquement).
- **Acceptation :** les appels existants compilent sans modification.

#### T1.4 — Tests (QALvin)
- **Fichier(s) :** `ClientHTTP.service.test.ts`, `CallAndNotify.service.test.ts`, `useAuthTokenSync.test.tsx` (emplacements selon `conventions-qa`).
- **Couvrir :**
  - 401 et 403 → déconnexion et rejet `HttpError` ;
  - **3 × 401 en parallèle → une seule déconnexion** ;
  - 404, 500, 503 → `HttpError` avec le bon statut ;
  - 2xx → JSON ;
  - absence de jeton → pas d'en-tête ;
  - erreur réseau → `cause` conservée ;
  - `callAndNotify` : pas de toast sur 401/403, message 503, `messagesParStatut` prioritaire ;
  - `useAuthTokenSync` : gestionnaire enregistré, `removeUser` appelé, `addSilentRenewError` journalisé ;
  - toast « Session expirée » affiché une seule fois.
  - Adapter les tests existants qui attendent une résolution `undefined` sur 403 ou `'Error: …'`.
- **Scénarios manuels QUA**, à exécuter par le 👤 :
  - jeton expiré ;
  - F5 sur `#/budgets` ;
  - `/` sans session ;
  - appel sans en-tête accepté par l'API Gateway ;
  - aucune boucle de rechargement.
- **Acceptation :** `npm run test:coverage` vert ; couverture ≥ 80 % sur les fichiers modifiés ; preuve de détection de régression (neutraliser la garde de déconnexion unique : le test passe au rouge).

#### T1.5 — Documentation (DOCly)
- **Fichier(s) :** `docs/ARCHITECTURE.md` (règle « 403 → logout » remplacée par la nouvelle gestion des erreurs et de la session), ADR IHM 008 `Acceptée` au GO du Gate #1, wiki IHM `Historique-de-l'Architecture.md`, liens vers ADR-005 et ADR-008 serverless.

---

## Dépendances
```
Gate #1 → T1.1 → (T1.2 ∥ T1.3) → Gate #2 → T1.4 → Gate #3 → T1.5 → Gate #4
→ merge + PROD IHM (👤) → plan 009 → PROD backend (plans serverless 004 + 005)
```

## Critères de succès globaux
1. Un 401 ou un 403 provoque une déconnexion unique et propre, suivie du toast « Session expirée ».
2. `HttpError` avec statut disponible pour tous les appelants (socle du plan 009).
3. Aucun en-tête `Authorization` sans jeton ; appel accepté par l'API Gateway (QUA).
4. Tests verts, couverture ≥ 80 %, SonarCloud OK.
5. En PROD avant la PROD backend.

## Risques
- Boucle de rechargement si un 401 persiste malgré une session OIDC locale valide. Mitigé par `removeUser`, la déconnexion unique et la suppression de `Bearer null`. Test QUA dédié.
- API Gateway qui exigerait l'en-tête `Authorization` : à vérifier en QUA. Repli : conserver `Bearer null` uniquement sur les appels publics.
- Saisie en cours perdue quand la session expire : risque accepté (A2 reportée).
- Préexistants, hors périmètre, signalés : `client_secret` OIDC présent dans le bundle front (`Main.tsx:47`) ; appels de `MainPage` lancés avant `isAuthenticated`.

---

## 🚦 Journal des gates

| Gate | Date | Objet | Décision | Notes |
|---|---|---|---|---|
| — | 2026-10-25 | Création (issue du Gate #2 serverless 004) | ℹ️ | Décision 👤 : traiter le 401 côté IHM, dans un plan dédié |
| #0 | 2026-11-04 | Choix de solution (cadrage ARCos) | ✅ GO | A1 durcie (A2 reportée, mesure via `addSilentRenewError`) ; plus d'en-tête sans jeton (à vérifier en QUA) ; B1 `HttpError` + messages centralisés ; toast « Session expirée » ; deux plans (008 puis 009) ; ADR IHM 008 |
| #1 | 2026-11-04 | Validation du plan + ADR 008 | ✅ GO | ADR IHM 008 → `Acceptée`. Branche `feat/ihm-008-session-erreurs-http` depuis `origin/master` |
