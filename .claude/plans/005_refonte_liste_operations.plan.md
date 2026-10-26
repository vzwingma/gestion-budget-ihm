# Plan d'Action 005 — Refonte panneau gauche écran « Opérations »

**Statut** : 🟡 En cours — Phases 1–5 terminées (reste recette tablette réelle)
**Date** : 2026-10-23 (dernière mise à jour : 2026-10-25)

## Journal des gates

| Gate | Périmètre | Date | Décision |
|---|---|---|---|
| #0 | Choix solution | 2026-10-23 | ✅ GO |
| #1 | Validation plan | 2026-10-23 | ✅ GO |
| #2 | Code Phase 1 | 2026-10-25 | ✅ GO |
| #3 | Tests Phase 1 | 2026-10-25 | ✅ GO |
| #4 | Doc + clôture Phase 1 | 2026-10-25 | ✅ Validé 👤 (2026-10-25) |
| #2 | Code Phase 2 | 2026-10-25 | ✅ GO |
| #3 | Tests Phase 2 | 2026-10-25 | ✅ GO |
| #4 | Doc + clôture Phase 2 | 2026-10-25 | ✅ Validé 👤 (recette visuelle OK, PR #688 mergée ; recette : lignes écrasées corrigées `a138bc2`, fond du ☰ assombri 0.3→0.65 `8b019a4`, props mortes Sonar retirées `58ecf08`) |
| #2 | Code Phase 3 | 2026-10-25 | ✅ GO |
| #3 | Tests Phase 3 | 2026-10-25 | ✅ GO |
| #4 | Doc + clôture Phase 3 | 2026-10-25 | ✅ Validé 👤 (recette visuelle OK ; backlog B1 ajouté) |
| #2 | Code Phase 4 | 2026-10-25 | ✅ GO |
| #3 | Tests Phase 4 | 2026-10-25 | ✅ GO |
| #4 | Doc + clôture Phase 4 | 2026-10-25 | ✅ Validé 👤 (recette visuelle OK, PR #697 mergée, CI 13/13 verte ; filtre conservé dans le Context tel quel, pas d'ADR) |
| #2 | Code Phase 5 | 2026-10-25 | ✅ GO |
| #3 | Tests Phase 5 | 2026-10-25 | ✅ GO |
| #4 | Doc + clôture Phase 5 | — | ⏳ En attente 👤 |

## Context

Analyse Claude Chrome de l'écran **Opérations** a identifié des défauts d'ergonomie et de lisibilité sur le panneau gauche (en-tête + liste groupée par date). Rôle de cet écran : repérer et sélectionner vite, au fil du mois, les opérations prévues à valider — la validation se fait dans le panneau de détail (hors périmètre, inchangé). Plan source fourni par l'utilisateur (`plan-refonte-liste-operations.md`), découpé en 5 lots correctifs/d'évolution, chacun livrable en branche/PR séparée, testé sur ordinateur (1280px) et tablette tactile paysage (1024×768).

**Contraintes transverses** : ne pas changer les couleurs des anneaux d'état (orange=prévue, violet=reportée, vert=validée, blanc=annulée) ; garder thème sombre + couleurs icônes catégories ; aucune info accessible uniquement au survol sur tablette ; cibles tactiles ≥44×44px ; contraste texte liste ≥ WCAG AA 4.5:1 ; aucune modification de logique métier/données sans validation préalable ; hors périmètre : panneau de détail, onglets du haut, calcul des soldes, API/modèle de données, actions de validation depuis la liste, sortie navigation compte/mois hors du ☰.

