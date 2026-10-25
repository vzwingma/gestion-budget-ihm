import OperationModel from "../Models/budgets/Operation.model.ts";
import {OPERATION_ETATS_ENUM} from "./AppBusinessEnums.constants.ts";

/** Puces de filtre « État » (AP 005 - Phase 4) */
export enum PUCE_ETAT_ENUM {
    /** Filtre par ÉTAT SEUL (PREVUE + REPORTEE), avec ou sans date : différent du groupe de liste « À valider » */
    A_VALIDER = "A_VALIDER",
    REALISEE = "REALISEE",
    ANNULEE = "ANNULEE"
}

/** Puces de filtre « Sens » : le sens est porté par le signe de la valeur (comme `.text-CREDIT` / `.text-DEPENSE`) */
export enum PUCE_SENS_ENUM {
    DEPENSES = "DEPENSES",
    RENTREES = "RENTREES"
}

/** États d'opération couverts par chaque puce « État » */
export const ETATS_PAR_PUCE: Record<PUCE_ETAT_ENUM, OPERATION_ETATS_ENUM[]> = {
    [PUCE_ETAT_ENUM.A_VALIDER]: [OPERATION_ETATS_ENUM.PREVUE, OPERATION_ETATS_ENUM.REPORTEE],
    [PUCE_ETAT_ENUM.REALISEE]: [OPERATION_ETATS_ENUM.REALISEE],
    [PUCE_ETAT_ENUM.ANNULEE]: [OPERATION_ETATS_ENUM.ANNULEE]
};

/** Puces actives : OU à l'intérieur d'un groupe, ET entre les groupes ; groupe vide = pas de filtrage */
export interface PucesFiltre {
    etats: PUCE_ETAT_ENUM[];
    sens: PUCE_SENS_ENUM[];
}

/** Filtre complet de la liste des opérations : recherche texte + puces */
export interface FiltreOperations extends PucesFiltre {
    texte: string | null;
}

export const FILTRE_OPERATIONS_VIDE: FiltreOperations = {texte: "", etats: [], sens: []};

/**
 * @param filtre filtre courant
 * @returns true si la recherche texte OU au moins une puce est active
 */
export function isFiltreActif(filtre: FiltreOperations): boolean {
    return (filtre.texte ?? "") !== "" || filtre.etats.length > 0 || filtre.sens.length > 0;
}

/**
 * Ajoute la valeur si absente, la retire si présente (puce combinable)
 */
export function togglePuce<T>(valeurs: T[], valeur: T): T[] {
    return valeurs.includes(valeur) ? valeurs.filter((v: T) => v !== valeur) : [...valeurs, valeur];
}

/**
 * @param operation opération
 * @param puces puces actives
 * @returns true si l'opération satisfait les puces (groupe vide = satisfait)
 */
export function matchesPuces(operation: OperationModel, puces: PucesFiltre): boolean {
    const matchEtat = puces.etats.length === 0
        || puces.etats.some((puce: PUCE_ETAT_ENUM) => ETATS_PAR_PUCE[puce].includes(operation.etat));
    const matchSens = puces.sens.length === 0
        || puces.sens.some((puce: PUCE_SENS_ENUM) =>
            puce === PUCE_SENS_ENUM.DEPENSES ? operation.valeur < 0 : operation.valeur > 0);
    return matchEtat && matchSens;
}
