import {WatchLaterRounded} from "@mui/icons-material";
import {OPERATION_ETATS_ENUM} from "../AppBusinessEnums.constants";
import {Tooltip} from "@mui/material";
import React from "react";

/**
 * Couleur d'une opération selon son état
 * @param operationState état de l'opération
 * @returns {string} couleur
 */
export function getOperationStateColor(operationState) {
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
export function getPeriodeRenderer(periodeKey) {

    switch (periodeKey) {
        case "PONCTUELLE":
            return {value: periodeKey, text: "Ponctuelle", color: "#616161"}
        case "MENSUELLE":
            return {value: periodeKey, text: "Mensuelle", color: "#616161"}
        case "TRIMESTRIELLE":
            return {value: periodeKey, text: "Trimestrielle", color: "#3498db"}
        case "SEMESTRIELLE":
            return {value: periodeKey, text: "Semestrielle", color: "#f1c40f"}
        case "ANNUELLE":
            return {value: periodeKey, text: "Annuelle", color: "#e74c3c"}
        default:
            return {value: periodeKey, text: "N/D", color: "#616161"}
    }
}


/**
 * Render du libellé de l'opération
 * @param operationLibelle libellé de l'opération
 * @param listeComptes liste des comptes
 * @param maxVue vue élargie pour max
 * @returns {null}
 */
export function getOperationLibelle(operationLibelle, listeComptes, maxVue) {

    if (operationLibelle != null) {
        if ((operationLibelle.match("(.*\\[vers |.*\\[depuis )(.*)(\\])(.*)")) != null) {
            return getOperationIntercompteLibelle(operationLibelle, listeComptes, maxVue)
        } else if (operationLibelle.startsWith("[En Retard]")) {
            return getOperationEnRetardLibelle(operationLibelle)
        } else {
            return operationLibelle;
        }

    }
    return null;
}

/**
 * Libellé d'une opération intercompte
 * @param operationLibelle : string libellé
 * @param listeComptes : array : liste des comptes
 * @param maxVue : number hauteur max de la vue
 * @returns {*|JSX.Element}
 */
function getOperationIntercompteLibelle(operationLibelle, listeComptes, maxVue) {
    const operationLibelleParts = (operationLibelle.match("(.*\\[vers |.*\\[depuis )(.*)(\\])(.*)"));
    const direction = operationLibelleParts[1] === "[vers " ? "vers" : "depuis"
    const compte = (listeComptes.filter((compte) => compte.libelle === operationLibelleParts[2]))
    if (compte[0]?.libelle) {
        return <Tooltip title={"Transfert intercompte " + direction + " " + compte[0].libelle}>
            {operationLibelleParts[1].startsWith("[En Retard]") ?
                <WatchLaterRounded sx={{color: "#A0A0A0"}}/> : <></>}
            <img src={"/img/banques/" + compte[0].icon}
                 width={maxVue ? 30 : 20} height={maxVue ? 30 : 20}
                 alt={compte[0].libelle}
                 style={{marginRight: "5px"}}/>
            <span>{operationLibelleParts[4]}</span>
        </Tooltip>
    } else {
        return operationLibelle
    }
}

/**
 * Ajout de l'icone quand en retard
 * @param operationLibelle
 * @returns {JSX.Element}
 */
function getOperationEnRetardLibelle(operationLibelle) {
    return <><WatchLaterRounded sx={{color: "#A0A0A0"}}/>{operationLibelle.replaceAll("[En Retard]", "")}</>
}
