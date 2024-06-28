import {PERIODES_MENSUALITE_ENUM} from "../../Utils/AppBusinessEnums.constants";
import {sortOperations} from "../../Utils/DataUtils.utils";

/**
 * Controleur des budgets
 */

/**
 *  Notification lorsque le budget est mis à jour
 * @param budgetData budget
 */
export function handleBudgetUpdate(budgetData) {
    console.log("(Re)Chargement du budget", budgetData.id, budgetData.listeOperations.length + " opérations")

    let operationsGroupedByDateOperation = budgetData.listeOperations
        .filter(operation => operation.etat !== "PLANIFIEE")
        .sort((ope1, ope2) => sortOperations(ope1, ope2))
        .reduce((group, operation) => {
            group[operation.autresInfos.dateOperation] = group[operation.autresInfos.dateOperation] ?? [];
            group[operation.autresInfos.dateOperation].push(operation);
            return group;
        }, {});

    this.setState({currentBudget: budgetData, operationsGroupedByDateOperation: operationsGroupedByDateOperation});
    console.log("Chargement du budget correctement effectué");
}


/**
 * Callback de filtre d'opération
 * @param event event
 */
export function handleOperationFilter(event) {
    this.setState({filterOperations: event.target.value});
}

/**
 * Sélection d'une opération
 * @param operation opération
 */
export function handleOperationSelect(operation) {
    if (operation.mensualite == null) {
        operation.mensualite = {periode: PERIODES_MENSUALITE_ENUM.at(0)}
    }
    this.setState({currentOperation: operation})
}


/**
 * Création d'une nouvelle opération
 */
export function handleButtonCreateClick() {

    this.setState({currentOperation: this.createNewOperation()})
}

/**
 * Création d'une nouvelle opération
 * @returns {Operation}
 */
export function createNewOperation() {

    let newOperation: Operation = {
        id: -1,
        libelle: null,
        categorie: {
            id: null,
            libelle: null
        },
        ssCategorie: {
            id: null,
            libelle: null
        },
        typeOperation: null,
        etat: "PREVUE",
        valeur: 0,
        mensualite: {
            periode: "PONCTUELLE"
        },
        autresInfos: {
            dateOperation: ""
        }
    }
    return newOperation;
}
