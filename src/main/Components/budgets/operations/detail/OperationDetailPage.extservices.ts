import BudgetMensuelModel from "@/src/main/Models/BudgetMensuel.model";
import OperationModel from "@/src/main/Models/Operation.model";
import {call} from "@/src/main/Services/ClientHTTP.service";
import {OPERATION_ETATS_ENUM} from "@/src/main/Utils/AppBusinessEnums.constants";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "@/src/main/Utils/AppTechEnums.constants";
import {toast} from "react-toastify";
import {v4 as uuid} from "uuid";


/**
 * Modification de l'opération sur action
 * @param operation opération modifiée
 * @param budget associé
 */
export function saveOperation(operation: OperationModel, budget: BudgetMensuelModel, onOperationChange: (budget: BudgetMensuelModel) => void) {

    if (budget.actif) {
        let creation = operation.id === "-1"
        console.log((operation.id === "-1" ? "Création" : "Mise à jour") + " d'une opération sur le budget : " + budget.id)
        if (operation.id === "-1") {
            operation.id = uuid();
        }

        call(operation.etat === OPERATION_ETATS_ENUM.SUPPRIMEE ? METHODE_HTTP.DELETE : METHODE_HTTP.POST,
            BACKEND_ENUM.URL_OPERATIONS, !creation ? SERVICES_URL.OPERATIONS.UPDATE : SERVICES_URL.OPERATIONS.CREATE,
            [budget.id, !creation ? operation.id : ""],
            JSON.stringify(operation))
        .then((data : BudgetMensuelModel) => {

                // Update du budget global (parent)
                onOperationChange(data);
                toast.success((operation.id === "-1" ? "Création" : "Mise à jour") + " de l'opération correctement effectuée")

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
 */
export function saveOperationIntercompte(operation: OperationModel, budget: BudgetMensuelModel, idCompteCible: string | null, onOperationChange: (budget: BudgetMensuelModel) => void) {
    if(idCompteCible === null) {
        console.error("Erreur lors de la création de l'opération intercompte : compte cible non renseigné")
        toast.error("Erreur lors de la création de l'opération intercompte : compte cible non renseigné")
        return;
    }
    
    
    console.log("Création d'une opération intercompte sur le budget [" + budget.id + "] vers le compte [" + idCompteCible + "]")
    call(METHODE_HTTP.POST,
        BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.INTERCOMPTE,
        [budget.id, idCompteCible],
        JSON.stringify(operation))
    .then(budgetUpdated => {
        onOperationChange(budgetUpdated);
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
 */
export function getLibellesOperation(idCompte: string, setListeLibellesOperation: React.Dispatch<React.SetStateAction<string[]>>) {

    call(METHODE_HTTP.GET,
        BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.OPERATIONS.LIBELLES,
        [idCompte])
        .then((listeLibelles: string[]) => {
            listeLibelles = listeLibelles
                .map(libelle => libelle.split('-')[0].trim())
                .filter(
                    (value, index, current_value) => current_value.indexOf(value) === index
                )
                .sort();
            setListeLibellesOperation(listeLibelles);
        })
        .catch(e => {
            console.log("Erreur lors de la recherche des libellés d'opérations ", e);
        })
}
