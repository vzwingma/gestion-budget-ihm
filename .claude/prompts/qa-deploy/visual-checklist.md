# Checklist de validation visuelle — Staging

> Environnement : QUA ou PROD (à confirmer selon le déploiement)
> Compte de test : utilisateur normalement connecté en SSO sur Chrome 

## Règles générales (à vérifier sur chaque page)

- Aucune erreur dans la console (pattern : `error`, `failed`, `404`, `500`)
- Aucun élément visuellement cassé : texte tronqué, image manquante, chevauchement
- Le footer et le header sont présents et alignés

---
# Scénario de test — Vérification fonctionnelle de l'application "Gestion de budgets"

## URL de départ
- Variable selon l'environnement testé : QUA ou PROD

---

## Scénario 1 — Vérification technique des versions déployées

### Prérequis
- Aucun, cette vérification peut se faire avant authentification.

### Étapes à réaliser
1. **Accéder à la page d'accueil**
   - Naviguer vers l'URL de départ.
   - *Résultat attendu* : la page d'accueil "Gestion de budgets" s'affiche avec le visuel (calculatrice, montant, illustration graphique).

2. **Cliquer sur la grosse image centrale** (illustration calculatrice/budget).
   - *Résultat attendu* : un tableau apparaît sous l'illustration, listant 5 lignes correspondant aux modules de l'application (IHM et API) avec leur numéro de version associé.

3. **Contrôler le contenu du tableau**
   - Vérifier que les 5 lignes suivantes sont présentes : `IHM`, `API Comptes`, `API Utilisateurs`, `API Opérations`, `API Paramétrages`.
   - Vérifier que chaque ligne affiche un numéro de version valide (format `X.Y.Z`).
   - *Résultat attendu* : aucune ligne n'affiche "N/A" ou une valeur vide ; toutes les versions affichées sont identiques entre elles (cohérence de déploiement), par exemple `26.0.0`.

### Critère de validation
- Le tableau doit contenir exactement 5 lignes avec des numéros de version réels et cohérents entre les modules IHM/API.

---

## Scénario 2 — Vérification fonctionnelle de la navigation

### Prérequis
- Disposer d'une session Google active dans le navigateur (authentification via SSO Google).

### Étapes à réaliser

1. **Accéder à la page d'accueil**
   - Naviguer vers l'URL de départ.
   - *Résultat attendu* : la page d'accueil "Gestion de budgets" s'affiche avec le visuel (calculatrice, montant, illustration graphique).

2. **S'authentifier**
   - Cliquer sur l'icône de profil en haut à droite de l'écran.
   - *Résultat attendu* : l'authentification SSO Google s'effectue automatiquement (session déjà active), sans demande de mot de passe. La barre de menus apparaît (Accueil, Opérations, Abonnements & charges, Analyses) ainsi que la date de dernière connexion et la photo de profil.

3. **Vérifier le menu "Opérations"**
   - Cliquer sur "Opérations".
   - Sélectionner un compte dans la liste de gauche (ex : "Compte Courant").
   - *Résultat attendu* : la liste des comptes s'affiche avec leurs soldes. Après sélection d'un compte, la liste détaillée des opérations (libellé, catégorie, montant, date) s'affiche dans le panneau central.

4. **Vérifier le menu "Abonnements & charges"**
   - Cliquer sur "Abonnements & charges".
   - *Résultat attendu* : la liste des opérations récurrentes mensuelles (assurances, énergie, banque, abonnements, etc.) s'affiche avec leurs montants et catégories.

5. **Vérifier le menu "Analyses"**
   - Cliquer sur "Analyses".
   - *Résultat attendu* : le tableau de bord s'affiche avec : synthèse par types d'opérations (barre de répartition), treemap des catégories, graphique d'évolution du solde, tableau de synthèse par catégories, et liste détaillée des opérations du mois.

6. **Retour à l'accueil**
   - Cliquer sur "Accueil".
   - *Résultat attendu* : retour à la page d'accueil initiale, sans erreur.

### Critères de validation globaux
- Aucun menu ne doit afficher de page blanche, d'erreur JavaScript visible ou de blocage prolongé.
- Les montants et données affichés doivent être cohérents (pas de valeurs nulles inattendues, pas de `NaN`, pas de libellés manquants).
- Un léger délai de chargement (spinner) est acceptable au premier affichage des soldes de comptes, tant qu'il se résout en quelques secondes.

### Points de vigilance observés lors des exécutions précédentes
- Icônes de comptes pouvant apparaître temporairement en blanc/vide avant chargement complet (non bloquant).
- Différences de données normales entre environnements (ex. comptes "Non initialisé" en test vs soldes réels en PROD).