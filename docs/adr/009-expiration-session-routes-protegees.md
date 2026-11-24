# ADR 009 — Expiration de session et routes protégées

**Date :** 2026-11-24  
**Statut :** Acceptée (Gate #1 GO du 2026-11-24)  
**Décideurs :** 🟠 ARCos + 👤 Développeur humain

---

## Contexte

Les routes `/budgets`, `/recurrents` et `/analyses` ne sont pas protégées dans `src/main/Main.tsx`. Le retour sur un onglet et la navigation ne détectent pas l'expiration de la session.

`useAuthTokenSync` synchronise l'`id_token` et enregistre le gestionnaire de déconnexion : `auth.removeUser()`, pose du drapeau d'expiration, puis `location.href = "/"`. `ClientHTTP.service.ts` déclenche une déconnexion unique sur une réponse 401 ou 403 concernant le jeton courant. La garde contre les réponses portant sur un ancien jeton protège notamment le renouvellement concurrent, conformément à la note de mise en œuvre de l'[ADR 008](008-gestion-erreurs-http-et-session.md).

Ce mécanisme réactif ne suffit pas à bloquer une première action ou une navigation lorsque la session a expiré pendant l'inactivité. Il faut détecter cette expiration avant les effets protégés, sans perturber une session valide ni le renouvellement silencieux existant.

---

## Décision

**Nous avons décidé de** vérifier l'expiration au retour du focus ou de la visibilité de l'onglet ainsi que dès la première interaction, et de bloquer la navigation et les requêtes protégées avant tout effet si la session est expirée, en réutilisant la déconnexion existante et le retour à l'accueil public.

Choix humain : **GO au Gate #0 le 2026-11-24**, après présentation par MAINa de l'analyse ARCos. Plan et ADR validés au **Gate #1 le 2026-11-24**.

- Protéger `/budgets`, `/recurrents` et `/analyses`, y compris lors d'un accès direct.
- Contrôler la première interaction souris ou clavier assez tôt pour empêcher l'action protégée en cas d'expiration.
- Maintenir `automaticSilentRenew`, la sémantique actuelle des 401/403 et la garde contre les réponses d'un ancien jeton.
- Conserver l'absence de déconnexion sur une erreur réseau.
- Réutiliser les mécanismes existants ; aucune nouvelle bibliothèque.

**Non-objectifs :** prolonger la durée de session, modifier le backend ou changer la politique de traitement des 403.

---

## Alternatives Considérées

### Option 1 : Vérifications événementielles et gardes avant effet ✅ Retenue

- **Avantages** :
  - Détection au retour sur l'application et dès la première interaction.
  - Blocage des navigations et requêtes protégées avant effet.
  - Réutilisation de la déconnexion existante sans nouvelle bibliothèque.
- **Inconvénients** :
  - Capture des événements à concevoir pour bloquer la première action expirée sans perturber une session valide.
  - Coordination nécessaire entre chargement OIDC, renouvellement, garde de routes et client HTTP.
  - Nouveaux tests ciblés sur les événements et les gardes.

### Option 2 : Surveillance temporelle périodique

- **Avantages** : contrôle régulier de l'expiration sans attendre une interaction.
- **Inconvénients** :
  - Throttling des temporisateurs dans les onglets inactifs.
  - Courses avec le renouvellement du jeton.
  - Complexité supplémentaire de synchronisation et de gestion du cycle de vie.
- **Raison du rejet** : complexité supérieure face au besoin de bloquer les effets au retour et à la première action ; option événementielle retenue par le choix humain.

---

## Conséquences

### Positives

- Une session expirée ne doit plus permettre une navigation ou une requête protégée avant sa détection.
- Déconnexion et retour à l'accueil public restent centralisés.
- Renouvellement silencieux et protections contre les réponses obsolètes conservés.

### Négatives / Compromis

- Saisie en cours perdue à l'expiration, comme déjà accepté dans l'ADR 008.
- Tests supplémentaires requis pour les événements, les routes et les requêtes protégées.
- Risque de déconnexion prématurée si la vérification utilise une source d'expiration inadéquate ou entre en concurrence avec le renouvellement.

### Neutres

- Aucun changement de bibliothèque, de backend ou de politique 403.
- Mise à jour de `docs/ARCHITECTURE.md` et note de mise en œuvre de cet ADR réalisées en Phase 3 (voir ci-dessous).

---

## Mise en œuvre

Travaux prévus dans le plan workspace 007, à créer par MAINa dans le même lot :

- **DEVon — T1.1** : adapter `src/main/hooks/useAuthTokenSync.ts` et `src/main/Services/Auth.service.ts` ; réutiliser les helpers dans `src/main/Services/ClientHTTP.service.ts` pour contrôler les requêtes protégées avant envoi et conserver la déconnexion unique.
- **DEVon — T1.2** : protéger les routes dans `src/main/Main.tsx`, avec un composant de garde minimal si nécessaire.
- **QALvin — T2.1 / T2.2** : tests ciblés du hook, du client HTTP et des routes, couvrant notamment les événements, la première action, le renouvellement et les réponses d'un ancien jeton.
- **DOCly — T3.1** : mettre à jour `docs/ARCHITECTURE.md` et ajouter une note de mise en œuvre à cet ADR sur la base des résultats effectivement validés.
- **Date d'effet** : après implémentation et validation des travaux prévus (voir la note de mise en œuvre ci-dessous).

### Note de mise en œuvre (Phase 3, 2026-11-24)

Implémenté et validé (Gates #2 et #3 `GO`) ; l'ADR reste `Acceptée`. Description détaillée : [ARCHITECTURE.md — Expiration de session détectée côté client](../ARCHITECTURE.md#expiration-de-session-détectée-côté-client-plan-007).

- **Source d'expiration** (risque 1 confirmé) : claim `exp` du JWT `id_token` transmis (`estTokenExpire`, `Auth.service.ts`), décodé localement sans vérification de signature. Jeton absent, opaque, malformé ou sans `exp` valide : indéterminé, non traité comme expiré (le serveur tranche).
- **Garde commune** `verifierSessionExpiree` (`ClientHTTP.service.ts`) : réutilise la déconnexion unique existante (`deconnexionEnCours`, gestionnaire de `useAuthTokenSync`, `removeUser`, retour à `/`, toast au retour).
- **Événements** (`useAuthTokenSync.ts`) : contrôle au `focus` et au retour `visible`, et à la première interaction via listeners **capture** sur `window` (`pointerdown/up`, `mousedown/up`, `click`, `dblclick`, `contextmenu`, `keydown/keypress/keyup`, `submit`) qui annulent l'événement (`preventDefault` + `stopImmediatePropagation`) si la session est expirée. `mousemove` non écouté. Armement seulement après la fin du chargement OIDC (`isLoading` / `activeNavigator`), listeners retirés au démontage. Le jeton du stockage prime sur l'ancien jeton capturé (pas de déconnexion sur un jeton renouvelé).
- **Transport** (`ClientHTTP.call`) : jeton expiré ou déconnexion en cours → `HttpError(401, "Session expirée")` sans `fetch` ; seul `GET /_info` (public) reste permis, sans `Authorization` dans ce cas.
- **Routes** : `/budgets`, `/recurrents`, `/analyses` sous `RequireAuth` (`Components/shared/RequireAuth.component.tsx`, `Main.tsx`) ; `/`, `/infos` et callback OIDC publics ; chargement OIDC = indicateur sans montage ; non authentifié → `Navigate` vers `/`.
- **Inchangés** : `automaticSilentRenew`, politique 401/403 et garde ancien jeton (ADR 008), absence de logout sur erreur réseau / 5xx / échec isolé de renouvellement ; aucun changement backend ni dépendance.
- **Limites** : pas de surveillance périodique (détection au focus, visibilité, première interaction listée, navigation protégée ou prochain appel protégé) ; saisie perdue à l'expiration ; dépend de l'horloge locale ; signature non vérifiée côté client (le serveur reste l'autorité) ; tests avec OIDC simulé, sans navigateur réel.
- **Preuves QA** : 11 fichiers / 118 tests Vitest verts ; typecheck, lint, build OK ; couverture des fichiers modifiés 93,1 % instructions / 87,6 % branches ; régression démontrée (4 fichiers de tests sur 5 échouent avec le code antérieur, 5/5 verts après restauration).

### Risques et points à confirmer

- Confirmer la source d'expiration pertinente pour l'`id_token` réellement transmis aux services ; ne pas supposer qu'une autre métadonnée de jeton lui correspond.
- Éviter toute déconnexion prématurée pendant le renouvellement ; prendre en compte le jeton courant et préserver la garde contre les réponses obsolètes.
- Vérifier que la capture des événements bloque la première action souris ou clavier avant ses effets lorsque la session est expirée, sans casser les interactions d'une session valide.
- Distinguer l'attente de chargement OIDC d'une visite sans authentification afin de ne pas traiter prématurément une session en cours de chargement comme expirée ou absente.

---

## Références

- [ADR 008 — Gestion des erreurs HTTP et de la session](008-gestion-erreurs-http-et-session.md), acceptée ; voir également sa note de mise en œuvre.
- [Plan d'Action workspace 007 — Expiration de session IHM](../../../.claude/plans/007_expiration-session-ihm.plan.md).
- [ARCHITECTURE.md](../ARCHITECTURE.md) — section « Expiration de session détectée côté client ».
