import React, { useContext } from "react";
import BudgetMensuelModel from "../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../Models/budgets/Operation.model.ts";
import CompteBancaireModel from "../Models/budgets/CompteBancaire.model.ts";
import CategorieOperationModel from "../Models/budgets/CategorieOperation.model.ts";
import { FiltreOperations } from "../Utils/OperationsFilter.utils.ts";

/**
 * Contexte de la partie budget (AP 006 - T11 : extraction hors de `BudgetContextProvider.tsx`,
 * co-localisée avec les autres hooks custom de `src/main/hooks/`).
 *
 * AP 006 - T6 : le contexte est scindé en deux sous-contextes pour limiter les re-renders :
 * - **sélection / référentiels** (`BudgetSelectionContext`) : comptes, compte et date sélectionnés, catégories ;
 * - **budget courant** (`CurrentBudgetContext`) : budget et opération courants, filtre des opérations (changent à chaque action utilisateur ; le filtre est ici pour ne pas re-rendre les lignes de liste qui lisent la sélection).
 *
 * `BudgetContext` / `useBudgetContext()` restent l'agrégat des deux (compatibilité, mêmes valeurs) : un consumer
 * de l'agrégat se re-rend si l'un OU l'autre sous-contexte change. Les consumers qui ne lisent qu'une moitié
 * doivent utiliser `useBudgetSelection()` ou `useCurrentBudget()`.
 *
 * `BudgetContextProvider.tsx` ré-exporte `BudgetContext` et `useBudgetContext` pour conserver
 * la compatibilité avec l'ensemble des imports existants (`from ".../BudgetContextProvider.tsx"`).
 */
export type BudgetSelectionContextType = {
    comptes: CompteBancaireModel[];
    setListeComptes: React.Dispatch<React.SetStateAction<CompteBancaireModel[]>>;
    selectedCompte: CompteBancaireModel | null;
    setSelectedCompte: React.Dispatch<React.SetStateAction<CompteBancaireModel | null>>;

    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;

    categories: CategorieOperationModel[];
    setCategories: React.Dispatch<React.SetStateAction<CategorieOperationModel[]>>
};

export type CurrentBudgetContextType = {
    currentBudget: BudgetMensuelModel | undefined;
    setCurrentBudget: React.Dispatch<React.SetStateAction<BudgetMensuelModel | undefined>>;

    currentOperation: OperationModel | null;
    setCurrentOperation: React.Dispatch<React.SetStateAction<OperationModel | null>>;

    /** Filtre (texte + puces) de la liste des opérations : conservé au changement d'onglet (AP 005 - Phase 4, T4.1/T4.5) */
    filtreOperations: FiltreOperations;
    setFiltreOperations: React.Dispatch<React.SetStateAction<FiltreOperations>>;
};

export type BudgetContextType = BudgetSelectionContextType & CurrentBudgetContextType;

export const BudgetContext = React.createContext<BudgetContextType | null>(null);
export const BudgetSelectionContext = React.createContext<BudgetSelectionContextType | null>(null);
export const CurrentBudgetContext = React.createContext<CurrentBudgetContextType | null>(null);

/**
 * Accès typé (non nul) au contexte budget complet (agrégat). Lève si utilisé hors provider.
 * Préférer `useBudgetSelection()` / `useCurrentBudget()` si une seule moitié est lue.
 */
export function useBudgetContext(): BudgetContextType {
    const context = useContext(BudgetContext);
    if (context === null) {
        throw new Error("useBudgetContext doit être utilisé dans un BudgetContextProvider");
    }
    return context;
}

/**
 * Accès ciblé à la sélection (comptes, compte/date sélectionnés, catégories) : pas de re-render
 * lors des changements de budget/opération courants.
 */
export function useBudgetSelection(): BudgetSelectionContextType {
    const context = useContext(BudgetSelectionContext);
    if (context === null) {
        throw new Error("useBudgetSelection doit être utilisé dans un BudgetContextProvider");
    }
    return context;
}

/**
 * Accès ciblé au budget et à l'opération courants : pas de re-render lors des changements de
 * comptes, de sélection ou de catégories.
 */
export function useCurrentBudget(): CurrentBudgetContextType {
    const context = useContext(CurrentBudgetContext);
    if (context === null) {
        throw new Error("useCurrentBudget doit être utilisé dans un BudgetContextProvider");
    }
    return context;
}
