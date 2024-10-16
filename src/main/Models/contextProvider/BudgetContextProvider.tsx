import React, {useMemo, useState} from "react";
import BudgetMensuelModel from "../budgets/BudgetMensuel.model";
import OperationModel from "../budgets/Operation.model";
import CompteBancaireModel from "../budgets/CompteBancaire.model";
import CategorieOperationModel from "../budgets/CategorieOperation.model";

/**
 * Contexte de la partie budget
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
 * Budget context provider
 * @param param0
 * @returns  provider
 */
export function BudgetContextProvider({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel | null>(null);

    const [listeComptes, setListeComptes] = useState<CompteBancaireModel[]>([]);
    const comptes : CompteBancaireModel[] = useMemo(() => listeComptes, [listeComptes]);
    const [selectedCompte, setSelectedCompte] = useState<CompteBancaireModel | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0));

    const [categories, setCategories] = useState<CategorieOperationModel[]>([]);

    const contextValue = useMemo(() => ({
        currentBudget,
        setCurrentBudget,
        currentOperation,
        setCurrentOperation,
        selectedCompte,
        setSelectedCompte,
        comptes,
        setListeComptes,
        selectedDate,
        setSelectedDate,
        categories,
        setCategories
    }), [currentBudget, currentOperation, selectedCompte, comptes, selectedDate, categories]);

    return (
        <BudgetContext.Provider value={contextValue}>
            {children}
        </BudgetContext.Provider>
    );
}
