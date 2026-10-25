import React, { useContext } from "react";
import BudgetMensuelModel from "../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../Models/budgets/Operation.model.ts";
import CompteBancaireModel from "../Models/budgets/CompteBancaire.model.ts";
import CategorieOperationModel from "../Models/budgets/CategorieOperation.model.ts";

/**
 * Contexte de la partie budget (AP 006 - T11 : extraction hors de `BudgetContextProvider.tsx`,
 * co-localisée avec les autres hooks custom de `src/main/hooks/`).
 *
 * `BudgetContextProvider.tsx` ré-exporte `BudgetContext` et `useBudgetContext` pour conserver
 * la compatibilité avec l'ensemble des imports existants (`from ".../BudgetContextProvider.tsx"`).
 */
type BudgetContextType = {
    currentBudget: BudgetMensuelModel | undefined;
    setCurrentBudget: React.Dispatch<React.SetStateAction<BudgetMensuelModel | undefined>>;

    currentOperation: OperationModel | null;
    setCurrentOperation: React.Dispatch<React.SetStateAction<OperationModel | null>>;

    comptes: CompteBancaireModel[];
    setListeComptes: React.Dispatch<React.SetStateAction<CompteBancaireModel[]>>;
    selectedCompte: CompteBancaireModel | null;
    setSelectedCompte: React.Dispatch<React.SetStateAction<CompteBancaireModel | null>>;

    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;

    categories: CategorieOperationModel[];
    setCategories: React.Dispatch<React.SetStateAction<CategorieOperationModel[]>>
};

export const BudgetContext = React.createContext<BudgetContextType | null>(null);

/**
 * Accès typé (non nul) au contexte budget. Lève si utilisé hors provider.
 */
export function useBudgetContext(): BudgetContextType {
    const context = useContext(BudgetContext);
    if (context === null) {
        throw new Error("useBudgetContext doit être utilisé dans un BudgetContextProvider");
    }
    return context;
}
