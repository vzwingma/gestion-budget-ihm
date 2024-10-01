import React from 'react'
import { MenuItem, TextField } from "@mui/material"
import { OPERATION_EDITION_FORM } from "../OperationDetailPage.constants"
import CompteBancaireModel from './../../../../../Models/CompteBancaire.model'
import { operationIsIntercompteFromLibelle } from '../../../../../Utils/OperationData.utils'
import { getOperationIntercompteCatLibelle } from '../../../../../Utils/renderers/OperationItem.renderer'

/**
 * Propriétés pour le composant OperationDetailIntercompte.
 *
 * @interface OperationDetailIntercompteProps
 * 
 * @property {string | null} intercompte - Le compte intercompte sélectionné ou null.
 * @property {CompteBancaireModel[]} listeAutresComptes - La liste des autres comptes bancaires disponibles.
 * @property {boolean} formIntercompteInEdition - Indique si le formulaire d'intercompte est en cours d'édition.
 * @property {string | null} errorIntercompte - Message d'erreur lié à l'intercompte ou null.
 * @property {(field: OPERATION_EDITION_FORM_IDS.INTERCOMPTES, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire d'opération avec les valeurs fournies.
 */
export interface OperationDetailIntercompteProps {
    intercompte: string | null
    listeAutresComptes: CompteBancaireModel[]
    formIntercompteInEdition: boolean
    errorIntercompte: string | null
    fillOperationForm: (field: OPERATION_EDITION_FORM.INTERCOMPTES, value: string) => void
}


/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @param {OperationDetailIntercompteProps} props - Les propriétés du composant.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailIntercompte: React.FC<OperationDetailIntercompteProps> = ({ intercompte, listeAutresComptes,
    formIntercompteInEdition,
    errorIntercompte,
    fillOperationForm
}: OperationDetailIntercompteProps): JSX.Element => {

    /**
     * Remplit le champ "intercompte" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillIntercompteForm(e: any) {
        fillOperationForm(OPERATION_EDITION_FORM.INTERCOMPTES, e.target.value)
    }


    function getLibelleIntercompte() : JSX.Element {
        if(intercompte != null && operationIsIntercompteFromLibelle(intercompte)) {

        return getOperationIntercompteCatLibelle(intercompte, listeAutresComptes, false)
        }
        else {
            return <></>
        }

    }


    return (
        formIntercompteInEdition ?
            <TextField
                id={OPERATION_EDITION_FORM.INTERCOMPTES + OPERATION_EDITION_FORM.INPUT}
                required select sx={{ width: "90%" }}
                value={intercompte}
                placeholder={"Sélectionnez un compte"}
                error={errorIntercompte != null}
                helperText={errorIntercompte}
                onChange={fillIntercompteForm}
                variant="standard">
                {listeAutresComptes
                    .map((compte) => (
                        <MenuItem key={compte.id} value={compte.id}>
                            <img src={"/img/banques/" + compte.itemIcon}
                                width={20} height={20}
                                alt={compte.libelle}
                                style={{ marginRight: "5px" }} />
                            {compte.libelle}
                        </MenuItem>
                    ))}
            </TextField> 
        : 
        getLibelleIntercompte()
    )
}