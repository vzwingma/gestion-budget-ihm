import {EN_RETARD_LIBELLE_REGEX, INTERCOMPTE_LIBELLE_REGEX} from "../../../../../Utils/OperationData.utils";
import OperationModel from "../../../../../Models/budgets/Operation.model";
import LibelleCategorieOperationModel from "../../../../../Models/budgets/LibelleCategorieOperation.model";

/**
 * Récupère le libellé de l'opération en cours d'édition
 * @returns {string} Le libellé de l'opération en cours d'édition
 */
export function getOperationLibelleInEdition(operation: OperationModel): string {
    let extract = INTERCOMPTE_LIBELLE_REGEX.exec(operation.libelle)
    if (extract !== null) {
        return extract[3];
    }
    extract = EN_RETARD_LIBELLE_REGEX.exec(operation.libelle);
    if (extract !== null) {
        return extract[1];
    }
    return operation.libelle;
}

/**
 * Évalue le libellé en attente en fonction de l'événement de saisie
 * @param e L'événement de saisie
 * @param pendingLibelle Le libellé en cours de saisie
 */
export function evaluatePendingLibelle(e: any, pendingLibelle: string): string {
    if (e.key === "Backspace") {
        pendingLibelle = pendingLibelle.slice(0, -1);
    } else if (e.key === "Escape") {
        pendingLibelle = "";
    } else if (e.key === " ") {
        pendingLibelle += " ";
    } else if (e.key === "Delete") {
        pendingLibelle = "";
    } else if (e.key !== "Enter" && e.key !== "Tab" && e.key !== "Shift" && e.key !== "Control" && e.key !== "Alt" && e.key !== "Meta" && e.key !== "ArrowUp" && e.key !== "ArrowDown" && e.key !== "ArrowLeft" && e.key !== "ArrowRight" && e.key !== "Home" && e.key !== "End" && e.key !== "PageUp" && e.key !== "PageDown") {
        pendingLibelle += e.key.toString();
    }
    return pendingLibelle;
}


/**
 * Fonction de tri pour trier les libellés d'opération
 * @param libelle1 libellé 1
 * @param libelle2 libellé 2
 * @param pendingLibelle libellé en cours de saisie
 */
export function prioritySort(libelle1: LibelleCategorieOperationModel, libelle2: LibelleCategorieOperationModel, pendingLibelle: string): number {
    const libellea = libelle1.libelle.toLowerCase();
    const libelleb = libelle2.libelle.toLowerCase();
    const libellePending = pendingLibelle.toLowerCase();
    if (libellea.startsWith(libellePending) && libelleb.startsWith(libellePending)) {
        return libellea.length - libelleb.length;
    } else if (libellea.startsWith(libellePending)) {
        return -1;
    } else if (libelleb.startsWith(libellePending)) {
        return 1;
    } else {
        return libellea.localeCompare(libelleb);
    }
}
