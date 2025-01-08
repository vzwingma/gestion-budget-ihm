import {toast} from "react-toastify";
import {call} from "../../../Services/ClientHTTP.service";
import {BACKEND_ENUM, METHODE_HTTP, SERVICES_URL} from "../../../Utils/AppTechEnums.constants";
import CompteBancaireModel from "../../../Models/budgets/CompteBancaire.model";
import {calculateTimelines,} from "./AnalyseTemporelle.controller";
import SoldesMensuelModel from "../../../Models/analyses/temporelles/SoldeMensuel.model";
import {DataCalculationTemporelResultsProps} from "../../Components.props";

/**
 * Services back-end pour les analyses.
 */

/**
 * Charge les budgets du compte depuis le back-end.
 * @param {string} selectedCompte - Le compte sélectionné.
 * @param {string} selectedAnnee - L'année sélectionnée.
 * @param handleDataCalculationResult - La fonction de rappel pour les résultats de l'analyse.
 */
export function loadSoldesBudgets(selectedCompte : CompteBancaireModel | null, selectedAnnee : number, handleDataCalculationResult : ({soldesMensuelsData,
                                                                                                                                        soldesCategoriesData,
                                                                                                                                        timelinesByCategoriesData,
                                                                                                                                        timelinesPrevisionnellesByCategoriesData,
                                                                                                                                        timelinesSoldesData,
                                                                                                                                        timelinesPrevisionnellesSoldesData} : DataCalculationTemporelResultsProps) => void) : void {
    if (selectedCompte != null) {

        if (selectedAnnee === 0) {
            // Appelle le service back-end pour obtenir les budgets du compte sélectionné.
            call(METHODE_HTTP.GET,
                BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.SOLDES_ANNEES,
                [selectedCompte.id])
                .then((data: SoldesMensuelModel[]) => calculateTimelines(data, handleDataCalculationResult)) // En cas de succès, calcule les analyses temporelles.
                .catch(e => {
                    // En cas d'erreur, affiche un message d'erreur.
                    let libErreur = "Erreur lors du chargement de tous les budgets du compte " + selectedCompte.libelle;
                    console.log(libErreur, e)
                    toast.error(libErreur, {autoClose: false, closeOnClick: true})
                })
        } else {
            // Appelle le service back-end pour obtenir les budgets du compte sélectionné.
            call(METHODE_HTTP.GET,
                BACKEND_ENUM.URL_OPERATIONS, SERVICES_URL.BUDGETS.SOLDES_ANNEE,
                [selectedCompte.id, String(selectedAnnee)])
                .then((data: SoldesMensuelModel[]) => calculateTimelines(data, handleDataCalculationResult)) // En cas de succès, calcule les analyses temporelles.
                .catch(e => {
                    // En cas d'erreur, affiche un message d'erreur.
                    let libErreur = "Erreur lors du chargement des budgets " + selectedAnnee + " du compte " + selectedCompte.libelle;
                    console.log(libErreur, e)
                    toast.error(libErreur, {autoClose: false, closeOnClick: true})
                })
        }

    }
}