**Décisions validées (Gate #0/#1, via AskUserQuestion)** :
1. Couleur de sélection de ligne (Phase 2) = bleu accent thème MUI, distinct des 4 couleurs d'état.
2. Ouverture ☰ (Phase 1) : ne plus réinitialiser `selectedCompte` à `null` — budget reste visible derrière le menu transparent.
3. Groupe « À valider » (Phase 3) = opérations `PREVUE` ou `REPORTEE` **sans date** (`autresInfos.dateOperation == null`). Une `PREVUE`/`REPORTEE` **avec** date reste dans son groupe de date ; `PLANIFIEE` exclue ; `REALISEE`/`ANNULEE`/`SUPPRIMEE` sans date restent sous la clé `"null"` sans en-tête. Une opération validée qui redevient prévue (date remise à `null`) rejoint « À valider » ; si on lui remet une date, elle retourne dans son groupe de date. (Formulation initiale « par état, indépendamment de la date » caduque.)
4. Tooltip description ligne intercompte (Phase 5) : tap/clic dédié sur la ligne, reste dans le périmètre liste.

## Dépendances entre phases

Phase 1 → 2 → 3 → 4 → 5, strictement séquentiel (chaque phase = 1 branche/1 PR livrable seule) :
- Phase 1 d'abord : bugs isolés, base propre avant refactors de ligne/liste.
- Phase 2 avant 3 : fige la hauteur de ligne avant d'ajouter des en-têtes de groupe.
- Phase 3 avant 4 : Phase 4 réutilise la notion « à valider » introduite en Phase 3 (règle à re-trancher, voir point ouvert Phase 4).
- Phase 4 avant 5 : les deux touchent `BudgetPageHeader`.

---

## Phase 1 — Correctifs ✅ (terminée 2026-10-25)

**Critères de réussite** : clic ⊗ vide le champ sans ouvrir de tooltip (focus conservé) ; Échap/clic extérieur/bouton ferment le ☰ ; fond visible derrière le ☰ (budget courant, pas de noir) ; compte sélectionné visuellement identifiable ; aucun saut de layout au filtrage. Vérifié desktop 1280px + tablette 1024×768 tactile.

- **T1.1** ✅ — Corriger bouton ⊗ du filtre : `IconButton` ≥44×44px, `aria-label`, `stopPropagation`, refocus input. Fichier : `src/main/Components/budgets/shared/OperationsFiltre.component.tsx`. Vérifier chevauchement layout avec `BudgetPageHeader.component.tsx`. **Agent : DEVon.**
- **T1.2** ✅ — Scrollbar stable + style sombre : `scrollbarGutter:"stable"` + règles `::-webkit-scrollbar*` scopées. Fichiers : `src/main/Components/budgets/operations/OperationsListe.shared.tsx`, `public/styles/application.css`. **Agent : DEVon.**
- **T1.3** ✅ — Panneau ☰ : `onClose` (Échap + clic hors-zone natifs), bouton fermeture visible ≥44×44px, backdrop translucide, ne plus vider `selectedCompte` à l'ouverture, mise en évidence compte actif. Fichiers : `src/main/Components/mainpages/MainPage.component.tsx`, `src/main/Components/mainpages/menuSlideBar/CompteItem.component.tsx`. **Agent : DEVon.**
- **T1.4** ✅ — Tests non-régression (filtre, ☰, scrollbar). **Agent : QALvin.**

### Résultats Phase 1

**Fichiers source modifiés (6)** :
- `src/main/Components/budgets/shared/OperationsFiltre.component.tsx`
- `src/main/Components/budgets/operations/OperationsListe.shared.tsx`
- `public/styles/application.css`
- `src/main/Components/mainpages/MainPage.component.tsx`
- `src/main/Components/mainpages/menuSlideBar/CompteItem.component.tsx`
- `src/main/Components/Components.props.ts`

**Tests ajoutés (4 fichiers, 16 tests)** : `OperationsFiltre.component.test.tsx`, `OperationsListe.shared.test.tsx`, `MainPage.component.test.tsx`, `CompteItem.component.test.tsx`.

**Preuves** :
- `npm run lint` : 0 erreur.
- Suite de tests : 135/139 verts ; 4 échecs **préexistants** (`Auth.service.test.ts`, localStorage), sans lien avec la phase.
- Typecheck : erreurs **préexistantes** (`OperationDetailPage.component.tsx`, `vite.config.ts`), non introduites par la phase.

**Points ouverts** :
- Échap testé via le bouton fermer seulement ; clic backdrop non testé.
- Vérification visuelle desktop 1280 / tablette 1024×768 non faite : chevauchement ⊗ / tooltip soldes confirmé par lecture de code uniquement.
- Couleur de mise en évidence du compte actif (`#1a3a4a` + bordure `var(--color-accueil-primary)`) à valider visuellement.
- Comportement « clic sur compte déjà sélectionné » à vérifier manuellement : l'ouverture du ☰ ne vide plus `selectedCompte`.
- Stash résiduel `devon-t1-wip-check` à supprimer par le 👤 (règle : aucun agent ne supprime).

---

## Phase 2 — Lisibilité des lignes ✅ (terminée 2026-10-25, Gate #4 validé)

**Critères de réussite** : toutes les lignes même hauteur (avec/sans commentaire) ; montants alignés à la virgule ; ≥11 lignes visibles sur 881px de haut ; sélection visuellement plus marquée que survol.

- **T2.1** ✅ — Hauteur de ligne fixe ≈64px homogène (remplace `isMobile?60:90`), ajuster `Divider` pour atteindre ≥11 lignes/881px. Fichier : `src/main/Components/budgets/operations/courantes/OperationsListItem.shared.tsx`. **Agent : DEVon.**
- **T2.2** ✅ — Libellé taille/graisse fixes (bug : commentaire a `fontSize` explicite, libellé non), ellipse une ligne. Fichier : `src/main/Utils/renderers/OperationItem.renderer.tsx`. **Agent : DEVon.**
- **T2.3** ✅ — Sous-texte catégorie : contraste AA (éclaircir `#808080` si <4.5:1), ellipse. Fichier : `OperationsListItem.shared.tsx`. **Agent : DEVon.**
- **T2.4** ✅ — Montants : `tabular-nums`, éclaircir `--color-credit`/`--color-depense` pour AA. Fichiers : `src/main/Utils/renderers/OperationValue.renderer.tsx`, `application.css`. **Agent : DEVon.**
- **T2.5** ✅ — Anneau d'état : épaisseur ≈3px uniforme, `aria-label` via nouvelle fonction `getOperationStateLabel(etat)` — **sans changer les couleurs**. Fichier : `OperationItem.renderer.tsx`. **Agent : DEVon.**
- **T2.6** ✅ — Logo banque : taille relative (`em`), centrage vertical fiable, jamais de retour à la ligne du commentaire. Fichier : `OperationItem.renderer.tsx`. **Agent : DEVon.**
- **T2.7** ✅ — Sélection/survol : barre verticale bleu accent MUI + fond teinté > survol ; neutraliser survol tactile (`@media (hover:hover)`). Fichier : `OperationsListItem.shared.tsx`. **Agent : DEVon.**
- **T2.8** ✅ — Tests non-régression (hauteur ligne, troncature, contraste, sélection/survol). **Agent : QALvin.**

### Résultats Phase 2

**Fichiers source modifiés (4)** :
- `src/main/Components/budgets/operations/courantes/OperationsListItem.shared.tsx`
- `src/main/Utils/renderers/OperationItem.renderer.tsx`
- `src/main/Utils/renderers/OperationValue.renderer.tsx`
- `public/styles/application.css`

**Tests ajoutés (3 fichiers, 56 tests)** : `OperationItem.renderer.test.tsx` (23), `OperationValue.renderer.test.tsx` (9), `OperationsListItem.shared.test.tsx` (24).

**Correctif Phase 1** : lint des tests Phase 1 corrigé (commit `2dd5e85`, PR #687).

**Preuves** :
- `npm run lint` : 0 erreur.
- Tests renderers + opérations : 86/86 verts.

**Comportements publics nouveaux** :
- `OPERATION_ROW_HEIGHT` (64px) : hauteur de ligne fixe.
- `explicitPlus` : prop de `OperationValue`.
- `getOperationStateLabel(etat)` : Prévue / Reportée / Réalisée / Annulée / Supprimée / Planifiée / « État inconnu ».
- Anneau d'état : `role="img"` + `aria-label`.
- Classes CSS `.operation-list-item` / `.operation-list-item--selected`.
- Variable CSS `--color-operation-subtext`.

**Incident** : bug `} else {` perdu dans `getOperationLibelleWithComment` (`OperationItem.renderer.tsx`), détecté par QALvin (T2.8), corrigé avant Gate #3.

**Décisions** :
- Libellé d'état REALISEE = « Réalisée » (harmonisé avec le filtre d'analyses).
- Signe moins resté ASCII « - » (formatage partagé `addEndingZeros`).
- Séparateur de milliers de `addEndingZeros` : hors périmètre.
- Props `getOperationsColor` / `getSelectedOperationColor` de `SharedOperationItem` dépréciées : sélection bleue partout, y compris liste récurrente.

**Points ouverts** :
- Effets de bord visuels à contrôler à l'œil : écran détail, fiche récurrente, analyse, soldes/tooltips (nouvelles couleurs montants + `tabular-nums`).
- « 11 lignes visibles sur 881px » = calcul (11×65px ≤ 741px), non mesuré.
- Contrastes calculés à la main, non mesurés.
- Recette visuelle desktop 1280 / tablette 1024×768 à faire.
- 3 fichiers `*.bak_qal` à supprimer par le 👤 (aucun agent ne supprime).
- Stash `devon-t1-wip-check` toujours à supprimer par le 👤.

---

## Phase 3 — Repérage des prévues « À valider » ✅ (terminée 2026-10-25, Gate #4 validé)

Liste reste informative — pas de bouton/geste d'action sur les lignes.

**Règle « À valider »** : opérations `PREVUE` ou `REPORTEE` **sans date** (`autresInfos.dateOperation == null`), regroupées en tête. `PREVUE`/`REPORTEE` avec date → groupe de date. `PLANIFIEE` exclue. `REALISEE`/`ANNULEE`/`SUPPRIMEE` sans date → clé `"null"`, sans en-tête.

**Critères de réussite** : titre/compteur/total justes et à jour après validation/report/annulation ; sous-totaux par date justes.

- **T3.1** ✅ — Revoir `getOperationsGroupedByDateOperation` : extraire en tête de liste les `PREVUE`+`REPORTEE` **sans date**, grouper le reste par date. Fichier : `src/main/Components/budgets/budget/Budget.controller.ts`. **Agent : DEVon.**
- **T3.2** ✅ — Nouveau composant `OperationsListHeader` : titre « À valider · N · total » ou « jour date · sous-total ». Fichiers : nouveau `src/main/Components/budgets/operations/OperationsListHeader.component.tsx`, `OperationsListe.shared.tsx`, `OperationsListe.component.tsx`. **Agent : DEVon.**
- **T3.3** ✅ — Total/compteur dérivés des opérations filtrées, recalcul automatique via `handleBudgetUpdate` existant (pas de nouveau state). **Agent : DEVon.**
- **T3.4** ✅ — Vérification manuelle sélection après validation (comportement natif attendu, pas de dev supplémentaire) — capture avant/après. **Agent : QALvin.**
- **T3.5** ✅ — Tests non-régression (titre/compteur/total, sous-totaux, mise à jour après action). **Agent : QALvin.**

### Résultats Phase 3

**Fichiers source** :
- `src/main/Components/budgets/budget/Budget.controller.ts` — constante `GROUPE_A_VALIDER` + `getOperationsGroupedByDateOperation` (règle ci-dessus)
- `src/main/Components/budgets/operations/OperationsListHeader.component.tsx` (nouveau) — `OPERATIONS_HEADER_HEIGHT` (40px) et `getTotalLabel`
- `src/main/Components/budgets/operations/OperationsListe.shared.tsx` — prop optionnelle `renderGroupHeader`
- `src/main/Components/budgets/operations/OperationsListe.component.tsx` — branchement des en-têtes
- `src/main/Utils/Date.utils.ts` — `getLabelJourSemaineFRFromDate`

**Tests** : `Budget.controller.test.ts` (mis à jour), `OperationsListHeader.component.test.tsx` (nouveau), `OperationsListe.component.test.tsx` (nouveau), `OperationsListe.shared.test.tsx` (mis à jour), `Date.utils.test.ts` (mis à jour).

**Preuves** :
- `npm run lint` : 0 erreur.
- Suite budgets + utils : 166/166 verts ; 4 échecs préexistants locaux (`Auth.service.test.ts`), hors périmètre.

**Décisions** :
- Sous-totaux par date : excluent `ANNULEE`/`SUPPRIMEE` (validé 👤). Total « À valider » : n'exclut rien.
- En-têtes 40px : ≈10 lignes complètes visibles avec l'en-tête « À valider » (acceptable, validé 👤).
- Jour de semaine calculé localement (`getLabelJourSemaineFRFromDate`), `getLabelFRFromDate` inchangée.
- Liste récurrente inchangée.
- Signe moins resté ASCII « - ».

**Points ouverts** :
- Recette visuelle à faire : en-tête non écrasé (`flexShrink:0`) non testable en jsdom ; contraste ≈5,9:1 calculé à la main, non mesuré.
- Appel réel de `handleBudgetUpdate` après validation depuis le détail non testé (test de rerender uniquement).
- 3 fichiers `*.bak_qal` et stash `devon-t1-wip-check` à supprimer par le 👤 (aucun agent ne supprime).

---

## Phase 4 — Filtre orienté validation ✅ (terminée 2026-10-25, Gate #4 validé)

**Critères de réussite** : recherche "pharma" + puce "À valider" ne montre que les prévues/reportées correspondantes ; net juste ; "Réinitialiser" vide texte + puces.

**Point ouvert résolu (DÉCISION 👤)** : la puce « À valider » filtre **par état seul** (`PREVUE` + `REPORTEE`, avec ou sans date). Elle ne suit pas la règle du groupe « À valider » de la liste (Phase 3 : prévue/reportée sans date).

- **T4.1** ✅ — Vérifier si `Budget.component.tsx` est démonté/remonté au changement d'onglet → décider état local vs `BudgetContextProvider.tsx`. **Agent : DEVon.**
- **T4.2** ✅ — Nouveau composant `FilterChips` (État : À valider/Réalisée/Annulée ; Sens : Dépenses/Rentrées), hauteur ≥40px, combinables. Fichier : nouveau `src/main/Components/budgets/shared/FilterChips.component.tsx`. **Agent : DEVon.**
- **T4.3** ✅ — Étendre `filterOperationsList` pour combiner texte + puces (ET texte/puces, OR intra-groupe). Fichier : `OperationsListe.shared.tsx`. **Agent : DEVon.**
- **T4.4** ✅ — Barre de résultat « N opérations · net X,XX € · Réinitialiser ». Fichier : `BudgetPageHeader.component.tsx` ou nouveau sous-composant. **Agent : DEVon.**
- **T4.5** ✅ — Persistance filtres au changement d'onglet (selon T4.1). **Agent : DEVon.**
- **T4.6** ✅ — Tests non-régression (combinaison texte+puces, net, réinitialisation, persistance onglet). **Agent : QALvin.**

### Résultats Phase 4

**Fichiers créés** :
- `src/main/Utils/OperationsFilter.utils.ts` — enums `PUCE_ETAT_ENUM` / `PUCE_SENS_ENUM`, `FILTRE_OPERATIONS_VIDE`, `isFiltreActif`, `togglePuce`, `matchesPuces`, `ETATS_PAR_PUCE`
- `src/main/Components/budgets/shared/FilterChips.component.tsx` — `FilterChips`
- `src/main/Components/budgets/operations/OperationsFilterBar.component.tsx` — `OperationsFilterBar` (barre de résultat)

**Fichiers modifiés** :
- `hooks/useBudgetContext.ts`, `BudgetContextProvider.tsx` — champ `filtreOperations` + `setFiltreOperations`
- `Budget.component.tsx`, `BudgetPageHeader`, `BudgetPageShell`
- `OperationsListe.shared.tsx` — `filterOperationsList(ops, texte, puces?)`, props `filterPuces` / `reservedHeight`
- `OperationsListe.component.tsx`, `Components.props.ts`
- `ListData.renderer.utils.tsx` — `FILTER_BAR_HEIGHT` (48), `getHeightList(isMobile, reservedHeight = 0)`

**Tests** : 11 fichiers créés/complétés ; 386 tests dont 382 verts ; 4 échecs locaux préexistants (`Auth.service.test.ts`), hors périmètre. `npm run lint` : 0 erreur.

**Comportements** :
- Combinaison : ET texte × groupe État × groupe Sens ; OU intra-groupe.
- « Réalisée » = `REALISEE` seul ; « Annulée » = `ANNULEE` seul (pas `SUPPRIMEE`).
- Sens par signe de `valeur` : Dépenses < 0, Rentrées > 0 ; 0 n'est ni l'un ni l'autre.
- Barre de résultat « N opérations · net ±X,XX € · Réinitialiser » : singulier si ≤ 1, `role="status"`, affichée si texte OU puce actif.
- Net exclut `ANNULEE`/`SUPPRIMEE` (décision 👤 : conservé, y compris « net 0,00 € » avec la seule puce Annulée).
- Accessibilité : `aria-pressed`, `role="group"`, coche en plus de la couleur.
- Texte d'espaces seuls = filtre actif, pas de trim (décision 👤 : on laisse).
- Liste récurrente inchangée (filtre texte local, pas de puces).

**Décisions d'architecture** :
- `BudgetPage` est démonté au changement d'onglet (vérifié T4.1) → filtre (texte + puces) remonté dans `BudgetContextProvider` (`filtreOperations` + `setFiltreOperations`) ; il survit aussi aux changements de compte/mois. Portée du Context **ACCEPTÉE** par le 👤.
- **ADR non requis** : recette 👤 OK (2026-10-25) avec le filtre conservé dans le Context, y compris au changement de compte/mois. À rouvrir si l'usage réel demande une autre durée de vie.

**Points ouverts (recette 👤)** :
- Couleur puce « À valider » `#90a4ae` (constante `COULEUR_PUCE_A_VALIDER`, contraste ≈ 7:1 calculé à la main) à valider visuellement.
- Non-écrasement des puces (hauteur 40 px, `flexShrink`) et barre fixe 48 px sans saut de layout.
- Zones tactiles 44 px réelles (`::after` des puces).
- ≈ 10 lignes complètes visibles à 881 px (881−140−48 = 693 px ; calcul non mesuré).
- Durée de vie du filtre (ADR, voir ci-dessus).

**Rappel** : 3 fichiers `*.bak_qal` et stash `devon-t1-wip-check` à supprimer par le 👤 (aucun agent ne supprime).

---

## Phase 5 — En-tête ✅ (terminée 2026-10-25, Gate #4 en attente 👤)

**Critères de réussite** : libellés soldes corrects et lisibles sur les deux formats ; détail par type accessible au tap sur tablette, fermeture par second tap/tap ailleurs ; description intercompte accessible sans survol sur tablette.

- **T5.1** ✅ — Soldes libellés « Aujourd'hui »/« Fin de mois », vérifier espace dispo (`width:isMobile?100:240`). Fichier : `src/main/Components/budgets/budget/BudgetSoldes.component.tsx`. **Agent : DEVon.**
- **T5.2** ✅ — Détail par type : survol desktop inchangé, tap contrôlé + `ClickAwayListener` sur tablette. Fichier : `BudgetSoldes.component.tsx`. **Agent : DEVon.**
- **T5.3** ✅ — Tooltip intercompte accessible par tap/clic dédié sur la ligne (reste dans le périmètre liste). Fichier : `src/main/Utils/renderers/OperationItem.renderer.tsx`. **Agent : DEVon.**
- **T5.4** ✅ — Tests non-régression (libellés, tap soldes, tap intercompte). **Agent : QALvin.**

### Résultats Phase 5

**Fichiers créés** :
- `src/main/hooks/useIsTouchDevice.ts` — `useMediaQuery('(hover: none) and (pointer: coarse)')`
- `src/main/Components/shared/TapTooltip.component.tsx` — desktop : `Tooltip` MUI inchangé avec `followCursor` ; tactile : `Tooltip` contrôlé, ouverture/fermeture au tap, `ClickAwayListener` pour le tap extérieur, clic jamais stoppé (le `onClick` parent reste appelé) ; wrapper `span` `display:contents`

**Fichiers modifiés** :
- `src/main/Components/budgets/budget/BudgetSoldes.component.tsx` — deux lignes « Aujourd'hui » / « Fin de mois », un seul `TapTooltip` avec cible ≥ 44 px, largeur `width:100%; maxWidth:240; minWidth:0` ; « Fin de mois » masqué si budget non actif ; garde « budget absent » issue de master (AP 006)
- `src/main/Utils/renderers/OperationItem.renderer.tsx` — `getOperationIntercompteLibelleWithIconAndComment` utilise `TapTooltip`

**Tests (22 nouveaux, 4 fichiers)** : `useIsTouchDevice.test.tsx`, `TapTooltip.component.test.tsx`, `BudgetSoldes.component.test.tsx` (fusionné avec celui de master/AP 006 : fournisseur `CurrentBudgetContext`, ids `parId`), `OperationItem.renderer.tactile.test.tsx` (mock `useBudgetSelection` — contexte scindé AP 006).

**Preuves** :
- Suite : 498/503 après fusion master ; 4 échecs locaux préexistants (`Auth.service.test.ts`, localStorage, absents en CI).
- `npm run lint` : 0 erreur.
- Mutations de régression détectées : détection tactile inversée, `stopPropagation`, « Fin de mois » sans budget actif.

**Décisions / choix** :
- Détection tactile par capacité appareil, pas par breakpoint : une fenêtre desktop étroite avec souris garde le survol. Limite : portable tactile avec souris garde le survol.
- Description intercompte accessible au tap **dans la liste** (décision 👤 : pas de renvoi au panneau détail).
- Deux lignes de soldes empilées plutôt qu'une ligne « Aujourd'hui … · Fin de mois … » du plan source : tient mieux dans la colonne ≈ 170 px à 1024 px.
- Effets de bord : l'infobulle intercompte devient aussi tap-activée sur tablette à l'écran détail, la fiche récurrente et l'analyse (fonction partagée) ; une seule infobulle intercompte ouverte à la fois (click-away).
- Pas d'ADR.

**Retouches issues de la recette 👤 (2026-10-26)** :
- Puces de filtre (Phase 4) plus compactes : hauteur 40 → 28 px (`FILTER_CHIP_HEIGHT`), police 11 px, bordure 1,5 px ; zone cliquable étendue à ≈ 44 px par `::after` (±8 px). Les 5 puces occupent exactement la largeur du champ de filtre (cellule `HEADER_FILTER_SIZE`, constantes exportées avec `HEADER_MENU_SIZE` par `BudgetPageHeader`) ; la barre de résultat passe dans la cellule voisine (`size="grow"`). `FILTER_BAR_HEIGHT` reste 48. Risque connu : en `md` (< 1536 px), libellés des puces probablement tronqués à 1024 px.
- Soldes : espace de 16 px avec le champ de filtre (cellule md 1,6 → 2 colonnes) ; bord droit aligné sur celui des montants de la liste **en `xl` uniquement** (padding droit 24 px = gouttière scrollbar 8 px + padding de ligne 16 px, bloc collé à droite). En `md`, la cellule des soldes (3,4 → 5,4 col) dépasse le bord droit de la liste (4 col) : alignement impossible sans refonte de l'en-tête (options : soldes sous le champ de filtre, ou champ plus étroit) — **non traité**, à décider si besoin.

**Points ouverts (recette 👤, non testables en jsdom)** :
- Mise en page des soldes à 1024 px (serré ; sous 900 px de fenêtre, colonne ≈ 120 px, risque de débordement).
- Cibles tactiles 44 px réelles ; `display:contents` du wrapper.
- Comportement réel sur tablette : événements tactiles natifs, second tap.
- Couverture % non mesurée.

**Rappel** : 3 fichiers `*.bak_qal` et stash `devon-t1-wip-check` à supprimer par le 👤 (aucun agent ne supprime). Backlog B1 inchangé.

---

## Critères de succès globaux

- [x] Aucune régression sur montants, dates, états, soldes affichés (tests verts toutes phases ; recettes visuelles 1–4 OK, Phase 5 à valider en recette).
- [ ] Utilisable au doigt en 1024×768 tablette paysage (seule orientation visée) — **à valider en recette** (cibles 44 px, soldes à 1024 px, taps réels).
- [ ] ≥ 10 lignes visibles à 881 px de haut — **à valider en recette** (calcul, non mesuré).
- [ ] Captures avant/après systématiques par phase : desktop 1280px + tablette 1024×768 paysage — **à valider en recette** (tablette réelle).
- [x] `npm run lint` vert après chaque phase ; tests verts (4 échecs locaux préexistants `Auth.service.test.ts`, absents en CI) ; couverture % non mesurée en Phase 5.
- [x] Pas de modification d'API/modèle de données.
- [x] Couleurs anneaux d'état (orange/violet/vert/blanc) inchangées sur toutes les phases.

## Plan d'exécution (triggers)

Une phase démarre seulement après Gate humain GO sur la phase précédente. Chaque phase : DEVon implémente → revue auto code/sécurité → Gate #2 → QALvin teste → Gate #3 → (DOCly si doc impactée — probable en fin de Phase 5 pour `docs/ARCHITECTURE.md` si pattern filtre/puces documenté) → Gate #4 clôture phase.

## ADR

Pas d'ADR requis : refonte UI/UX réutilisant les patterns existants (MUI, Context, state local), aucune décision architecturale majeure (pas de nouvelle lib, pas de changement de couche). T4.1 a imposé de remonter l'état filtre dans `BudgetContextProvider.tsx` (portée du Context acceptée par le 👤) : **ADR reporté** à la recette Phase 4 — si le filtre doit perdurer au-delà du mois courant, ADR court à rédiger par DOCly.

## Backlog (évolutions hors phases 1–5, à planifier)

- **B1 — ✅ Réalisé le 2026-10-26 (traité directement à la demande du 👤, sans plan ni gates : DEVon + QALvin, PR dédiée)** — implémentation : `OperationIconTooltipContent.component.tsx` (catégorie, sous-catégorie, statut, légende des 4 états), `TapTooltip` autour du cercle `role="img"` de `OperationsListItem.shared.tsx` (clic non stoppé : un tap sélectionne la ligne ET ouvre l'infobulle), prop `ringMeaning` (`'etat'` par défaut, `'periode'` pour les récurrentes : « Périodicité : … » sans légende d'état) ; 18 tests. Point connu : une fois l'infobulle ouverte, MUI relie le contenu à l'icône par `aria-labelledby` (nom accessible plus riche que « Prévue »). Rendu (largeur 280 px, ancrage tablette) à valider à l'œil. Énoncé d'origine — **B1 — Infobulle sur l'icône d'opération (colonne gauche de la liste)** (idée 👤, 2026-10-25, issue de la recette Phase 3) : au survol/tap de l'icône, afficher catégorie, sous-catégorie et statut de l'opération, et expliquer l'icône et les couleurs (anneau d'état : orange = prévue, violet = reportée, vert = réalisée, blanc = annulée). Contraintes : aucune info uniquement au survol sur tablette → déclenchement au tap (même pattern que Phase 5, tooltip contrôlé + `ClickAwayListener`) ; `aria-label` de l'anneau (`getOperationStateLabel`) déjà en place ; cibles tactiles ≥ 44 px ; couleurs d'état inchangées. Point à cadrer : l'icône (≈ 46 px) devient une cible interactive distincte du clic de sélection de la ligne (ne pas déclencher la sélection au tap de l'infobulle, ou l'assumer). À instruire par ARCos/MAINa avant plan (non planifié).

