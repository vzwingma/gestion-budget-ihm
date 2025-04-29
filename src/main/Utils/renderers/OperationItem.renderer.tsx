import {WatchLaterRounded} from "@mui/icons-material";
import {EN_RETARD, OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM} from "../AppBusinessEnums.constants";
import {Box, Tooltip} from "@mui/material";
import React, {JSX} from "react";
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

    if (operationLibelle !== null) {
        if (operationIsIntercompteFromLibelle(operationLibelle)) {
            return getOperationIntercompteLibelle(operationLibelle, listeComptes, maxVue)
        } else if (operationLibelle.startsWith(EN_RETARD)) {
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

    let operationLibelleParts = operationLibelle.split('-') ?? [];
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
export function getOperationIntercompteLibelle(operationLibelle: string, listeComptes: CompteBancaireModel[], maxVue: boolean): JSX.Element {
    return getOperationIntercompteLabel(operationLibelle, true, listeComptes, maxVue)
}


/**
 * Libellé d'une opération intercompte
 * @param operationLibelle : string : libellé
 * @param isLabelOperation : boolean : est-ce un label d'opération à afficher ? sinon c'est le libellé du compte
 * @param listeComptes : CompteBancaireModel[] liste des comptes
 * @param maxVue : boolean :vue max de l'icone
 */
function getOperationIntercompteLabel(operationLibelle: string, isLabelOperation: boolean, listeComptes: CompteBancaireModel[], maxVue: boolean): JSX.Element {
    const operationLibelleParts = INTERCOMPTE_LIBELLE_REGEX.exec(operationLibelle);
    if(operationLibelleParts == null) {
        return getOperationLibelleWithComment(operationLibelle);
    }
    else{
        const compte : CompteBancaireModel = (listeComptes.filter((compte) => compte.id === operationLibelleParts[2]))[0]
        if (compte?.libelle) {
            return getOperationIntercompteLibelleWithIconAndComment(operationLibelle, compte, operationLibelleParts, isLabelOperation, maxVue);
        } else {
            return getOperationLibelleWithComment(operationLibelle);
        }
    }
}

/**
 * Libellé d'une opération intercompte, avec icone et commentaire
 * @param operationLibelle libellé de l'opération
 * @param compte compte bancaire associé à l'opération d'intecompte
 * @param operationLibelleParts partie du libellé
 * @param isLabelOperation est ce un label d'opération
 * @param maxVue taille max de l'icone
 * @returns représentation graphique
 */
function getOperationIntercompteLibelleWithIconAndComment(operationLibelle: string, compte: CompteBancaireModel, operationLibelleParts: string[], isLabelOperation: boolean, maxVue: boolean): JSX.Element {
    const direction = operationLibelleParts[1]
    const label = direction + " " + compte.libelle;
    return <Tooltip title={"Transfert intercompte " + label}>
            <Box>
                {operationLibelle.startsWith(EN_RETARD) && isLabelOperation ?
                    <WatchLaterRounded sx={{color: "#A0A0A0"}}/> : <></>}

                <img src={"/img/banques/" + compte.itemIcon}
                    width={maxVue ? 40 : 30} height={maxVue ? 40 : 30}
                    alt={compte.libelle}
                    style={{marginRight: "5px", display: "inline", verticalAlign: "middle"}}/>
                {isLabelOperation ? getOperationLibelleWithComment(operationLibelleParts[3]) : label}
            </Box>
        </Tooltip>
}

/**
 * Libellé d'une opération intercompte
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @returns {JSX.Element}
 */
export function getOperationIntercompteCatLibelle(operationLibelle: string, listeComptes: CompteBancaireModel[]): JSX.Element {
    return getOperationIntercompteLabel(operationLibelle, false, listeComptes, false);
}


/**
 * Ajout de l'icone quand en retard
 * @param operationLibelle
 * @returns {JSX.Element}
 */
function getOperationEnRetardLibelle(operationLibelle: string): JSX.Element {
    return <><WatchLaterRounded
        sx={{color: "#A0A0A0"}}/>{getOperationLibelleWithComment(operationLibelle.replace(EN_RETARD, ""))}</>
}
