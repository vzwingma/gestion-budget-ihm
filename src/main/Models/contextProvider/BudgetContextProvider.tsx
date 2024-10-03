import React, { useMemo, useState } from "react";
import BudgetMensuelModel from "../budgets/BudgetMensuel.model";
import OperationModel from "../budgets/Operation.model";
import CompteBancaireModel from "../budgets/CompteBancaire.model";
import CategorieOperationModel from "../budgets/CategorieOperation.model";

/**
 * Contexte de la partie budget
 */
type BudgetContextType = {
    currentBudget: BudgetMensuelModel | undefined;
    setCurrentBudget: (currentBudget: BudgetMensuelModel) => void;

    currentOperation: OperationModel | null;
    setCurrentOperation: (currentOperation: OperationModel) => void;

    comptes: CompteBancaireModel[];
    setComptes: (comptes: CompteBancaireModel[]) => void;
    selectedCompte: CompteBancaireModel | null;
    setSelectedCompte: (selectedCompte: CompteBancaireModel | null) => void;
    
    selectedDate: Date;
    setSelectedDate: (selectedDate: Date) => void;

    categories: CategorieOperationModel[];
    setCategories: (categories: CategorieOperationModel[]) => void;
};


export const BudgetContext = React.createContext<BudgetContextType | null>(null);

/**
 * Budget context provider
 * @param param0 
 * @returns  provider
 */
export function BudgetContextProvider({ children }: { children: Readonly<React.ReactNode> }): JSX.Element {

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel | null>(null);
    
    const [listeComptes, setComptes] = useState<CompteBancaireModel[]>([]);
    const comptes : CompteBancaireModel[] = useMemo(() => listeComptes, [listeComptes]);
    const [selectedCompte, setSelectedCompte] = useState<CompteBancaireModel | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0));

    const [categories, setCategories] = useState<CategorieOperationModel[]>([]);



    return (
        <BudgetContext.Provider value={{ currentBudget, setCurrentBudget, currentOperation, setCurrentOperation, selectedCompte, setSelectedCompte, comptes, setComptes, selectedDate, setSelectedDate, categories, setCategories } }>
            {children}
        </BudgetContext.Provider>
    );
}