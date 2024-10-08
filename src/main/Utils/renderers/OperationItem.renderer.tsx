import {WatchLaterRounded} from "@mui/icons-material";
import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM} from "../AppBusinessEnums.constants";
import {Box, Tooltip} from "@mui/material";
import React from "react";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model";
import {INTERCOMPTE_LIBELLE_REGEX, operationIsIntercompteFromLibelle} from "../OperationData.utils";

/**
 * Couleur d'une opération selon son état
 * @param operationState état de l'opération
 * @returns {string} couleur
 */
export function getOperationStateColor(operationState : OPERATION_ETATS_ENUM) : string {
    if (operationState != null) {
        switch (operationState) {
            case OPERATION_ETATS_ENUM.REALISEE:
                return "#2e7d32"
            case OPERATION_ETATS_ENUM.PREVUE:
                return "#ed6c02"
            case OPERATION_ETATS_ENUM.ANNULEE:
                return "#ebebeb"
            case OPERATION_ETATS_ENUM.SUPPRIMEE:
                return "#ed1b24"
            case OPERATION_ETATS_ENUM.REPORTEE:
                return "#9c27b0"
            case OPERATION_ETATS_ENUM.PLANIFIEE:
                return "#0288d1"
            default:
                return "grey";
        }
    }
    return "grey";
}


/** Libellé & Couleur du background de l'attribut Mensualité
 * @param periodeKey : string enum période
 * */
export function getPeriodeRenderer(periodeKey : PERIODES_MENSUALITE_ENUM) {

    switch (periodeKey) {
        case PERIODES_MENSUALITE_ENUM.PONCTUELLE:
            return {value: periodeKey, text: "Ponctuelle", color: "#616161"}
        case PERIODES_MENSUALITE_ENUM.MENSUELLE:
            return {value: periodeKey, text: "Mensuelle", color: "#616161"}
        case PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE:
            return {value: periodeKey, text: "Trimestrielle", color: "#3498db"}
        case PERIODES_MENSUALITE_ENUM.SEMESTRIELLE:
            return {value: periodeKey, text: "Semestrielle", color: "#f1c40f"}
        case PERIODES_MENSUALITE_ENUM.ANNUELLE:
            return {value: periodeKey, text: "Annuelle", color: "#e74c3c"}
        default:
            return {value: periodeKey, text: "N/D", color: "#616161"}
    }
}


/**
 * Render du libellé de l'opération
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param {boolean} maxVue : boolean hauteur max de la vue
 * @returns JSX.Element
 */
export function getOperationLibelle(operationLibelle : string, listeComptes : CompteBancaireModel[], maxVue : boolean): JSX.Element {

    if (operationLibelle != null) {
        if (operationIsIntercompteFromLibelle(operationLibelle)) {
            return getOperationIntercompteLibelle(operationLibelle, listeComptes, maxVue)
        } else if (operationLibelle.startsWith("[En Retard]")) {
            return getOperationEnRetardLibelle(operationLibelle)
        } else {
            return getOperationLibelleWithComment(operationLibelle);
        }

    }
    return <></>;
}

/**
 * Libellé d'une opération avec des commentaires (-)
 * @param {string} operationLibelle libellé des opérations
 * @returns {JSX.Element} élément graphique
 */
function getOperationLibelleWithComment(operationLibelle: string): JSX.Element {

    let operationLibelleParts = operationLibelle.split('-');
    if (operationLibelleParts.length > 1) {
        let libelle = "-";
        for (let i = 1; i < operationLibelleParts.length; i++) {
            libelle += operationLibelleParts[i] + " ";
        }
        return <><span>{operationLibelleParts[0]}</span><span
            style={{color: "grey", fontSize: "medium", fontStyle: "italic"}}>{libelle}</span></>
    } else {
        return <span>{operationLibelle}</span>;
    }


}


/**
 * Libellé d'une opération intercompte
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param {boolean} maxVue  hauteur max de la vue
 * @returns {*|JSX.Element}
 */
export function getOperationIntercompteLibelle(operationLibelle : string, listeComptes : CompteBancaireModel[], maxVue : boolean) {
    const operationLibelleParts = INTERCOMPTE_LIBELLE_REGEX.exec(operationLibelle);
    if(operationLibelleParts == null) {
        return <>{operationLibelle}</>
    }
    else{
        const direction = operationLibelleParts[1] === "[vers " ? "vers" : "depuis"
        const compte = (listeComptes.filter((compte) => compte.id === operationLibelleParts[2]))[0]
        if (compte?.libelle) {
            return <Tooltip title={"Transfert intercompte " + direction + " " + compte.libelle}>
                <Box>
                    {operationLibelleParts[1].startsWith("[En Retard]") ?
                        <WatchLaterRounded sx={{color: "#A0A0A0"}}/> : <></>}

                    <img src={"/img/banques/" + compte.itemIcon}
                         width={maxVue ? 40 : 30} height={maxVue ? 40 : 30}
                         alt={compte.libelle}
                         style={{marginRight: "5px", display: "inline", verticalAlign: "middle"}}/>
                    {getOperationLibelleWithComment(operationLibelleParts[4])}

                </Box>
            </Tooltip>
        } else {
            return <>{operationLibelle}</>
        }
    }
}



/**
 * Libellé d'une opération intercompte
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param {boolean} maxVue  hauteur max de la vue
 * @returns {*|JSX.Element}
 */
export function getOperationIntercompteCatLibelle(operationLibelle : string, listeComptes : CompteBancaireModel[], maxVue : boolean) {
    const operationLibelleParts = INTERCOMPTE_LIBELLE_REGEX.exec(operationLibelle);
    if(operationLibelleParts == null) {
        return <>{operationLibelle}</>
    }
    else{
        const direction = operationLibelleParts[1] === "[vers " ? "vers" : "depuis"
        const compte = (listeComptes.filter((compte) => compte.id === operationLibelleParts[2]))[0]
        if (compte?.libelle) {
            const label =  direction + " " + compte.libelle;
            return <Tooltip title={"Transfert intercompte " + label}>
                <Box>
                    <img src={"/img/banques/" + compte.itemIcon}
                         width={maxVue ? 40 : 30} height={maxVue ? 40 : 30}
                         alt={compte.libelle}
                         style={{marginRight: "5px", display: "inline", verticalAlign: "middle"}}/>
                    {label}
                </Box>
            </Tooltip>
        } else {
            return <>{operationLibelle}</>
        }
    }

}


/**
 * Ajout de l'icone quand en retard
 * @param operationLibelle
 * @returns {JSX.Element}
 */
function getOperationEnRetardLibelle(operationLibelle : string) {
    return <><WatchLaterRounded
        sx={{color: "#A0A0A0"}}/>{getOperationLibelleWithComment(operationLibelle.replace("[En Retard]", ""))}</>
}
