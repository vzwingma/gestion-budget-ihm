import {toast} from "react-toastify";
import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model.ts";
import {UTILISATEUR_DROITS} from "../../../Utils/AppBusinessEnums.constants.ts";
import {call} from "../../../Services/ClientHTTP.service.ts";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../../Utils/AppTechEnums.constants.ts";
import CategorieOperationModel from "../../../Models/budgets/CategorieOperation.model.ts";
import BudgetMensuelModel from "../../../Models/budgets/BudgetMensuel.model.ts";
import {populateAllCategories} from "./Budget.controller.ts";
import React from "react";

/*
 * Services back-end des budgets
 */

/**
 * Charge les catégories depuis le back-end.
 *
 * @param handleLoadCategories
 */

export function loadCategories(handleLoadCategories: (categories: CategorieOperationModel[]) => void) {
    console.log("Chargement des catégories");
    call(METHODE_HTTP.GET, BACKEND_ENUM.URL_PARAMS, SERVICES_URL.PARAMETRES.CATEGORIES)
        .then((data : CategorieOperationModel[])=> {
            const categories = populateAllCategories(data);
            handleLoadCategories(categories);
        } )
        .catch((e) => {
            console.log("Erreur lors du chargement des catégories", e)
            toast.error("Erreur lors du chargement des catégories")
        })
}



/**
 * Recharge le budget depuis le back-end.
 * @param handleBudgetUpdate - La fonction de mise à jour du budget.
 * @param selectedCompte - Le compte bancaire sélectionné.
 * @param selectedDate - La date sélectionnée (optionnelle).
 */
export function reloadBudget(handleBudgetUpdate: (budget: BudgetMensuelModel) => void, selectedCompte: CompteBancaireModel | null, selectedDate?: Date) {
    if (selectedCompte != null && selectedDate != null) {
        call(METHODE_HTTP.GET, BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.GET_BY_COMPTE_DATES,
                    [selectedCompte.id, selectedDate.getFullYear().toString(), (selectedDate.getMonth() + 1).toString()])
            .then((data: BudgetMensuelModel) => handleBudgetUpdate(data))
            .catch(e => {
                let libErreur = "Erreur lors du chargement du budget " + selectedCompte?.id + " du " + (selectedDate.getMonth() + 1) + "/" + selectedDate.getFullYear();
                console.log(libErreur, e)
                toast.error(libErreur, { autoClose: false, closeOnClick: true })
            })
    }
}


/**
 * Récupère les préférences de l'utilisateur.
 *
 * @param setUserDroits - Fonction pour définir les droits de l'utilisateur.
 */
export function getPreferenceUtilisateur(setUserDroits: React.Dispatch<React.SetStateAction<UTILISATEUR_DROITS[]>>) {
    call(METHODE_HTTP.GET, BACKEND_ENUM.URL_UTILISATEURS, SERVICES_URL.UTILISATEURS.USERS_PREFS)
        .then((data) => {
            let userDroits: UTILISATEUR_DROITS[] = [];
            // Mapping des droits de l'utilisateur en enum
            for (let droit in data.droits) {
                if (data.droits[droit]) {
                    Object.values(UTILISATEUR_DROITS).forEach((key, index) => {
                        if (key === droit) {
                            userDroits.push(index);
                        }
                    })
                }
            }
            setUserDroits(userDroits);
        })
        .catch((e) => {
            console.log("Erreur lors de la recherche de la dernière connexion", e);
        })

}
