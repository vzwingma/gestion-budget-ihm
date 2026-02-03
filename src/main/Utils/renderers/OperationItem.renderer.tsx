import {OPERATION_ETATS_ENUM, PERIODES_MENSUALITE_ENUM, TYPES_CATEGORIES_OPERATION_ENUM} from "../AppBusinessEnums.constants.ts";
import {Box, Tooltip} from "@mui/material";
import React, {JSX} from "react";
import CompteBancaireModel from "../../Models/budgets/CompteBancaire.model.ts";
import {INTERCOMPTE_LIBELLE_REGEX, operationIsIntercompteFromLibelle} from "../OperationData.utils.ts";

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
            return {value: periodeKey, text: "Ponctuelle", color: "var(--color-periode-ponctuelle)"}
        case PERIODES_MENSUALITE_ENUM.MENSUELLE:
            return {value: periodeKey, text: "Mensuelle", color: "var(--color-periode-mensuelle)"}
        case PERIODES_MENSUALITE_ENUM.TRIMESTRIELLE:
            return {value: periodeKey, text: "Trimestrielle", color: "var(--color-periode-trimestrielle)"}
        case PERIODES_MENSUALITE_ENUM.SEMESTRIELLE:
            return {value: periodeKey, text: "Semestrielle", color: "var(--color-periode-semestrielle)"}
        case PERIODES_MENSUALITE_ENUM.ANNUELLE:
            return {value: periodeKey, text: "Annuelle", color: "var(--color-periode-annuelle)"}
        default:
            return {value: periodeKey, text: "N/D", color: "var(--color-periode-default)"}
    }
}


/**
 * Render du libellé de l'opération
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param {boolean} maxVue : boolean hauteur max de la vue
 * @param isMobile
 * @returns JSX.Element
 */
export function getOperationLibelle(operationLibelle: string, listeComptes: CompteBancaireModel[], maxVue: boolean, isMobile?: boolean): JSX.Element {

    if (operationLibelle !== null) {
        if (operationIsIntercompteFromLibelle(operationLibelle)) {
            return getOperationIntercompteLibelle(operationLibelle, listeComptes, maxVue, isMobile)
        } else {
            return getOperationLibelleWithComment(operationLibelle, isMobile);
        }

    }
    return <></>;
}


/** Libellé & Couleur du background de l'attribut Mensualité
 * @param periodeKey : string enum période
 * */
export function getTypeCategorieRenderer(typeCategorieKey : TYPES_CATEGORIES_OPERATION_ENUM) {

    switch (typeCategorieKey) {
        case TYPES_CATEGORIES_OPERATION_ENUM.ESSENTIEL:
            return {value: typeCategorieKey, text: "Essentiel", color: "var(--color-type-essentiel-primary)"}
        case TYPES_CATEGORIES_OPERATION_ENUM.REVENUS:
            return {value: typeCategorieKey, text: "Revenus", color: "var(--color-type-revenus-primary)"}
        case TYPES_CATEGORIES_OPERATION_ENUM.PLAISIR:
            return {value: typeCategorieKey, text: "Plaisir", color: "var(--color-type-plaisir-primary)"}
        case TYPES_CATEGORIES_OPERATION_ENUM.ECONOMIES:
            return {value: typeCategorieKey, text: "Economies", color: "var(--color-type-economies-primary)"}
        case TYPES_CATEGORIES_OPERATION_ENUM.IMPREVUS:
            return {value: typeCategorieKey, text: "Imprévus", color: "var(--color-type-imprevus-primary)"}
        case TYPES_CATEGORIES_OPERATION_ENUM.EXTRAS:
            return {value: typeCategorieKey, text: "Extras", color: "var(--color-type-extras-primary)"}
        default:
            return {value: typeCategorieKey, text: "N/D", color: "var(--color-periode-default)"}
    }
}

/**
 * Libellé d'une opération avec des commentaires (-)
 * @param {string} operationLibelle libellé des opérations
 * @param isMobile si on est en mode mobile
 * @returns {JSX.Element} élément graphique
 */
