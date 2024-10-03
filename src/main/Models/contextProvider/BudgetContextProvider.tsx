import React, { useState } from "react";
import BudgetMensuelModel from "../budgets/BudgetMensuel.model";
import OperationModel from "../budgets/Operation.model";

/**
 * Contexte de la partie budget
 */
type BudgetContextType = {
    currentBudget: BudgetMensuelModel | undefined;
    setCurrentBudget: (currentBudget: BudgetMensuelModel) => void;

    currentOperation: OperationModel | null;
    setCurrentOperation: (currentOperation: OperationModel) => void;
};


export const BudgetContext = React.createContext<BudgetContextType | null>(null);

/**
 * Budget context provider
 * @param param0 
 * @returns  provider
 */
export function BudgetContextProvider({ children }: { children: React.ReactNode }): JSX.Element {

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel | null>(null);

    return (
        <BudgetContext.Provider value={{ currentBudget, setCurrentBudget, currentOperation, setCurrentOperation } }>
            {children}
        </BudgetContext.Provider>
    );
}