import React, {JSX, useMemo, useState} from "react";
import BudgetMensuelModel from "../budgets/BudgetMensuel.model.ts";
import OperationModel from "../budgets/Operation.model.ts";
import CompteBancaireModel from "../budgets/CompteBancaire.model.ts";
import CategorieOperationModel from "../budgets/CategorieOperation.model.ts";
import { BudgetContext, useBudgetContext } from "../../hooks/useBudgetContext.ts";

/**
 * `BudgetContext` et `useBudgetContext` sont désormais définis dans `src/main/hooks/useBudgetContext.ts`
 * (AP 006 - T11). Ré-exportés ici pour conserver la compatibilité avec tous les imports existants
 * (`from ".../BudgetContextProvider.tsx"`).
 */
export { BudgetContext, useBudgetContext };

/**
 * Budget context provider
 * @param param0
 * @returns  provider
 */
export function BudgetContextProvider({ children }: Readonly<{ children: React.ReactNode }>): JSX.Element {

    const [currentBudget, setCurrentBudget] = useState<BudgetMensuelModel>();
    const [currentOperation, setCurrentOperation] = useState<OperationModel | null>(null);

    const [listeComptes, setListeComptes] = useState<CompteBancaireModel[]>([]);
    // `comptes` est un simple alias de `listeComptes` (même référence, pas de calcul dérivé) :
    // pas besoin de useMemo ici (AP 006 - T6, portée réduite : cf. rapport de phase).
    const comptes : CompteBancaireModel[] = listeComptes;
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
