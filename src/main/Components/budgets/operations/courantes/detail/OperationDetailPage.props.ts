import CategorieOperationModel from "../../../../../Models/budgets/CategorieOperation.model.ts";
import OperationEditionModel from "../../../../../Models/budgets/OperationEdition.model.ts";
import { OPERATION_EDITION_FORM, EditFormProps, ErrorsFormProps } from "./OperationDetailPage.constants.ts";
import { OPERATION_RECURRENTE_EDITION_FORM } from "../../recurrentes/details/OperationRecurrenteDetailPage.constants.ts";
import { OPERATION_ETATS_ENUM } from "../../../../../Utils/AppBusinessEnums.constants.ts";

/** Props communes aux sections de rendu de la page de détail d'une opération */
export interface OperationDetailSectionProps {
    editForm: EditFormProps
    errors: ErrorsFormProps
    editOperation: OperationEditionModel
    fillOperationForm: (field: OPERATION_EDITION_FORM | OPERATION_RECURRENTE_EDITION_FORM, value: string) => void
    isMobile: boolean
}

export interface OperationDetailCategoriesSectionProps extends OperationDetailSectionProps {
    listeCategories: CategorieOperationModel[]
}

export interface OperationDetailEtatSectionProps extends OperationDetailSectionProps {
    /** Etat affiché (celui de l'édition en création, sinon celui de l'opération du contexte) */
    etat: OPERATION_ETATS_ENUM
    /** Clé de remise à zéro des champs non contrôlés (change à chaque nouvelle sélection d'opération) */
    resetKey: number
}

export interface OperationDetailMensualiteSectionProps extends OperationDetailSectionProps {
    /** Clé de remise à zéro des champs non contrôlés (change à chaque nouvelle sélection d'opération) */
    resetKey: number
}
