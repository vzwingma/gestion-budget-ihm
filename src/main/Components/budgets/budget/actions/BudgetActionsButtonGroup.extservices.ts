import BudgetMensuelModel from "@/src/main/Models/BudgetMensuel.model";
import { call } from "@/src/main/Services/ClientHTTP.service";
import { BACKEND_ENUM, METHODE_HTTP, SERVICES_URL } from "@/src/main/Utils/AppTechEnums.constants";
import {toast} from "react-toastify";


/**
 * Réinitialise le budget mensuel spécifié.
 *
 * @param {BudgetMensuelModel} budget - Le modèle de budget mensuel à réinitialiser.
 * @param {Function} onActionBudgetChange - La fonction de rappel à appeler après la réinitialisation du budget.
 *
 * @returns {void}
 *
 * @example
 * callReinitBudget(budget, (data) => {
 *     console.log("Budget réinitialisé avec succès", data);
 * });
 *
 * @throws {Error} Si une erreur se produit lors de la réinitialisation du budget.
 */
export function callReinitBudget(budget : BudgetMensuelModel, onActionBudgetChange : Function) {
    const idBudget = budget.id;
    console.log("Reinitialisation du budget [" + idBudget + "]");
    call(METHODE_HTTP.DELETE, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.REINIT, [idBudget])
        .then(data => {
            console.log(data)
            onActionBudgetChange(data)
        })
        .catch((e) => {
            console.log("Erreur lors de la réinitialisation du budget", e)
            toast.error("Erreur lors de la réinitialisation du budget " + idBudget)
        })
}

/**
 * Appelle le service pour réouvrir ou clôturer un budget.
 *
 * @param {string} idBudget - L'identifiant du budget à modifier.
 * @param {boolean} newEtatBudget - Le nouvel état du budget (true pour réouverture, false pour clôture).
 * @param {Function} onActionBudgetChange - Fonction de rappel à exécuter après le changement d'état du budget.
 *
 * @returns {void}
 *
 * @example
 * callReopenCloseBudget('12345', true, (data) => {
 *     console.log('Budget mis à jour', data);
 * });
 */
export function callReopenCloseBudget(idBudget : string, newEtatBudget : boolean, onActionBudgetChange : Function) {
    console.log((newEtatBudget ? "Réouverture" : "Clôture") + " du budget " + idBudget)

    call(METHODE_HTTP.POST, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.ETAT, [idBudget, newEtatBudget.toString()])
        .then(data => {
            toast.success((newEtatBudget ? "Réouverture" : "Clôture") + "du budget " + idBudget + " effectuée")
            onActionBudgetChange(data)
        })
        .catch((e) => {
            console.log("Erreur lors de la Réouverture/Clôture du budget", e)
            toast.error("Erreur lors de la " + (newEtatBudget ? "réouverture" : "clôture") + "du budget " + idBudget)
        })
}
