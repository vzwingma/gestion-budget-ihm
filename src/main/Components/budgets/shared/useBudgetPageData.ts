import { useCallback, useEffect, useMemo, useRef } from "react";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import OperationModel from "../../../Models/budgets/Operation.model.ts";
import { UTILISATEUR_DROITS } from "../../../Utils/AppBusinessEnums.constants.ts";
import { debug } from "../../../Utils/Debug.utils.ts";
import { getLabelFRFromDate } from "../../../Utils/Date.utils.ts";
import { useBudgetSelection, useCurrentBudget } from "../../../hooks/useBudgetContext.ts";
import { useFetch } from "../../../hooks/useFetch.ts";
import { fetchBudget, fetchPreferenceUtilisateur } from "../budget/Budget.extservices.ts";

/** Opérations regroupées (par date, par périodicité…) */
export type OperationsGroupees = { [key: string]: OperationModel[] };

export interface UseBudgetPageDataOptions {
    /**
     * Regroupement des opérations du budget courant (fonction pure, à référence STABLE : fonction de module ou `useCallback`).
     */
    groupOperations: (budget: BudgetMensuelModel) => OperationsGroupees;
    /**
     * Traitement appliqué à tout budget (chargé ou mis à jour par une action) avant son injection dans le contexte
     * (fonction à référence STABLE).
     */
    prepareBudget?: (budget: BudgetMensuelModel) => void;
}

/**
 * Données communes aux pages `BudgetPage` et `RecurrentsPage` (AP 006 - T1) :
 * - chargement du budget du compte / mois sélectionnés (`useFetch` : réponses tardives ignorées) ;
 * - réinitialisation du contexte (budget + opération courants) au changement de compte ou de date ;
 * - injection du budget chargé une seule fois par budget reçu (un budget périmé conservé par `useFetch` pendant un
 *   rechargement n'est jamais réinjecté, même si `prepareBudget` change de référence) ;
 * - callback de mise à jour du budget (`handleBudgetUpdate`) ;
 * - regroupement des opérations (`useMemo`) dérivé du budget courant ;
 * - droits utilisateur (préférences, chargées au 1er affichage).
 */
export function useBudgetPageData({ groupOperations, prepareBudget }: UseBudgetPageDataOptions) {
    const { selectedCompte, selectedDate } = useBudgetSelection();
    const { currentBudget, setCurrentBudget, currentOperation, setCurrentOperation } = useCurrentBudget();

    /** Préférences utilisateur au 1er démarrage **/
    const { data: userDroitsCharges } = useFetch(() => fetchPreferenceUtilisateur(), []);
    const userDroits: UTILISATEUR_DROITS[] = userDroitsCharges ?? [];

    /** Callback de mise à jour du budget **/
    const handleBudgetUpdate = useCallback((budget: BudgetMensuelModel) => {
        prepareBudget?.(budget);
        setCurrentBudget(budget);
        debug("Chargement du budget correctement effectué");
    }, [setCurrentBudget, prepareBudget]);

    /** Regroupement des opérations, dérivé du budget courant **/
    const operationsGroupees: OperationsGroupees = useMemo(
        () => currentBudget == null ? {} : groupOperations(currentBudget),
        [currentBudget, groupOperations]
    );

    /** Rechargement du budget si changement de compte ou de date **/
    const { data: budgetCharge } = useFetch(() => fetchBudget(selectedCompte, selectedDate), [selectedCompte, selectedDate]);

    /** Réinitialisation du contexte si changement de compte ou de date **/
    useEffect(() => {
        debug("[TRIGGER] Context selectedCompte :", selectedCompte?.id, "selectedDate :", getLabelFRFromDate(selectedDate));
        setCurrentBudget(undefined);
        setCurrentOperation(null);
    }, [selectedCompte, selectedDate, setCurrentOperation, setCurrentBudget]);

    /**
     * Le budget chargé alimente le contexte, une seule fois par budget reçu : `useFetch` conserve l'ancien `data`
     * pendant un rechargement, il ne faut donc pas le réinjecter après le reset du contexte (même si
     * `handleBudgetUpdate` change de référence).
     **/
    const dernierBudgetInjecte = useRef<BudgetMensuelModel | undefined>(undefined);
    useEffect(() => {
        if (budgetCharge !== undefined && budgetCharge !== dernierBudgetInjecte.current) {
            dernierBudgetInjecte.current = budgetCharge;
            handleBudgetUpdate(budgetCharge);
        }
    }, [budgetCharge, handleBudgetUpdate]);

    return {
        selectedCompte,
        selectedDate,
        currentBudget,
        currentOperation,
        setCurrentOperation,
        operationsGroupees,
        userDroits,
        handleBudgetUpdate
    };
}
