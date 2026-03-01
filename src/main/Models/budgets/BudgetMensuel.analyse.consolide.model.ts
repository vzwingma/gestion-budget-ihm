import { Soldes } from "./BudgetMensuel.model.ts";
import OperationModel from "./Operation.model.ts";

/**
 * Budget Mensuel Analyse Consolide model
 * Modèle de budget mensuel utilisé pour les analyses consolidées, avec des fonctionnalités spécifiques pour stocker les soldes à la fin de chaque mois et permettre les comparaisons d'évolution dans les analyses.
 */
class BudgetMensuelAnalyseConsolideModel {

    id: string;
    idCompteBancaire!: string;
    // Clé au format YYYY-MM pour stocker les soldes à la fin de chaque mois
    // Soldes à la fin de chaque mois pour permettre les comparaisons d'évolution dans les analyses. Valable uniquement pour les budgets consolidés utilisés dans les analyses, les budgets mensuels classiques n'utilisant pas cette fonctionnalité.
    soldesParMois: { [key: string]: Soldes } = {};
    listeOperations: Array<OperationModel> = new Array<OperationModel>();
    /**
     * Constructor
     * @param id id du compte
     */
    constructor(id: string) {
        this.id = id;
    }
}
export default BudgetMensuelAnalyseConsolideModel;  // export default is used to export a single class, function or primitive from a script file.
