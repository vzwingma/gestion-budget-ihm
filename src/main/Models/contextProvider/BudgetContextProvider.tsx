import React, {JSX, useMemo, useState} from "react";
import BudgetMensuelModel from "../budgets/BudgetMensuel.model.ts";
import OperationModel from "../budgets/Operation.model.ts";
import CompteBancaireModel from "../budgets/CompteBancaire.model.ts";
import CategorieOperationModel from "../budgets/CategorieOperation.model.ts";
import { BudgetContext, BudgetSelectionContext, CurrentBudgetContext } from "../../hooks/useBudgetContext.ts";
import { FILTRE_OPERATIONS_VIDE, FiltreOperations } from "../../Utils/OperationsFilter.utils.ts";

/**
 * `BudgetContext` et `useBudgetContext` sont désormais définis dans `src/main/hooks/useBudgetContext.ts`
 * (AP 006 - T11). Ré-exportés ici pour conserver la compatibilité avec tous les imports existants
 * (`from ".../BudgetContextProvider.tsx"`).
 */
export { BudgetContext, BudgetSelectionContext, CurrentBudgetContext, useBudgetContext, useBudgetSelection, useCurrentBudget } from "../../hooks/useBudgetContext.ts";

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
    // pas besoin de useMemo ici (AP 006 - T6).
    const comptes : CompteBancaireModel[] = listeComptes;
    const [selectedCompte, setSelectedCompte] = useState<CompteBancaireModel | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date(new Date(Date.now()).getFullYear(), new Date(Date.now()).getMonth(), 1, 0, 0, 0));

    const [categories, setCategories] = useState<CategorieOperationModel[]>([]);

    // Filtre des opérations : remonté ici car BudgetPage est démonté au changement d'onglet (AP 005 - T4.1)
    const [filtreOperations, setFiltreOperations] = useState<FiltreOperations>(FILTRE_OPERATIONS_VIDE);

    /** Sous-contexte "sélection / référentiels" : change rarement (chargement comptes/catégories, choix compte/date) **/
    const selectionValue = useMemo(() => ({
        selectedCompte,
        setSelectedCompte,
        comptes,
        setListeComptes,
        selectedDate,
        setSelectedDate,
        categories,
        setCategories
    }), [selectedCompte, comptes, selectedDate, categories]);

    /** Sous-contexte "budget courant" : change à chaque action sur le budget / l'opération **/
    const currentBudgetValue = useMemo(() => ({
        currentBudget,
        setCurrentBudget,
        currentOperation,
        setCurrentOperation,
        filtreOperations,
        setFiltreOperations
    }), [currentBudget, currentOperation, filtreOperations]);

    /** Agrégat (compatibilité `useBudgetContext()`) **/
    const contextValue = useMemo(() => ({ ...selectionValue, ...currentBudgetValue }), [selectionValue, currentBudgetValue]);

    return (
        <BudgetSelectionContext.Provider value={selectionValue}>
            <CurrentBudgetContext.Provider value={currentBudgetValue}>
                <BudgetContext.Provider value={contextValue}>
                    {children}
                </BudgetContext.Provider>
            </CurrentBudgetContext.Provider>
        </BudgetSelectionContext.Provider>
    );
}
