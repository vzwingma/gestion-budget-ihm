import { OPERATION_EDITION_FORM } from "../courantes/detail/OperationDetailPage.constants.ts";
import { OPERATION_RECURRENTE_EDITION_FORM } from "../recurrentes/details/OperationRecurrenteDetailPage.constants.ts";

export interface OperationDetailDateProps {
    formDateInEdition: boolean
    errorDateOperation: string | null
    fillOperationForm: (field: OPERATION_RECURRENTE_EDITION_FORM | OPERATION_EDITION_FORM, value: string) => void
}
