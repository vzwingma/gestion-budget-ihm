# ADR 008 — Gestion des erreurs HTTP et de la session

**Date :** 2026-11-04
**Statut :** Acceptée (Gate #1 GO 👤 du plan 008, 2026-11-04)
**Décideurs :** 🟠 ARCos + 👤 Développeur humain

---

## Contexte

Le backend `gestion-budget-serverless` change son contrat d'erreurs :

- `quarkus-oidc` valide les jetons Google (ADR-005 serverless). Un jeton absent ou invalide reçoit un **401** (avant : 403).
- `/_info` est public et répond 200 quel que soit le jeton (ADR-008 serverless).
- Les erreurs MongoDB renvoient un **503**.
- Nouveaux codes métier : virement 406 / 400 / 404 ; compte inactif → 200 avec le dernier budget.

État de l'IHM constaté par ARCos (master 6bd7757) :

- `ClientHTTP.service.ts:100-108` ne déconnecte que sur 403 : un 401 laisse la session morte.
- Après un 403, la promesse est résolue avec `undefined` : les `onSuccess` reçoivent `undefined`, d'où une TypeError et un toast d'erreur parasite avant la redirection.
- Le statut HTTP est perdu (`new Error(res.statusText)`, `:107`) : aucun appelant ne distingue 404, 406 ou 503.
- `logOut()` n'appelle pas `auth.removeUser()` : l'utilisateur OIDC reste en sessionStorage, avec un risque de boucle de rechargement.
- `Bearer null` est envoyé quand il n'y a pas de jeton.
- `callAndNotify` affiche un message fixe, sans tenir compte du statut.

Ce correctif est **bloquant pour la PROD backend** : l'IHM doit être en PROD avant elle.

## Décision

**Nous avons décidé de** durcir la gestion de la session (option A1) et de typer les erreurs HTTP (option B1) :

1. **Session (A1 durcie)** :
   - Un 401 ou 403 déclenche une déconnexion en **un seul passage** (drapeau anti-réentrance, même avec plusieurs appels parallèles).
   - Le gestionnaire de déconnexion est **injectable** et enregistré par `useAuthTokenSync` : `auth.removeUser()`, pose d'un drapeau sessionStorage, puis `location.href = "/"`. Au retour sur la page d'accueil, un toast « Session expirée, reconnectez-vous » est affiché.
   - La promesse est **rejetée** avec une `HttpError`, sans toast.
   - Plus d'en-tête `Authorization` sans jeton (fin de `Bearer null`) ; acceptation par l'API Gateway à vérifier en QUA.
   - `addSilentRenewError` est journalisé (`console.warn`) pour mesurer le renouvellement silencieux.
2. **Erreurs (B1)** :
   - Classe `HttpError {status, statusText, body?}` pour toute réponse non 2xx ; une erreur réseau est une `HttpError` sans statut, avec `cause`.
   - Messages **techniques** centralisés dans `callAndNotify` : 503 « Service momentanément indisponible, réessayez », 500, réseau.
   - Surcharge métier **par appel** via un paramètre optionnel `messagesParStatut`.
   - Le libellé renvoyé par le backend va en console uniquement.

---

## Alternatives Considérées

### Option 1 : A1 durcie + B1 ✅ Retenue

- **Avantages** :
  - Session fiable : déconnexion unique, `removeUser` évite la boucle de rechargement.
  - Plus de toast parasite ni de résolution à `undefined`.
  - Statut disponible pour tous les appelants (socle du plan 009).
  - Messages techniques cohérents et centralisés.
- **Inconvénients** :
  - Signature de `callAndNotify` enrichie (paramètre optionnel, compatible).
  - Saisie en cours perdue à l'expiration de la session.
  - Tests existants à adapter.

### Option 2 : A2 — `signinSilent` puis nouvel essai, `logOut` en cas d'échec

- **Avantages** : session prolongée sans interruption si le renouvellement réussit.
- **Inconvénients** :
  - Apport nul si l'iframe Google ne fonctionne pas (même mécanisme que `automaticSilentRenew`).
  - Attente pouvant atteindre 10 s.
  - Couplage entre `ClientHTTP` et le UserManager.
  - Risque de boucle.
- **Raison du report** : bénéfice incertain. À réévaluer selon la mesure fournie par `addSilentRenewError`.

### Option 3 : B2 — traitement des erreurs au cas par cas dans chaque appelant

- **Avantages** : aucun socle commun à introduire.
- **Inconvénients** : duplication et oublis probables.
- **Raison du rejet** : impossible de toute façon sans statut dans l'erreur ; la duplication entraînerait des oublis.

### Option 4 : B3 — afficher le libellé renvoyé par le backend

- **Avantages** : aucun message à maintenir côté IHM.
- **Inconvénients** : libellés techniques, fuite d'information, couplage au texte du backend.
- **Raison du rejet** : exposition d'informations internes et dépendance à un texte non contractuel.

---

## Conséquences

### Positives
- Session fiable : déconnexion unique et propre, plus de boucle de rechargement.
- Plus de toast parasite lors d'un 401/403.
- Statut HTTP disponible pour le plan 009 (codes métier du virement, etc.).

### Négatives / Compromis
- Signature de `callAndNotify` enrichie (paramètre optionnel `messagesParStatut`, compatible avec les appels existants).
- Saisie en cours perdue à l'expiration de la session (risque accepté, A2 reportée).
- Tests existants à adapter : `resolves.toBeUndefined()` sur 403, assertions `'Error: …'`.

### Neutres
- Le plan 009 utilisera `messagesParStatut`.
- A2 reste possible plus tard, sans remise en cause de cette décision.
- `docs/ARCHITECTURE.md` à mettre à jour (règle « 403 → logout » remplacée).

---

## Mise en œuvre

- **Fichiers impactés** : `src/main/Services/ClientHTTP.service.ts`, nouvelle classe `HttpError`, `src/main/Services/CallAndNotify.service.ts`, `src/main/hooks/useAuthTokenSync.ts`, page d'accueil (toast « Session expirée »).
- **Tâches de suivi** : plan 008, tâches T1.1 à T1.5 (DEVon — T1.1 à T1.3, QALvin — T1.4, DOCly — T1.5).
- **Date d'effet** : au merge du plan 008, avant la PROD backend.
- **Statut de l'ADR** : `Proposée` au Gate #1, passée `Acceptée` au `GO`.

---

## Références

- ADR-005 du dépôt `gestion-budget-serverless` : `docs/adr/005-*.md` (validation des jetons par `quarkus-oidc`)
- ADR-008 du dépôt `gestion-budget-serverless` : `docs/adr/008-*.md` (`/_info` public)
- Plan d'Action IHM 008 : [`.claude/plans/008_gestion_401_auth_oidc_backend.plan.md`](../../.claude/plans/008_gestion_401_auth_oidc_backend.plan.md)
- Plan d'Action IHM 009 : `.claude/plans/009_impacts_ihm_phase1_backend.plan.md`
