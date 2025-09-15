import React, {JSX} from 'react'
import {MenuItem, TextField, useMediaQuery, useTheme} from "@mui/material"
import {OPERATION_EDITION_FORM} from "../OperationDetailPage.constants.ts"
import {operationIsIntercompteFromLibelle} from '../../../../../Utils/OperationData.utils.ts'
import {getOperationIntercompteCatLibelle} from '../../../../../Utils/renderers/OperationItem.renderer.tsx'
import {OperationDetailIntercompteProps} from '../../../../Components.props.tsx'

/**
 * Composant React pour afficher et éditer les détails d'une opération budgétaire.
 *
 * @component
 * @property {string | null} intercompte - Le compte intercompte sélectionné ou null.
 * @property {CompteBancaireModel[]} listeAutresComptes - La liste des autres comptes bancaires disponibles.
 * @property {boolean} formIntercompteInEdition - Indique si le formulaire d'intercompte est en cours d'édition.
 * @property {string | null} errorIntercompte - Message d'erreur lié à l'intercompte ou null.
 * @property {(field: INTERCOMPTES, value: string) => void} fillOperationForm - Fonction pour remplir le formulaire d'opération avec les valeurs fournies.
 * @returns {JSX.Element} Élément JSX représentant le composant.
 */
export const OperationDetailIntercompte: React.FC<OperationDetailIntercompteProps> = ({
                                                                                          intercompte,
                                                                                          libelle,
                                                                                          listeAutresComptes,
    formIntercompteInEdition,
    errorIntercompte,
    fillOperationForm
}: OperationDetailIntercompteProps): JSX.Element => {

    const isMobile = useMediaQuery(useTheme().breakpoints.down('lg'));
    /**
     * Remplit le champ "intercompte" de l'état à partir de la saisie de l'utilisateur
     * @param {Event} e - L'événement de saisie
     */
    function fillIntercompteForm(e: any) {
        fillOperationForm(OPERATION_EDITION_FORM.INTERCOMPTES, e.target.value)
    }


    /**
     * @returns {JSX.Element} Affichage de l'intercompte en lecture seule
     */
    function getAffichageIntercompteRO(libelle: string): JSX.Element {
        if (libelle != null && operationIsIntercompteFromLibelle(libelle)) {
            return getOperationIntercompteCatLibelle(libelle, listeAutresComptes, isMobile)
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
                variant="standard" size={"small"}>
                {listeAutresComptes
                    .filter((compte) => compte.actif)
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
            getAffichageIntercompteRO(libelle)
    )
}