## Fichiers impactés (vue d'ensemble)

- `src/main/Components/budgets/shared/OperationsFiltre.component.tsx`
- `src/main/Components/budgets/shared/BudgetPageHeader.component.tsx`
- `src/main/Components/budgets/operations/OperationsListe.shared.tsx`
- `src/main/Components/budgets/operations/OperationsListe.component.tsx`
- `src/main/Components/budgets/operations/courantes/OperationsListItem.shared.tsx`
- `src/main/Components/budgets/budget/Budget.controller.ts`
- `src/main/Components/budgets/budget/Budget.component.tsx`
- `src/main/Components/budgets/budget/BudgetSoldes.component.tsx`
- `src/main/Components/mainpages/MainPage.component.tsx`
- `src/main/Components/mainpages/menuSlideBar/CompteItem.component.tsx`
- `src/main/Utils/renderers/OperationItem.renderer.tsx`
- `src/main/Utils/renderers/OperationValue.renderer.tsx`
- `public/styles/application.css`
- Nouveaux : `src/main/Components/budgets/operations/OperationsListHeader.component.tsx`, `src/main/Components/budgets/shared/FilterChips.component.tsx`
- Potentiel : `src/main/Models/contextProvider/BudgetContextProvider.tsx` (si T4.1 l'exige)