function getOperationLibelleWithComment(operationLibelle: string, isMobile?: boolean): JSX.Element {

    let operationLibelleParts = operationLibelle.split('-') ?? [];
    if (operationLibelleParts.length > 1) {
        let libelle = "-";
        for (let i = 1; i < operationLibelleParts.length; i++) {
            libelle += operationLibelleParts[i] + " ";
        }
        return <><span>{operationLibelleParts[0]}</span><span
            style={{color: "grey", fontSize: isMobile ? "small" : "medium", fontStyle: "italic"}}>{libelle}</span></>
    } else {
        return <span style={{fontSize: isMobile ? "small" : "medium"}}>{operationLibelle}</span>;
    }


}


/**
 * Libellé d'une opération intercompte
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param {boolean} maxVue  hauteur max de la vue
 * @param isMobile
 * @returns {*|JSX.Element}
 */
export function getOperationIntercompteLibelle(operationLibelle: string, listeComptes: CompteBancaireModel[], maxVue: boolean, isMobile ?: boolean): JSX.Element {
    return getOperationIntercompteLabel(operationLibelle, true, listeComptes, maxVue, isMobile)
}


/**
 * Libellé d'une opération intercompte
 * @param operationLibelle : string : libellé
 * @param isLabelOperation : boolean : est-ce un label d'opération à afficher ? sinon c'est le libellé du compte
 * @param listeComptes : CompteBancaireModel[] liste des comptes
 * @param maxVue : boolean :vue max de l'icone
 * @param isMobile
 */
function getOperationIntercompteLabel(operationLibelle: string, isLabelOperation: boolean, listeComptes: CompteBancaireModel[], maxVue: boolean, isMobile?: boolean): JSX.Element {
    const operationLibelleParts = INTERCOMPTE_LIBELLE_REGEX.exec(operationLibelle);
    if(operationLibelleParts == null) {
        return getOperationLibelleWithComment(operationLibelle, isMobile);
    }
    else{
        const compte : CompteBancaireModel = listeComptes.find((compte) => compte.id === operationLibelleParts[2])
        if (compte?.libelle) {
            return getOperationIntercompteLibelleWithIconAndComment(compte, operationLibelleParts, isLabelOperation, maxVue, isMobile);
        } else {
            return getOperationLibelleWithComment(operationLibelle, isMobile);
        }
    }
}

/**
 * Libellé d'une opération intercompte, avec icone et commentaire
 * @param compte compte bancaire associé à l'opération d'intecompte
 * @param operationLibelleParts partie du libellé
 * @param isLabelOperation est ce un label d'opération
 * @param maxVue taille max de l'icone
 * @param isMobile
 * @returns représentation graphique
 */
function getOperationIntercompteLibelleWithIconAndComment(compte: CompteBancaireModel, operationLibelleParts: string[], isLabelOperation: boolean, maxVue: boolean, isMobile?: boolean): JSX.Element {
    const direction = operationLibelleParts[1]
    const label = direction + " " + compte.libelle;
    return <Tooltip title={"Transfert intercompte " + label}>
            <Box>
                <img src={"/img/banques/" + compte.itemIcon}
                    width={maxVue ? 40 : 30} height={maxVue ? 40 : 30}
                    alt={compte.libelle}
                    style={{marginRight: "5px", display: "inline", verticalAlign: "middle"}}/>

                {isLabelOperation ? getOperationLibelleWithComment(operationLibelleParts[3], isMobile) :
                    <span style={{fontSize: isMobile ? "small" : "medium"}}>{label}</span>}
            </Box>
        </Tooltip>
}

/**
 * Libellé d'une opération intercompte
 * @param {string} operationLibelle : string libellé
 * @param {CompteBancaireModel[]} listeComptes : array : liste des comptes
 * @param isMobile
 * @returns {JSX.Element}
 */
export function getOperationIntercompteCatLibelle(operationLibelle: string, listeComptes: CompteBancaireModel[], isMobile?: boolean): JSX.Element {
    return getOperationIntercompteLabel(operationLibelle, false, listeComptes, false, isMobile);
}