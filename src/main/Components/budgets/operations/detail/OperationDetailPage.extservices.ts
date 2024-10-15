import {toast} from "react-toastify";
import {v4 as uuid} from "uuid";
import OperationModel from "../../../../Models/budgets/Operation.model";
import BudgetMensuelModel from "../../../../Models/budgets/BudgetMensuel.model";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../../../Utils/AppTechEnums.constants";
import {OPERATION_ETATS_ENUM} from "../../../../Utils/AppBusinessEnums.constants";
import {call} from "../../../../Services/ClientHTTP.service";
import LibelleCategorieOperationModel from "../../../../Models/budgets/LibelleCategorieOperation.model";


/**
 * Modification de l'opération sur action
 * @param operation opération modifiée
 * @param budget associé
 * @param onOperationUpdate callback de mise à jour
 */
export function saveOperation(operation: OperationModel, budget: BudgetMensuelModel, onOperationUpdate: (budget: BudgetMensuelModel) => void) {

    if (budget.actif) {
        const isCreation: boolean = operation.id === "-1"
        console.log((isCreation ? "Création" : "Mise à jour") + " d'une opération sur le budget : " + budget.id)
        if (isCreation) {
            operation.id = uuid();
        }

        call(operation.etat === OPERATION_ETATS_ENUM.SUPPRIMEE ? METHODE_HTTP.DELETE : METHODE_HTTP.POST,
            BACKEND_ENUM.URL_OPERATIONS, !isCreation ? SERVICES_URL.OPERATIONS.UPDATE : SERVICES_URL.OPERATIONS.CREATE,
            [budget.id, !isCreation ? operation.id : ""], operation)
            .then((data: BudgetMensuelModel) => {

                // Update du budget global (parent)
                onOperationUpdate(data);
                toast.success((isCreation ? "Création" : "Mise à jour") + " de l'opération correctement effectuée")

            })
            .catch((e) => {
                console.log("Erreur lors de la mise à jour de l'opération " + operation.id, e);
                toast.error("Erreur lors de la mise à jour de l'opération")
            })
    } else {
        console.log("Impossible de modifier l'opération " + operation.id + " sur un budget clos");
        toast.warn("Impossible de sauvegarder une opération sur un budget clos")
    }

}

/**
 * Appels WS vers pour enregistrer l'opération intercompte sur le backend
 * @param operation opération à enregistrer
 * @param budget budget concerné
 * @param idCompteCible compte cible pour la 2nde opération (intercompte)
 * @param onOperationUpdate
 */
export function saveOperationIntercompte(operation: OperationModel, budget: BudgetMensuelModel, idCompteCible: string | null, onOperationUpdate: (budget: BudgetMensuelModel) => void) {
    if (idCompteCible === null) {
        console.error("Erreur lors de la création de l'opération intercompte : compte cible non renseigné")
        toast.error("Erreur lors de la création de l'opération intercompte : compte cible non renseigné")
        return;
    }

    console.log("Création d'une opération intercompte sur le budget [" + budget.id + "] vers le compte [" + idCompteCible + "]")

    call(METHODE_HTTP.POST,
        BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.INTERCOMPTE,
        [budget.id, idCompteCible],
        operation)
        .then(budgetUpdated => {
            onOperationUpdate(budgetUpdated);
            toast.success("Création de l'opération inter-comptes correctement effectuée")
        })
        .catch(e => {
            console.log("Erreur lors de l'enregistrement de l'opération intercomptes", e)
            toast.error("Erreur lors de l'enregistrement de l'opération intercomptes")
        })
}

/**
 * Recherche des libellés des opérations sur le compte
 * @param idCompte identifiant du compte
 * @param setListeLibellesOperation
 */
export function getLibellesOperationsCompte(idCompte: string, setListeLibellesOperation: React.Dispatch<React.SetStateAction<LibelleCategorieOperationModel[]>>) {

    call(METHODE_HTTP.GET,
        BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.LIBELLES,
        [idCompte])
        .then((listeLibelles: LibelleCategorieOperationModel[]) => {
            setListeLibellesOperation(listeLibelles
                .filter((value, index, current_value) => current_value.indexOf(value) === index)
                .sort((libelle1, libelle2) => libelle1.libelle.localeCompare(libelle2.libelle)));
        })
        .catch(e => {
            console.error("Erreur lors de la recherche des libellés d'opérations ", e);
        })
}
