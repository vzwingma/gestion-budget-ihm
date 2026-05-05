import React, { JSX } from "react";
import { MenuItem, TextField } from "@mui/material";
import {
    ErrorsFormProps,
    OPERATION_EDITION_FORM,
} from "../OperationDetailPage.constants.ts";
import { operationIsIntercompteFromLibelle } from "../../../../../../Utils/OperationData.utils.ts";
import { getOperationIntercompteCatLibelle } from "../../../../../../Utils/renderers/OperationItem.renderer.tsx";
import { OperationDetailIntercompteProps } from "../../../../../Components.props.ts";
import CompteBancaireModel from "../../../../../../Models/budgets/CompteBancaire.model.ts";
import OperationEditionModel from "../../../../../../Models/budgets/OperationEdition.model.ts";
import OperationModel from "../../../../../../Models/budgets/Operation.model.ts";
import { BUSINESS_GUID } from "../../../../../../Utils/AppBusinessEnums.constants.ts";
import { useAuth } from "react-oidc-context";

/**
 * @returns {JSX.Element} Affichage de l'intercompte en lecture seule
 */
export function getAffichageIntercompteRO(
    libelle: string,
    listeAutresComptes: CompteBancaireModel[],
    isMobile: boolean,
): JSX.Element {
    if (libelle != null && operationIsIntercompteFromLibelle(libelle)) {
        return getOperationIntercompteCatLibelle(
            libelle,
            listeAutresComptes,
            isMobile,
        );
    } else {
        return <></>;
    }
}
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
export const OperationDetailIntercompte: React.FC<
    OperationDetailIntercompteProps
> = ({
    intercompte,
    listeAutresComptes,
    errorIntercompte,
    fillOperationForm,
}: OperationDetailIntercompteProps): JSX.Element => {
        const auth = useAuth();
        /**
         * Remplit le champ "intercompte" de l'état à partir de la saisie de l'utilisateur
         * @param {Event} e - L'événement de saisie
         */
        function fillIntercompteForm(e: any) {
            fillOperationForm(OPERATION_EDITION_FORM.INTERCOMPTES, e.target.value);
        }

        function getLibelleIntercompte(compte: CompteBancaireModel): string {
            const owner =
                compte.proprietaires[0]?.login.split(".")[0].charAt(0).toUpperCase() +
                compte.proprietaires[0]?.login.split(".")[0].slice(1) || "";
            const libelleOwner = String(auth?.user?.profile.email)
              .toLocaleLowerCase()
              .startsWith(owner.toLocaleLowerCase())
              ? ""
              : owner + " | ";
            return libelleOwner + compte.libelle;
        }

        return (
            <TextField
                id={OPERATION_EDITION_FORM.INTERCOMPTES + OPERATION_EDITION_FORM.INPUT}
                required
                select
                sx={{ width: "100%" }}
                value={intercompte}
                placeholder={"Sélectionnez un compte"}
                error={errorIntercompte != null}
                helperText={errorIntercompte}
                onChange={fillIntercompteForm}
                variant="standard"
                size={"small"}
            >
                {listeAutresComptes
                    .filter((compte) => compte.actif)
                    .map((compte) => (
                        <MenuItem key={compte.id} value={compte.id}>
                            <img
                                src={"/img/banques/" + compte.itemIcon}
                                width={20}
                                height={20}
                                alt={compte.libelle}
                                style={{ marginRight: "5px" }}
                            />
                            {getLibelleIntercompte(compte)}
                        </MenuItem>
                    ))}
            </TextField>
        );
    };

/**
 * validation du formulaire - Transfert intercomptes
 */
export function validateFormTransfertIntercompte(
    editOperation: OperationEditionModel,
    intercompte: string | null,
    operation: OperationModel,
    errors: ErrorsFormProps,
) {
    if (
        editOperation.ssCategorie.id === BUSINESS_GUID.SS_CAT_VIREMENT_INTERNE &&
        intercompte === null
    ) {
        errors.intercompte = "Le champ Intercompte est obligatoire";
    } else {
        operation.intercompte = intercompte;
        errors.intercompte = null;
    }
}
